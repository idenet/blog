## LazyMan

```
实现一个LazyMan，可以按照以下方式调用:
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
```

实现一种是基于自动`next`的执行，一种是基于`promise`队列

```js
class _LazyMan {
  constructor (name) {
    this.tasks = []
    const task = () => {
      console.log(`Hi! This is ${name}!`)
      this.next()
    }
    this.tasks.push(task)
    setTimeout(() => {
      // 把 this.next() 放到调用栈清空之后执行
      this.next()
    }, 0)
  }
  next () {
    const task = this.tasks.shift() // 执行第一个任务
    task && task()
  }

  sleep (time) {
    this._sleepwrapper(time, false)
    return this
  }

  sleepFirst (time) {
    this._sleepwrapper(time, true)
    return this
  }

  _sleepwrapper (time, flag) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`)
        this.next()
      }, time * 1000)
    }
    if (flag) {
      this.tasks.unshift(task) // 放到任务队列顶部
    } else {
      this.tasks.push(task)
    }
  }
  eat (name) {
    const task = () => {
      console.log(`Eat ${name}`)
      this.next()
    }
    this.tasks.push(task)
    return this
  }
}

function LazyMan (name) {
  return new _LazyMan(name)
}

console.log(
  LazyMan('hank')
    .sleep(2)
    .eat('dinner')
)
```

```js
function LazyMan (name) {
  const { log } = console
  const sleep = s =>
    new Promise(res =>
      setTimeout(() => log(`Wake up after ${s}`) || res(), s * 1000)
    )
  // 定义队列并切设置第一个任务
  const queue = [() => log(`Hi! This is ${name}!`)]

  // 这个里用了 push(x) && ctx
  // push 的返回值是数组 push 后的长度 所以不会出现 0 , 可以放心在箭头函数里使用
  const ctx = {
    eat: food => queue.push(() => log(`Eat ${food}~`)) && ctx,
    sleep: s => queue.push(() => sleep(s)) && ctx,
    sleepFirst: s => queue.unshift(() => sleep(s)) && ctx
  }

  // 延迟在下一个周期执行, 为了收集执行的任务
  queueMicrotask(async () => {
    while (queue.length) {
      await queue.shift()()
    }
  })
  return ctx
}
```

## 实现链式调用

```js
const data = [
  { name: 'foo', age: 16, city: 'shanghai' },
  { name: 'bar', age: 24, city: 'hangzhou' },
  { name: 'fo1', age: 22, city: 'shanghai' },
  { name: 'baz', age: 19, city: 'hangzhou' }
]

// query(data)
//   .where(item => item.age > 18)
//   .orderBy('age')
//   .groupBy('city')
//   .excute()

// 结果返回

res = [
  [
    {
      name: 'bar',
      age: 24,
      city: 'hangzhou'
    },
    { name: 'baz', age: 19, city: 'hangzhou' }
  ],
  [{ name: 'fo1', age: 22, city: 'shanghai' }]
]

/**
 * orderBy(key, desc) 根据key 升序， desc：true 降序
 * where 根据条件帅选
 * groupBy 分组
 * excute 执行
 */
```

```js
class Query {
  constructor (data) {
    this.data = data
    this.tasks = []
  }
  where (fn) {
    this.tasks.push(() => {
      this.data = this.data.filter(fn)
    })
    return this
  }
  orderBy (key, desc = false) {
    this.tasks.push(() => {
      this.data.sort((a, b) => {
        if (desc) {
          return b[key] - a[key]
        } else {
          return a[key] - b[key]
        }
      })
    })
    return this
  }
  groupBy (name) {
    this.tasks.push(() => {
      let obj = {}
      this.data.forEach(item => {
        if (obj[item[name]]) {
          obj[item[name]].push(item)
        } else {
          obj[item[name]] = [item]
        }
      })
      this.data = Object.values(obj)
    })
    return this
  }
  excute () {
    this.tasks.forEach(fn => fn())
    return this.data
  }
}

function query (data) {
  return new Query(data)
}

console.log(
  query(data)
    .where(item => item.age > 18)
    .orderBy('age')
    .groupBy('city')
    .excute()
)

```