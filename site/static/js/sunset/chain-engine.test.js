import { describe, expect, test } from 'bun:test'
import { createChainState, stepChain } from './chain-engine.js'

const item = () => ({ position: { z: 0, y: 0 }, rotation: { x: 0, z: 0 } })

describe('Sunset chain engine', () => {
  test('moves each link toward its independent target', () => {
    const items = [item(), item()]
    const states = createChainState(items)
    stepChain(states, [
      { z: 1, y: 0, rotationX: 0.5, rotationZ: 0 },
      { z: -1, y: 0, rotationX: -0.5, rotationZ: 0 }
    ], 0.1)
    expect(items[0].position.z).toBeGreaterThan(0)
    expect(items[1].position.z).toBeLessThan(0)
    expect(items[0].rotation.x).toBeGreaterThan(0)
    expect(items[1].rotation.x).toBeLessThan(0)
  })

  test('converges to targets after advancing many simulation steps', () => {
    const items = [item(), item()]
    const states = createChainState(items)
    const targets = [
      { z: 2, y: 0.5, rotationX: 0.4, rotationZ: 0.2 },
      { z: -1, y: -0.25, rotationX: -0.3, rotationZ: -0.15 }
    ]
    for (let step = 0; step < 180; step += 1) stepChain(states, targets, 1 / 60)
    expect(items[0].position.z).toBeCloseTo(2, 2)
    expect(items[0].position.y).toBeCloseTo(0.5, 2)
    expect(items[0].rotation.x).toBeCloseTo(0.4, 2)
    expect(items[1].position.z).toBeCloseTo(-1, 2)
    expect(items[1].rotation.z).toBeCloseTo(-0.15, 2)
  })

  test('keeps links independent while following a loop trajectory', () => {
    const items = [item(), item(), item()]
    const states = createChainState(items)
    for (let step = 0; step < 45; step += 1) {
      const progress = step / 45
      const targets = items.map((unused, index) => {
        const phase = Math.PI * progress - index * 0.25
        return {
          z: -index * 0.2,
          y: Math.sin(phase) * 2,
          rotationX: -phase,
          rotationZ: Math.sin(phase) * 0.3
        }
      })
      stepChain(states, targets, 1 / 60)
    }
    expect(items[0].position.y).not.toBeCloseTo(items[2].position.y, 2)
    expect(items[0].rotation.x).not.toBeCloseTo(items[2].rotation.x, 2)
    expect(items[1].position.z).toBeLessThan(items[0].position.z)
  })
})
