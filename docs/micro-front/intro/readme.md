# 微前端

微前端是一种软件架构，可以将前端应用拆解成一些更小的能够独立开发部署的微型应用，然后再将这
些微应用进行组合使其成为整体应用的架构模式。

微前端架构类似于组件架构，但不同的是，组件不能独立构建和发布，但是微前端中的应用是可以的。

微前端架构与框架无关，每个微应用都可以使用不同的框架。

## 微前端的价值

### 增量迁移

一个项目的迁移是一项很艰巨的任务，开发时间很久的项目如果要迁移，需要的人力很难保证。但是经过2-3年的高速发展现有的技术却无法很好的
支持需求，项目组也希望使用新的技术，这时候使用微前端就能解决问题。
通过新项目和旧项目的整合来架构，就能很好的完成任务

### 独立发布

在目前的单页应用架构中，使用组件构建用户界面，应用中的每个组件或功能开发完成或者bug修
复完成后，每次都需要对整个产品重新进行构建和发布，任务耗时操作上也比较繁琐。

在使用了微前端架构后，可以将不能的功能模块拆分成独立的应用，此时功能模块就可以单独构建
单独发布了，构建时间也会变得非常快，应用发布后不需要更改其他内容应用就会自动更新，这意
味着你可以进行频繁的构建发布操作了。

### 允许单个团队做出技术决策

因为微前端构架与框架无关，当一个应用由多个团队进行开发时，每个团队都可以使用自己擅长的
技术栈进行开发，也就是它允许适当的让团队决策使用哪种技术，从而使团队协作变得不再僵硬。

因此微前端的使用场景就是：

1. 拆分巨型应用，使应用变得更加可维护
2. 兼容历史应用，实现增量开发


## 如何实现微前端

### 多个微应用如何进行组合？

每个微应用都需要注册到总的容器中，每个应用在浏览器中都是一个独立的模块，通过模块化的方式被容器应用
启动和运行。使用模块化的方式运行应用可以防止冲突

### 在微应用中如何实现路由？

在微架构中，当路由发生变化时，容器首先会拦截路由的变化。根据路由匹配相应的微前端引用。当匹配到以后，再启动微应用路由，匹配具体的页面

### 微应用之间如何实现状态共享？

通过发布订阅模式实现状态共享，如Rxjs

### 微应用之间如何实现框架和库的共享

通过import-map和webpack中的externals属性

## 使用 single-spa@5.9.3

使用`create-single-spa`创建一个`root`应用。该应用用来注册其他微前端应用，并且共享根html。
在这个根html中。可以注册全局共享的插件，比如react和vue，因为在所有引用中，可能会多次使用react和vue来开发程序。

```
<script type="systemjs-importmap">
 {
   "imports": {
     "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js",
     "react": "https://cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min.js",
     "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@17.0.1/umd/react-dom.production.min.js",
     "react-router-dom": "https://cdn.jsdelivr.net/npm/react-router-dom@5.2.0/umd/react-router-dom.min.js",
     "vue": "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js",
     "vue-router": "https://cdn.jsdelivr.net/npm/vue-router@3.0.7/dist/vue-router.min.js",
   }
 }
</script>
```
这里是使用webpack将上述打包为`systemjs`， 在浏览器中加载。同理在微应用内的`webpack`配置中，就需要`externals`这些包

我们来看看创建后的引用的`root-config.js`

```
/**
 * 1. name 微前端引用名称 "@组织名称/应用名称"
 * 2. app 函数类型，返回Promise 通过 systemjs 引用打包好的微前端应用模块代码 umd
 * 3. activeWhen 路由匹配时激活应用
 */
registerApplication({
  name: '@study/todos',
  app: () => System.import('@study/todos'),
  activeWhen: ['/todos'],
})
```
这里就是创建了一个名为`todos`的应用，并且在`@study`组织中。
```
<script type="systemjs-importmap">
   {
     "imports": {
       "@study/todos": "//localhost:9002/study-todos.js"
     }
   }
</script>
```
唯一注意的一点，将端口在`package.json`切换。
在每一个微应用中，入口处可以创建用于观察应用启动、挂载和卸载的生命周期，这些生命周期必须返回promise
```
let lagouContainer = null
  export const bootstrap = async function () {
  console.log("应用正在启动")
}
export const mount = async function () {
  console.log("应用正在挂载")
  lagouContainer = document.createElement("div")
  lagouContainer.innerHTML = "Hello Lagou"
  lagouContainer.id = "lagouContainer"
  document.body.appendChild(lagouContainer)
}
export const unmount = async function () {
  console.log("应用正在卸载")
  document.body.removeChild(lagouContainer)
}
```
这样就可以算是创建了多个应用，用于开发了。但是如何在多个应用内进行通讯呢。

### 跨应用通信

> 这里创建一个`tools`应用，专门用来放置跨应用共享的 JavaScript 逻辑，它也是独立的应用，需要单独构建单独启动。

跨应用通信可以使用 RxJS，因为它无关于框架，也就是可以在任何其他框架中使用。

1.  在 index.ejs 文件中添加 rxjs 的 import-map

```
{
"imports": {
  "rxjs": "https://cdn.jsdelivr.net/npm/rxjs@6.6.3/bundles/rxjs.umd.min.js"
  }
}
```
2. 在 utility modules 中导出一个 ReplaySubject，它可以广播历史消息，就算应用是动态加载进来
的，也可以接收到数据。

```
import { ReplaySubject } from "rxjs"
export const sharedSubject = new ReplaySubject()
```

3. 在 React 应用中订阅它

```
useEffect(() => {
  let subjection = null
  if (toolsModule) {
    subjection = toolsModule.sharedSubject.subscribe(console.log)
  }
  return () => subjection.unsubscribe()
}, [toolsModule])
```

4. 在 Vue 应用中订阅它

```
async mounted() {
  let toolsModule = await window.System.import("@study/tools")
  toolsModule.sharedSubject.subscribe(console.log)
}
```

## Layout Engine

允许使用组件的方式声明顶层路由，并且提供了更加便捷的路由API用来注册应用。

```
<template id="single-spa-layout">
   <single-spa-router>
     <nav class="topnav">
       <application name="@study/nav"></application>
     </nav>
     <div class="main-content">
       <route path="settings">
         <application name="@study/settings"></application>
       </route>
       <route path="clients">
         <application name="@study/clients"></application>
       </route>
     </div>
     <footer>
       <application name="@study/footer"></application>
     </footer>
   </single-spa-router>
</template>
```
获取路由信息

```
import { registerApplication, start } from 'single-spa';
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from 'single-spa-layout';
// 这里拿到的路由信息就是已经结构化好的，所以注册的方式就简便了
const routes = constructRoutes(document.querySelector('#single-spa-layout'));
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });
applications.forEach(registerApplication);

start();
```