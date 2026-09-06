/**
 * Pure demand-map model for the inference-stack explainer.
 *
 * The engine has no DOM or rendering dependencies. It converts subsystem
 * inputs into service demand, capacity-adjusted demand, and the current
 * saturation bottleneck.
 */

export const DEFAULT_SUBSYSTEMS = [
  { id: 'silicon', label: 'Silicon', visits: 1, serviceMs: 8, capacity: 1 },
  { id: 'kernel', label: 'Kernels', visits: 4, serviceMs: 3, capacity: 1 },
  { id: 'host', label: 'Host', visits: 3, serviceMs: 2, capacity: 2 },
  { id: 'runtime', label: 'Runtime', visits: 2, serviceMs: 6.5, capacity: 1 },
  { id: 'orchestration', label: 'Orchestration', visits: 1, serviceMs: 2.5, capacity: 1 }
]

const MIN_VISITS = 0
const MIN_SERVICE_MS = 0.1
const MIN_CAPACITY = 1

function clampNumber(value, minimum) {
  const number = Number(value)
  if (!Number.isFinite(number)) return minimum
  return Math.max(minimum, number)
}

function normalizeSubsystem(input, fallback = {}) {
  return {
    id: input.id || fallback.id,
    label: input.label || fallback.label,
    visits: clampNumber(input.visits ?? fallback.visits, MIN_VISITS),
    serviceMs: clampNumber(input.serviceMs ?? fallback.serviceMs, MIN_SERVICE_MS),
    capacity: clampNumber(input.capacity ?? fallback.capacity, MIN_CAPACITY)
  }
}

export function calculateDemandMap(subsystems = DEFAULT_SUBSYSTEMS) {
  const normalized = subsystems.map((input, index) => normalizeSubsystem(input, DEFAULT_SUBSYSTEMS[index] || {}))
  const derived = normalized.map((subsystem) => {
    const demandMs = subsystem.visits * subsystem.serviceMs
    const normalizedDemandMs = demandMs / subsystem.capacity
    const saturationRps = demandMs > 0 ? (1000 * subsystem.capacity) / demandMs : Infinity

    return {
      ...subsystem,
      demandMs,
      normalizedDemandMs,
      saturationRps
    }
  })

  const bottleneck = derived.reduce((current, subsystem) => {
    if (!current || subsystem.normalizedDemandMs > current.normalizedDemandMs) return subsystem
    return current
  }, null)

  const saturationRps = bottleneck && Number.isFinite(bottleneck.saturationRps)
    ? bottleneck.saturationRps
    : Infinity

  return {
    subsystems: derived,
    bottleneckId: bottleneck?.id || null,
    saturationRps,
    maxNormalizedDemandMs: bottleneck?.normalizedDemandMs || 0
  }
}

export function createDemandMapState(subsystems = DEFAULT_SUBSYSTEMS) {
  return calculateDemandMap(subsystems.map((subsystem) => ({ ...subsystem })))
}

export function updateDemandMapState(state, subsystemId, changes) {
  const nextInputs = state.subsystems.map((subsystem) => {
    if (subsystem.id !== subsystemId) return subsystem
    return { ...subsystem, ...changes }
  })
  return calculateDemandMap(nextInputs)
}

export function improveSubsystem(state, subsystemId, fraction = 0.1) {
  const improvement = Math.max(0, Math.min(1, Number(fraction) || 0))
  const subsystem = state.subsystems.find((candidate) => candidate.id === subsystemId)
  if (!subsystem) return state
  return updateDemandMapState(state, subsystemId, {
    serviceMs: subsystem.serviceMs * (1 - improvement)
  })
}

export class DemandMapEngine {
  constructor(subsystems = DEFAULT_SUBSYSTEMS) {
    this.initialInputs = subsystems.map((subsystem) => ({ ...subsystem }))
    this.state = createDemandMapState(this.initialInputs)
  }

  getState() {
    return this.state
  }

  setSubsystem(subsystemId, changes) {
    this.state = updateDemandMapState(this.state, subsystemId, changes)
    return this.state
  }

  improveSubsystem(subsystemId, fraction = 0.1) {
    this.state = improveSubsystem(this.state, subsystemId, fraction)
    return this.state
  }

  reset() {
    this.state = createDemandMapState(this.initialInputs)
    return this.state
  }
}
