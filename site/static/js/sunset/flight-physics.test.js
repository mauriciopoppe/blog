import { describe, expect, test } from 'bun:test'
import * as CANNON from '../vendor/cannon-es.js'
import {
  calculateAileronForce,
  calculateElevatorControlForce,
  calculateFlightForces,
  calculateRudderForce,
  cruiseConfig,
  evaluateFlightEnvelope
} from './flight-engine.js'

const vector = (value) => new CANNON.Vec3(...value)

function stepFlightBody(body, world, forceRamp, config = cruiseConfig) {
  const forward = body.quaternion.vmult(new CANNON.Vec3(0, 0, 1))
  const wingRight = body.quaternion.vmult(new CANNON.Vec3(1, 0, 0))
  const bodyUp = body.quaternion.vmult(new CANNON.Vec3(0, 1, 0))
  const forces = calculateFlightForces({
    position: [body.position.x, body.position.y, body.position.z],
    velocity: [body.velocity.x, body.velocity.y, body.velocity.z],
    forward: [forward.x, forward.y, forward.z],
    wingRight: [wingRight.x, wingRight.y, wingRight.z],
    config
  })
  const envelope = evaluateFlightEnvelope({
    forward: [forward.x, forward.y, forward.z],
    up: [bodyUp.x, bodyUp.y, bodyUp.z],
    angularVelocity: [body.angularVelocity.x, body.angularVelocity.y, body.angularVelocity.z],
    maxRoll: config.maxRoll ?? 0.7
  })
  const leftWingOffset = body.quaternion.vmult(new CANNON.Vec3(-0.75, 0, 0))
  const rightWingOffset = body.quaternion.vmult(new CANNON.Vec3(0.75, 0, 0))
  const tailOffset = body.quaternion.vmult(new CANNON.Vec3(0, 0, -0.9))
  const bankForce = calculateAileronForce({
    desiredRoll: forces.boundarySteering.roll * config.maxBankAngle,
    currentRoll: -envelope.roll,
    rollRate: body.angularVelocity.dot(forward),
    config
  })
  const yawForce = calculateRudderForce({
    yawCommand: forces.boundarySteering.yaw * -config.rudderGain,
    yawRate: body.angularVelocity.dot(bodyUp),
    config
  })
  const elevatorForce = calculateElevatorControlForce({
    altitudeHold: forces.altitudeHold,
    pitchRate: body.angularVelocity.dot(wingRight),
    pitchAngle: envelope.pitch,
    config
  })
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
  world.step(1 / 60, 1 / 60, 4)
  return {
    envelope,
    force: {
      lift: forces.lift,
      thrust: forces.thrust,
      drag: forces.drag,
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

  test('crosses the flight sphere outbound and then inbound through surface forces', () => {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) })
    world.solver.iterations = 12
    const config = { ...cruiseConfig }
    const body = new CANNON.Body({ mass: 3, linearDamping: 0.015, angularDamping: 0.08 })
    body.addShape(new CANNON.Box(new CANNON.Vec3(0.45, 0.12, 0.9)))
    body.addShape(new CANNON.Box(new CANNON.Vec3(1, 0.05, 0.3)))
    body.position.set(...config.boundaryCenter)
    body.velocity.set(0, 0, 2.4)
    world.addBody(body)

    const crossings = []
    let outside = false
    let crash = null
    let finalStep = null
    let outboundStep = null
    let inboundStep = null
    for (let step = 0; step < 60 * 180; step += 1) {
      finalStep = stepFlightBody(body, world, Math.min(1, step / (60 * 15)), config)
      if (!finalStep.envelope.safe) {
        crash = finalStep.envelope.reason
        break
      }
      const distance = body.position.distanceTo(vector(config.boundaryCenter))
      const nextOutside = distance > config.boundaryRadius
      if (nextOutside !== outside) {
        crossings.push(nextOutside ? 'outbound' : 'inbound')
        if (nextOutside) outboundStep = step
        else inboundStep = step
      }
      outside = nextOutside
      if (crossings.length === 2) break
    }

    expect(crash).toBeNull()
    expect(crossings).toEqual(['outbound', 'inbound'])
    expect((inboundStep - outboundStep) / 60).toBeLessThan(15)
  })
})
