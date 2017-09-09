import React from 'react'
import { Shape, Html, Timeline, Tween } from 'mo-js'
import { interpolateMagma, scaleLinear } from 'd3-scale'

import { Simulation, Entity, Vector } from './Engine'
import { Polygon } from './Polygon'
import { Arrow } from './Arrow'

const x = scaleLinear()
  .domain([0, window.innerWidth])
  .range([0, window.innerWidth])
const y = scaleLinear()
  .domain([0, 500])
  .range([500, 0])
const sleep = time => new Promise(resolve => setTimeout(resolve, time))
const retry = (fn, times) => {
  let n = 0
  const execPromise = () => fn()
  return new Promise(resolve => {
    let original = Promise.resolve()
    while (n++ < times) {
      original = original.then(execPromise)
    }
    original.then(resolve)
  })
}

class ProfileAnimation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      arrows: []
    }
  }

  componentDidMount () {
    this.setUpVariables()
    this.setUpEngine()
    this.startAnimation()
  }

  setUpVariables () {
    const targetPos = 0
    const targetOpts = {
      shape: 'circle',
      parent: this.el,
      x: { 0: window.innerWidth / 2 - 75 },
      y: { 0: targetPos },
      scaleX: 1,
      scaleY: 1.5,
      angle: 30
    }

    const borderOpts = {
      shape: 'rect',
      fill: 'black',
      parent: this.el,
      scaleX: 0.01,
      scaleY: 0
    }
    this.border = new Shape({
      ...borderOpts,
      x: { 0: window.innerWidth / 2 - 75 }
    })
      .then({
        scaleY: 4.5
      })
      .play()

    this.target = new Shape({
      ...targetOpts,
      fill: 'white',
      stroke: 'black',
      radius: {0: 25}
    })
    this.targetBlack = new Shape({
      ...targetOpts,
      fill: 'black',
      radius: {0: 20}
    })
    this.targetBlue = new Shape({
      ...targetOpts,
      fill: 'rgba(36, 123, 160, 1)',
      radius: {0: 15}
    })
    this.targetRed = new Shape({
      ...targetOpts,
      fill: 'rgba(242, 95, 92, 1)',
      radius: {0: 10}
    })
    this.targetYellow = new Shape({
      ...targetOpts,
      fill: 'rgba(255, 224, 102, 1)',
      radius: {0: 5}
    })

    this.arrowTimeline = new Timeline()
      .add(
        this.target,
        this.targetRed,
        this.targetYellow,
        this.targetBlack,
        this.targetBlue
      )
  }

  setUpEngine () {
    this.simulation = new Simulation()
    this.simulation.addGlobalForce(new Vector(0, -10))

    const self = this
    let date
    function animate (t) {
      window.requestAnimationFrame(animate)

      if (!date) date = Date.now()
      // make it run twice as fast
      const delta = (t - date) / 1000 * 8
      self.simulation.run(delta)
      date = t
    }

    window.requestAnimationFrame(animate)
  }

  startAnimation () {
    this.arrowTimeline.play()
  }

  throwArrow (e) {
    const footerRect = document.querySelector('footer.footer')
      .getBoundingClientRect()

    const entity = new Entity(1, 0, 0)
    entity.v = this.mouseDownVector.addVector(
      new Vector(x(e.clientX), y(e.clientY)).neg()
    )
    entity.p = new Vector(
      x(e.clientX - footerRect.left),
      y(e.clientY - footerRect.top)
    )
    this.simulation.addEntity(entity)

    this.setState({
      arrows: this.state.arrows.concat([entity])
    })
  }

  onArrowOutOfBounds (arrow) {
    const { arrows } = this.state
    arrows.splice(arrows.indexOf(arrow), 1)
    this.simulation.removeEntity(arrow)
    this.setState({
      arrows
    })
  }

  render () {
    const style = { width: '100%', height: '100%' }
    return (
      <div
        ref={el => { this.el = el }}
        onMouseDown={e => {
          this.mouseDownVector = new Vector(x(e.clientX), y(e.clientY))
        }}
        onClick={this.throwArrow.bind(this)}
        style={style}
      >
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'block',
            left: 0,
            top: 0
          }}
          preserveAspectRatio='none'
        >
          {[...Array(5).keys()].map(i => (
            <Polygon
              key={i}
              x={x}
              y={y}
              depth={i}
              fill={interpolateMagma(1 - (0.3 + (i / 5) * 0.5))}
            />
          ))}
          {this.state.arrows.map((arrow, i) => (
            <Arrow
              x={x}
              y={y}
              key={arrow.id}
              arrow={arrow}
              onArrowOutOfBounds={this.onArrowOutOfBounds.bind(this)}
            />
          ))}
        </svg>
      </div>
    )
  }
}

export default ProfileAnimation
