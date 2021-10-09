# initMixin粗略解读

主要功能是注册`_init`方法，初始化vm

```js
export function initMixin (Vue: Class<Component>) {
  // 在原型上定义_init方法
  Vue.prototype._init = function (options?: Object) {
    ...
  }
}
```
当我们`new Vue()`的时候，会调用`_init`方法

```js
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this // vue 实例
    // a uid
    vm._uid = uid++

    // a flag to avoid this being observed
    vm._isVue = true
    // 合并配置
    if (options && options._isComponent) {
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    // render代理
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    // 初始化生命周期，$children/$parent/$root/$refs
    initLifecycle(vm)
    // vm的事件监听初始化，父组件绑定在当前组件上的事件
    initEvents(vm)
    // vm的编译render初始化
    // $slots/$scopedSlots/_c/$createElement/$attrs/$listeners
    initRender(vm)
    // 生命钩子回调
    callHook(vm, 'beforeCreate')
    // 把inject成员注入到vm上
    initInjections(vm) // resolve injections before data/props
    // 初始化 vm 的 _props/methods/_data/computed/watch
    initState(vm)
    // 初始化provide
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```