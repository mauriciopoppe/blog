import React, { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from 'react-three-fiber'

import useStore from './store'

function Terrain(props) {
  const { terrainGeometry, terrainMaterial } = useStore((state) => state.mutation)

  const mesh = useRef()
  return <mesh {...props} ref={mesh} geometry={terrainGeometry} material={terrainMaterial} />
}

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement }
  } = useThree()

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef()
  useFrame((state) => controls.current.update())
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={false}
      maxPolarAngle={Math.PI}
      minPolarAngle={0}
    />
  )
}

export function Scene() {
  const { fov } = useStore((state) => state.mutation)
  const actions = useStore((state) => state.actions)

  return (
    <Canvas
      camera={{ near: 0.01, far: 10000 }}
      onCreated={({ gl, camera }) => {
        actions.init(camera)
      }}
    >
      <CameraControls />
      {/*<axesHelper args={[1]} />*/}
      {/*<gridHelper args={[10, 10]} />*/}
      <pointLight position={[0, 0, 0]} />

      {/*<ambientLight />*/}
      <Terrain position={[0, -100, 0]} />
    </Canvas>
  )
}
