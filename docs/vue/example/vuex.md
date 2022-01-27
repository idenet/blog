# vuex

`vuex`和`vue-router`一样，也是通过插件的方式进行引入的。因为开发中，一般都会使用`modules`功能将`store`进行模块拆分，所以例子就通过这种方式进行。

```js
Vue.use(Vuex)

const moduleA = {
  ...
}
const moduleB = {
  ...
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
const vm = new Vue({
  el: '#app',
  render (h) {
    return h(App)
  },
  store
})
```

我们先看`index.js`，这个很简单，导出了相关方法，所以关于定义只需要看`store.js`就好。在`install`方法中执行了`applyMixin`，其中就是执行了`Vue.mixin({ beforeCreate: vuexInit })`。
而`vuexInit`方法，就是将传入的`store`实例赋值给了`this.$store`

```js
function vuexInit () {
  const options = this.$options
  // store injection
  if (options.store) {
    this.$store = typeof options.store === 'function'
      ? options.store()
      : options.store
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store
  }
}
```

注册流程就这样非常简单

## 实例化

在`Store`构造函数中，主要是执行`options`的解析，也就是执行`this._modules = new ModuleCollection(options)`，实例化`ModuleCollection`执行了`this.register([], rawRootModule, false)`
我们来看看`register`方法。

```js
register (path, rawModule, runtime = true) {
  if (__DEV__) {
    assertRawModule(path, rawModule)
  }

  const newModule = new Module(rawModule, runtime)
  if (path.length === 0) {
    this.root = newModule
  } else {
    const parent = this.get(path.slice(0, -1))
    parent.addChild(path[path.length - 1], newModule)
  }

  if (rawModule.modules) {
    forEachValue(rawModule.modules, (rawChildModule, key) => {
      this.register(path.concat(key), rawChildModule, runtime)
    })
  }
}
```
该方法首先将`options`通过`new Module`存放到`root`，相当于给`options`存了一个副本。如果用户使用了`module`就通过循环再次注册这时候会吧`module`放到`_children`下面
这时候`root`的值为

```js
this.root = {
  state: {},
  _children: {
    a: Module,
    b: Module
  },
  _rawModule: {
    modules: {
      a: {},
      b: {}
    }
  }
}
```
之后就是核心`installModule`，这个方法主要注册了`mutation、action、getter、module`.

```js
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      Vue.set(parentState, moduleName, module.state)
    })
  }
  // 为了保证不同module可以定义相当名字的函数，vuex给函数名加上了namespaced
  const local = (module.context = makeLocalContext(store, namespace, path))

  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
```
### local

```js
const local = (module.context = makeLocalContext(store, namespace, path))
```

`local`的核心是根据`namespace`定义了`dispatch`和`commit`方法。并给`getters`和`state`属性做了响应式处理。

### state 初始化

在`state`的初始化过程中，首次没什么好说的，这个主要作用在于处理`Module`，这时候`!!root`和`!hot`都为`true`。如果在`options`中定义了`state`那么
`parentState`就是它的值，`_withCommit`是一个锁，当有回调函数在执行的时候，别的回调函数就无法执行。在回调函数中调用了`Vue.set`，将模块中的属性放到了
主模块中，并且用`set`使其响应式

```js
const parentState = {
  d: 0
}
// 设置A模块的state
Vue.set(parentState, 'a', { count: 0 })
// 设置B模块的state
Vue.set(parentState, 'b', { count: 0 })
```
通过`namespace`的方法，即使模块中属性名字相同也不会冲突。

更重要的是我们知道，`state`修改会触发组件重新渲染，是响应式的。其实关于响应式的定义，在`resetStoreVM`方法中

```js
store._vm = new Vue({
  data: {
    $$state: state
  },
})
```
这个传入的`state`就是初始化好的`state`。

### Mutation 初始化

```js
 module.forEachMutation(function (mutation, key) {
  var namespacedType = namespace + key
  registerMutation(store, namespacedType, mutation, local)
})
```
看上面这段代码，通过`module`的循环，拿到`key`，然后组装成`namespacedType`，对于上面的例子

```js
namespacedType = 'a/increment'
```
然后看`registerMutation`方法，给`store._mutations`数组中添加了一个`wrappedMutationHandler`方法，最终会执行传入的`mutation`
也就是说最后会被组和成

```js
store = {
  _mutations: {
    'a/increment': [ƒ]
  }
}
```

### Action 初始化

在循环阶段和`mutation`是类似的，不过因为`action`是支持异步的，所以在注册上有所不同

```js
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload) {
    let res = handler.call(
      store,
      {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store.getters,
        rootState: store.state
      },
      payload
    )
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    return res
  })
}
```
可以看到结果用`Promsie.resolve`进行包裹，且他可以获取的入参更多。最终获取的是

```js
store = {
  _actions: {
    'a/increment': [ƒ]
  }
}
```

### Getters初始化和响应式

循环也是一样就不说了，但是注册会有很大不同

```js
function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (__DEV__) {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
```
有意思的是，我们在这里可以获取四个参数。并且我们在查看`resetStoreVM`的时候可以看到，它将`_wrappedGetters`转换成了`computed`放到了`store._vm`实例化的`vue`的`computed`中实现响应式，
并且对`store.getters`进行了拦截，响应到了`store._vm`



## 使用

### vuex 辅助函数

`normalizeNamespace`函数就是获取当前传入的参数中是否具有`namespace`字段，并且序列化成`/x`。
`normalizeMap` 就是吧对象和数组两种形式都转换成对象的`key` `value`

```js
normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
```

### state的使用和mapState

在我们的使用过程中，最终其实是调用的`computed`，`computed`会调用` watcher.evaluate()`执行到`this.getter.call(vm, vm)`，那也就是定义返回的`mapState`函数

```js
function mappedState () {
  let state = this.$store.state
  let getters = this.$store.getters
  if (namespace) {
    const module = getModuleByNamespace(this.$store, 'mapState', namespace)
    if (!module) {
      return
    }
    state = module.context.state
    getters = module.context.getters
  }
  return typeof val === 'function'
    ? val.call(this, state, getters)
    : state[val]
}
```
因为是模块内，`module.context`其实就是之前定义的`makeLocalContext(store, namespace, path)`，在这里面有个`state`和
`getters`拦截器。这里会触发依赖收集，并且最终返回`state[val]`

### getter 和 mapGetters 的使用

这个其实和`state`是一样的，`state`因为只是一个值，或者有可能是一个方法，所以它的返回需要包裹，但是`getters`必须是一个方法，
所以它只要正确的返回`key`对应的`val`给`computed`去执行就可以了，所以它的`mapGetters`很简单 不赘述

### mutations 、actions 和 mapMutations 、mapActions的使用

```js
function mappedMutation (...args) {
  let commit = this.$store.commit
  if (namespace) {
    const module = getModuleByNamespace(this.$store, 'mapMutations', namespace)
    if (!module) {
      return
    }
    commit = module.context.commit
  }
  return typeof val === 'function'
    ? val.apply(this, [commit].concat(args))
    : commit.apply(this.$store, [val].concat(args))
}
```
和前面类似，如果是`module`就调用`local`中的 `commit`方法，如果不是就调用构造函数中申明的`commit`。在`local`的`commit`就是通过
`namespace`拿到对应的发行，最终还是调用`commit`函数

`action`和`mutation`是类似的，不过`actions`调用的是 `dispatch`函数，最后返回了一个`Promise`。然后交给`commit`执行。
