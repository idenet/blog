// 最基本的响应式系统

// 存储副作用的桶

const bucket = new Set()

const data = { text: 'hello world' }

const obj = new Proxy(data, {
  get (target, key) {
    bucket.add(effect)
    return target[key]
  },
  set (target, key, newval) {
    target[key] = newval
    bucket.forEach(fn => fn())
    return true
  }
})

// 副作用函数
function effect () {
  document.body.innerHTML = obj.text
}
// 执行副作用函数， 让代理进行收集
effect()

setTimeout(() => {
  obj.text = 'hello world3'
}, 1000)


// 改进
/**
 * 对应属性具有对应的副作用函数
 */



const buket = new WeakMap()
let activeEffect

const obj = new Proxy(data, {
  get (target, key) {
    track(target, key)
    return target[key]
  },
  set (target, key, newval) {
    target[key] = newval
    trigger(target, key)
  }
})

function effect (fn) {
  // 将副作用fn函数赋值给activeEffect
  activeEffect = fn
  fn()
}
// 追踪变化
function track (target, key) {
  if (!activeEffect) return
  // 根据target取出despMap
  let depsMap = bucket.get(target)
  if (!depsMap) {
    buket.set(target, (depsMap = new Map()))
  }
  // 根据key值从depsMap中取出deps，这是一个set类型，里面存储所有与当前key关联的effect函数
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}
// 触发变化
function trigger (target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}


/**
 * 1. effect函数内部存在一个三元表达式的时候，就会出现一个依赖分支切换。
 * 解决：每次get的时候都清空依赖并重新绑定
 * 第二版
 */

const buket = new WeakMap()
let activeEffect

const obj = new Proxy(data, {
  get (target, key) {
    track(target, key)
    return target[key]
  },
  set (target, key, newval) {
    target[key] = newval
    trigger(target, key)
  }
})

/**
 * version 1.2
 * @param {*} fn 
 */
function effect (fn) {
  const effectFn = () => {
    // 每次执行的时候，单其实主要是用于在set的时候执行这个effect的时候去清空
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  // effectFn.deps用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = []
  // 执行effectfn
  effectFn()
}

// 追踪变化
function track (target, key) {
  if (!activeEffect) return
  // 根据target取出despMap
  let depsMap = bucket.get(target)
  if (!depsMap) {
    buket.set(target, (depsMap = new Map()))
  }
  // 根据key值从depsMap中取出deps，这是一个set类型，里面存储所有与当前key关联的effect函数
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  // 最后一步 上面deps就是一个与当前副作用函数相关的依赖集合
  // 将其添加到之前定义的数组中
  activeEffect.deps.push(deps)
}
// 触发变化
function trigger (target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)

  // for循环中边删除 边添加会无限循环，需要另一个set来承载
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => effectsToRun.add(effectFn))
  effectsToRun.forEach(effectFn => effectFn())
  // effects && effects.forEach(fn => fn())
}


function cleanup (effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  // 重置数组
  effectFn.deps.length = 0
}