# vuex

`vuex`和`vue-router`一样，也是通过插件的方式进行引入的。因为开发中，一般都会使用`modules`功能将`store`进行模块拆分，所以例子就通过这种方式进行。

```js
Vue.use(Vuex)

const moduleA = {
  ...
}
const moduleB = {
  ...
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
const vm = new Vue({
  el: '#app',
  render (h) {
    return h(App)
  },
  store
})
console.log(vm.$store.getters)

```