/* Shared visual clock for avatar and playback UI updates. */

export class FrameLoop {
  constructor({
    documentRef = typeof document !== 'undefined' ? document : null,
    requestFrame = (callback) => requestAnimationFrame(callback),
    cancelFrame = (id) => cancelAnimationFrame(id)
  } = {}) {
    this.listeners = new Set()
    this.animationId = null
    this.documentRef = documentRef
    this.requestFrame = requestFrame
    this.cancelFrame = cancelFrame
    this.tick = this.tick.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    this.documentRef?.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  isVisible() {
    return !this.documentRef || !this.documentRef.hidden
  }

  schedule() {
    if (this.animationId === null && this.listeners.size && this.isVisible()) {
      this.animationId = this.requestFrame(this.tick)
    }
  }

  subscribe(listener) {
    this.listeners.add(listener)
    this.schedule()
    return () => {
      this.listeners.delete(listener)
      if (!this.listeners.size && this.animationId !== null) {
        this.cancelFrame(this.animationId)
        this.animationId = null
      }
    }
  }

  tick(now) {
    this.animationId = null
    if (!this.isVisible()) return
    this.listeners.forEach((listener) => listener(now))
    this.schedule()
  }

  handleVisibilityChange() {
    if (!this.isVisible()) {
      if (this.animationId !== null) {
        this.cancelFrame(this.animationId)
        this.animationId = null
      }
      return
    }
    this.schedule()
  }
}

export const avatarFrameLoop = new FrameLoop()
