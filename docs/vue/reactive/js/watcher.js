class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    // data中的属性名称
    this.key = key
    // 回调函数负责更新试图
    this.cb = cb

    // 把watcher对象记录到Dep类的静态属性target
    Dep.target = this
    // 触发get方法，在get方法中调用addsubs
    this.oldValue = vm[key]
    Dep.target = null
  }

  // 当数据发生变化的时候更新试图
  update() {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) return
    this.cb(newValue)
  }
}
