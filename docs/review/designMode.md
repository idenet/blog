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