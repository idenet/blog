# 响应式

vue3.0的响应式基于`proxy`，让我们看看如何实现一个最基础的`reactive`。

@[code js](../reactive/reactive.js)

## reactive vs ref
- ref可以吧基本数据类型数据，转成响应式数据
- ref返回的对象，重新赋值成对象也是响应式的
- reactive返回的对象，重新赋值丢失响应式
- reactive返回的对象不可以解构