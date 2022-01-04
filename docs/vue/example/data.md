# data的响应式处理

我们先来实现一个最简单的响应式对象，看看他应该具备什么功能

1. 存在一个`dep`用来在触发`get`的时候收集依赖，在`set`的时候执行依赖
2. 存在一个全局的`target`用来缓存依赖
3. 通过递归对深层函数进行处理


```js
const data = {
  a: 1,
  b: {
    c: 2
  }
}

function walk (data) {
  for (const key in data) {
    let dep = []
    let val = data[key]
    let nativeString = Object.prototype.toString.call(val)
    if (nativeString === '[object Object]') {
      walk(val)
    }
    Object.defineProperty(data, key, {
      get () {
        dep.push(target)
        return val
      },
      set (newval) {
        if (val === newval) return
        val = newval
        dep.forEach(fn => fn())
      }
    })
  }
}

walk(data)

let target = null

function $watch (exp, fn) {
  target = fn
  let patharr,
    obj = data
  if (typeof exp === 'function') {
    exp()
    return
  }
  if (/\./.test(exp)) {
    patharr = exp.split('.')
    patharr.forEach(p => {
      obj = obj[p]
    })
    return
  }
  data[exp]
}

function render () {
  return document.write(`${data.a} 和 ${data.b.c}`)
}

$watch('b.c', () => {
  console.log(`b.c变动了`)
})
$watch(render, render)
```
既然明白了最简单响应式对象的构成，那么就从一个最简单的对象例子开始

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="../../dist/vue.js"></script>
</head>

<body>
  <div id="app">
    {{a}}
  </div>
  <script>
    let vm = new Vue({
      el: '#app',
      data: {
        a: 1,
      },
    })
  </script>
</body>

</html>
```

## 初始化 data

和 `computed`一样， `data`的初始化也在`initState`。但是不同的是，如果不存在`data`则会对空对象进行拦截，这是一个友好的优化，如果用户未定义`data`，又使用了`a`，就可以报出`vue`定义好的错误。

```js
export function initState (vm: Component) {
  //这个数组将用来存储所有该组件实例的 watcher 对象
  vm._watchers = []
  const opts = vm.$options
  ...
  if (opts.data) {
    initData(vm)
  } else {
    // 不存在则观测空对象
    observe(vm._data = {}, true /* asRootData */)
  }
  ...
}
```

接下来直接看数据存在的情况，观察一下代码，在`initData`中，也主要做了三件事

1. 通过`getData`拿到最终对象
2. 对每一个`key`进行代理
3. 调用`observe`

```js{7-9,35,39}
function initData (vm: Component) {
  // 获得options里的data对象 注意这个data对象是function
  // 但是在init之前，我们调用了用户传入的 initcreate
  // 这时候是可以修改data的，所以还是要判断
  // 如果是函数 就 getdata
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    // 你定义在 methods 对象中的函数名称已经被作为 data 对象中某个数据字段的 key 了，你应该换一个函数名字
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    //props优先级 > methods优先级 > data优先级
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
      // 判断一个字符串的第一个字符是不是 $ 或 _ 来决定其是否是保留的
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```
这里我们要注意一下`vm.$options`的返回。它和初始化过程中的合并策略相关，但是现在我们只要断点在这里，然后看`vm.$options`返回什么就好。它返回一个函数，因此我们要执行以下，拿到对象

```js
data: mergedInstanceDataFn()
```

但是我们发现，在使用`getData`进行数据获取的时候，仍旧进行了一次判断，这是因为，我们可能会在`beforeCreate`中修改`vm.$options.data`。所以才加了一层判断。

`getData`很简单，就是运行上面的函数，拿到最终的对象。

第二步主要是给当前实例做了一层代理，可以让我们使用`this.xx`。比如上面的例子就是当我们使用`this.a`的时候，就是触发了`this._data.a`，又因为`data`和`_data`指向同一个地址，所以就能触发`data`的拦截器

关于第二个参数，其实和`2.6`新增的`api` `observable`有关，当使用它的时候，不会传入第二个参数

## 执行 observe

看下面代码，`observe`其实主要也就两件事情

1. 判断 `value` 存不存在`__ob__`属性，如果存在直接返回
2. 判断当前`value`是否符合，然后`new Observer`


```js{9,21}
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // 如果观测对象不是 对象或者 vNode 直接return
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // value自身是否有 __ob__ 并且 是 Observer 则已经是响应式数据
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    // 判断开关
    shouldObserve &&
    // 是否是服务端判断
    !isServerRendering() &&
    // 对象必须可扩展，一下几个方法会变为不可扩展 Object.freeze()  Object.preventExtensions() Object.seal()
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    // 避免对vue实例对象进行观测
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```
那为什么要做第一步？这是用来避免重复观测一个数据对象，比如错误的递归调用。

## new Observer

该方法，也是主要做了两件事情

1. 对`value`添加了一个不可枚举的`__ob__`属性，值为`Observer`本身

根据例子，`value`变成这样。
```js
{
  a: 1,
  __ob__: Observer {
    dep: Dep {id: 2, subs: []},
    value: {},
    vmCount: 0
  }
}
```
2. 判断是数组还是对象，分别做响应式处理

```js{13,27}
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    // 实例化依赖框, 这个框不属于某个数据
    this.dep = new Dep()
    //依赖计数
    this.vmCount = 0
    // 创建一个不可枚举的 __ob__ 对象，该对象是 Observer本身
    def(value, '__ob__', this)
    // 数组处理方式
    if (Array.isArray(value)) {
      // 判断当前环境是否可以使用 __proto__
      if (hasProto) {
        // 把数组实例与代理原型或与代理原型中定义的函数联系起来，从而拦截数组变异方法
        // 设置value.__proto__ 为 arrayMethods
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      // 对象处理方式
      this.walk(value)
    }
  }
}
```

## 对象的响应式声明

观察以下代码，我们先不看`get`和`set`的内容，也不去详细了解一些判断，也是主要做了两件事情
`walk`循环`obj`中的属性，并调用`defineReactive`， `defineReactive` `new`一个`Dep`。
然后将 `val`传给`observe`去判断，它是不是一个对象或者数组，如果是，继续走一遍以上流程。如果不是，对`obj`也就是之前的`vm._data`创建拦截器

```js{30-34,15}
walk (obj: Object) {
 const keys = Object.keys(obj)
 for (let i = 0; i < keys.length; i++) {
   defineReactive(obj, keys[i])
 }
}
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 依赖框
  const dep = new Dep()
  // 获取对象中已存在的描述对象
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 不可配置则直接返回
  if (property && property.configurable === false) {
    return
  }
  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  // 原本拥有getter就不需要深度监听了 在做属性校验的监听的时候，不需要set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    get: function reactiveGetter () { },
    set: function reactiveSetter (newVal) { }
  })
}
```
这样整个初始化流程就算走完了。和`computed`类似。好，接下来就是触发拦截器了。

## 初始化 Watcher

在`_init`走到最后，我们会执行`vm.$mount(vm.$options.el)`，`$mount`有两种入口形式

1. runtime+ compiler 当我们在`html`直接引入`vue`就使用的这种，他会将`template`转换成`render`，
然后放到`$options.render`中。
2. runtime 我们使用脚手架工具开发的项目就是这个版本，但是他也需要转换，不过使用`vue-loader`工具去完成

因为`computed`讲过`render`生成的基本流程，这里不赘述，直接看`platforms/web/index.js`下`$mount`方法，很简单就是返回了`mountComponent`。接下来我们看这个方法

```js{16-22,10-13}
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // 拿到 传递的el  但是这段在之后会被重写成 template里的数据
  vm.$el = el
  callHook(vm, 'beforeMount')
  //把渲染函数生成的虚拟DOM渲染成真正的DOM
   let updateComponent = () => {
      // vm._render() --> vm.$createElement -> createElement ---> vnode | createComponent --> vnode
      vm._update(vm._render(), hydrating)
    }

  // 这就是渲染watcher
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

其核心就是 `new Watcher`和传入了求值函数`updateComponent`。进入`Wacher`构造函数。我们可以发现

```js{44-46,15-18}
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
    // 该观察者属于哪一个组件
    this.vm = vm
    if (isRenderWatcher) {
      // 将当前渲染watcher 复制给 实例的_watcher
      vm._watcher = this
    }
    // 不管是不是 渲染watcher。 当前this都会复制给_watchers
    vm._watchers.push(this)
    if (options) {
      this.before = options.before // 在触发更新之前的 调用回调
    }
    this.cb = cb // 回调
    this.id = ++uid // uid for batching 唯一标识
    this.active = true // 激活对象
    // 实现避免重复依赖
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    // ---
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
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
```
该构造函数主要也是两件事

1. 将`vm._watcher`赋值为当前`Watcher`，仅在传值为`true`的时候，注意只有渲染`Watcher`才会传`true`。
2. 定义一些属性，可以看上面的注释，关于避免重复依赖这块，后面添加依赖会讲到
3. 执行类方法`get`

```js{22,18,35}
// observer/dep.js
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

// observer/watcher.js
get () {
 // 给Dep.target 赋值 Watcher
 pushTarget(this)
 let value
 const vm = this.vm
 try {
   value = this.getter.call(vm, vm)
 } catch (e) {
   if (this.user) {
     handleError(e, vm, `getter for watcher "${this.expression}"`)
   } else {
     throw e
   }
 } finally {
   // "touch" every property so they are all tracked as
   // dependencies for deep watching
   // todo 深度观测
 
   // 清除当前 target
   popTarget()
   // 清空依赖
   this.cleanupDeps()
 }
 return value
}
```
这里首先看`pushTarget`方法，它也做了两件事

1. 将全局`Dep.target`赋值为当前`Watcher`实例。
2. 将当前`Watcher`实例`push`到`targetStack`中。

然后执行`this.getter`方法，它就是之前传入的求值函数`updateComponent`, 也就是执行了`vm._update(vm._render(), hydrating)`。后面就和`computed`讲的一样，我们在`render.call(vm._renderProxy, vm.$createElement)`上加个断点，单步进入就能拿到`render`生成的匿名执行函数

```js
;(function anonymous () {
  with (this) {
    return _c('div', { attrs: { id: 'app' } }, [_v('\n    ' + _s(a) + '\n  ')])
  }
})
```
因此当我们执行到`this.a`的时候 就触发了 定义好的拦截器

## 添加依赖

在这里单步调试的时候，我们可以很清晰的看到，`this.a --> this._data.a-->get`。下面我们在回到`defineReactive`

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
  ...
  Object.defineProperty(obj, key, {
    enumerable: true,
    get: function reactiveGetter () {
      // 如果存在自定义getter 执行自定义的
      const value = getter ? getter.call(obj) : val
      // 要被收集的依赖
      if (Dep.target) {
        // 通过闭包引用了 依赖框
        // 每一个数据字段都通过闭包引用着属于自己的 dep 常量
        dep.depend()
      }
      return value
    },
    set: function reactiveSetter (newVal) { }
  })
}
```
这里我们可以看到，他也是一个属性一个独立的`dep`。并且从上面我们也知道`Dep.target`，就是当前渲染`Watcher`，那么就会执行`dep.depend`。

```js
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    // new Dep 时 唯一id会自增
    this.id = uid++
    this.subs = []
  }
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
}

export default class Watcher {
    addDep (dep: Dep) {
    const id = dep.id
    // * 在一次求值中 查看这个唯一id 是否在set中已存在，
    if (!this.newDepIds.has(id)) {
      // 不存在就放进 set里面 然后吧 dep也放到 newdeps里
      // 每次重新求值， newDepIds 都会被清空
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      // * 在 多次求值 中避免收集重复依赖的
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
}
```
这里我们连起来看，整个执行流程就是`Wacher.addDep -> dep.addSub -> dep.subs.push(Watcher)`。我们先不关注`newDepIds、newDeps`这几个属性。添加完依赖我们并没有执行结束，在`Watcher.get`方法中，仅仅执行完了`value = this.getter.call(vm, vm)`。还有两个关键方法要执行

```js
// 清除当前 target
popTarget()
// 清空依赖
this.cleanupDeps()

```

第一个看上面代码，就很简单清除当前的`Dep.target`和`targetStack`。关键我们来看看这个`Watcher`的`cleanupDeps`方法。

```js
cleanupDeps () {
 // 这里就是 移除废弃观察者
 // 将 newDepIds 赋值给 depIds
 // 清空 newdepids
 // 将 newdeps 赋值给 deps
 // 将 newdeps设置为0
 let tmp = this.depIds
 this.depIds = this.newDepIds
 this.newDepIds = tmp
 this.newDepIds.clear()
 tmp = this.deps
 this.deps = this.newDeps
 this.newDeps = tmp
 this.newDeps.length = 0
}
```

可以看到我们将`depIds`和`deps`赋值为当前的依赖数据，而`newDeps`和`newDepIds`做了置空处理


清除了这些，我们直接走`set`这个流程

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
  Object.defineProperty(obj, key, {
    enumerable: true,
    set: function reactiveSetter (newVal) {
      // 拿到属性原来的值
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      ...
      // #7981: for accessor properties without setter
      // 同理
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      dep.notify()
    }
  })
}
```
我们要给 `set`方法，做个断点，然后先看`a`这个`dep`里面东西

```js
dep: {
  id: 3,
  subs: [
    Watcher // 渲染watcher
  ]
}
```
删除和例子无关的代码，`set`很简单，说起来也就两件事，**更新值**和**通知`dep`**，通知更新后面走的流程
`dep.notify()-->watcher.update()--->queueWatcher(this)`进入`watcher`队列后就会放到`nextTick`中，等待本次事件循环完成后，就会执行`watcher`中保存的方法，`watcher.run()`。

这时候我们看看`Watcher.run`。它重新执行了求值方法，就相当于我们要再走一遍上面流程，触发`get`进行依赖收集。这样如果不做处理，肯定会出现重复收集依赖的情况。

```js
run () {
 // 观察者是否处于激活状态
 if (this.active) {
   // 重新求值
   const value = this.get()
 }
}
```
这时候我们再来看`addDep`这个方法。从上面我们可知，当前`newDep`已经被清空了，但是`deps`中保存着之前的依赖，所以这时候走到`this.depIds.has(id)`就结束了，避免了依赖的重复添加

```js
addDep (dep: Dep) {
 const id = dep.id
 // * 在一次求值中 查看这个唯一id 是否在set中已存在，
 if (!this.newDepIds.has(id)) {
   // 不存在就放进 set里面 然后吧 dep也放到 newdeps里
   // 每次重新求值， newDepIds 都会被清空
   this.newDepIds.add(id)
   this.newDeps.push(dep)
   // * 在 多次求值 中避免收集重复依赖的
   if (!this.depIds.has(id)) {
     dep.addSub(this)
   }
 }
}
```
然后就这样结束了吗？ 当然没有，继续看 执行完`get`我们还要执行两个方法，我们直接看`cleanupDeps`

```js{5-13}
cleanupDeps () {
 // 这里就是 移除废弃观察者

 // 首先获取上次dep的长度
 let i = this.deps.length
 while (i--) {
   // 循环查找dep在newdepids是否不存在
   const dep = this.deps[i]
   if (!this.newDepIds.has(dep.id)) {
     // 将该观察者对象从Dep实例中移除
     dep.removeSub(this)
   }
 }
 // 将 newDepIds 赋值给 depIds
 // 清空 newdepids
 // 将 newdeps 赋值给 deps
 // 将 newdeps设置为0
 let tmp = this.depIds
 this.depIds = this.newDepIds
 this.newDepIds = tmp
 this.newDepIds.clear()
 tmp = this.deps
 this.deps = this.newDeps
 this.newDeps = tmp
 this.newDeps.length = 0
}
```
看高亮处。这时候我们没进行后面的执行，所以 `newDep`和`dep`都存在值。所以就会进行 **是否还需要对这个观察者进行观察的判断**然后才会执行下面清理的流程。这样整个流程才算执行完了。这就是最简单的对象的执行过程。
那么什么时候会不存在？可以这么做一个例子，页面上通过`v-if`去分别展示两个响应式属性，当不展示另一个的时候，保存的上一个依赖就不需要继续缓存了。这时候就会触发`dep.removeSub(this)`进行删除。

## 深层对象和数组的处理

在真正的开发中，一般会出现多种数据结构

1. 对象

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="../../dist/vue.js"></script>
</head>

<body>
  <div id="app">
    {{a}}
  </div>
  <script>
    let vm = new Vue({
      el: '#app',
      data: {
        a: {
          b: 1,
        },
      },
    })
  </script>
</body>

</html>
```
观察以上例子，和简易响应式一样，我们需要递归`a`才行。查看源码, 在`defineReactive`源码中

```js{11,22-24}
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
        // 通过闭包引用了 依赖框
        // 每一个数据字段都通过闭包引用着属于自己的 dep 常量
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      // 拿到属性原来的值
      const value = getter ? getter.call(obj) : val
      val = newVal
      // 同上
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```
初始化的时候,我们观察`_data`，可以看到这样的数据结构

```js
_data: {
  a: {
    b: 2,
     __ob__: Observer {
       dep: Dep {id: 4, subs: []},
       value: {},
       vmCount: 0
    }
  },
  __ob__: Observer {
    dep: Dep { id: 2, subs: [] }
    value: {},
    vmCount: 1
  }
}
```
然后再看`$options.render`这个匿名执行函数
```js
(function anonymous() {
  with (this) {
    return _c('div', {
      attrs: {
        "id": "app"
      }
    }, [_v("\n    " + _s(a.b) + "\n  ")])
  }
}
)
```
可以看到要执行`a.b`，但是这时候其实我们还是执行的`this.a`，触发的也是`a`的，但是这次我们执行完`dep.depend`之后，`childOb`是存在值的，就是上面通过闭包保存的`observe({b:2, __ob__:Observe})`。
所以这时候我们执行`childOb.dep.depend()`，也就是在`__ob__.dep.subs`中添加了该`Watcher`。

**注意以下描述**
这时候我们`this.a`执行完成，然后`get`会返回`a`的对象`b`作为值，返回到那个匿名函数，相当于执行了`this.a.b`，再次进入`get`，依赖收集。这时候对应依赖不在是，作为`b`同级的`__ob__`，而是在`defineReactive`初始化的`dep`，在这里会吧`Watcher`放进去。


这时候我们再去触发`set`，执行`vm.a.b = 6`。

通过单步调试可以发现，这里触发`dep.notify`，执行的是`defineReactive`初始化的`dep`。之后的流程和之前一样，仅仅更新值，依赖不会更新。

**那么什么时候用到`__ob__`里面的`dep`？**

## $set

不要忘了我们还有一`API`专门用来添加属性，`vm.$set`。`vue.set`指向的是同一个方法，不赘述。

那么而我们就给例子再添加一行代码。

```js
vm.$set(vm.a, 'c', 6)
```

然后看源码, 因为我们在原有属性上添加值，所以具有`__ob__`属性，会走正常添加响应式的流程。

```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  // 判断 target 和 key
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // 如果是新添加属性
  const ob = (target: any).__ob__
  // 如果不存在 __ob__ 他就不是一个响应式，所以直接赋值
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

1. 调用`defineReactive`给`__ob__.value`，的新`key`创建一个拦截器。
2. 调用`ob.dep.notify()`，这时候就是上面那个`b`对象同级`__ob__`里的`dep`调用了通知，之后就会走相同的流程

这里就不讲`del`了，流程是类似的，照着之前的`debug`走一遍就行。

## 聊聊数组

修改基础例子

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="../../dist/vue.js"></script>
</head>

<body>
  <div id="app">
    {{a}}
  </div>
  <script>
    let vm = new Vue({
      el: '#app',
      data: {
        a: [1, 2, 4, 5]
      },
    })
  </script>
</body>

</html>
```
然后看相关源码，（就不截取全部了，只看部分）

```js{16-25}
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    // 实例化依赖框, 这个框不属于某个数据
    this.dep = new Dep()
    //依赖计数
    this.vmCount = 0
    // 创建一个不可枚举的 __ob__ 对象，该对象是 Observer本身

    def(value, '__ob__', this)
    // 数组处理方式
    if (Array.isArray(value)) {
      // 判断当前环境是否可以使用 __proto__
      if (hasProto) {
        // 把数组实例与代理原型或与代理原型中定义的函数联系起来，从而拦截数组变异方法
        // 设置value.__proto__ 为 arrayMethods
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      // 对象处理方式
      this.walk(value)
    }
  }
}
```
现代浏览器都会有`hasProto`，所以看`protoAugment`方法，它很简单，将`value.__proto__ = arrayMethods`, 而`arrayMethods = Object.create(Array.prototype)`。即`value.__proto__.__proto__ == Array.prototype`

```js
// 缓存数组的原型
const arrayProto = Array.prototype
// value.__proto__.__proto__ == Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 执行所有的依赖
    ob.dep.notify()
    return result
  })
})
```
这种方式有点类似于面向切面编程，我们给`a`数组的原型链指向了数组的原型。但是我们没有破坏数组本身的方法，并且通过数组本身方法求值后，做了一些响应式的操作，然后返回了值。在看`set`方法中，相关数组的内容

```js
if (Array.isArray(target) && isValidArrayIndex(key)) {
  target.length = Math.max(target.length, key)
  target.splice(key, 1, val)
  return val
}
```
也是使用了`splice`而已。最后注意一下拦截器`get`中有这么一段代码，是为了解**决多维数组**的响应式问题

```js
 // 解决 get的时候 value 仍旧是一个数组的时候 去做响应式依赖
if (Array.isArray(value)) {
  dependArray(value)
}
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
```

## 总结

至此，`data`的主要功能差不多分析完了，这块的难点主要在

1. 依赖收集和优化相关的依赖清除
2. `__ob__`中的`dep`和`defineReactive`中`dep`的异同点

通过`debug`理解了这些，`data`就没有什么难的地方了。
