export const vueSidebar = {
  '/review/': [
    {
      text: '前端基础/面试',
      children: [
        '/review/html',
        '/review/css',
        '/review/js',
      ]
    },
  ],
  '/vue/': [
    {
      text: '从一个个例子看vue',
      children: [
        '/vue/example/',
        '/vue/example/data',
        '/vue/example/computed',
        '/vue/example/watch',
        '/vue/example/component',
        '/vue/example/async_comp',
      ]
    },
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
    {
      text: 'vue-ssr的搭建',
      children: ['/vue/vueSSR/'],
    },
  ],
  '/vue-next/': [
    {
      text: '手写简易响应式vue-next',
      children: ['/vue-next/reactive/'],
    },
  ],
  '/react/': [
    {
      text: 'tiny-react',
      children: ['/react/tinyReact/'],
    },
    {
      text: 'fiber',
      children: ['/react/fiber/'],
    },
  ],
  '/micro-front/': [
    {
      text: '介绍',
      children: ['/micro-front/intro/'],
    },
  ],
  '/front-test/': [
    {
      text: '前端测试',
      children: ['/front-test/intro/'],
    },
  ],
  '/performance/': [
    {
      text: '性能优化',
      children: ['/performance/', '/performance/lifecycle']
    },
  ],
  '/ts/': [
    {
      text: '类型挑战',
      children: ['/ts/challenge']
    }
  ]
}
