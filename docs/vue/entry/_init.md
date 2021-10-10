# initMixin中的_init方法解读

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
    // 是否是vue实例，如果是就不需要进行响应式处理
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

## initLifecycle

主要是将`vm`push到`options.parent.$children`中

```js
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  // 如果实例上的options有parent中那么将此vm，push到parent.$children
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```

## initEvents

```js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // 获取父元素上附加的事件
  const listeners = vm.$options._parentListeners
  if (listeners) {
    // 注册自定义事件
    updateComponentListeners(vm, listeners)
  }
}

let target: any

function add (event, fn) {
  target.$on(event, fn)
}

function remove (event, fn) {
  target.$off(event, fn)
}

function createOnceHandler (event, fn) {
  const _target = target
  return function onceHandler () {
    const res = fn.apply(null, arguments)
    if (res !== null) {
      _target.$off(event, onceHandler)
    }
  }
}
```

## initRender

该方法主要生成了`h`函数和定义了几个属性
1. `$attrs和$listeners`这两个属性通过`defineReactive`响应式
2. `$scope`和`$scopedSlots`

```js

export function initRender (vm: Component) {
  ...
  // render 方法
  // 1. 对编译生成的render函数进行渲染
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // 对手写的render函数进行渲染
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  ...
  /* istanbul ignore else */
  // 两个响应式属性定义
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}

```

## initInjections和initProvide

provide和inject之间的通信

```js
export function initInjections (vm: Component) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    toggleObserving(false)
    Object.keys(result).forEach(key => {
      ...
      // 将拿到的provided值响应式化
      defineReactive(vm, key, result[key])
    })
    toggleObserving(true)
  }
}
export function resolveInject (inject: any, vm: Component): ?Object {
  if (inject) {
    ...
    for (let i = 0; i < keys.length; i++) {
      ...
      // 将inject中的值作为provide中的key,通过vm._provided[key]获取，并赋给result
      const provideKey = inject[key].from
      let source = vm
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey]
          break
        }
        source = source.$parent
      }
      if (!source) {
       ...
      }
    }
    return result
  }
}
// provide: 执行赋值或者执行方法
export function initProvide (vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}

```