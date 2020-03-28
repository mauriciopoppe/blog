import React, { useEffect, useState, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import { area, curveBasis } from 'd3-shape'
import { Delaunay } from 'd3-delaunay'
import { t } from '../../main'

function generateParticles(props) {
  const { x, y, depth, width, height, nParticles } = props
  const subhills = 10
  const step = width / subhills
  const seed = [...Array(subhills + 1).keys()]
  // prettier-ignore
  let bounds = seed.map((sx) => ({
    x: x(sx * step),
    y: y(Math.random() * 300 - depth * 20)
  }))
  const randomPoints = []
  // sample some points inside the bounds
  for (let i = 0; i < nParticles; i += 1) {
    const cx = x(Math.random() * width)
    // find the lower bound in bounds
    let j = 0
    for (; j < bounds.length - 1; j += 1) {
      if (bounds[j].x < cx && cx < bounds[j + 1].x) break
    }
    let maxIter = 10
    while (maxIter--) {
      const cy = y(Math.random() * height)
      if (cy > bounds[j].y) {
        randomPoints.push({
          x: cx,
          y: cy
        })
        break
      }
    }
  }
  const corners = [
    { x: x(0), height: y(0) },
    { x: x(width), height: y(0) }
  ]
  const points = corners.concat(bounds).concat(randomPoints)
  return points
}

export function HillVoronoi(props) {
  const { x, y, total, depth, scrollY, mouseX } = props
  const { width, height } = document.querySelector('footer').getBoundingClientRect()
  // const [data] = useState(generateData(props))

  function scrollOverLast() {
    const current = Math.max(0, scrollY + window.innerHeight - document.body.scrollHeight + 500)
    return ((current * 0.15 * (props.total - props.order)) / props.total) * 2
  }

  const canvasRef = useRef(null)
  useEffect(function () {
    const context = canvasRef.current.getContext('2d')
    const scale = window.devicePixelRatio
    canvasRef.current.width = width * scale
    canvasRef.current.height = height * scale
    context.scale(scale, scale)

    function mapX(d) {
      // map to [-1, 1]
      const normalize = (mouseX / window.innerWidth - 0.5) * 2
      return d.x + normalize * props.order * 20
    }

    const mapY1 = (d) => y(0)
    const mapY0 = (d) => y(d.y - scrollOverLast(d))

    // prettier-ignore
    const l = area()
      .x(mapX)
      .y0(mapY0)
      .y1(mapY1)
      .curve(curveBasis)

    let particles = generateParticles({ x, y, l, depth, width, height, nParticles: 100 })
    particles = particles.map((p) => [p.x, p.y])

    function update() {
      const delaunay = Delaunay.from(particles)
      context.clearRect(0, 0, width, height)

      // render colors based on t
      // context.beginPath()
      for (let i = 0; i < delaunay.triangles.length; i += 1) {
        context.beginPath()
        // map x, y to [0, 1]
        // const [x, y] = particles[i]
        // const dx = x / width
        // const dy = y / height
        // let dist = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2)

        // magic numbers to select what colors should be displayed
        // dist = 0 + dist * 0.5
        context.fillStyle = t(depth / total)
        // context.fillStyle = '#ffffff'
        delaunay.renderTriangle(i, context)
        context.fill()
      }

      context.beginPath()
      delaunay.renderPoints(context)
      context.fill()
    }
    update()
  }, [])

  const style = { width: width, height: height, position: 'absolute', top: 0, left: 0 }
  return <canvas ref={canvasRef} style={style} />
}
