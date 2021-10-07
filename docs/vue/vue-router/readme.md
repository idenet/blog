# hash 和 history 原理的区别

- hash模式是基于锚点，以及onhashchange事件
- history模式基于html5中的historyapi
  - history.pushState() ie10 以后才支持
  - history.replaceState()
  - history需要服务器的支持，在服务端配置404返回页面

# 基于vue.use和history api实现一个最简单的router

```js
let _Vue = null

export default class VueRouter {
  /**
   * 需要做的事情
   * 1. 判断是否已经加载vue-router
   * 2. 吧vue构造函数记录到全局变量
   * 3. 把创建vue实例时候传入的router对象注入到vue实例上
   * @param {*} vue
   */
  static install(vue) {
    if (VueRouter.install.installed) return
    VueRouter.install.installed = true

    _Vue = vue

    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      },
    })
  }

  constructor(options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/',
    })
  }

  init() {
    this.createRouteMap()
    this.initComponents(Vue)
    this.initEvent()
  }

  /**
   * 遍历所有的路由规则，吧路由规则解析成键值对的形式 存储到routeMap中
   */
  createRouteMap() {
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents(Vue) {
    Vue.component('router-link', {
      porps: {
        to: String,
      },
      // template: '<a :href="to"><slot></slot></a>', // 需要编译器
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.clickHandler,
            },
          },
          [this.$slots.default]
        )
      },
      methods: {
        clickHandler(e) {
          history.pushState({}, '', this.to)
          this.$router.data.current = this.to
          e.preventDefault()
        },
      },
    })
    const self = this
    Vue.component('router-view', {
      render(h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      },
    })
  }

  initEvent() {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}


```