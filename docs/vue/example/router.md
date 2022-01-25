# vue-router

`vue`分析的差不多了，那么我们来看看最重要的两个周边产品，先看`vue-router`。这块的例子直接使用`vue-router`官网的例子就行了，
如果用`vue-cli`新建的项目，记得在`vue.config.js`中配置`runtimeCompiler`为`true`。

## 初始化

在`vue-router`的例子中我们可以看到，首先通过`Vue.use`注册`router`，然后`new`一个实例，并传入路由配置数组。那么我们就可以从这两个方面入手

首先是`Vue.use`，该方法全局方法，可以在`global-api/use.js`查看，就是调用了`install`方法，传入了当前`Vue`。
所以`vue-router`其实就是`vue`插件的调用方法，那么我们直接看`router`的`install`方法。

`install`方法比较长，但是总结起来也就五点

1. 确保只`install`一次，即多次`install`只会缓存第一次的`Vue`
2. 声明`registerInstance`方法
3. 使用`Vue.mixin`混入`beforeCreate`和`destroyed`，这里使用了`mergeOptions`，并且混入的是`Vue`所以在每个组件上都会执行
4. 定义`Vue.prototype.$router`和`Vue.prototype.$route`的拦截器，指向`this._routerRoot.xx`。
5. 注册`RouterView`和`RouterLink`组件

`install`的核心就这些，接下来要看`new VueRouter`的过程。

它也可以总结为几个点

1. 定义实例变量
2. 执行`createMatcher`该方法是创建路由映射和获取路由方法的核心
3. 根据`mode`实例化`history`，这里注意在使用`history`模式的时候，如果浏览器不支持`router`会自动降级为`hash`

### createMatcher

这个方法传入两个参数一个是`routes`一个是当前实例，然后我们看下源码

```js
export function createMatcher(routes, router) {
  // 创建一个路由映射表
  const { pathList, pathMap, nameMap } = createRouteMap(routes)
  ...
  return {
    match,
    addRoute,
    getRoutes,
    addRoutes
  }
}
```
就做了两件事

1. 通过`createRouteMap`创建路由映射表
2. 返回`route`相关方法和`match`方法，`match`方法很重要，等调用的时候再提

根据流程，我们进入`createRouteMap`方法看看，这个方法核心就一段代码

```js
routes.forEach(route => {
 addRouteRecord(pathList, pathMap, nameMap, route, parentRoute)
})
```

我们进入`addRouteRecord`看看

```js
function addRouteRecord (
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  const { path, name } = route

  const pathToRegexpOptions: PathToRegexpOptions =
    route.pathToRegexpOptions || {}
  const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict)

  // record 对象 是路由核心的描述
  const record: RouteRecord = {...}

  if (route.children) {
    route.children.forEach(child => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`)
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path)
    pathMap[record.path] = record
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record
    }
  }
}
```
该方法主要就是循环执行一个`route`对象，然后序列化成`vue-router`需要的`record`对象，然后将其存入`pathMap、pathList`中，如果`route`中定义了
`name`在`nameMap`中也保存一份，这里主要注意两个地方

1. 命名视图，这个功能可以看文档介绍，即路由对象中可以写`components: {}`，如果定义`component`在源码中也是`components: { default: route.component }`
2. `normalizePath`方法在嵌套路由时候返回的差别，如果是子级路由，返回的就是`/foo/bar`

这样初始化就完成了。

## 如何开始执行的？

别忘记我们在`new Vue`的时候需要传入`router`实例，而且在之前通过`Vue.mixin`混入了`beforeCreate`和`destroyed`。
那么很显然在运行到`beforeCreate`的时候，就会执行。我们进入这个方法看看

```js
beforeCreate: function beforeCreate () {
   if (isDef(this.$options.router)) {
     this._routerRoot = this
     this._router = this.$options.router
     this._router.init(this)
     Vue.util.defineReactive(this, '_route', this._router.history.current)
   } else {
     this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
   }
   registerInstance(this, this)
},
```
因为在`new Vue`中传入了`router`实例，所以我们会走`if`分支，`else`是做什么的？当我们执行到组件的
`beforeCreate`的时候，当前实例就不存在`router`了。赋值好变量之后，就是执行`init`方法和`_route`响应式

这里先不说`init`，我们先看`defineReactive`，为什么要对`_route`做响应式，可以看到`this._route`会返回`this._router.history.current`也就是当前路由。
而之前我们看到两个拦截器，`this.$route`返回的是`this._routerRoot._route`，而根据之前的定义`this._routerRoot = this`，那么很显然了
`this.$route`其实就是返回的`current`当前路由，知道了这个我们之后再回来看。

在`init`方法中，会第一次调用`history.transitionTo`。那么在解析`transitionTo`之前，我们需要先去`history`的定义。

本例子使用的`hash`模式，那么我们就分析`HashHistory`，在`history`文件夹中几种模式都是用的`class`定义，并且都`extend`了`History`类，那么直接进去看
`History`中的构造函数，可以发现其实就是定义类一些属性和方法，因为太简单了，这里就不赘述了。

我们看`init`方法

```js
init (app) {
 this.apps.push(app)

 if (this.app) {
   return
 }

 this.app = app

 const history = this.history

 if (history instanceof HTML5History || history instanceof HashHistory) {
   history.transitionTo(
     history.getCurrentLocation(),
     setupListeners,
     setupListeners
   )
 }

 history.listen(route => {
   this.apps.forEach(app => {
     app._route = route
   })
 })
}
```

这里稍微讲解一下，通过判断使后面的内容只会在`new Vue`的时候执行一次。而我们主要要了解的就是切换路由的`transitionTo`方法。

### transitionTo

`transitionTo`定义在`history/base.js`中，该方法其实就关注两点

1. 通过`this.router.match`获取计算后的路由
2. 通过`this.confirmTransition`切换路由

先看`match`，在`router`类中可以看到，`match`其实调用的就是`matcher.match`。

```js
function match (
 raw: RawLocation,
 currentRoute?: Route,
 redirectedFrom?: Location
): Route {
 const location = normalizeLocation(raw, currentRoute, false, router)

 if (location.path) {
   location.params = {}
   for (let i = 0; i < pathList.length; i++) {
     const path = pathList[i]
     const record = pathMap[path]
     if (matchRoute(record.regex, location.path, location.params)) {
       return _createRoute(record, location, redirectedFrom)
     }
   }
 }
 // no match
 return _createRoute(null, location)
}
```

因为例子中没有定义`name`，所以相关代码先删除。先看`normalizeLocation`方法，该方法是对当前`router`做了一次计算，在这里我们可以不去看源码实现，
看看他的单元测试，在`location.spec.js`中，很明显就是对`location`进行了序列化，然后通过`matchRoute`去和之前的`pathList`匹配，初始化的话就会
直接生成`route`。

初始化的`route`我们知道就是`/`。完成第一步，我们看第二步调用`confirmTransition`

该方法很长，但是也能分成四块，**（这里建议自己去打上断点分析，方法和异步组件分析一致）**

1. 通过`resolveQueue`方法解析出回调
2. 生成`queue`
3. 声明`iterator`函数
4. 并且执行`runQueue`

这里重点提一下：`runQueue`是一个异步函数的队列化执行函数
```js
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
```
我们观察他的入参，`queue`是之前生成的一位函数队列，是一个定义的导航队列，`fn`是传入的`iterator`，cb是定义好的回调函数，
当我们执行完队列会调用`cb`进行首次渲染的结束，`fn`的第二个参数是下一个步进器，显然就是传入的`next`。

查看`iterator`方法的入参`(hook: NavigationGuard, next)`，非常明显了，执行`hook`，然后在结束后执行`next`到下一个。
这也就是为啥每次导航守卫需要`next`原因。

稍微了解了这些，我们就可以结合官网说明的导航解析流程分析

1. 在失活的组件里调用 `beforeRouteLeave` 守卫。
2. 调用全局的 `beforeEach` 守卫。
3. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
4. 在路由配置里调用 `beforeEnter`。
5. 解析异步路由组件。

首先在首次渲染中，是没有失活组件的，那么直接跳过。`beforeEach`将被触发。触发完成后注意`runQueue`的第三个参数
```js
onComplete(route)
if (this.router.app) {
 this.router.app.$nextTick(() => {
   handleRouteEntered(route)
 })
}
```
我们看其中的这一段代码，首先执行了`onComplete`，在该方法中对`route`做了一些处理，并且执行了`beforeEnter`，这两个都是全局路由钩子
这样首次渲染的路由钩子就执行完了。然后执行了`$nextTick`。


## 两个函数组件

这里主要看路由跳转时，路由守卫的执行过程，其他的建议自己`debugger`尝试

### router-link

`router-link`组件应该就是`a`组件的包装，当我们点击的时候，其实就是触发点击事件，然后去执行`router.push()`。看`render`部分的相关源码

```js
const handler = e => {
   if (guardEvent(e)) {
     if (this.replace) {
       router.replace(location, noop)
     } else {
       router.push(location, noop)
     }
   }
}
const on = { click: guardEvent }
data.on = on
data.attrs = { href, 'aria-current': ariaCurrentValue }
```
在`push`方法内部，执行的还是`transitionTo`执行过程和之前分析的一样，重点还是看`queue、runQueue、iterator`这个三执行的过程。

在这里我们会再次执行全局前置路由`beforeEach`，然后调用路由配置中定义的`beforeEnter`，之后就是执行异步组件。执行完`queue`队列就执行完了，那么就和上面一样，执行
`runQueue`定义的`cb`
```js
const enterGuards = extractEnterGuards(activated)
const queue = enterGuards.concat(this.router.resolveHooks)
runQueue(queue, iterator, () => {
  if (this.pending !== route) {
    return abort(createNavigationCancelledError(current, route))
  }
  this.pending = null
  onComplete(route)
  if (this.router.app) {
    this.router.app.$nextTick(() => {
      handleRouteEntered(route)
    })
  }
})
```
在该方法的执行过程中，我们将拿到了路由中定义的组件对象，进行`Vue.extend`。所以可以看到，路由上的组件其实是全局混入的。并且返回了`routerEnter`，也就是说我们在之后执行的
`runQueue`中，必然有`beforeRouteEnter`钩子，但是当前组件没有被实例化，所以我们拿不到`this`。在`onComplete`方法中，将完成`url`的更新和全局后置路由`afterEach`的执行。

**那为什么`next`中可以访问到`this`呢**

首先根据`runQueue`可以知道，`next`其实就是执行了下一步，如果`queue`执行完了，就是执行`cb`，也就是`runQueue`的第三个参数，在这里，可以看到`$nextTick`。重新渲染组件，
在这个过程中`render`函数中有`_c("router-view")`，因此我们会运行到`router-view`组件的创建过程。

### router-view

这是一个函数式组件，如果不明白可以查看官网对于`functional`组件的定义。函数式组件主要看`render`函数，在`render`函数中有这么一段代码

```js
const route = parent.$route
```

之前已经说过，`this.$route`会进行一次依赖收集，收集的就是当前的`route`。并且会缓存当前组件。新增`data.hook.init`和`data.hook.prepatch`。最后就是执行`h`函数渲染，
这里`component`就是路由配置中的组件，在组建执行过程中，会执行`data.hook.init`，而在这个方法中会执行`handleRouteEntered`。
在这个方法中会执行之前保存的`cbs`，也就是`next`的回调。也就是说这里可以访问到组件的`this`了。

这样路由所有组件的首次渲染就完成了，还有一个点

在被激活的组件里调用 `beforeRouteEnter`

当我们再次切换到已经初始化过的组件中时，这时候`resolveQueue`解析出来的就存在`updated`，也就是说会执行`beforeRouteLeave`钩子。

## 总结

1. `vue-router`使用`Vue.use`的方式注册，通过`Vue.mixin`混入`beforeCreate`，在其中执行`init`方法
2. 如果浏览器不支持`history`模式会自动降级，并且所有的路由跳转最终都是`transitionTo`方法的调用
3. 通过类似`generator`函数的`runQueue`执行钩子函数队列`queue`。在`runQueue`的最后执行全局`afterEach`和`nextTick`