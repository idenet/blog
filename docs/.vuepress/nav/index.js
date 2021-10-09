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
    children: ['entry/', 'entry/static', 'entry/instance'],
  },
]
module.exports = {
  vueSidebar,
}
