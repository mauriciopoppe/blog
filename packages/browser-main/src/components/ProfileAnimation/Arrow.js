import React from 'react'
import ArrowSvg from './arrow.svg'

export class Arrow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      transform: ''
    }
  }

  computePath () {
    const el = document.getElementById(ArrowSvg.id).querySelector('path')
    return el.getAttribute('d')
  }

  computeTransform () {
    const { arrow, x, y } = this.props
    const xDomain = x.domain()
    if (arrow.p.x < xDomain[0] ||
      arrow.p.x > xDomain[1] ||
      arrow.p.y < 0) {
      this.props.onArrowOutOfBounds(arrow)
    }
    const translate = `translate(${x(arrow.p.x)}, ${y(arrow.p.y)})`
    const scale = `scale(0.3)`
    const rotate = `rotate(${this.getAngle()})`
    return `${translate} ${scale} ${rotate}`
  }

  getAngle () {
    const { arrow } = this.props
    let angle = -arrow.getAngle()
    if (arrow.v.x < 0) {
      angle -= 180
    }
    return angle
  }

  componentDidMount () {
    const self = this
    function animation () {
      self.rafId = window.requestAnimationFrame(animation)
      self.setState({
        transform: self.computeTransform()
      })
    }
    self.rafId = window.requestAnimationFrame(animation)
  }

  componentWillUnmount () {
    window.cancelAnimationFrame(this.rafId)
  }

  render () {
    return (
      <path
        d={this.computePath()}
        transform={this.state.transform}
        fill='black'
        stroke='black'
        width={400}
        height={100}
      />
    )
  }
}
