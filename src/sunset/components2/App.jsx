import React, { Suspense, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import { theme } from '../../main/colors.js'
import { Stars, Plane, Moon, Ground } from './Models.jsx'
// import Plane from './Plane.jsx'

export function render({ target }) {
  // const { width, height } = target.getBoundingClientRect()
  const root = createRoot(target)
  root.render(<App target={target} />)
}

export default function App(props) {
  const moon = [10, 10, -50]

  return (
    <Canvas frameloop="demand" camera={{ position: [0, 5, 10] }}>
      <RenderController target={props.target} />
      <Lights moon={moon} />

      {/* <Sky
        distance={3000}
        turbidity={8}
        rayleigh={6}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0}
        azimuth={0.25}
      /> */}

      <Suspense fallback={null}>
        <Stars />
        <Moon position={moon} />
        <Plane position={[-5, 5, 0]} />
        <Ground />
      </Suspense>

      <EffectComposer multisampling={1}>
        <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.3} />
      </EffectComposer>

      <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={0.2} maxPolarAngle={Math.PI / 2 - 0.1} />
    </Canvas>
  )
}

/**
 * Captures internal state of gtag custom events
 * @type {object}
 */
const gtagEvents = {
  footerAnimation: {
    firedOnce: false
  }
}

function RenderController({ target }) {
  // grab the canvas
  target.style.cursor = 'grab'
  target.addEventListener('mousedown', () => {
    // eslint-disable-next-line no-undef
    if (!gtagEvents.footerAnimation.firedOnce) {
      window.gtag('event', 'footer_animation')
      gtagEvents.footerAnimation.firedOnce = true
    }
    target.style.cursor = 'grabbing'
  })
  target.addEventListener('mouseup', () => {
    target.style.cursor = 'grab'
  })

  // run the event loop only if the footer is visible
  const [pause, setPause] = useState(null)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      setPause(!entry.isIntersecting)
    })
  })
  observer.observe(target)

  useFrame(({ gl, scene, camera, invalidate }) => {
    if (pause) return

    invalidate()
    gl.render(scene, camera)
  }, 1)

  return null
}

function Lights(props) {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={props.moon} />
      <pointLight position={props.moon} color={theme.t(0)} />
    </>
  )
}
