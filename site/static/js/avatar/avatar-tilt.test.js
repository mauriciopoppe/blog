/*
 * Unit tests for Avatar 3D Tilt and Parallax
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { describe, it, expect } from 'bun:test'
import { computeTilt, lerpVal } from './avatar-tilt.js'

describe('Avatar 3D Parallax Tilt', () => {
  it('returns neutral angles when cursor is at avatar center', () => {
    const tilt = computeTilt(500, 300, 500, 300, 1000, 600)
    expect(tilt.rotX).toBeCloseTo(0, 2)
    expect(tilt.rotY).toBeCloseTo(0, 2)
    expect(tilt.transX).toBeCloseTo(0, 2)
    expect(tilt.transY).toBeCloseTo(0, 2)
    expect(tilt.shadowX).toBeCloseTo(0, 2)
    expect(tilt.shadowY).toBeCloseTo(0, 2)
    expect(tilt.shadowIntensity).toBeCloseTo(0.20, 2)
  })

  it('tilts towards the right when cursor is to the right of center', () => {
    const tilt = computeTilt(1000, 300, 500, 300, 1000, 600)
    expect(tilt.rotY).toBeGreaterThan(0)
    expect(tilt.transX).toBeGreaterThan(0)
    expect(tilt.shadowX).toBeLessThan(0) // Casts shadow to the left
  })

  it('tilts upwards when cursor is above center', () => {
    const tilt = computeTilt(500, 0, 500, 300, 1000, 600)
    expect(tilt.rotX).toBeGreaterThan(0) // Top tilts forward
    expect(tilt.transY).toBeLessThan(0)
    expect(tilt.shadowY).toBeGreaterThan(0) // Shadow casts downward
  })

  it('clamps maximum tilt and translation even with extreme cursor coordinates', () => {
    const maxTilt = 18
    const maxTrans = 6
    const tilt = computeTilt(50000, 50000, 500, 300, 1000, 600, maxTilt, maxTrans)
    expect(tilt.rotY).toBe(maxTilt)
    expect(tilt.rotX).toBe(-maxTilt)
    expect(tilt.transX).toBe(maxTrans)
    expect(tilt.transY).toBe(maxTrans)
  })

  it('interpolates smoothly towards target with LERP', () => {
    const initial = 0
    const target = 10
    const step1 = lerpVal(initial, target, 0.1)
    expect(step1).toBeCloseTo(1, 4)

    const step2 = lerpVal(step1, target, 0.1)
    expect(step2).toBeCloseTo(1.9, 4)
  })
})
