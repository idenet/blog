# createElement

`createElement`算是生成render的核心，其代码如下

```js
const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // 如果data是数组或者值，那么其实 children就是data， 所以data可值为空
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```
这里说明一下，参数的具体作用

- `content`: 直接认为是vue实例就行
- `tag`: 标签，可以是html，也可以是组件
- `data`: vnode的数据
- `children`: 子节点
- `normalizationType`: 常量，子节点规范化类型