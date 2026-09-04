import { describe, expect, test } from 'bun:test'
import * as CANNON from '../vendor/cannon-es.js'
import {
  calculateAileronForce,
  calculateElevatorControlForce,
  calculateFlightForces,
  calculateHalfRollAileronForce,
  calculateHalfRollElevatorForce,
  calculateHalfRollRudderForce,
  calculateKnifeEdgeAileronForce,
  calculateKnifeEdgeElevatorForce,
  calculateKnifeEdgeRudderForce,
  calculateKnifeEdgeTargetBank,
  calculateLevelRoll,
  calculateLevelingAileronForce,
  calculateLoopElevatorForce,
  calculateRudderForce,
  cruiseConfig,
  evaluateFlightEnvelope
} from './flight-engine.js'
import {
  createParticleRopes,
  createRigidChain,
  stepParticleRopes,
  stepRigidChain,
  updateRigidChainLeader
} from './chain-engine.js'

const vector = (value) => new CANNON.Vec3(...value)

function stepFlightBody(body, world, forceRamp, config = cruiseConfig, currentMode = 'normal') {
  const forward = body.quaternion.vmult(new CANNON.Vec3(0, 0, 1))
  const wingRight = body.quaternion.vmult(new CANNON.Vec3(1, 0, 0))
  const bodyUp = body.quaternion.vmult(new CANNON.Vec3(0, 1, 0))
  const rollRate = body.angularVelocity.dot(forward)
  const pitchRate = body.angularVelocity.dot(wingRight)
  const yawRate = body.angularVelocity.dot(bodyUp)
  const angularSpeed = body.angularVelocity.length()
  const currentRoll = calculateLevelRoll({
    forward: [forward.x, forward.y, forward.z],
    up: [bodyUp.x, bodyUp.y, bodyUp.z]
  })
  const forces = calculateFlightForces({
    position: [body.position.x, body.position.y, body.position.z],
    velocity: [body.velocity.x, body.velocity.y, body.velocity.z],
    forward: [forward.x, forward.y, forward.z],
    wingRight: [wingRight.x, wingRight.y, wingRight.z],
    up: [bodyUp.x, bodyUp.y, bodyUp.z],
    currentRoll,
    rollRate,
    pitchRate,
    angularSpeed,
    currentMode,
    config
  })
  const envelope = evaluateFlightEnvelope({
    forward: [forward.x, forward.y, forward.z],
    up: [bodyUp.x, bodyUp.y, bodyUp.z],
    angularVelocity: [body.angularVelocity.x, body.angularVelocity.y, body.angularVelocity.z],
    flightMode: forces.flightMode,
    maxRoll: config.maxRoll ?? 0.7
  })
  const leftWingOffset = body.quaternion.vmult(new CANNON.Vec3(-0.75, 0, 0))
  const rightWingOffset = body.quaternion.vmult(new CANNON.Vec3(0.75, 0, 0))
  const tailOffset = body.quaternion.vmult(new CANNON.Vec3(0, 0, -0.9))

  let bankForce = 0
  let yawForce = 0
  let elevatorForce = 0

  if (forces.flightMode === 'returning-loop') {
    elevatorForce = calculateLoopElevatorForce({
      pitchRate,
      config
    })
    yawForce = calculateRudderForce({
      yawCommand: 0,
      yawRate,
      config
    })
    bankForce = 0
  } else if (forces.flightMode === 'returning-roll') {
    bankForce = calculateHalfRollAileronForce({
      currentRoll,
      rollRate,
      upY: bodyUp.y,
      config
    })
    elevatorForce = calculateHalfRollElevatorForce({
      forwardY: forward.y,
      pitchRate,
      config
    })
    yawForce = calculateHalfRollRudderForce({
      forwardX: forward.x,
      upY: bodyUp.y,
      yawRate,
      config
    })
  } else if (forces.flightMode === 'returning-knife-roll' || forces.flightMode === 'returning-knife-turn') {
    const targetBank = calculateKnifeEdgeTargetBank({
      position: [body.position.x, body.position.y, body.position.z],
      forward: [forward.x, forward.y, forward.z],
      config
    })
    bankForce = calculateKnifeEdgeAileronForce({
      currentRoll,
      rollRate,
      targetBank,
      config
    })
    elevatorForce = calculateKnifeEdgeElevatorForce({
      pitchRate,
      flightMode: forces.flightMode,
      config
    })
    yawForce = calculateKnifeEdgeRudderForce({
      yawRate,
      config
    })
  } else if (forces.flightMode === 'returning-knife-level') {
    bankForce = calculateKnifeEdgeAileronForce({
      currentRoll,
      rollRate,
      targetBank: 0,
      config
    })
    elevatorForce = calculateKnifeEdgeElevatorForce({
      forwardY: forward.y,
      pitchRate,
      flightMode: 'returning-knife-level',
      config
    })
    yawForce = calculateKnifeEdgeRudderForce({
      yawRate,
      config
    })
  } else if (forces.flightMode === 'normal') {
    bankForce = calculateLevelingAileronForce({
      currentRoll,
      rollRate,
      config
    })
    yawForce = calculateRudderForce({
      yawCommand: 0,
      yawRate,
      config
    })
    elevatorForce = calculateElevatorControlForce({
      altitudeHold: forces.altitudeHold,
      pitchRate,
      pitchAngle: envelope.pitch,
      config
    })
  } else {
    bankForce = calculateAileronForce({
      desiredRoll: forces.boundarySteering.roll * config.maxBankAngle,
      currentRoll,
      rollRate,
      config
    })
    yawForce = calculateRudderForce({
      yawCommand: forces.boundarySteering.yaw * -config.rudderGain,
      yawRate,
      config
    })
    elevatorForce = calculateElevatorControlForce({
      altitudeHold: forces.altitudeHold,
      pitchRate,
      pitchAngle: envelope.pitch,
      config
    })
  }

  const scale = (value) => value.scale(forceRamp)
  const leftLift = vector(forces.lift).scale(0.5)
  const rightLift = vector(forces.lift).scale(0.5)
  leftLift.vsub(bodyUp.scale(bankForce), leftLift)
  rightLift.vadd(bodyUp.scale(bankForce), rightLift)
  body.applyForce(scale(vector(forces.thrust)), new CANNON.Vec3())
  body.applyForce(scale(leftLift), leftWingOffset)
  body.applyForce(scale(rightLift), rightWingOffset)
  body.applyForce(scale(vector(forces.drag)), new CANNON.Vec3())
  body.applyForce(scale(vector(forces.gravity)), new CANNON.Vec3())
  body.applyForce(scale(wingRight.scale(yawForce)), tailOffset)
  body.applyForce(scale(bodyUp.scale(elevatorForce)), tailOffset)
  world.step(1 / 60)
  return {
    envelope,
    force: {
      lift: forces.lift,
      thrust: forces.thrust,
      drag: forces.drag,
      flightMode: forces.flightMode,
      altitudeHold: forces.altitudeHold,
      bankForce,
      yawForce,
      elevatorForce
    },
    rate: {
      yaw: body.angularVelocity.dot(bodyUp),
      pitch: body.angularVelocity.dot(wingRight),
      roll: body.angularVelocity.dot(forward)
    }
  }
}

function simulateSphereReturn(renderDelta = 1 / 60, configOverrides = {}) {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) })
  world.solver.iterations = 12
  const config = { ...cruiseConfig, ...configOverrides }
  const body = new CANNON.Body({ mass: 3, linearDamping: 0.015, angularDamping: 0.08 })
  body.addShape(new CANNON.Box(new CANNON.Vec3(0.45, 0.12, 0.9)))
  body.addShape(new CANNON.Box(new CANNON.Vec3(1, 0.05, 0.3)))
  body.position.set(...config.boundaryCenter)
  body.velocity.set(0, 0, 2.4)
  world.addBody(body)

  let chain = null
  if (configOverrides.attachChain) {
    chain = createRigidChain({
      CANNON,
      world,
      parentBody: body,
      count: configOverrides.chainCount ?? 6,
      linkMass: configOverrides.chainLinkMass ?? 0.002,
      linkLength: configOverrides.chainLinkLength ?? 0.18
    })
  }

  let ropes = null
  if (configOverrides.attachRopes) {
    ropes = createParticleRopes({
      count: configOverrides.ropeCount ?? 6,
      particlesPerRope: 14,
      restLength: 0.14
    })
  }

  const crossings = []
  let outside = false
  let crash = null
  let outboundStep = null
  let inboundStep = null
  let minForwardSpeed = Infinity
  let minNormalAlignment = 1
  let minNormalState = null
  let normalModeStep = null
  let currentMode = 'normal'
  for (let step = 0; step < Math.ceil(180 / renderDelta); step += 1) {
    const elapsed = step / 60
    if (chain) {
      const tailPos = body.position.vadd(body.quaternion.vmult(new CANNON.Vec3(0, 0, -0.95)))
      updateRigidChainLeader(chain, tailPos, body.quaternion, body.velocity)
      stepRigidChain(chain, renderDelta, { forceRamp: Math.min(1, elapsed / 15) })
    }
    if (ropes) {
      stepParticleRopes(ropes, body.position, body.quaternion, renderDelta, elapsed)
    }
    const finalStep = stepFlightBody(body, world, Math.min(1, elapsed / 15), config, currentMode)
    currentMode = finalStep.force.flightMode
    if (outside && finalStep.force.flightMode === 'normal' && normalModeStep === null) normalModeStep = step
    if (!finalStep.envelope.safe) {
      crash = finalStep.envelope.reason
      break
    }
    const distance = body.position.distanceTo(vector(config.boundaryCenter))
    const forward = body.quaternion.vmult(new CANNON.Vec3(0, 0, 1))
    const bodyUp = body.quaternion.vmult(new CANNON.Vec3(0, 1, 0))
    minForwardSpeed = Math.min(minForwardSpeed, body.velocity.dot(forward))
    if (bodyUp.y < minNormalAlignment) {
      minNormalAlignment = bodyUp.y
      minNormalState = {
        step,
        mode: finalStep.force.flightMode,
        forward: [forward.x, forward.y, forward.z],
        up: [bodyUp.x, bodyUp.y, bodyUp.z],
        roll: finalStep.envelope.roll,
        pitch: finalStep.envelope.pitch,
        rollRate: finalStep.rate.roll,
        bankForce: finalStep.force.bankForce
      }
    }
    const nextOutside = distance > config.boundaryRadius
    if (nextOutside !== outside) {
      crossings.push(nextOutside ? 'outbound' : 'inbound')
      if (nextOutside) outboundStep = step
      else inboundStep = step
    }
    outside = nextOutside
    if (crossings.length === 2) break
  }
  return { crash, crossings, minForwardSpeed, minNormalAlignment, minNormalState, normalModeStep, inboundStep, returnSeconds: (inboundStep - outboundStep) / 60 }
}

describe('Sunset flight physics', () => {
  test('positive differential wing lift produces the expected signed roll', () => {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) })
    const body = new CANNON.Body({ mass: 3 })
    body.addShape(new CANNON.Box(new CANNON.Vec3(0.45, 0.12, 0.9)))
    world.addBody(body)
    const leftWing = new CANNON.Vec3(-0.75, 0, 0)
    const rightWing = new CANNON.Vec3(0.75, 0, 0)
    body.applyForce(new CANNON.Vec3(0, -0.1, 0), leftWing)
    body.applyForce(new CANNON.Vec3(0, 0.1, 0), rightWing)
    world.step(1 / 60)
    const forward = body.quaternion.vmult(new CANNON.Vec3(0, 0, 1))
    const up = body.quaternion.vmult(new CANNON.Vec3(0, 1, 0))
    expect(evaluateFlightEnvelope({
      forward: [forward.x, forward.y, forward.z],
      up: [up.x, up.y, up.z],
      angularVelocity: [body.angularVelocity.x, body.angularVelocity.y, body.angularVelocity.z]
    }).roll).toBeLessThan(0)
  })

  test('uses differential wing lift to recover level flight in normal mode', () => {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) })
    const config = { ...cruiseConfig, boundaryRadius: 100 }
    const body = new CANNON.Body({ mass: 3, linearDamping: 0.015, angularDamping: 0.08 })
    body.addShape(new CANNON.Box(new CANNON.Vec3(0.45, 0.12, 0.9)))
    body.addShape(new CANNON.Box(new CANNON.Vec3(1, 0.05, 0.3)))
    body.position.set(...config.boundaryCenter)
    body.velocity.set(0, 0, 2.4)
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), 0.18)
    world.addBody(body)
    const initialUp = body.quaternion.vmult(new CANNON.Vec3(0, 1, 0)).y

    for (let step = 0; step < 480; step += 1) {
      const result = stepFlightBody(body, world, 1, config)
      expect(result.force.flightMode).toBe('normal')
    }

    const finalUp = body.quaternion.vmult(new CANNON.Vec3(0, 1, 0)).y
    expect(finalUp).toBeGreaterThan(initialUp + 0.01)
    expect(finalUp).toBeGreaterThan(0.995)
  })

  test('returns through a shallow, level bank while retaining forward flight', () => {
    const result = simulateSphereReturn()
    expect(result.crash).toBeNull()
    expect(result.crossings).toEqual(['outbound', 'inbound'])
    expect(result.returnSeconds).toBeLessThanOrEqual(30)
    expect(result.minForwardSpeed).toBeGreaterThan(1)
    expect(result.minNormalAlignment).toBeGreaterThan(0.9)
    expect(result.normalModeStep).toBeLessThan(result.inboundStep)
  })

  test('keeps the return stable and bounded when rendering at 30 Hz', () => {
    const result = simulateSphereReturn(1 / 30)
    const sixtyHzResult = simulateSphereReturn()
    expect(result.crash).toBeNull()
    expect(result.crossings).toEqual(['outbound', 'inbound'])
    expect(result.returnSeconds).toBeLessThan(30)
    expect(result.returnSeconds).toBeCloseTo(sixtyHzResult.returnSeconds, 3)
  })

  test('keeps tail yaw below the envelope during a 15 Hz catch-up frame', () => {
    const result = simulateSphereReturn(1 / 15)
    expect(result.crash).toBeNull()
    expect(result.crossings).toEqual(['outbound', 'inbound'])
  })

  test('returns through a half loop and roll rotation when returnStrategy is half-loop', () => {
    const result = simulateSphereReturn(1 / 60, { returnStrategy: 'half-loop' })
    expect(result.crash).toBeNull()
    expect(result.crossings).toEqual(['outbound', 'inbound'])
    expect(result.returnSeconds).toBeLessThan(15)
    expect(result.minForwardSpeed).toBeGreaterThan(0.85)
  })

  test('returns through a 90-degree knife-edge break turn when returnStrategy is knife-edge', () => {
    const result = simulateSphereReturn(1 / 60, { returnStrategy: 'knife-edge' })
    expect(result.crash).toBeNull()
    expect(result.crossings).toEqual(['outbound', 'inbound'])
    expect(result.returnSeconds).toBeLessThan(25)
    expect(result.minForwardSpeed).toBeGreaterThan(0.20)
  })

  test('returns safely across flight boundary with rigid chain attached', () => {
    const result = simulateSphereReturn(1 / 60, { attachChain: true, chainCount: 6 })
    expect(result.crash).toBeNull()
    expect(result.crossings).toEqual(['outbound', 'inbound'])
    expect(result.returnSeconds).toBeLessThan(35)
  })

  test('returns safely across flight boundary with particle ropes attached', () => {
    const result = simulateSphereReturn(1 / 60, { attachRopes: true, ropeCount: 6 })
    expect(result.crash).toBeNull()
    expect(result.crossings).toEqual(['outbound', 'inbound'])
    expect(result.returnSeconds).toBeLessThan(35)
  })
})
