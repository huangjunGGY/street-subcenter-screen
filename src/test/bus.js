class EventBus {
  constructor() {
    this.events = {}
  }
  on(event, callback) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
  }
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(...args))
    }
  }
  off(event, callback) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }
}
const bus = new EventBus()
export default bus
