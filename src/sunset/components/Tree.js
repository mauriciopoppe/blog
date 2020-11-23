import React, { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { symbol, symbolTriangle } from 'd3-shape'

export function Tree({ px, py }) {
  // const [counter, setCounter] = useState(0)
  // const [shootingStarProps, set] = useSpring(() => ({
  //   cx: 0,
  //   cy: 0
  // }))
  //
  // useEffect(() => {
  //   setTimeout(() => {
  //     set({ cx: x(Math.random() * width), cy: y(Math.random() * height), r: 0 })
  //     setCounter(counter + 1)
  //   }, 3000)
  // }, [set, width, height, counter])

  return (
    <g transform={`translate(${px} ${py})`}>
      <animated.path transform={`translate(0 -128)`} d={symbol().size(128).type(symbolTriangle)()} />
      <animated.path transform={`translate(0 -64)`} d={symbol().size(128).type(symbolTriangle)()} />
      <animated.path transform={`translate(0 0)`} d={symbol().size(128).type(symbolTriangle)()} />
      <animated.circle r={3} />
    </g>
  )
}
