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

`new Module`会创建一个实例里面包含几个属性

1. `_rawModule`是传入的`module`
2. `state`是在`option`中传入的`state`

然后将`newModule`实例赋值给`root`。然后通过循环将