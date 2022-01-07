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
而很显然我们在使用全局注册时候，就是调用的`initGlobalAPI`中的某个方法。而这个方法就是`initAssetRegisters`。它定义了`Vue.component`是一个方法。

## 全局注册的初始化

和之前一样，初始化会创建渲染`Watcher`，在调用`watcher`里的`get`函数的时候，就是调用传入的第二个参数。就是`updateComponent`方法，
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


```js
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  return res
}
```
根据上面的例子，我们将走`resolveAsset(context.$options, 'components', tag)`这个方法，这个方法功能就是找`$options.components`里面
是否有`tag`这个值并且返回它。

