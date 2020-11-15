import React, { useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { area, curveBasis, curveLinear } from 'd3-shape'
import { randomBetween } from './utils'

function generateData(props) {
  const { x, y, depth, total } = props
  const subhills = 10
  const step = window.innerWidth / subhills
  const seed = [...Array(subhills + 4).keys()].map((i) => i - 1)
  const data = seed.map((sx) => {
    // controls at which height a hill should start
    const yBaselineBottom = props.canvasHeight * 0.1
    // controls the height from the bottom baseline and above
    const yHeightFromBottom = (1 - depth / total) * props.canvasHeight * 0.2
    const yBaselineHeight = yBaselineBottom + yHeightFromBottom

    // controls how much each hill moves up or down as noise
    const k = 100
    const yDiffRandom = randomBetween(-k, k)
    return {
      x: x(sx * step + step * randomBetween(-0.3, 0.3)),
      y: y(Math.max(yBaselineHeight + yDiffRandom, 0))
    }
  })
  return data
}

export function Hill(props) {
  const { y, mouseX } = props
  const [data] = useState(generateData(props))
  const l = area()
    .x(mapX)
    .y0((d) => d.y - scrollOverLast(d))
    .y1((d) => y(0))
    .curve(curveLinear)

  function mapX(d) {
    // map to [-1, 1]
    const normalize = (mouseX / window.innerWidth - 0.5) * 2
    return d.x + normalize * props.order * 10
  }

  function scrollOverLast(d) {
    const current = Math.max(0, props.scrollT * props.canvasHeight)
    // some math to perform the animation while scrolling down
    return (current * 0.2 * (props.total - props.order)) / props.total
  }

  return <animated.path depth={props.depth} d={l(data)} fill={props.fill} />
}
