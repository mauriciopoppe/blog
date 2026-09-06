import { describe, expect, it } from 'bun:test'
import { FrameLoop } from './frame-loop.js'

describe('FrameLoop visibility handling', () => {
  it('does not schedule frames while the document is hidden', () => {
    const scheduled = []
    const cancelled = []
    const listeners = new Set()
    const documentStub = {
      hidden: true,
      addEventListener: (type, listener) => listeners.add(listener),
      removeEventListener: (type, listener) => listeners.delete(listener)
    }
    const loop = new FrameLoop({
      documentRef: documentStub,
      requestFrame: (callback) => {
        scheduled.push(callback)
        return scheduled.length
      },
      cancelFrame: (id) => cancelled.push(id)
    })

    loop.subscribe(() => {})
    expect(scheduled).toHaveLength(0)

    documentStub.hidden = false
    listeners.forEach((listener) => listener())
    expect(scheduled).toHaveLength(1)
  })

  it('cancels a pending frame when the document becomes hidden', () => {
    const scheduled = []
    const cancelled = []
    const listeners = new Set()
    const documentStub = {
      hidden: false,
      addEventListener: (type, listener) => listeners.add(listener),
      removeEventListener: (type, listener) => listeners.delete(listener)
    }
    const loop = new FrameLoop({
      documentRef: documentStub,
      requestFrame: (callback) => {
        scheduled.push(callback)
        return scheduled.length
      },
      cancelFrame: (id) => cancelled.push(id)
    })

    loop.subscribe(() => {})
    expect(scheduled).toHaveLength(1)
    documentStub.hidden = true
    listeners.forEach((listener) => listener())
    expect(cancelled).toEqual([1])
  })
})
