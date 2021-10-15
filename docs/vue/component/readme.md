# 组件的注册

注册组件的过程很简单，我们在调用的时候使用的是`Vue.component`，所以他是把源码放到了`initGlobalAPI`中定义
之后我们就能找到他的源码

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // Vue.component('com', { template: '' })
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 把组件配置转换为组件的构造函数
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 全局注册，存储资源并赋值
        // this.options['components']['comp'] = definition
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}

```

在组件注册的过程中， 我们进入了`Vue.ectend`方法，在`extend`方法中，我们能够看到一行代码

```js
 const Sub = function VueComponent (options) {
    this._init(options)
 }
```

所以组件的创建还是调用了，`_init`方法，`extend`中的其他就是合并配置和调用初始化，前面有描述不再赘述。
回忆`vue`的初始化过程

```js
_init()
vm.$mount()--->这里还包含了不同平台下 mount的重写
mountComponent()
new Watcher() 初始化过程中调用了回调
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
vm._render() ---> createElement() 即h函数
vm._update() 生成dom
```
# 组件创建

从上面中，我们能在`createElement`中找到，所以`createComponent`就是入口

```js
 vnode = createComponent(Ctor, data, context, children, tag)
```

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }
  // vue 构造函数
  const baseCtor = context.$options._base

  // 如果Ctor不是一个构造函数，是一个对象
  // 使用 Vue.extend() 创造一个子组件的构造函数
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // 异步组件 处理
  ...

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor)

  // 处理v-model
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  ...

  // 安装组件的钩子函数，init/prepatch/insert/destory
  // 这里还有钩子的合并策略
  installComponentHooks(data)

  const name = Ctor.options.name || tag
  // 创建自定义组件的Vnode，设置自定义组件的名字
  // 记录this.componentOptions = componentOptions
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode)
  }

  return vnode
}
```
这里看看`installComponentHooks`方法，他的钩子函数包含了组件的预定的操作

```js
const componentVNodeHooks = {
  init: function () {},     // 初始化时触发
  prepatch: function () {}, // patch之前触发
  insert: function () {},   // 插入到DOM时触发
  destroy: function () {}   // 节点移除之前触发
}
```
而`init`是初始化的核心，看代码

```js
init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
  if (
    vnode.componentInstance &&
    !vnode.componentInstance._isDestroyed &&
    vnode.data.keepAlive
  ) {
    // kept-alive components, treat as a patch
    const mountedNode: any = vnode // work around flow
    componentVNodeHooks.prepatch(mountedNode, mountedNode)
  } else {
    // 子组件的构造函数
    const child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance
    )
    // 调用子组件的$mount方法， `_init`中因为子组件没有el不会调用
    child.$mount(hydrating ? vnode.elm : undefined, hydrating)
  }
},
```


在patch中会调用，`init`钩子函数。

```js
  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        // 调用 init() 方法， 创建和挂载组件实例
        // init 的过程中创建好了组件的真实dom，挂载到了vnode。elm 上
        i(vnode, false /* hydrating */)
      }
      if (isDef(vnode.componentInstance)) {
        // 调用钩子函数（vnode的钩子函数初始化属性/事件/样式等，组件的钩子函数
        initComponent(vnode, insertedVnodeQueue)
        // 把组件对应的dom插入到父元素中
        insert(parentElm, vnode.elm, refElm)
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
        }
        return true
      }
    }
  }
```

在`_update`中，我们会调用组件的`init`钩子生成组件，这里可以看看vue是如何解决a->b->c组件的调用，
它在`a`组件的`_update`中，将父组件的实例缓存，然后在`patch`生成`b`组件的实例，同理缓存`b`组件实例，
生成`c`组件，最后从`c`组件开始恢复`b` ->`a`，这就解决了父子组件嵌套的组件执行顺序

```js
// 缓存当前实例
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
```

**核心**
1. 组件的创建过程是，先父后子
2. 组件的挂载过程是，先子后父