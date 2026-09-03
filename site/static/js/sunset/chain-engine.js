export function createChainState(items) {
  return items.map((item) => ({
    item,
    z: item.position.z,
    y: item.position.y,
    rotationX: item.rotation.x,
    rotationZ: item.rotation.z,
    velocityZ: 0,
    velocityY: 0,
    velocityRotationX: 0,
    velocityRotationZ: 0
  }))
}

export function stepChain(states, targets, delta, { spring = 42, damping = 11 } = {}) {
  states.forEach((state, index) => {
    const target = targets[index]
    const step = (value, velocity, destination) => {
      const acceleration = (destination - value) * spring - velocity * damping
      const nextVelocity = velocity + acceleration * delta
      return [value + nextVelocity * delta, nextVelocity]
    }
    ;[state.z, state.velocityZ] = step(state.z, state.velocityZ, target.z)
    ;[state.y, state.velocityY] = step(state.y, state.velocityY, target.y)
    ;[state.rotationX, state.velocityRotationX] = step(state.rotationX, state.velocityRotationX, target.rotationX)
    ;[state.rotationZ, state.velocityRotationZ] = step(state.rotationZ, state.velocityRotationZ, target.rotationZ)
    state.item.position.z = state.z
    state.item.position.y = state.y
    state.item.rotation.x = state.rotationX
    state.item.rotation.z = state.rotationZ
  })
  return states
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
const length = (a) => Math.hypot(a[0], a[1], a[2])
const normalize = (a) => { const size = length(a) || 1; return scale(a, 1 / size) }
const quaternionFromDirection = (direction) => {
  const d = normalize(direction)
  const q = [-d[1], d[0], 0, 1 + d[2]]
  const size = Math.hypot(q[0], q[1], q[2], q[3]) || 1
  return q.map((value) => value / size)
}

export function createRopeParticles(THREE, count, segmentLength, anchor = new THREE.Vector3()) {
  return Array.from({ length: count }, (_, index) => ({
    position: anchor.clone().add(new THREE.Vector3(0, 0, -index * segmentLength)),
    velocity: new THREE.Vector3(),
    orientation: new THREE.Quaternion(),
    angularVelocity: new THREE.Vector3()
  }))
}

export function stepRope(THREE, particles, anchor, anchorVelocity, segmentLength, delta, { iterations = 3, damping = 0.985, gravity = new THREE.Vector3(0, -9.8, 0), stiffness = 34, elasticityDamping = 3 } = {}) {
  const dt = Math.min(Math.max(delta, 0), 0.05)
  particles.forEach((particle, index) => {
    const targetAnchor = index === 0 ? anchor : particles[index - 1].position
    const targetVelocity = index === 0 ? anchorVelocity : particles[index - 1].velocity
    const offset = particle.position.clone().sub(targetAnchor)
    const distance = offset.length() || segmentLength
    const direction = offset.multiplyScalar(1 / distance)
    const relativeVelocity = particle.velocity.clone().sub(targetVelocity)
    const stretch = distance - segmentLength
    const springAcceleration = -stiffness * stretch - elasticityDamping * relativeVelocity.dot(direction)
    particle.velocity.addScaledVector(direction, springAcceleration * dt)
      .addScaledVector(gravity, dt)
      .multiplyScalar(damping)
    particle.position.addScaledVector(particle.velocity, dt)
  })
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    particles.forEach((particle, index) => {
      const parent = index === 0 ? anchor : particles[index - 1].position
      const offset = particle.position.clone().sub(parent)
      const distance = offset.length() || segmentLength
      particle.position.addScaledVector(offset, -(distance - segmentLength) / distance)
    })
  }
  particles.forEach((particle, index) => {
    const parent = index === 0 ? anchor : particles[index - 1].position
    particle.velocity.copy(particle.position).sub(parent).multiplyScalar(1 / Math.max(dt, 1 / 120))
    const direction = parent.clone().sub(particle.position).normalize()
    particle.orientation.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction)
    particle.angularVelocity.set(0, 0, 0)
  })
  return particles
}
