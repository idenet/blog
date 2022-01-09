import{c as n}from"./app.5627432c.js";import{_ as s}from"./plugin-vue_export-helper.21dcd24c.js";var a="/blog/assets/2.8c57ea58.png";const p={},t=n('<h1 id="js\u57FA\u7840" tabindex="-1"><a class="header-anchor" href="#js\u57FA\u7840" aria-hidden="true">#</a> js\u57FA\u7840</h1><p>\u8FD9\u91CC\u65B9\u4EE3\u7801\u5B9E\u73B0\uFF0C\u5982\u679C\u60F3\u770B\u57FA\u7840\u603B\u7ED3\uFF0C\u67E5\u770B<code>xmind</code>\u6587\u4EF6\u5939\u4E0B\u7684<code>js</code>\u6587\u4EF6</p><p><img src="'+a+`" alt="js\u8111\u56FE"></p><h2 id="instanceof-\u7684\u5B9E\u73B0" tabindex="-1"><a class="header-anchor" href="#instanceof-\u7684\u5B9E\u73B0" aria-hidden="true">#</a> instanceof \u7684\u5B9E\u73B0</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">myInstance</span> <span class="token punctuation">(</span><span class="token parameter">left<span class="token punctuation">,</span> right</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u83B7\u53D6\u5BF9\u8C61\u7684\u539F\u578B</span>
  <span class="token keyword">let</span> proto <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">getPrototypeOf</span><span class="token punctuation">(</span>left<span class="token punctuation">)</span>
  <span class="token comment">// \u83B7\u53D6\u6784\u9020\u51FD\u6570\u7684prototype</span>
  <span class="token keyword">let</span> prototype <span class="token operator">=</span> right<span class="token punctuation">.</span>prototype

  <span class="token comment">// \u5224\u65AD\u6784\u9020\u51FD\u6570\u7684prototype \u5BF9\u8C61\u662F\u5426\u5728\u5BF9\u8C61\u7684\u539F\u578B\u94FE\u4E0A</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>proto<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">false</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>proto <span class="token operator">===</span> prototype<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">true</span>
    <span class="token comment">// \u5982\u679C\u6CA1\u6709\u627E\u5230\u5C31\u7EE7\u7EED\u4ECE\u5176\u539F\u578B\u4E0A\u627E\uFF0C</span>
    proto <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">getPrototypeOf</span><span class="token punctuation">(</span>proto<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h2 id="new-\u64CD\u4F5C\u7B26\u5B9E\u73B0\u539F\u7406" tabindex="-1"><a class="header-anchor" href="#new-\u64CD\u4F5C\u7B26\u5B9E\u73B0\u539F\u7406" aria-hidden="true">#</a> new \u64CD\u4F5C\u7B26\u5B9E\u73B0\u539F\u7406</h2><p>\u8FD9\u91CC\u53BB\u9664\u4E00\u4E9B\u8FB9\u9645\u5224\u65AD \u53EA\u5173\u6CE8\u6838\u5FC3</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">objectFactory</span><span class="token punctuation">(</span><span class="token parameter">constructor<span class="token punctuation">,</span> <span class="token operator">...</span>rest</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u521B\u5EFA\u4E00\u4E2A\u7A7A\u5BF9\u8C61\uFF0C\u5BF9\u8C61\u7684\u539F\u578B\u4E3A\u6784\u9020\u51FD\u6570\u7684prototype</span>
  <span class="token keyword">let</span> newObj  <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>constructor<span class="token punctuation">.</span>prototype<span class="token punctuation">)</span>
  <span class="token comment">// \u5C06this \u6307\u5411\u8FD9\u4E2A\u65B0\u5BF9\u8C61\uFF0C\u5E76\u6267\u884C\u51FD\u6570</span>
  <span class="token function">constructor</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span>newObj<span class="token punctuation">,</span> rest<span class="token punctuation">)</span>
  <span class="token comment">// \u8FD4\u56DE\u65B0\u5BF9\u8C61</span>
  <span class="token keyword">return</span> newObj
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="ajax" tabindex="-1"><a class="header-anchor" href="#ajax" aria-hidden="true">#</a> ajax</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token constant">SERVER_URL</span> <span class="token operator">=</span> <span class="token string">&quot;/server&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> xhr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">XMLHttpRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// \u521B\u5EFA Http \u8BF7\u6C42</span>
xhr<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token string">&quot;GET&quot;</span><span class="token punctuation">,</span> url<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// \u8BBE\u7F6E\u72B6\u6001\u76D1\u542C\u51FD\u6570</span>
xhr<span class="token punctuation">.</span><span class="token function-variable function">onreadystatechange</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>readyState <span class="token operator">!==</span> <span class="token number">4</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token comment">// \u5F53\u8BF7\u6C42\u6210\u529F\u65F6</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token number">200</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">handle</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>response<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>statusText<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token comment">// \u8BBE\u7F6E\u8BF7\u6C42\u5931\u8D25\u65F6\u7684\u76D1\u542C\u51FD\u6570</span>
xhr<span class="token punctuation">.</span><span class="token function-variable function">onerror</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>statusText<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token comment">// \u8BBE\u7F6E\u8BF7\u6C42\u5934\u4FE1\u606F</span>
xhr<span class="token punctuation">.</span>responseType <span class="token operator">=</span> <span class="token string">&quot;json&quot;</span><span class="token punctuation">;</span>
xhr<span class="token punctuation">.</span><span class="token function">setRequestHeader</span><span class="token punctuation">(</span><span class="token string">&quot;Accept&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;application/json&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// \u53D1\u9001 Http \u8BF7\u6C42</span>
xhr<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><h2 id="\u539F\u578B\u4FEE\u6539\u3001\u91CD\u5199" tabindex="-1"><a class="header-anchor" href="#\u539F\u578B\u4FEE\u6539\u3001\u91CD\u5199" aria-hidden="true">#</a> \u539F\u578B\u4FEE\u6539\u3001\u91CD\u5199</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name
<span class="token punctuation">}</span>
<span class="token comment">// \u4FEE\u6539\u539F\u578B</span>
<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">getName</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">var</span> p <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">)</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>p<span class="token punctuation">.</span>__proto__ <span class="token operator">===</span> <span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">)</span> <span class="token comment">// true</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>p<span class="token punctuation">.</span>__proto__ <span class="token operator">===</span> p<span class="token punctuation">.</span>constructor<span class="token punctuation">.</span>prototype<span class="token punctuation">)</span> <span class="token comment">// true</span>
<span class="token comment">// \u91CD\u5199\u539F\u578B</span>
<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token function-variable function">getName</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">var</span> p <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">)</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>p<span class="token punctuation">.</span>__proto__ <span class="token operator">===</span> <span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">)</span>        <span class="token comment">// true</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>p<span class="token punctuation">.</span>__proto__ <span class="token operator">===</span> p<span class="token punctuation">.</span>constructor<span class="token punctuation">.</span>prototype<span class="token punctuation">)</span> <span class="token comment">// false</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>\u4E0B\u9762<code>p</code>\u7684\u539F\u578B\u88AB\u4FEE\u6539\u4E86\uFF0C<code>p.constructor</code> \u4E0D\u6307\u5411<code>Person</code>\u3002\u90A3\u4E48\u53EA\u8981\u4FEE\u6539\u56DE\u6765\u5C31\u597D\u4E86</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token class-name">Person</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token function-variable function">getName</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">var</span> p <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">)</span>
p<span class="token punctuation">.</span>constructor <span class="token operator">=</span> Person
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>p<span class="token punctuation">.</span>__proto__ <span class="token operator">===</span> <span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">)</span>        <span class="token comment">// true</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>p<span class="token punctuation">.</span>__proto__ <span class="token operator">===</span> p<span class="token punctuation">.</span>constructor<span class="token punctuation">.</span>prototype<span class="token punctuation">)</span> <span class="token comment">// true</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="\u539F\u578B\u94FE\u6307\u5411" tabindex="-1"><a class="header-anchor" href="#\u539F\u578B\u94FE\u6307\u5411" aria-hidden="true">#</a> \u539F\u578B\u94FE\u6307\u5411</h2><p><strong>\u8981\u7262\u8BB0 <code>__proto__</code>\u662F\u6D4F\u89C8\u5668\u7684\u5B9E\u73B0\uFF0C\u5B83\u662F\u7528\u6765\u8BBF\u95EE<code>prototype</code>\u7684\u3002</strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>p<span class="token punctuation">.</span>__proto__  <span class="token comment">// Person.prototype</span>
<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>__proto__  <span class="token comment">// Object.prototype</span>
p<span class="token punctuation">.</span>__proto__<span class="token punctuation">.</span>__proto__ <span class="token comment">//Object.prototype</span>
p<span class="token punctuation">.</span><span class="token class-name">__proto__</span><span class="token punctuation">.</span>constructor<span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>__proto__ <span class="token comment">// Object.prototype</span>
<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>constructor<span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>__proto__ <span class="token comment">// Object.prototype</span>
p1<span class="token punctuation">.</span><span class="token class-name">__proto__</span><span class="token punctuation">.</span>constructor <span class="token comment">// Person</span>
<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>constructor  <span class="token comment">// Person</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="\u5982\u4F55\u83B7\u5F97\u5BF9\u8C61\u975E\u539F\u578B\u94FE\u4E0A\u7684\u5C5E\u6027" tabindex="-1"><a class="header-anchor" href="#\u5982\u4F55\u83B7\u5F97\u5BF9\u8C61\u975E\u539F\u578B\u94FE\u4E0A\u7684\u5C5E\u6027" aria-hidden="true">#</a> \u5982\u4F55\u83B7\u5F97\u5BF9\u8C61\u975E\u539F\u578B\u94FE\u4E0A\u7684\u5C5E\u6027\uFF1F</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">iterate</span><span class="token punctuation">(</span><span class="token parameter">obj</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">var</span> res<span class="token operator">=</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">var</span> key <span class="token keyword">in</span> obj<span class="token punctuation">)</span><span class="token punctuation">{</span>
      <span class="token keyword">if</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span>
          res<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>key<span class="token operator">+</span><span class="token string">&#39;: &#39;</span><span class="token operator">+</span>obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> res<span class="token punctuation">;</span>
<span class="token punctuation">}</span> 
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="\u7EE7\u627F\u7684\u51E0\u79CD\u65B9\u5F0F" tabindex="-1"><a class="header-anchor" href="#\u7EE7\u627F\u7684\u51E0\u79CD\u65B9\u5F0F" aria-hidden="true">#</a> \u7EE7\u627F\u7684\u51E0\u79CD\u65B9\u5F0F</h2><ul><li>\u539F\u578B\u94FE\u7EE7\u627F</li></ul><p>\u7F3A\u70B9: \u65E0\u6CD5\u5B9E\u73B0\u591A\u7EE7\u627F</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">//\u7236\u7C7B\u578B</span>
<span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">,</span>
   <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">,</span>
   <span class="token keyword">this</span><span class="token punctuation">.</span>play <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>
   <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">setName</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">setAge</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
<span class="token comment">//\u5B50\u7C7B\u578B</span>
<span class="token keyword">function</span> <span class="token function">Student</span><span class="token punctuation">(</span><span class="token parameter">price</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token keyword">this</span><span class="token punctuation">.</span>price <span class="token operator">=</span> price
   <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">setScore</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token class-name">Student</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// \u5B50\u7C7B\u578B\u7684\u539F\u578B\u4E3A\u7236\u7C7B\u578B\u7684\u4E00\u4E2A\u5B9E\u4F8B\u5BF9\u8C61</span>
<span class="token keyword">var</span> s1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Student</span><span class="token punctuation">(</span><span class="token number">15000</span><span class="token punctuation">)</span>
<span class="token keyword">var</span> s2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Student</span><span class="token punctuation">(</span><span class="token number">14000</span><span class="token punctuation">)</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">,</span>s2<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><ul><li>\u501F\u7528\u6784\u9020\u51FD\u6570\u7EE7\u627F</li></ul><p>\u7F3A\u70B9\uFF1A\u65E0\u6CD5\u7EE7\u627F\u539F\u578B\u4E0A\u7684\u65B9\u6CD5</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">,</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">,</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">setName</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">setAge</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">Student</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age<span class="token punctuation">,</span> price</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">Person</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> name<span class="token punctuation">,</span> age<span class="token punctuation">)</span>  <span class="token comment">// \u76F8\u5F53\u4E8E: this.Person(name, age)</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>price <span class="token operator">=</span> price
<span class="token punctuation">}</span>
<span class="token keyword">var</span> s1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Student</span><span class="token punctuation">(</span><span class="token string">&#39;Tom&#39;</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">,</span> <span class="token number">15000</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><ul><li>\u7EC4\u5408\u7EE7\u627F</li></ul><p>\u4F7F\u7528\u4E86<code>es5</code>\u7684\u8BED\u6CD5\uFF0C<code>Object.create()</code>\uFF0C\u5C06\u5B50\u7C7B\u7684\u539F\u578B\u7684\u539F\u578B\u6307\u5411\u4E86\u7236\u7C7B\u7684\u539F\u578B\uFF0C\u5E76\u4E14\u5B83\u7684\u6784\u9020\u51FD\u6570\u91CD\u65B0\u6307\u5411\u81EA\u5DF1 \u6CA1\u6709\u526F\u4F5C\u7528\u7684\u65B9\u5F0F</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">,</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age
<span class="token punctuation">}</span>
<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">setAge</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;111&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">Student</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age<span class="token punctuation">,</span> price</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">Person</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> name<span class="token punctuation">,</span> age<span class="token punctuation">)</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>price <span class="token operator">=</span> price
  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">setScore</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token class-name">Student</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">)</span><span class="token comment">//\u6838\u5FC3\u4EE3\u7801</span>
<span class="token class-name">Student</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>constructor <span class="token operator">=</span> Student<span class="token comment">//\u6838\u5FC3\u4EE3\u7801</span>
<span class="token keyword">var</span> s1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Student</span><span class="token punctuation">(</span><span class="token string">&#39;Tom&#39;</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">,</span> <span class="token number">15000</span><span class="token punctuation">)</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1 <span class="token keyword">instanceof</span> <span class="token class-name">Student</span><span class="token punctuation">,</span> s1 <span class="token keyword">instanceof</span> <span class="token class-name">Person</span><span class="token punctuation">)</span> <span class="token comment">// true true</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">.</span>constructor<span class="token punctuation">)</span> <span class="token comment">//Student</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div>`,29);function o(e,c){return t}var r=s(p,[["render",o]]);export{r as default};
