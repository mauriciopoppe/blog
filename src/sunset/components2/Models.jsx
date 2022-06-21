import { DoubleSide } from 'three'
import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, MeshWobbleMaterial, Text } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import { Points, PointMaterial } from '@react-three/drei'

export function Plane(props) {
  const wrapper = useRef()
  const plane = useRef()
  const { scene, nodes, materials, animations } = useGLTF('/models/plane/scene.gltf')
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    actions.Main.play()
  }, [])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    wrapper.current.position.z += delta

    // pitchMult is a multiplier to control how much delay there's on the current time
    const pitchMult = 1
    wrapper.current.position.y = Math.sin(t*pitchMult) * 0.5
    wrapper.current.rotation.x = Math.sin(t*pitchMult - Math.PI / 2) * 0.1
  })

  const flagRotation = [-Math.PI/2, Math.PI/2, 0]

  return (
    <group {...props}>
      {/* The rotation over y makes it face +x */}
      <group rotation={[0, Math.PI/2, 0]}>
        <group ref={wrapper}>
          <Flag rotation={flagRotation} position={[0, 0, -2.4]} />
          <Thanks
            scale={0.05}
            position={[0, 0, -7]}
            rotation={[0, Math.PI*3/2, 0]}
          />
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
      color={'#b82245'}
      fontSize={12}
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.01}
      textAlign={'left'}
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
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 100 }))
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#ffa0e0" size={0.25} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  )
}
