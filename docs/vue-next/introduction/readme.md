# vue-next

- 源码组织方式发生变化
- Composition api
- 性能提升
- Vite

## 目录结构

```js
packages 项目包
- compiler-core 编译核心
- compiler-dom  dom编译相关
- compiler-sfc  单文件编译，依赖core和dom
- compiler-ssr  ssr
- reactivity   响应式
- ref-transform ref相关
- runtime-core 运行时核心
- runtime-dom  运行时dom相关
- runtime-test 测试时用的
- server-renderer 服务端渲染
- shared  
- size-check 检查包的大小
- template-explorer 实时编译的组件
- vue 
```

## 构建版本

- cjs
- global
- browser
- bundler

## composition api

设计动机

- options API
  - 包含一个描述组件的选项（data、methods、props等）的对象
  - options Api 开发复杂组件，同一个功能逻辑的代码被拆分到不同选项
- composition API
  - Vue.js 3.0 新增的一组api
  - 一组基于函数的api
  - 可以更灵活的组织组件的逻辑


## 性能提升

### 响应式系统的升级

- vue.js 2.x中响应式系统的核心 defineProperty
- vue.js 3.0中使用proxy 对象重写响应式系统
  - 可以监听动态新增的属性
  - 可以监听删除的属性
  - 可以监听数组的索引和length属性

### 编译优化

- vue2.0中通过标记静态根节点，优化diff的过程
- vue3.0中标记和提升所有静态根节点，diff的时候只需要对比动态节点内容
  - fragments
  - 静态提升
  - patch flag
  - 缓存事件处理函数
