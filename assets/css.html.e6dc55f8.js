import{c as n}from"./app.4fc04cd2.js";import{_ as s}from"./plugin-vue_export-helper.21dcd24c.js";var a="/blog/assets/1.16765df3.png";const p={},t=n('<h1 id="css" tabindex="-1"><a class="header-anchor" href="#css" aria-hidden="true">#</a> css</h1><p>\u8FD9\u91CC\u65B9\u4EE3\u7801\u5B9E\u73B0\uFF0C\u5982\u679C\u60F3\u770B\u57FA\u7840\u603B\u7ED3\uFF0C\u67E5\u770B<code>xmind</code>\u6587\u4EF6\u5939\u4E0B\u7684<code>css</code>\u6587\u4EF6</p><p><img src="'+a+`" alt="css\u8111\u56FE"></p><h2 id="\u4E24\u680F\u5E03\u5C40" tabindex="-1"><a class="header-anchor" href="#\u4E24\u680F\u5E03\u5C40" aria-hidden="true">#</a> \u4E24\u680F\u5E03\u5C40</h2><p>\u4E00\u822C\u6765\u8BF4\u662F\u5DE6\u8FB9\u56FA\u5B9A\u5BBD\u5EA6\uFF0C\u53F3\u8FB9\u81EA\u9002\u5E94</p><ul><li>\u5229\u7528\u6D6E\u52A8\u548C<code>margin-left</code></li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.outer</span> <span class="token punctuation">{</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.left</span> <span class="token punctuation">{</span>
  <span class="token property">float</span><span class="token punctuation">:</span> left<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.right</span> <span class="token punctuation">{</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> auto<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> gainsboro<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><ul><li>\u5DE6\u4FA7\u5DE6\u6D6E\u52A8\uFF0C\u53F3\u4FA7\u89E6\u53D1<code>bfc</code>\uFF0C<code>bfc</code>\u5143\u7D20\u4E0D\u4F1A\u91CD\u53E0\u3002</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.outer</span> <span class="token punctuation">{</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.left</span> <span class="token punctuation">{</span>
  <span class="token property">float</span><span class="token punctuation">:</span> left<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.right</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> auto<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
  <span class="token property">overflow</span><span class="token punctuation">:</span> hidden<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><ul><li>\u4F7F\u7528<code>flex</code>\u5E03\u5C40</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.outer</span> <span class="token punctuation">{</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.left</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">flex</span><span class="token punctuation">:</span> 0 0 200px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.right</span> <span class="token punctuation">{</span>
  <span class="token property">flex</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><ul><li>\u7EDD\u5BF9\u5B9A\u4F4D</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.outer</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.left</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.right</span> <span class="token punctuation">{</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> gold<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h2 id="\u4E09\u680F\u5E03\u5C40\u7684\u5B9E\u73B0" tabindex="-1"><a class="header-anchor" href="#\u4E09\u680F\u5E03\u5C40\u7684\u5B9E\u73B0" aria-hidden="true">#</a> \u4E09\u680F\u5E03\u5C40\u7684\u5B9E\u73B0</h2><p>\u4E00\u822C\u662F\u5DE6\u53F3\u56FA\u5B9A\uFF0C\u4E2D\u95F4\u81EA\u9002\u5E94\u7684\u5E03\u5C40</p><ul><li>\u5229\u7528\u7EDD\u5BF9\u5B9A\u4F4D</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.outer</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.left</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.right</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">right</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> yellowgreen<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.center</span> <span class="token punctuation">{</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">margin-right</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> gold<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><ul><li><code>flex</code>\u5E03\u5C40</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.outer</span> <span class="token punctuation">{</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.left</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">flex</span><span class="token punctuation">:</span> 0 0 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.right</span> <span class="token punctuation">{</span>
  <span class="token property">flex</span><span class="token punctuation">:</span> 0 0 200px<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> yellowgreen<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.center</span> <span class="token punctuation">{</span>
  <span class="token property">flex</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> gold<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><ul><li>\u5723\u676F\u5E03\u5C40 \u4E2D\u95F4\u4E00\u5217\u653E\u5728\u6700\u524D\u9762</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.outer</span> <span class="token punctuation">{</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">padding-left</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">padding-right</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.left</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> -100px<span class="token punctuation">;</span>

  <span class="token property">float</span><span class="token punctuation">:</span> left<span class="token punctuation">;</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> -100%<span class="token punctuation">;</span>

  <span class="token property">width</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.right</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>

  <span class="token property">float</span><span class="token punctuation">:</span> right<span class="token punctuation">;</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> -200px<span class="token punctuation">;</span>

  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> gold<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.center</span> <span class="token punctuation">{</span>
  <span class="token property">float</span><span class="token punctuation">:</span> left<span class="token punctuation">;</span>

  <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> lightgreen<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br></div></div><ul><li>\u53CC\u98DE\u7FFC\u5E03\u5C40</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.outer</span> <span class="token punctuation">{</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.left</span> <span class="token punctuation">{</span>
  <span class="token property">float</span><span class="token punctuation">:</span> left<span class="token punctuation">;</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> -100%<span class="token punctuation">;</span>

  <span class="token property">width</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.right</span> <span class="token punctuation">{</span>
  <span class="token property">float</span><span class="token punctuation">:</span> left<span class="token punctuation">;</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> -200px<span class="token punctuation">;</span>

  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> gold<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.wrapper</span> <span class="token punctuation">{</span>
  <span class="token property">float</span><span class="token punctuation">:</span> left<span class="token punctuation">;</span>

  <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> lightgreen<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.center</span> <span class="token punctuation">{</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">margin-right</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div><ul><li>\u4F7F\u7528<code>flex</code>\u5B9E\u73B0<code>center</code>\u5728\u6700\u524D\u9762\u7684\u4E09\u680F\u5E03\u5C40 \u63A8\u8350</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.outer</span> <span class="token punctuation">{</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.left</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">flex</span><span class="token punctuation">:</span> 0 0 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">order</span><span class="token punctuation">:</span> -1<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.right</span> <span class="token punctuation">{</span>
  <span class="token property">flex</span><span class="token punctuation">:</span> 0 0 200px<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> yellowgreen<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.center</span> <span class="token punctuation">{</span>
  <span class="token property">flex</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> gold<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><div class="highlight-line">\xA0</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h2 id="\u6C34\u5E73\u5782\u76F4\u5C45\u4E2D" tabindex="-1"><a class="header-anchor" href="#\u6C34\u5E73\u5782\u76F4\u5C45\u4E2D" aria-hidden="true">#</a> \u6C34\u5E73\u5782\u76F4\u5C45\u4E2D</h2><ul><li>\u7EDD\u5BF9\u5B9A\u4F4D\uFF0C\u4F7F\u7528\u4E86<code>css3</code>\u5C5E\u6027</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.child</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translate</span><span class="token punctuation">(</span>-50%<span class="token punctuation">,</span>-50%<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><ul><li>\u7EDD\u5BF9\u5B9A\u4F4D<code>margin</code></li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.child</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">bottom</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">right</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> auto<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><ul><li>\u7EDD\u5BF9\u5B9A\u4F4D\uFF0C\u5DF2\u77E5\u76D2\u5B50</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.child</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">margin-top</span><span class="token punctuation">:</span> -50px<span class="token punctuation">;</span>     <span class="token comment">/* \u81EA\u8EAB height \u7684\u4E00\u534A */</span>
  <span class="token property">margin-left</span><span class="token punctuation">:</span> -50px<span class="token punctuation">;</span>    <span class="token comment">/* \u81EA\u8EAB width \u7684\u4E00\u534A */</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><ul><li><code>flex</code> \u73B0\u4EE3\u6D4F\u89C8\u5668\u57FA\u672C\u4E0D\u8003\u8651<code>ie</code>\uFF0C\u63A8\u8350\u4F7F\u7528</li></ul><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">.parent</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
  <span class="token property">justify-content</span><span class="token punctuation">:</span>center<span class="token punctuation">;</span>
  <span class="token property">align-items</span><span class="token punctuation">:</span>center<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="\u5B9E\u73B0\u4E00\u4E2A\u4E09\u89D2\u5F62" tabindex="-1"><a class="header-anchor" href="#\u5B9E\u73B0\u4E00\u4E2A\u4E09\u89D2\u5F62" aria-hidden="true">#</a> \u5B9E\u73B0\u4E00\u4E2A\u4E09\u89D2\u5F62</h2><p><code>border</code>\u662F\u7531\u56DB\u4E2A\u4E09\u89D2\u5F62\u7EC4\u6210\u7684\uFF0C\u6240\u4EE5\u53EF\u4EE5\u7528\u6765\u5B9E\u73B0\u4E09\u89D2\u5F62</p><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">div</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">border</span><span class="token punctuation">:</span> 100px solid<span class="token punctuation">;</span>
  <span class="token property">border-color</span><span class="token punctuation">:</span> orange blue red green<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">/* \u4E0B\u4E09\u89D2\u5F62 */</span>
<span class="token selector">div</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">border-top</span><span class="token punctuation">:</span> 50px solid red<span class="token punctuation">;</span>
  <span class="token property">border-right</span><span class="token punctuation">:</span> 50px solid transparent<span class="token punctuation">;</span>
  <span class="token property">border-left</span><span class="token punctuation">:</span> 50px solid transparent<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h2 id="\u5B9E\u73B0\u4E00\u4E2A\u6247\u5F62" tabindex="-1"><a class="header-anchor" href="#\u5B9E\u73B0\u4E00\u4E2A\u6247\u5F62" aria-hidden="true">#</a> \u5B9E\u73B0\u4E00\u4E2A\u6247\u5F62</h2><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">div</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">border</span><span class="token punctuation">:</span> 100px solid transparent<span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>
  <span class="token property">border-top-color</span><span class="token punctuation">:</span> tomato<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="\u5982\u4F55\u89E3\u51B31px\u95EE\u9898" tabindex="-1"><a class="header-anchor" href="#\u5982\u4F55\u89E3\u51B31px\u95EE\u9898" aria-hidden="true">#</a> \u5982\u4F55\u89E3\u51B31px\u95EE\u9898</h2><ul><li><p>\u76F4\u63A5\u5199\uFF0C\u8FD9\u6837\u517C\u5BB9\u6027\u4E0D\u884C \u5728<code>ios</code>\u7AEF\u662F\u53EF\u4EE5\uFF0C<code>\u5B89\u5353</code>\u7CFB\u7EDF\u5219\u4E0D\u884C</p></li><li><p>\u4F2A\u5143\u7D20\u7F29\u653E\uFF0C\u6700\u5E38\u7528\u7684\u65B9\u6CD5</p></li></ul><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span> <span class="token attr-name">data-device</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span>{{window.devicePixelRatio}}</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">#container[data-device=&quot;2&quot;]</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">#container[data-device=&quot;2&quot;]::after</span><span class="token punctuation">{</span>
    <span class="token property">position</span><span class="token punctuation">:</span>absolute<span class="token punctuation">;</span>
    <span class="token property">top</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
    <span class="token property">left</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 200%<span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 200%<span class="token punctuation">;</span>
    <span class="token property">content</span><span class="token punctuation">:</span><span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
    <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">scale</span><span class="token punctuation">(</span>0.5<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token property">transform-origin</span><span class="token punctuation">:</span> left top<span class="token punctuation">;</span>
    <span class="token property">box-sizing</span><span class="token punctuation">:</span> border-box<span class="token punctuation">;</span>
    <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #333<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div>`,43);function e(c,l){return t}var r=s(p,[["render",e]]);export{r as default};
