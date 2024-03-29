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

完整代码在这里：

```js
git clone https://github.com/idenet/vue-ssr

yarn

npm run dev/npm run build
```

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

### webpack配置

初始化打包配置
```js
build
├── webpack.base.config.js # 公共配置
├── webpack.client.config.js # 客户端打包配置文件
└── webpack.server.config.js # 服务端打包配置文件
```
`webpack.base.config.js`

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin-webpack5')
// webpack5下的友好报错要使用这个
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')
const path = require('path')
// const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const resolve = (file) => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    path: resolve('../dist/'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    alias: {
      // 路径别名，@ 指向 src
      '@': resolve('../src/'),
    },
    // 可以省略的扩展名
    // 当省略扩展名的时候，按照从前往后的顺序依次解析
    extensions: ['.js', '.vue', '.json'],
  },
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
  module: {
    rules: [
      // 处理图片资源
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        // 在webpack4中这么使用
        // use: [
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       limit: 8192,
        //     },
        //   },
        // ],
        // webpack 5中内置了资源处理模块
        type: 'asset/resource',
      },
      // 处理字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        // 字体文件同理
        // use: ['file-loader'],
        type: 'asset/resource',
      },
      // 处理 .vue 资源
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // 处理 CSS 资源
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      // CSS 预处理器，参考：https://vue-loader.vuejs.org/zh/guide/preprocessors.html
      // 例如处理 Less 资源
      // {
      // test: /\.less$/,
      // use: [
      // 'vue-style-loader',
      // 'css-loader',
      // 'less-loader'
      // ]
      // },
    ],
  },
  plugins: [new VueLoaderPlugin(), new FriendlyErrorsWebpackPlugin()],
}

```
`webpack.client.config.js`服务端的webpack配置

```js
/**
 * 客户端打包配置
 */
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
// 重要的客户端配置输出插件
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
module.exports = merge(baseConfig, {
  entry: {
    app: './src/entry-client.js',
  },
  module: {
    rules: [
      // ES6 转 ES5
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  optimization: {
    splitChunks: {
      name: 'manifest',
      minChunks: Infinity,
    },
  },
  plugins: [
    // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),
  ],
})

```
`webpack.server.config.js`服务端配置

```js
/**
 * 服务端打包配置
 */
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: './src/entry-server.js',
  // 这允许 webpack 以 Node 适用方式处理模块加载
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',
  output: {
    filename: 'server-bundle.js',
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    libraryTarget: 'commonjs2',
  },
  // 不打包 node_modules 第三方包，而是保留 require 方式直接加载
  externals: [
    nodeExternals({
      // 白名单中的资源依然正常打包
      allowlist: [/\.css$/],
    }),
  ],
  plugins: [
    // 这是将服务器的整个输出构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin(),
  ],
})
```
最后改造`server.js`引入服务端和客户端配置

```js
const Vue = require('vue')
const express = require('express')
const fs = require('fs')

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const template = fs.readFileSync('./index.template.html', 'utf-8')

const renderer = require('vue-server-renderer').createBundleRenderer(
  serverBundle,
  {
    template,
    clientManifest,
  }
)

const server = express()

//请求静态资源
server.use('/dist', express.static('./dist'))

server.get('/', (req, res) => {
  renderer.renderToString(
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
```html
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  {{{meta}}}
  <title>{{title}}</title>
</head>

<body>
  <!-- 需要这个注释来告知App.vue的输出位置 -->
  <!--vue-ssr-outlet-->
</body>

</html>
```
这样一个最基本的不包含路由的vue同构渲染就完成了。

`https://github.com/idenet/vue-ssr`所有代码在这里，切换到`init`查看最基础的代码。现在我们可以总结整体流程。
从`node server.js`调用开始，我们在浏览器输入`localhost:3000`调用了`server`路由，在路由中调用了`renderer.renderToString()`，
将代码渲染到客户端，查看引入的
```js
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
```
两个json文件我们发现，之前的app.js和app.vue代码都已经打包进了，json文件中

### 开发模式构建

在完成基础的宏能以后，我们给开发状态，添加文件修改的监听刷新功能和热更新功能，主要使用了`webpack-dev-middleware`和`webpack-hot-middleware`
直接看代码，在`server.js`中，我们加入了一个`setupDevServer`方法，回调执行了`createBundleRenderer`去生成render，在这个回调中，去编写热更新
注意`onReady`返回的是一个promise，为什么看下面

```js
let renderer
let onReady

if (isPord) {
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  const template = fs.readFileSync('./index.template.html', 'utf-8')

  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  })
} else {
  // 开发模式 --> 监视打包构建 --> 重新生成 Renderer渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest,
    })
  })
}

server.get(
  '/',
  isPord
    ? render
    : async (req, res) => {
        // 等待有了 renderer渲染器以后，调用render进行渲染
        await onReady
        render(req, res)
      }
)

```
`setupDevServer`返回了一个`Promise`，在`update`的时候，等待`template`、`serverbundle`、
`clientmanifest`返回以后执行回调，其中做了监听相关的工作。这里注意关于`devMiddleware`的使用和4不同
```js
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const resolve = (file) => path.resolve(__dirname, file)

module.exports = (server, callback) => {
  let ready
  const onReady = new Promise((r) => (ready = r))

  // 监事构建  -> 更新renderer
  let template
  let serverBundle
  let clientManifest

  const update = () => {
    if (template && serverBundle && clientManifest) {
      ready()
      callback(serverBundle, template, clientManifest)
    }
  }
  // 监视构建 template -> 调用 update -> 更新renderer渲染器
  const templatePath = path.resolve(__dirname, '../index.template.html')
  template = fs.readFileSync(templatePath, 'utf-8')
  update()
  // chokidar
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8')
    update()
  })

  // 监视构建
  const serverConfig = require('./webpack.server.config')
  const serverCompiler = webpack(serverConfig)
  const serverDevMiddleware = devMiddleware(serverCompiler, {
    stats: false, // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 处理
  })
  serverCompiler.hooks.done.tap('server', () => {
    serverBundle = JSON.parse(
      serverDevMiddleware.context.outputFileSystem.readFileSync(
        resolve('../dist/vue-ssr-server-bundle.json'),
        'utf-8'
      )
    )
    update()
  })
  // 构建mainfest
  const clientConfig = require('./webpack.client.config')
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  clientConfig.entry.app = [
    'webpack-hot-middleware/client?quiet=true&reload=true', // 和服务端交互处理热更新一个客户端脚本
    clientConfig.entry.app,
  ]

  const clientCompiler = webpack(clientConfig)
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: false, // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 处理
  })
  clientCompiler.hooks.done.tap('client', () => {
    clientManifest = JSON.parse(
      clientDevMiddleware.context.outputFileSystem.readFileSync(
        resolve('../dist/vue-ssr-client-manifest.json'),
        'utf-8'
      )
    )
    update()
  })

  server.use(
    hotMiddleware(clientCompiler, {
      log: false,
    })
  )
  // 重要！！ 将devmiddleware挂载到express服务中，提供对其内部内存中数据的访问
  server.use(clientDevMiddleware)

  return onReady
}

```
## 路由处理和异步数据请求

路由有同步的和异步的，异步的处理要通过`promise`。给`app.js`加上路由和store的导出

```js
export function createApp() {
  const router = createRouter()
  const store = createStore()

  const app = new Vue({
    router, // 把路由实例挂载到 Vue 根实例中
    store,
    // 根实例简单的渲染应用程序组件。
    render: (h) => h(App),
  })
  return { app, router, store }
}
```
`entry-server.js`

```js
export default async (context) => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  const { app, router, store } = createApp()

  const meta = app.$meta()

  // 设置服务器端 router 的位置
  router.push(context.url)

  // 等到 router 将可能的异步组件和钩子函数解析完
  // new Promise((resolve, reject) => {
  //   router.onReady(resolve, reject)
  // })
  await new Promise(router.onReady.bind(router))

  context.rendered = () => {
    // renderer 会把 context.state数据对象内联到页面中
    context.state = store.state
  }

  return app
}

```
`entry-client.js`。这里的`__INITIAL_STATE__`是`vue-ssr`挂载到window的数据，通过这个来让服务端store和客户端store
数据保持一致
```js
// 客户端特定引导逻辑……

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// 这里假定 App.vue 模板中根元素具有 `id="app"`
router.onReady(() => {
  app.$mount('#app')
})
```
同理`server`的改动
```js
const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      title: '拉钩教育',
      meta: '<meta name="description" content="拉钩教育" />',
      url: req.url,
    })
    // 设置请求头
    res.end(html)
  } catch (error) {
    res.status(500).end('服务器出错')
  }
}

server.get(
  '*',
  isPord
    ? render
    : async (req, res) => {
        // 等待有了 renderer渲染器以后，调用render进行渲染
        await onReady
        render(req, res)
      }
)
```
