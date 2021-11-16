"use strict";(self.webpackChunkstudy_note=self.webpackChunkstudy_note||[]).push([[521],{6385:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-62e08928",path:"/vue/render/render.html",title:"render",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[],filePathRelative:"vue/render/render.md",git:{updatedTime:1637053844e3}}},7177:(n,s,a)=>{a.r(s),a.d(s,{default:()=>e});const p=(0,a(6252).uE)('<h1 id="render" tabindex="-1"><a class="header-anchor" href="#render" aria-hidden="true">#</a> render</h1><p>在之前的首次渲染中我们知道，<code>mountComponent</code>方法中，会调用<code>new Watcher</code>作为首次渲染的wacher，而它传入的方法 <code>updateComponent</code>中的回调就是dom更新的入口</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token function-variable function">updateComponent</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  vm<span class="token punctuation">.</span><span class="token function">_update</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span><span class="token function">_render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> hydrating<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>找到了入口，我们就可以看到它调用了<code>vm._render</code>， 而它就是实例上的<code>_render</code>方法，我们在<code>_init</code>方法中的<code>initRender</code>进行了声明 ，看以下代码，我们能找到<code>vm.$createElement</code></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// 对编译生成的render进行渲染方法 </span>\nvm<span class="token punctuation">.</span><span class="token function-variable function">_c</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> c<span class="token punctuation">,</span> d</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">createElement</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> c<span class="token punctuation">,</span> d<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n<span class="token comment">// 对手写的render函数进行渲染的方法</span>\nvm<span class="token punctuation">.</span><span class="token function-variable function">$createElement</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> c<span class="token punctuation">,</span> d</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">createElement</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> c<span class="token punctuation">,</span> d<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>  <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">_render</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> VNode <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> vm<span class="token operator">:</span> Component <span class="token operator">=</span> <span class="token keyword">this</span>\n    <span class="token comment">// 获取实例上options里的render方法</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> render<span class="token punctuation">,</span> _parentVnode <span class="token punctuation">}</span> <span class="token operator">=</span> vm<span class="token punctuation">.</span>$options\n\n    vm<span class="token punctuation">.</span>$vnode <span class="token operator">=</span> _parentVnode\n    <span class="token comment">// render self</span>\n    <span class="token keyword">let</span> vnode\n    <span class="token keyword">try</span> <span class="token punctuation">{</span>\n      currentRenderingInstance <span class="token operator">=</span> vm\n      <span class="token comment">// 调用render，传入 vm 和vm.$createElement</span>\n      <span class="token comment">// vm._renderProxy 就是vm，这个在_init中有定义</span>\n      vnode <span class="token operator">=</span> <span class="token function">render</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_renderProxy<span class="token punctuation">,</span> vm<span class="token punctuation">.</span>$createElement<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">handleError</span><span class="token punctuation">(</span>e<span class="token punctuation">,</span> vm<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">render</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n     \n      <span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">!==</span> <span class="token string">&#39;production&#39;</span> <span class="token operator">&amp;&amp;</span> vm<span class="token punctuation">.</span>$options<span class="token punctuation">.</span>renderError<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">try</span> <span class="token punctuation">{</span>\n          vnode <span class="token operator">=</span> vm<span class="token punctuation">.</span>$options<span class="token punctuation">.</span><span class="token function">renderError</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_renderProxy<span class="token punctuation">,</span> vm<span class="token punctuation">.</span>$createElement<span class="token punctuation">,</span> e<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token function">handleError</span><span class="token punctuation">(</span>e<span class="token punctuation">,</span> vm<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">renderError</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n          vnode <span class="token operator">=</span> vm<span class="token punctuation">.</span>_vnode\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        vnode <span class="token operator">=</span> vm<span class="token punctuation">.</span>_vnode\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>\n      currentRenderingInstance <span class="token operator">=</span> <span class="token keyword">null</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 如果是array</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>vnode<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> vnode<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      vnode <span class="token operator">=</span> vnode<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// return empty vnode in case the render function errored out</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>vnode <span class="token keyword">instanceof</span> <span class="token class-name">VNode</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">!==</span> <span class="token string">&#39;production&#39;</span> <span class="token operator">&amp;&amp;</span> Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>vnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">warn</span><span class="token punctuation">(</span>\n          <span class="token string">&#39;Multiple root nodes returned from render function. Render function &#39;</span> <span class="token operator">+</span>\n          <span class="token string">&#39;should return a single root node.&#39;</span><span class="token punctuation">,</span>\n          vm\n        <span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      vnode <span class="token operator">=</span> <span class="token function">createEmptyVNode</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// set parent</span>\n    vnode<span class="token punctuation">.</span>parent <span class="token operator">=</span> _parentVnode\n    <span class="token keyword">return</span> vnode\n  <span class="token punctuation">}</span>\n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br></div></div>',6),t={},e=(0,a(3744).Z)(t,[["render",function(n,s){return p}]])},3744:(n,s)=>{s.Z=(n,s)=>{const a=n.__vccOpts||n;for(const[n,p]of s)a[n]=p;return a}}}]);