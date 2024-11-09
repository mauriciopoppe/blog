import { DoubleSide } from 'three'
import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, MeshWobbleMaterial, Text, Points, PointMaterial } from '@react-three/drei'
import { theme } from '../../main/colors.ts'
import * as random from 'maath/random/dist/maath-random.esm'

export function Plane(props) {
  const wrapper = useRef()
  const plane = useRef()
  // eslint-disable-next-line
  const { scene, nodes, materials, animations } = useGLTF('/models/plane/scene.gltf')
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    actions.Main.play()
  }, [actions.Main])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    wrapper.current.position.z += delta

    // pitchMult is a multiplier to control how much delay there's on the current time
    const pitchMult = 1
    wrapper.current.position.y = Math.sin(t * pitchMult) * 0.5
    wrapper.current.rotation.x = Math.sin(t * pitchMult - Math.PI / 2) * 0.1
  })

  const flagRotation = [-Math.PI / 2, Math.PI / 2, 0]

  return (
    <group {...props}>
      {/* The rotation over y makes it face +x */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <group ref={wrapper}>
          <Flag rotation={flagRotation} position={[0, 0, -2.4]} />
          <Thanks scale={0.05} position={[0, 0, -7]} rotation={[0, (Math.PI * 3) / 2, 0]} />
          <primitive ref={plane} object={scene} />
        </group>
      </group>
    </group>
  )
}

export function Flag(props) {
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[0.3, 3, 10, 10]} />
        <MeshWobbleMaterial factor={1} speed={5} side={DoubleSide} />
      </mesh>
    </group>
  )
}

export function Thanks(props) {
  return (
    <Text
      color={theme.t(0)}
      fontSize={12}
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.01}
      textAlign="left"
      font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      anchorX="center"
      anchorY="middle"
      {...props}
    >
      Thanks for reading!
      <MeshWobbleMaterial factor={0.1} speed={1} side={DoubleSide} />
    </Text>
  )
}

export function Stars(props) {
  const ref = useRef()
  const [sphere] = useState(() => {
    const n = 1000
    const center = [0, 0, 0]
    const rng = new random.Generator(Math.random())
    const radius = 100
    const points = new Float32Array(n * 3)
    for (let i = 0; i < n; i += 1) {
      let x = rng.value() * 2 - 1
      let y = rng.value() * 2 - 1
      let z = rng.value() * 2 - 1

      const mag = Math.sqrt(x * x + y * y + z * z)

      x = x / mag
      y = y / mag
      z = z / mag

      points[i * 3] = x * radius + center[0]
      points[i * 3 + 1] = y * radius + center[1]
      points[i * 3 + 2] = z * radius + center[2]
    }
    return points
  })
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#ffa0e0" size={0.25} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  )
}

export function Ground() {
  const n = 200
  const [{ x, y, z }] = useState(() => {
    const g = new random.Generator(Math.random())
    const x = random.inRect(new Float32Array(n), { sides: 50 })
    const y = Array.from({ length: n }, () => g.value() * 5)
    const z = random.inRect(new Float32Array(n), { sides: 50 })
    return { x, y, z }
  })
  return (
    <group>
      <group>
        {new Array(n).fill(0).map((_, i) => {
          return (
            <mesh key={i} position={[x[i], 0, z[i]]}>
              <coneGeometry args={[5, y[i], 4 + Math.random() * 5]} />
              <meshLambertMaterial color="#212220" />
            </mesh>
          )
        })}
      </group>
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[100, 32]} />
          <meshLambertMaterial color="#212220" />
        </mesh>
      </group>
    </group>
  )
}

export function Moon(props) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}
