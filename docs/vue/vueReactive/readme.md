# 数据响应式原理

## 看源码的时候思考以下问题

- vm.msg ={ count: 0 } 重新给属性赋值，是否是响应式
- vm.arr[0] = 4 给数组元素赋值，视图是否会更新
- vm.arr.length = 0 修改数组的length，视图是否会更新
- vm.arr.push(4) 视图是否会更新

## 响应式整体流程

[响应式流程图](https://e0v6qvjc33.feishu.cn/mindnotes/bmncnU1k3fa9xkY5SK6wOJJwHjf)

我们已经知道了整体的流程，在`_init`方法中，我们可以看到调用了`initState`方法。在`initState`方法中，我们可以看到

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  // 这里就是响应式的入口了
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
我们只要看当`opts.data`存在的时候就可以了。调用了`initData`，省略一些判断代码我们可以看到，这里就是循环`data`的`key`，
通过`proxy`将所有的`key`代理到了`vm`中。最后调用了`observe(data)`进入`data`的响应式流程

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  const keys = Object.keys(data)
  let i = keys.length
  while (i--) {
    const key = keys[i]
     if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```

```js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 是否存在ob，如果存在则直接赋值返回
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 创建一个Observer对象
    ob = new Observer(value)
  }
  // ob.vmCount++
  if (asRootData && ob) {
    ob.vmCount++
  }
  // 返回对象
  return ob
}
```