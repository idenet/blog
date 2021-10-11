
# 重写了数组的某些方法

```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // 缓存原来方法
  const original = arrayProto[method]
  // 调用Object.defineProperty 重新定义修改数组方法
  def(arrayMethods, method, function mutator (...args) {
    // 执行数组原来的方法
    const result = original.apply(this, args)
    // 获取数组对象的ob属性
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        // 存储第三个值
        inserted = args.slice(2)
        break
    }
    // 遍历数组，吧数组的每一个元素转换成响应式对象
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 调用了修改数组的方法，调用数组的ob对象发送通知
    ob.dep.notify()
    return result
  })
})
```

## watcher

```js
// 如果exporfn 是函数 直接赋值
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // 如果是对象即 {'person.name':function....}
      // parsePath获取person.name的值，即一个函数
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
```
