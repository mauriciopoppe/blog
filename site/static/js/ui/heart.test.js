import { describe, it, expect } from 'bun:test'
import { generateSwirlKeyframes } from './heart.js'

describe('Heart Swirl Physics & Keyframes (mojs exact model)', () => {
  it('generates the specified number of discrete animation steps', () => {
    const steps = 16
    const keyframes = generateSwirlKeyframes({
      distance: 60,
      pathScale: 0.8,
      degreeShift: 10,
      swirlSize: 10,
      swirlFrequency: 3,
      direction: 1,
      steps
    })

    expect(keyframes.length).toBe(steps + 1)
  })

  it('starts at origin (0, 0) and drifts upward with subtle angular swirl', () => {
    const keyframes = generateSwirlKeyframes({
      distance: 60,
      pathScale: 1.0,
      degreeShift: 0,
      swirlSize: 10,
      swirlFrequency: 3,
      direction: 1,
      steps: 10
    })

    const first = keyframes[0]
    const last = keyframes[keyframes.length - 1]

    expect(first.transform).toContain('0.00px, 0.00px')
    // At t=1, y is upward (negative) around -55px to -60px
    expect(last.transform).toMatch(/-[5-6][0-9]\.[0-9]{2}px/)
  })

  it('transitions color from light to deeppink and fades to zero opacity', () => {
    const keyframes = generateSwirlKeyframes({
      distance: 60,
      pathScale: 0.8,
      degreeShift: 0,
      swirlSize: 10,
      swirlFrequency: 2,
      direction: 1,
      steps: 10
    })

    const first = keyframes[0]
    const last = keyframes[keyframes.length - 1]

    // Starts at light/white
    expect(first.fill).toBe('rgb(255, 255, 255)')
    // Ends at deeppink (255, 20, 147) and opacity 0
    expect(last.fill).toBe('rgb(255, 20, 147)')
    expect(last.opacity).toBe('0.000')
  })

  it('shrinks down to 0 at the end (mojs scale: { 1: 0 })', () => {
    const keyframes = generateSwirlKeyframes({
      distance: 50,
      pathScale: 1,
      degreeShift: 0,
      swirlSize: 8,
      swirlFrequency: 2,
      direction: 1,
      steps: 10
    })

    // At completion, scale is 0
    expect(keyframes[keyframes.length - 1].transform).toContain('scale(0.000)')
  })
})
