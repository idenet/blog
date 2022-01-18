# event loop 

渲染是宏任务，setTimeout也是宏任务

渲染之前  Date.now

setTimeout  Date.now

2个相减

```js
<ul id="container"></ul>

// 记录开始时间
let now = Date.now()
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

console.log('js运行时间', Date.now() - now)
setTimeout(() => {
  console.log('运行总时间', Date.now() - now)
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