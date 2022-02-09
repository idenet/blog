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
