import { select } from 'd3-selection'
import { Delaunay } from 'd3-delaunay'
const { interpolateLab } = require('d3-interpolate')

import { t } from '../main/colors'
const d3 = { select, Delaunay }

export function generate({ target, n }) {
  // canvas setup
  const { width, height } = target.getBoundingClientRect()
  const scale = window.devicePixelRatio
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.style.position = 'absolute'
  canvas.style.top = 0
  canvas.style.left = 0
  target.insertBefore(canvas, target.firstChild)
  const context = canvas.getContext('2d')
  context.scale(scale, scale)

  const animationStart = performance.now()

  // voronoi setup
  const particles = Array.from({ length: n }, () => [Math.random() * width, Math.random() * height])
  let delaunay, voronoi
  const lastTouched = {}
  const fadeOutTime = 2000

  function tick(time) {
    requestAnimationFrame(tick)

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
      // dist = 0 + dist * 0.5
      context.fillStyle = t(1 - dist)
      if (lastTouched[i]) {
        if (time - lastTouched[i] < fadeOutTime) {
          context.fillStyle = interpolateLab(t(dist), t(1 - dist))((time - lastTouched[i]) / fadeOutTime)
        } else {
          delete lastTouched[i]
        }
      }
      voronoi.renderCell(i, context)
      context.fill()
    }
    context.beginPath()
    delaunay.renderPoints(context)
    context.fill()
  }

  function update() {
    // requestAnimationFrame(update)
    delaunay = d3.Delaunay.from(particles)
    voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5])
  }

  context.canvas.ontouchmove = context.canvas.onmousemove = (event) => {
    event.preventDefault()
    // particles[0] = [event.layerX, event.layerY]
    const closestPoint = delaunay.find(event.layerX, event.layerY)
    lastTouched[closestPoint] = performance.now() - animationStart
    update()
  }

  update()
  requestAnimationFrame(tick)
}
