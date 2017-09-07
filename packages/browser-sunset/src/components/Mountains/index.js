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

const Path = styled.path`
  animation: ${move} ${props => 1 / (props.depth + 1) * 5 + 10}s ease-in-out infinite alternate;
  ${media.handheld`
    animation: initial;
  `}
`

export class Mountains extends React.PureComponent {
  constructor (props) {
    super(props)
    this.tick = null
  }

  computeLine () {
    const { x, y, depth } = this.props
    const n = 10
    const step = window.innerWidth / n
    const seed = [...Array(n + 4).keys()].map(i => i - 1)
    const data = seed.map(sx => ({
      x: x(sx * step),
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
      <Path
        depth={this.props.depth}
        innerRef={path => { this.path = select(path) }}
        d={this.computeLine()}
        fill={this.props.fill}
      />
    )
  }
}
