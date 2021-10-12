# new Observer()

直接看源码，Observer对象是响应式的入口，也是核心，该文件在`observer/index.js`， 所有的响应式相关都在该`observer`文件夹下

```js
export class Observer {
  // 观测对象
  value: any;
  // 依赖对象
  dep: Dep;
  // 实例计数器
  vmCount: number; // number of vms that have this object as root $data
  constructor (value: any) {
    this.value = value
    // dep 对象用于收集依赖
    this.dep = new Dep()
    // 初始化实例的vmCount 为0
    this.vmCount = 0
    // 将实例挂载到观察对象的__ob__属性
    def(value, '__ob__', this)
    // 处理数组的响应式
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 为数组中的每一个对象创建一个observer实例
      this.observeArray(value)
    } else {
      // 遍历对象中的每一个属性，转换成setter/getter
      this.walk(value)
    }
  }
  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    // 获取观察对象的每一个属性
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 遍历每一个属性，设置为响应式数据
      defineReactive(obj, keys[i])
    }
  }
  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

## 为一个对象定义一个响应式属性

::: warning
这里有属性依赖收集和派发，注意如果是深层对象，每一层对象都会有一个`dep`对象，在`get`的时候收集依赖，`set`的时候进行派发
:::

```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  // 浅|深 监听
  shallow?: boolean
) {
  // 创建依赖对象实例
  const dep = new Dep()
  // 获取 obj 的属性描述符对象
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
  // 提供预定义的存取器函数
  // 用户定义的get/set
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    // 获取value
    val = obj[key]
  }
  // 如果是深度监听，则调用observe并传入val
  let childOb = !shallow && observe(val)
  // 将属性加上get.set
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 如果预定义的getter存在，则value就是getter调用的返回值
      // 否则就是直接赋值
      const value = getter ? getter.call(obj) : val
      // 收集依赖，如果存在当前依赖目标，即watcher对象，则建立依赖 ---> depend方法
      // 这个地方很关键，看到这里直接看Dep相关。
      if (Dep.target) {
        dep.depend()
        // 如果子观察目标存在，则建立子对象的依赖关系
        if (childOb) {
          childOb.dep.depend()
          // 如果属性是数组，则特殊处理收集数组对象依赖
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      // 获取值，和get一样
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      // 新旧值判断是否想等，和nan
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // 如果没有setter则返回
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      // 如果预定义的setter存在则调用。否则直接更新
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 如果新值是对象，观察子对象并返回子的observer对象
      childOb = !shallow && observe(newVal)
      // 判罚更新，通知属性已修改
      dep.notify()
    }
  })
}
```

## 数组的响应式

这段方法中主要观察`arrayMethods`，其他判断可以不关心

```js
 if (hasProto) {
      protoAugment(value, arrayMethods)
    } else {
      copyAugment(value, arrayMethods, arrayKeys)
    }
    // 为数组中的每一个对象创建一个observer实例
    this.observeArray(value)
  }
```
看源码就很简单了，它就是将数组的能新增元素的方法，进行了扩展，将新增元素响应式化
并通知了dep更新dom

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
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```