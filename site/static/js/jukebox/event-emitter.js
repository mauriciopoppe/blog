export class EventEmitter {
  constructor() {
    this.listeners = new Map()
  }

  on(event, listener) {
    const listeners = this.listeners.get(event) || []
    listeners.push(listener)
    this.listeners.set(event, listeners)
    return this
  }

  emit(event, ...args) {
    for (const listener of this.listeners.get(event) || []) listener(...args)
  }
}
