# ts 类型挑战

`typescript`的基础语法类型很简单，在写业务的时候几乎用不到它的类型定义。但是当要写一个提示友好的工具库的时候，他的类型定义变得非常重要。

在github上，[type-challenges](https://github.com/type-challenges/type-challenges)是专门用来深化对`typescript`的理解
我们来一步步挑战它

## 实现 Pick

```ts
type MyPick<T, K extends  keyof T> = {
  [key in K]: T[key]
}
```