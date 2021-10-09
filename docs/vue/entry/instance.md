# vue构造函数的流程

主要是了解在`src\core\instance\index.js`中的几个方法

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
// 注册vm的_init方法 ，初始化vm
initMixin(Vue)
// 注册vm$data/$set/$delete/$watch
stateMixin(Vue)
// 初始化事件相关，$on/$once/$off/$emit 发布订阅
eventsMixin(Vue)
// 初始化生命周期方法
// _update/$forceUpdate/$destory
lifecycleMixin(Vue)
// render
// $nextTick/_render
renderMixin(Vue)

export default Vue
```

## initMixin

该函数分到单独一个文档解读。

## stateMixin

```js
export function stateMixin (Vue: Class<Component>) {
  const dataDef = {}
  dataDef.get = function () { return this._data }
  const propsDef = {}
  propsDef.get = function () { return this._props }
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
    propsDef.set = function () {
      warn(`$props is readonly.`, this)
    }
  }
  // 监听$data、$props，拒绝用户的错误操作
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)
  // 定义$set,$delete
  Vue.prototype.$set = set
  Vue.prototype.$delete = del
  // 全局的watch方法
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    // 和响应式有关，后续看
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      const info = `callback for immediate watcher "${watcher.expression}"`
      pushTarget()
      invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
      popTarget()
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```

## eventsMixin

通过发布订阅模式，在Vue原型上定义了4个方法

```js
export function eventsMixin (Vue: Class<Component>) {
  const hookRE = /^hook:/
  Vue.protottype.$on = xx
  Vue.protottype.$once = xx
  Vue.protottype.$off = xx
  Vue.protottype.$emit = xx
}
```