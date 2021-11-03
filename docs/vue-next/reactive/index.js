/**
 * 判断是否是对象
 * @param {*} val
 * @returns
 */
const isObject = (val) => val !== null && typeof val === 'object'
/**
 * 判断是否是对象，如果是对象就调用reactive，如果不是就返回
 * @param {*} target
 * @returns
 */
const convert = (target) => (isObject(target) ? reactive(target) : target)

export function reactive(target) {
  if (!isObject(target)) return
  const handler = {
    get(target, key, receiver) {
      // 收集依赖
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      // 判断获取的值，是否是对象
      return convert(result)
    },
    set(target, key, value, receiver) {
      // 获取旧值，判断新旧值是否想等
      const oldValue = Reflect.get(target, key, receiver)
      // 定义一个布尔类型的变量用来返回，proxy的set不返回会报错
      let result = true
      if (oldValue !== value) {
        result = Reflect.set(target, key, value, receiver)
        //触发更新
        trigger(target, key)
      }
      return result
    },
    deleteProperty(target, key) {
      // 用于接收，成员是否在对象中
      const hadKey = Reflect.has(target, key)
      // 用于接收 delete会返回一个布尔值
      const result = Reflect.deleteProperty(target, key)
      // 判断属性是否在对象上，并且是否删除成功，如果是，返回true
      if (hadKey && result) {
        //触发更新
        trigger(target, key)
      }
      return result
    },
  }
  return new Proxy(target, handler)
}

// 记录的callback 用于track可返回的callback函数，
let activeEffect = null

export function effect(callback) {
  activeEffect = callback
  // 访问响应式对象属性，去收集依赖
  callback()
  // 收集依赖结束，赋值为null
  activeEffect = null
}

// 全局的target弱引用map
let targetMap = new WeakMap()

/**
 * 收集依赖
 * @param {*} target
 * @param {*} key
 */
export function track(target, key) {
  // 判断activeEffect是否存储，如果没有就直接返回，说明不需要收集
  if (!activeEffect) return
  // 获取depsMap
  let depsMap = targetMap.get(target)
  // 如果没有找到的话，要给当前的目标对象创建一个 depsMap ，并且添加到 targetMap 中。
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 去map中拿effect依赖的集合
  let dep = depsMap.get(key)
  // 如果没有找到当前属性的dep集合，创建一个空的set
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  // 最后将当前effect存储到dep中
  dep.add(activeEffect)
}

/**
 * 触发更新
 * @param {*} target
 * @param {*} key
 * @returns
 */
export function trigger(target, key) {
  // 获取targetmaps中的depsmap
  const depsMap = targetMap.get(target)
  // 如果没有拿到直接返回
  if (!depsMap) return
  // 获取对应属性的effect依赖集合
  const dep = depsMap.get(key)
  // 如果存在dep则循环执行回调
  if (dep) {
    dep.forEach((effect) => {
      effect()
    })
  }
}

export function ref(raw) {
  // 判断 raw 是否是ref 创建的对象，如果是的话直接返回
  if (isObject(raw) && raw.__v_isRef) return

  // 判断是否是对象，是的话创建一个响应式对象，如果是原始值直接返回
  let value = convert(raw)

  const r = {
    // ref持有的属性，
    __v_isRef: true,
    // 获取value值
    get value() {
      // 对value值收集依赖
      track(r, 'value')
      // 返回value
      return value
    },
    set value(newValue) {
      // 判断新旧的值是否不相等
      if (newValue !== value) {
        // 这里要注意，要把 newValue 赋值给 raw，要把原来的 raw 替换掉
        // 且也要判断新值是否是对象
        raw = newValue
        value = convert(raw)
        // 触发更新
        trigger(r, 'value')
      }
    },
  }
  return r
}

export function toRefs(proxy) {
  // 因为 proxy 这个参数，有可能是响应式数组，也有可能是响应式对象。
  const ret = proxy instanceof Array ? new Array(proxy.length) : {}

  //循环遍历所有属性，把每个属性都转换成类似于ref创建的对象
  for (const key in proxy) {
    ret[key] = toProxyRef(proxy, key)
  }
  return ret
}
/**
 * 响应式对象
 * @param {object} proxy 响应式对象
 * @param {strig} key 属性名称
 */
function toProxyRef(proxy, key) {
  const r = {
    __v_isRef: true,
    get value() {
      // 这里不需要在收集依赖了，因为在reactive中读取属性时，自动收集了依赖了。
      return proxy[key]
    },
    set value(newValue) {
      // 这里不需要在触发更新了，因为在reactive中设置属性时，设置了触发更新。
      proxy[key] = newValue
    },
  }
  return r
}

export function computed(getter) {
  // 创建一个空的ref对象，它的value值是undefined
  const ret = ref()
  // 收集依赖，在effect中返回属性时，会去收集依赖
  // 当数据变化时，会重新执行effect函数
  effect(() => (ret.value = getter()))

  return ret
}
