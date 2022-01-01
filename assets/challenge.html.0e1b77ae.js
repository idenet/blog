import{r as e,o as p,a as t,b as s,d as o,F as c,e as n,c as l}from"./app.f234b68c.js";import{_ as r}from"./plugin-vue_export-helper.21dcd24c.js";const i={},k=s("h1",{id:"ts-\u7C7B\u578B\u6311\u6218",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#ts-\u7C7B\u578B\u6311\u6218","aria-hidden":"true"},"#"),n(" ts \u7C7B\u578B\u6311\u6218")],-1),u=s("p",null,[s("code",null,"typescript"),n("\u7684\u57FA\u7840\u8BED\u6CD5\u7C7B\u578B\u5F88\u7B80\u5355\uFF0C\u5728\u5199\u4E1A\u52A1\u7684\u65F6\u5019\u51E0\u4E4E\u7528\u4E0D\u5230\u5B83\u7684\u7C7B\u578B\u5B9A\u4E49\u3002\u4F46\u662F\u5F53\u8981\u5199\u4E00\u4E2A\u63D0\u793A\u53CB\u597D\u7684\u5DE5\u5177\u5E93\u7684\u65F6\u5019\uFF0C\u4ED6\u7684\u7C7B\u578B\u5B9A\u4E49\u53D8\u5F97\u975E\u5E38\u91CD\u8981\u3002")],-1),d=n("\u5728github\u4E0A\uFF0C"),b={href:"https://github.com/type-challenges/type-challenges",target:"_blank",rel:"noopener noreferrer"},m=n("type-challenges"),y=n("\u662F\u4E13\u95E8\u7528\u6765\u6DF1\u5316\u5BF9"),g=s("code",null,"typescript",-1),h=n("\u7684\u7406\u89E3 \u6211\u4EEC\u6765\u4E00\u6B65\u6B65\u6311\u6218\u5B83"),_=l(`<h2 id="\u521D\u7EA7" tabindex="-1"><a class="header-anchor" href="#\u521D\u7EA7" aria-hidden="true">#</a> \u521D\u7EA7</h2><h3 id="\u5B9E\u73B0-pick" tabindex="-1"><a class="header-anchor" href="#\u5B9E\u73B0-pick" aria-hidden="true">#</a> \u5B9E\u73B0 Pick</h3><p>\u9898\u76EE</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">Todo</span> <span class="token punctuation">{</span>
  title<span class="token operator">:</span> <span class="token builtin">string</span>
  description<span class="token operator">:</span> <span class="token builtin">string</span>
  completed<span class="token operator">:</span> <span class="token builtin">boolean</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> <span class="token class-name">TodoPreview</span> <span class="token operator">=</span> MyPick<span class="token operator">&lt;</span>Todo<span class="token punctuation">,</span> <span class="token string">&#39;title&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;completed&#39;</span><span class="token operator">&gt;</span>

<span class="token keyword">const</span> todo<span class="token operator">:</span> TodoPreview <span class="token operator">=</span> <span class="token punctuation">{</span>
    title<span class="token operator">:</span> <span class="token string">&#39;Clean room&#39;</span><span class="token punctuation">,</span>
    completed<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">MyPick<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token punctuation">,</span> <span class="token constant">K</span> <span class="token keyword">extends</span> <span class="token keyword">keyof</span> <span class="token constant">T</span><span class="token operator">&gt;</span></span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token punctuation">[</span>key <span class="token keyword">in</span> <span class="token constant">K</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">[</span>key<span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>\u89E3\u6790\uFF1A \u8FD9\u91CC\u4E3B\u8981\u662F\u4F7F\u7528\u4E86<code>keyof</code>\u83B7\u53D6\u4E86\u6CDB\u578B T \u7684 key\uFF0C\u7136\u540E\u901A\u8FC7 <code>extends</code>\u7EA6\u675F T \u7684\u503C\u5728 key \u91CC\u9762\uFF0C\u6700\u540E\u901A\u8FC7 <code>in</code> \u5FAA\u73AF k \uFF0C\u62FF\u5230 key \uFF0C\u8FD9\u4E2A key \u5BF9\u5E94 T \u5185\u7684\u503C\u3002</p><h3 id="\u5B9E\u73B0-readonly" tabindex="-1"><a class="header-anchor" href="#\u5B9E\u73B0-readonly" aria-hidden="true">#</a> \u5B9E\u73B0 readonly</h3><p>\u9898\u76EE</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// \u5C06\u6240\u6709\u5C5E\u6027\u8F6C\u53D8\u4E3A \u53EA\u8BFB</span>
<span class="token keyword">interface</span> <span class="token class-name">Todo</span> <span class="token punctuation">{</span>
  title<span class="token operator">:</span> <span class="token builtin">string</span>
  description<span class="token operator">:</span> <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> todo<span class="token operator">:</span> MyReadonly<span class="token operator">&lt;</span>Todo<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  title<span class="token operator">:</span> <span class="token string">&quot;Hey&quot;</span><span class="token punctuation">,</span>
  description<span class="token operator">:</span> <span class="token string">&quot;foobar&quot;</span>
<span class="token punctuation">}</span>

todo<span class="token punctuation">.</span>title <span class="token operator">=</span> <span class="token string">&quot;Hello&quot;</span> <span class="token comment">// Error: cannot reassign a readonly property</span>
todo<span class="token punctuation">.</span>description <span class="token operator">=</span> <span class="token string">&quot;barFoo&quot;</span> <span class="token comment">// Error: cannot reassign a readonly property</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">MyReadonly<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span></span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token keyword">readonly</span> <span class="token punctuation">[</span>key <span class="token keyword">in</span> <span class="token keyword">keyof</span> <span class="token constant">T</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">[</span>key<span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>\u89E3\u6790</p><p>\u83B7\u53D6 T \u7684 key\u503C\uFF0C\u5FAA\u73AF\u7136\u540E\u7ED9key \u6DFB\u52A0 <code>readonly</code></p><h2 id="\u5143\u7956\u8F6C\u6362\u6210\u5BF9\u8C61" tabindex="-1"><a class="header-anchor" href="#\u5143\u7956\u8F6C\u6362\u6210\u5BF9\u8C61" aria-hidden="true">#</a> \u5143\u7956\u8F6C\u6362\u6210\u5BF9\u8C61</h2><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// \u5C06\u5143\u7956\u8F6C\u6362\u6210\u5BF9\u8C61</span>
<span class="token keyword">const</span> tuple <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&#39;tesla&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;model 3&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;model X&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;model Y&#39;</span><span class="token punctuation">]</span> <span class="token keyword">as</span> <span class="token keyword">const</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">TupleToObject<span class="token operator">&lt;</span><span class="token constant">T</span> <span class="token keyword">extends</span> <span class="token keyword">readonly</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span></span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token punctuation">[</span>key <span class="token keyword">in</span> <span class="token constant">T</span><span class="token punctuation">[</span><span class="token builtin">number</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token operator">:</span> key
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div>`,15);function v(f,w){const a=e("ExternalLinkIcon");return p(),t(c,null,[k,u,s("p",null,[d,s("a",b,[m,o(a)]),y,g,h]),_],64)}var q=r(i,[["render",v]]);export{q as default};
