# watch侦听器

依旧从一个最简单的例子开始

```html
<div id="app">
  {{a}}
</div>
<script>
  let vm = new Vue({
    el: '#app',
    data: {
      a: 1,
      b: 2,
      d: 3
    },
    watch: {
      a: function (val, oldval) {
        console.log('new: %s, old: %s', val, oldval)
      },
      // 对象形式
      b: {
        handler: function (val, oldval) {
          console.log('new: %s, old: %s', val, oldval)
        },
        deep: true
      },
      d: {
        handler: 'someMethod',
        immediate: true
      },
      e: [
        function handle2() {},
        function handle3() {},
        function handle4() {},
      ]
    },
    methods: {
      someMethod(val, oldval) {
        console.log('new: %s, old: %s', val, oldval)
      }
    }
  })
  </script>
```

可以看到，`watch`的书写形式很多，在官方文档`api`中还有更多的书写形式。[点击进入查看](https://cn.vuejs.org/v2/api/#watch)。有这么多形式，在`vue`处理的时候
肯定不会一个个去单独处理，需要统一成一种格式，方便之后处理。这就是合并策略的作用。


在`_init`方法中，有这么一段代码，这块的主要功能是**通过策略模式将用户书写的各个属性`props、data、methods、watch、computed`等序列化成`vue`需要的格式**
因此我们直接在这里打个断点，看`vm.options`的生成格式就成。

```js
// 合并选项并赋值给 $options
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  // 用户传进来的options 或者为空
  options || {},
  vm
)
```
可以看到，本身还是对象形式，对应三种格式，后面的代码都是以这三种格式来解析的
```js
{
  watch:{
    a: ƒ (val, oldval)
    b: {deep: true, handler: ƒ}
    d: {handler: 'someMethod', immediate: true}
    e: (3) [ƒ, ƒ, ƒ] 
  }
}
```

## initWatch

在`initState`方法中，我们可以看到拿的就是`vm.$options`的数据，并且还有一个判断`opts.watch !== nativeWatch`。这是因为在`firefox`中，
`Object`有一个`watch`方法，所以需要做一个判断。

```js
// instance/state.js 
export function initState (vm: Component) {
  //这个数组将用来存储所有该组件实例的 watcher 对象
  vm._watchers = []
  const opts = vm.$options
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

然后我们进去`initWatch`看看，很简单就是拿到`key`和`value`， 并传给了`createWatcher`方法，只是对不同格式做了一次处理。
而在`createWatcher`方法中，对对象类型的`handle`和字符串类型的`handle`分别做了处理。可以看到，字符串类型的`handle`值是从
`vm`上获得的，那么其实就能猜到`methods`方法除了在`options`有定义，实例上也有。

**注意：**

最后`vue`调用了`vm.$watch`，所以不管是函数形式的`watch`还是对象形式，最后都会调用`$watch`，这才是`watch`执行的开始

```js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    // 如果是数组，做循环调用
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```

## vm.$watch

这里我们一行行代码看，第一个判断主要是当我们使用`$watch`去创建监听函数的时候，需要对`cb`进行重新调整。
比如`cb`可以是这种形式`{handle:function(){}, deep:true}`，这时候传入的`options`会被覆盖。这里可以写个
例子测试一下，比如`this.$watch('e', {handle:function(){}, deep:true}, {immediate: true})`，
可以单步调试看看，后面的`options`字段将被覆盖。

之后两行代码是核心，`vue`给`options`添加了一个`user`属性，并且赋值为`true`。之后`new Watcher`创建构造函数。
可以发现这是第三种`Watcher`，我们将它命名为**用户`Watcher`**。

```js
Vue.prototype.$watch = function (
  expOrFn: string | Function,
  cb: any,
  options?: Object
): Function {
  // 当前组件实例对象
  const vm: Component = this
  // 检测第二个参数是否是纯对象
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options)
  }
  options = options || {}
  // 表示为用户创建
  options.user = true
  // 创建watcher对象
  const watcher = new Watcher(vm, expOrFn, cb, options)
  ...
}
```
好接下来，看`new Watcher`，因为这段代码已经贴过好几回了，这里捡之前没讲过的，`options`这一块等到一个单独的章节一起讲。
先来看 求值表达式`expOrFn`，和其他不同，用户`watcher`支持使用字符串，所以这块可能走`parsePath`方法，这个方法返回了一个
`expOrFn`经过处理的函数，并且能传入`obj`，和之前写的简易响应式很像，如果`obj`传入的是`this`，那么我们调用的就是`this[a]`，
第二次就是`this[a][b]`

```js
export default class Watcher {
  constructor (
    vm: Component,
    // 求值表达式
    expOrFn: string | Function,
    // 回调
    cb: Function,
    // 选项
    options?: ?Object,
    // 是否是渲染watcher
    isRenderWatcher?: boolean
  ) {
    // options
    ...
    this.cb = cb // 回调
    this.id = ++uid // uid for batching 唯一标识
    this.active = true // 激活对象
  
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // 处理表达式 obj.a
      this.getter = parsePath(expOrFn)
    }
    // 当时计算属性 构造函数是不求值的
    this.value = this.lazy
      ? undefined
      : this.get()
  }
}
// core/util/lang.js
export function parsePath (path: string): any {
  const segments = path.split('.')
  // 返回的还是函数， 会出现obj[a][b]
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```

这样一个普通的不传入任何`options`的`watch`就会正常的执行到`this.get`方法。`pushTarget`方法已经讲过好几次了，
功能就两个

1. 将`Dep.target`赋值为当前`Watcher`
2. 将当前`Watcher`放到`targetStack`数组中

然后来看这段代码`this.getter.call(vm, vm)`，在看`parsePath`的返回赋值给了`this.getter`，所以其实我们执行的是
`parsePath`返回的函数，并且正好我们传入了`vm`，这就和我上面说的一样了。单步执行，就会触发`this.a`，也就是`this._data.a`
触发`data`里`a`的拦截器。

```js
get () {
  pushTarget(this)
  let value
  const vm = this.vm
  try {
    value = this.getter.call(vm, vm)
  } catch (e) {
    ...
  } finally {
    // 清除当前 target
    popTarget()
    // 清空依赖
    this.cleanupDeps()
  }
  return value
}
```
后面的和`computed`一样，会将当前用户`watcher`存到对应`a`的`dep.subs`中。流程不细说了，建议自己`debug`一下。走完就会正常的，回到`get`方法
走下面的清理流程。这样就结束初始化了吗？没有，我们还要回到`$watch`方法。中间步骤先不说，刚刚我们只是执行了`new Watcher`。之后我们还会走下面的流程，
并且返回了一个`unwatchFn`。这个方法，可以执行`teardown`

```js
Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    ...
    const watcher = new Watcher(vm, expOrFn, cb, options)
    ...
    // 返回一个解除函数
    return function unwatchFn () {
      watcher.teardown()
    }
  }

```
那么这样 初始化就完成了。下面开始执行例子。

## 触发watch

这里我们把例子改一下，用最简单的例子做测试。

```html
<div id="app">
</div>
<script>
 let vm = new Vue({
   el: '#app',
   data: {
     a: 1,
   },
   watch: {
     a: function (val, oldval) {
       console.log('new: %s, old: %s', val, oldval)
     },
   }
 })
</script>
```

这里我们做一个不一样的操作，将`template`里面的`{{a}}`去掉，这时候我们看看`vm._render`生成的匿名函数
```js
(function anonymous(
) {
with(this){return _c('div',{attrs:{"id":"app"}})}
})
```
没有`a`，那么就不会调用`a`的`get`。这样就不会收集`a`的渲染`watcher`。因此`a`上只有一个用户`watcher`。
这时候我们再触发`a`的`set`。在`console`中执行`vm.a = 6`。在`set`处断点，单步执行可以看到，执行流程是
`dep.notify-->subs[i].update-->queueWatcher(this)-->nextTick(flushSchedulerQueue)`走到了`nextTick`，
将当前用户`Watcher`放到了队列中，该队列会在`flushSchedulerQueue`中执行。

之后执行到`flushSchedulerQueue`的时候，就会将队列中的`watcher`拿出来顺序执行，也就是执行`watcher.run`方法。

```js
run () {
 // 观察者是否处于激活状态
 if (this.active) {
   // 重新求值
   const value = this.get()
   // 在渲染函数中 这里永远不会被执行，因为 两次值都是 undefiend
   if (
     value !== this.value ||
     // 这里当值相等，可能是对象引用，值改变 引用还是同一个，所以判断是否是对象，
     // 是的话也执行
     isObject(value) ||
     this.deep
   ) {
     // 保存旧值， set 新值
     const oldValue = this.value
     this.value = value
     // 观察者是开发者定义 即 watch  $watch
     if (this.user) {
       const info = `callback for watcher "${this.expression}"`
       invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)
     } else {
       this.cb.call(this.vm, value, oldValue)
     }
   }
 }
}
```
这个方法要详细说说，首先会进行一次求值，这里主要是为了拿到新值，后面的依赖因为已经存在，会被重复的判断跳过。
这时候会新旧值同时缓存，然后当前我们的`user=true`，所以就会执行`invokeWithErrorHandling`。这方法就是执行
我们定义的`handle`，不过因为是用户定义，所以需要`try catch`。这样一次完整的`watcher`就执行完了。

```js
export function invokeWithErrorHandling (
  handler: Function,
  context: any,
  args: null | any[],
  vm: any,
  info: string
) {
  let res
  try {
    res = args ? handler.apply(context, args) : handler.call(context)
  } catch (e) {
    handleError(e, vm, info)
  }
  return res
}
```

## options 各个参数在vue中的执行过程

这样基础的`watch`就解析完了，现在我们看看每一种`options`，在`vue`中的执行过程。也就是`new Watcher`时候，构造函数内的这段代码

```js
if (options) {
  this.deep = !!options.deep // 是否使用深度观测
  this.user = !!options.user // 用来标识当前观察者实例对象是 开发者定义的 还是 内部定义的
  this.lazy = !!options.lazy // 惰性watcher  第一次不请求
  this.sync = !!options.sync // 当数据变化的时候是否同步求值并执行回调
  this.before = options.before // 在触发更新之前的 调用回调
}
```

### immediate

同样使用最初的例子，我们加上`options`。

```html
<div id="app">
</div>
<script>
 let vm = new Vue({
   el: '#app',
   data: {
     a: 1,
   },
   watch: {
     a: {
       handler: function (val, oldval) {
         console.log('new: %s, old: %s', val, oldval)
       },
       immediate: true
     },
   }
 })
</script>
```
然后看源码，很简单在初始化过程中，`new Watcher`结束后，马上执行了一次`invokeWithErrorHandling`，
也就是执行了自定义的函数回调，并且传入的值就是当前`new Watcher`通过计算拿到的值。

```js
Vue.prototype.$watch = function (
 expOrFn: string | Function,
 cb: any,
 options?: Object
): Function {
 // 立即执行
 if (options.immediate) {
   const info = `callback for immediate watcher "${watcher.expression}"`
   pushTarget()
   // 获取观察者实例对象，执行了 this.get
   invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
   popTarget()
 }
 
}
```

### lazy

`computed`的本质就是`lazy watcher`。并且`vue`为我们实现了值的缓存。所以一般我们不会再`watch`中传入`lazy`


### sync

设置这个值，顾名思义，就是同步，看这段代码, 在`Watcher`类的`update`方法中，也就是在我们触发拦截器`set`的时候，通过`dep.notify`
到循环执行`watcher`的`update`方法，这里如果`sync=true`，就不会将当前`watcher`放到微任务队列中，而是直接执行。

```js
update () {
 /* istanbul ignore else */
 // 计算属性值是不参与更新的
 if (this.lazy) {
   this.dirty = true
   // 是否同步更新变化
 } else if (this.sync) {
   this.run()
 } else {
   // 将当前观察者对象放到一个异步更新队列
   queueWatcher(this)
 }
}
```

### deep

修改例子

```html
<div id="app">
</div>
<script>
 let vm = new Vue({
   el: '#app',
   data: {
     b: {
       c: 2,
       d: 3
     }
   },
   watch: {
     b: {
       handler: function(val, oldval) {
         console.log(`new: ${JSON.stringify(val)}, old: ${JSON.stringify(oldval)}`)
       },
       deep: true
     }
   }
 })
</script>
```
`deep`表示深层监听，那么思考一下，`vue`会在哪里触发深层对象的拦截器？一般来说是在表层的`a`经过`get`的拦截器触发，存放
`watcher`之后，那么显而易见了。查看`watcher`类里的`get`方法，也就是调用求值表达式的地方

```js
get () {
 // 给Dep.target 赋值 Watcher
 pushTarget(this)
 let value
 const vm = this.vm
 try {
   value = this.getter.call(vm, vm)
 } catch (e) {
   ...
 } finally {
   if (this.deep) {
     traverse(value)
   }
   // 清除当前 target
   popTarget()
   // 清空依赖
   this.cleanupDeps()
 }
 return value
}
```
在清除依赖之前，`vue`判断了`deep`，然后调用了`traverse`方法。

这里的代码比较难以理解，我们从最初开始，首先在第一次触发求值表达式的时候，触发的`b`的`get`，这时候会先把用户`watcher`放到
`defineReactive`定义的关于`b`的闭包`dep`里。我们这么表示，同级还有一个 `new Observer`创建的`__ob__`

```js
{
  b(-->闭包dep{subs:[Watcher], id:3}):{
    c: 2,
    d: 3,
    __ob__: {
      value: {},
      id: 4,
      subs: []
    }
  }
  __ob__: {
    value: {},
    id: 2,
    subs: []
  }
}
```
这里回忆一下`data`嵌套对象的初始化，并且再来看一下源码，`childOb`是有值的，初始化后被闭包保存着，而且值就是`b`的对象，
而且`value`也是它。既然它有值，那么就会进入`childOb.dep.depend()`方法，这时候我们就在`__ob__`中存了一个`watcher`。
```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 依赖框
  const dep = new Dep()
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    get: function reactiveGetter () {
      // 如果存在自定义getter 执行自定义的
      const value = getter ? getter.call(obj) : val
      // 要被收集的依赖
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return value
    },
  })
}
```
也就是说这样，还有一点要注意，这时候`watcher`的`newDepIds`有两个值`[3, 4]`
```js
{
  b(-->闭包dep{subs:[Watcher], id:3}):{
    c: 2,
    d: 3,
    __ob__: {
      value: {},
      dep: {
        id: 4,
        subs: [
         Watcher // 通过childOb存的用户watcher
        ]
      },
      vmCount:0
    }
  }
  __ob__: {
    value: {},
    dep: {
      id: 2,
      subs: []
    },
    vmCount: 1
  }
}
```
之后`b`的拦截器就结束了，这时候进入`traverse`方法。首先查看`val`的值，它是通过上一次的计算拿到的，也就是`b`的值是对象。
```js
const seenObjects = new Set()

export function traverse (val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  // 检查 val是不是数组
  // * val 为 被观察属性的值
  const isA = Array.isArray(val)
  // * 解决循环引用导致死循环的问题
  // 拿到 Dep中的唯一值 进行已响应式对象去除
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  // val[i] 和 val[key[i]] 都是在求值，这将触发紫属性的get拦截器
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```
中间这块`__ob__`的判断就不讲了，注释上写的很明白，其实就是当我们存在互相引用的时候，如果有`__ob__`就退出。以免死循环。
这里直接进入这行`while (i--) _traverse(val[keys[i]], seen)`代码，`val[keys[i]]`明显会触发`d`的拦截器，这时候就会
给`d`的`dep`添加`watcher`，同理`c`也是，这样初始化就完成了。

```js
{
 c(-->闭包dep{subs:[watcher], id:5}): 2,
 d(-->闭包dep{subs:[watcher], id:6}): 3,
 __ob__: {
   value: {},
   dep: {
     id: 4,
     subs: [
      Watcher // 通过childOb存的用户watcher
     ]
   },
   vmCount:0
 }
}
```
因为在相关属性上的`dep`都保存了用户`watcher`所以，我们设置多种属性都能触发`watcher`，尝试下面代码

```js
vm.b.c = 7
// new: {"c":7,"d":3}, old: {"c":7,"d":3}
vm.b.d = 8
// new: {"c":7,"d":8}, old: {"c":7,"d":8}
vm.b = 6
// new: 6, old: {"c":7,"d":8}
vm.$set(vm.b, 'e', 6)
// new: {"c":2,"d":3,"e":6}, old: {"c":2,"d":3,"e":6}
```
因为`vue`在`b`对象上的`__ob__`属性内`dep`保存了用户`watcher`，所以对`b`的操作也是生效的，除非我们真要这么做，
深度观测上这样其实还是蛮消耗性能的，如果层级再多一点。我们有更好的处理方式。

观察`parsePath`方法，有这么一段代码`path.split('.')`，所以如果我们想观测深层，例如想观测`c`可以这么写

```html
<div id="app">
</div>
<script>
 let vm = new Vue({
   el: '#app',
   data: {
     b: {
       c: 2,
       d: 3
     }
   },
   watch: {
     'b.c': {
       handler: function(val, oldval) {
         console.log('new: %s, old: %s', val, oldval)
       },
     }
   }
 })
</script>
```
这样我们只对`b`、`b`下的属性`__ob__`、`c`保存了`watcher`。如果`b`内属性很多，相当于少了`n-1/n`。很大的优化了。

### before

这不是一个官方文档中使用的属性，但也是可以使用的，如下

```html
<div id="app">
</div>
<script>
 let vm = new Vue({
   el: '#app',
   data: {
     a: 1
   },
   watch: {
     a: {
       handler: function (val, oldval) {
         // console.log(`new: ${JSON.stringify(val)}, old: ${JSON.stringify(oldval)}`)
         console.log('new: %s, old: %s', val, oldval)
       },
       before: function () {
         console.log('调用了before')
       }
     }
   }
 })
</script>
```
在源码中，它在`watcher.run()`之前运行，而在我们使用渲染`watcher`的时候，他被用作于触发`beforeUpdate`。
而上面的例子，很显然也会在`handler`之前运行
```js
if (watcher.before) {
   watcher.before()
}
id = watcher.id
has[id] = null
watcher.run()
```

## 函数调用的形式

使用`$watch`并没有什么不同，但是它有声明式不具备的功能，想想`computed`，它在`new Watcher`的时候求值表达式一直是函数。那么显然
`watch`也应该支持传入函数，这就是`$watch`的作用。例如下面的例子

```html
<div id="app">
</div>
<script>
 let vm = new Vue({
   el: '#app',
   data: {
     a: 1,
     b: 2
   },
   mounted() {
     this.$watch(() => ([this.a, this.b]), (val, oldval)=> {
       console.log(`new: ${val}, old: ${oldval}`)
     })
   }
 })
</script>
```
这是分别触发`a`或者`b`都会触发监听回调。至于原理显然是`a`和`b`的`dep`里都保存了该用户`watcher`。
```js
vm.a = 7
// 24 new: 7,2, old: 1,2
vm.b = 5
// new: 7,5, old: 7,2
```
# 结尾and碎碎念

这样`watch`也算解析完毕了，这几天的文章写下来，对于我个人来说帮助非常大，基本相关代码都逐行去调试了。
如果有人也有这想法，建议在无痕模式下，并且多`f5`刷新几次清除缓存的影响。

其实每天文章量还蛮大的，但是当初的想法就是一个相关属性一篇解析，如果分开就不完整。
