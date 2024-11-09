import { select } from 'd3-selection'
import { Delaunay } from 'd3-delaunay'
import { easeLinear } from 'd3-ease'
import { interpolateLab } from 'd3-interpolate'

import { theme } from '../main/colors.js'
const d3 = { select, Delaunay }

function isMobile() {
  if ((navigator as any).userAgentData) {
    return (navigator as any).userAgentData.mobile
  }
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i]

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem)
  })
}

export function generate({ target, n, rainbow }) {
  // canvas setup
  const { width, height } = target.getBoundingClientRect()
  const scale = window.devicePixelRatio
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.style.position = 'absolute'
  canvas.style.top = '0px'
  canvas.style.left = '0px'
  target.insertBefore(canvas, target.firstChild)

  const context = canvas.getContext('2d')
  context.scale(scale, scale)

  // voronoi setup
  const particles = Array.from({ length: n }, () => [Math.random() * width, Math.random() * height])
  let delaunay: Delaunay, voronoi: any, animationLast: number
  let ref = { x: 0, y: 0 }
  // lastBannerInterpolation is the last time the banner interpolation was run.
  let lastBannerInterpolation: number

  /** @type {Object.<number, number>} */
  const lastTouched: {
    [key: number]: number
  } = {}
  const fadeOutTime = 2000

  function initialize() {
    delaunay = d3.Delaunay.from(particles)
    voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5])
  }

  function waveAnimation() {
    const invertX = Math.random() < 0.5
    const invertY = Math.random() < 0.5
    for (let i = 0; i < n; i += 1) {
      const [x, y] = particles[i]
      const dx = invertX ? x / width : (width - x) / width
      const dy = invertY ? y / height : (height - y) / height
      const dist = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2)
      setTimeout(() => {
        lastTouched[i] = performance.now()
      }, easeLinear(dist) * fadeOutTime)
    }
    return [invertX, invertY]
  }

  function perimeterAnimation(time: number, perimeterAnimationTime = 50000): { x: number; y: number } {
    // move refs according to time
    const timeLeft = time % perimeterAnimationTime
    let ref: { x: number; y: number }
    /*
      map time to perimeter
     animTime   =   2a + 2b
        x       =   ?
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

  function paint(time: number) {
    // the color changer only runs in the index page
    if (rainbow && !isMobile()) {
      // Run the banner interpolation animation every some milliseconds and not on every frame.
      if (!lastBannerInterpolation || time - lastBannerInterpolation > 50) {
        const k = (Math.cos(time / 5000) + 1) / 2
        theme.colors[0] = theme.bannerInterpolation(k)
        window.document.documentElement.style.setProperty('--primary', theme.colors[0])
        lastBannerInterpolation = time
      }
    }

    context.clearRect(0, 0, width, height)

    // spawns a wave from a random corner
    if (time % 10000 < animationLast % 10000) {
      waveAnimation()
    }

    // animate the start location of the gradient
    ref = perimeterAnimation(time)

    for (let i = 0; i < n; i += 1) {
      context.beginPath()
      // map x, y to [0, 1]
      const [x, y] = particles[i]
      // const dx = invertX ? (width - x) / width : x / width
      // const dy = invertY ? (height - y) / height : y / height
      const dx = (x - ref.x) / width
      const dy = (y - ref.y) / height
      const dist = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2)

      // magic numbers to select what colors should be displayed
      // dist = 0 + dist * 0.5
      context.fillStyle = theme.t(1 - dist)
      if (lastTouched[i]) {
        if (time - lastTouched[i] < fadeOutTime) {
          context.fillStyle = interpolateLab(theme.t(dist), theme.t(1 - dist))((time - lastTouched[i]) / fadeOutTime)
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

  function onCanvasMouseMove(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    const closestPoint = delaunay.find((event as MouseEvent).pageX, (event as MouseEvent).pageY)
    lastTouched[closestPoint] = performance.now()
  }

  if (!isMobile()) {
    // capture mouse and touch events only in desktop
    context.canvas.ontouchmove = context.canvas.onmousemove = onCanvasMouseMove
  }

  // if we're in the root page then also fire the on mousemove in the banner
  const rootBanner = document.querySelector('.index__banner')
  if (rootBanner) {
    rootBanner.addEventListener('mousemove', context.canvas.onmousemove)
  }

  // initialization and event loop
  initialize()
  let tickRaf: number
  function tick(time: number) {
    paint(time)
    tickRaf = requestAnimationFrame(tick)
  }

  // only run the animation when the element is visible in the screen!
  const observer = new IntersectionObserver(
    (entries) => {
      // no need to run the animation on mobile devices, only paint once and that's it!
      if (isMobile()) {
        paint(0)
        return
      }

      entries.forEach(async function (entry) {
        if (entry.isIntersecting) {
          tick(0)
        } else {
          cancelAnimationFrame(tickRaf)
        }
      })
    },
    { rootMargin: '200px' }
  )
  observer.observe(target)
}
