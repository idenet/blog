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
