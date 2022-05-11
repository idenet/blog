# event loop 

渲染是宏任务，setTimeout也是宏任务

渲染之前  Date.now

setTimeout  Date.now

2个相减

```js
<ul id="container"></ul>

// 插入10w数据
const total = 100000
// 获取容器
let ul = document.getElementById('container')
// 插入10w数据
for(let i=0;i< total; i++) {
  let li = document.createElement('li')
  li.innerText = ~~(Math.random() * total)
  ul.appendChild(li)
}

console.start()
setTimeout(() => {
  console.end()
}, 0)

```

## JS为什么要区分微任务和宏任务？

为了插队。
一个Event Loop，Microtask 是在 Macrotask 之后调用，Microtask 会在下一个Event Loop 之前执行调用完，并且其中会将 Microtask 执行当中新注册的 Microtask 一并调用执行完，然后才开始下一次 Event loop，所以如果有新的 Macrotask 就需要一直等待，等到上一个 Event loop 当中 Microtask 被清空为止。由此可见， 我们可以在下一次 Event loop 之前进行插队。如果不区分 Microtask 和 Macrotask，那就无法在下一次 Event loop 之前进行插队，其中新注册的任务得等到下一个 Macrotask 完成之后才能进行，这中间可能你需要的状态就无法在下一个 Macrotask 中得到**同步**。
**状态的同步对于视图**来说至关重要，这也就牵扯到了为什么 javascript 是单线程的原因所在。

## const let var

在`es6`中`const`赋值的基本类型不能被再次修改，引用类型的属性可以被修改；`const`和`let`都具有块级作用域。它们都有暂时性死区，即我们不能在未定以前使用，
`var、const、let`都有在解析代码时会将声明放到顶部，但是`var`同时会赋值`undefined`，其他两个不会。

那么如何实现用`es5`实现一个`const`；核心就是使用拦截器，来将`set`进行拦截

```js
// 使用拦截器对重新赋值进行拦截
function _const (key, value) {
  window[key] = value
  Object.defineProperty(window, key, {
    enumerable: false,
    get () {
      return value
    },
    set (newval) {
      if (value !== newval) throw TypeError('不能对当前属性重新赋值')
    }
  })
}

_const('a', 1)
_const('a', 2)
```

## 图片懒加载

```js
// 获取所有的图片标签
const imgs = document.getElementsByTagName('img')
// 获取可视区域高度
const viewHeight =
  window.innerHeight || document.documentElement.clientHeight
// 统计当前显示到了那张图片
let num = 0
function lazyload () {
  for (let i = num; i < imgs.length; i++) {
    // 获取判断元素露出
    let distance = viewHeight - imgs[i].getBoundingClientRect().top
    if (distance >= 0) {
      // 给元素写入真实的src，展示图片
      imgs[i].src = imgs[i].getAttribute('data-src')
      // 前i张图片已经加载完毕，下次从第i+1张开始检查是否露出
      num = i + 1
    }
  }
}
// 监听scroll 事件
window.addEventListener('scroll', lazyload, false)
```

## 手写 call apply bind

手写`call`，几个主要关键点

1. 判断当前调用的是`function`，如果是报错
2. 判断存在传入对象
3. 将调用方法赋值到对象上，然后执行
4. 返回执行结果

```js
Function.prototype.mycall = function(context) {
  // 判断是否是函数
  if(typeof this !== 'function') {
    throw new Error('type error')
  }
  // 获取参数
  let args = [...arguments].slice(1),
  result = null
  // 判断context 是否传入 如果未传入是window
  let context = context || window
 // 将 调用函数设置为对象的方法
 context.fn = this
 // 调用函数
 result = context.fn(...args)
 // 将属性删除
 delete context.fn
 return result
}
```

手写`apply`，主要关键点

处理参数处理上不同，其他是一样的

```js
Function.prototype.myapply = function(context) {
  // 判断是否是函数
  if(typeof this !== 'function') {
    throw new Error('type error')
  }
  let result = null

  // 判断传入的context 是否为空
  let context= context || window
  // 将调用函数赋值给对象
  context.fn = this
  // apply 传入的是数组，参数处理上稍有不同
  if(arguments[1]) {
    result = context.fn(...arguments[1])
  }else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```

手写 `bind`，`bind`的实现是重点，首先需要明白其 两个特点

1. `bind`的第二个及其以后的参数可传可不传，传了会作为原函数的参数调用，并且如果原函数还有参数，那么两个会按照顺序调用
2. `bind`的返回函数还可以作为`new`操作符的构造函数

```js
Function.prototype.mybind = function(context) {
    // 判断是否是函数
  if(typeof this !== 'function') {
    throw new Error('type error')
  }
  let args = [...arguments].slice(1),
  fn = this
  return function Fn() {
    // 根据调用方式不同，传入不同的值
    return fn.apply(
      this instanceof Fn ? this: context, // 处理new 操作符和普通调用
      args.concat(...arguments)
    )
  }
}
```

