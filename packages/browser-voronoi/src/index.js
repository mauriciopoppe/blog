import { select } from 'd3-selection'
import { Delaunay } from 'd3-delaunay'
import { t } from '@blog/browser-main'
const d3 = { select, Delaunay }

export function generate({ target, n }) {
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
  const particles = Array.from({ length: n }, () => [
    Math.random() * width,
    Math.random() * height,
  ])

  function update() {
    const delaunay = d3.Delaunay.from(particles)
    const voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5])
    context.clearRect(0, 0, width, height)

    // render colors based on t
    // context.beginPath()
    for (let i = 0; i < n; i += 1) {
      context.beginPath()
      // map x, y to [0, 1]
      const [x, y] = particles[i]
      const dx = x / width
      const dy = y / height
      let dist = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2)

      // magic numbers to select what colors should be displayed
      dist = 0.1 + dist * 0.5
      context.fillStyle = t(dist)
      voronoi.renderCell(i, context)
      context.fill()
    }

    context.beginPath()
    delaunay.renderPoints(context)
    context.fill()
  }

  context.canvas.ontouchmove = context.canvas.onmousemove = (event) => {
    event.preventDefault()
    particles[0] = [event.layerX, event.layerY]
    update()
  }

  update()
}
