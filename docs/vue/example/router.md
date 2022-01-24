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




