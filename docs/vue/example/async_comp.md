# 异步组件

讲完组件，那么正好下面来看看异步组件。异步组件在项目开发中很重要。结合`webpack`的`code-spliting`就能让组件打包成的`js`异步加载，达到浏览器加载优化的目的，提高页面渲染速度。
因为是配合`webpack`使用，所以我们需要用`vue-cli`创建一个最基本的项目，那么好首先我们看这么一个例子

```js
Vue.component('HelloWorld', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包，这些包
  // 会通过 Ajax 请求加载
  require(['./components/HelloWorld.vue'], resolve)
})

new Vue({
  render: h => h(App)
}).$mount('#app')
```
我们把`demo`中`App`组件的局部注册删除，然后全局注册，上面是例子代码。

例子准备好了，接下来我们要想一想入口在哪里。打开`package-json`我们看到，它是通过`vue-cli-service`启动的，显然我们要找到启动文件。
在`node_modules`中，我们看`.bin`目录，在`.bin`目录下我们能找到`vue-cli-service`脚本文件。在这里我们能看到他的执行目录是`@vue/cli-service/bin/vue-cli-service.js`。
找的过程就不细描述了，我们直接看`config/base.js`里的代码

```js
webpackConfig.resolve
  .alias
    .set(
      'vue$',
      options.runtimeCompiler
        ? 'vue/dist/vue.esm.js'
        : 'vue/dist/vue.runtime.esm.js'
    )
```

很简单如果我们开启了`runtimeCompiler`选项引入的就是`vue.esm.js`，否则就是`vue.runtime.esm.js`。两者差别就是是否存在`compiler`了。

引入的`vue`源码知道在哪里了，现在我们想想异步组件的入口在哪里。首先在上一篇文章中我们知道，创建异步组件会走`createComponent`方法，这个方法在`vdom/create-component`文件中，
显然现在我们只要在`createComponent`的开头写上`debugger`就能在开发状态进入调试模式了

## 初始化

在这里我们全局注册的时候，第二个参数是一个方法而不是对象，所以我们在执行`initAssetRegisters`方法的时候，当`type=component`的时候

```js
if (type === 'component' && isPlainObject(definition)) {
  definition.name = definition.name || id
  definition = this.options._base.extend(definition)
}
```
看上面`isPlainObject`是`false`，那么`vue`就不会执行里面的代码。然后我们再看`createComponent`方法。

```js
// 创建子组件
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {

  // 异步组件
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    // 组件构造工厂函数  Vue
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    if (Ctor === undefined) {
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }
  return vnode
}
```

可以看到 `Ctor`我们这里传入的是`function`，且是没有执行过`extend`的。所以它不存在`cid`，也就是进入了这里面的语句。入口分析完了，那么我们看里面的方法
首先是`resolveAsyncComponent`。

```js
export function resolveAsyncComponent (
  factory: Function,
  baseCtor: Class<Component>
): Class<Component> | void {
  const owner = currentRenderingInstance

  if (owner && !isDef(factory.owners)) {
    const owners = factory.owners = [owner]
    let sync = true
    let timerLoading = null
    let timerTimeout = null

    ;(owner: any).$on('hook:destroyed', () => remove(owners, owner))

    const forceRender = (renderCompleted: boolean) => {}

    const resolve = once((res: Object | Class<Component>) => {})
    // 用回调函数的方式
    const reject = once(reason => { })

    const res = factory(resolve, reject)

    sync = false

    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}
```

`currentRenderingInstance`获取当前渲染实例，也就是`App`的实例。该方法较长，我们先删除该例子下
现阶段无关的代码只看核心，第一次使用`factory.owners`可定是不存在的。所以会进入`if`。

在里面我们首先声明了很多属性，主要就是声明了`resolve`和`reject`函数，并且他们只执行一次。当执行到`factory(resolve, reject)`的时候，其实们是执行了定义函数，也就是说我们要执行

```js
require(['./components/HelloWorld.vue'], resolve)
```
`require`是`webpack`的方法，因此我们将进入`webpack`进行执行。通过上面的`resolve`和`reject`函数我们可以猜测，`require`肯定是`new`了一个`Promise`。


确实如此，在`webpack`里的代码，就是`new Promise`，然后动态创建一个`script`后。然后回到之后的流程继续执行。在一大段的`if`语句判断中，其实现在是不执行的因为没有返回值，当前的`res`是空。所以当前就是执行了后两段代码。`sync = false`并且返回`factory.resolved`

然而当前`factory.resolved`是`undefined`，所以看`createComponent`方法

```js
if (Ctor === undefined) {
  return createAsyncPlaceholder(asyncFactory, data, context, children, tag)
}
```

也就是进入`createAsyncPlaceholder`，看名字是创建了一个异步的`Placeholder`。我们看代码

```js
export function createAsyncPlaceholder (
  factory: Function,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag: ?string
): VNode {
  const node = createEmptyVNode()
  node.asyncFactory = factory
  node.asyncMeta = { data, context, children, tag }
  return node
}
```

很简单，`vue`创建了一个空的`vnode`，然后吧参数赋值给了`vnode`。当执行到`insert`节点之后我们能看到
`console`的元素页面内是

```html
<div id="app">
  <img alt="Vue logo" src="/img/logo.82b9c7a5.png">
  <!---->
  </div>
```
看在组件区域存在一注释节点。并且在`network`我们可以看到一个空的`0.js`。这样初始化流程结束



## 执行 resolve

这里我们在`resolve`函数内部打个断点，然后看调用堆栈。上面有个大大的`Promise.then`异步，然后就会执行到
`resolve`函数。

```js
const resolve = once((res: Object | Class<Component>) => {
  factory.resolved = ensureCtor(res, baseCtor)
  if (!sync) {
    forceRender(true)
  } else {
    owners.length = 0
  }
})
function ensureCtor (comp: any, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}
```
这个方法很简单

1. 执行`ensureCtor`，该方法就是通过拿到的组件对象执行`Vue.extend`初始化子组件构造函数。
2. 当前`sync`是`false`。所以我们会执行`forceRender(true)`

`forceRender`很简单，我们看代码

```js
var forceRender = function (renderCompleted) {
   for (var i = 0, l = owners.length; i < l; i++) {
     owners[i].$forceUpdate()
   }
}
```
这里我们拿到闭包保存的`owners[i]`，当前只有一个也就是`App`实例。那么后面就是`this.$forceUpdate`的执行了。重新运行`watcher.update`进行页面更新。这时候我们可以拿到子组件实例了，也就是进行正常的`createComponent`流程，渲染到页面上

## 其他例子

一般来说我们不会使用上面的方法，他有更好基于`es2015`的书写方式

```js
Vue.component('HelloWorld',
  // 该 import 函数返回一个 promise 对象
  () => import(/* webpackChunkName: "HelloWorld" */'./components/HelloWorld.vue')
)
```
在这个例子中需要注意的是 我们有返回值，这个返回值是`webpack`处理后返回的，就是`Promise`。既然有返回值，那么在下面代码中

```js
 const res = factory(resolve, reject)
 // 如果是一个promise
 if (isObject(res)) {
   if (isPromise(res)) {
     // () => Promise
     if (isUndef(factory.resolved)) {
       res.then(resolve, reject)
     }
   }
 }

```
显然我们会运行到`res.then`方法，也就会执行到我们定义的`resolve`，之后的代码是一样的。

在官方文档中还有一个例子

```js
// 第三种写法 高级异步组件
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import('./components/HelloWorld.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000
})

const LoadingComp = {
  template: '<div>loading</div>'
}
const ErrorComp = {
  template: '<div>error</div>'
}
Vue.component('HelloWorld', AsyncComp)
```

这个语法是新增的，代码的执行其实很简单就是判断`promise`的执行情况。在源码中也很简单，相信都能看明白。

## 总结

如果这时候有面试官问：**vue的异步组件是如何执行的？**

就能回答异步组件和名字一样，其实就是通过`webpack`创建的`promise`等执行到`then`的时候去初始化子组件构造函数，然后在执行当前实例也就是父组件实例的`$foreUpdate`去重新渲染。

