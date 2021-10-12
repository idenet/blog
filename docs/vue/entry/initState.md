# initState 

它初始化了_props/methods/_data/computed/watch等方法，并且和响应式强相关

主体方法很短

```js
export function initState (vm: Component) {
  // 初始化watchers位一个数组
  vm._watchers = []
  const opts = vm.$options
  // 如果有props则初始化props，是components相关
  if (opts.props) initProps(vm, opts.props)
  // 如果有methods属性，初始化methods
  if (opts.methods) initMethods(vm, opts.methods)
  // 这里就是响应式data的入口
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  // 初始化computed
  if (opts.computed) initComputed(vm, opts.computed)
  // 初始化watcher
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

## initProps
初始化`props`属性，将props的数据转换成响应式数据，并注入到vm实例


```js
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  // 定义props属性 冰赋值为空
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  // 循环传进来的props对象, 除去一些判断，就是将propsOptions中的属性通过defineReactive注入到props中来，并转换成get/set
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      ...
      defineReactive(props, key, value, () => {
        ...
      })
    } else {
      defineReactive(props, key, value)
    }
    // 如果key值在vm中不存在，也注入到vm._props中来
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}
```

## initMethods

- 判断是否是对象，判断是否在`vm`实例和`props`中存在。然后注入到`vm[key]`中。

## initData

主要作用是对组件和实例上的`data`属性进行响应式处理

```js
function initData (vm: Component) {
  let data = vm.$options.data
  // 初始化_data,组件中的data是函数，调用函数返回结果对象
  // 否则就直接返回对象
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  // proxy data on instance
  // 获取data中的所有属性
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    ... // 重名判断
    // 判断是否以_开头
    if (!isReserved(key)) {
      // 将所有key值，注入到vm实例 this._data[key]
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  // 将data转换成响应式对象
  observe(data, true /* asRootData */)
}

```

### proxy(vm, '_data', key)

这行代码其实就是`this.xxx`能触发响应式修改`this._data.xx`的核心，它吧`this.xxx`代理到了`this._data.xx`

```js
export function proxy (target: Object, sourceKey: string, key: string) {
  // 这里代理了vm._data.xxx
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  // 这块代理了 vm.key.xxx
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

