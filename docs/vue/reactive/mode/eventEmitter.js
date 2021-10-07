class EventEmitter {
  constructor() {
    this.subs = Object.create(null) // 不需要原型链
  }

  // v注册事件
  $on(eventType, handler) {
    // 如果有值直接返回，如果没有值返回空数组
    this.subs[eventType] = this.subs[eventType] || []
    this.subs[eventType].push(handler)
  }

  // 触发事件
  $emit(eventType) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach((handler) => {
        handler()
      })
    }
  }
}
