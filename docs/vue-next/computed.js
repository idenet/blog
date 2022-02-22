const buket = new WeakMap()

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
let activeEffect

// effect 栈
const effectStack = []

function effect (fn, options = {}) {
  const effectFn = () => {
    // 每次执行的时候，单其实主要是用于在set的时候执行这个effect的时候去清空
    cleanup(effectFn)
    activeEffect = effectFn
    // 存储到栈
    effectStack.push(effectFn)
    const res = fn()
    // 当副作用执行完毕后，将当前副作用函数弹出，并把effect指向原先的值
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    // 回调函数执行后的返回值
    return res
  }
  effectFn.options = options
  // effectFn.deps用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = []
  // 执行effectfn
  if (!options.lazy) {
    effectFn()
  }
  return effectFn
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
  effectsToRun.forEach(effectFn => {
    if (effectFn().options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
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


function computed (getter) {
  // 缓存value值
  let value
  // 只有脏时才求值
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,
    scheduler () {
      if (!dirty) {
        dirty = true
        trigger(obj, 'value')
      }
    }
  })

  const obj = {
    get value () {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      track(obj, 'value')
      return value
    }
  }
  return obj
}