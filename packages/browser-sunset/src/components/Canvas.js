import React, { useState } from 'react'
import { useMouseState, useWindowScroll } from 'beautiful-react-hooks'
import { interpolateMagma, scaleLinear } from 'd3-scale'

import { Hill } from './Hill'

const x = scaleLinear()
  .domain([0, window.innerWidth])
  .range([0, window.innerWidth])
const y = scaleLinear()
  .domain([0, 500])
  .range([500, 0])

export function Canvas () {
  const [scrollY, setScrollY] = useState(window.scrollY)
  const { clientX, clientY } = useMouseState()

  useWindowScroll(e => setScrollY(window.scrollY))

  const style = { width: '100%', height: '100%' }
  const n = 5
  return (
    <div style={style}>
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'block',
          left: 0,
          top: 0
        }}
        preserveAspectRatio='none'
      >
        {[...Array(n).keys()].map(i => (
          <Hill
            key={i}
            order={i}
            x={x}
            y={y}
            depth={i}
            total={n}
            scrollY={scrollY}
            mouseX={clientX}
            mouseY={clientY}
            fill={interpolateMagma(1 - (0.3 + (i / n) * 0.5))}
          />
        ))}
      </svg>
    </div>
  )
}
