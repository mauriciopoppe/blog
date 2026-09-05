const HILL_COUNT = 10
const STAR_COUNT = 250
const SEED = Math.floor(Math.random() * 2147483646) + 1

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 48271) % 2147483647
    return value / 2147483647
  }
}

function primaryChannels() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .split(',')
    .map((channel) => Number(channel.trim()))
}

function interpolateColor(primary, t) {
  const dark = [33, 34, 32]
  const channels = primary.map((channel, index) => Math.round(channel * (1 - t) + dark[index] * t))
  return `rgb(${channels.join(',')})`
}

function getScrollProgress(height) {
  return (window.scrollY - (document.documentElement.scrollHeight - window.innerHeight - height)) / height
}

export function render({ target }) {
  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('preserveAspectRatio', 'none')
  svg.style.cssText = 'position:absolute;width:100%;height:100%;display:block;left:0;top:0;'
  target.replaceChildren(svg)

  let width = 1
  let height = 1
  let mouseX = 0
  let tracked = false
  const primary = primaryChannels()
  const hillLayers = []

  function draw() {
    width = Math.max(target.clientWidth, 1)
    height = Math.max(target.clientHeight, 1)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.replaceChildren()
    hillLayers.length = 0

    const starsRandom = seededRandom(SEED)
    for (let i = 0; i < STAR_COUNT; i += 1) {
      const star = document.createElementNS(svgNS, 'circle')
      const cx = starsRandom() * width
      const cy = starsRandom() * height
      const radius = starsRandom() + starsRandom()
      star.setAttribute('cx', String(cx))
      star.setAttribute('cy', String(cy))
      star.setAttribute('r', String(radius))
      star.setAttribute('fill', 'var(--link)')
      svg.appendChild(star)
    }

    const hillsRandom = seededRandom(SEED)
    for (let layer = 0; layer < HILL_COUNT; layer += 1) {
      const points = []
      const step = width / 10
      const baseline = height * 0.1 + (1 - layer / HILL_COUNT) * height * 0.3
      for (let i = -1; i <= 12; i += 1) {
        const x = i * step + step * (hillsRandom() * 0.6 - 0.3)
        const y = Math.max(0, baseline + (hillsRandom() * 2 - 1) * 100)
        points.push(`${x.toFixed(1)},${(height - y).toFixed(1)}`)
      }
      points.push(`${width},${height}`, `0,${height}`)
      const hill = document.createElementNS(svgNS, 'polygon')
      hill.setAttribute('points', points.join(' '))
      hill.setAttribute('fill', interpolateColor(primary, 0.25 + ((HILL_COUNT - layer) / HILL_COUNT) * 0.75))
      svg.appendChild(hill)
      hillLayers.push({ element: hill, depth: layer })
    }
  }

  function update() {
    const scrollT = getScrollProgress(height)
    svg.style.opacity = String(Math.max(0, Math.min(1, scrollT)))
    hillLayers.forEach(({ element, depth }) => {
      const x = (mouseX * 100 * depth) / HILL_COUNT
      const y = ((depth * 500) / HILL_COUNT) * (1 - Math.max(0, scrollT))
      element.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`)
    })
    if (scrollT > 0.8 && !tracked) {
      tracked = true
      window.gtag?.('event', 'footer_animation')
    }
  }

  const onScroll = () => update()
  const onMouseMove = ({ clientX }) => {
    mouseX = (clientX / window.innerWidth - 0.5) * 2
    update()
  }
  const resizeObserver = new ResizeObserver(() => {
    draw()
    update()
  })
  resizeObserver.observe(target)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('mousemove', onMouseMove)
  draw()
  update()

  return () => {
    resizeObserver.disconnect()
    window.removeEventListener('scroll', onScroll)
    document.removeEventListener('mousemove', onMouseMove)
    target.replaceChildren()
  }
}
