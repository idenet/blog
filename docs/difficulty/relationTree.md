# 前言

在公司业务中，有一个核心需求，根据现实的家庭关系，宗族关系，实现一颗关系树。刚拿到这个需求真的是两眼一抹黑，可以想象如果子辈多一个人，那么父级节点的位置就要移动。不管用什么去实现难度都相当大，正在我一筹莫展的时候，
我发现了一个库

[relatives-tree](https://github.com/SanichKotikov/relatives-tree)

看他描述

> A tiny library (~3.5 kB gz) for calculating specific JSON data to family tree nodes and connectors.
> The nodes & the connectors are simple JS objects, so you can use any rendering layer.

基于`json`实现的一个有节点和连接器的js对象，所以你能用任何方式渲染它。

简直`nice`啊，这正是我需要的，看他的`demo`效果非常好，完全支持我实现公司自定义的业务，并且能在微信小程序端很好的展现。如果只是去使用，那也太简单了，当项目结束，我更好奇它是如何实现的，这也是我接下来要探索的东西。

## 展示中的门道

先来看他的一个`demo`

![图片](../images/difficulty/1.png)

结合他的实现，可以发现，容器宽高是通过库计算得到的，所有节点的位置和连线都是，只有节点本身的宽高是使用者需要自定义的。继续观察他的`html`，有意思的是每个节点其实是相连的，只是他取巧的用内层块去展示内容，这样间距就不需要计算了，大大节省了计算量。

先将库最终的计算结果打印出来看看, 就以上面截图的`json`为例。

```js
import calcTree from 'relatives-tree';

const tree = calcTree(json, { rootId });
console.log(tree)
```
拿到以下数据

```js
{
  canvas: {},
  connectors: [],
  families: [],
  nodes: []
}
```
`canvas`就放着容器的宽高，`connectors`放着每条线该怎么画，`nodes`应该就是存放节点的位置。`families`对使用者来说没什么用，但其实在源码中是另外三个的核心，它存放着每一个小家庭。

这里先要明确一点，根据他给的`demo`库计算得到的数字，都是节点宽高一半的倍数，为何这么设计？想想一个最简单的一胎家庭，`parents`存在两个节点，`children`只有一个，那么`chilren`为了好看就会移动到`parents`两个节点的中间，也就是`x`会移动一半。那么以一半为倍数，也是为了方便计算。

好，了解了这些再来看看`families`中一个对象的数据包含哪些

```js
{
  id, 
  type, // root | child
  main, // true | false
  Y: 0, // 距离top的距离
  X: 0, // 距离left的距离
  parents: [], // 父级node存放
  children: [], // 子级node存放
  pid, // parentFamily id
}
```
这也就是上面说的每一个小家庭对象，根据上面图片，我们可以看到它有5个小家庭，第一个是`root`最为特殊，他没有父级，这符合家庭树的概念，总有一个祖宗。然后每一个具有母子/父子关系的都是一个小家庭，显而易见了。关键我们要清楚如何计算每个小家庭的`X`和`Y`

### 家庭的位置
