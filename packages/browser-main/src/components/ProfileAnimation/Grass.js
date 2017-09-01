import React from 'react'
import GrassSvg from './grass.svg'

export class Grass extends React.Component {
  generateGrass () {
    const el = document.getElementById(GrassSvg.id).querySelector('path')
    return el.getAttribute('d')
  }

  render () {
    const translate = `translate(${Math.random() * window.innerWidth}, ${200 + 50 * Math.random()})`
    const scale = `scale(${Math.random() * 6 - 3}, 1.5)`
    const transform = `${translate} ${scale}`
    return (
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'block',
          left: 0,
          top: 0
        }}
        preserveAspectRatio='none'>
        <path
          d={this.generateGrass()}
          fill='green'
          transform={transform}
        />
      </svg>
    )
  }
}
