import React from 'react'
import { area, curveBasis } from 'd3-shape'
import { select } from 'd3-selection'
import styled, { keyframes, css } from 'styled-components'

const move = keyframes`
  from {
    transform: translate3D(0, 0, 0);
  }
  to {
    transform: translate3D(100px, 0, 0);
  }
`

const media = {
  handheld: (...args) => css`
    @media (max-width: 420px) {
      ${css(...args)}
    }
  `
}

const Path = styled.path``

export class Hill extends React.Component {
  constructor(props) {
    super(props)
    const { x, y, total, depth, scrollX, scrollY, order } = props
    const subhills = 10
    const step = window.innerWidth / subhills
    const seed = [...Array(subhills + 4).keys()].map(i => i - 1)
    this.data = seed.map(sx => ({
      x: x(sx * step),
      y: y(Math.random() * 300 - (depth * 20))
    }))

    this.l = area()
      .x(d => d.x)
      .y0(d => d.y - this.scrollOverLast(d))
      .y1(d => y(0))
      .curve(curveBasis)
  }

  computeLine () {
    return this.l(this.data)
  }

  scrollOverLast () {
    const current = Math.max(0, (this.props.scrollPosition.y + window.innerHeight) - document.body.scrollHeight + 500)
    return current * 0.15 * (this.props.total - this.props.order) / this.props.total * 2
  }

  render () {
    return (
      <Path
        depth={this.props.depth}
        innerRef={path => { this.path = select(path) }}
        d={this.computeLine()}
        fill={this.props.fill}
      />
    )
  }
}
