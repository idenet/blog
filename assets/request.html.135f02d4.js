import{c as e}from"./app.6a7f8286.js";import{_ as a}from"./plugin-vue_export-helper.21dcd24c.js";var i="/blog/assets/2.dcb2f1cc.png";const d={},r=e(`<h1 id="\u8BF7\u6C42\u548C\u54CD\u5E94\u4F18\u5316" tabindex="-1"><a class="header-anchor" href="#\u8BF7\u6C42\u548C\u54CD\u5E94\u4F18\u5316" aria-hidden="true">#</a> \u8BF7\u6C42\u548C\u54CD\u5E94\u4F18\u5316</h1><p>\u6838\u5FC3\u601D\u8DEF</p><ol><li>\u66F4\u597D\u7684\u94FE\u63A5\u4F20\u8F93\u6548\u7387</li><li>\u66F4\u5C11\u7684\u8BF7\u6C42\u6570\u91CF</li><li>\u66F4\u5C0F\u7684\u8D44\u6E90\u5927\u5C0F</li><li>\u5408\u9002\u7684\u7F13\u5B58\u7B56\u7565</li></ol><p>\u6700\u4F73\u5B9E\u8DF5</p><ol><li>\u51CF\u5C11DNS\u67E5\u627E</li><li>\u91CD\u7528tcp\u94FE\u63A5</li><li>\u51CF\u5C11http\u91CD\u5B9A\u5411</li><li>\u538B\u7F29\u8D44\u6E90\u4F20\u8F93</li><li>\u4F7F\u7528\u7F13\u5B58</li><li>\u4F7F\u7528cdn</li><li>\u5220\u9664\u6CA1\u5FC5\u8981\u7684\u8D44\u6E90\u8BF7\u6C42</li><li>\u5728\u5BA2\u6237\u7AEF\u7F13\u5B58\u8D44\u6E90</li><li>\u5185\u5BB9\u5728\u4F20\u8F93\u524D\u5148\u538B\u7F29</li><li>\u5E76\u884C\u5904\u7406\u8BF7\u6C42\u548C\u54CD\u5E94</li><li>\u5347\u7EA7\u5230http2.0</li><li>\u670D\u52A1\u7AEF\u6E32\u67D3</li><li>\u91C7\u7528\u9884\u6E32\u67D3\u7684\u65B9\u5F0F\u52A0\u5FEB\u52A0\u8F7D\u9759\u6001\u9875\u9762</li></ol><h2 id="dns-\u89E3\u6790" tabindex="-1"><a class="header-anchor" href="#dns-\u89E3\u6790" aria-hidden="true">#</a> dns \u89E3\u6790</h2><p><strong>dns-prefetch</strong> \u662F\u5C1D\u8BD5\u5728\u8BF7\u6C42\u8D44\u6E90\u4E4B\u524D\u89E3\u6790\u57DF\u540D\uFF0C\u57DF\u540D\u89E3\u6790\u548C\u5185\u5BB9\u52A0\u8F7D\u662F\u4E32\u884C\u7684\u7F51\u7EDC\uFF0C\u6240\u4EE5\u8FD9\u4E2A\u65B9\u5F0F\u80FD\u4ECB\u7ECD\u7528\u6237\u7B49\u5F85\u65F6\u95F4</p><p>\u4F7F\u7528cdn\u52A0\u901F\u57DF\u540D\uFF0C\u8FD9\u5757\u5728\u670D\u52A1\u7AEF\u5C24\u5176\u91CD\u8981\uFF0C\u56E0\u4E3Acdn\u4E00\u822C\u591A\u4E2A\u5730\u70B9\u914D\u7F6E\u670D\u52A1\u5668\uFF0C\u79BB\u7528\u6237\u8D8A\u8FD1\u8D8A\u597D</p><h2 id="http\u957F\u8FDE\u63A5" tabindex="-1"><a class="header-anchor" href="#http\u957F\u8FDE\u63A5" aria-hidden="true">#</a> http\u957F\u8FDE\u63A5</h2><p>\u5728http1.0\u65F6\u671F\uFF0C\u4E3A\u4E86\u4E0D\u9891\u7E41\u7684\u5EFA\u7ACB\u548C\u65AD\u5F00\u8FDE\u63A5\uFF0C\u6709\u4E9B\u6D4F\u89C8\u5668\u5728\u8BF7\u6C42\u65F6\uFF0C\u7528\u4E86\u4E00\u4E2A\u975E\u6807\u51C6\u7684\u5B57\u6BB5</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>Connection: keep-alive
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>\u8FD9\u4E2A\u5B57\u6BB5\u8981\u6C42\u670D\u52A1\u5668\u4E0D\u8981\u5173\u95ED\u8FDE\u63A5</p><p>\u534A\u5E74\u540Ehttp1.1\u53D1\u5E03\u5F15\u5165\u4E86\u6301\u4E45\u8FDE\u63A5\uFF0C\u5373tcp\u9ED8\u8BA4\u4E0D\u5173\u95ED\uFF0C\u53EF\u4EE5\u88AB\u591A\u4E2A\u8BF7\u6C42\u590D\u7528\u3002\u4E0D\u7528\u7533\u660E\u5B57\u6BB5</p><p>\u4F46\u662F\u8FD9\u8FD8\u662F\u6709\u4E2A\u95EE\u9898\uFF0C\u5BA2\u6237\u7AEF\u53D1\u9001\u8BF7\u6C42\u540E\u9700\u8981\u7B49\u5F85\u670D\u52A1\u7AEF\u54CD\u5E94\uFF0C\u624D\u80FD\u53D1\u8D77\u4E0B\u4E00\u4E2A\u8BF7\u6C42\u3002 \u56E0\u6B641.1\u8FD8\u5F15\u5165\u7684<strong>\u7BA1\u9053\u673A\u5236</strong>\uFF0C\u8FD9\u6837\u7528\u6237\u53EF\u4EE5\u5E76\u884C\u7684\u53D1\u8D77\u591A\u4E2A\u8BF7\u6C42\uFF0C\u4E0D\u7528\u7B49\u5F85 \u4E00\u4E2Atcp\u8FDE\u63A5\u53EF\u4EE5\u4F20\u9001\u591A\u4E2A\u56DE\u5E94\uFF0C\u52BF\u5FC5\u8981\u6709\u4E00\u4E2A\u673A\u5236\u6765\u533A\u5206\u5C5E\u4E8E\u54EA\u4E2A\u56DE\u5E94\uFF0C\u8FD9\u5C31\u662F<code>content-Length</code>\u7684\u4F5C\u7528\uFF0C\u7528\u6765\u7533\u660E\u672C\u6B21\u56DE\u5E94\u7684\u6570\u636E\u957F\u5EA6</p><p>\u4F46\u662F\u8FD9\u8FD8\u662F\u6709\u4E2A\u95EE\u9898\uFF0C\u5BF9\u4E8E\u8017\u65F6\u5F88\u957F\u7684\u64CD\u4F5C\uFF0C\u670D\u52A1\u7AEF\u9700\u8981\u7B49\u6240\u6709\u64CD\u4F5C\u5B8C\u6210\uFF0C\u624D\u80FD\u53D1\u9001\u6570\u636E\u3002\u56E0\u6B641.1\u5F15\u5165\u4E86\u2019\u5206\u5757\u4F20\u8F93\u4EE3\u7801\u2018\uFF0C\u53EA\u8981\u5728\u8BF7\u6C42\u6216\u56DE\u5E94\u5934\u4E2D\u5177\u6709<code>Transfer-Encoding</code>\u5B57\u6BB5\uFF0C\u5C31\u8868\u660E\u56DE\u5E94\u5C06\u7531\u6570\u91CF\u672A\u5B9A\u7684\u6570\u636E\u5757\u7EC4\u6210</p><h3 id="\u957F\u8FDE\u63A5\u7684\u7F3A\u70B9" tabindex="-1"><a class="header-anchor" href="#\u957F\u8FDE\u63A5\u7684\u7F3A\u70B9" aria-hidden="true">#</a> \u957F\u8FDE\u63A5\u7684\u7F3A\u70B9</h3><p>\u867D\u7136\u5141\u8BB8\u590D\u7528tcp\u8FDE\u63A5\uFF0C\u4F46\u662F\u5728\u540C\u4E00\u4E2Atcp\u8FDE\u63A5\u91CC\u9762\uFF0C\u6240\u6709\u6570\u636E\u901A\u4FE1\u662F\u6309\u6B21\u5E8F\u8FDB\u884C\u7684\u3002\u670D\u52A1\u5668\u53EA\u6709\u5904\u7406\u5B8C\u4E00\u4E2A\u56DE\u5E94\u624D\u4F1A\u8FDB\u884C\u4E0B\u4E00\u4E2A\u56DE\u5E94\uFF0C\u8FD9\u5C31\u4F1A\u5BFC\u81F4\u6392\u961F\u7B49\u5019\u3002\u8FD9\u79F0\u4E4B\u4E3A\u201C\u961F\u5934\u5835\u585E\u201D</p><h2 id="http-2" tabindex="-1"><a class="header-anchor" href="#http-2" aria-hidden="true">#</a> http/2</h2><h3 id="\u4E8C\u8FDB\u5236\u534F\u8BAE" tabindex="-1"><a class="header-anchor" href="#\u4E8C\u8FDB\u5236\u534F\u8BAE" aria-hidden="true">#</a> \u4E8C\u8FDB\u5236\u534F\u8BAE</h3><p>\u5728 1.1\u4E2D\u5934\u4FE1\u606F\u662F\u6587\u672C\uFF0C\u800C2\u5219\u662F\u4E00\u4E2A\u5F7B\u5E95\u7684\u4E8C\u8FDB\u5236\u534F\u8BAE\u3002\u4E8C\u8FDB\u5236\u7684\u597D\u5904\u662F\uFF0C\u53EF\u4EE5\u5B9A\u4E49\u989D\u5916\u7684\u5E27\uFF0C\u5E76\u4E14\u89E3\u6790\u65B9\u4FBF</p><h3 id="\u591A\u5DE5" tabindex="-1"><a class="header-anchor" href="#\u591A\u5DE5" aria-hidden="true">#</a> \u591A\u5DE5</h3><p>2\u91CC\u7684\u590D\u7528tcp\u8FDE\u63A5\uFF0C\u5BA2\u6237\u7AEF\u548C\u670D\u52A1\u7AEF\u90FD\u53EF\u4EE5\u540C\u65F6\u53D1\u9001\u591A\u4E2A\u8BF7\u6C42\u548C\u56DE\u5E94\uFF0C\u800C\u4E14\u4E0D\u7528\u6309\u7167\u987A\u5E8F\u4E00\u4E00\u5BF9\u5E94\uFF0C\u8FD9\u6837\u5C31\u907F\u514D\u7684\u961F\u5934\u5835\u585E</p><p>\u8FD9\u6837\u53CC\u5411\u7684\u3001\u5B9E\u65F6\u7684\u901A\u4FE1\u5C31\u53EB\u591A\u5DE5</p><h3 id="\u6570\u636E\u6D41" tabindex="-1"><a class="header-anchor" href="#\u6570\u636E\u6D41" aria-hidden="true">#</a> \u6570\u636E\u6D41</h3><p>2\u4E2D\u7684\u6570\u636E\u5305\u4E0D\u662F\u6309\u987A\u5E8F\u53D1\u9001\u7684\uFF0C\u6240\u4EE52\u7ED9\u6BCF\u4E00\u4E2A\u6570\u636E\u5305\uFF08\u6570\u636E\u6D41\uFF09\u505A\u4E86\u4E00\u4E2A\u72EC\u4E00\u65E0\u4E8C\u7684\u7F16\u53F7\uFF0C\u5BA2\u6237\u7AEF\u8FD8\u80FD\u6307\u5B9A\u6570\u636E\u6D41\u7684\u4F18\u5148\u7EA7\uFF0C\u4F18\u5148\u7EA7\u8D8A\u9AD8\uFF0C\u8D8A\u65E9\u54CD\u5E94</p><h3 id="\u5934\u4FE1\u606F\u538B\u7F29" tabindex="-1"><a class="header-anchor" href="#\u5934\u4FE1\u606F\u538B\u7F29" aria-hidden="true">#</a> \u5934\u4FE1\u606F\u538B\u7F29</h3><p>http\u4E2D\u5F88\u591A\u5B57\u6BB5\u662F\u91CD\u590D\u7684\uFF0C\u4E14\u9700\u8981\u6BCF\u6B21\u53D1\u9001\u3002\u6240\u4EE52\u5C31\u505A\u4E86\u4E00\u70B9\u4F18\u5316\uFF0C\u5F15\u5165\u4E86\u5934\u4FE1\u606F\u538B\u7F29\u673A\u5236\u3002\u4E00\u65B9\u9762\u53EF\u4EE5\u901A\u8FC7gzip\u538B\u7F29\u540E\u53D1\u9001\uFF1B\u53E6\u4E00\u65B9\u9762\u524D\u540E\u7AEF\u8FD8\u540C\u65F6\u7EF4\u62A4\u4E00\u5F20\u5934\u4FE1\u606F\u8868\uFF0C\u901A\u8FC7\u7D22\u5F15\u6765\u83B7\u53D6\u5185\u5BB9\u52A0\u5FEB\u83B7\u53D6\u901F\u5EA6</p><h3 id="\u670D\u52A1\u5668\u63A8\u9001" tabindex="-1"><a class="header-anchor" href="#\u670D\u52A1\u5668\u63A8\u9001" aria-hidden="true">#</a> \u670D\u52A1\u5668\u63A8\u9001</h3><p>2\u5141\u8BB8\u670D\u52A1\u5668\u672A\u7ECF\u8BF7\u6C42\uFF0C\u4E3B\u52A8\u5411\u5BA2\u6237\u7AEF\u53D1\u9001\u8D44\u6E90\uFF0C\u8FD9\u53EB\u670D\u52A1\u5668\u63A8\u9001\u3002</p><h2 id="\u907F\u514D\u91CD\u5B9A\u5411" tabindex="-1"><a class="header-anchor" href="#\u907F\u514D\u91CD\u5B9A\u5411" aria-hidden="true">#</a> \u907F\u514D\u91CD\u5B9A\u5411</h2><p>\u91CD\u5B9A\u5411\u662F\u7531\u670D\u52A1\u5668\u53D1\u9001\u7279\u6B8A\u7684\u54CD\u5E94\u800C\u89E6\u53D1\u7684\uFF0C\u5728http\u4E2D\u5B9A\u4E49\u7684\u54CD\u5E94\u7801\u4F4D3xx\uFF0C\u5728\u4E00\u822C\u4F7F\u7528\u4E2D\u5927\u591A\u6570\u91CD\u5B9A\u5411\u4E3A\u767B\u5F55\u3002\u6211\u4EEC\u4E0D\u770B\u5F71\u54CD\uFF0C\u6765\u770B\u770B\u4E09\u79CD\u91CD\u5B9A\u5411</p><ul><li>\u6C38\u4E45\u91CD\u5B9A\u5411 301 308</li><li>\u4E34\u65F6\u91CD\u5B9A\u5411 302 303 307</li><li>\u7279\u6B8A\u91CD\u5B9A\u5411 300 304\uFF08\u5E38\u7528\uFF0C\u8D44\u6E90\u672A\u88AB\u4FEE\u6539\uFF0C\u4F7F\u7528\u4E86\u7F13\u5B58\uFF09</li></ul><h2 id="\u538B\u7F29\u4F20\u8F93\u7684\u6570\u636E\u8D44\u6E90" tabindex="-1"><a class="header-anchor" href="#\u538B\u7F29\u4F20\u8F93\u7684\u6570\u636E\u8D44\u6E90" aria-hidden="true">#</a> \u538B\u7F29\u4F20\u8F93\u7684\u6570\u636E\u8D44\u6E90</h2><ul><li>\u54CD\u5E94\u6570\u636E\u538B\u7F29 \uFF1Agzip</li></ul><h2 id="http-\u7F13\u5B58" tabindex="-1"><a class="header-anchor" href="#http-\u7F13\u5B58" aria-hidden="true">#</a> HTTP \u7F13\u5B58</h2><p><img src="`+i+'" alt="\u7F13\u5B58\u4F7F\u7528\u6D41\u7A0B\u56FE"></p><p>http\u7F13\u5B58\u662F\u6700\u5E38\u7ED3\u675F\u7684\u7F13\u5B58\u4E4B\u4E00\uFF0C\u5B83\u53EF\u7EC6\u5206\u4E3Am<strong>\u5F3A\u5236\u7F13\u5B58</strong>\u548C<strong>\u534F\u5546\u7F13\u5B58</strong>\uFF0C\u4E8C\u8005\u6700\u5927\u7684\u533A\u522B\u5728\u4E8E\u5224\u65AD\u7F13\u5B58\u547D\u4E2D\u65F6\uFF0C\u6D4F\u89C8\u5668\u662F\u5426\u9700\u8981\u5411\u670D\u52A1\u5668\u7AEF\u8FDB\u884C\u8BE2\u95EE\u6765\u5224\u65AD\u662F\u5426\u9700\u8981\u91CD\u65B0\u8BF7\u6C42</p><h3 id="\u5F3A\u5236\u7F13\u5B58" tabindex="-1"><a class="header-anchor" href="#\u5F3A\u5236\u7F13\u5B58" aria-hidden="true">#</a> \u5F3A\u5236\u7F13\u5B58</h3><p>\u548C\u5F3A\u5236\u7F13\u5B58\u6709\u5173\u7684\u4E24\u4E2A\u5B57\u6BB5\u662F<code>expires</code>he<code>cache-control</code>\uFF0C\u57281.0\u65F6\u671F\u4F1A\u901A\u8FC7\u6BD4\u8F83\u672C\u5730\u65F6\u95F4\u548C<code>expires</code>\u6765\u786E\u5B9A\u662F\u5426\u9700\u8981\u91CD\u65B0\u8BF7\u6C42\uFF0C\u4F46\u662F\u8FD9\u79CD\u65B9\u5F0F\u5B58\u5728\u4E00\u4E2A\u5F88\u5927\u7684\u6F0F\u6D1E\uFF0C\u5982\u679C\u7528\u6237\u5BF9\u672C\u5730\u65F6\u95F4\u8FDB\u884C\u4FEE\u6539\uFF0C\u90A3\u4E48\u5BF9\u4E8E\u7F13\u5B58\u7684\u5224\u65AD\u5C31\u662F\u4F1A\u5931\u8BEF</p><p>\u6240\u4EE5\u57281.1\u65F6\u671F\u65B0\u589E\u4E86<code>cache-control</code>\u5B57\u6BB5\uFF0C\u53EA\u8981\u8BBE\u7F6E<code>maxage=1000</code>\u6765\u8FDB\u884C\u65F6\u95F4\u957F\u5EA6\u7684\u63A7\u5236\uFF0C\u5C31\u80FD\u907F\u514D\u65F6\u95F4\u4E0D\u540C\u9020\u6210\u7684\u95EE\u9898</p><p><strong>no-cache\u3001no-store</strong></p><p>no-store \u8868\u793A\u5B8C\u5168\u4F7F\u7528\u6700\u65B0\u6570\u636E\uFF0C\u4E0D\u4F7F\u7528\u7F13\u5B58 no-cache \u8868\u793A\u901A\u8FC7\u4E0E\u670D\u52A1\u5668\u534F\u5546\u9A8C\u8BC1\u7F13\u5B58\u6709\u6548\u6027\uFF0C\u82E5\u672A\u8FC7\u671F\uFF0C\u5219\u4F7F\u7528\u672C\u5730\u7F13\u5B58</p><p><strong>private\u3001public</strong></p><p>public \u8868\u793A\u54CD\u5E94\u8D44\u6E90\u5373\u53EF\u4EE5\u88AB\u6D4F\u89C8\u5668\u7F13\u5B58\uFF0C\u4E5F\u53EF\u4EE5\u88AB\u4EE3\u7406\u671F\u7F13\u5B58 private \u54CD\u5E94\u8D44\u6E90\u53EA\u80FD\u88AB\u6D4F\u89C8\u5668\u7F13\u5B58\uFF0C\u82E5\u672A\u663E\u793A\u6307\u5B9A\u5567\u9ED8\u8BA4\u4E3Aprite</p><p><strong>max-age\u3001s-maxage</strong></p><p>s-maxage \u8868\u793A\u7F13\u5B58\u5728\u4EE3\u7406\u670D\u670D\u52A1\u5668\u4E0A\u7684\u6709\u6548\u6027\uFF0C\u5F53\u8BBE\u7F6E\u4E86public\u540E\uFF0C\u5C31\u53EF\u4EE5\u8BBE\u7F6E\u5B83 \u4E14\u4E00\u822C\u4ED6\u4F1A\u548Cmax-age\u4E00\u8D77\u4F7F\u7528\uFF0C\u8FD9\u6837\u6765\u4FDD\u8BC1\u8D44\u6E90\u7684\u6709\u6548\u6027</p><h3 id="\u534F\u5546\u7F13\u5B58" tabindex="-1"><a class="header-anchor" href="#\u534F\u5546\u7F13\u5B58" aria-hidden="true">#</a> \u534F\u5546\u7F13\u5B58</h3><p><strong>last-modifed</strong></p><p>\u987E\u540D\u601D\u4E49\uFF0C\u534F\u5546\u7F13\u5B58\u5C31\u662F\u5728\u4F7F\u7528\u672C\u5730\u7F13\u5B58\u4E4B\u524D\uFF0C\u9700\u8981\u5411\u670D\u52A1\u5668\u53D1\u8D77\u4E00\u6B21GET\u8BF7\u6C42\uFF0C\u4E0E\u4E4B\u534F\u5546\u5F53\u524D\u6D4F\u89C8\u5668\u4FDD\u5B58\u7684\u672C\u5730\u7F13\u5B58\u662F\u5426\u5DF2\u7ECF\u8FC7\u671F</p><p>\u9996\u5148\u518D\u4F7F\u7528\u5199\u4E0A\u7F13\u5B58\u4E4B\u524D\uFF0C\u670D\u52A1\u7AEF\u4F1A\u5C06<code>cache-control</code>\u8BBE\u7F6E\u4E3A<code>no-cache</code>\uFF0C\u7136\u540E\u83B7\u53D6\u6587\u4EF6\u7684\u6700\u540E\u4FEE\u6539\u65F6\u95F4\uFF0C\u653E\u5230\u54CD\u5E94\u5934\u7684<code>last-modified</code>\u4E2D\uFF0C\u5BA2\u6237\u7AEF\u62FF\u5230\u540E\uFF0C\u5165\u4F19\u5237\u65B0\u9875\u9762\uFF0C\u5C31\u4F1A\u5728\u8BF7\u6C42\u5934\u91CD\u5E26\u4E0A\u4E00\u4E2A<code>if-modified-since</code>\u5B57\u6BB5\uFF0C\u503C\u548C<code>last-modified</code>\u4E00\u6837\uFF0C\u8FD9\u65F6\u5019\u670D\u52A1\u7AEF\u6BD4\u8F83\u4E24\u4E2A\u503C\uFF0C\u540E\u8FD4\u56DE\u65B0\u8D44\u6E90\uFF0C\u8FD8\u662F\u8FD4\u56DE304\u4E0D\u4FEE\u6539\uFF0C\u5C06\u54CD\u5E94\u4F53\u91CD\u5B9A\u5411\u5230\u672C\u5730\u7F13\u5B58\u4E0A</p><p>last-modifed\u7684\u4E0D\u8DB3\uFF1A</p><ol><li>\u83B7\u53D6\u65F6\u95F4\u6233\u5176\u6587\u4EF6\u7684\u4FEE\u6539\u5355\u4F4D\u662F\u79D2\uFF0C\u5982\u679C\u6587\u4EF6\u4FEE\u6539\u975E\u5E38\u5FEB\uFF0C\u8FD9\u4E2A\u7F13\u5B58\u5C31\u5B58\u5728\u6709\u6548\u6027\u95EE\u9898</li><li>\u53EA\u6539\u6587\u4EF6\u540D\uFF0C\u6CA1\u52A8\u5185\u5BB9\u4E5F\u4F1A\u66F4\u65B0\u65F6\u95F4</li></ol><p><strong>Etag</strong></p><p>\u4E3A\u4E86\u5F25\u8865\u4E0D\u8DB3\uFF0C1.1\u65B0\u589E\u4E86<code>Etag</code>\uFF0C<code>Etag</code>\u4F1A\u6839\u636E\u6587\u4EF6\u5185\u5BB9\u7684\u4E0D\u540C\u751F\u6210\u4E00\u4E2Ahash\u5B57\u7B26\u4E32\u3002<code>Etag</code>\u6BD4<code>last-modified</code>\u7684\u4F18\u5148\u7EA7\u66F4\u9AD8\uFF0C\u505A\u6CD5\u548C\u4E4B\u524D\u7C7B\u4F3C\uFF0C\u5BA2\u6237\u7AEF\u4E5F\u4F1A\u8FD4\u56DE\u4E00\u4E2A\u540C\u503C\u7684<code>if-none-match</code>\u6765\u7ED9\u670D\u52A1\u7AEF\u8FDB\u884C\u5224\u65AD</p><p>Etag\u7684\u4E0D\u8DB3</p><ol><li>\u9700\u8981\u670D\u52A1\u5668\u6D88\u8017\u8D44\u6E90\u8FDB\u884Chash\u8BA1\u7B97</li></ol><h2 id="cdn-\u7F13\u5B58" tabindex="-1"><a class="header-anchor" href="#cdn-\u7F13\u5B58" aria-hidden="true">#</a> cdn \u7F13\u5B58</h2><p>cdn\u4E3A\u4EC0\u4E48\u8BBE\u8BA1\u6210\u548C\u4E3B\u7AD9\u57DF\u540D\u4E0D\u540C\uFF1F</p><ol><li>\u907F\u514D\u5BF9\u9759\u6001\u8D44\u6E90\u7684\u8BF7\u6C42\u643A\u5E26\u4E0D\u5FC5\u8981\u7684Cookie\u4FE1\u606F</li><li>\u8003\u8651\u6D4F\u89C8\u5668\u5BF9\u540C\u4E00\u57DF\u540D\u4E0B\u5E76\u53D1\u8BF7\u6C42\u7684\u9650\u5236</li></ol>',59);function t(h,c){return r}var p=a(d,[["render",t]]);export{p as default};
