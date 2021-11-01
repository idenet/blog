"use strict";(self.webpackChunkstudy_note=self.webpackChunkstudy_note||[]).push([[951],{8450:(a,e,s)=>{s.r(e),s.d(e,{data:()=>n});const n={key:"v-6bc1d9ce",path:"/vue-next/introduction/",title:"vue-next",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"目录结构",slug:"目录结构",children:[]},{level:2,title:"构建版本",slug:"构建版本",children:[]},{level:2,title:"composition api",slug:"composition-api",children:[]},{level:2,title:"性能提升",slug:"性能提升",children:[{level:3,title:"响应式系统的升级",slug:"响应式系统的升级",children:[]},{level:3,title:"编译优化",slug:"编译优化",children:[]}]}],filePathRelative:"vue-next/introduction/readme.md",git:{updatedTime:1635776678e3}}},9741:(a,e,s)=>{s.r(e),s.d(e,{default:()=>r});const n=(0,s(6252).uE)('<h1 id="vue-next" tabindex="-1"><a class="header-anchor" href="#vue-next" aria-hidden="true">#</a> vue-next</h1><ul><li>源码组织方式发生变化</li><li>Composition api</li><li>性能提升</li><li>Vite</li></ul><h2 id="目录结构" tabindex="-1"><a class="header-anchor" href="#目录结构" aria-hidden="true">#</a> 目录结构</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>packages 项目包\n<span class="token operator">-</span> compiler<span class="token operator">-</span>core 编译核心\n<span class="token operator">-</span> compiler<span class="token operator">-</span>dom  dom编译相关\n<span class="token operator">-</span> compiler<span class="token operator">-</span>sfc  单文件编译，依赖core和dom\n<span class="token operator">-</span> compiler<span class="token operator">-</span>ssr  ssr\n<span class="token operator">-</span> reactivity   响应式\n<span class="token operator">-</span> ref<span class="token operator">-</span>transform ref相关\n<span class="token operator">-</span> runtime<span class="token operator">-</span>core 运行时核心\n<span class="token operator">-</span> runtime<span class="token operator">-</span>dom  运行时dom相关\n<span class="token operator">-</span> runtime<span class="token operator">-</span>test 测试时用的\n<span class="token operator">-</span> server<span class="token operator">-</span>renderer 服务端渲染\n<span class="token operator">-</span> shared  \n<span class="token operator">-</span> size<span class="token operator">-</span>check 检查包的大小\n<span class="token operator">-</span> template<span class="token operator">-</span>explorer 实时编译的组件\n<span class="token operator">-</span> vue \n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h2 id="构建版本" tabindex="-1"><a class="header-anchor" href="#构建版本" aria-hidden="true">#</a> 构建版本</h2><ul><li>cjs</li><li>global</li><li>browser</li><li>bundler</li></ul><h2 id="composition-api" tabindex="-1"><a class="header-anchor" href="#composition-api" aria-hidden="true">#</a> composition api</h2><p>设计动机</p><ul><li>options API <ul><li>包含一个描述组件的选项（data、methods、props等）的对象</li><li>options Api 开发复杂组件，同一个功能逻辑的代码被拆分到不同选项</li></ul></li><li>composition API <ul><li>Vue.js 3.0 新增的一组api</li><li>一组基于函数的api</li><li>可以更灵活的组织组件的逻辑</li></ul></li></ul><h2 id="性能提升" tabindex="-1"><a class="header-anchor" href="#性能提升" aria-hidden="true">#</a> 性能提升</h2><h3 id="响应式系统的升级" tabindex="-1"><a class="header-anchor" href="#响应式系统的升级" aria-hidden="true">#</a> 响应式系统的升级</h3><ul><li>vue.js 2.x中响应式系统的核心 defineProperty</li><li>vue.js 3.0中使用proxy 对象重写响应式系统 <ul><li>可以监听动态新增的属性</li><li>可以监听删除的属性</li><li>可以监听数组的索引和length属性</li></ul></li></ul><h3 id="编译优化" tabindex="-1"><a class="header-anchor" href="#编译优化" aria-hidden="true">#</a> 编译优化</h3><ul><li>vue2.0中通过标记静态根节点，优化diff的过程</li><li>vue3.0中标记和提升所有静态根节点，diff的时候只需要对比动态节点内容 <ul><li>fragments</li><li>静态提升</li><li>patch flag</li><li>缓存事件处理函数</li></ul></li></ul>',14),l={},r=(0,s(3744).Z)(l,[["render",function(a,e){return n}]])},3744:(a,e)=>{e.Z=(a,e)=>{for(const[s,n]of e)a[s]=n;return a}}}]);