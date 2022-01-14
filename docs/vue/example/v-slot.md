# 插槽

`slots`是`vue`的一个核心功能，它和`keep-alive、transition`组件都有关系，所以我们有必要对它做一个全面的了解。

```html
<div id="app">
  <app-layout>
    <template v-slot:header>头部内容</template>
    <template v-slot>默认内容</template>
    <template v-slot:footer>底部内容</template>
  </app-layout>
  <button @click="change">change title</button>
</div>
<script>
  const AppLayout = {
    template:
      '<div class="container">' +
      '<header><slot name="header"></slot></header>' +
      '<main><slot></slot></main>' +
      '<footer><slot name="footer"></slot></footer>' +
      '</div>'
  }

  const vm = new Vue({
    el: '#app',
    components: {
      AppLayout
    }
  })
</script>
```

因为`vue-next`已经全面改成使用`v-slot`了，所以我们分析插槽只分析`v-slot API`。

**注意**
当我们开始分析`vue`的指令的时候，我们需要分两步走：

1. 编译阶段做了哪些工作，`AST`和`render`方法是什么样子的？
2. 初始化做了什么工作，执行的时候又做了什么？

## 插槽的编译


`vue`的编译分为三步

1. `parse`：将`html`转换成`AST`树
2. `opitimize`: 将`AST`中不变的数据标识成`static`，优化的作用
3. `codegen`: 将`AST`代码转成字符串，并通过`new Function`实例化为函数

### parse

那么我们先看第一步，在`parse`方法里面`vue`调用了`parseHTML`方法。`parseHTML`方法传入两个参数，一个是`html`字符串，
在第二个参数里面传入了四个钩子函数`start、end、chars、comment`，这里要讲清楚的话比较麻烦，而我们通过查看执行栈的方式来看`parse`的执行过程。

首先我们知道我们现在的例子和`slot`有关，那么很显然`vue`在定义方法的时候肯定和`slot`有关系，我们查找到两个方法`processSlotContent`和`processSlotOutlet`两个方法。
在第一个方法打上断点，查看执行栈

![执行栈](../images/../../images/vue/slot-1.png)

这样就能清晰的看到代码的执行过程了。这里我们进入`processSlotContent`方法，开始分析

```js
function processSlotContent (el) {
  // 2.6 v-slot syntax
  if (process.env.NEW_SLOT_SYNTAX) {
    if (el.tag === 'template') {
      // v-slot on <template>
      const slotBinding = getAndRemoveAttrByRegex(el, slotRE)
      if (slotBinding) {
        const { name, dynamic } = getSlotName(slotBinding)
        el.slotTarget = name
        el.slotTargetDynamic = dynamic
        el.slotScope = slotBinding.value || emptySlotScopeToken 
      }
    }
  }
}
```
这里我们先记录一下，`el`当前的对象中`attrsList`的值

```js
el: {
  attrsList: [{
    end: 68,
    name: "v-slot:header",
    start: 52,
    value: ""
  }]
}
```
然后直接跳过`getAndRemoveAttrByRegex`方法查看新值和返回值，`attrsList`被清空了，并且我们拿到了里面的值
```js
{
 end: 68,
 name: "v-slot:header",
 start: 52,
 value: ""
}
```
`getSlotName`方法拿到`name`值，这个值是`header`。并且这里也会判断是不是动态`slot`和新增特性相关。
最后`vue`赋值了三个属性

```js
slotScope: "_empty_"
slotTarget: "\"header\""
slotTargetDynamic: false
```
这里我们还要去`closeElement`方法看一下

```js
function closeElement (element) {

 if (!inVPre && !element.processed) {
   element = processElement(element, options)
 }
 if (currentParent && !element.forbidden) {
   if (element.elseif || element.else) {
     ...
   } else {
     if (element.slotScope) {
       const name = element.slotTarget || '"default"'
       ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
     }
     currentParent.children.push(element)
     element.parent = currentParent
   }
 }

 element.children = element.children.filter(c => !(c: any).slotScope)
}
```
在执行完`processElement`之后，我们看上面的代码，`currentParent`在`start`钩子函数中赋值，拿到是当前的`element`的父级。

这里我们看到将当前`element`元素放到了`currentParent`的`scopedSlots`和`children`。

**为什么要在`scopedSlots`中也放一份？**

为了正确维护`v-if`的关系，看下面这段代码，过滤`slotScope`中不存在的数据

```js
element.children = element.children.filter(c => !(c: any).slotScope)
```

这样父组件内的第一个`v-slot`就解析完毕了。



好，我们看最终生成的`AST`，父组件是这样的

```js
const ast = {
  children: [
    {
      tag: "app-layout",
      scopedSlots: {
        'default': {slotTarget: '"default"', slotScope: '_empty_', parent: 'parentAST'},
        'footer': {slotTarget: '"footer"', slotScope: '_empty_', parent: 'parentAST'},
        'header': {slotTarget: '"header"', slotScope: '_empty_', parent: 'parentAST'},
      }
    }
  ]
}
```
**什么时候进入子组件？**

只要看`el.tag`是否是`app-layout`就行。好，开始执行子组件解析的时候，我们进入`processSlotOutlet`

```js
function processSlotOutlet (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name')
  }
}
```
这里主要是赋值了`slotName`。这个就很简单，我们直接看子组件的`AST`

```js
const childAst = {
  children: [
    {
      tag: 'header',
      children: [{slotName:'header', tag:'slot'}]
    }
    ...
  ]
}
```

### codegen