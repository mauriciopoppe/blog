import React, { useState } from 'react'
import { useMouseState, useWindowScroll } from 'beautiful-react-hooks'
import { scaleLinear } from 'd3-scale'

import { Hill } from './Hill'
import { Plane } from './Plane'
import { t } from '../../main/colors'
import { randomBetween, gtagEvents } from './utils'

export function Canvas({ target, width, height, x, y }) {
  const [scrollY, setScrollY] = useState(window.scrollY)
  /**
   * Represents how much we've scrolled inside the footer as a number in the range [0, 1]
   *
   * - Compute where the scroll watcher should start = (scroll height - height)
   * - Subtract the current scroll from where the scroll watcher starts
   * - Normalize into a number number in the range [0, 1]
   *
   * @type {number}
   */
  const scrollT = (scrollY - (document.documentElement.scrollHeight - window.innerHeight - height)) / height

  // gtag custom event
  if (scrollT > 0.8 && !gtagEvents.footerAnimation.firedOnce) {
    // eslint-disable-next-line no-undef
    gtag('event', 'footer_animation')
    gtagEvents.footerAnimation.firedOnce = true
  }

  useWindowScroll((e) => setScrollY(window.scrollY))

  const { clientX, clientY } = useMouseState()
  const [stars] = useState(() => {
    return [...Array(50).keys()].map((i) => {
      const cx = randomBetween(0, width)
      const cy = randomBetween(height * 0.5, height)
      const cr = Math.random() * 2
      return {
        cx,
        cy,
        cr
      }
    })
  })

  function renderHills(n) {
    return (
      <>
        {[...Array(n).keys()].map((i) => {
          const alpha = 0.5
          const k = 0 + (i / n) * 0.75
          return (
            <Hill
              key={i}
              order={i}
              x={x}
              y={y}
              canvasWidth={width}
              canvasHeight={height}
              depth={i}
              total={n}
              scrollT={scrollT}
              mouseX={clientX}
              mouseY={clientY}
              fill={t(k)}
            />
          )
        })}
      </>
    )
  }

  function renderStars() {
    return (
      <>
        {stars.map(({ cx, cy, cr }, i) => {
          return <circle key={i} cx={x(cx)} cy={y(cy)} r={cr + Math.random()} style={{ fill: 'var(--link)' }} />
        })}
      </>
    )
  }

  return (
    <div>
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: scrollT,
          left: 0,
          top: 0
        }}
        preserveAspectRatio="none"
      >
        {renderStars()}
        {renderHills(10)}
        <Plane />
      </svg>
    </div>
  )
}
