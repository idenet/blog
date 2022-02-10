/**
 * 手写object.create
 * const a = Object.create(b)
 * 原理：将创建的对象a的隐式原型指向b的显示原型
 */
function create (obj) {
  function F () {}
  F.prototype = obj
  return new F()
}

/**
 * 手写 instanceof 方法
 * 原理：右侧构造函数的prototype属性是否出现在左侧原型链中的任何位置
 */

function myInstanceof (left, right) {
  // 获取左侧的隐式原型
  let proto = Object.getPrototypeOf(left)
  // 获取右侧构造函数的原型
  let prototype = right.prototype

  while (true) {
    if (!proto) return false
    if (proto === prototype) return true

    proto = Object.getPrototypeOf(proto)
  }
}

/**
 * 手写 new 第一个参数是构造函数，后续参数是入参
 * 1. 通过arguments获取构造函数，
 * 2. 将对象的隐式原型指向构造函数的显示原型
 * 3. 设置this指向，执行构造函数代码
 * 4. 返回这个对象
 *
 *
 */

function create () {
  // 获得构造函数，同时删除arguments的第一个参数
  let Con = [].shift.call(arguments)
  if (typeof constructor !== 'function') {
    console.error('type error')
    return
  }
  // 2. 创建一个空对象并连接到原型，
  let obj = Object.create(Con.prototype)
  // 3. 绑定this实现，执行构造函数
  let ret = Con.apply(obj, arguments)
  // 4. 优先返回构造函数返回的对象
  return ret instanceof Object ? ret : obj
}

/**
 * 防抖
 * 原理：事件被触发n秒后执行回调，如果在n秒内又被触发就重新计时
 */

function debounce (fn, wait) {
  let timer = null
  return function () {
    let context = this,
      args = arguments
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}

/**
 * 节流
 * 1.指定单位时间，在这个单位时间内，事件只会触发一次
 */

function throttle (fn, delay) {
  let curTime = Date.now()
  return function () {
    let context = this,
      args = arguments,
      nowTime = Date.now()

    if (nowTime - curTime >= delay) {
      curTime = Date.now()
      return fn.apply(context, args)
    }
  }
}

/**
 * call
 * 原理：将this指向传入对象，并调用函数
 */

Function.prototype.myCall = function (context, ...args) {
  if (!context || context === null) {
    context = window
  }
  // 创建唯一的key值
  let fn = Symbol()
  // this指向调用call的函数
  context[fn] = this
  return context[fn](...args)
}

/**
 * apply
 * 原理 和 call相同但是第二个入参是数组
 */

Function.prototype.myApply = function (context, args) {
  if (!context || context === null) {
    context = window
  }
  let fn = Symbol()
  context[fn] = this
  return context[fn](...args)
}

/**
 * bind
 * 1. 支持参数合并
 * 2. 返回的是函数
 */

Function.prototype.myBind = function (context, ...args) {
  if (!context || context === null) {
    context = window
  }
  let fn = Symbol()
  context[fn] = this
  let _this = this
  const result = function (...innerArgs) {
    // 第一种情况 :若是将 bind 绑定之后的函数当作构造函数，通过 new 操作符使用，则不绑定传入的 this，而是将 this 指向实例化出来的对象
    // 此时由于new操作符作用  this指向result实例对象  而result又继承自传入的_this 根据原型链知识可得出以下结论
    // this.__proto__ === result.prototype   //this instanceof result =>true
    // this.__proto__.__proto__ === result.prototype.__proto__ === _this.prototype; //this instanceof _this =>true
    // 如果使用new  this指向当前实例
    if (this instanceof _this === true) {
      this[fn] = _this
      this[fn](...[...args, ...innerArgs])
    } else {
      // 如果是普通函数调用 this指向就是传入的context
      context[fn](...[...args, ...innerArgs])
    }
  }
  // 如果绑定的是构造函数，需要继承构造函数的原型链和方法
  result.prototype = Object.create(this.prototype)
  return result
}

/**
 * 实现一个compose函数
 * 利用 reducer实现
 */

// 用法如下:
function fn1 (x) {
  return x + 1
}
function fn2 (x) {
  return x + 2
}
function fn3 (x) {
  return x + 3
}
function fn4 (x) {
  return x + 4
}
const a = compose(fn1, fn2, fn3, fn4)

console.log(a(1)) // 1+4+3+2+1=11

function compose (...fn) {
  if (!fn.length) return v => v
  if (fn.length === 1) return fn[0]
  return fn.reduce((pre, cur) => (...args) => pre(cur(...args)))
}

/**
 * 用settimeout模拟 setinterval
 */

function mySetinterval (fn, t) {
  let timer = null
  function interval () {
    fn()
    timer = setTimeout(interval, t)
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
  constructor () {
    this.event = {}
  }
  // 实现订阅
  on (type, callback) {
    if (!this.events[type]) {
      this.events[type] = [callback]
    } else {
      this.events[type].push(callback)
    }
  }
  // 触发订阅
  emit (type, ...rest) {
    this.events[type] && this.events[type].forEach(fn => fn.apply(this, rest))
  }
  // 删除订阅
  off (type, callback) {
    if (!this.events[type]) return
    this.events[type] = this.events[type].filter(item => item !== callback)
  }
  // 只执行一次
  once (type, callback) {
    function fn () {
      callback()
      this.off(type, fn)
    }
    this.on(type, fn)
  }
}
