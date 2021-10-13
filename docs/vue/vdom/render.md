# render

在之前的首次渲染中我们知道，`mountComponent`方法中，会调用`new Watcher`作为首次渲染的wacher，而它传入的方法
`updateComponent`中的回调就是dom更新的入口

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

找到了入口，我们就可以看到它调用了`vm._render`， 而它就是实例上的`_render`方法，我们在`_init`方法中的`initRender`进行了声明
，看以下代码，我们能找到`vm.$createElement`

```js
// 对编译生成的render进行渲染方法 
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
// 对手写的render函数进行渲染的方法
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```

```js
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    // 获取实例上options里的render方法
    const { render, _parentVnode } = vm.$options

    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      currentRenderingInstance = vm
      // 调用render，传入 vm 和vm.$createElement
      // vm._renderProxy 就是vm，这个在_init中有定义
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
     
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    // 如果是array
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }

```