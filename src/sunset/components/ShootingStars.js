import React, { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'

export function ShootingStars({ width, height, x, y }) {
  const [counter, setCounter] = useState(0)
  const [shootingStarProps, set] = useSpring(() => ({
    cx: 0,
    cy: 0
  }))

  useEffect(() => {
    setTimeout(() => {
      set({ cx: x(Math.random() * width), cy: y(Math.random() * height), r: 0 })
      setCounter(counter + 1)
    }, 3000)
  }, [set, width, height, counter])

  return (
    <g>
      <animated.circle {...shootingStarProps} style={{ fill: 'var(--primary)' }} />
    </g>
  )
}
