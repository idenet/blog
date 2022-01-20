# 设计模式

## 工厂模式

抽象工厂是后端常用的一种模式，在前端也能发挥巨大作用。比如我们先定义一个抽象手机类

```js
class mobileFactory {
  // 提供操作系统接口
  createOS() {
    throw new Error('抽象工厂方法不允许直接调用，你需要将我重写！')
  }
  // 提供硬件接口
  createHardware() {
    throw new Error('抽象工厂方法不允许直接调用，你需要将我重写！')
  }
}
```
之后定义一个具体工厂来实例化接口

```js
class  FakerStartFactory extends mobileFactory {
  createOS() {
    // 提供安卓系统实例
    return new AndroidOS()
  }
  createHardWare() {
    // 提供高通硬件实例
    return new QualcommHardWare()
  }
}
```
那么我们知道每个手机都有不同的操作系统和硬件，那么应该有一个抽象的功能类和具体的功能类

```js
// 定义操作系统这类产品的抽象产品类
class OS {
    controlHardWare() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
    controlHardWare() {
        console.log('我会用安卓的方式去操作硬件')
    }
}

class AppleOS extends OS {
    controlHardWare() {
        console.log('我会用🍎的方式去操作硬件')
    }
}

// 定义手机硬件这类产品的抽象产品类
class HardWare {
    // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
    operateByOrder() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
    operateByOrder() {
        console.log('我会用高通的方式去运转')
    }
}

class MiWare extends HardWare {
    operateByOrder() {
        console.log('我会用小米的方式去运转')
    }
}
```
好，现在我们生产一台手机就可以

```js
// 这是我的手机
const myPhone = new FakeStarFactory()
// 让他拥有操作系统
const myOS = myPhone.createOS()
// 让它拥有硬件
const myHardWare = myPhone.createHardWare()
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare()
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder()
```
这时候如果`FakeStarFactory`不需要了，我们只需要重新实现抽象的手机类就可以。

```js
class newStarFactory extends MobilePhoneFactory {
  createOS() {
      // 操作系统实现代码
  }
  createHardWare() {
      // 硬件实现代码
  }
}
```

这就是所谓的**开放封闭原则**

## 单例模式


```js
class singleDog {
  show() {
    console.log('我是一个单例对象')
  }
  static getIntance() {
    if(!singleDog.instance) {
      singleDog.instance = new singleDog()
    }
    return singleDog
  }
}
```

单例模式最重要的是返回同一个实例，既然最重要的已经知道，我们可以看一个面试题

> 实现一个全局唯一的模态框

```js
class Model {
  static getInstance () {
    if (!Model.instance) {
      Model.instance = new Model()
      Model.instance.createModel()
    }
    return model.instance
  }
  createModel () {
    this.div = document.createElement('div')
    this.div.id = 'modal'
    this.div.innerHTML = '全局模态框'
    this.div.style.display = 'none'
    document.body.appendChild(this.div)
  }
  open () {
    this.div.style.display = 'block'
  }
  close () {
    this.div.style.display = 'none'
  }
}

document.getElementById('open').addEventListener('click', () => {
  const modal = Modal.getInstance()
  modal.open()
})
document.getElementById('close').addEventListener('click', () => {
  const modal = Modal.getInstance()
  modal.close()
})
```

## 策略模式

策略模式能减少`if-else`的使用，注意一般这种判断都是独立的，如果存在关联关系，不好使用策略模式。这里来个例子，比如询价处理

```js
// 定义一个询价处理器对象
const priceProcessor = {
  pre(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 20;
    }
    return originPrice * 0.9;
  },
  onSale(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 30;
    }
    return originPrice * 0.8;
  },
  back(originPrice) {
    if (originPrice >= 200) {
      return originPrice - 50;
    }
    return originPrice;
  },
  fresh(originPrice) {
    return originPrice * 0.5;
  },
};
// 询价函数
function askPrice(tag, originPrice) {
  return priceProcessor[tag](originPrice)
}
```

## 状态模式

就想上面说的，有时候判断上会有关联关系，这时候就可以使用差不多的状态模式。

```js
class CoffeeMaker {
  constructor() {
    /**
    这里略去咖啡机中与咖啡状态切换无关的一些初始化逻辑
  **/
    // 初始化状态，没有切换任何咖啡模式
    this.state = 'init';
    // 初始化牛奶的存储量
    this.leftMilk = '500ml';
  }
  stateToProcessor = {
    that: this,
    american() {
      // 尝试在行为函数里拿到咖啡机实例的信息并输出
      console.log('咖啡机现在的牛奶存储量是:', this.that.leftMilk)
      console.log('我只吐黑咖啡');
    },
    latte() {
      this.american()
      console.log('加点奶');
    },
    vanillaLatte() {
      this.latte();
      console.log('再加香草糖浆');
    },
    mocha() {
      this.latte();
      console.log('再加巧克力');
    }
  }

  // 关注咖啡机状态切换函数
  changeState(state) {
    this.state = state;
    if (!this.stateToProcessor[state]) {
      return;
    }
    this.stateToProcessor[state]();
  }
}

const mk = new CoffeeMaker();
mk.changeState('latte');
```

## 观察者模式

观察者模式有两个角色，一个是发布者。另一个是订阅者

```js
// 定义发布类
class Publisher {
  constructor () {
    this.observers = []
    console.log('publisher created')
  }
  // 增加订阅者
  add (observer) {
    this.observers.push(observer)
  }
  // 移除订阅者
  remove (observer) {
    this.observers.forEach((item, i) => {
      if (item === observer) {
        this.observers.splice(i, 1)
      }
    })
  }
  // 通知所有订阅者
  notify () {
    this.observers.forEach(observer => {
      observer.update(this)
    })
  }
}

class Observer {
  constructor () {}
  update () {
    console.log('订阅者被通知')
  }
}
```

## 订阅-发布模式

这个模式不会出现具体的发布者和订阅者，它依靠事件中心来操作。它是完全解耦的

```js
class EventEmitter {
  constructor() {
    // handlers是一个map，用于存储事件与回调之间的对应关系
    this.handlers = {}
  }

  // on方法用于安装事件监听器，它接受目标事件名和回调函数作为参数
  on(eventName, cb) {
    // 先检查一下目标事件名有没有对应的监听函数队列
    if (!this.handlers[eventName]) {
      // 如果没有，那么首先初始化一个监听函数队列
      this.handlers[eventName] = []
    }

    // 把回调函数推入目标事件的监听函数队列里去
    this.handlers[eventName].push(cb)
  }

  // emit方法用于触发目标事件，它接受事件名和监听函数入参作为参数
  emit(eventName, ...args) {
    // 检查目标事件是否有监听函数队列
    if (this.handlers[eventName]) {
      // 这里需要对 this.handlers[eventName] 做一次浅拷贝，主要目的是为了避免通过 once 安装的监听器在移除的过程中出现顺序问题
      const handlers = this.handlers[eventName].slice()
      // 如果有，则逐个调用队列里的回调函数
      handlers.forEach((callback) => {
        callback(...args)
      })
    }
  }

  // 移除某个事件回调队列里的指定回调函数
  off(eventName, cb) {
    const callbacks = this.handlers[eventName]
    const index = callbacks.indexOf(cb)
    if (index !== -1) {
      callbacks.splice(index, 1)
    }
  }

  // 为事件注册单次监听器
  once(eventName, cb) {
    // 对回调函数进行包装，使其执行完毕自动被移除
    const wrapper = (...args) => {
      cb(...args)
      this.off(eventName, wrapper)
    }
    this.on(eventName, wrapper)
  }
}
```