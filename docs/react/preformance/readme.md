# React 组件性能优化最佳实践

## 组件卸载前进行清理

1. 在使用`useEffect`的时候注册的全局事件和定时器等，要在`return`中返回清理函数


## 子组件的渲染

1. `shouldComponentUpdate`使用它进行前值后值的比较，进行是否渲染子组件的判断
2. 在使用函数组件的时候，用`memo`进行浅层比较，或者通过第二个入参函数进行比较

```js
function App() {
  const [person, setPerson] = useState({ name: "张三", age: 20, job: "waiter" })
  return <>
  	<ShowPerson person={person} />
  	<button onClick={() => setPerson({...person, job: "chef"})}>button</button>
  </>
}
export default App

function ShowPerson({ person }) {
  console.log("ShowPerson render...")
  return (
    <div>
      {person.name} {person.age}
    </div>
  )
}

import React, { memo, useEffect, useState } from "react"

const ShowPersonMemo = memo(ShowPerson, comparePerson)

function comparePerson(prevProps, nextProps) {
  if (
    prevProps.person.name !== nextProps.person.name ||
    prevProps.person.age !== nextProps.person.age
  ) {
    return false
  }
  return true
}

function App() {
  const [person, setPerson] = useState({ name: "张三", age: 20, job: "waiter" })
  return <>
  	<ShowPersonMemo person={person} />
  	<button onClick={() => setPerson({...person, job: "chef"})}>button</button>
  </>
}
export default App
```

## 使用组件懒加载

使用组件懒加载可以减少 bundle 文件大小, 加快组件呈递速度.

## 使用 Fragment 避免额外标记

占位符标记可以去除必须又一个div父级的问题

```js
import { Fragment } from "react"

function App() {
  return (
    <Fragment>
      <div>message a</div>
      <div>message b</div>
    </Fragment>
  )
}
```

## 不要使用内联函数

在使用内联函数后, render 方法每次运行时都会创建该函数的新实例, 导致 React 在进行 Virtual DOM 比对时, 新旧函数比对不相等，导致 React 总是为元素绑定新的函数实例, 而旧的函数实例又要交给垃圾回收器处理. 

## 在构造函数中进行函数this的绑定

在类组件中如果使用 fn() {} 这种方式定义函数, 函数 this 默认指向 undefined. 也就是说函数内部的 this 指向需要被更正.

可以在构造函数中对函数的 this 进行更正, 也可以在行内进行更正, 两者看起来没有太大区别, 但是对性能的影响是不同的.

```js
export default class App extends React.Component {
   constructor() {
    super()
     // 方式一
     // 构造函数只执行一次, 所以函数 this 指向更正的代码也只执行一次.
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    console.log(this)
  }
  render() {
    // 方式二 
    // 问题: render 方法每次执行时都会调用 bind 方法生成新的函数实例.
    return <button onClick={this.handleClick.bind(this)}>按钮</button>
  }
}
```

## 9. 类组件中的箭头函数

在类组件中使用箭头函数不会存在 this 指向问题, 因为箭头函数本身并不绑定 this.

```js
export default class App extends React.Component {
  handleClick = () => console.log(this)
  render() {
    return <button onClick={this.handleClick}>按钮</button>
  }
}
```

箭头函数在 this 指向问题上占据优势, 但是同时也有不利的一面.

当使用箭头函数时, 该函数被添加为类的实例对象属性, 而不是原型对象属性. 如果组件被多次重用, 每个组件实例对象中都将会有一个相同的函数实例, 降低了函数实例的可重用性造成了资源浪费.

综上所述, 更正函数内部 this 指向的最佳做法仍是在构造函数中使用 bind 方法进行绑定

## 避免使用内联样式属性

当使用内联 style 为元素添加样式时, 内联 style 会被编译为 JavaScript 代码, 通过 JavaScript 代码将样式规则映射到元素的身上, 浏览器就会花费更多的时间执行脚本和渲染 UI, 从而增加了组件的渲染时间.

## 优化条件渲染

频繁的挂载和卸载组件是一项耗性能的操作, 为了确保应用程序的性能, 应该减少组件挂载和卸载的次数.

在 React 中我们经常会根据条件渲染不同的组件. 条件渲染是一项必做的优化操作.

```js
function App() {
  if (true) {
    return (
      <>
        <AdminHeader />
        <Header />
        <Content />
      </>
    )
  } else {
    return (
      <>
        <Header />
        <Content />
      </>
    )
  }
}
```

在上面的代码中, 当渲染条件发生变化时, React 内部在做 Virtual DOM 比对时发现, 刚刚第一个组件是 AdminHeader, 现在第一个组件是 Header, 刚刚第二个组件是 Header, 现在第二个组件是 Content, 组件发生了变化, React 就会卸载 AdminHeader、Header、Content, 重新挂载 Header 和 Content, 这种挂载和卸载就是没有必要的.

```js
function App() {
  return (
    <>
      {true && <AdminHeader />}
      <Header />
      <Content />
    </>
  )
}
```
## 为组件创建错误边界

默认情况下, 组件渲染错误会导致整个应用程序中断, 创建错误边界可确保在特定组件发生错误时应用程序不会中断.

错误边界是一个 React 组件, 可以捕获子级组件在渲染时发生的错误, 当错误发生时, 可以将错误记录下来, 可以显示备用 UI 界面.

错误边界涉及到两个生命周期函数, 分别为 getDerivedStateFromError 和 componentDidCatch.

getDerivedStateFromError 为静态方法, 方法中需要返回一个对象, 该对象会和state对象进行合并, 用于更改应用程序状态.

componentDidCatch 方法用于记录应用程序错误信息. 该方法的参数就是错误对象.

```js
// ErrorBoundaries.js
import React from "react"
import App from "./App"

export default class ErrorBoundaries extends React.Component {
  constructor() {
    super()
    this.state = {
      hasError: false
    }
  }
  componentDidCatch(error) {
    console.log("componentDidCatch")
  }
  static getDerivedStateFromError() {
    console.log("getDerivedStateFromError")
    return {
      hasError: true
    }
  }
  render() {
    if (this.state.hasError) {
      return <div>发生了错误</div>
    }
    return <App />
  }
}
// App.js
import React from "react"

export default class App extends React.Component {
  render() {
    // throw new Error("lalala")
    return <div>App works</div>
  }
}
// index.js
import React from "react"
import ReactDOM from "react-dom"
import ErrorBoundaries from "./ErrorBoundaries"

ReactDOM.render(<ErrorBoundaries />, document.getElementById("root"))
```

注意: 错误边界不能捕获异步错误, 比如点击按钮时发生的错误.

## 避免数据结构突变

组件中 props 和 state 的数据结构应该保持一致, 数据结构突变会导致输出不一致.

```js
import React, { Component } from "react"

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      employee: {
        name: "张三",
        age: 20
      }
    }
  }
  render() {
    const { name, age } = this.state.employee
    return (
      <div>
        {name}
        {age}
        <button
          onClick={() =>
            this.setState({
              ...this.state,
              employee: {
                ...this.state.employee,
                age: 30
              }
            })
          }
        >
          change age
        </button>
      </div>
    )
  }
}
```