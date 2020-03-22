import React, { useState } from 'react'
import { useMouseState, useWindowScroll } from 'beautiful-react-hooks'
import { scaleLinear } from 'd3-scale'

import { Hill } from './Hill'
import { t } from './colors'

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
        {[...Array(n).keys()].map(i => {
          const alpha = 0.5
          return (
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
              fill={t(0.30 + i / n * 0.45)}
            />
          )
        })}
      </svg>
    </div>
  )
}
