# 模板编译

1. 如果是在html中引入的vue，他会将`template`编译成`render`渲染，所以直接引入vue，体积是比较大的，
除非自己手写render。
2. 在使用`cli`的时候，会在打包的时候将`template`编译成`render`函数，这样在打包完成后vue是无编译器的版本

[模板编译入口](https://e0v6qvjc33.feishu.cn/mindnotes/bmncnl9su1yZ25XNDh6141rFNhf)

将下面代码的编译生成后的代码输出查看

```js
<div id="app">
 <h1>Vue<span>模板编译过程</span></h1>
 <p>{{ msg }}</p>
 <comp @myclick="handler"></comp>
</div>
<script src="../../dist/vue.js"></script>
<script>
 Vue.component('comp', {
   template: '<div>I am a comp</div>'
 })
 const vm = new Vue({
   el: '#app',
   data: {
     msg: 'Hello compiler'
   },
   methods: {
     handler () {
       console.log('test')
     }
   }
 })
 console.log(vm.$options.render)
</script>
```
得到如下编译后的代码

```js
(function anonymous() {
  with (this) {
    return _c(
      "div",
      { attrs: { id: "app" } },
      [
        _m(0),
        // 换行空白节点
        _v(" "),
        _c("p", [_v(_s(msg))]),
        _v(" "),
        _c("comp", { on: { myclick: handler } }),
      ],
      1
    );
  }
});
```
这些调用的函数，`core/instance/render.js`中有`_c`，前面我们已经知道`_c`其实就是`_h`。
在`core/instance/render-helpers/index.js`中，声明了其他方法

## 入口

`template`生成`render`函数的入口在，`platform/web/entry-runtime-with-compiler`中的`$mount`方法。
在`compileToFunctions`方法中生成了`render`

```js
const { render, staticRenderFns } = compileToFunctions(template, {
  outputSourceRange: process.env.NODE_ENV !== 'production',
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref,
  delimiters: options.delimiters,
  comments: options.comments
}, this)
options.render = render
options.staticRenderFns = staticRenderFns
```
往上找，能看到`createCompiler`返回了`compileToFunctions`
```js
const { compile, compileToFunctions } = createCompiler(baseOptions)
```
在`compiler/index.js`中`createCompilerCreator`的传入函数`baseCompile`返回了`ast`、`render`、`staticRenderFns`

```js
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 把模板转换成 ast 抽象语法书
  // 抽象语法树，用来以树的方式描述代码结构
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 优化抽象语法树
    optimize(ast, options)
  }
  // 把抽象语法树生成字符串形式的 js 代码
  const code = generate(ast, options)
  return {
    ast,
    // 渲染函数 字符串形式
    render: code.render,
    // 静态渲染函数，生成静态 VNode 树
    staticRenderFns: code.staticRenderFns
  }
})
```
在`generate`函数中生成`render`和`staticRenderFns`

```js
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  // fix #11483, Root level <script> tags should not be rendered.
  const code = ast ? (ast.tag === 'script' ? 'null' : genElement(ast, state)) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}
```

在`createCompilerCreator`中我们可以看到，它是把用户的options和`baseOptions`合并后
通过`baseCompile`生成了`compiled`，返回的`compiled`其实就是`compile`

```js {13}
export function createCompilerCreator (baseCompile: Function): Function {
  return function createCompiler (baseOptions: CompilerOptions) {
    function compile (
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      // h合并options
      const finalOptions = Object.create(baseOptions)
   
      finalOptions.warn = warn

      // 返回了compiled， 其中包含render，和staticRenderFns
      const compiled = baseCompile(template.trim(), finalOptions)

      if (process.env.NODE_ENV !== 'production') {
        detectErrors(compiled.ast, warn)
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
```

# 编译的过程


[编译过程](https://e0v6qvjc33.feishu.cn/mindnotes/bmncnAjzH9yV41VtMcwuEwOVb6b)

接上面，我们来看`createCompileToFunctionFn`方法，这个方法其实就是运行的核心，整个流程分为了4步，源码中用了很多高阶
函数非常绕，但是只要`debugger`放到`runtime-with-compiler`中的`$mount`下的`compileToFunctions`方法，
就很清晰，运行到下面的函数的时候，跟着注释的1234步骤打上断点，就能看的明白


::: tip
看的时候可以略去 AST相关生成和优化
:::

```js
export function createCompileToFunctionFn (compile: Function): Function {
  // 创建了一个空的缓存，不带的原型
  const cache = Object.create(null)

  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    // 克隆了一个options，
    options = extend({}, options)
    // 开发环境使用
    const warn = options.warn || baseWarn
    delete options.warn

    // check cache
    // 1. 读取缓存中的CompiledFunctionResult 对象，如果有直接返回
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    if (cache[key]) {
      return cache[key]
    }

    // compile
    // 2. 把模板编译为编译对象(render, staticReenderFns)，字符串形式的js代码
    const compiled = compile(template, options)


    // turn code into functions
    const res = {}
    const fnGenErrors = []
    // 3. 把字符串代码 转为函数 new Function(code)
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })
    // 4. 缓存并返回res对象(render, staticRenderFns方法)
    return (cache[key] = res)
  }
}
```