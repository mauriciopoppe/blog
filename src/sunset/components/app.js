import React from 'react'
import ReactDOM from 'react-dom'
import { scaleLinear } from 'd3-scale'

import { Canvas } from './Canvas'

export function render(opts = {}) {
  const width = window.innerWidth
  const height = opts.target.getBoundingClientRect().height

  const x = scaleLinear().domain([0, width]).range([0, width])
  const y = scaleLinear().domain([0, height]).range([height, 0])

  ReactDOM.render(<Canvas target={opts.target} width={width} height={height} x={x} y={y} />, opts.target)
}
