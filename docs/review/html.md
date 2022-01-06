# HTML 基础

## src和href的区别

`src`表示对资源的引用，会将指向的资源下载并替换当前内容。当浏览器解析遇到`src`会暂停其他资源的下载和处理，直到将该资源加载或执行完毕，这也是`script`放在底部的原因

href表示超文本引用，它指向网络资源。当浏览器识别到它的时候，会并行下载资源，不会停止对当前文档的处理

## 对html语义化的理解

语义化就是用正确的标签做正确的事情。

优点有：

- 对seo友好，支持读屏软件。
- 对开发者友好，开发者能清晰的看出网页结构，便于开发团队的维护

常见的语义化标签有`header nav section main article aside footer`等

## doctype的作用

doctype是告诉浏览器应该以什么样的文档类型定义来解析文档，不同的渲染模式会影响浏览器对`css`代码甚至`js`脚本解析。
浏览器渲染页面的两种模式，可以通过`document.compatMode`获取

- CSS1Compat：标准模式 浏览器以其支持的最高标准呈现页面
- backCompat：怪异模式（混杂模式） 页面以一种比较宽松的向后兼容的方式显示

## script 标签中的 defer 和 async

这两个属性都是去异步加载外部的js脚本，区别在于

- 执行顺序，`async`不能保证加载顺序，`defer`会按照顺序加载
- `async`表示后续文档的加载和js脚本的执行是并行的，`defer`的js脚本会等到所有文档元素加载完成后执行，`DOMContentLoaded`事件触发之前

## 常用的`meta`标签有哪些

`meta`标签用来描述网页文档的属性，常用的`meta`标签有哪些
1. charset 用来描述文档编码类型
2. keywords 页面关键字 用于seo
3. description 页面描述 用于seo
4. refresh 页面重定向和刷新 `<meta http-equiv="refresh" content="0;url=" />`
5. viewpoit 控制窗口大小和比例 适配移动设备
6. robots 搜索引擎索引方式
   1. all 文件将被检索，页面上的链接可以被查询
   2. none 所有都不行
   3. index 文件将被检索
   4. follow 页面上的链接可以被查询
   5. noindex 文件将不被检索
   6. nofollow 页面上的链接不可被查询
   
## html5 有哪些更新

1. 语义化标签 `header nav section aside article footer`
2. 媒体标签 `audio video`
3. 表单
   1. 表单类型 `email url number search range color(颜色拾取器) time date datetime(只有safari支持) datetime-local week month`
   2. 表单属性 `autocomplete=“on”` 或者 `autocomplete=“off”` 使用这个属性需要有两个前提：1. 表单必须提交过 2. 必须有`name`属性
   3. 表单事件 `oninput 、oninvalid`
4. 进度条 `progress`
5. 剩余容量 `meter`
6. `DOM`查询操作 `document.querySelector() document.querySelectorAll()` 
7. web存储 `localstorage sessionStorage`
8. `canvas Geolocation websocket historyAPI`
9. 移除元素 `basefont big center font s strike tt u`和`frame frameset noframes`

## img 的 srcset 属性的作用

使用这个属性能自动加载，不同屏幕密度下的图片，例如，其中 `340px`和`128px` 是表示图片宽度

```html
<img src="image-128.png"
     srcset="image-128.png 128w, image-256.png 256w, image-512.png 512w"
     sizes="(max-width: 360px) 340px, 128px" />
```
还有另一种写法

```html
<picture>
  <source media="(max-width: 799px)" srcset="elva-480w-close-portrait.jpg">
  <source media="(min-width: 800px)" srcset="elva-800w.jpg">
  <img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva">
</picture>
```

## 行内元素 块级元素 空元素

1. `a b span img input select strong`
2. `div ul li dl dt dd h1-6 p`
3. `br hr img input link meta`


## webwork

webwork独立于其他`js`脚本，不会影响页面性能，并且通过`postmessage`将结果传回主线程，这样在进行复杂计算的时候就不会阻塞主线程

## html5 离线存储

在用户没有网络时，可以正常访问站点或者应用，在连接网络时，再去更新用户机器上的缓存文件

**原理：**HTML5的离线缓存基于一个新建的`.appcache`文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，之后当网络处于离线就会使用这些资源

**使用方法**
1. 创建一个和html同名的mainfest文件，然后在页面头部加入该属性
```js
<html lang="en" manifest="index.manifest">
```
2. 在`index.mainfest`文件中编写需要离线存储的资源
```js
CACHE MANIFEST
 #v0.11
 CACHE: // 资源列表
 js/app.js
 css/style.css
 NETWORK: // 表示只有在在线情况下才能访问
 resourse/logo.png
 FALLBACK: // 如果访问失败就访问这个
 / /offline.html
```
3. 在离线状态时，操作`window.applicationCache`进行离线缓存的操作

**如何更新**
1. 更新 mainfest文件
2. 通过js 操作
3. 清除浏览器缓存

## 浏览器是如何对HTML5的离线存储资源进行管理和加载

1. 在线情况下，如果是第一次，会根据`mainfest`文件的内容下载相应资源并进行存储，如果已有，则会使用离线资源加载页面。然后浏览器会比对新旧mainfest文件，如果有改变，就会重新下载资源
2. 离线情况下，直接使用离线资源

## iframe的优缺点

iframe会创建一个包含另外一个文档的内联框架

优点：用来加载速度比较慢的内容（广告），可以使用脚本并行下载，可以实现跨字域通信
缺点：iframe会阻塞主页面的onload事件 无法被搜索引擎识别 产生很多页面不容易管理

## title 与 h1 的区别、b 与 strong 的区别、i 与 em 的区别？

- strong标签有语义，更利于seo，
- h1 也是对seo更加重要 title没有明确意义
- i表示斜体， em表示强调的文本

## label标签的作用，如何使用

label用来定义表单控件的关系，当用户选择label，浏览器会将焦点自动转到相关表单上


## canvas 和 svg 的区别

svg 可缩放矢量图形是基于可扩展标记语言xml描述的2d图形语言

1. 不依赖分辨率
2. 支持事件处理器
3. 不适合游戏

canvas画布 通过js绘制2d图形，是逐像素渲染的。位置发生改变就会重新绘制

1. 依赖分辨率
2. 不支持事件处理器
3. 弱文本渲染能力
4. 能够以png或者jpg格式来保存图像结果
5. 适合游戏

## head标签的作用，其中什么必不可少

标签用于定义文档的头部，是所有头部元素的容器。其中`title`是必不可少的

## 文档声明（Doctype）和`<!Doctype html>`有何作用? 严格模式与混杂模式如何区分？它们有何意义?

文档模式告诉了浏览器用何种格式来解析。`<!Doctype html>`表示使用html5标准来解析页面。如果不写会进入混杂模式

- 严格模式：标准模式 按照标准来解析
- 混杂模式 通常用来模拟老式浏览器的行为

## 渐进增强和优雅降级之间的区别

- 优雅降级 一开始就构建完整的功能，然后针对浏览器去兼容
- 渐进增强 主要针对低级浏览器进行功能开发，在保证基本功能的情况下，在针对高级浏览器进行效果和交互功能的改进

## 