# ts 类型挑战

`typescript`的基础语法类型很简单，在写业务的时候几乎用不到它的类型定义。但是当要写一个提示友好的工具库的时候，他的类型定义变得非常重要。

在github上，[type-challenges](https://github.com/type-challenges/type-challenges)是专门用来深化对`typescript`的理解
我们来一步步挑战它


## 初级
### 实现 Pick

题目

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

```ts
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}
```

解析：
这里主要是使用了`keyof`获取了泛型 T 的 key，然后通过 `extends`约束 T 的值在 key 里面，最后通过 `in` 循环 k ，拿到 key ，这个 key 对应 T 内的值。


### 实现 readonly

题目

```ts
// 将所有属性转变为 只读
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
```

```ts
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key]
}
```

解析

获取 T 的 key值，循环然后给key 添加 `readonly`