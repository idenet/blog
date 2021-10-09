# vue构造函数的流程

主要是了解在`src\core\instance\index.js`中的几个方法

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
// 注册vm的_init方法 ，初始化vm
initMixin(Vue)
// 注册vm$data/$set/$delete/$watch
stateMixin(Vue)
// 初始化事件相关，$on/$once/$off/$emit 发布订阅
eventsMixin(Vue)
// 初始化生命周期方法
// _update/$forceUpdate/$destory
lifecycleMixin(Vue)
// render
// $nextTick/_render
renderMixin(Vue)

export default Vue
```



