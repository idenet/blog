# keep-alive

这是一个非常好用的功能，主要是将组件缓存下来，这样在动态切换的时候就不需要重新实例化，可以极大的增强性能。我们也是从例子出发

```html
<div id="app">
  <keep-alive>
    <component :is="currentComp"></component>
  </keep-alive>
  <button @click="change">switch</button>
</div>
<script>
  const A = {
    template: '<div class="a">' + '<p>A Comp</p>' + '</div>',
    name: 'A',
    mounted () {
      console.log('A mounted')
    },
    activated () {
      console.log('A activated')
    },
    deactivated () {
      console.log('A deactivated')
    }
  }

  const B = {
    template: '<div class="b">' + '<p>B Comp</p>' + '</div>',
    name: 'B',
    mounted () {
      console.log('B mounted')
    },
    activated () {
      console.log('B activated')
    },
    deactivated () {
      console.log('B deactivated')
    }
  }

  const vm = new Vue({
    el: '#app',
    data: {
      currentComp: 'A'
    },
    methods: {
      change () {
        this.currentComp = this.currentComp === 'A' ? 'B' : 'A'
      }
    },
    components: {
      A,
      B
    }
  })
</script>
```

## keep-alive的注册

本质上`keep-alive`也是一个组件，只是这个组件是`vue`定义的。那么问题是`keep-alive`是什么时候注册的？

首先我们知道一点，`keep-alive`是可以直接使用的，并不需要我们去注册。那么可以肯定它是全局注册。然后从前面的文章我们知道
全局注册是通过`Vue.extend`实现的，那么显然`keep-alive`应该也是。

我们查看`core/global-api/index.js`文件，可以看到下面这段代码

```js
export function initGlobalAPI() {
  extend(Vue.options.components, builtInComponents)
}
```

`builtInComponents`就是`components/index`的引入，这样在`Vue.options.components`下就有`keep-alive`组件了，那么
用户就能直接使用它。

## keep-alive的执行

### init

`keep-alive`的执行也是和一般组件一样，通过各个钩子，从之前的关于`component`的文章我们知道，组件有一个钩子对象`componentVNodeHooks`
其中包含了四个钩子`init prepatch insert destroy`这几个就是内置的组件初始化到销毁的过程。而我们就从这里开始看

从上面的例子看，第一个组件就是`keep-alive`那么直接在`init`方法中打上断点进入就可以，该方法主要做了两点

1. 判断有无实例，没有，新建实例；有调用`prepatch`。
2. 调用`$mount`

在初始化过程中，会调用`created`钩子函数，就会执行`cache`和`keys`的初始化。在初始化过程中会执行到`keep-alive`组件的`vm._update(vm._render(), hydrating)`。
这里我们注意一下，看`keep-alive`的源码，它是定义了`render`的，不存在`template`所以在这里`vm._render()`方法中调用的`render.call()`其实调用的是`keeep-alive`中的`render`方法

下面我们看`render`方法

```js
render () {
 // 拿到默认的子节点
 const slot = this.$slots.default
 // 拿到第一个组件节点
 const vnode: VNode = getFirstComponentChild(slot)
 const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
 if (componentOptions) {
   const name: ?string = getComponentName(componentOptions)

   const { cache, keys } = this
   const key: ?string = vnode.key == null
     ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
     : vnode.key
   if (cache[key]) {
     vnode.componentInstance = cache[key].componentInstance
     remove(keys, key)
     keys.push(key)
   } else {
     this.vnodeToCache = vnode
     this.keyToCache = key
   }

   vnode.data.keepAlive = true
 }
 return vnode || (slot && slot[0])
}
```

直接看第一句代码`this.$slots.default`这里拿到的是子组件的`vnode`，它是从哪里来的？这块其实和之前分析的`slots`有关系，没看的可以去看看，里面有详细分析。
这里`slots`拿到的是数组，通过`getFirstComponentChild`方法拿到第一个`vnode`节点。然后将`vnode`放到了`vnodeToCache`中，并且将`key`放到了`keyToCache`数组中。
并且将`data.keepAlive`置为`true`。


### insert

`init`之后，我们已经能看到`A`组件被渲染出来了。但是`keep-alive`的处理还没完成，我们看`insert`方法，在其中有一行代码`callHook(componentInstance, 'mounted')`，也就是说
当我们执行到`vnode`是`keep-alive`的时候，会执行`mounted`钩子，我们看这个钩子内的方法

```js
mounted () {
 this.cacheVNode()
 this.$watch('include', val => {
   pruneCache(this, name => matches(val, name))
 })
 this.$watch('exclude', val => {
   pruneCache(this, name => !matches(val, name))
 })
},
cacheVNode() {
   const { cache, keys, vnodeToCache, keyToCache } = this
   if (vnodeToCache) {
     const { tag, componentInstance, componentOptions } = vnodeToCache
     cache[keyToCache] = {
       name: getComponentName(componentOptions),
       tag,
       componentInstance,
     }
     keys.push(keyToCache)
     if (this.max && keys.length > parseInt(this.max)) {
       pruneCacheEntry(cache, keys[0], keys, this._vnode)
     }
     this.vnodeToCache = null
   }
}
```

这里我们会调用`cacheVnode`方法，和方法名一样，这里主要处理了两步

1. 将`vnode`实例放到了`cache`中，将`key`放到了`keys`数组中
2. 如果定义了`max`则对`cache`进行处理，这里做了一个算法处理，`LRU`，最近最少使用原则。它是一种缓存淘汰算法

最后对`include`和`exclude`进行了监听，这样首次渲染就执行完了。

### prepatch

就上面的例子，我们点击一下`switch`，这时候从之前可以知道，会触发`patchVnode`，在该方法中就会执行`prepatch`方法。
`prepatch`中主要就是执行了`updateChildComponent`方法，在其中执行了组件的切换，其中会再次执行到`keep-alive`中的`render`方法，
对`B`组件进行缓存。

### destroy

因为执行了切换，所以在`patch`中会执行到`removeVnodes`方法，这个方法里就会调用`destroy`钩子，在该钩子中

```js
destroy (vnode: MountedComponentVNode) {
 const { componentInstance } = vnode
 if (!componentInstance._isDestroyed) {
   if (!vnode.data.keepAlive) {
     componentInstance.$destroy()
   } else {
     deactivateChildComponent(componentInstance, true /* direct */)
   }
 }
}
```
我们可以看到，其中在初始化的时候，`data`中的`keep-alive`是`true`，所以这里不是直接调用`$destroy`而是`deactivateChildComponent`方法，
很明显该方法调用了`deactivated`钩子。

这里我们要注意一点，`B`组件是更新过来的，所以它会走`updateHook`，所以它会调用`keep-alive`中的`update`方法，进行`B`组件的`cacheVNode`。
这样两个组件都放到`cache`中了。

## 多次切换组件缓存使用

```js
if (cache[key]) {
  vnode.componentInstance = cache[key].componentInstance
  // make current key freshest
  remove(keys, key)
  keys.push(key)
}
```
当再次点击`switch`，这时候两个组件都被缓存到`cache`里了，在执行`render`方法的时候，我们可以方便的拿到缓存，那么之后的操作就不用再次初始化了。除了不用初始化
去澳门看看`patch`中的`createComponent`方法

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
 let i = vnode.data
 if (isDef(i)) {
   const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
   // 调用 init
   if (isDef(i = i.hook) && isDef(i = i.init)) {
     i(vnode, false /* hydrating */)
   }
   if (isDef(vnode.componentInstance)) {
     initComponent(vnode, insertedVnodeQueue)
     insert(parentElm, vnode.elm, refElm)
     if (isTrue(isReactivated)) {
       reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
     }
     return true
   }
 }
}
```
在这个方法中，因为`isReactivated`值为`true`了，再次创建组件就会走`reactivateComponent`。省去了`initComponent`的步骤，并且在该方法中
直接将`vnode` `insert`到了`parentElm`中。节省的性能是非常巨大的

## 生命周期

讲完整个流程，我们再来看看生命周期。首次渲染`A`组件之前就讲过了，我们看`componentVNodeHooks.insert`方法就能看到，执行完`mounted`钩子
就会执行`activateChildComponent`方法，该方法最后会执行`callHook(vm, 'activated')`。

所以输出结果是

```js
'A mounted'
'A activated'
```

点击`switch`进行切换，想想就知道首先会运行`A`组件的卸载，之后运行`B`组件的首次加载。那么从流程上来说，会运行`componentVNodeHooks.destroy`钩子。
后面的流程就类似了。最终输出结果是

```js
'A deactivated'
'B mounted'
'B activated'
```
再点一次`switch`这时候，`keep-alive`的`cache`中存在这两个`vnode`实例。它唯一的不同点在于执行`insert`方法的时候`queueActivatedComponent`方法。
它的作用在于将当前组件实例添加到了`activatedChildren`数组中，在微任务阶段，调用`flushSchedulerQueue`方法的时候处理。

最终输出为

```js
'B deactivated'
'A activated'
```

## 总结

面试题

**`keep-alive`原理是什么？**

这是`vue`的内置组件，它通过`this.$slots`获取所有的子组件`vnode`，并将其缓存到`cache`中，通过监听`include`和`exclude`去判断组件是否需要缓存。当用户触发组件切换的时候就会去缓存拿实例，而不是重新创建。
这极大的减少了组员的浪费。

除了之前说的两个参数，还有一个`max`参数，当用户定义了`max`参数以后，就会在缓存处理上进行改变，会使用`LRU`算法。

一般来说讲到这里，有可能会让你写或者说明该算法的特性和伪代码。

1. 每次都将最新获取的值的`key`放到`keys`数组的最后，这样就保证最少使用的在`keys`数组的最前面
2. 当存放的`keys`数组不够大的时候，删除第一个数据

下面是数组的实现

```js
function LRUCache (capacity) {
  this.capacity = capacity
  this.keys = new Set()
  this.cache = Object.create(null)
}
LRUCache.prototype.get = function (key) {
  if (this.keys.has(key)) {
    this.keys.delete(key)
    this.keys.add(key)
    return this.cache[key]
  }
  return -1
}
LRUCache.prototype.put = function (key, value) {
  if (this.keys.has(key)) {
    this.keys.delete(key)
    this.cache[key] = value
    this.keys.add(key)
  } else {
    this.keys.add(key)
    this.cache[key] = value
    if (this.capacity && this.keys.size > this.capacity) {
      const deleteKey = Array.from(this.keys)[0]
      delete this.cache[deleteKey]
      this.keys.delete(deleteKey)
    }
  }
  return null
}
```