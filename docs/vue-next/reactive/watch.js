// 存储副作用函数的桶
const bucket = new WeakMap()

// 原始数据
const data = { foo: 1, bar: 2 }
// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get (target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key)
    // 返回属性值
    return target[key]
  },
  // 拦截设置操作
  set (target, key, newVal) {
    // 设置属性值
    target[key] = newVal
    // 把副作用函数从桶里取出并执行
    trigger(target, key)
  }
})

function track (target, key) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

function trigger (target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)

  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
  // effects && effects.forEach(effectFn => effectFn())
}

// 用一个全局变量存储当前激活的 effect 函数
let activeEffect
// effect 栈
const effectStack = []

function effect (fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    // 当调用 effect 注册副作用函数时，将副作用函数复制给 activeEffect
    activeEffect = effectFn
    // 在调用副作用函数之前将当前副作用函数压栈
    effectStack.push(effectFn)
    const res = fn()
    // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并还原 activeEffect 为之前的值
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]

    return res
  }
  // 将 options 挂在到 effectFn 上
  effectFn.options = options
  // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  if (!options.lazy) {
    effectFn()
  }

  return effectFn
}

function cleanup (effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}


function traverse (value, seen = new Set()) {
  // 如果要读取的数据是原始值，或者已经读取过了 就什么也不做，
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  // 将数据添加到seen中，代表遍历的读取过了，避免循环引用引起死循环
  seen.add(value)
  // 暂时不考虑数组，只考虑对象
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}


/**
 * 
 * @param {*} source 响应式数据 
 * @param {*} cb 回调函数
 */
function watch (source, cb, options = {}) {

  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue, newValue
  // 用来存储用户注册的过期函数
  let cleanup

  function oninvalidate (fn) {
    cleanup = fn
  }

  const job = () => {
    // 在scheduler中执行副作用函数拿到的是新值
    newValue = effectFn()
    // 在调用回调函数之前，先调用过期函数
    if (cleanup) {
      cleanup()
    }
    // 当数据变化时调用 cb
    cb(newValue, oldValue, oninvalidate)
    // 更新旧值
    oldValue = newValue
  }

  const effectFn = effect(() => getter(), {
    // 懒执行的副作用函数
    lazy: true,
    scheduler: () => {
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job()
      }
    }
  })

  if (options.immediate) {
    job()
  } else {
    // 手动调用拿到旧值
    oldValue = effectFn()
  }
}