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