# createElement

`createElement`算是生成render的核心，其代码如下

这里说明一下，参数的具体作用

- `content`: 直接认为是vue实例就行
- `tag`: 标签，可以是html，也可以是组件
- `data`: vnode的数据
- `children`: 子节点
- `normalizationType`: 常量，子节点规范化类型

```js
// 简单处理
const SIMPLE_NORMALIZE = 1
// 复杂处理
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
然后再来看，`_createElement`函数的定义，这里代码比较长，我们去除所有的判断性代码，只看主代码。
这里我们看到了对`children`做了处理，`normalizeChildren`函数的作用就是将，数组通过递归拍平，返回一维数组。
可以看到，通过各种操作，最终返回的就是vnode

```js
xport function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  
  // object syntax in v-bind
  // <component v-bind:is="currentTabComponent></component>"
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }

  if (normalizationType === ALWAYS_NORMALIZE) {
    // 返回一维数组，处理用户输入的render
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // 把二位数组转换成一维数组
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
   
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
      // 判断是否是自定义组件
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      // 查找自定义组件构造函数声明
      // 根据Ctor创建组件的vnode
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  // 最终通过判断返回了vnode
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```
# vm._update()

处理完`_createElement`之后，我们获得了`Vnode`，回忆我们获得`Vnode`之后用来干嘛，没错，核心还是这段代码


```js
 updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

我们需要用它作为参数，调用`vm._update`, 那么我们再来看`vm._update`的源码

```js
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    // 获得vm上的vnode
    const prevVnode = vm._vnode
    // 存储当前的vm实例，也就是父组件
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    // 这里其实就是判断是不是更新操作，如果是啧有prevnode，也就不是首次渲染
    if (!prevVnode) {
      // initial render
      // 将值复制给了vm.$el
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    // 将实例复原
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```
这个`_update`的代码很简单，只是做了一个判断，是否是首次渲染，核心是调用了，`__patch__`。
这里再提一下，`__patch__`函数时平台相关的，所以他定义在`web/runtime/index.js`,可以看到只有
在浏览器中，才会调用`patch`

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop
```
然后再来看看`patch`方法，可以看到这是一个高阶函数，先来看看`nodeOps`和`modules`是什么

- `nodeOps`: 是一些node方法
- `modules`: 操作dom，通过重命名返回的其实是钩子函数

```js
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

可以看到，在`core/vnode/patch.js`文件中，操作的`vnode`和平台无关，也在这里返回了`patch`,
只看最终`return`出来的`patch`

```js
// 调用的oldvode, 和vnode
return function patch (oldVnode, vnode, hydrating, removeOnly) {
  // 新的vnode不存在
  if (isUndef(vnode)) {
    // 老的vnode存在，则执行 destory 钩子函数
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }

  let isInitialPatch = false
  // 插入的vnode队列
  const insertedVnodeQueue = []
  // 老的vnode不存在 $mount()
  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true
    // 创建vnode
    createElm(vnode, insertedVnodeQueue)
  } else {
     // 新和老的vnode都存在，更新
    const isRealElement = isDef(oldVnode.nodeType)
    // 判断参数1是否是真实dom，不是真实dom，但是是相同节点
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch existing root node
      // 更新操作，diff算法
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
    } else {
      if (isRealElement) {
        // mounting to a real element
        // check if this is server-rendered content and if we can perform
        // a successful hydration.
        // 第一个参数是真实dom， 创建vnode  初始化
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          oldVnode.removeAttribute(SSR_ATTR)
          hydrating = true
        }
        // either not server-rendered, or hydration failed.
        // create an empty node and replace it
        oldVnode = emptyNodeAt(oldVnode)
      }

      // replacing existing element
      // 找父元素
      const oldElm = oldVnode.elm
      const parentElm = nodeOps.parentNode(oldElm)

      // create new node
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      )

      // destroy old node
      // 判断parentElm是否存在
      if (isDef(parentElm)) {
        removeVnodes([oldVnode], 0, 0)
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }
  }

  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
  return vnode.elm
}
```

## patchVnode --> diff过程

执行过程
  1. 在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点设置标记索引，遍历的过程中移动索引
  2. 在对开始和结束节点比较的时候，总共有四种情况
     1. oldStartVnode/newStartVnode
     2. oldEndVnode/newEndVnode
     3. oldStartVnode/oldEndVnode
     4. oldEndVnode/newStartVnode 

1. 开始节点和结束节点比较，这两种情况类似
  1. oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
  2. oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)

如果oldStartVnode和newStartVnode是sameVnode
  1. 调用patchVnode对比和更新节点
  2. 把旧开始和新开始索引往后移，索引++

oldStartVnode/newEndVnode相同
  1. 调用patch对比和更新节点
  2. 把oldStartVnode对应的Dom元素移动到右边
  3. 更新索引
　
oldEndVnode / newStartVnode (旧结束节点 / 新开始节点) 相同
  1. 调用patch对比和更新节点
  2. 把oldStartVnode对应的Dom元素移动到左边
  3. 更新索引

如果不是以上四种情况
  1. 遍历新节点，使用 newStartNode 的 key 在老节点数组中找相同节点
  2. 如果没有找到，说明 newStartNode 是新节点
  3. 创建新节点对应的 DOM 元素，插入到 DOM 树中
  4. 如果找到了
  5. 判断新节点和找到的老节点的 sel 选择器是否相同
  6. 如果不相同，说明节点被修改了
  7. 重新创建对应的 DOM 元素，插入到 DOM 树中
  8. 如果相同，把 elmToMove 对应的 DOM 元素，移动到左边

循环结束
  1. 当老节点的所有子节点先遍历完 (oldStartIdx > oldEndIdx)，循环结束
  2. 新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，循环结束

 如果老节点的数组先遍历完(oldStartIdx > oldEndIdx)，说明新节点有剩余，把剩余节点批量插入到右边
 如果新节点的数组先遍历完(newStartIdx > newEndIdx)，说明老节点有剩余，把剩余节点批量删除

