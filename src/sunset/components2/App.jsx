import React, { Suspense, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'

import { Stars, Plane } from './Models.jsx'
// import Plane from './Plane.jsx'

export function render({ target }) {
  // const { width, height } = target.getBoundingClientRect()
  const root = createRoot(target)
  root.render(<App target={target} />)
}

export default function App(props) {
  const plane = useRef()

  return (
    <Canvas frameloop="demand" camera={{ position: [0, 0, 10] }}>
      <RenderController target={props.target} />
      <Lights />

      {/*<Sky
        distance={3000}
        turbidity={8}
        rayleigh={6}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0}
        azimuth={0.25}
      />*/}

      <Suspense fallback={null}>
        <Stars />
        <Plane position={[-15, 0, 0]} />
      </Suspense>

      <EffectComposer multisampling={1}>
        <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.3} />
      </EffectComposer>

      <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={0.1} />
    </Canvas>
  )
}

function RenderController(props) {
  // grab the canvas
  props.target.style.cursor = "grab"

  // run the event loop only if the footer is visible
  const [pause, setPause] = useState(null)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      setPause(!entry.isIntersecting)
    })
  })
  observer.observe(props.target)

  useFrame(({ gl, scene, camera, invalidate }) => {
    if (pause) return

    invalidate()
    gl.render(scene, camera)
  }, 1)

  return null
}

function Lights() {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[20, 30, 10]} />
      <pointLight position={[-10, -10, -10]} color="blue" />
    </>
  )
}
