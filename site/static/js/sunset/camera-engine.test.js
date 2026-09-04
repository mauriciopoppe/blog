import { describe, expect, test } from 'bun:test'
import {
  THIRD_PERSON_AUTO_ROTATE_SPEED,
  shouldAutoRotateThirdPerson
} from './camera-engine.js'

describe('Sunset camera behavior', () => {
  test('uses a tiny negative idle rotation for third-person view', () => {
    expect(THIRD_PERSON_AUTO_ROTATE_SPEED).toBeLessThan(0)
    expect(Math.abs(THIRD_PERSON_AUTO_ROTATE_SPEED)).toBeLessThan(1)
    expect(shouldAutoRotateThirdPerson('Third person', false)).toBe(true)
  })

  test('pauses idle rotation while dragging or in orbit mode', () => {
    expect(shouldAutoRotateThirdPerson('Third person', true)).toBe(false)
    expect(shouldAutoRotateThirdPerson('Orbit', false)).toBe(false)
  })
})
