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
const yawQuaternion = (quaternion) => {
  const yaw = Math.atan2(
    2 * (quaternion.w * quaternion.y + quaternion.x * quaternion.z),
    1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z)
  )
  return [0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)]
}
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

export function createRigidChain({
  CANNON,
  world,
  parentBody,
  tailOffset = [0, 0, -0.95],
  count = 7,
  text = null,
  linkMass = 0.02,
  linkLength = 0.28,
  linkRadius = 0.02,
  linearDamping = 0.25,
  angularDamping = 0.40,
  delayFrames = 2
}) {
  const links = []
  const constraints = []

  // If text is provided, reverse characters so the sentence reads correctly:
  // plane tail -> delayed leader ('!') -> 'a' -> 'e' -> 'd' -> 'i' -> ... -> 'U' -> ropes trail after 'U'
  const characters = text ? text.split('').reverse() : null
  const effectiveCount = characters ? characters.length : count

  const backward = parentBody.quaternion.vmult(new CANNON.Vec3(0, 0, -1))
  const startPos = parentBody.position.vadd(parentBody.quaternion.vmult(new CANNON.Vec3(...tailOffset)))

  for (let i = 0; i < effectiveCount; i += 1) {
    const linkPos = startPos.vadd(backward.scale((i + 0.5) * linkLength))
    const isLeader = i === 0
    const link = new CANNON.Body({
      type: isLeader ? CANNON.Body.KINEMATIC : CANNON.Body.DYNAMIC,
      mass: isLeader ? 0 : linkMass,
      linearDamping,
      angularDamping,
      position: linkPos,
      velocity: parentBody.velocity.clone()
    })
    link.quaternion.copy(parentBody.quaternion)
    link.addShape(new CANNON.Box(new CANNON.Vec3(linkRadius, linkRadius, linkLength * 0.45)))
    world.addBody(link)
    links.push(link)

    if (i > 0) {
      const prev = links[i - 1]
      const localA = new CANNON.Vec3(0, 0, -linkLength * 0.5)
      const localB = new CANNON.Vec3(0, 0, linkLength * 0.5)
      const constraint = new CANNON.PointToPointConstraint(prev, localA, link, localB)
      world.addConstraint(constraint)
      constraints.push(constraint)
    }
  }

  return {
    links,
    constraints,
    count: effectiveCount,
    text,
    characters,
    linkLength,
    linkRadius,
    linkMass,
    tailOffset,
    delayFrames,
    history: []
  }
}

export function updateRigidChainLeader(chain, tailPosition, tailQuaternion, tailVelocity) {
  const history = chain.history
  history.push({
    position: [tailPosition.x, tailPosition.y, tailPosition.z],
    quaternion: [tailQuaternion.x, tailQuaternion.y, tailQuaternion.z, tailQuaternion.w],
    velocity: [tailVelocity.x, tailVelocity.y, tailVelocity.z]
  })
  const targetIndex = Math.max(0, history.length - 1 - chain.delayFrames)
  const delayed = history[targetIndex]
  const leader = chain.links[0]
  if (leader && delayed) {
    leader.position.set(delayed.position[0], delayed.position[1], delayed.position[2])
    leader.quaternion.set(delayed.quaternion[0], delayed.quaternion[1], delayed.quaternion[2], delayed.quaternion[3])
    leader.velocity.set(delayed.velocity[0], delayed.velocity[1], delayed.velocity[2])
  }
  if (history.length > chain.delayFrames + 30) {
    history.shift()
  }
}

export function stepRigidChain(chain, delta, {
  forceRamp = 1,
  gravity = -0.30,
  airDrag = 0.012
} = {}) {
  const links = chain.links
  // Only dynamic links experience gravity and trailing air resistance
  for (let i = 1; i < links.length; i += 1) {
    const link = links[i]
    if (gravity !== 0) {
      link.force.y += link.mass * gravity * forceRamp
    }
    if (airDrag > 0) {
      link.force.x -= link.velocity.x * airDrag * forceRamp
      link.force.y -= link.velocity.y * airDrag * forceRamp
      link.force.z -= link.velocity.z * airDrag * forceRamp
    }
  }
  return chain
}

export function destroyRigidChain(chain, world) {
  if (!chain || !world) return
  chain.constraints.forEach((c) => world.removeConstraint(c))
  chain.links.forEach((l) => world.removeBody(l))
  chain.links.length = 0
  chain.constraints.length = 0
}

export function syncRigidChainVisuals(chain, visuals, { headingQuaternion = null } = {}) {
  if (!chain || !visuals) return visuals
  chain.links.forEach((link, index) => {
    const visual = visuals[index]
    if (!visual) return
    visual.position.set(link.position.x, link.position.y, link.position.z)
    const orientation = visual.userData?.upright
      ? yawQuaternion(headingQuaternion || link.quaternion)
      : [link.quaternion.x, link.quaternion.y, link.quaternion.z, link.quaternion.w]
    visual.quaternion.set(...orientation)
    if (visual.userData?.orientationOffset) {
      visual.quaternion.multiply(visual.userData.orientationOffset)
    }
  })
  return visuals
}

export function syncRigidChainChords(chain, chords, {
  topOffset = 0.24,
  bottomOffset = -0.24,
  anchor = null,
  anchorSegments = 3
} = {}) {
  if (!chain || !chords) return chords
  const offsets = [topOffset, bottomOffset]
  const linkStart = anchor ? anchorSegments : 0
  chords.forEach((chord, chordIndex) => {
    const position = chord.geometry.attributes.position
    if (anchor) {
      const firstLink = chain.links[0].position
      for (let segment = 0; segment < anchorSegments; segment += 1) {
        const t = segment / anchorSegments
        position.setXYZ(
          segment,
          anchor.x + (firstLink.x - anchor.x) * t,
          anchor.y + offsets[chordIndex] + (firstLink.y - anchor.y) * t,
          anchor.z + (firstLink.z - anchor.z) * t
        )
      }
    }
    chain.links.forEach((link, linkIndex) => {
      position.setXYZ(linkStart + linkIndex, link.position.x, link.position.y + offsets[chordIndex], link.position.z)
    })
    position.needsUpdate = true
    chord.geometry.computeBoundingSphere?.()
  })
  return chords
}

export function createRigidChainVisuals(THREE, chain, {
  color = 0xffffff,
  font = '600 42px system-ui, sans-serif',
  scale = [0.32, 0.48, 1],
  rotationY = Math.PI / 2,
  upright = true,
  chordColor = color,
  chordOpacity = 0.75,
  chordWidth = 1
} = {}) {
  const group = new THREE.Group()
  const visuals = chain.characters.map((character) => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const context = canvas.getContext('2d')
    context.font = font
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = color
    context.fillText(character, 64, 64)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false
    }))
    mesh.scale.set(...scale)
    mesh.userData.upright = upright
    mesh.userData.orientationOffset = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rotationY
    )
    mesh.frustumCulled = false
    group.add(mesh)
    return mesh
  })
  const chords = [
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(chain.links.map(() => new THREE.Vector3()).concat(
        [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
      )),
      new THREE.LineBasicMaterial({ color: chordColor, transparent: true, opacity: chordOpacity, depthWrite: false, linewidth: chordWidth })
    ),
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(chain.links.map(() => new THREE.Vector3()).concat(
        [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
      )),
      new THREE.LineBasicMaterial({ color: chordColor, transparent: true, opacity: chordOpacity, depthWrite: false, linewidth: chordWidth })
    )
  ]
  chords.forEach((chord) => {
    chord.frustumCulled = false
    group.add(chord)
  })
  syncRigidChainVisuals(chain, visuals)
  syncRigidChainChords(chain, chords)
  return { group, visuals, chords }
}

export function destroyRigidChainVisuals(visuals) {
  if (!visuals) return
  visuals.forEach((visual) => {
    visual.material?.map?.dispose?.()
    visual.material?.dispose?.()
  })
  visuals.length = 0
}

export function createParticleRopes({
  count = 6,
  particlesPerRope = 20,
  anchors = null,
  restLength = 0.18,
  stiffness = 0.80,
  width = 0.35,
  tailOffset = [0, 0, -0.95],
  gravity = -0.45,
  damping = 0.96,
  crossflowDamping = 0.35
} = {}) {
  const ropes = []
  const ropeCount = anchors?.length || count
  for (let r = 0; r < ropeCount; r += 1) {
    const t = ropeCount > 1 ? (r / (ropeCount - 1)) - 0.5 : 0
    const localAnchor = anchors?.[r] || [t * width + tailOffset[0], tailOffset[1], tailOffset[2]]
    const particles = []
    for (let p = 0; p < particlesPerRope; p += 1) {
      const z = localAnchor[2] - p * restLength
      particles.push({
        x: localAnchor[0],
        y: localAnchor[1],
        z,
        prevX: localAnchor[0],
        prevY: localAnchor[1],
        prevZ: z,
        pinned: p === 0
      })
    }
    ropes.push({
      localAnchor,
      particles
    })
  }
  return {
    ropes,
    count: ropeCount,
    particlesPerRope,
    restLength,
    stiffness,
    gravity,
    damping,
    crossflowDamping,
    initialized: false
  }
}

export function stepParticleRopes(system, planePos, planeQuat, dt = 1 / 60, elapsed = 0) {
  const { ropes, particlesPerRope, restLength, stiffness, gravity, damping = 0.96, crossflowDamping = 0.35 } = system
  const px = planePos.x
  const py = planePos.y
  const pz = planePos.z
  const qx = planeQuat.x
  const qy = planeQuat.y
  const qz = planeQuat.z
  const qw = planeQuat.w

  for (let r = 0; r < ropes.length; r += 1) {
    const rope = ropes[r]
    const pts = rope.particles
    const [lx, ly, lz] = rope.localAnchor

    // Rotate localAnchor by plane quaternion: v' = q * v * q^-1
    const ix = qw * lx + qy * lz - qz * ly
    const iy = qw * ly + qz * lx - qx * lz
    const iz = qw * lz + qx * ly - qy * lx
    const iw = -qx * lx - qy * ly - qz * lz

    const worldAnchorX = px + ix * qw + iw * -qx + iy * -qz - iz * -qy
    const worldAnchorY = py + iy * qw + iw * -qy + iz * -qx - ix * -qz
    const worldAnchorZ = pz + iz * qw + iw * -qz + ix * -qy - iy * -qx

    if (!system.initialized) {
      // Place the complete rope in world space before the first simulation step.
      // This prevents a local-space spawn from snapping to the moving plane.
      const dx = -2 * (qx * qz + qy * qw)
      const dy = -2 * (qy * qz - qx * qw)
      const dz = -(1 - 2 * (qx * qx + qy * qy))
      for (let p = 0; p < particlesPerRope; p += 1) {
        const particle = pts[p]
        particle.x = worldAnchorX + dx * p * restLength
        particle.y = worldAnchorY + dy * p * restLength
        particle.z = worldAnchorZ + dz * p * restLength
        particle.prevX = particle.x
        particle.prevY = particle.y
        particle.prevZ = particle.z
      }
    }

    // Pin head particle to plane wing end
    pts[0].x = worldAnchorX
    pts[0].y = worldAnchorY
    pts[0].z = worldAnchorZ

    // Verlet integration with aerodynamic crossflow drag and propwash flutter
    for (let p = 1; p < particlesPerRope; p += 1) {
      const pt = pts[p]
      const prevPt = pts[p - 1]

      const vx = pt.x - pt.prevX
      const vy = pt.y - pt.prevY
      const vz = pt.z - pt.prevZ

      // Segment tangent orientation along the rope
      let tx = pt.x - prevPt.x
      let ty = pt.y - prevPt.y
      let tz = pt.z - prevPt.z
      const tLen = Math.hypot(tx, ty, tz) || 1
      tx /= tLen
      ty /= tLen
      tz /= tLen

      // Decompose velocity into tangential (along rope) and crossflow (perpendicular to rope)
      const vDotT = vx * tx + vy * ty + vz * tz
      const vPerpX = vx - vDotT * tx
      const vPerpY = vy - vDotT * ty
      const vPerpZ = vz - vDotT * tz

      // Anisotropic aerodynamic drag:
      // Heavy crossflow air resistance holds the rope in the flight wake, curving naturally on turns.
      // Low tangential resistance lets the rope slide smoothly along its length.
      const newVx = vDotT * tx * damping + vPerpX * crossflowDamping
      const newVy = vDotT * ty * damping + vPerpY * crossflowDamping
      const newVz = vDotT * tz * damping + vPerpZ * crossflowDamping

      pt.prevX = pt.x
      pt.prevY = pt.y
      pt.prevZ = pt.z

      const flutter = Math.sin(elapsed * 15 + p * 0.6 + r * 1.2) * 0.012

      pt.x += newVx + flutter * dt
      pt.y += newVy + gravity * dt * dt
      pt.z += newVz
    }

    // Unilateral tension-only distance spring relaxation
    // A flexible rope only pulls when stretched (dist > restLength), allowing natural curves and folds
    for (let iter = 0; iter < 4; iter += 1) {
      for (let p = 0; p < particlesPerRope - 1; p += 1) {
        const p1 = pts[p]
        const p2 = pts[p + 1]
        const dx = p2.x - p1.x
        const dy = p2.y - p1.y
        const dz = p2.z - p1.z
        const dist = Math.hypot(dx, dy, dz) || 0.0001
        if (dist > restLength) {
          const factor = ((dist - restLength) / dist) * stiffness
          if (p === 0) {
            p2.x -= dx * factor
            p2.y -= dy * factor
            p2.z -= dz * factor
          } else {
            p1.x += dx * factor * 0.2
            p1.y += dy * factor * 0.2
            p1.z += dz * factor * 0.2
            p2.x -= dx * factor * 0.8
            p2.y -= dy * factor * 0.8
            p2.z -= dz * factor * 0.8
          }
        }
      }
    }
  }
  system.initialized = true
}

export function destroyParticleRopes(system) {
  if (!system) return
  system.ropes.length = 0
}

export function createCannonRopes({
  CANNON,
  world,
  count = 7,
  particlesPerRope = 20,
  anchors = null,
  restLength = 0.18,
  width = 0.35,
  tailOffset = [0, 0, -0.95],
  particleMass = 0.005,
  endMass = 0.004,
  linearDamping = 0.20
} = {}) {
  const ropes = []
  const ropeCount = anchors?.length || count
  for (let r = 0; r < ropeCount; r += 1) {
    const t = ropeCount > 1 ? (r / (ropeCount - 1)) - 0.5 : 0
    const localAnchor = anchors?.[r] || [t * width + tailOffset[0], tailOffset[1], tailOffset[2]]
    const bodies = []
    const constraints = []

    for (let p = 0; p < particlesPerRope; p += 1) {
      const isLeader = p === 0
      const body = new CANNON.Body({
        type: isLeader ? CANNON.Body.KINEMATIC : CANNON.Body.DYNAMIC,
        mass: isLeader ? 0 : particleMass + (p === particlesPerRope - 1 ? endMass : 0),
        linearDamping,
        position: new CANNON.Vec3(localAnchor[0], localAnchor[1], localAnchor[2] - p * restLength)
      })
      world.addBody(body)
      bodies.push(body)

      if (p > 0) {
        const constraint = new CANNON.DistanceConstraint(bodies[p - 1], body, restLength)
        world.addConstraint(constraint)
        constraints.push(constraint)
      }
    }

    ropes.push({
      localAnchor,
      bodies,
      constraints
    })
  }

  return {
    ropes,
    count: ropeCount,
    particlesPerRope,
    restLength,
    world,
    initialized: false
  }
}

export function stepCannonRopes(system, planePos, planeQuat) {
  const { ropes } = system
  const px = planePos.x
  const py = planePos.y
  const pz = planePos.z
  const qx = planeQuat.x
  const qy = planeQuat.y
  const qz = planeQuat.z
  const qw = planeQuat.w

  for (let r = 0; r < ropes.length; r += 1) {
    const rope = ropes[r]
    const [lx, ly, lz] = rope.localAnchor

    // Rotate localAnchor by plane quaternion: v' = q * v * q^-1
    const ix = qw * lx + qy * lz - qz * ly
    const iy = qw * ly + qz * lx - qx * lz
    const iz = qw * lz + qx * ly - qy * lx
    const iw = -qx * lx - qy * ly - qz * lz

    const worldAnchorX = px + ix * qw + iw * -qx + iy * -qz - iz * -qy
    const worldAnchorY = py + iy * qw + iw * -qy + iz * -qx - ix * -qz
    const worldAnchorZ = pz + iz * qw + iw * -qz + ix * -qy - iy * -qx

    if (!system.initialized) {
      const dx = -2 * (qx * qz + qy * qw)
      const dy = -2 * (qy * qz - qx * qw)
      const dz = -(1 - 2 * (qx * qx + qy * qy))
      for (let p = 0; p < rope.bodies.length; p += 1) {
        const body = rope.bodies[p]
        body.position.set(
          worldAnchorX + dx * p * system.restLength,
          worldAnchorY + dy * p * system.restLength,
          worldAnchorZ + dz * p * system.restLength
        )
        body.previousPosition.copy(body.position)
        body.interpolatedPosition.copy(body.position)
        body.quaternion.set(qx, qy, qz, qw)
      }
    } else {
      // Pin kinematic head body to plane wing end before world.step().
      rope.bodies[0].position.set(worldAnchorX, worldAnchorY, worldAnchorZ)
    }
  }
  system.initialized = true
}

export function destroyCannonRopes(system, world) {
  if (!system) return
  const targetWorld = world || system.world
  if (targetWorld) {
    for (let r = 0; r < system.ropes.length; r += 1) {
      const rope = system.ropes[r]
      rope.constraints.forEach((c) => targetWorld.removeConstraint(c))
      rope.bodies.forEach((b) => targetWorld.removeBody(b))
    }
  }
  system.ropes.length = 0
}
