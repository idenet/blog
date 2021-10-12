# vue不同版本的介绍

1. 完整版：包含编译器和运行时版本
2. 编译器：用来将模板字符串编译成js渲染函数的代码
3. 运行时：用来创建vue实例、渲染并处理 虚拟dom的代码；除去编译器版本
4. umd：通用版本，vue.js默认文件就是运行时+编译器的umd版本
5. cjs：太老了不推荐
6. es Module：可被静态分析，可以被打包工具用来tree-shaking并将不用的代码排除出去

# 目录结构

```
|-- dist              # 构建目录
|-- flow              # flow的类型声明，类似于TypeScipt
|-- packages          # 衍生的npm包，例如vue-server-renderer和vue-template-compiler
|-- scripts           # 构建配置和构建脚本
|-- test              # 端到端测试和单元测试用例
|-- src               # 源代码
|   |-- compiler      # 编译相关代码
|   |-- core          # 核心代码
|   |-- platforms     # 跨平台
|   |-- server        # 服务端渲染
|   |-- sfc           # .vue文件解析逻辑
|   |-- shared        # 工具函数/共享代码
```
```
|-- core
|   |-- components      # 内部组件，只有keepalive
|   |-- global-api      # 全局API
|   |-- instance        # 实例化
|   |-- observer        # 响应式
|   |-- util            # 工具函数
|   |-- vdom            # 虚拟DOM
```

# 从入口开始

根据脑图大致了解vue初始化过程，在不同的md中有源码描述了vue的原型成员和静态成员的初始化

[newvue流程图](https://e0v6qvjc33.feishu.cn/mindnotes/bmncnTjMvH2xbiEwHCTmXZjB53d)

下面是总流程的源码是如何执行的。

1. 第一步`new vue()`，调用了`instance/index.js`文件中的函数，这里只是定义，不涉及`_init调用`。

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 调用initMixin中定义的init方法
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

2. 在调试过程中，执行完成`instance/index.js`的文件后，还有一个`core/index.js`会执行，`initGlobalAPI(Vue)`中赋值了所有的静态成员，在`vue静态成员初始化`中有详细描述

3. 到这里所有的vue初始化完成，此时开始执行构造函数中的`_init`方法

```js
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 缓存 vm实例
    const vm = this
    ...
    // expose real self
    vm._self = vm
    // 初始化生命周期
    initLifecycle(vm)
    // 初始化事件
    initEvents(vm)
    // 初始化render
    initRender(vm)
    // 回调
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }
    // 如果存在el 执行mounr方法，传入el
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

4. 执行`$mount`方法，`$mount`方法在`platform/web/entry-runtime-with-compiler`中

```js
// 缓存定义在原型链上的mount方法
const mount = Vue.prototype.$mount
// 重写$mount方法
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  // 如果不是render函数，需要将template转换成render函数
  if (!options.render) {
    ...
  }
  // 调用缓存的mount
  return mount.call(this, el, hydrating)
}
```

4. 之前定义的`mount`方法在`platforms\web\runtime\index.js`中，这里只判断，然后就会调用`mountComponent`方法

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 判断是不是在浏览器中，为什么要在判断一遍？因为有可能之前执行的是`entry-runtime`，
  // 也就是纯用render函数写的vue，所以需要在判断一遍
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // 判断是否存在render
  if (!vm.$options.render) {
    ...
  }
  // 执行beforeMount
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  // 主要是调用_update
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // 实例化Watcher， 里面会执行updateComponent的回调
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // 执行mounted钩子函数
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  // 返回实例
  return vm
}
```

5. `new Watcher()`，核心就是执行了`updateComponent`方法调用了`vm._update(vm._render(), hydrating)`，渲染了真实dom

```js
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    ... // 上面响应式相关的先不看，核心就是expOrfn就是之前的updateComponent
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    // 构造函数中会执行一次get方法，为了首次渲染
    this.value = this.lazy
      ? undefined
      : this.get()
  }
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 核心执行了updateComponent
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
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
}
```