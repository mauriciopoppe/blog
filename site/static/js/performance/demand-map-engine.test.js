import { describe, expect, it } from 'bun:test'
import {
  DemandMapEngine,
  calculateDemandMap,
  improveSubsystem,
  updateDemandMapState
} from './demand-map-engine.js'

describe('DemandMapEngine', () => {
  it('computes service demand and capacity-adjusted demand', () => {
    const result = calculateDemandMap([
      { id: 'runtime', label: 'Runtime', visits: 2, serviceMs: 7, capacity: 1 },
      { id: 'host', label: 'Host', visits: 3, serviceMs: 2, capacity: 2 }
    ])

    expect(result.subsystems[0].demandMs).toBe(14)
    expect(result.subsystems[0].normalizedDemandMs).toBe(14)
    expect(result.subsystems[1].demandMs).toBe(6)
    expect(result.subsystems[1].normalizedDemandMs).toBe(3)
    expect(result.bottleneckId).toBe('runtime')
    expect(result.saturationRps).toBeCloseTo(1000 / 14, 6)
  })

  it('changes the bottleneck when an inner subsystem improves', () => {
    const initial = calculateDemandMap([
      { id: 'runtime', label: 'Runtime', visits: 2, serviceMs: 7, capacity: 1 },
      { id: 'kernel', label: 'Kernels', visits: 4, serviceMs: 3, capacity: 1 }
    ])
    const improved = improveSubsystem(initial, 'runtime', 0.6)

    expect(initial.bottleneckId).toBe('runtime')
    expect(improved.bottleneckId).toBe('kernel')
    expect(improved.saturationRps).toBeCloseTo(1000 / 12, 6)
  })

  it('keeps input values within valid physical ranges', () => {
    const state = calculateDemandMap([{ id: 'host', label: 'Host', visits: -2, serviceMs: 0, capacity: 0 }])

    expect(state.subsystems[0].visits).toBe(0)
    expect(state.subsystems[0].serviceMs).toBe(0.1)
    expect(state.subsystems[0].capacity).toBe(1)
  })

  it('updates one subsystem without mutating the prior state', () => {
    const initial = calculateDemandMap([
      { id: 'runtime', label: 'Runtime', visits: 2, serviceMs: 7, capacity: 1 }
    ])
    const updated = updateDemandMapState(initial, 'runtime', { visits: 3 })

    expect(initial.subsystems[0].visits).toBe(2)
    expect(updated.subsystems[0].visits).toBe(3)
    expect(updated.subsystems[0].demandMs).toBe(21)
  })

  it('provides a resettable stateful adapter', () => {
    const engine = new DemandMapEngine([
      { id: 'runtime', label: 'Runtime', visits: 2, serviceMs: 7, capacity: 1 }
    ])

    engine.setSubsystem('runtime', { serviceMs: 3 })
    expect(engine.getState().subsystems[0].serviceMs).toBe(3)
    engine.reset()
    expect(engine.getState().subsystems[0].serviceMs).toBe(7)
  })
})
