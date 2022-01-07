# 组件解析

组件是`vue`的核心，从官方文档看组件有两种注册方式：全局和局部。那么我们先来看全局注册，先来一个例子
```html
<div id="app">
  <div>这是一个div</div>
  <comp-a></comp-a>
</div>
<script>
  Vue.component('comp-a', {
    template: '<div>这个一个子组件</div>'
  })
  const vm = new Vue({
    el: '#app',
  })
</script>
```

关于全局注册，我们先要了解`vue`初始化过程中，是如何挂载方法的。在`core/instance/index.js`文件中，通过组合的方法在`Vue.prototype`上挂载了大量方法
通过方法名就能大概猜到是做什么的。
```js
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
```
然后在`core/index.js`中调用了`initGlobalAPI(Vue)`，该方法定义在`core/global-api/index.js`中，它在`Vue`上挂载了很多方法，也就是静态方法。
那么它到底做了什么呢？我们来看看关于本例子的核心实现

```js
export function initGlobalAPI (Vue: GlobalAPI) {

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
    })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initExtend(Vue)
  initAssetRegisters(Vue)
}
```

中间这个`forEach`循环直接看结果，我们给每个现有对象的`__proto__`指向了空。并且通过`extend`将`keep-alive`混合到了`components`中。
然后通过`initAssetRegisters`进行注册。在这个方法中关于`components`就是

```js
Vue['component'] = function(id, definition) {
  definition.name = definition.name || id
  definition = this.options._base.extend(definition)
  return definition
}
```
那么在`Vue`中就可以总结为
```js
Vue.options = {
	components: {
		KeepAlive
	},
	directives: Object.create(null),
	filters: Object.create(null),
	_base: Vue
}
Vue.extend = function() {}
Vue.component = function(id, definition) {}
```

## 全局注册的初始化


首先看例子，在`new Vue`之前，我们使用`Vue.component`去定义了全局组件，那么`Vue`调用的就是初始化的静态方法`Vue.component`。而这个方法其实就一行核心代码
`this.options._base.extend(definition)`，`this.options._base`在`initGlobalAPI`中有定义就是`Vue`。那么这里我们就是调用的`Vue.extend`初始化了
组件，好，我们进`Vue.extend`看看

```js
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {}
  const Super = this
  const SuperId = Super.cid
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }
  const Sub = function VueComponent (options) {
    this._init(options)
  }
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super

  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type]
  })
  // enable recursive self-lookup
  if (name) {
    Sub.options.components[name] = Sub
  }

  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  // cache constructor
  cachedCtors[SuperId] = Sub
  return Sub
}
```

该方法其实和`init`方法一样重要，是组件的创建实例方法，但关于本例子我们也只看其核心。然后总结它干了些啥。

1. 将`Vue`赋值给了`Super`
2. 做了一个缓存的处理，比如我们在一个父组件中使用两次同一个组件，那么之后返回的就是缓存不需要再次创建实例方法
3. 创建了`Sub`实例方法，将该方法的`__proto`指向了`Vue`的原型，将原型的构造函数指向它自己，标准的原型继承
4. 合并选项，将父组件中的`components`和子组件的传入选项合并到一起，赋值给子组件选项；**注意**：父组件的`assets`是被放在子组件的原型上的，具体可以去看`mergeAssets`方法
也是使用了`Object.create`
5. 初始化`props`和`computed`
6. 初始化一些其他方法
7. 返回构造函数

那么`Vue.component`就执行结束了，之后开始`new Vue`的流程

和之前一样，`new Vue`初始化会创建渲染`Watcher`，在调用`watcher`里的`get`函数的时候，就是调用传入的第二个参数。就是`updateComponent`方法，
就是会执行`vm._update(vm._render(), hydrating)`。该方法分为两步，第一步执行`render`函数生成`vnode`。第二步通过`vm.update`将`vnode`渲染到页面。

那么直接看`vm._render`的核心，`vnode = render.call(vm._renderProxy, vm.$createElement)`，在这里打个断点，就能拿到我们例子的匿名执行函数

```js
;(function anonymous () {
  with (this) {
    return _c(
      'div',
      { attrs: { id: 'app' } },
      [_c('div', [_v('这是一个div')]), _v(' '), _c('comp-a')],
      1
    )
  }
})
```
之后我们看执行`_c(comp-a)`。之前我们提到过`_c`，还记得吗？在`initRender`中，有这么一个声明`vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)`。
很显然我们这时候调用的就是`createElement`。

```js
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```
在这个方法中，判断了`data`，我们这里只传入了前两个参数，第一个是`vm`，第二个就是`comp-a`。那么就不会执行中间的赋值步骤，而且最后一个值为`false`。什么时候它为`true`。
当我们使用`render`函数而不是`template`的时候，就会触发这个函数了，现在知道就好。我们来看`_createElement`方法。该方法在`core/vnode/create-element.js`

```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    // 如果是保留标签
    if (config.isReservedTag(tag)) {
      // 创建 vnode
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
      // 如果data不存在，且 components存在，是组件
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      // 创建子组件
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
     }
  } else {
    vnode = createComponent(tag, data, context, children);
  }
}
```
这个方法非常重要是用来创建`Vnode`的核心方法，删除判断代码，核心就是上面的逻辑

1. `tag`是字符串分三种情况
   1. 保留标签直接创建`Vnode`
   2. 实例上存在`components`，且`tag`能在`components`中找到，是组件
   3. 未知标签 创建`Vnode`
2. `tag`不是字符串，创建组件

根据上面的例子，我们会走走`resolveAsset(context.$options, 'components', tag)`这个方法，这个方法功能就是找`$options.components`里面
是否有`tag`这个值并且返回它。显然我们能在`components`里面找到这个`tag`，因为我们通过`Vue`声明了。然后我们就会进入`createComponent(Ctor, data, context, children, tag)`
方法。先来看看各个参数，`Ctor`是构造函数。`data`没有定义，`content`是当前实例，`children`未定义，`tag`是`comp-a`。


## createComponent

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {

  data = data || {}

  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  return vnode
}
```
在这个方法中前面还是做一些选项的初始化工作，主要在`installComponentHooks`方法，我们进入这个方法看看。
```js
const componentVNodeHooks = {
  init() {},
  prepatch() {},
  insert() {},
  destory() {}
}

const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}
```
它的主要工作是将`componentVNodeHooks`中的方法放到`data`的`hooks`中，如果有同名方法，将使用`mergeHook`策略合并。合并策略为

```js
(init1, init2) => {
 init1(),
 init2()
}
```
好准备工作都完成后，就开始`new Vnode`，实例化`Vnode`很简单，就是创建了很多属性，关键要记住我们现在的`tag`，`Vnode`的`tag`是
`vue-component-1-comp-a`。

## vm._update

接下来其实还有创建父组件`Vnode`的过程，可以自己试着`debug`一下，过程是类似的。这边我们直接看`update`的过程，并且看一下传入的`Vnode`的构成

```js
vnode: {
  tag: 'div',
  data: {
    attrs: {id: 'app'}
  },
  children: [
    Vnode // 这是一个div节点
    Vnode // 空文本节点
    Vnode // vue-component-1-comp-a
  ]
}
```
然后我们看`_update`方法，它在`instance/lifrcycle.js`中

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
 const vm: Component = this
 const prevEl = vm.$el
 const prevVnode = vm._vnode
 // 存储当前的vm实例
 const restoreActiveInstance = setActiveInstance(vm)
 vm._vnode = vnode
 if (!prevVnode) {
   // initial render
   vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
 } else {
   // updates
   vm.$el = vm.__patch__(prevVnode, vnode)
 }
 // activeIntance 变成了上一个实例
 restoreActiveInstance()
}
```
这里我们也只看核心在当前`vnode`下，它不存在`prevVnode`节点，所以调用`vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)`。先想想传入的参数`vm.$el`就是我们的`<div id='app'></div>`。`vnode`是它的虚拟节点。

## patch 方法

`__patch__`是什么，让我们来到`platform/runtime/index.js`，其中有这么一句定义
`Vue.prototype.__patch__ = inBrowser ? patch : noop`，所以在浏览器端它就是`patch`方法。
继续找这个`patch`方法，它被定义在同目录下的`patch.js`中，它是一个方法的返回值，`createPatchFunction`，这个方法传入了一个对象，它被定义在`core/vdom/patch`，所以
`createPatchFunction`方法的返回值方法，才是我们将要执行的方法。

**`vue`为什么要这么做？**

让我们看看`createPatchFunction`方法的传入对象

1. nodeOps 它定义了非常多的原生`node`操作方法
2. modules 包含`vue`自定义的属性和浏览器属性

也就是说，`vue`使用高阶函数将代码抽离了，这是一种很好的编程方式。应该学习


好，下面我们来看`patch`，这个我不贴代码了，它非常长。我们使用文字来描述，类似伪代码的形式

- 如果`vnode`未定义
  - `oldvnode`定义了，执行`invokeDestroyHook(oldVnode)`
  - return
- 如果`oldVnode`不存在
  - 执行`createElm(vnode, insertedVnodeQueue)`
- `oldVnode`存在
  - 首先判断`oldVnode`是否是真实节点
  - `oldvnode`不是真是节点，且`sameVnode(oldVnode, vnode)`
    - 执行`patchVnode`
  - `oldVnode`是真实节点，做一系列操作

大致这么判断就够了，执行到下一层级，前一层级就不会执行了，对照源码看。那么我们例子的情况，会跳到`oldvnode`为真实节点。接着往下执行，`vue`首先会对真实的`oldVnode`创建一个空节点为虚拟节点，然后调用
`createElm`，这时候传入的`vnode`。

## createElm 创建节点

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {

  // 组件vnode
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag

  vnode.elm = vnode.ns
    ? nodeOps.createElementNS(vnode.ns, tag)
    : nodeOps.createElement(tag, vnode)
  setScope(vnode)

  // 递归创建子节点
  createChildren(vnode, children, insertedVnodeQueue)
  if (isDef(data)) {
    // 执行createhook
    invokeCreateHooks(vnode, insertedVnodeQueue)
  }
  // 插入真实节点
  insert(parentElm, vnode.elm, refElm)
 
}

function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; ++i) {
      createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
    }
  } else if (isPrimitive(vnode.text)) {
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
  }
}
```
在`createElm`中，首先`vue`创建了`vnode`的元素节点，真实的。然后调用`createChildren`，传入的是`vnode`和`children`，在这个方法中将再次调用`createElm`，传入的会变成`children[i]`。那么很显然当
`vnode`是`comp-a`的时候，我们将执行真正的组件创建。

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```
在之前我们已经知道`vnode.data`里面有我们需要的初始化函数，所以这里我们将执行它，当执行到`i(vnode, false /* hydrating */)`的时候，就是执行了`vnode.init`。在`init`方法中主要进行三步

1. 执行`prepatch`这个`hook`
2. 初始化子组件实例
3. `$mount`挂载子组件

执行完成之后，我们就拿到了`vnode.componentInstance`。然后就是`initComponent`在这里方法里面会执行
`invokeCreateHooks`该方法就是执行的`modules`里面的`create`方法，都是`dom`相关的。
执行完这个就是`insert`方法，这个方法核心也是一句`nodeOps.appendChild(parent, elm)`。

**这时候渲染的是什么？**

看一看元素, 没错是站位节点`comp-a`。那么什么时候渲染真实节点？

```js
<div id="app">
 <div>这是一个div</div>
 <comp-a></comp-a>
</div>
```

回到`createElm`，这时候`createChildren`执行完了。也就是递归创建子节点结束了。看代码

```js
// 递归创建子节点
createChildren(vnode, children, insertedVnodeQueue)
if (isDef(data)) {
 // 执行createhook
 invokeCreateHooks(vnode, insertedVnodeQueue)
}
// 插入真实节点
insert(parentElm, vnode.elm, refElm)
```
这时候执行父组件的`invokeCreateHooks`方法，也是一系列的钩子函数，执行完成后才是真正的`insert`。
这时候我们有`vnode.elm`，其中包含`children`节点。执行完成后看元素

```js
<body>
  <div id="app">
    <div>这是一个div</div>
    <comp-a></comp-a>
  </div>
  <div id="app">
    <div>这是一个div</div>
    <div>这个一个子组件</div>
  </div>
</body>
```
没错渲染完成了，但是有两个，这很简单，删除上一个就行了。很显然`createElm`结束后，我们还要回到`patch`

```js
// destroy old node
if (isDef(parentElm)) {
 removeVnodes([oldVnode], 0, 0)
} else if (isDef(oldVnode.tag)) {
 invokeDestroyHook(oldVnode)
}
invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
return vnode.elm
```
删除节点，执行`insert`。这个`insert`是组件的，也就是`vnode.data`里面的，这里我们将执行组件的`mounted`钩子，设置实例`mounted`结束。最后回到`vm._update`执行`vue`实例的`mounted`钩子函数
最后执行完毕。

## 局部注册

我们来看下局部注册有什么不同。

```html
<div id="app">
  <div>这是一个div</div>
  <comp-a></comp-a>
</div>
<script>
  const componentA = {
    template: '<div>这个一个子组件</div>'
  }
  const vm = new Vue({
    el: '#app',
    components: {
      'comp-a': componentA
    }
  })
</script>
```
前面的都没什么不同，而且在`resolveAsset(context.$options, 'components', tag)`代码中，
`vm.$options`也能拿到该`tag`，但是他不在原型中，且是一个对象，所以当我们运行到`createComponent`
方法，我们会运行这段代码

```js
if (isObject(Ctor)) {
 Ctor = baseCtor.extend(Ctor)
}
```
然后在执行`extend`方法的时候，我们传入的`options`是没有`name`的，只有在`Vue.extend`下才有。
所以这段代码也不会执行

```js
if (name) {
   Sub.options.components[name] = Sub
 }
```
区别并不大，可以按照我上面的方法走一遍`render`到`patch`的流程。

## 碎碎念

该篇文章的难点全在`patch`上了，组件注册并没有什么难度。正式花了我很大的精力。