import React, { useState } from 'react'
import { animated, useSpring } from '@react-spring/web'

const AnimFeTurbulence = animated('feTurbulence')
const AnimFeDisplacementMap = animated('feDisplacementMap')

function genTree() {
  return `M   0  0
        h 500
        V 100
        h -500
        Z`
}

export function Plane(props) {
  const [open, toggle] = useState(false)

  const to = []
  for (let i = 0; i < 50; i += 1) {
    const randFreq = () => {
      const a = 0.25 + Math.random() * 0.1
      const b = 0 + Math.random() * 0.1
      return `${a}, ${b}`
    }
    to.push(
      { scale: 10, opacity: 1, transform: 'scale(1)', freq: `${randFreq()}` },
      { scale: 10, opacity: 1, transform: 'scale(1)', freq: `${randFreq()}` }
    )
  }

  const { freq, scale, transform, opacity } = useSpring({
    from: { scale: 10, opacity: 1, transform: 'scale(1)', freq: '0.0275, 0.0' },
    to: to,
    config: { duration: 50000 }
  })

  return (
    <>
      <defs>
        <filter id="water" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
          <feFlood floodColor="#EB0066" floodOpacity=".9" />
          <AnimFeTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="1.5" result="TURB" seed="8" />
          <AnimFeDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            in="SourceGraphic"
            in2="TURB"
            result="DISP"
            scale={scale}
          />
        </filter>
      </defs>

      <animated.g filter="url(#water)" style={{ transform, opacity }}>
        <animated.path
          transform={'translate(100 100)'}
          stroke={'var(--primary)'}
          d={genTree()}
          onClick={() => {
            console.log('clicked!')
            toggle(!open)
          }}
        />
      </animated.g>
    </>
  )
}
