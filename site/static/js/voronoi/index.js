import { Delaunay } from 'https://cdn.jsdelivr.net/npm/d3-delaunay@6/+esm'
import { easeLinear } from 'https://cdn.jsdelivr.net/npm/d3-ease@3/+esm'
import { interpolateLab } from 'https://cdn.jsdelivr.net/npm/d3-interpolate@3/+esm'

// The first color is updated together with --primary during the banner
// rainbow animation. Keep the palette mutable so the Voronoi cells follow
// the same color transition as the rest of the page.
const colors = ['#C27083', '#212220']
const bannerColors = ['#C27083', '#00b1e6', '#48F913', '#F9C80E', '#B94B69']

function interpolateColors(palette, value) {
  const normalized = Math.max(0, Math.min(0.999999, value)) * (palette.length - 1)
  const index = Math.floor(normalized)
  return interpolateLab(palette[index], palette[index + 1])(normalized - index)
}

function isMobile() {
  return navigator.userAgentData?.mobile || /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)
}

export function generate({ target, n, enableRainbowAnimation, enableWaveAnimation = false }) {
  const { width, height } = target.getBoundingClientRect()
  const scale = Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  canvas.style.cssText = `position:absolute;top:0;left:0;width:${width}px;height:${height}px;opacity:0;transform:scale(1.04);transform-origin:center;transition:opacity 900ms ease,transform 1200ms cubic-bezier(0.22,1,0.36,1);`
  target.insertBefore(canvas, target.firstChild)

  const context = canvas.getContext('2d')
  context.scale(scale, scale)
  const particles = Array.from({ length: n }, () => [Math.random() * width, Math.random() * height])
  let delaunay
  let voronoi
  let animationLast = 0
  const lastTouched = {}
  const fadeOutTime = 2000
  const initialize = () => {
    delaunay = Delaunay.from(particles)
    voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5])
  }

  function waveAnimation() {
    const invertX = Math.random() < 0.5
    const invertY = Math.random() < 0.5
    for (let i = 0; i < n; i += 1) {
      const [x, y] = particles[i]
      const dx = invertX ? x / width : (width - x) / width
      const dy = invertY ? y / height : (height - y) / height
      const distance = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2)
      setTimeout(() => { lastTouched[i] = performance.now() }, easeLinear(distance) * fadeOutTime)
    }
  }

  function perimeterLocation(time, duration = 50000) {
    const perimeter = ((time % duration) * (2 * width + 2 * height)) / duration
    if (perimeter < width) return { x: perimeter, y: 0 }
    if (perimeter < width + height) return { x: width, y: perimeter - width }
    if (perimeter < 2 * width + height) return { x: width - (perimeter - width - height), y: height }
    return { x: 0, y: height - (perimeter - 2 * width - height) }
  }

  let lastBannerInterpolation = 0
  const initialColorSeed = Math.random() * 5000
  let perimeter = { x: 0, y: 0 }
  function paint(time) {
    if (enableRainbowAnimation && (!lastBannerInterpolation || time - lastBannerInterpolation > 50)) {
      const color = interpolateColors(bannerColors, (Math.cos(initialColorSeed + time / 5000) + 1) / 2)
      colors[0] = color
      document.documentElement.style.setProperty('--primary', color.replace('rgb(', '').replace(')', ''))
      lastBannerInterpolation = time
    }
    context.clearRect(0, 0, width, height)
    if (enableWaveAnimation && time % 10000 < animationLast % 10000) waveAnimation()
    perimeter = perimeterLocation(time)
    for (let i = 0; i < n; i += 1) {
      const [x, y] = particles[i]
      const dx = (x - perimeter.x) / width
      const dy = (y - perimeter.y) / height
      const distance = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2)
      context.beginPath()
      context.fillStyle = interpolateColors(colors, 1 - distance)
      if (lastTouched[i]) {
        if (time - lastTouched[i] < fadeOutTime) {
          context.fillStyle = interpolateLab(interpolateColors(colors, distance), interpolateColors(colors, 1 - distance))((time - lastTouched[i]) / fadeOutTime)
        } else delete lastTouched[i]
      }
      voronoi.renderCell(i, context)
      context.fill()
    }
    context.beginPath()
    delaunay.renderPoints(context)
    context.fill()
    animationLast = time
  }

  const onCanvasPointerMove = (event) => {
    event.preventDefault()
    const closestPoint = delaunay.find(event.clientX, event.clientY)
    lastTouched[closestPoint] = performance.now()
  }
  if (!isMobile()) {
    canvas.addEventListener('mousemove', onCanvasPointerMove)
    canvas.addEventListener('touchmove', onCanvasPointerMove, { passive: false })
    const rootBanner = document.querySelector('.index__banner')
    rootBanner?.addEventListener('mousemove', onCanvasPointerMove)
  }

  initialize()
  let tickRaf = 0
  let running = false
  const tick = (time) => {
    if (!running) return
    paint(time)
    if (canvas.style.opacity !== '1') {
      requestAnimationFrame(() => {
        canvas.style.opacity = '1'
        canvas.style.transform = 'scale(1)'
      })
    }
    tickRaf = requestAnimationFrame(tick)
  }
  const observer = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting
    if (running && !tickRaf) tickRaf = requestAnimationFrame(tick)
    if (!running) {
      cancelAnimationFrame(tickRaf)
      tickRaf = 0
    }
  }, { rootMargin: '200px' })
  observer.observe(target)
  return () => {
    running = false
    cancelAnimationFrame(tickRaf)
    observer.disconnect()
    canvas.removeEventListener('mousemove', onCanvasPointerMove)
    canvas.removeEventListener('touchmove', onCanvasPointerMove)
    target.replaceChildren()
  }
}
