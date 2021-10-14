const vueSidebar = [
  {
    title: 'vue-router',
    collapsable: false,
    children: ['vue-router/'],
  },
  {
    title: '手写的简易响应式vue',
    collapsable: false,
    children: ['reactive/'],
  },
  {
    title: '从入口开始的执行流程',
    collapsable: false,
    children: [
      'entry/',
      'entry/static',
      'entry/instance',
      'entry/_init',
      'entry/initState',
    ],
  },
  {
    title: 'vue响应式原理',
    collapsable: false,
    children: [
      'vueReactive/',
      'vueReactive/observer',
      'vueReactive/Dep',
      'vueReactive/Watcher',
      'vueReactive/scheduler',
      'vueReactive/others',
    ],
  },
  {
    title: 'render过程',
    collapsable: false,
    children: ['render/', 'render/render', 'render/createElement'],
  },
]
module.exports = {
  vueSidebar,
}