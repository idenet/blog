import{c as n}from"./app.5be05241.js";import{_ as s}from"./plugin-vue_export-helper.21dcd24c.js";const a={},p=n(`<h1 id="hash-\u548C-history-\u539F\u7406\u7684\u533A\u522B" tabindex="-1"><a class="header-anchor" href="#hash-\u548C-history-\u539F\u7406\u7684\u533A\u522B" aria-hidden="true">#</a> hash \u548C history \u539F\u7406\u7684\u533A\u522B</h1><ul><li>hash\u6A21\u5F0F\u662F\u57FA\u4E8E\u951A\u70B9\uFF0C\u4EE5\u53CAonhashchange\u4E8B\u4EF6</li><li>history\u6A21\u5F0F\u57FA\u4E8Ehtml5\u4E2D\u7684historyapi <ul><li>history.pushState() ie10 \u4EE5\u540E\u624D\u652F\u6301</li><li>history.replaceState()</li><li>history\u9700\u8981\u670D\u52A1\u5668\u7684\u652F\u6301\uFF0C\u5728\u670D\u52A1\u7AEF\u914D\u7F6E404\u8FD4\u56DE\u9875\u9762</li></ul></li></ul><h1 id="\u57FA\u4E8Evue-use\u548Chistory-api\u5B9E\u73B0\u4E00\u4E2A\u6700\u7B80\u5355\u7684router" tabindex="-1"><a class="header-anchor" href="#\u57FA\u4E8Evue-use\u548Chistory-api\u5B9E\u73B0\u4E00\u4E2A\u6700\u7B80\u5355\u7684router" aria-hidden="true">#</a> \u57FA\u4E8Evue.use\u548Chistory api\u5B9E\u73B0\u4E00\u4E2A\u6700\u7B80\u5355\u7684router</h1><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">let</span> _Vue <span class="token operator">=</span> <span class="token keyword">null</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">VueRouter</span> <span class="token punctuation">{</span>
  <span class="token doc-comment comment">/**
   * \u9700\u8981\u505A\u7684\u4E8B\u60C5
   * 1. \u5224\u65AD\u662F\u5426\u5DF2\u7ECF\u52A0\u8F7Dvue-router
   * 2. \u5427vue\u6784\u9020\u51FD\u6570\u8BB0\u5F55\u5230\u5168\u5C40\u53D8\u91CF
   * 3. \u628A\u521B\u5EFAvue\u5B9E\u4F8B\u65F6\u5019\u4F20\u5165\u7684router\u5BF9\u8C61\u6CE8\u5165\u5230vue\u5B9E\u4F8B\u4E0A
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">vue</span>
   */</span>
  <span class="token keyword">static</span> <span class="token function">install</span><span class="token punctuation">(</span><span class="token parameter">vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>VueRouter<span class="token punctuation">.</span>install<span class="token punctuation">.</span>installed<span class="token punctuation">)</span> <span class="token keyword">return</span>
    VueRouter<span class="token punctuation">.</span>install<span class="token punctuation">.</span>installed <span class="token operator">=</span> <span class="token boolean">true</span>

    _Vue <span class="token operator">=</span> vue

    _Vue<span class="token punctuation">.</span><span class="token function">mixin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token function">beforeCreate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>$options<span class="token punctuation">.</span>router<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token class-name">_Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>$router <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$options<span class="token punctuation">.</span>router
          <span class="token keyword">this</span><span class="token punctuation">.</span>$options<span class="token punctuation">.</span>router<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>options <span class="token operator">=</span> options
    <span class="token keyword">this</span><span class="token punctuation">.</span>routeMap <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>data <span class="token operator">=</span> _Vue<span class="token punctuation">.</span><span class="token function">observable</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">current</span><span class="token operator">:</span> <span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">createRouteMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">initComponents</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">initEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * \u904D\u5386\u6240\u6709\u7684\u8DEF\u7531\u89C4\u5219\uFF0C\u5427\u8DEF\u7531\u89C4\u5219\u89E3\u6790\u6210\u952E\u503C\u5BF9\u7684\u5F62\u5F0F \u5B58\u50A8\u5230routeMap\u4E2D
   */</span>
  <span class="token function">createRouteMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>options<span class="token punctuation">.</span>routes<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">route</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>routeMap<span class="token punctuation">[</span>route<span class="token punctuation">.</span>path<span class="token punctuation">]</span> <span class="token operator">=</span> route<span class="token punctuation">.</span>component
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">initComponents</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;router-link&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">porps</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">to</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token comment">// template: &#39;&lt;a :href=&quot;to&quot;&gt;&lt;slot&gt;&lt;/slot&gt;&lt;/a&gt;&#39;, // \u9700\u8981\u7F16\u8BD1\u5668</span>
      <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">h</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span>
          <span class="token string">&#39;a&#39;</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span>
            <span class="token literal-property property">attrs</span><span class="token operator">:</span> <span class="token punctuation">{</span>
              <span class="token literal-property property">href</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>to<span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token literal-property property">on</span><span class="token operator">:</span> <span class="token punctuation">{</span>
              <span class="token literal-property property">click</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>clickHandler<span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">[</span><span class="token keyword">this</span><span class="token punctuation">.</span>$slots<span class="token punctuation">.</span>default<span class="token punctuation">]</span>
        <span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token function">clickHandler</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          history<span class="token punctuation">.</span><span class="token function">pushState</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>to<span class="token punctuation">)</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>$router<span class="token punctuation">.</span>data<span class="token punctuation">.</span>current <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>to
          e<span class="token punctuation">.</span><span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">const</span> self <span class="token operator">=</span> <span class="token keyword">this</span>
    Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;router-view&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">h</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> component <span class="token operator">=</span> self<span class="token punctuation">.</span>routeMap<span class="token punctuation">[</span>self<span class="token punctuation">.</span>data<span class="token punctuation">.</span>current<span class="token punctuation">]</span>
        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">initEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;popstate&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span>current <span class="token operator">=</span> window<span class="token punctuation">.</span>location<span class="token punctuation">.</span>pathname
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br></div></div>`,4);function t(e,o){return p}var u=s(a,[["render",t]]);export{u as default};
