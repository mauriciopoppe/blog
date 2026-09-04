import { describe, expect, test } from 'bun:test'
import { createChainState, stepChain } from './chain-engine.js'

const item = () => ({ position: { z: 0, y: 0 }, rotation: { x: 0, z: 0 } })

describe('Sunset chain engine', () => {
  test('syncRigidChainVisuals mirrors every Cannon link into its visual', async () => {
    const { syncRigidChainVisuals } = await import('./chain-engine.js')
    const chain = {
      links: [
        {
          position: { x: 1, y: 2, z: 3 },
          quaternion: { x: 0.1, y: 0.2, z: 0.3, w: 0.9 }
        },
        {
          position: { x: -4, y: 5, z: -6 },
          quaternion: { x: -0.1, y: -0.2, z: -0.3, w: 0.8 }
        }
      ]
    }
    const visuals = [
      { position: { set() {} }, quaternion: { set() {} } },
      { position: { set() {} }, quaternion: { set() {} } }
    ]
    visuals.forEach((visual) => {
      visual.position.set = (...values) => { visual.position.values = values }
      visual.quaternion.set = (...values) => { visual.quaternion.values = values }
    })

    syncRigidChainVisuals(chain, visuals)

    expect(visuals[0].position.values).toEqual([1, 2, 3])
    expect(visuals[0].quaternion.values).toEqual([0.1, 0.2, 0.3, 0.9])
    expect(visuals[1].position.values).toEqual([-4, 5, -6])
    expect(visuals[1].quaternion.values).toEqual([-0.1, -0.2, -0.3, 0.8])
  })

  test('syncRigidChainVisuals keeps upright visuals limited to the parent heading', async () => {
    const { syncRigidChainVisuals } = await import('./chain-engine.js')
    const visuals = [{
      userData: { upright: true },
      position: { set() {} },
      quaternion: { set(...values) { this.values = values } }
    }]
    syncRigidChainVisuals({
      links: [{
        position: { x: 0, y: 0, z: 0 },
        // 90 degrees of roll should not tilt an upright letter.
        quaternion: { x: Math.SQRT1_2, y: 0, z: 0, w: Math.SQRT1_2 }
      }]
    }, visuals)
    expect(visuals[0].quaternion.values).toEqual([0, 0, 0, 1])
  })

  test('syncRigidChainVisuals uses one shared heading for all upright visuals', async () => {
    const { syncRigidChainVisuals } = await import('./chain-engine.js')
    const visuals = [0, 1].map(() => ({
      userData: { upright: true },
      position: { set() {} },
      quaternion: { set(...values) { this.values = values } }
    }))
    syncRigidChainVisuals({
      links: [
        { position: { x: 0, y: 0, z: 0 }, quaternion: { x: 0, y: 0, z: 0, w: 1 } },
        { position: { x: 0, y: 0, z: 0 }, quaternion: { x: 0, y: 1, z: 0, w: 0 } }
      ]
    }, visuals, {
      headingQuaternion: { x: 0, y: Math.SQRT1_2, z: 0, w: Math.SQRT1_2 }
    })
    expect(visuals[0].quaternion.values[0]).toBeCloseTo(0)
    expect(visuals[0].quaternion.values[1]).toBeCloseTo(Math.SQRT1_2)
    expect(visuals[0].quaternion.values[2]).toBeCloseTo(0)
    expect(visuals[0].quaternion.values[3]).toBeCloseTo(Math.SQRT1_2)
    expect(visuals[1].quaternion.values).toEqual(visuals[0].quaternion.values)
  })

  test('syncRigidChainChords connects the top and bottom of every link', async () => {
    const { syncRigidChainChords } = await import('./chain-engine.js')
    const makeChord = () => {
      const points = []
      return {
        geometry: {
          attributes: {
            position: {
              setXYZ(index, x, y, z) { points[index] = [x, y, z] },
              needsUpdate: false
            }
          },
          computeBoundingSphere() {}
        },
        points
      }
    }
    const topChord = makeChord()
    const bottomChord = makeChord()
    syncRigidChainChords({
      links: [
        { position: { x: 1, y: 2, z: 3 } },
        { position: { x: 4, y: 5, z: 6 } }
      ]
    }, [topChord, bottomChord], { topOffset: 0.3, bottomOffset: -0.2 })

    expect(topChord.points).toEqual([[1, 2.3, 3], [4, 5.3, 6]])
    expect(bottomChord.points).toEqual([[1, 1.8, 3], [4, 4.8, 6]])
    expect(topChord.geometry.attributes.position.needsUpdate).toBe(true)
    expect(bottomChord.geometry.attributes.position.needsUpdate).toBe(true)
  })

  test('syncRigidChainChords extends both chords back to the plane tail', async () => {
    const { syncRigidChainChords } = await import('./chain-engine.js')
    const points = []
    const chord = {
      geometry: {
        attributes: {
          position: {
            setXYZ(index, x, y, z) { points[index] = [x, y, z] },
            needsUpdate: false
          }
        },
        computeBoundingSphere() {}
      }
    }
    syncRigidChainChords({
      links: [{ position: { x: 4, y: 2, z: 0 } }]
    }, [chord], { anchor: { x: 1, y: 2, z: 0 }, anchorSegments: 3 })

    expect(points).toEqual([[1, 2.24, 0], [2, 2.24, 0], [3, 2.24, 0], [4, 2.24, 0]])
  })

  test('rope systems accept explicit anchors for wing-end streamers', async () => {
    const { createParticleRopes, createCannonRopes, stepCannonRopes } = await import('./chain-engine.js')
    const anchors = [[-0.75, 0, 0], [0.75, 0, 0]]
    const particleRopes = createParticleRopes({ anchors, particlesPerRope: 4 })
    expect(particleRopes.ropes.map((rope) => rope.localAnchor)).toEqual(anchors)

    const CANNON = await import('../vendor/cannon-es.js')
    const world = new CANNON.World()
    const cannonRopes = createCannonRopes({ CANNON, world, anchors, particlesPerRope: 4 })
    expect(cannonRopes.ropes.map((rope) => rope.localAnchor)).toEqual(anchors)
    expect(cannonRopes.ropes[0].bodies[3].mass).toBeGreaterThan(cannonRopes.ropes[0].bodies[2].mass)

    stepCannonRopes(cannonRopes, { x: 0, y: 5, z: 45 }, { x: 0, y: 0, z: 0, w: 1 })
    cannonRopes.ropes.forEach((rope) => {
      for (let index = 1; index < rope.bodies.length; index += 1) {
        expect(rope.bodies[index].position.z).toBeCloseTo(45 - index * 0.18, 5)
      }
    })
  })

  test('wing streamer anchors provide multiple short ropes at both wing ends', async () => {
    const { createParticleRopes } = await import('./chain-engine.js')
    const anchors = [-0.12, -0.04, 0.04, 0.12].flatMap((y) => [[-0.75, y, 0], [0.75, y, 0]])
    const system = createParticleRopes({ anchors, particlesPerRope: 7, restLength: 0.15 })
    expect(system.count).toBe(8)
    expect(system.ropes.filter((rope) => rope.localAnchor[0] < 0)).toHaveLength(4)
    expect(system.ropes.filter((rope) => rope.localAnchor[0] > 0)).toHaveLength(4)
    expect((system.particlesPerRope - 1) * system.restLength).toBeCloseTo(0.9)
  })

  test('moves each link toward its independent target', () => {
    const items = [item(), item()]
    const states = createChainState(items)
    stepChain(states, [
      { z: 1, y: 0, rotationX: 0.5, rotationZ: 0 },
      { z: -1, y: 0, rotationX: -0.5, rotationZ: 0 }
    ], 0.1)
    expect(items[0].position.z).toBeGreaterThan(0)
    expect(items[1].position.z).toBeLessThan(0)
    expect(items[0].rotation.x).toBeGreaterThan(0)
    expect(items[1].rotation.x).toBeLessThan(0)
  })

  test('converges to targets after advancing many simulation steps', () => {
    const items = [item(), item()]
    const states = createChainState(items)
    const targets = [
      { z: 2, y: 0.5, rotationX: 0.4, rotationZ: 0.2 },
      { z: -1, y: -0.25, rotationX: -0.3, rotationZ: -0.15 }
    ]
    for (let step = 0; step < 180; step += 1) stepChain(states, targets, 1 / 60)
    expect(items[0].position.z).toBeCloseTo(2, 2)
    expect(items[0].position.y).toBeCloseTo(0.5, 2)
    expect(items[0].rotation.x).toBeCloseTo(0.4, 2)
    expect(items[1].position.z).toBeCloseTo(-1, 2)
    expect(items[1].rotation.z).toBeCloseTo(-0.15, 2)
  })

  test('keeps links independent while following a loop trajectory', () => {
    const items = [item(), item(), item()]
    const states = createChainState(items)
    for (let step = 0; step < 45; step += 1) {
      const progress = step / 45
      const targets = items.map((unused, index) => {
        const phase = Math.PI * progress - index * 0.25
        return {
          z: -index * 0.2,
          y: Math.sin(phase) * 2,
          rotationX: -phase,
          rotationZ: Math.sin(phase) * 0.3
        }
      })
      stepChain(states, targets, 1 / 60)
    }
    expect(items[0].position.y).not.toBeCloseTo(items[2].position.y, 2)
    expect(items[0].rotation.x).not.toBeCloseTo(items[2].rotation.x, 2)
    expect(items[1].position.z).toBeLessThan(items[0].position.z)
  })

  test('createRigidChain creates linked rigid bodies trailing the parent body', async () => {
    const CANNON = await import('../vendor/cannon-es.js')
    const { createRigidChain, updateRigidChainLeader, stepRigidChain, destroyRigidChain } = await import('./chain-engine.js')

    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) })
    const parent = new CANNON.Body({
      mass: 3,
      position: new CANNON.Vec3(0, 5, 0),
      velocity: new CANNON.Vec3(0, 0, 2.4)
    })
    parent.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.2, 1)))
    world.addBody(parent)

    const chain = createRigidChain({
      CANNON,
      world,
      parentBody: parent,
      count: 6,
      linkMass: 0.02,
      linkLength: 0.25,
      delayFrames: 3
    })

    expect(chain.links.length).toBe(6)
    expect(chain.constraints.length).toBe(5)
    expect(world.bodies.length).toBe(7)

    // Initial link positions should trail behind parent along -Z
    for (let i = 0; i < chain.links.length; i += 1) {
      expect(chain.links[i].position.z).toBeLessThan(parent.position.z)
      if (i > 0) {
        expect(chain.links[i].position.z).toBeLessThan(chain.links[i - 1].position.z)
      }
    }

    // Step physics: chain leader follows tail with delay, pulling links forward
    for (let step = 0; step < 60; step += 1) {
      parent.position.z += 2.4 * (1 / 60)
      const tailPos = parent.position.vadd(parent.quaternion.vmult(new CANNON.Vec3(0, 0, -0.95)))
      updateRigidChainLeader(chain, tailPos, parent.quaternion, parent.velocity)
      stepRigidChain(chain, 1 / 60)
      world.step(1 / 60)
    }

    expect(chain.links[0].position.z).toBeGreaterThan(-0.5)
    expect(chain.links[5].position.z).toBeGreaterThan(-2.0)

    // Consecutive links should stay at bounded distances
    for (let i = 1; i < chain.links.length; i += 1) {
      const dist = chain.links[i - 1].position.distanceTo(chain.links[i].position)
      expect(dist).toBeGreaterThan(0.15)
      expect(dist).toBeLessThan(0.40)
    }

    // Cleanup
    destroyRigidChain(chain, world)
    expect(chain.links.length).toBe(0)
    expect(chain.constraints.length).toBe(0)
    expect(world.bodies.length).toBe(1)
  })

  test('createRigidChain supports text banner with reversed trailing character order', async () => {
    const CANNON = await import('../vendor/cannon-es.js')
    const { createRigidChain, updateRigidChainLeader, stepRigidChain, destroyRigidChain } = await import('./chain-engine.js')
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) })
    const parent = new CANNON.Body({
      mass: 3,
      position: new CANNON.Vec3(0, 5, 0),
      velocity: new CANNON.Vec3(0, 0, 2.4)
    })
    world.addBody(parent)

    const text = 'Until the next idea!'
    const chain = createRigidChain({
      CANNON,
      world,
      parentBody: parent,
      text,
      linkMass: 0.012,
      linkLength: 0.28,
      delayFrames: 3
    })

    expect(chain.count).toBe(text.length)
    expect(chain.links.length).toBe(text.length)
    expect(chain.constraints.length).toBe(text.length - 1)
    // First body in chain corresponds to the last character in the sentence ('!')
    expect(chain.characters[0]).toBe('!')
    // Last body corresponds to first character ('U')
    expect(chain.characters[chain.characters.length - 1]).toBe('U')

    // Step simulation
    for (let step = 0; step < 30; step += 1) {
      parent.position.z += 2.4 * (1 / 60)
      const tailPos = parent.position.vadd(parent.quaternion.vmult(new CANNON.Vec3(0, 0, -0.95)))
      updateRigidChainLeader(chain, tailPos, parent.quaternion, parent.velocity)
      stepRigidChain(chain, 1 / 60)
      world.step(1 / 60)
    }

    // Leader body follows plane tail
    expect(chain.links[0].position.z).toBeGreaterThan(0)
    // Tail body ('U') trails behind
    expect(chain.links[chain.links.length - 1].position.z).toBeLessThan(chain.links[0].position.z)

    destroyRigidChain(chain, world)
    expect(chain.links.length).toBe(0)
  })

  test('a rigid chain leader starts at its configured tail offset', async () => {
    const CANNON = await import('../vendor/cannon-es.js')
    const { createRigidChain, updateRigidChainLeader } = await import('./chain-engine.js')
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) })
    const parent = new CANNON.Body({ position: new CANNON.Vec3(0, 0, 10) })
    world.addBody(parent)
    const chain = createRigidChain({ CANNON, world, parentBody: parent, text: 'Banner', tailOffset: [0, 0, -2] })
    const configuredTail = parent.position.vadd(new CANNON.Vec3(0, 0, -2))

    updateRigidChainLeader(chain, configuredTail, parent.quaternion, parent.velocity)

    expect(chain.links[0].position.z).toBeCloseTo(8, 5)
  })

  test('createParticleRopes and stepParticleRopes simulate independent spring ropes', async () => {
    const { createParticleRopes, stepParticleRopes, destroyParticleRopes } = await import('./chain-engine.js')
    const ropeSystem = createParticleRopes({
      count: 5,
      particlesPerRope: 12,
      restLength: 0.15,
      stiffness: 0.85,
      width: 0.30
    })

    expect(ropeSystem.ropes.length).toBe(5)
    expect(ropeSystem.ropes[0].particles.length).toBe(12)
    expect(ropeSystem.ropes[0].particles[0].pinned).toBe(true)
    expect(ropeSystem.ropes[0].particles[1].pinned).toBe(false)

    // Verify independent spacing across tail width
    expect(ropeSystem.ropes[0].localAnchor[0]).toBeLessThan(ropeSystem.ropes[4].localAnchor[0])

    // Step system forward
    const planePos = { x: 0, y: 5, z: 0 }
    const planeQuat = { x: 0, y: 0, z: 0, w: 1 }
    for (let step = 0; step < 60; step += 1) {
      planePos.z += 2.4 * (1 / 60)
      stepParticleRopes(ropeSystem, planePos, planeQuat, 1 / 60, step / 60)
    }

    // Heads should be pinned to plane tail
    expect(ropeSystem.ropes[0].particles[0].z).toBeCloseTo(planePos.z - 0.95, 1)
    expect(ropeSystem.ropes[4].particles[0].z).toBeCloseTo(planePos.z - 0.95, 1)

    // Tails should trail behind heads
    for (let r = 0; r < ropeSystem.ropes.length; r += 1) {
      const pts = ropeSystem.ropes[r].particles
      expect(pts[11].z).toBeLessThan(pts[0].z)
      // Springs keep distance between consecutive particles bounded
      for (let p = 0; p < pts.length - 1; p += 1) {
        const d = Math.hypot(pts[p + 1].x - pts[p].x, pts[p + 1].y - pts[p].y, pts[p + 1].z - pts[p].z)
        expect(d).toBeGreaterThan(0.08)
        expect(d).toBeLessThan(0.25)
      }
    }

    destroyParticleRopes(ropeSystem)
    expect(ropeSystem.ropes.length).toBe(0)
  })

  test('particle ropes curve into sweeping arcs during turns due to crossflow damping', async () => {
    const { createParticleRopes, stepParticleRopes } = await import('./chain-engine.js')
    const ropeSystem = createParticleRopes({
      count: 1,
      particlesPerRope: 20,
      restLength: 0.18,
      stiffness: 0.80,
      damping: 0.96,
      crossflowDamping: 0.35
    })

    // Simulate plane flying straight first to stabilize trailing ribbon
    const planePos = { x: 0, y: 5, z: 0 }
    let yaw = 0
    let planeQuat = { x: 0, y: Math.sin(yaw / 2), z: 0, w: Math.cos(yaw / 2) }
    const speed = 2.4
    const dt = 1 / 60

    for (let step = 0; step < 120; step += 1) {
      planePos.x += Math.sin(yaw) * speed * dt
      planePos.z += Math.cos(yaw) * speed * dt
      stepParticleRopes(ropeSystem, planePos, planeQuat, dt, step * dt)
    }

    // Now execute a sharp turn (yaw rate ~0.8 rad/s)
    const yawRate = 0.8
    for (let step = 0; step < 60; step += 1) {
      yaw += yawRate * dt
      planeQuat = { x: 0, y: Math.sin(yaw / 2), z: 0, w: Math.cos(yaw / 2) }
      planePos.x += Math.sin(yaw) * speed * dt
      planePos.z += Math.cos(yaw) * speed * dt
      stepParticleRopes(ropeSystem, planePos, planeQuat, dt, (120 + step) * dt)
    }

    const pts = ropeSystem.ropes[0].particles
    const head = pts[0]
    const tail = pts[pts.length - 1]

    // Compute maximum perpendicular deflection of interior particles from the chord line (head to tail)
    const chordX = tail.x - head.x
    const chordZ = tail.z - head.z
    const chordLen = Math.hypot(chordX, chordZ)
    expect(chordLen).toBeGreaterThan(1.0)

    let maxDeflection = 0
    for (let p = 1; p < pts.length - 1; p += 1) {
      const vx = pts[p].x - head.x
      const vz = pts[p].z - head.z
      // Perpendicular distance = |cross product| / chord length
      const dist = Math.abs(vx * chordZ - vz * chordX) / chordLen
      if (dist > maxDeflection) {
        maxDeflection = dist
      }
    }

    // Rope should clearly curve into an arc (deflection > 15 cm) instead of a straight line segment
    expect(maxDeflection).toBeGreaterThan(0.15)
  })

  test('createCannonRopes and stepCannonRopes simulate ropes via Cannon engine physics', async () => {
    const CANNON = await import('../vendor/cannon-es.js')
    const { createCannonRopes, stepCannonRopes, destroyCannonRopes } = await import('./chain-engine.js')

    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) })
    const ropeSystem = createCannonRopes({
      CANNON,
      world,
      count: 3,
      particlesPerRope: 15,
      restLength: 0.18,
      width: 0.35,
      particleMass: 0.005,
      linearDamping: 0.20
    })

    expect(ropeSystem.ropes.length).toBe(3)
    expect(ropeSystem.ropes[0].bodies.length).toBe(15)
    expect(ropeSystem.ropes[0].constraints.length).toBe(14)
    expect(ropeSystem.ropes[0].bodies[0].type).toBe(CANNON.Body.KINEMATIC)
    expect(ropeSystem.ropes[0].bodies[1].type).toBe(CANNON.Body.DYNAMIC)
    expect(ropeSystem.ropes[0].bodies[1].mass).toBeCloseTo(0.005, 4)
    expect(ropeSystem.ropes[0].bodies[14].mass).toBeCloseTo(0.009, 4)

    const planePos = new CANNON.Vec3(0, 5, 0)
    let yaw = 0
    const planeQuat = new CANNON.Quaternion()
    const speed = 2.4
    const dt = 1 / 60

    // Fly straight for 60 steps
    for (let s = 0; s < 60; s += 1) {
      planePos.z += speed * dt
      stepCannonRopes(ropeSystem, planePos, planeQuat)
      world.step(dt)
    }

    // Leader body should be pinned to plane tail
    expect(ropeSystem.ropes[0].bodies[0].position.z).toBeCloseTo(planePos.z - 0.95, 1)

    // Execute turn for 60 steps
    const yawRate = 0.8
    for (let s = 0; s < 60; s += 1) {
      yaw += yawRate * dt
      planeQuat.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), yaw)
      planePos.x += Math.sin(yaw) * speed * dt
      planePos.z += Math.cos(yaw) * speed * dt
      stepCannonRopes(ropeSystem, planePos, planeQuat)
      world.step(dt)
    }

    // Verify interior curvature
    const bodies = ropeSystem.ropes[0].bodies
    const head = bodies[0].position
    const tail = bodies[bodies.length - 1].position
    const chordX = tail.x - head.x
    const chordZ = tail.z - head.z
    const chordLen = Math.hypot(chordX, chordZ)
    expect(chordLen).toBeGreaterThan(1.0)

    let maxDeflection = 0
    for (let i = 1; i < bodies.length - 1; i += 1) {
      const vx = bodies[i].position.x - head.x
      const vz = bodies[i].position.z - head.z
      const dist = Math.abs(vx * chordZ - vz * chordX) / chordLen
      if (dist > maxDeflection) {
        maxDeflection = dist
      }
    }
    expect(maxDeflection).toBeGreaterThan(0.08)

    // Cleanup
    destroyCannonRopes(ropeSystem, world)
    expect(ropeSystem.ropes.length).toBe(0)
    expect(world.bodies.length).toBe(0)
  })
})
