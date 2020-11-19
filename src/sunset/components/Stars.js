import React, { useState } from 'react'
import { randomBetween } from './utils'

export function Stars({ n, width, height, x, y }) {
  const [stars] = useState(() => {
    return [...Array(n).keys()].map((i) => {
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

  return (
    <>
      {stars.map(({ cx, cy, cr }, i) => {
        return <circle key={i} cx={x(cx)} cy={y(cy)} r={cr + Math.random()} style={{ fill: 'var(--link)' }} />
      })}
    </>
  )
}
