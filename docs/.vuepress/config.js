const nav = require('./nav/index')
const { vueSidebar } = nav

module.exports = {
  title: '王泽斌',
  description: '王泽斌的学习记录',
  dest: './dist',
  base: '/blog/',
  head: [['link', { rel: 'icon', href: '/icon.png' }]],
  port: 3000,
  markdown: {
    lineNumbers: false,
  },
  themeConfig: {
    lastUpdated: '最后更新时间',
    sidebar: 'auto',
    repo: 'https://github.com/idenet/blog',
    repoLabel: 'Github',
    nav: [
      {
        text: 'Vue源码分析',
        link: '/vue/vue-router/',
      },
    ],
    sidebar: {
      '/vue/': vueSidebar,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@images': '../images',
      },
    },
  },
}
