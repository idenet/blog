# fiber

## React 15 存在的问题

React 16 之前的版本比对更新 VirtualDOM 的过程是采用循环加递归实现的，这种比对方式有一个问题，就是一旦任务开始进行就无法中断，如果应用中组件数量庞大，主线程被长期占用，直到整棵 VirtualDOM 树比对更新完成之后主线程才能被释放，主线程才能执行其他任务。这就会导致一些用户交互，动画等任务无法立即得到执行，页面就会产生卡顿, 非常的影响用户体验。 

核心问题：递归无法中断，执行重任务耗时长。 JavaScript 又是单线程，无法同时执行其他任务，导致任务延迟页面卡顿，用户体验差。

## 解决方案

1. 利用浏览器空闲时间执行任务，拒绝长时间占用主线程
2. 放弃递归只采用循环，因为循环可以被中断
3. 任务拆分，将任务拆分成一个个的小任务

## requestIdleCallback

利用浏览器的空余时间执行任务，如果有更高优先级的任务要执行时，当前执行的任务可以被终止，优先执行高级别任务。

```js
requestIdleCallback(function(deadline) {
  // deadline.timeRemaining() 获取浏览器的空余时间
})
```

页面是一帧一帧绘制出来的，当每秒绘制的帧数达到 60 时，页面是流畅的，小于这个值时， 用户会感觉到卡顿

1s 60帧，每一帧分到的时间是 1000/60 ≈ 16 ms，如果每一帧执行的时间小于16ms，就说明浏览器有空余时间

如果任务在剩余的时间内没有完成则会停止任务执行，继续优先执行主任务，也就是说 requestIdleCallback 总是利用浏览器的空余时间执行任务

测试一段代码

```html
<div class="playground" id="play">playground</div>
<button id="work">start work</button>
<button id="interaction">handle some user interaction</button>
```

```css
<style>
  .playground {
    background: palevioletred;
    padding: 20px;
    margin-bottom: 10px;
  }
</style>
```
```js
var play = document.getElementById("play")
var workBtn = document.getElementById("work")
var interactionBtn = document.getElementById("interaction")
var iterationCount = 100000000
var value = 0

var expensiveCalculation = function (IdleDeadline) {
  while (iterationCount > 0 && IdleDeadline.timeRemaining() > 1) {
    value =
      Math.random() < 0.5 ? value + Math.random() : value + Math.random()
    iterationCount = iterationCount - 1
    console.log(value)
  }
  requestIdleCallback(expensiveCalculation)
}

workBtn.addEventListener("click", function () {
  requestIdleCallback(expensiveCalculation)
})

interactionBtn.addEventListener("click", function () {
  play.style.background = "palegreen"
})
```

从上面可以看出，用api执行循环的时候，有主线程进来是可以中断，执行主线程然后继续执行循环的

## 实现思路 

在 Fiber 方案中，为了实现任务的终止再继续，DOM比对算法被分成了两部分：

1. 构建 Fiber        (可中断)
2. 提交 Commit   (不可中断)

DOM 初始渲染: virtualDOM -> Fiber -> Fiber[] -> DOM

DOM 更新操作: newFiber vs oldFiber -> Fiber[] -> DOM

### 构建 fiber

和 之前的 Vdom 一样， fiber也是一个对象，只是对象属性比 Vdom 多

```
{
  type         节点类型 (元素, 文本, 组件)(具体的类型)
  props        节点属性
  stateNode    节点 DOM 对象 | 组件实例对象
  tag          节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)
  effects      数组, 存储需要更改的 fiber 对象
  effectTag    当前 Fiber 要被执行的操作 (新增, 删除, 修改)
  return       当前 Fiber 的父级 Fiber
  child        当前 Fiber 的子级 Fiber
  sibling      当前 Fiber 的下一个兄弟 Fiber
  alternate    Fiber 备份 fiber 比对时使用
}
```

### 实现简易 fiber


```js
import React from "react"

const jsx = (
  <div id="a1">
    <div id="b1">
      <div id="c1"></div>
      <div id="c2"></div>
    </div>
    <div id="b2"></div>
  </div>
)

const container = document.getElementById("root")

/**
 * 1. 为每一个节点构建 Fiber 对象
 * 2. 构建 Fiber 链表
 * 3. 提交 Fiber 链接
 */

// 创建根元素 Fiber 对象
const workInProgressRoot = {
  stateNode: container,
  props: {
    children: [jsx]
  }
}
// 下一个要执行的任务
let nextUnitOfWork = workInProgressRoot

function workLoop(deadline) {
  // 如果下一个要构建的执行单元存在并且浏览器有空余时间
  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    // 构建执行单元并返回新的执行单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  // 如果所有的执行单元都已经构建完成
  if (!nextUnitOfWork) {
    // 进入到第二个阶段 执行 DOM 操作
    commitRoot()
  }
}
// Fiber 工作的第一个阶段
function performUnitOfWork(workInProgress) {
  // 构建阶段向下走的过程
  // 1. 创建当前 Fiber 节点的 DOM 对象并存储在 stateNode 属性中
  // 2. 构建子级 Fiber 对象
  beginWork(workInProgress)
  // 如果子级存在
  if (workInProgress.child) {
    // 返回子级 构建子级的子级
    return workInProgress.child
  }
  // 开始构建阶段向上走的过程
  // 如果父级存在
  while (workInProgress) {
    // 构建 Fiber 链表 从底部开始构建
    completeUnitOfWork(workInProgress)
    // 如果同级存在
    if (workInProgress.sibling) {
      // 返回同级 构建同级的子级
      return workInProgress.sibling
    }
    // 同级不存在 退回父级 看父级是否有同级
    workInProgress = workInProgress.return
  }
}

function beginWork(workInProgress) {
  // 如果 Fiber 对象没有存储其对应的 DOM 对象
  if (!workInProgress.stateNode) {
    // 创建 DOM 对象并存储在 Fiber 对象中
    workInProgress.stateNode = document.createElement(workInProgress.type)
    // 为 DOM 对象添加属性
    for (let attr in workInProgress.props) {
      if (attr !== "children") {
        workInProgress.stateNode[attr] = workInProgress.props[attr]
      }
    }
  }
  // 创建子级 Fiber 对象
  if (Array.isArray(workInProgress.props.children)) {
    // 记录上一次创建的子级 Fiber 对象
    let previousFiber = null
    // 遍历子级
    workInProgress.props.children.forEach((child, index) => {
      // 创建子级 Fiber 对象
      let childFiber = {
        type: child.type,
        props: child.props,
        return: workInProgress,
        effectTag: "PLACEMENT"
      }
      // 第一个子级挂载到父级的 child 属性中
      if (index === 0) {
        workInProgress.child = childFiber
      } else {
        // 其他子级挂载到自己的上一个兄弟的 sibling 属性中
        previousFiber.sibling = childFiber
      }
      // 更新上一个子级
      previousFiber = childFiber
    })
  }
}

function completeUnitOfWork(workInProgress) {
  // 获取当前 fiber 的父级
  let returnFiber = workInProgress.return

  if (returnFiber) {
    // 链头上移
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = workInProgress.firstEffect
    }
    // lastEffect 上移
    if (!returnFiber.lastEffect) {
      returnFiber.lastEffect = workInProgress.lastEffect
    }
    // 构建链表 需要进行dom操作
    if (workInProgress.effectTag) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workInProgress
      } else {
        returnFiber.firstEffect = workInProgress
      }
      returnFiber.lastEffect = workInProgress
    }
  }
}

// Fiber 工作的第二阶段
function commitRoot() {
  // 获取链表中第一个要执行的 DOM 操作
  let currentFiber = workInProgressRoot.firstEffect
  // 判断要执行 DOM 操作的 Fiber 对象是否存在
  while (currentFiber) {
    // 执行 DOM 操作
    currentFiber.return.stateNode.appendChild(currentFiber.stateNode)
    // 从链表中取出下一个要执行 DOM 操作的 Fiber 对象
    currentFiber = currentFiber.nextEffect
  }
}

// 在浏览器空闲的时候开始构建
requestIdleCallback(workLoop)
```