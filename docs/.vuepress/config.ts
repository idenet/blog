import { defineUserConfig } from 'vuepress'
// const nav = require('./nav/index')
import { vueSidebar } from './nav'

export default defineUserConfig({
  title: '王文武',
  description: '王文武的学习记录',
  dest: './dist',
  lang: 'zh-CN',
  base: '/blog/',
  head: [
    [
      'link',
      {
        rel: 'manifest',
        href: '/blog/manifest.webmanifest',
      },
    ],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    [
      'link',
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/blog/favicon.ico' },
    ],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
  ],
  themeConfig: {
    lastUpdated: '最后更新时间',
    repo: 'https://github.com/idenet/blog',
    repoLabel: 'Github',
    navbar: [
      {
        text: 'Vue源码分析',
        link: '/vue/reactive/',
      },
      {
        text: 'vue-next',
        link: '/vue-next/reactive/',
      },
      {
        text: 'React',
        link: '/react/tinyReact/',
      },
      {
        text: '微前端',
        link: '/micro-front/intro/',
      },
      {
        text: '前端测试',
        link: '/front-test/intro/',
      },
    ],
    sidebar: {
      ...vueSidebar,
    },
    contributors: false,
    editLink: false,
  },
  plugins: [
    ['@vuepress/plugin-pwa'],
    [
      '@vuepress/plugin-pwa-popup',
      {
        locales: {
          '/': {
            message: '发现新内容可用',
            buttonText: '刷新',
          },
        },
      },
    ],
  ],
})
