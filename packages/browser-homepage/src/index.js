import { mat4 } from 'gl-matrix'
// import hsv2rgb from 'hsv2rgb'
// import Regl from 'regl'
// import Floor from './floor'
// import Bunny from './bunny'

const regl = require('regl')({
  container: document.querySelector('#background')
})

const Bunny = require('./bunny').default(regl)
const Floor = require('./floor').default(regl)

// setup

// objects

const bunny = new Bunny({
  center: [0, 0, 0]
})
const floor = new Floor()

regl.frame(({ tick, viewportWidth, viewportHeight }) => {
  const t = tick * 0.01

  regl.clear({
    depth: 1,
    color: [0, 0, 0, 1]
  })

  // tick view
  const view = mat4.lookAt([],
    [Math.cos(t) * 20, 2.5, Math.sin(t) * 20],
    [0, 2.5, 0],
    [0, 1, 0]
  )

  const projection = mat4.perspective([],
    Math.PI / 4,
    viewportWidth / viewportHeight,
    0.01,
    1000.0
  )

  bunny.center = [Math.cos(t) * 10, Math.sin(t) * 10, 0]
  bunny.draw({ view, projection })
  floor.draw({ view, projection })
})
