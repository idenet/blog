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

/**
 * 数组去重
 */

function uniqueArr (arr) {
  return [...new Set(arr)]
}

/**
 * 数组扁平化
 */

function flatter (arr) {
  if (!arr.length) return
  return arr.reduce(
    (pre, cur) => (Array.isArray(cur) ? [...pre, flatter(cur)] : [...pre, cur]),
    []
  )
}

/**
 * 迭代的方法实现数组扁平化
 */

function flatter2 (arr) {
  if (!arr.length) return
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

/**
 * 寄生组合继承
 */

function Parent (name) {
  this.name = name
  this.say = () => {
    console.log(this.name)
  }
}

Parent.prototype.play = () => {
  console.log(222)
}
function Children (name) {
  Parent.call(this)
  this.name = name
}
Children.prototype = Object.create(Parent.prototype)
Children.prototype.constructor = Children

/**
 * 实现有并行限制的promise调度器
 * 题目描述:JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个
 *  addTask(1000,"1");
 addTask(500,"2");
 addTask(300,"3");
 addTask(400,"4");
 的输出顺序是：2 3 1 4

 整个的完整执行流程：

一开始1、2两个任务开始执行
500ms时，2任务执行完毕，输出2，任务3开始执行
800ms时，3任务执行完毕，输出3，任务4开始执行
1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
1200ms时，4任务执行完毕，输出4

 */

class Scheduler {
  constructor (limit) {
    this.queue = []
    this.maxCount = limit
    this.runCounts = 0
  }
  add (time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order)
          resolve()
        }, time)
      })
    }
    this.queue.push(promiseCreator)
  }
  taskStart () {
    for (let i = 0; i < this.maxCount; i++) {
      this.request()
    }
  }
  request () {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount)
      return
    this.runCounts++
    this.queue
      .shift()()
      .then(() => {
        this.runCounts--
        this.request()
      })
  }
}

const scheduler = new Scheduler(2)

const addTask = (time, order) => {
  scheduler.add(time, order)
}
addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
scheduler.taskStart()

/**
 * 深拷贝
 */

function isObject (val) {
  return typeof val === 'object' && val !== null
}

function deepClone (obj, hash = new WeakMap()) {
  if (!isObject(obj)) return obj
  if (hash.has(obj)) {
    return hash.get(obj)
  }
  let target = Array.isArray(obj) ? [] : {}
  hash.set(obj, target)
  Reflect.ownKeys(obj).forEach(item => {
    if (isObject(obj[item])) {
      target[item] = deepClone(obj[item], hash)
    } else {
      target[item] = obj[item]
    }
  })
  return target
}

/**
 * 柯里化实现，部分求值，吧接收多个参数的函数转变成接收一个参数的函数
 *  用法如下：
 const add = (a, b, c) => a + b + c;
 const a = currying(add, 1);
 console.log(a(2,3))
 */

function curring (fn, ...args) {
  const length = fn.length
  let allArgs = [...args]
  const res = (...newArgs) => {
    allArgs = [...allArgs, ...newArgs]
    if (allArgs.length === length) {
      return fn(...allArgs)
    } else {
      return res
    }
  }
  return res
}

/**
 * 排序算法
 * 1. 实现一个冒泡算法
 *
 */

function bubbleSort (arr) {
  // 缓存数组长度
  const len = arr.length
  // 外层循环用于从头到尾的比较
  for (let i = 0; i < len; i++) {
    // 内层循环用于完成每一轮遍历过程中的重复比较
    for (let j = 0; j < len - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}

/**
 * 2. 选择排序
 */

function selectSort (arr) {
  const len = arr.length
  let minIndex
  for (let i = 0; i < len - 1; i++) {
    minIndex = i
    for (let j = i; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    // 如果minIndex对应元素不是目前的头部元素，则交换两者
    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}

function insertSort (arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i
    let target = arr[j]
    while (j > 0 && arr[j - 1] > target) {
      arr[j] = arr[j - 1]
      j--
    }
    arr[j] = target
  }
  return arr
}

function quickSort (arr) {
  if (arr.length < 2) {
    return arr
  }
  const cur = arr[arr.length - 1]
  const left = arr.filter((v, i) => v <= cur && i !== arr.length - 1)
  const right = arr.filter(v => v > cur)
  return [...quickSort(left), cur, ...quickSort(right)]
}

/**
 * 归并排序
 */
function merge (left, right) {
  let res = []
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      res.push(left[i])
      i++
    } else {
      res.push(right[j])
      j++
    }
  }
  if (i < left.length) {
    res.push(...left.slice(i))
  } else {
    res.push(...right.slice(j))
  }
  return res
}

function mergeSort (arr) {
  if (arr.length < 2) {
    return arr
  }
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  return merge(left, right)
}

/**
 * 二分查找
 */

function searchSort (arr, target, start, end) {
  let targetIndex = -1

  let mid = Math.floor((start + end) / 2)

  if (arr[mid] === target) {
    targetIndex = mid
    return targetIndex
  }

  if (start >= end) {
    return targetIndex
  }

  if (arr[mid] < target) {
    return search(arr, target, mid + 1, end)
  } else {
    return search(arr, target, start, mid - 1)
  }
}

/**
 * 实现 lazyMan
 * 实现一个LazyMan，可以按照以下方式调用:
LazyMan(“Hank”)输出:
Hi! This is Hank!

LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
Hi! This is Hank!
//等待10秒..
Wake up after 10
Eat dinner~

LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMan(“Hank”).eat(“supper”).sleepFirst(5)输出
//等待5秒
Wake up after 5
Hi This is Hank!
Eat supper
 */

/**
 * 版本号排序的方法
 * 有一组版本号如下['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']。现在需要对其进行排序，排序的结果为 ['4.3.5','4.3.4.5','2.3.3','0.302.1','0.1.1']
 */

arr.sort((a, b) => {
  let i = 0
  const arr1 = a.split('.')
  const arr2 = b.split('.')

  while (true) {
    const s1 = arr1[i]
    const s2 = arr2[i]
    i++
    if (s1 === undefined || s2 === undefined) {
      return arr2.length - arr1.length
    }
    if (s1 === s2) continue

    return s2 - s1
  }
})
