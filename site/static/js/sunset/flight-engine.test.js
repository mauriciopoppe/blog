import { describe, expect, test } from 'bun:test'
import { calculateAileronForce, calculateAltitudeHold, calculateBoundarySteering, calculateElevatorControlForce, calculateElevatorForce, calculateFlightForces, calculateFlightMode, calculateHalfRollAileronForce, calculateKnifeEdgeAileronForce, calculateKnifeEdgeElevatorForce, calculateKnifeEdgeRudderForce, calculateKnifeEdgeTargetBank, calculateLevelRoll, calculateLevelingAileronForce, calculateLoopElevatorForce, calculateRudderForce, cruiseConfig, evaluateFlightEnvelope, stepFlight } from './flight-engine.js'

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

  test('returns to normal flight as soon as its heading will carry it back into the sphere', () => {
    const position = [0, 0, cruiseConfig.boundaryCenter[2] + cruiseConfig.boundaryRadius + 4]
    expect(calculateFlightMode({ position, forward: [0, 0, 1] })).toBe('returning')
    expect(calculateFlightMode({ position, forward: [0, 0, -1] })).toBe('normal')
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

  test('rudder switches to yaw braking at the commanded rate limit', () => {
    const config = { ...cruiseConfig, maxYawRate: 0.45 }
    expect(calculateRudderForce({ yawCommand: 0.65, yawRate: -0.7, config })).toBeLessThan(0)
  })

  test('ailerons converge on a bounded bank target instead of accumulating roll', () => {
    const aileronConfig = { ...cruiseConfig, rollGain: 0.1, rollDamping: 0.08, maxAileronForce: 0.05 }
    expect(calculateAileronForce({ desiredRoll: 0.2, currentRoll: 0, rollRate: 0, config: aileronConfig })).toBeGreaterThan(0)
    expect(calculateAileronForce({ desiredRoll: 0.2, currentRoll: 0.2, rollRate: 0, config: aileronConfig })).toBeCloseTo(0)
    expect(calculateAileronForce({ desiredRoll: 0.2, currentRoll: 0.2, rollRate: 0.3, config: aileronConfig })).toBeLessThan(0)
  })

  test('calculateLevelRoll measures roll angle independently of yaw heading', () => {
    const bankAngle = 0.25
    const cosB = Math.cos(bankAngle)
    const sinB = Math.sin(bankAngle)

    // Heading +Z: right-hand rotation around +Z tilts +Y toward -X (left)
    expect(calculateLevelRoll({ forward: [0, 0, 1], up: [0, 1, 0] })).toBeCloseTo(0, 6)
    expect(calculateLevelRoll({ forward: [0, 0, 1], up: [-sinB, cosB, 0] })).toBeCloseTo(bankAngle, 4)
    expect(calculateLevelRoll({ forward: [0, 0, 1], up: [sinB, cosB, 0] })).toBeCloseTo(-bankAngle, 4)

    // Heading +X (after 90° yaw): right-hand rotation around +X tilts +Y toward +Z
    expect(calculateLevelRoll({ forward: [1, 0, 0], up: [0, 1, 0] })).toBeCloseTo(0, 6)
    expect(calculateLevelRoll({ forward: [1, 0, 0], up: [0, cosB, sinB] })).toBeCloseTo(bankAngle, 4)
    expect(calculateLevelRoll({ forward: [1, 0, 0], up: [0, cosB, -sinB] })).toBeCloseTo(-bankAngle, 4)

    // Heading -Z (after 180° yaw): right-hand rotation around -Z tilts +Y toward +X
    expect(calculateLevelRoll({ forward: [0, 0, -1], up: [0, 1, 0] })).toBeCloseTo(0, 6)
    expect(calculateLevelRoll({ forward: [0, 0, -1], up: [sinB, cosB, 0] })).toBeCloseTo(bankAngle, 4)
    expect(calculateLevelRoll({ forward: [0, 0, -1], up: [-sinB, cosB, 0] })).toBeCloseTo(-bankAngle, 4)

    // Heading -X (after 270° yaw): right-hand rotation around -X tilts +Y toward -Z
    expect(calculateLevelRoll({ forward: [-1, 0, 0], up: [0, 1, 0] })).toBeCloseTo(0, 6)
    expect(calculateLevelRoll({ forward: [-1, 0, 0], up: [0, cosB, -sinB] })).toBeCloseTo(bankAngle, 4)
    expect(calculateLevelRoll({ forward: [-1, 0, 0], up: [0, cosB, sinB] })).toBeCloseTo(-bankAngle, 4)
  })

  test('calculateLevelingAileronForce commands restoring force against roll and damps roll rate', () => {
    // Banked right: restoring force should be negative
    const restoreRight = calculateLevelingAileronForce({ currentRoll: 0.1, rollRate: 0 })
    expect(restoreRight).toBeLessThan(0)

    // Banked left: restoring force should be positive
    const restoreLeft = calculateLevelingAileronForce({ currentRoll: -0.1, rollRate: 0 })
    expect(restoreLeft).toBeGreaterThan(0)

    // Level with roll rate: damping opposes angular velocity
    expect(calculateLevelingAileronForce({ currentRoll: 0, rollRate: 0.2 })).toBeLessThan(0)
    expect(calculateLevelingAileronForce({ currentRoll: 0, rollRate: -0.2 })).toBeGreaterThan(0)

    // Clamps at normalMaxAileronForce
    const clamped = calculateLevelingAileronForce({ currentRoll: 1.5, rollRate: 0 })
    expect(clamped).toBeCloseTo(-cruiseConfig.normalMaxAileronForce, 6)
  })

  test('calculateFlightMode stays in normal flight while inside the flight boundary radius', () => {
    const inside = [0, 0, cruiseConfig.boundaryCenter[2] + cruiseConfig.boundaryRadius - 5]
    expect(calculateFlightMode({ position: inside, forward: [0, 0, 1] })).toBe('normal')
    expect(calculateFlightMode({ position: inside, forward: [0, 0, -1] })).toBe('normal')
  })

  test('calculateLoopElevatorForce commands pitch-up force and damps pitch rate', () => {
    // Zero pitch rate: commanded downward tail force to pitch nose up
    const force = calculateLoopElevatorForce({ pitchRate: 0 })
    expect(force).toBeLessThan(0)

    // Pitching up faster than target rate: damping reduces the downward force
    const dampedForce = calculateLoopElevatorForce({ pitchRate: -1.5 })
    expect(dampedForce).toBeGreaterThan(force)
  })

  test('calculateHalfRollAileronForce commands roll rate toward upright and stabilizes upright wings', () => {
    // Inverted (upY < 0): drives positive roll rate
    const invertedForce = calculateHalfRollAileronForce({ currentRoll: Math.PI, rollRate: 0, upY: -0.8 })
    expect(invertedForce).toBeGreaterThan(0)

    // Nearing upright: commands restoring force against roll angle
    const restoringForce = calculateHalfRollAileronForce({ currentRoll: 0.1, rollRate: 0, upY: 0.9 })
    expect(restoringForce).toBeLessThan(0)
  })

  test('calculateFlightMode transitions through returning-loop, returning-roll, and normal when returnStrategy is half-loop', () => {
    const config = { ...cruiseConfig, returnStrategy: 'half-loop' }
    const outsidePos = [0, 0, cruiseConfig.boundaryCenter[2] + cruiseConfig.boundaryRadius + 5]

    // Outside boundary heading outward in normal mode -> transitions to returning-loop
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, 1],
      currentMode: 'normal',
      config
    })).toBe('returning-loop')

    // In returning-loop, still climbing -> remains in returning-loop
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0.8, 0.6],
      up: [0, 0.6, -0.8],
      currentMode: 'returning-loop',
      config
    })).toBe('returning-loop')

    // In returning-loop, reaches inverted inbound -> transitions to returning-roll
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0.1, -0.99],
      up: [0, -0.99, -0.1],
      currentMode: 'returning-loop',
      config
    })).toBe('returning-roll')

    // In returning-roll, still rolling -> remains in returning-roll
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, -1],
      up: [1, 0, 0],
      currentRoll: 1.5,
      currentMode: 'returning-roll',
      config
    })).toBe('returning-roll')

    // In returning-roll, reaches upright wings -> transitions to normal
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, -1],
      up: [0, 0.98, 0],
      currentRoll: 0.05,
      currentMode: 'returning-roll',
      config
    })).toBe('normal')

    // Outside boundary but heading inbound in normal mode -> stays in normal
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, -1],
      currentMode: 'normal',
      config
    })).toBe('normal')
  })

  test('calculateFlightMode supports dynamic strategy selection when returnStrategy is random', () => {
    const outsidePos = [0, 0, cruiseConfig.boundaryCenter[2] + cruiseConfig.boundaryRadius + 5]
    const selectLoop = { ...cruiseConfig, returnStrategy: 'random', selectRandomStrategy: () => 'half-loop' }
    const selectBank = { ...cruiseConfig, returnStrategy: 'random', selectRandomStrategy: () => 'bank' }

    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, 1],
      currentMode: 'normal',
      config: selectLoop
    })).toBe('returning-loop')

    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, 1],
      currentMode: 'normal',
      config: selectBank
    })).toBe('returning')
  })

  test('evaluateFlightEnvelope relaxes pitch and roll limits in aerobatic flight modes while bounding angular speed', () => {
    // Inverted pitch in normal mode trips pitch-limit
    expect(evaluateFlightEnvelope({
      forward: [0, 1, 0],
      up: [0, 0, -1],
      angularVelocity: [0, 0, 0],
      flightMode: 'normal'
    }).safe).toBe(false)

    // Inverted pitch in returning-loop mode is permitted
    expect(evaluateFlightEnvelope({
      forward: [0, 1, 0],
      up: [0, 0, -1],
      angularVelocity: [0, 0, 0],
      flightMode: 'returning-loop'
    }).safe).toBe(true)

    // Inverted roll in returning-roll mode is permitted
    expect(evaluateFlightEnvelope({
      forward: [0, 0, -1],
      up: [0, -1, 0],
      angularVelocity: [0, 0, 0],
      flightMode: 'returning-roll'
    }).safe).toBe(true)

    // 90-degree bank in returning-knife-turn mode is permitted
    expect(evaluateFlightEnvelope({
      forward: [0, 0, 1],
      up: [1, 0, 0],
      angularVelocity: [0, 0, 0],
      flightMode: 'returning-knife-turn'
    }).safe).toBe(true)

    // Excessive angular speed trips angular-speed-limit even in aerobatic modes
    expect(evaluateFlightEnvelope({
      forward: [0, 1, 0],
      up: [0, 0, -1],
      angularVelocity: [0, 12, 0],
      flightMode: 'returning-loop'
    }).reason).toBe('angular-speed-limit')
    expect(evaluateFlightEnvelope({
      forward: [0, 0, 1],
      up: [1, 0, 0],
      angularVelocity: [0, 12, 0],
      flightMode: 'returning-knife-turn'
    }).reason).toBe('angular-speed-limit')
  })

  test('calculateKnifeEdgeTargetBank selects bank sign based on turn direction', () => {
    const center = cruiseConfig.boundaryCenter
    const bank = cruiseConfig.knifeTargetBank
    // Position at +Z boundary, facing +Z (center is directly behind): defaults to right-hand turn
    const bankDirectlyBehind = calculateKnifeEdgeTargetBank({
      position: [center[0], center[1], center[2] + 30],
      forward: [0, 0, 1]
    })
    expect(bankDirectlyBehind).toBeCloseTo(bank, 4)

    // Position at +Z boundary, facing +X (center is to the left): banks left (-bank)
    const bankLeft = calculateKnifeEdgeTargetBank({
      position: [center[0], center[1], center[2] + 30],
      forward: [1, 0, 0]
    })
    expect(bankLeft).toBeCloseTo(-bank, 4)

    // Position at +Z boundary, facing -X (center is to the right): banks right (+bank)
    const bankRight = calculateKnifeEdgeTargetBank({
      position: [center[0], center[1], center[2] + 30],
      forward: [-1, 0, 0]
    })
    expect(bankRight).toBeCloseTo(bank, 4)
  })

  test('calculateKnifeEdgeAileronForce drives bank toward targetBank and clamps', () => {
    // Current roll 0, target bank -1.35: force should be negative to roll left
    const forceLeft = calculateKnifeEdgeAileronForce({
      currentRoll: 0,
      rollRate: 0,
      targetBank: -cruiseConfig.knifeTargetBank
    })
    expect(forceLeft).toBeLessThan(0)

    // Current roll 0, target bank +1.35: force should be positive to roll right
    const forceRight = calculateKnifeEdgeAileronForce({
      currentRoll: 0,
      rollRate: 0,
      targetBank: cruiseConfig.knifeTargetBank
    })
    expect(forceRight).toBeGreaterThan(0)

    // Clamps at max aileron force when opposed by roll rate
    const clamped = calculateKnifeEdgeAileronForce({
      currentRoll: 0.5,
      rollRate: 1.0,
      targetBank: -cruiseConfig.knifeTargetBank
    })
    expect(clamped).toBeCloseTo(-cruiseConfig.knifeMaxAileronForce, 4)
  })

  test('calculateKnifeEdgeElevatorForce commands pitch-up force during turn', () => {
    const turnForce = calculateKnifeEdgeElevatorForce({
      pitchRate: 0,
      flightMode: 'returning-knife-turn'
    })
    expect(turnForce).toBeLessThan(0)

    const levelForce = calculateKnifeEdgeElevatorForce({
      forwardY: 0.1,
      pitchRate: 0,
      flightMode: 'returning-knife-level'
    })
    expect(levelForce).toBeGreaterThan(0)

    const rollForce = calculateKnifeEdgeElevatorForce({
      pitchRate: 0.2,
      flightMode: 'returning-knife-roll'
    })
    expect(rollForce).toBeLessThan(0)
  })

  test('calculateFlightMode sequences knife-edge roll, turn, level, and normal return', () => {
    const outsidePos = [
      cruiseConfig.boundaryCenter[0],
      cruiseConfig.boundaryCenter[1],
      cruiseConfig.boundaryCenter[2] + cruiseConfig.boundaryRadius + 5
    ]
    const knifeConfig = { ...cruiseConfig, returnStrategy: 'knife-edge' }

    // Normal outside boundary initiates knife-edge roll
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, 1],
      currentMode: 'normal',
      config: knifeConfig
    })).toBe('returning-knife-roll')

    // At knife edge (bank ~ knifeTargetBank), transitions to turn
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, 1],
      currentRoll: knifeConfig.knifeTargetBank,
      currentMode: 'returning-knife-roll',
      config: knifeConfig
    })).toBe('returning-knife-turn')

    // In turn, once heading points inward (headingDot > 0.65), transitions to level
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, -1],
      currentMode: 'returning-knife-turn',
      config: knifeConfig
    })).toBe('returning-knife-level')

    // In level mode, once wings are level and rates settled, returns to normal
    expect(calculateFlightMode({
      position: outsidePos,
      forward: [0, 0, -1],
      up: [0, 1, 0],
      currentRoll: 0.05,
      rollRate: 0.05,
      pitchRate: 0.05,
      angularSpeed: 0.2,
      currentMode: 'returning-knife-level',
      config: knifeConfig
    })).toBe('normal')
  })
})
