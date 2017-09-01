import React from 'react'
import { area, curveBasis } from 'd3-shape'

export class Polygon extends React.PureComponent {
  computeLine () {
    const { x, y, depth } = this.props
    const n = 10
    const seed = [...Array(n + 1).keys()]
    const data = seed.map(sx => ({
      x: x(sx * window.innerWidth / n),
      y: y(Math.random() * 300 - (depth * 20))
    }))
    // data.unshift({ x: 0, y: 500 })
    // data.push({ x: n + 1, y: 500 })
    const l = area()
      .x(d => d.x)
      .y0(d => d.y)
      .y1(d => 500)
      .curve(curveBasis)
    return l(data)
  }

  render () {
    return (
      <path
        d={this.computeLine()}
        {...this.props}
       />
    )
  }
}
