const add = (a, b) => a.map((value, index) => value + b[index])
const sub = (a, b) => a.map((value, index) => value - b[index])
const scale = (vector, factor) => vector.map((value) => value * factor)
const length = (vector) => Math.hypot(...vector)
const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0)
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
]
const normalize = (vector) => {
  const magnitude = length(vector)
  return magnitude ? scale(vector, 1 / magnitude) : [0, 0, 0]
}

export const cruiseConfig = {
  gravity: -0.45,
  mass: 3,
  thrust: 2.5,
  targetAirspeed: Math.sqrt(10),
  speedGain: 1.5,
  minThrust: 0.5,
  maxThrust: 5,
  dragCoefficient: 0.25,
  liftCoefficient: 0.135,
  liftSlope: 0.6,
  maxLift: 2,
  minAltitude: -1,
  maxAltitude: 1,
  altitudeGain: 3,
  altitudeDamping: 1.2,
  maxAltitudeForce: 2.5,
  elevatorGain: 0.03,
  boundaryCenter: [0, 0, 45],
  boundaryRadius: 28,
  boundaryGain: 0.35,
  boundaryDamping: 0.8,
  maxBoundaryForce: 5,
  // Once the nose has an adequately inward heading, surface controllers can
  // recover level flight before the position crosses the sphere boundary.
  normalEntryHeading: 0.8,
  // Banking gives lift a horizontal component, so a boundary turn follows a
  // curved flight path instead of rotating the fuselage in place.
  maxBankAngle: 0.08,
  rollGain: 0.01,
  rollDamping: 0.03,
  maxAileronForce: 0.001,
  normalRollGain: 0.05,
  normalRollDamping: 0.1,
  normalMaxAileronForce: 0.02,
  rudderGain: 0.2,
  yawDamping: 0.5,
  maxYawRate: 0.6,
  pitchDamping: 0.3,
  pitchStability: 0.25,
  maxElevatorForce: 0.18,
  returnStrategy: 'bank',
  loopMaxLift: 6.0,
  loopThrust: 4.0,
  loopElevatorForce: -0.35,
  loopTargetPitchRate: -0.8,
  loopPitchDamping: 0.3,
  loopEntryHeading: 0.5,
  loopExitHeading: 0.65,
  loopExitPitch: 0.25,
  halfRollTargetRate: 2.5,
  halfRollLevelGain: 3.5,
  halfRollRateGain: 1.5,
  halfRollMaxAileronForce: 5.0,
  halfRollThrust: 3.5,
  halfRollPitchGain: 0.8,
  halfRollPitchDamping: 0.5,
  halfRollMaxElevatorForce: 0.35,
  halfRollExitUp: 0.85,
  halfRollExitRoll: 0.15,
  halfRollExitRollRate: 0.15,
  halfRollExitAngularSpeed: 0.65,
  halfRollExitPitchRate: 0.25,
  knifeTargetBank: 1.10,
  knifeRollTargetRate: 0.7,
  knifeRollGain: 2.0,
  knifeRollRateGain: 1.5,
  knifeMaxAileronForce: 1.0,
  knifeThrust: 3.0,
  knifeTurnMaxLift: 3.6,
  knifeTurnElevatorForce: -0.09,
  knifeTurnTargetPitchRate: -0.32,
  knifeTurnPitchDamping: 0.2,
  knifeRollEntryAngle: 0.25,
  knifeLevelPitchGain: 1.5,
  knifeLevelPitchDamping: 0.6,
  knifeEntryHeading: 0.5,
  knifeExitHeading: 0.65,
  knifeExitUp: 0.85,
  knifeExitRoll: 0.15,
  knifeExitRollRate: 0.15,
  knifeExitAngularSpeed: 0.50,
  knifeExitPitchRate: 0.35
}

const horizontalLength = (vector) => Math.hypot(vector[0], vector[2])

export function calculateAngleOfAttack({ velocity, forward, wingRight }) {
  if (wingRight) {
    const up = cross(forward, wingRight)
    const vDotFwd = dot(velocity, forward)
    const vDotUp = dot(velocity, up)
    return Math.atan2(-vDotUp, vDotFwd)
  }
  const flightPathAngle = Math.atan2(velocity[1], horizontalLength(velocity))
  const pitchAngle = Math.atan2(forward[1], horizontalLength(forward))
  return pitchAngle - flightPathAngle
}

export function calculateAltitudeHold({ altitude, verticalSpeed, config = cruiseConfig }) {
  const target = altitude < config.minAltitude
    ? config.minAltitude
    : altitude > config.maxAltitude
      ? config.maxAltitude
      : null
  if (target === null) return 0
  const force = (target - altitude) * config.altitudeGain - verticalSpeed * config.altitudeDamping
  return Math.max(-config.maxAltitudeForce, Math.min(config.maxAltitudeForce, force))
}

export function calculateElevatorForce({ altitudeHold, config = cruiseConfig }) {
  return -altitudeHold * config.elevatorGain
}

// The horizontal stabilizer resists rotation about the aircraft's right axis.
// At the tail, an upward force produces positive pitch torque.
export function calculateElevatorControlForce({ altitudeHold, pitchRate, pitchAngle = 0, config = cruiseConfig }) {
  const force = calculateElevatorForce({ altitudeHold, config }) + pitchAngle * config.pitchStability - pitchRate * config.pitchDamping
  return Math.max(-config.maxElevatorForce, Math.min(config.maxElevatorForce, force))
}

// A vertical stabilizer resists rotation about the aircraft's up axis. The
// caller applies this lateral force at the tail, where it becomes a yaw torque.
export function calculateRudderForce({ yawCommand, yawRate, config = cruiseConfig }) {
  const acceleratesCurrentTurn = yawCommand * yawRate < 0
  const limitedCommand = acceleratesCurrentTurn && Math.abs(yawRate) >= config.maxYawRate ? 0 : yawCommand
  return limitedCommand + yawRate * config.yawDamping
}

// Ailerons command a bank angle rather than a permanently applied torque.
// Roll-rate damping prevents the aircraft from overshooting that target.
export function calculateAileronForce({ desiredRoll, currentRoll, rollRate, config = cruiseConfig }) {
  const force = (desiredRoll - currentRoll) * config.rollGain - rollRate * config.rollDamping
  return Math.max(-config.maxAileronForce, Math.min(config.maxAileronForce, force))
}

export function calculateLevelingAileronForce({ currentRoll, rollRate, config = cruiseConfig }) {
  return calculateAileronForce({
    desiredRoll: 0,
    currentRoll,
    rollRate,
    config: {
      ...config,
      rollGain: config.normalRollGain,
      rollDamping: config.normalRollDamping,
      maxAileronForce: config.normalMaxAileronForce
    }
  })
}

export function calculateLoopElevatorForce({ pitchRate, config = cruiseConfig }) {
  const targetRate = config.loopTargetPitchRate ?? -0.8
  const baseForce = config.loopElevatorForce ?? -0.35
  const damping = config.loopPitchDamping ?? 0.3
  return baseForce - (pitchRate - targetRate) * damping
}

export function calculateHalfRollAileronForce({ currentRoll, rollRate, upY = 0, config = cruiseConfig }) {
  let targetRate = config.halfRollTargetRate ?? 2.5
  if (upY > 0) {
    const levelGain = config.halfRollLevelGain ?? 3.5
    targetRate = Math.max(-targetRate, Math.min(targetRate, -currentRoll * levelGain))
  }
  const rateGain = config.halfRollRateGain ?? 1.5
  const maxForce = config.halfRollMaxAileronForce ?? 5.0
  const force = (targetRate - rollRate) * rateGain
  return Math.max(-maxForce, Math.min(maxForce, force))
}

export function calculateHalfRollElevatorForce({ forwardY, pitchRate, config = cruiseConfig }) {
  const pitchGain = config.halfRollPitchGain ?? 0.8
  const pitchDamping = config.halfRollPitchDamping ?? 0.5
  const maxForce = config.halfRollMaxElevatorForce ?? 0.35
  const force = forwardY * pitchGain - pitchRate * pitchDamping
  return Math.max(-maxForce, Math.min(maxForce, force))
}

export function calculateHalfRollRudderForce({ forwardX, upY = 0, yawRate = 0, config = cruiseConfig }) {
  const yawCommand = upY > 0.6 ? 0 : -forwardX * (upY > 0 ? 0.8 : -0.8)
  return calculateRudderForce({ yawCommand, yawRate, config })
}

export function calculateKnifeEdgeTargetBank({ position, forward, config = cruiseConfig }) {
  const offset = sub(config.boundaryCenter, position)
  const horizontalOffset = [offset[0], 0, offset[2]]
  const desiredHeading = normalize(horizontalOffset)
  const currentHeading = normalize([forward[0], 0, forward[2]])
  const headingDot = dot(currentHeading, desiredHeading)
  let yaw = cross(currentHeading, desiredHeading)[1]
  if (headingDot < -0.95) yaw = -1
  const turnSign = yaw >= 0 ? -1 : 1
  const bankAngle = config.knifeTargetBank ?? 1.35
  return turnSign * bankAngle
}

export function calculateKnifeEdgeAileronForce({
  currentRoll,
  rollRate,
  targetBank,
  config = cruiseConfig
}) {
  let rollError = targetBank - currentRoll
  while (rollError > Math.PI) rollError -= 2 * Math.PI
  while (rollError < -Math.PI) rollError += 2 * Math.PI
  const maxRate = config.knifeRollTargetRate ?? 1.2
  const rollGain = config.knifeRollGain ?? 2.5
  const rateGain = config.knifeRollRateGain ?? 1.8
  const maxForce = config.knifeMaxAileronForce ?? 2.2
  const targetRate = Math.max(-maxRate, Math.min(maxRate, rollError * rollGain))
  const force = (targetRate - rollRate) * rateGain
  return Math.max(-maxForce, Math.min(maxForce, force))
}

export function calculateKnifeEdgeElevatorForce({
  forwardY = 0,
  pitchRate,
  flightMode = 'returning-knife-turn',
  config = cruiseConfig
}) {
  if (flightMode === 'returning-knife-turn') {
    const turnForce = config.knifeTurnElevatorForce ?? -0.09
    const targetPitchRate = config.knifeTurnTargetPitchRate ?? -0.32
    const pitchDamping = config.knifeTurnPitchDamping ?? 0.2
    const force = turnForce - (pitchRate - targetPitchRate) * pitchDamping
    return Math.max(-0.25, Math.min(0.25, force))
  }
  if (flightMode === 'returning-knife-roll') {
    return -pitchRate * 0.3
  }
  const pitchAngle = Math.asin(Math.max(-1, Math.min(1, forwardY)))
  const pitchGain = config.knifeLevelPitchGain ?? 1.5
  const pitchDamping = config.knifeLevelPitchDamping ?? 0.6
  const force = pitchAngle * pitchGain - pitchRate * pitchDamping
  return Math.max(-0.35, Math.min(0.35, force))
}

export function calculateKnifeEdgeRudderForce({
  yawRate = 0,
  config = cruiseConfig
}) {
  return calculateRudderForce({ yawCommand: 0, yawRate, config })
}

// Measure bank around the aircraft's current forward axis. World X is only a
// useful roll reference while the aircraft happens to face world +Z.
export function calculateLevelRoll({ forward, up }) {
  const worldUp = [0, 1, 0]
  const levelUp = normalize(sub(worldUp, scale(forward, dot(worldUp, forward))))
  return Math.atan2(dot(cross(levelUp, up), forward), dot(levelUp, up))
}

export function calculateBoundarySteering({ position, forward, config = cruiseConfig }) {
  const offset = sub(config.boundaryCenter, position)
  const horizontalOffset = [offset[0], 0, offset[2]]
  if (length(horizontalOffset) <= config.boundaryRadius) return { yaw: 0, roll: 0 }
  const desiredHeading = normalize(horizontalOffset)
  const currentHeading = normalize([forward[0], 0, forward[2]])
  const headingDot = dot(currentHeading, desiredHeading)
  let yaw = cross(currentHeading, desiredHeading)[1]
  // At exactly 180°, the cross product has no preferred turn direction.
  // Choose a consistent right-hand turn so the plane does not stall facing
  // away from its destination.
  if (headingDot < -0.95) yaw = -1
  return { yaw, roll: -yaw }
}

export function calculateFlightMode({
  position,
  forward,
  up,
  currentRoll = 0,
  rollRate = 0,
  pitchRate = 0,
  angularSpeed = 0,
  currentMode = 'normal',
  config = cruiseConfig
}) {
  const offset = sub(config.boundaryCenter, position)
  const horizontalOffset = [offset[0], 0, offset[2]]
  const isOutside = length(horizontalOffset) > config.boundaryRadius
  const desiredHeading = normalize(horizontalOffset)
  const currentHeading = normalize([forward[0], 0, forward[2]])
  const headingDot = dot(currentHeading, desiredHeading)

  if (currentMode === 'returning-loop') {
    const loopCompleted = headingDot > (config.loopExitHeading ?? 0.65) &&
      Math.abs(forward[1]) < (config.loopExitPitch ?? 0.25) &&
      (up ? up[1] < -0.4 : true)
    if (loopCompleted) return 'returning-roll'
    return 'returning-loop'
  }
  if (currentMode === 'returning-roll') {
    const rollCompleted = (up ? up[1] > (config.halfRollExitUp ?? 0.85) : true) &&
      Math.abs(currentRoll) < (config.halfRollExitRoll ?? 0.15)
    const rollRateDamped = Math.abs(rollRate) < (config.halfRollExitRollRate ?? 0.15)
    const angularSpeedDamped = angularSpeed === 0 || angularSpeed < (config.halfRollExitAngularSpeed ?? 0.65)
    const pitchDamped = Math.abs(pitchRate) < (config.halfRollExitPitchRate ?? 0.25)
    if (rollCompleted && rollRateDamped && angularSpeedDamped && pitchDamped) return 'normal'
    return 'returning-roll'
  }
  if (currentMode === 'returning-knife-roll') {
    const targetBank = calculateKnifeEdgeTargetBank({ position, forward, config })
    const atKnifeEdge = Math.abs(currentRoll - targetBank) < (config.knifeRollEntryAngle ?? 0.35)
    if (atKnifeEdge) return 'returning-knife-turn'
    return 'returning-knife-roll'
  }
  if (currentMode === 'returning-knife-turn') {
    const turnCompleted = headingDot > (config.knifeExitHeading ?? 0.65)
    if (turnCompleted) return 'returning-knife-level'
    return 'returning-knife-turn'
  }
  if (currentMode === 'returning-knife-level') {
    const rollCompleted = (up ? up[1] > (config.knifeExitUp ?? 0.85) : true) &&
      Math.abs(currentRoll) < (config.knifeExitRoll ?? 0.15)
    const rollRateDamped = Math.abs(rollRate) < (config.knifeExitRollRate ?? 0.15)
    const angularSpeedDamped = angularSpeed === 0 || angularSpeed < (config.knifeExitAngularSpeed ?? 0.65)
    const pitchDamped = Math.abs(pitchRate) < (config.knifeExitPitchRate ?? 0.35)
    if (rollCompleted && rollRateDamped && angularSpeedDamped && pitchDamped) {
      return headingDot >= (config.normalEntryHeading ?? 0.65) ? 'normal' : 'returning'
    }
    return 'returning-knife-level'
  }
  if (currentMode === 'returning') {
    if (!isOutside) return 'normal'
    return headingDot >= config.normalEntryHeading ? 'normal' : 'returning'
  }

  if (!isOutside) return 'normal'

  const strategy = config.returnStrategy === 'random'
    ? (config.selectRandomStrategy ? config.selectRandomStrategy() : (() => {
        const rand = Math.random()
        if (rand < 0.33) return 'half-loop'
        if (rand < 0.66) return 'knife-edge'
        return 'bank'
      })())
    : (config.returnStrategy ?? 'bank')

  if (strategy === 'half-loop') {
    if (headingDot < (config.loopEntryHeading ?? 0.5)) {
      return 'returning-loop'
    }
    return 'normal'
  }
  if (strategy === 'knife-edge') {
    if (headingDot < (config.knifeEntryHeading ?? 0.5)) {
      return 'returning-knife-roll'
    }
    return headingDot >= config.normalEntryHeading ? 'normal' : 'returning'
  }

  return headingDot >= config.normalEntryHeading
    ? 'normal'
    : 'returning'
}

export function evaluateFlightEnvelope({
  forward,
  up,
  angularVelocity,
  flightMode = 'normal',
  maxPitch = 0.7,
  maxRoll = 0.7,
  maxRecoverableRoll = 0.95,
  maxAngularSpeed = 0.7,
  maxAerobaticAngularSpeed = 8.0
}) {
  const pitch = Math.atan2(forward[1], Math.hypot(forward[0], forward[2]))
  const roll = Math.atan2(up[0], up[1])
  const rollRate = dot(angularVelocity, forward)
  const angularSpeed = length(angularVelocity)

  const isAerobaticMode = flightMode === 'returning-loop' ||
    flightMode === 'returning-roll' ||
    flightMode === 'returning-knife-roll' ||
    flightMode === 'returning-knife-turn' ||
    flightMode === 'returning-knife-level'
  if (isAerobaticMode) {
    if (angularSpeed > maxAerobaticAngularSpeed) {
      return { safe: false, reason: 'angular-speed-limit', pitch, roll, angularSpeed }
    }
    return { safe: true, reason: null, pitch, roll, angularSpeed }
  }

  if (Math.abs(pitch) > maxPitch) return { safe: false, reason: 'pitch-limit', pitch, roll, angularSpeed }
  const rollRecovering = roll * rollRate > 0
  if (Math.abs(roll) > maxRoll && (!rollRecovering || Math.abs(roll) > maxRecoverableRoll)) return { safe: false, reason: 'roll-limit', pitch, roll, angularSpeed }
  if (angularSpeed > maxAngularSpeed) return { safe: false, reason: 'angular-speed-limit', pitch, roll, angularSpeed }
  return { safe: true, reason: null, pitch, roll, angularSpeed }
}

export function calculateFlightForces({
  position = [0, 0, 0],
  velocity,
  forward,
  wingRight,
  up,
  currentRoll = 0,
  rollRate = 0,
  pitchRate = 0,
  angularSpeed = 0,
  currentMode = 'normal',
  config = cruiseConfig
}) {
  const airspeed = length(velocity)
  const angleOfAttack = calculateAngleOfAttack({ velocity, forward, wingRight })
  const effectiveLiftCoefficient = Math.max(0, config.liftCoefficient + config.liftSlope * angleOfAttack)
  const flightMode = calculateFlightMode({ position, forward, up, currentRoll, rollRate, pitchRate, angularSpeed, currentMode, config })

  let maxLift = config.maxLift
  if (flightMode === 'returning-loop') maxLift = config.loopMaxLift ?? 6.0
  else if (flightMode === 'returning-knife-turn') maxLift = config.knifeTurnMaxLift ?? 5.5
  const liftMagnitude = Math.min(maxLift, airspeed * airspeed * effectiveLiftCoefficient)
  const lift = scale(normalize(cross(velocity, wingRight)), liftMagnitude)

  let thrustMagnitude = Math.max(config.minThrust, Math.min(
    config.maxThrust,
    config.thrust + (config.targetAirspeed - airspeed) * config.speedGain
  ))
  if (flightMode === 'returning-loop') thrustMagnitude = Math.max(config.loopThrust ?? 4.0, thrustMagnitude)
  else if (flightMode === 'returning-roll') thrustMagnitude = Math.max(config.halfRollThrust ?? 3.5, thrustMagnitude)
  else if (flightMode === 'returning-knife-roll' || flightMode === 'returning-knife-turn') thrustMagnitude = Math.max(config.knifeThrust ?? 4.0, thrustMagnitude)
  else if (flightMode === 'returning-knife-level') thrustMagnitude = Math.max(config.halfRollThrust ?? 3.5, thrustMagnitude)

  const thrust = scale(forward, thrustMagnitude)
  const drag = scale(velocity, -config.dragCoefficient * airspeed)
  const gravity = [0, config.gravity * config.mass, 0]
  const altitudeHold = calculateAltitudeHold({ altitude: position[1], verticalSpeed: velocity[1], config })
  const altitudeForce = [0, altitudeHold, 0]
  const elevatorForce = calculateElevatorForce({ altitudeHold, config })
  const boundarySteering = flightMode === 'returning'
    ? calculateBoundarySteering({ position, forward, config })
    : { yaw: 0, roll: 0 }
  return { airspeed, angleOfAttack, effectiveLiftCoefficient, thrustMagnitude, thrust, drag, lift, gravity, altitudeHold, altitudeForce, elevatorForce, flightMode, boundarySteering, net: add(add(add(thrust, drag), add(lift, gravity)), altitudeForce) }
}

export function stepFlight(state, input, delta, config = cruiseConfig) {
  const forces = calculateFlightForces({ ...input, position: state.position, velocity: state.velocity, config })
  const acceleration = scale(forces.net, 1 / config.mass)
  const velocity = add(state.velocity, scale(acceleration, delta))
  return { position: add(state.position, scale(velocity, delta)), velocity, forces }
}
