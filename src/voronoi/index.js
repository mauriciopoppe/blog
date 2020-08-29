import { select } from 'd3-selection'
import { Delaunay } from 'd3-delaunay'
import { easeQuadInOut } from 'd3-ease'
import { interpolateLab } from 'd3-interpolate'

import { t, bannerColorChanger } from '../main/colors'
const d3 = { select, Delaunay }

export function generate({ target, n, rainbow }) {
  // canvas setup
  const { width, height } = target.getBoundingClientRect()
  const scale = window.devicePixelRatio
  /** @type HTMLCanvasElement */
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.style.position = 'absolute'
  canvas.style.top = '0px'
  canvas.style.left = '0px'
  target.insertBefore(canvas, target.firstChild)

  /** @type CanvasRenderingContext2D */
  const context = canvas.getContext('2d')
  context.scale(scale, scale)

  // voronoi setup
  const particles = Array.from({ length: n }, () => [Math.random() * width, Math.random() * height])
  let delaunay, voronoi, animationStart, animationLast
  let ref = { x: 0, y: 0 }

  /** @type {Object.<number, number>} */
  const lastTouched = {}
  const fadeOutTime = 2000

  function initialize() {
    // requestAnimationFrame(update)
    delaunay = d3.Delaunay.from(particles)
    voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5])
    animationStart = performance.now()
  }

  function rowAnimation() {
    const invertX = Math.random() < 0.5
    const invertY = Math.random() < 0.5
    for (let i = 0; i < n; i += 1) {
      const [x, y] = particles[i]
      const dx = invertX ? x / width : (width - x) / width
      const dy = invertY ? y / height : (height - y) / height
      let dist = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2)
      setTimeout(() => {
        lastTouched[i] = performance.now()
      }, easeQuadInOut(dist) * fadeOutTime)
    }
    return [invertX, invertY]
  }

  function perimeterAnimation(time, perimeterAnimationTime = 50000) {
    // move refs according to time
    const timeLeft = time % perimeterAnimationTime
    let ref
    /*
      map time to perimeter
     10000   =   2a + 2b
        x    =   ?
     */
    const perimeter = (timeLeft * (2 * width + 2 * height)) / perimeterAnimationTime
    if (perimeter < width) {
      ref = { x: perimeter, y: 0 }
    } else if (perimeter < width + height) {
      ref = { x: width, y: perimeter - width }
    } else if (perimeter < 2 * width + height) {
      ref = { x: width - (perimeter - width - height), y: height }
    } else {
      ref = { x: 0, y: height - (perimeter - 2 * width - height) }
    }
    return ref
  }

  function paint(time) {
    // the color changer only runs in the index page
    if (rainbow && !isMobile()) {
      bannerColorChanger(time)
    }

    context.clearRect(0, 0, width, height)

    // spawn from corner
    if (time % 10000 < animationLast % 10000) {
      rowAnimation()
    }

    ref = perimeterAnimation(time)
    for (let i = 0; i < n; i += 1) {
      context.beginPath()
      // map x, y to [0, 1]
      const [x, y] = particles[i]
      // const dx = invertX ? (width - x) / width : x / width
      // const dy = invertY ? (height - y) / height : y / height
      const dx = (x - ref.x) / width
      const dy = (y - ref.y) / height
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

    // trigger for next iterations
    animationLast = time
  }

  function onCanvasMouseMove(event) {
    event.preventDefault()
    const closestPoint = delaunay.find(event.pageX, event.pageY)
    lastTouched[closestPoint] = performance.now()
  }

  context.canvas.ontouchmove = context.canvas.onmousemove = onCanvasMouseMove

  // if we're in the root page then also fire the on mousemove in the banner
  const rootBanner = document.querySelector('.index__banner')
  if (rootBanner) {
    rootBanner.addEventListener('mousemove', context.canvas.onmousemove)
  }

  // initialization and event loop
  initialize()

  function isMobile() {
    const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i]

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem)
    })
  }

  ;(function tick(time) {
    paint(time)

    if (!isMobile()) {
      requestAnimationFrame(tick)
    }
  })(0)
}
