/**
 * create 实现
 */

function create (obj) {
  function F () { }
  F.prototype = obj
  return new F()
}

/**
 * instanceof
 */

function myInstanceof (left, right) {
  let proto = Object.getPrototypeOf(left)
  let prototype = right.prototype
  while (true) {
    if (!proto) return false
    if (proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}

/**
 * 手写new
 * 1. 通过Object.create 生成空对象，并且空对象的隐式原型指向传入参数的显示原型
 * 2. 通过call方法或者apply方法执行构造函数，并且确定this指向
 * 3. 返回这个空对象或者构造函数执行后的对象
 */

function myNew (fn, ...args) {
  let obj = Object.create(fn.prototype)
  let res = fn.call(obj, ...args)
  if (res && (typeof res === 'object' || typeof res === 'function')) {
    return res
  }
  return obj
}

/**
 * 防抖
 * 事件触发后的n秒执行，如果n中再次触发了，就取消上一次的事件并且重新计时
 */

function debounce (fn, wait) {
  let timer = null
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.call(this, ...args)
    }, wait)
  }
}

/**
 * 节流
 * n秒内只触发一次事件
 */

function throttle (fn, delay) {
  let curTime = Date.now()
  return (...args) => {
    let nowTime = Date.now()
    if (nowTime - curTime >= delay) {
      curTime = Date.now()
      return fn.call(this, ...args)
    }
  }
}

/**
 * call 和 apply
 */

Function.prototype.myCall = function (context, ...args) {
  if (!context || context === null) {
    context = window
  }
  let fn = Symbol()
  context[fn] = this
  return context[fn](...args)
}

/**
 * bind
 * 返回一个函数
 * 具有 剩余参数合并功能
 * 可以被new 调用 注意this指向
 */

Funtion.prototype.myBind = function (context, ...args) {
  if (!context || context === null) {
    context = window
  }
  let fn = Symbol()
  context[fn] = this
  let _this = this
  const result = function (...innerArgs) {
    // 如果使用new 去调用bind返回的函数，那么this就中变成实例。并且_this是原型链上的this
    if (this instanceof _this === true) {
      this[fn] = _this
      this[fn](...[...args, ...innerArgs])
    } else {
      // 普通函数
      context[fn](...[...args, ...innerArgs])
    }
  }
  // 如果是构造函数需要继承构造函数上的原型方法
  result.prototype = Object.create(this.prototype)
  return result
}

/**
 * 实现 compose
 */

function compose (...fn) {
  if (!fn.length) return v => v
  if (fn.length == 1) return fn[0]
  return fn.reduce((pre, cur) => (...args) => pre(cur(...args)))
}

/**
 * settimeout 模拟 setinerval
 */

function myInterval (fn, time) {
  let timer = null
  function interval () {
    fn()
    timer = setTimeout(interval, time)
  }
  interval()
  return {
    cancel: () => clearTimeout(timer)
  }
}

/**
 * 发布订阅模式
 */


class EventEmitter {
  constructor() {
    this.events = {}
  }
  on (type, callback) {
    if (!this.events[type]) {
      this.events[type] = [callback]
    } else {
      this.events[type].push(callback)
    }
  }

  emit (type, ...args) {
    this.events[type] && this.events.forEach(fn => fn.apply(this, args))
  }

  off (type, callback) {
    if (!this.evetns[type]) return
    this.events[type] = this.events[type].filter(item => item !== callback)
  }

  once (type, callback) {
    function fn () {
      callback()
      this.off(type, fn)
    }
    this.on(type, fn)
  }
}