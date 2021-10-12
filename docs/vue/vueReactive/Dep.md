# 依赖收集

`Dep`这个对象是依赖收集的核心，里面涉及到`get/set`的依赖收集和派发, `Dep`要看整个文件，里面的内容都很重要。
回忆一下，在我们执行`_init`的时候，执行了`$mount`，`$mount`其实就是执行了`mountComponent`，
其中的`new Watcher`将`vm._update`在`get`的时候执行了。而这个get方法中，有两个方法和这里强相关，看代码

```js

  get () {
    // pushTarget将Watcher实例传入，调用的就是Dep里的方法
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 核心执行了updateComponent
      value = this.getter.call(vm, vm)
    } catch (e) {
      ...
    } finally {
      ...
      // 执行完成之后弹出
      popTarget()
      // 并且清理了依赖
      this.cleanupDeps()
    }
    return value
  }
```
这里vue将`Dep.target`指向了`watcher`， 那么下面的`Dep.target.addDep(this)`(想想vue之前在observer的get中调用
了dep.depend)，其实就是指向了`watcher`的`addDep`方法， 那么继续看Watcher.md

```js
let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  // 收集依赖
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
  // observer中调用了depend方法，注意 Dep.target就是watcher， 
  // 所以这里其实调用的watcher的 addDep方法，并把dep传入
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      // 调用每个订阅者的update方法
      subs[i].update()
    }
  }
}

// Dep.target用来存放目前正在使用的watcher
// 全局唯一，并且一次也只能有一个watcher被使用

Dep.target = null
const targetStack = []

// 入栈并将当前 watcher 赋值给了Dep.target
export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

```