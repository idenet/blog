# 服务端渲染和单页应用

服务端渲染有早先的php，jsp等，都是后端通过模板语言直接渲染页面，好处是一次页面请求就能拿到所有数据，
展现速度块。

单页应用，如vue、react等框架，解决了复杂场景下，前端的代码效率问题，降低了频繁操作dom的复杂度。但是因为要请求数据和js，渲染速度慢，且无法seo

**同构渲染**

基于React、Vue等框架，客户端渲染和服务端渲染的结合
  - 在服务器端执行一次，用于实现服务器渲染（首屏直出）
  - 在客户端再执行一次，用于接管页面交互
- 核心解决seo和首屏渲染慢的问题
- 拥有传统服务端渲染的优点，也有客户端渲染的优点

同构渲染的问题

1. 开发条件有限
2. 更多服务端资源

# vue ssr
vue SSR是vue官方提供的一个服务端渲染解决方案。在学习中使用官方方案，帮助我们了解底层。对于使用`nuxtjs`这种开发框架有帮助

# VueSSR的基本使用

## 渲染一个vue实例

基于官方的第一个示例，我们动手操作一下
```js
// 1. 引入库
const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()
// 创建实例
const app = new Vue({
  data: {
    message: '拉钩教育',
  },
  template: `
    <div id="app">
      <h1>{{message}}</h1>
    </div>
  `,
})
// 将vue实例渲染位html
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
})
// 使用node执行我们可以得到一个字符串，并且含有一个属性
<div id="app" data-server-rendered="true"><h1>拉钩教育</h1></div>
```
## 与服务器集成

`createRenderer`支持传入一个`options`参数，里面可以传入一个模板

```js
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8'),
})
```
`renderToString`可以传入三个参数，vue实例、content对象、回调函数

```js
renderer.renderToString(
    app,
    {
      title: '拉钩教育',
      meta: '<meta name="description" content="拉钩教育" />',
    },
    (err, html) => {
      if (err) {
        return res.status(500).end('服务器出错')
      }
      // 设置请求头
      res.end(html)
    }
  )
```
所以整体的`vue`、`vue-server-renderer`和`express`组合就能完成最基本的`node`读取模板，
`renderer`渲染模板，并通过`express`返回到客户端页面上，整体最简单的一个服务端渲染为

```js
const Vue = require('vue')
const express = require('express')
const fs = require('fs')

const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./index.template.html', 'utf-8'),
})

const server = express()

server.get('/', (req, res) => {
  const app = new Vue({
    data: {
      message: '拉钩教育',
    },
    template: `
    <div id="app">
      <h1>{{message}}</h1>
    </div>
  `,
  })
  renderer.renderToString(
    app,
    {
      title: '拉钩教育',
      meta: '<meta name="description" content="拉钩教育" />',
    },
    (err, html) => {
      if (err) {
        return res.status(500).end('服务器出错')
      }
      // 设置请求头
      res.end(html)
    }
  )
})

server.listen(3000, () => {
  console.log('server running at 3000')
})
```
## 客户端动态标签

在完成了基础的渲染之后，我们来看看如何实现动态标签的渲染，在代码中添加`@click`和`v-model`
```js
const app = new Vue({
 data: {
   message: '拉钩教育',
 },
 template: `
 <div id="app">
   <h1>{{message}}</h1>
   <h2>客户端动态标签</h2>
   <div>
     <input type="text" v-model='message' />
   </div>
   <button @click="onClick">点击测试</button>
 </div>
`,
 data: {
   message: '拉钩教育',
 },
 methods: {
   onClick() {
     console.log('hello ssr')
   },
 },
})
```
在浏览器中执行发现，渲染是可以的，但是vue的双向绑定和`v-on`并没有实现，查看网络中的返回就能发现，
`express`将数据作为字符串返回了，但是代码中没有客户端的js，所以不能实现动态功能。需要一个客户端的入口文件，
将服务端渲染好的页面激活成动态的客户端Vue页面


![构建过程](../../images/ssr/1.png)

## 使用webpack的源码构建

通过`webpack`我们将需要的代码打包进客户端和服务端，项目的基本结构如下

```
src
├── components
│   ├── Foo.vue
│   ├── Bar.vue
│   └── Baz.vue
├── App.vue
├── app.js # 通用 entry(universal entry)
├── entry-client.js # 仅运行于浏览器
└── entry-server.js # 仅运行于服务器
```
`app.js`使我们应用程序的通用`entry`，在纯客户端中，我们将此文件创建根实例并挂载到dom。但是对于ssr我们需要
导出一个`createapp`作为实例来给客户端和服务端入口使用
```js
import Vue from 'vue'
import App from './App.vue'

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app }

```
`entry-client.js`客户端只要挂载到dom

```js
import { createApp } from './app'

// 客户端特定引导逻辑……

const { app } = createApp()

// 这里假定 App.vue 模板中根元素具有 `id="app"`
app.$mount('#app')
```
`entry-server.js`服务端导出的vue，在这里我们要处理数据和路由，但是现在只需要先导出
```js
import { createApp } from './app'

export default context => {
  const { app } = createApp()
  return app
}
```
**注意在vue模板文件`app.vue`中，跟标签需要添加`id=app`，这个是用来在客户端挂载dom的**

## 构建配置

### 安装依赖

- 安装生产依赖

```js
npm i vue vue-server-renderer express cross-env
```


| 包                  | 说明                                |
| ------------------- | ----------------------------------- |
| vue                 | Vue.js核心库                        |
| vue-server-renderer | Vue服务端渲染工具                   |
| express             | 基于Node的web服务框架               |
| cross-env           | 通过npm script 设置跨平台的环境变量 |

- 安装开发依赖

```js
npm i -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core
@babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader 
url-loader file-loader rimraf vue-loader vue-template-compiler friendly-errors-webpack-plugin
```
| 包                                                                             | 说明                                   |
| ------------------------------------------------------------------------------ | -------------------------------------- |
| webpack-merge                                                                  | webpack 配置信息合并工具               |
| webpack-cli                                                                    | webpack 的命令行工具                   |
| webpack4                                                                       | webpack 核心包                         |
| vue-template-compiler vue-loader                                               | 处理 .vue 资源                         |
| rimraf                                                                         | 基于 Node 封装的一个跨平台 rm -rf 工具 |
| friendly-errors-webpack-plugin                                                 | 友好的 webpack 错误提示                |
| file-loader                                                                    | 处理字体资源   在webpack4中需要        |
| url-loader                                                                     | 处理图片资源     在webpack4中需要      |
| css-loader                                                                     | 处理 CSS 资源                          |
| babel-loader  @babel/preset-env  @babel/plugin-transform-runtime   @babel/core | Babel 相关工具                         |

**因为升级到了webpack5，上面的字体和css相关处理在webpack5中已经内置，friendly-errors-webpack-plugin不支持webpack5**
