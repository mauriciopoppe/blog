import React from 'react'
import { interpolateMagma, scaleLinear } from 'd3-scale'

import { Mountains } from './components/Mountains/'

const x = scaleLinear()
  .domain([0, window.innerWidth])
  .range([0, window.innerWidth])
const y = scaleLinear()
  .domain([0, 500])
  .range([500, 0])

class App extends React.Component {
  render () {
    const style = { width: '100%', height: '100%' }
    return (
      <div ref={el => { this.el = el }} style={style}>
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
            <Mountains
              key={i}
              x={x}
              y={y}
              depth={i}
              fill={interpolateMagma(1 - (0.3 + (i / 5) * 0.5))}
            />
          ))}
        </svg>
      </div>
    )
  }
}

export default App
