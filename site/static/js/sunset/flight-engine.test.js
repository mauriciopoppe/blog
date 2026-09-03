import { describe, expect, test } from 'bun:test'
import { calculateAileronForce, calculateAltitudeHold, calculateBoundarySteering, calculateElevatorControlForce, calculateElevatorForce, calculateFlightForces, calculateRudderForce, cruiseConfig, evaluateFlightEnvelope, stepFlight } from './flight-engine.js'

describe('Sunset flight engine', () => {
  test('balances lift and gravity at the intended cruise speed', () => {
    const cruiseSpeed = Math.sqrt(cruiseConfig.thrust / cruiseConfig.dragCoefficient)
    const { net } = calculateFlightForces({
      position: cruiseConfig.boundaryCenter,
      velocity: [0, 0, cruiseSpeed],
      forward: [0, 0, 1],
      wingRight: [1, 0, 0]
    })
    expect(net[0]).toBeCloseTo(0, 6)
    expect(net[1]).toBeCloseTo(0, 6)
    expect(net[2]).toBeCloseTo(0, 6)
  })

  test('approaches terminal speed without unbounded acceleration', () => {
    const unconstrainedConfig = { ...cruiseConfig, boundaryRadius: Infinity }
    let state = { position: [...cruiseConfig.boundaryCenter], velocity: [0, 0, 2.4] }
    for (let step = 0; step < 720; step += 1) {
      state = stepFlight(state, { forward: [0, 0, 1], wingRight: [1, 0, 0] }, 1 / 60, unconstrainedConfig)
    }
    expect(state.velocity[2]).toBeCloseTo(Math.sqrt(10), 1)
    expect(state.forces.net[2]).toBeCloseTo(0, 1)
  })

  test('raises thrust below cruise speed and reduces it above cruise speed', () => {
    const belowCruise = calculateFlightForces({ velocity: [0, 0, 1], forward: [0, 0, 1], wingRight: [1, 0, 0] })
    const aboveCruise = calculateFlightForces({ velocity: [0, 0, 5], forward: [0, 0, 1], wingRight: [1, 0, 0] })
    expect(belowCruise.thrustMagnitude).toBeGreaterThan(cruiseConfig.thrust)
    expect(aboveCruise.thrustMagnitude).toBeLessThan(cruiseConfig.thrust)
  })

  test('reduces lift when the plane climbs above its pitch attitude', () => {
    const level = calculateFlightForces({ velocity: [0, 0, 3], forward: [0, 0, 1], wingRight: [1, 0, 0] })
    const climbing = calculateFlightForces({ velocity: [0, 0.5, 3], forward: [0, 0, 1], wingRight: [1, 0, 0] })
    expect(climbing.angleOfAttack).toBeLessThan(0)
    expect(climbing.lift[1]).toBeLessThan(level.lift[1])
  })

  test('pushes the plane back only after it leaves the allowed altitude zone', () => {
    expect(calculateAltitudeHold({ altitude: 0, verticalSpeed: 0 })).toBe(0)
    expect(calculateAltitudeHold({ altitude: 2, verticalSpeed: 0 })).toBeLessThan(0)
    expect(calculateAltitudeHold({ altitude: -2, verticalSpeed: 0 })).toBeGreaterThan(0)
  })

  test('deflects the tail up above the altitude corridor and down below it', () => {
    expect(calculateElevatorForce({ altitudeHold: -1 })).toBeGreaterThan(0)
    expect(calculateElevatorForce({ altitudeHold: 1 })).toBeLessThan(0)
  })

  test('horizontal stabilizer opposes the current pitch rate', () => {
    expect(calculateElevatorControlForce({ altitudeHold: 0, pitchRate: 0.3 })).toBeLessThan(0)
    expect(calculateElevatorControlForce({ altitudeHold: 0, pitchRate: -0.3 })).toBeGreaterThan(0)
  })

  test('horizontal stabilizer restores a level pitch attitude', () => {
    expect(calculateElevatorControlForce({ altitudeHold: 0, pitchRate: 0, pitchAngle: 0.3 })).toBeGreaterThan(0)
    expect(calculateElevatorControlForce({ altitudeHold: 0, pitchRate: 0, pitchAngle: -0.3 })).toBeLessThan(0)
  })

  test('requests a banked turn toward the sphere center only beyond its flight boundary', () => {
    expect(calculateBoundarySteering({ position: [0, 0, 45], forward: [0, 0, 1] })).toEqual({ yaw: 0, roll: 0 })
    const steering = calculateBoundarySteering({ position: [40, 0, 45], forward: [0, 0, 1] })
    expect(steering.yaw).toBeLessThan(0)
    expect(steering.roll).toBeGreaterThan(0)
  })

  test('flags unsafe pitch, roll, and angular speed before a flight inversion', () => {
    expect(evaluateFlightEnvelope({ forward: [0, 0, 1], up: [0, 1, 0], angularVelocity: [0, 0, 0] }).safe).toBe(true)
    expect(evaluateFlightEnvelope({ forward: [0, 0, 1], up: [0, 1, 0], angularVelocity: [0, 0, 0.4] }).safe).toBe(true)
    expect(evaluateFlightEnvelope({ forward: [0, 1, 0], up: [0, 1, 0], angularVelocity: [0, 0, 0] }).reason).toBe('pitch-limit')
    expect(evaluateFlightEnvelope({ forward: [0, 0, 1], up: [1, 0, 0], angularVelocity: [0, 0, 0] }).reason).toBe('roll-limit')
    expect(evaluateFlightEnvelope({ forward: [0, 0, 1], up: [0, 1, 0], angularVelocity: [0, 0, 1] }).reason).toBe('angular-speed-limit')
  })

  test('allows a bounded roll transient when the ailerons are already recovering it', () => {
    const recoveringRoll = evaluateFlightEnvelope({
      forward: [0, 0, 1],
      up: [Math.sin(0.75), Math.cos(0.75), 0],
      angularVelocity: [0, 0, 0.2]
    })
    expect(recoveringRoll.safe).toBe(true)
  })

  test('vertical stabilizer opposes the current yaw rate', () => {
    expect(calculateRudderForce({ yawCommand: 0, yawRate: 0.3 })).toBeGreaterThan(0)
    expect(calculateRudderForce({ yawCommand: 0, yawRate: -0.3 })).toBeLessThan(0)
  })

  test('ailerons converge on a bounded bank target instead of accumulating roll', () => {
    const aileronConfig = { ...cruiseConfig, rollGain: 0.1, rollDamping: 0.08, maxAileronForce: 0.05 }
    expect(calculateAileronForce({ desiredRoll: 0.2, currentRoll: 0, rollRate: 0, config: aileronConfig })).toBeGreaterThan(0)
    expect(calculateAileronForce({ desiredRoll: 0.2, currentRoll: 0.2, rollRate: 0, config: aileronConfig })).toBeCloseTo(0)
    expect(calculateAileronForce({ desiredRoll: 0.2, currentRoll: 0.2, rollRate: 0.3, config: aileronConfig })).toBeLessThan(0)
  })

})
