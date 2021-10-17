const vueSidebar = {
  '/vue/': [
    {
      text: '手写的简易响应式vue',
      children: ['/vue/reactive/'],
    },
    {
      text: '从入口开始的执行流程',
      children: [
        '/vue/entry/',
        '/vue/entry/static',
        '/vue/entry/instance',
        '/vue/entry/init',
        '/vue/entry/initState',
      ],
    },
    {
      text: 'vue响应式原理',
      children: [
        '/vue/vueReactive/',
        '/vue/vueReactive/observer',
        '/vue/vueReactive/Dep',
        '/vue/vueReactive/Watcher',
        '/vue/vueReactive/scheduler',
        '/vue/vueReactive/others',
      ],
    },
    {
      text: 'render过程',
      children: [
        '/vue/render/',
        '/vue/render/render',
        '/vue/render/createElement',
      ],
    },
    {
      text: '编译',
      children: ['/vue/compiler/'],
    },
    {
      text: '组件',
      children: ['/vue/component/'],
    },
    {
      text: 'vue-router',
      children: ['/vue/vue-router/'],
    },
    {
      text: 'vuex',
      children: ['/vue/vuex/'],
    },
  ],
}
module.exports = {
  vueSidebar,
}
