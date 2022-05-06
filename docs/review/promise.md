# Promise

面试相关的`Promsie`是重点中的重点，首先我们先从手写简易的`promise`入手，之后再详细处理各种业务场景

先来看看`Promise`的用法

```js
const promise = new Promise((resolve, reject) => {
  // 异步执行成功
  resolve()
  // 异步执行失败
  reject()
})

promise.then(res => {
  // 触发成功回调
}, err => {
  // 触发失败回调
}).then(res => {
  // 第一个then 返回promise 可以链式调用
}).catch(err => {
  // 捕获错误
})

// 静态方法
Promsie.all()
Promsie.race()
```


### 初步实现

1. promise存在三种状态，`pending`，`fulfilled`，`reject`
2. `then`方法处理两种回调

```js
class MyPromise {
  constructor(fn) {
    // 表示状态
    this.state = 'pending'
    // 表示then注册的成功函数
    this.successFn = []
    // 表示then注册失败的函数
    this.failFn = []

    let resolve = (val) => {
      // 如果状态改变 promise就不能再次触发
      if (this.state !== 'pending') return
      // 成功触发则改变为成功状态
      this.state = 'success'
      // 为了确保执行顺序 需要异步
      setTimeout(() => {
        this.successFn.forEach(item => item.call(this, val))
      }, 0)
    }

    let reject = (err) => {
      // 如果状态改变 promise就不能再次触发
      if (this.state !== 'pending') return
      // 成功触发则改变为失败状态
      this.state = 'fail'
      setTimeout(() => {
        this.failFn.forEach((item) => item.call(this, err))
      })
    }

    // 调用函数
    try {
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  // 实例方法 then
  then (resolveCallback, rejectCallback) {
    // 判断回调是否是函数
    resolveCallback = typeof resolveCallback !== 'function' ? (v) => v : resolveCallback
    rejectCallback = typeof rejectCallback !== 'function' ? err => { throw err } : rejectCallback

    // 为了保持链式调用 继续返回 promise
    return new MyPromise((resolve, reject) => {
      // 将回调注册到 successfn中，注意这里不是执行，执行在最后的resolve
      this.successFn.push(val => {
        try {
          // 在这里执行回调
          let x = resolveCallback(val)
          //（最难的一点）
          // 如果回调函数结果是普通值 那么就resolve出去给下一个then链式调用  如果是一个promise对象（代表又是一个异步） 那么调用x的then方法 将resolve和reject传进去 等到x内部的异步 执行完毕的时候（状态完成）就会自动执行传入的resolve 这样就控制了链式调用的顺序
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      })

      this.failFun.push((val) => {
        try {
          //    执行回调函数
          let x = rejectCallback(val)
          x instanceof MyPromise ? x.then(resolve, reject) : reject(x)
        } catch (error) {
          reject(error)
        }
      })
    })
  }
}
```

### 实现all和race

```js
class MyPromise {
  
  static all (promiseArr) {
    let result = []
    // 声明一个计数器，每一个promise返回就加1
    let count = 0
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        // 这里 promise.resolve包装一下， 防止不是promise的类型传进来
        Promise.resolve(promiseArr[i]).then(
          (res) => {
            //这里不能直接push数组  因为要控制顺序一一对应
            result[i] = res
            count++
            // 只有全部的promise执行成功才resolve
            if (count === promiseArr.length) {
              resolve(result)
            }
          },
          err => {
            reject(err)
          }
        )
      }
    })
  }
  static race (promiseArr) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        Promise.resolve(promiseArr[i]).then(res => {
          //promise数组只要有任何一个promise 状态变更  就可以返回
          resolve(res)
        }, err => {
          reject(err)
        })
      }
    })
  }
}
```

这样基本的`promise`就实现完了，它只是基本的并不完全符合`A+`规范，只是让我们对`promise`有个在实现上的了解。
最重要的是，要去看一些关于`promise`在业务上的处理

### 如何实现一个可取消的`promise`

我们知道`Promise.race`方法又一个返回成功就返回，那么就可以用它来实现

```js
function wrap(pro) {
  let obj = {}
  p1 = new Promise((resolve, reject) => {
    obj.resolve = resolve
    obj.reject = reject
  })
  obj.promise = Promise.race(p1, pro)
  return obj
}

let testPro = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(123)
  }, 1000);
})
let wrapPro = wrap(testPro);
wrapPro.promise.then((res) => {
  console.log(res);
});
// 取消
wrapPro.resolve('取消了')
```

> 扩展 超过多长时间就取消

```js
Promise.race([promise1,timeOutPromise(5000)]).then(res=>{})
```

## 重试

可以重试请求的`request`

```js
function retryRequest (request, count) {
  let retryCount = 0
  return new Promise((resolve, reject) => {
    const retryFunc = () => {
      request().then(res => {
        resolve(res)
      }).catch(() => {
        if (retryCount < count) {
          retryCount++
          console.log(`重试次数：${retryCount}`)
          retryFunc()
        } else {
          retryCount = 0
          reject()
        }
      })
    }
    retryFunc()
  })
}
```

### 实现有并行限制的 promise 调度器

题目描述:JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个
addTask(1000,"1");
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

```js
class Scheduler {
  constructor(limit) {
    this.queue = []
    this.maxCount = limit
    this.runCounts = 0
  }
  add(time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order)
          resolve()
        }, time);
      })
    }
    this.queue.push(promiseCreator)
  }
  taskStart() {
    for(let i=0;i< this.maxCount; i++) {
      this.request()
    }
  }
  request() {
       if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount)
      return
      this.runCount++
      this.queue.shift()().then(() => {
        this.runCount--
        this.request()
      })
  }
}

const scheduler = new Scheduler(2)

const addTask =(time, order) => {
  scheduler.add(time, order)
}
addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
scheduler.taskStart()
```

### 红绿灯

题目：使用Promise实现红灯每隔3s亮一次，黄灯每隔2s亮一次，绿灯每隔1s亮一次，循环这个过程。

```js
function red() {
 console.log('red');
}
function green() {
 console.log('green');
}
function yellow() {
 console.log('yellow');
}
```

```js
const task = (light, timer) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(light ==='red') {
        red()
      } else if (light === 'yellow') {
        green()
      } else {
        yellow()
      }
      resolve()
    }, timer);
  })
}

const taskLoop = () => {
  // promise方案
  task('red', 3000)
  .then(() => task('yellow', 2000))
  .then(() => task('green', 1000))
  .then(taskLoop)  
}
  // async/await
// const taskLoop = async () => {
//   await task(3000, 'red')
//   await task(2000, 'green')
//   await task(1000, 'yellow')
//   taskLoop()
// }

taskLoop()
```