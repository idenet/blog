"use strict";(self.webpackChunkstudy_note=self.webpackChunkstudy_note||[]).push([[2233],{8788:(l,e,r)=>{r.r(e),r.d(e,{data:()=>n});const n={key:"v-74603b78",path:"/performance/",title:"前端性能优化",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"什么是web性能",slug:"什么是web性能",children:[]},{level:2,title:"为什么要关注网站性能",slug:"为什么要关注网站性能",children:[]},{level:2,title:"如何进行 web 性能优化",slug:"如何进行-web-性能优化",children:[{level:3,title:"性能指标",slug:"性能指标",children:[]},{level:3,title:"渲染流程",slug:"渲染流程",children:[]}]},{level:2,title:"web vitals",slug:"web-vitals",children:[]},{level:2,title:"web 性能测试",slug:"web-性能测试",children:[{level:3,title:"常见检测工具",slug:"常见检测工具",children:[]}]},{level:2,title:"chrome devtools",slug:"chrome-devtools",children:[{level:3,title:"浏览器任务管理器",slug:"浏览器任务管理器",children:[]},{level:3,title:"network 网络分析",slug:"network-网络分析",children:[]},{level:3,title:"coverage 面板",slug:"coverage-面板",children:[]},{level:3,title:"memory 面板",slug:"memory-面板",children:[]},{level:3,title:"performance 面板",slug:"performance-面板",children:[]},{level:3,title:"performance monitor",slug:"performance-monitor",children:[]}]}],filePathRelative:"performance/readme.md",git:{updatedTime:1639231809e3}}},9385:(l,e,r)=>{r.r(e),r.d(e,{default:()=>nl});var n=r(6252),a=r(1343);const i=(0,n._)("h1",{id:"前端性能优化",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#前端性能优化","aria-hidden":"true"},"#"),(0,n.Uk)(" 前端性能优化")],-1),t=(0,n._)("h2",{id:"什么是web性能",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#什么是web性能","aria-hidden":"true"},"#"),(0,n.Uk)(" 什么是web性能")],-1),o=(0,n._)("p",null,"web性能是网站或者网站应用程序的客观度量和可感知的用户体验",-1),u=(0,n._)("ul",null,[(0,n._)("li",null,"减少整体加载时间：减少文件体积、减少http请求、使用预加载"),(0,n._)("li",null,"使网站尽快可用：仅加载首屏内容、其他内容根据需要懒加载"),(0,n._)("li",null,"平滑和交互性：使用css替代js动画、减少ui重绘"),(0,n._)("li",null,"感知表现：给用户作用反馈，比如加载动画、进度条等"),(0,n._)("li",null,"性能测定：性能指标、性能测试、性能监控持续优化")],-1),h=(0,n._)("h2",{id:"为什么要关注网站性能",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#为什么要关注网站性能","aria-hidden":"true"},"#"),(0,n.Uk)(" 为什么要关注网站性能")],-1),_=(0,n._)("ul",null,[(0,n._)("li",null,"用户留存"),(0,n._)("li",null,"网站转化率"),(0,n._)("li",null,"体验与传播"),(0,n._)("li",null,"搜索排名")],-1),d=(0,n._)("h2",{id:"如何进行-web-性能优化",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#如何进行-web-性能优化","aria-hidden":"true"},"#"),(0,n.Uk)(" 如何进行 web 性能优化")],-1),s=(0,n._)("ol",null,[(0,n._)("li",null,"首先了解性能指标，多快才算快"),(0,n._)("li",null,"使用专业工具评估网站性能"),(0,n._)("li",null,"然后立足于网站渲染流程，分析造成的原因"),(0,n._)("li",null,"进行技术可行性分析"),(0,n._)("li",null,"迭代优化")],-1),c=(0,n._)("h3",{id:"性能指标",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#性能指标","aria-hidden":"true"},"#"),(0,n.Uk)(" 性能指标")],-1),g={href:"https://web.dev/vitals/",target:"_blank",rel:"noopener noreferrer"},p=(0,n.Uk)("web vitals"),m={href:"https://googlechrome.github.io/lighthouse/scorecalc/",target:"_blank",rel:"noopener noreferrer"},b=(0,n.Uk)("web score权重"),k=(0,n._)("p",null,[(0,n.Uk)("2020年google提出的侧重于用户体验的三个方面 "),(0,n._)("strong",null,"加载性能、交互性、视觉稳定性"),(0,n.Uk)("三个方面 并提供了以下阈值")],-1),f=(0,n._)("ul",null,[(0,n._)("li",null,[(0,n.Uk)("First Contentful Paint (FCP): "),(0,n._)("strong",null,"首次绘制内容，浏览器首次绘制来自dom的内容的时间"),(0,n.Uk)("，这里只要显示内容了，就算绘制完成")]),(0,n._)("li",null,[(0,n.Uk)("Largest Contentful Paint (LCP)："),(0,n._)("strong",null,"最大内容绘制"),(0,n.Uk)("，测量加载性能，LCP应在页面首次开始加载后的2.5s内发生")]),(0,n._)("li",null,[(0,n.Uk)("First Input Delay (FID)："),(0,n._)("strong",null,"首次输入延迟，测量交互性"),(0,n.Uk)("。页面的fid应为100毫秒或更短")]),(0,n._)("li",null,[(0,n.Uk)("Time to Interactive (TTI): 表示网页第一次达到"),(0,n._)("strong",null,"完全可交互状态"),(0,n.Uk)("的时间点，浏览器已经可以持续性的响应用户输入")]),(0,n._)("li",null,"Total Blocking Time (TBT): 总阻塞时间，度量 FCP 和 TTI 之间的总时间，即用户操作后到响应之间的时间"),(0,n._)("li",null,[(0,n.Uk)("Cumulative Layout Shift (CLS)："),(0,n._)("strong",null,"积累布局偏倚，测量视觉稳定性"),(0,n.Uk)("。页面的cls应保持在0.1或者更少")])],-1),v=(0,n._)("h3",{id:"渲染流程",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#渲染流程","aria-hidden":"true"},"#"),(0,n.Uk)(" 渲染流程")],-1),w=(0,n._)("p",null,"从我们打开地址栏输入url到整个页面渲染出来。整个过程包括域名解析、建立TCP连接，前后端通过HTTP进行会话，压缩与解压缩。以及前端的关键路径渲染。加载流程图如下所示",-1),U=(0,n._)("p",null,[(0,n._)("img",{src:a,alt:"加载流程"})],-1),x=(0,n._)("p",null,[(0,n._)("strong",null,"优化方案")],-1),C=(0,n._)("p",null,"从上图中就能看出在那些方面是可优化的",-1),y=(0,n._)("ul",null,[(0,n._)("li",null,"从发出请求到收到响应的优化，比如DNS查询，http长连接、http2、http压缩、http缓存等"),(0,n._)("li",null,"关键路径渲染优化，比如是否存在不必要的重绘和回流"),(0,n._)("li",null,"加载过程优化，比如延迟加载，是否有不需要在首屏展示的非关键信息，占用了加载时间"),(0,n._)("li",null,"资源优化，图片视频"),(0,n._)("li",null,"构建优化，压缩代码，基于webpack的构建优化")],-1),P=(0,n._)("h2",{id:"web-vitals",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#web-vitals","aria-hidden":"true"},"#"),(0,n.Uk)(" web vitals")],-1),T=(0,n._)("p",null,"web vitals是google经过验证后新提出的来衡量网站性能的方式。且LCP和ClS（相关layout instability API）已于今年入W3C草拟标准",-1),j=(0,n._)("p",null,"测量工具：",-1),I={href:"https://github.com/GoogleChrome/web-vitals",target:"_blank",rel:"noopener noreferrer"},L=(0,n.Uk)("web-vitals库"),W=(0,n._)("li",null,"测试工具 lightouse",-1),F=(0,n.Uk)("浏览器插件 "),D={href:"https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma",target:"_blank",rel:"noopener noreferrer"},S=(0,n.Uk)("web-vitials"),A=(0,n._)("h2",{id:"web-性能测试",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#web-性能测试","aria-hidden":"true"},"#"),(0,n.Uk)(" web 性能测试")],-1),B=(0,n._)("p",null,"在展开介绍性能检测方法和工具之前，我们需要破除一些错误认知",-1),G=(0,n._)("ul",null,[(0,n._)("li",null,[(0,n._)("strong",null,"不要通过单一指标就能衡量网站的性能体验"),(0,n.Uk)("，要多维度的思考整个网站的性能表现")]),(0,n._)("li",null,[(0,n._)("strong",null,"不要一次检测就能得到网站性能表现的客观结果"),(0,n.Uk)("，网站性能在不同设备不同网络环境下是可变的，需要我们手机尽可能多的数据，然后以此来进行性能分析")]),(0,n._)("li",null,[(0,n._)("strong",null,"不要仅在开发环境中模拟进行性能检测")])],-1),H=(0,n._)("h3",{id:"常见检测工具",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#常见检测工具","aria-hidden":"true"},"#"),(0,n.Uk)(" 常见检测工具")],-1),N=(0,n._)("ul",null,[(0,n._)("li",null,"lighthouse 开发工具"),(0,n._)("li",null,"webPageTest"),(0,n._)("li",null,[(0,n.Uk)("浏览器devtools "),(0,n._)("ul",null,[(0,n._)("li",null,"浏览器任务管理器"),(0,n._)("li",null,"netWork面板"),(0,n._)("li",null,"coverage 面板"),(0,n._)("li",null,"memory面板"),(0,n._)("li",null,"performance面板"),(0,n._)("li",null,"performance monitor 面板")])]),(0,n._)("li",null,"性能监控API"),(0,n._)("li",null,"持续性能监控方案")],-1),Z=(0,n._)("h2",{id:"chrome-devtools",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#chrome-devtools","aria-hidden":"true"},"#"),(0,n.Uk)(" chrome devtools")],-1),z=(0,n._)("h3",{id:"浏览器任务管理器",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#浏览器任务管理器","aria-hidden":"true"},"#"),(0,n.Uk)(" 浏览器任务管理器")],-1),O=(0,n._)("p",null,"通过chrom任务管理器可以插件进程中，关于GPU、网络和内存空间的使用情况。",-1),R=(0,n._)("h3",{id:"network-网络分析",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#network-网络分析","aria-hidden":"true"},"#"),(0,n.Uk)(" network 网络分析")],-1),Y=(0,n._)("p",null,"通过它可以查看网站所有资源的请求情况，包括加载时间，尺寸大小，优先级设置一级http缓存触发情况等信息。从而帮助我们发现由于未压缩或者后台返回不及时导致的请求问题，或者资源尺寸过大问题，或者未合理配置缓存策略导致的二次请求过长问题",-1),q=(0,n._)("h3",{id:"coverage-面板",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#coverage-面板","aria-hidden":"true"},"#"),(0,n.Uk)(" coverage 面板")],-1),E=(0,n._)("p",null,[(0,n._)("strong",null,"我们可以通过Coverage面板监控并统计出网站应用运行过程中代码执行的覆盖率情况。"),(0,n.Uk)("，该面板统计的对象是javascript脚本文件与css样式表文件，统计结果主要包括")],-1),J=(0,n._)("ul",null,[(0,n._)("li",null,"每个文件字节大小"),(0,n._)("li",null,"执行过程中已覆盖的代码字节数"),(0,n._)("li",null,"以及可视化的覆盖率图形")],-1),K=(0,n._)("p",null,"这里我们可以看见那里包含比较多的不执行代码，而使用webpack的tree shaking 仅能根据export 进行无关联引用，那么此时coverage 面板就为优化提供了一条可以尝试的路径",-1),M=(0,n._)("h3",{id:"memory-面板",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#memory-面板","aria-hidden":"true"},"#"),(0,n.Uk)(" memory 面板")],-1),Q=(0,n._)("p",null,[(0,n.Uk)("前端主要使用js代码来处理逻辑，所以保证代码执行过程中内存的良性循环对用户体验来说很重要，如果出现内存泄漏，那么就可能会带来网站应用卡顿或者崩溃。这时通过"),(0,n._)("strong",null,"memory"),(0,n.Uk)("生成堆内存快照，就能查看出现内存泄漏的换届，进行解决")],-1),V=(0,n._)("h3",{id:"performance-面板",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#performance-面板","aria-hidden":"true"},"#"),(0,n.Uk)(" performance 面板")],-1),X=(0,n._)("p",null,"面板使用非常简单，需要注意的是：建议在chrome浏览器的匿名模式下使用该工具，因为在匿名模式下不会受到既有缓存或者其他插件的因素的影响，能够给性能检测提供一个相对干净的运行环境",-1),$=(0,n._)("h3",{id:"performance-monitor",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#performance-monitor","aria-hidden":"true"},"#"),(0,n.Uk)(" performance monitor")],-1),ll=(0,n._)("p",null,"performance 存在面板信息不够直观，数据实时性不够强等问题，后来chrome 增加了 实时监控的面板，通过 devtools 里运行命令打开监控页面，通过他让我们可以实时监控网站运行过程中，cpu占有率，js内存使用大小、内存中dom节点的数量，js事件监听次数，以及页面发生重绘和重排的处理时间等信息",-1),el=(0,n._)("p",null,"据此如果发现页面中出现较为陡峭的增长 就意味着可能有影响性能的风险存在",-1),rl={},nl=(0,r(3744).Z)(rl,[["render",function(l,e){const r=(0,n.up)("OutboundLink");return(0,n.wg)(),(0,n.iD)(n.HY,null,[i,t,o,u,h,_,d,s,c,(0,n._)("p",null,[(0,n._)("a",g,[p,(0,n.Wm)(r)]),(0,n._)("a",m,[b,(0,n.Wm)(r)])]),k,f,v,w,U,x,C,y,P,T,j,(0,n._)("ul",null,[(0,n._)("li",null,[(0,n._)("a",I,[L,(0,n.Wm)(r)])]),W,(0,n._)("li",null,[F,(0,n._)("a",D,[S,(0,n.Wm)(r)])])]),A,B,G,H,N,Z,z,O,R,Y,q,E,J,K,M,Q,V,X,$,ll,el],64)}]])},3744:(l,e)=>{e.Z=(l,e)=>{for(const[r,n]of e)l[r]=n;return l}},1343:(l,e,r)=>{l.exports=r.p+"assets/img/1.ecf72478.jpg"}}]);