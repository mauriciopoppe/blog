/* Shared visual clock for avatar and playback UI updates. */

class FrameLoop {
  constructor() {
    this.listeners = new Set()
    this.animationId = null
    this.tick = this.tick.bind(this)
  }

  subscribe(listener) {
    this.listeners.add(listener)
    if (this.animationId === null) this.animationId = requestAnimationFrame(this.tick)
    return () => {
      this.listeners.delete(listener)
      if (!this.listeners.size && this.animationId !== null) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }
    }
  }

  tick(now) {
    this.animationId = null
    this.listeners.forEach((listener) => listener(now))
    if (this.listeners.size) this.animationId = requestAnimationFrame(this.tick)
  }
}

export const avatarFrameLoop = new FrameLoop()
