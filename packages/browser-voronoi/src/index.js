import { select } from 'd3-selection'
import { Delaunay } from 'd3-delaunay'

const d3 = { select, Delaunay }

export function generate ({ target, n }) {
  // canvas setup
  const { width, height } = target.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.style.position = 'absolute'
  canvas.style.top = 0
  canvas.style.left = 0
  target.insertBefore(canvas, target.firstChild)


  // voronoi setup
  const context = canvas.getContext('2d')
  const particles = Array.from(
    { length: n },
    () => [Math.random() * width, Math.random() * height]
  )

  function update () {
    const delaunay = d3.Delaunay.from(particles)
    const voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5])
    context.clearRect(0, 0, width, height)

    context.beginPath()
    delaunay.render(context)
    context.strokeStyle = '#272B30'
    context.stroke()

    context.beginPath()
    voronoi.render(context)
    voronoi.renderBounds(context)
    context.strokeStyle = '#272B30'
    context.stroke()

    context.beginPath()
    delaunay.renderPoints(context)
    context.fill()
  }

  context.canvas.ontouchmove =
  context.canvas.onmousemove = event => {
    event.preventDefault()
    particles[0] = [event.layerX, event.layerY]
    update()
  }

  update()
}
