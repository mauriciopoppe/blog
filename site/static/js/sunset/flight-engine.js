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
  maxBankAngle: 0,
  rollGain: 0,
  rollDamping: 0,
  maxAileronForce: 0,
  rudderGain: 0.035,
  yawDamping: 0.35,
  pitchDamping: 0.3,
  pitchStability: 0.25,
  maxElevatorForce: 0.18
}

const horizontalLength = (vector) => Math.hypot(vector[0], vector[2])

export function calculateAngleOfAttack({ velocity, forward }) {
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
  return yawCommand + yawRate * config.yawDamping
}

// Ailerons command a bank angle rather than a permanently applied torque.
// Roll-rate damping prevents the aircraft from overshooting that target.
export function calculateAileronForce({ desiredRoll, currentRoll, rollRate, config = cruiseConfig }) {
  const force = (desiredRoll - currentRoll) * config.rollGain - rollRate * config.rollDamping
  return Math.max(-config.maxAileronForce, Math.min(config.maxAileronForce, force))
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

export function evaluateFlightEnvelope({ forward, up, angularVelocity, maxPitch = 0.7, maxRoll = 0.7, maxRecoverableRoll = 0.95, maxAngularSpeed = 0.7 }) {
  const pitch = Math.atan2(forward[1], Math.hypot(forward[0], forward[2]))
  const roll = Math.atan2(up[0], up[1])
  const rollRate = dot(angularVelocity, forward)
  const angularSpeed = length(angularVelocity)
  if (Math.abs(pitch) > maxPitch) return { safe: false, reason: 'pitch-limit', pitch, roll, angularSpeed }
  const rollRecovering = roll * rollRate > 0
  if (Math.abs(roll) > maxRoll && (!rollRecovering || Math.abs(roll) > maxRecoverableRoll)) return { safe: false, reason: 'roll-limit', pitch, roll, angularSpeed }
  if (angularSpeed > maxAngularSpeed) return { safe: false, reason: 'angular-speed-limit', pitch, roll, angularSpeed }
  return { safe: true, reason: null, pitch, roll, angularSpeed }
}

export function calculateFlightForces({ position = [0, 0, 0], velocity, forward, wingRight, config = cruiseConfig }) {
  const airspeed = length(velocity)
  const thrustMagnitude = Math.max(config.minThrust, Math.min(
    config.maxThrust,
    config.thrust + (config.targetAirspeed - airspeed) * config.speedGain
  ))
  const thrust = scale(forward, thrustMagnitude)
  const drag = scale(velocity, -config.dragCoefficient * airspeed)
  const angleOfAttack = calculateAngleOfAttack({ velocity, forward })
  const effectiveLiftCoefficient = Math.max(0, config.liftCoefficient + config.liftSlope * angleOfAttack)
  const liftMagnitude = Math.min(config.maxLift, airspeed * airspeed * effectiveLiftCoefficient)
  const lift = scale(normalize(cross(velocity, wingRight)), liftMagnitude)
  const gravity = [0, config.gravity * config.mass, 0]
  const altitudeHold = calculateAltitudeHold({ altitude: position[1], verticalSpeed: velocity[1], config })
  const altitudeForce = [0, altitudeHold, 0]
  const elevatorForce = calculateElevatorForce({ altitudeHold, config })
  const boundarySteering = calculateBoundarySteering({ position, forward, config })
  return { airspeed, angleOfAttack, effectiveLiftCoefficient, thrustMagnitude, thrust, drag, lift, gravity, altitudeHold, altitudeForce, elevatorForce, boundarySteering, net: add(add(add(thrust, drag), add(lift, gravity)), altitudeForce) }
}

export function stepFlight(state, input, delta, config = cruiseConfig) {
  const forces = calculateFlightForces({ ...input, position: state.position, velocity: state.velocity, config })
  const acceleration = scale(forces.net, 1 / config.mass)
  const velocity = add(state.velocity, scale(acceleration, delta))
  return { position: add(state.position, scale(velocity, delta)), velocity, forces }
}
