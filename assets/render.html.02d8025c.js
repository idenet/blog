import{c as e}from"./app.6a7f8286.js";import{_ as i}from"./plugin-vue_export-helper.21dcd24c.js";const a={},l=e(`<h1 id="\u6E32\u67D3\u4F18\u5316" tabindex="-1"><a class="header-anchor" href="#\u6E32\u67D3\u4F18\u5316" aria-hidden="true">#</a> \u6E32\u67D3\u4F18\u5316</h1><p>\u6574\u4E2Aurl\u8FC7\u7A0B\u7684\u4E0A\u534A\u6BB5\u662F\u8BB2\u5B8C\u4E86\uFF0C\u4E0B\u534A\u6BB5\u662F\u6D4F\u89C8\u5668\u83B7\u53D6\u8D44\u6E90\u6E32\u67D3\u7684\u8FC7\u7A0B\uFF0C\u8FD9\u4E2A\u8FC7\u7A0B\u4E3B\u8981\u5206\u4E3A\u4EE5\u4E0B\u6B65\u9AA4</p><ol><li>\u5904\u7406<code>html</code>\u6807\u8BB0\u5E76\u6784\u5EFA<code>DOM</code>\u6811</li><li>\u5904\u7406<code>CSS</code>\u5E76\u6784\u5EFA<code>CSSOM</code>\u6811</li><li>\u5C06<code>DOM</code>\u548C<code>CSSOM</code>\u5408\u5E76\u6210\u4E00\u4E2Arender tree</li><li>\u6839\u636E\u6E32\u67D3\u6811\u6765\u5E03\u5C40\uFF0C\u4EE5\u8BA1\u7B97\u6BCF\u4E2A\u8282\u70B9\u7684\u51E0\u4F55\u4FE1\u606F</li><li>\u5C06\u5404\u4E2A\u8282\u70B9\u4F1A\u77E5\u9053\u5C4F\u5E55\u4E0A</li></ol><p>\u4F18\u5316\u5173\u952E\u6E32\u67D3\u8DEF\u5F84\u5C31\u5C31\u662F\u6307\u6700\u5927\u9650\u5EA6\u7F29\u77ED\u6267\u884C\u4E0A\u8FF0\u7B2C\u4E00\u6B65\u81F3\u7B2C\u4E94\u6B65\u8017\u8D39\u7684\u603B\u65F6\u95F4</p><h2 id="\u5173\u952E\u6E32\u67D3\u8DEF\u5F84\u4F18\u5316" tabindex="-1"><a class="header-anchor" href="#\u5173\u952E\u6E32\u67D3\u8DEF\u5F84\u4F18\u5316" aria-hidden="true">#</a> \u5173\u952E\u6E32\u67D3\u8DEF\u5F84\u4F18\u5316</h2><h3 id="\u4F18\u5316-dom" tabindex="-1"><a class="header-anchor" href="#\u4F18\u5316-dom" aria-hidden="true">#</a> \u4F18\u5316 DOM</h3><p>\u8BA9HTML\u6587\u4EF6\u7684\u5C3A\u5BF8\u5C3D\u53EF\u80FD\u7684\u5C0F\u3002\u8FD9\u4E2A\u4F18\u5316\u5176\u5B9E\u5728webpack\u7684\u63D2\u4EF6\u4E2D\u90FD\u6709\u505A\uFF0C\u6BD4\u5982</p><ul><li>\u7F29\u5C0F\u6587\u4EF6\u5C3A\u5BF8 (minify)</li><li>\u4F7F\u7528gzip\u538B\u7F29 (compress)</li><li>\u4F7F\u7528\u7F13\u5B58 (http cache)</li></ul><h3 id="\u4F18\u5316-css" tabindex="-1"><a class="header-anchor" href="#\u4F18\u5316-css" aria-hidden="true">#</a> \u4F18\u5316 CSS</h3><p><strong>\u963B\u585E\u6E32\u67D3\u7684 CSS</strong></p><p>css\u662F\u5173\u952E\u8D44\u6E90\uFF0C\u6240\u4EE5\u963B\u585E\u6E32\u67D3\u4E5F\u4E0D\u5947\u602A\uFF0C\u6240\u4EE5\u5BF9\u4E8Ecss\uFF0C\u53EF\u4EE5\u5C06css\u653E\u5230html\u4E2D\uFF0C\u6216\u8005\u4F7F\u7528media\u5904\u7406\u4E0D\u9700\u8981\u5728\u5F53\u524D\u5C4F\u5E55\u52A0\u8F7D\u7684\u8D44\u6E90</p><p><strong>\u907F\u514D\u5728css\u4E2D\u4F7F\u7528@import</strong></p><p>\u4F7F\u7528import\u4F1A\u52A0\u957F\u989D\u5916\u7684\u5173\u952E\u8DEF\u5F84\u957F\u5EA6</p><h3 id="\u4F18\u5316-js\u7684\u4F7F\u7528" tabindex="-1"><a class="header-anchor" href="#\u4F18\u5316-js\u7684\u4F7F\u7528" aria-hidden="true">#</a> \u4F18\u5316 js\u7684\u4F7F\u7528</h3><p>\u901A\u5E38\u8FD9\u4E9B\u6587\u4EF6\u90FD\u8981\u5C3D\u53EF\u80FD\u7684\u5C0F\uFF0C\u5728\u6B64\u4E4B\u5916\uFF0C\u8FD8\u53EF\u4EE5\u4F7F\u7528</p><ol><li>defer\u5EF6\u8FDF\u52A0\u8F7D\uFF0C\u544A\u8BC9\u6D4F\u89C8\u5668\u4E0D\u8981\u7B49\u5F85\u811A\u672C\uFF0C\u811A\u672C\u4F1A\u5728\u540E\u53F0\u4E0B\u8F7D\uFF0C\u7B49DOM\u6811\u6784\u5EFA\u5B8C\u6210\u4E4B\u540E\uFF0C\u624D\u80FD\u6267\u884C\uFF0C\u4F46\u662F\u8FD8\u662F\u6309\u7167\u52A0\u8F7D\u987A\u5E8F\u6267\u884C</li><li>async \u5EF6\u8FDF\u52A0\u8F7D\uFF0C \u4F46\u662F\u4E0D\u80FD\u4FDD\u8BC1\u6267\u884C\u987A\u5E8F\u3002</li><li>preload \u5229\u7528\u7A7A\u95F2\u65F6\u95F4\u9884\u52A0\u8F7D\u6307\u5B9A\u7684\u8D44\u6E90</li><li>prefetch \u9884\u52A0\u8F7D\u5C06\u6765\u53EF\u80FD\u8981\u7528\u5230\u7684\u8D44\u6E90\uFF08\u975E\u5F53\u524D\u9875\u9762\u8D44\u6E90\uFF09</li><li>\u5C06 js\u653E\u5230dom\u8282\u70B9\u7684\u6700\u540E</li></ol><h2 id="js-\u6267\u884C\u4F18\u5316" tabindex="-1"><a class="header-anchor" href="#js-\u6267\u884C\u4F18\u5316" aria-hidden="true">#</a> js \u6267\u884C\u4F18\u5316</h2><ol><li>\u5982\u679C\u9700\u8981\u52A8\u753B\uFF0C\u4F7F\u7528<code>requestAnimationFrame</code>\u6765\u6267\u884C\u52A8\u753B</li><li>\u5982\u679C\u9700\u8981\u4E00\u4E9B\u957F\u65F6\u95F4\u7EAF\u8BA1\u7B97\u7684\u5DE5\u4F5C\uFF0C\u8FC1\u79FB\u5230<code>web worker</code>\u4E0A\u5904\u7406</li><li>js \u9632\u6296\u548C\u8282\u6D41</li></ol><h2 id="\u8BA1\u7B97\u6837\u5F0F\u4F18\u5316" tabindex="-1"><a class="header-anchor" href="#\u8BA1\u7B97\u6837\u5F0F\u4F18\u5316" aria-hidden="true">#</a> \u8BA1\u7B97\u6837\u5F0F\u4F18\u5316</h2><h3 id="\u51CF\u5C11\u8981\u8BA1\u7B97\u6837\u5F0F\u7684\u5143\u7D20\u6570\u91CF" tabindex="-1"><a class="header-anchor" href="#\u51CF\u5C11\u8981\u8BA1\u7B97\u6837\u5F0F\u7684\u5143\u7D20\u6570\u91CF" aria-hidden="true">#</a> \u51CF\u5C11\u8981\u8BA1\u7B97\u6837\u5F0F\u7684\u5143\u7D20\u6570\u91CF</h3><p>\u9996\u5148\u6211\u4EEC\u8981\u77E5\u9053\u4E0E\u8BA1\u7B97\u6837\u5F0F\u7684\u4E00\u6761\u91CD\u8981\u673A\u5236\uFF1A<strong>css\u5F15\u64CE\u5728\u67E5\u627E\u6837\u5F0F\u8868\u65F6\uFF0C\u5BF9\u6BCF\u6761\u89C4\u5219\u7684\u5339\u914D\u987A\u5E8F\u662F\u4ECE\u53F3\u5411\u5DE6\u7684</strong>\uFF0C\u800C\u4E14\u5982\u679C\u662Fli\u6807\u7B7E\u4F1A\u4E00\u4E2A\u4E2A\u904D\u5386\u67E5\u627E\uFF0C\u4F1A\u975E\u5E38\u6162</p><p>\u56E0\u6B64\u5728\u6837\u5F0F\u8BA1\u7B97\u4E0A\u603B\u7ED3\u4EE5\u4E0B\u51E0\u70B9\u5B9E\u6218</p><ol><li>\u4F7F\u7528\u7C7B\u9009\u62E9\u5668\u66FF\u4EE3\u6807\u7B7E\u9009\u62E9\u5668</li><li>\u907F\u514D\u4F7F\u7528\u901A\u914D\u7B26\u505A\u9009\u62E9\u5668</li><li>\u964D\u4F4E\u9009\u62E9\u5668\u7684\u590D\u6742\u6027</li></ol><p>\u56E0\u6B64 \u603B\u7ED3\u4EE5\u4E0A\uFF0C\u793E\u533A\u5254\u9664\u4E86\u4E00\u79CDcss\u4E66\u5199\u89C4\u8303\u6765\u907F\u514D\u8FD9\u4E9B\u95EE\u9898\uFF0C\u5373 BEM</p><ul><li>\u4E2D\u5212\u7EBF(-) \u4F5C\u4E3A\u8FDE\u5B57\u7B26\u4F7F\u7528\uFF0C\u8868\u793A\u5143\u7D20\u591A\u4E2A\u5355\u8BCD\u4E4B\u95F4\u7684\u8FDE\u5B57\u7B26</li><li>\u53CC\u4E0B\u5212\u7EBF(__) \u4F5C\u4E3A\u8FDE\u63A5\u5757\u4E0E\u5757\u7684\u5B50\u5143\u7D20</li><li>\u5355\u4E0B\u5212\u7EBF(_) \u4F5C\u4E3A\u63CF\u8FF0\u4E00\u4E2A\u5757\u6216\u8005\u5176\u5B83\u5B50\u5143\u7D20\u7684\u72B6\u6001</li></ul><p>\u5982</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>type-block__element_modifier
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="\u9875\u9762\u5E03\u5C40\u7684\u91CD\u7ED8\u4F18\u5316" tabindex="-1"><a class="header-anchor" href="#\u9875\u9762\u5E03\u5C40\u7684\u91CD\u7ED8\u4F18\u5316" aria-hidden="true">#</a> \u9875\u9762\u5E03\u5C40\u7684\u91CD\u7ED8\u4F18\u5316</h2><p>\u9664\u53BB\u9875\u9762\u5E03\u5C40\uFF0C\u89E6\u53D1\u9875\u9762\u7684\u91CD\u7ED8\u53EF\u5206\u4E3A\u4E09\u7C7B</p><ul><li>dom\u5143\u7D20\u51E0\u4F55\u5C5E\u6027\u7684\u4FEE\u6539</li><li>\u66F4\u6539dom\u6811\u7684\u7ED3\u6784</li><li>\u83B7\u53D6\u67D0\u4E9B\u7279\u6027\u7684\u5C5E\u6027\u503C\u64CD\u4F5C</li></ul>`,30);function r(d,s){return l}var h=i(a,[["render",r]]);export{h as default};
