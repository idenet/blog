import{c as n}from"./app.4fc04cd2.js";import{_ as s}from"./plugin-vue_export-helper.21dcd24c.js";const a={},p=n(`<h1 id="\u4F9D\u8D56\u6536\u96C6" tabindex="-1"><a class="header-anchor" href="#\u4F9D\u8D56\u6536\u96C6" aria-hidden="true">#</a> \u4F9D\u8D56\u6536\u96C6</h1><p><code>Dep</code>\u8FD9\u4E2A\u5BF9\u8C61\u662F\u4F9D\u8D56\u6536\u96C6\u7684\u6838\u5FC3\uFF0C\u91CC\u9762\u6D89\u53CA\u5230<code>get/set</code>\u7684\u4F9D\u8D56\u6536\u96C6\u548C\u6D3E\u53D1, <code>Dep</code>\u8981\u770B\u6574\u4E2A\u6587\u4EF6\uFF0C\u91CC\u9762\u7684\u5185\u5BB9\u90FD\u5F88\u91CD\u8981\u3002 \u56DE\u5FC6\u4E00\u4E0B\uFF0C\u5728\u6211\u4EEC\u6267\u884C<code>_init</code>\u7684\u65F6\u5019\uFF0C\u6267\u884C\u4E86<code>$mount</code>\uFF0C<code>$mount</code>\u5176\u5B9E\u5C31\u662F\u6267\u884C\u4E86<code>mountComponent</code>\uFF0C \u5176\u4E2D\u7684<code>new Watcher</code>\u5C06<code>vm._update</code>\u5728<code>get</code>\u7684\u65F6\u5019\u6267\u884C\u4E86\u3002\u800C\u8FD9\u4E2Aget\u65B9\u6CD5\u4E2D\uFF0C\u6709\u4E24\u4E2A\u65B9\u6CD5\u548C\u8FD9\u91CC\u5F3A\u76F8\u5173\uFF0C\u770B\u4EE3\u7801</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>
  <span class="token function">get</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// pushTarget\u5C06Watcher\u5B9E\u4F8B\u4F20\u5165\uFF0C\u8C03\u7528\u7684\u5C31\u662FDep\u91CC\u7684\u65B9\u6CD5</span>
    <span class="token function">pushTarget</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span>
    <span class="token keyword">let</span> value
    <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>vm
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      <span class="token comment">// \u6838\u5FC3\u6267\u884C\u4E86updateComponent</span>
      value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getter</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> vm<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token operator">...</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
      <span class="token operator">...</span>
      <span class="token comment">// \u6267\u884C\u5B8C\u6210\u4E4B\u540E\u5F39\u51FA</span>
      <span class="token function">popTarget</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token comment">// \u5E76\u4E14\u6E05\u7406\u4E86\u4F9D\u8D56</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">cleanupDeps</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> value
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p>\u8FD9\u91CCvue\u5C06<code>Dep.target</code>\u6307\u5411\u4E86<code>watcher</code>\uFF0C \u90A3\u4E48\u4E0B\u9762\u7684<code>Dep.target.addDep(this)</code>(\u60F3\u60F3vue\u4E4B\u524D\u5728observer\u7684get\u4E2D\u8C03\u7528 \u4E86dep.depend)\uFF0C\u5176\u5B9E\u5C31\u662F\u6307\u5411\u4E86<code>watcher</code>\u7684<code>addDep</code>\u65B9\u6CD5\uFF0C \u90A3\u4E48\u7EE7\u7EED\u770BWatcher.md</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">let</span> uid <span class="token operator">=</span> <span class="token number">0</span>

<span class="token doc-comment comment">/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Dep</span> <span class="token punctuation">{</span>
  <span class="token keyword">static</span> <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token operator">?</span>Watcher<span class="token punctuation">;</span>
  <span class="token literal-property property">id</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token literal-property property">subs</span><span class="token operator">:</span> Array<span class="token operator">&lt;</span>Watcher<span class="token operator">&gt;</span><span class="token punctuation">;</span>

  <span class="token function">constructor</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> uid<span class="token operator">++</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>subs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// \u6536\u96C6\u4F9D\u8D56</span>
  <span class="token function">addSub</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">sub</span><span class="token operator">:</span> Watcher</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>subs<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>sub<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">removeSub</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">sub</span><span class="token operator">:</span> Watcher</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">remove</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>subs<span class="token punctuation">,</span> sub<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// observer\u4E2D\u8C03\u7528\u4E86depend\u65B9\u6CD5\uFF0C\u6CE8\u610F Dep.target\u5C31\u662Fwatcher\uFF0C </span>
  <span class="token comment">// \u6240\u4EE5\u8FD9\u91CC\u5176\u5B9E\u8C03\u7528\u7684watcher\u7684 addDep\u65B9\u6CD5\uFF0C\u5E76\u628Adep\u4F20\u5165</span>
  <span class="token function">depend</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Dep<span class="token punctuation">.</span>target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      Dep<span class="token punctuation">.</span>target<span class="token punctuation">.</span><span class="token function">addDep</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token function">notify</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// stabilize the subscriber list first</span>
    <span class="token keyword">const</span> subs <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>subs<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">!==</span> <span class="token string">&#39;production&#39;</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>config<span class="token punctuation">.</span>async<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// subs aren&#39;t sorted in scheduler if not running async</span>
      <span class="token comment">// we need to sort them now to make sure they fire in correct</span>
      <span class="token comment">// order</span>
      subs<span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> a<span class="token punctuation">.</span>id <span class="token operator">-</span> b<span class="token punctuation">.</span>id<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> l <span class="token operator">=</span> subs<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> l<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// \u8C03\u7528\u6BCF\u4E2A\u8BA2\u9605\u8005\u7684update\u65B9\u6CD5</span>
      subs<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// Dep.target\u7528\u6765\u5B58\u653E\u76EE\u524D\u6B63\u5728\u4F7F\u7528\u7684watcher</span>
<span class="token comment">// \u5168\u5C40\u552F\u4E00\uFF0C\u5E76\u4E14\u4E00\u6B21\u4E5F\u53EA\u80FD\u6709\u4E00\u4E2Awatcher\u88AB\u4F7F\u7528</span>

Dep<span class="token punctuation">.</span>target <span class="token operator">=</span> <span class="token keyword">null</span>
<span class="token keyword">const</span> targetStack <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

<span class="token comment">// \u5165\u6808\u5E76\u5C06\u5F53\u524D watcher \u8D4B\u503C\u7ED9\u4E86Dep.target</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">pushTarget</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token operator">?</span>Watcher</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  targetStack<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>
  Dep<span class="token punctuation">.</span>target <span class="token operator">=</span> target
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">popTarget</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  targetStack<span class="token punctuation">.</span><span class="token function">pop</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  Dep<span class="token punctuation">.</span>target <span class="token operator">=</span> targetStack<span class="token punctuation">[</span>targetStack<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br></div></div>`,5);function t(e,o){return p}var u=s(a,[["render",t]]);export{u as default};
