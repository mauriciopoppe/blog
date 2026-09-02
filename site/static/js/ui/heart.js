/**
 * Zero-dependency native implementation of the heart particle swirl animation
 * and easter egg page transition, replacing @mojs/core.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

const HEART_SVG_PATH =
  'M92.5939814,7.35914503 C82.6692916,-2.45304834 66.6322927,-2.45304834 56.7076029,7.35914503 L52.3452392,11.6965095 C51.0327802,12.9714696 48.9328458,12.9839693 47.6203869,11.6715103 L47.6203869,11.6715103 L43.2705228,7.35914503 C33.3833318,-2.45304834 17.3213337,-2.45304834 7.43414268,7.35914503 C-2.47804756,17.1963376 -2.47804756,33.12084 7.43414268,42.9205337 L29.7959439,65.11984 C29.7959439,65.1323396 29.8084435,65.1323396 29.8084435,65.1448392 L43.2580232,78.4819224 C46.9704072,82.1818068 52.9952189,82.1818068 56.7076029,78.4819224 L70.1696822,65.1448392 C70.1696822,65.1448392 70.1696822,65.1323396 70.1821818,65.1323396 L92.5939814,42.9205337 C102.468673,33.12084 102.468673,17.1963376 92.5939814,7.35914503 L92.5939814,7.35914503 Z'

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function generateSwirlKeyframes({
  distance,
  pathScale = 1,
  degreeShift = 0,
  swirlSize = 10,
  swirlFrequency = 3,
  direction = 1,
  steps = 16
}) {
  const keyframes = []
  const PI = Math.PI

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // Exact mojs ShapeSwirl formula:
    // angle = degreeShift + direction * swirlSize * Math.sin(swirlFrequency * t)
    // radAngle = (angle - 90) * (PI / 180)
    // radius = t * distance * pathScale
    const angle = degreeShift + direction * swirlSize * Math.sin(swirlFrequency * t)
    const radAngle = (angle - 90) * (PI / 180)
    const radius = t * distance * pathScale

    const x = Math.cos(radAngle) * radius
    const y = Math.sin(radAngle) * radius

    // mojs ShapeSwirl default scale is { 1: 0 } (shrinks from full to 0)
    const scale = t < 0.08 ? t / 0.08 : Math.max(0, 1 - (t - 0.08) / 0.92)

    // Soft opacity fade at the end of the trajectory
    const opacity = t < 0.08 ? t / 0.08 : t > 0.7 ? Math.max(0, 1 - (t - 0.7) / 0.3) : 1

    // Color transition: white -> deeppink (rgb(255, 20, 147))
    const colorProgress = Math.min(1, Math.pow(t, 0.75) * 1.25)
    const r = 255
    const g = Math.round(255 - colorProgress * (255 - 20))
    const b = Math.round(255 - colorProgress * (255 - 147))

    keyframes.push({
      transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`,
      opacity: opacity.toFixed(3),
      color: `rgb(${r}, ${g}, ${b})`,
      fill: `rgb(${r}, ${g}, ${b})`
    })
  }

  return keyframes
}

function spawnHeartSwirl(parentEl, durationOverride = null) {
  const count = 10
  for (let i = 0; i < count; i++) {
    const duration = durationOverride || rand(600, 1500)
    const distance = rand(50, 75)
    const pathScale = rand(0.5, 1)
    const swirlSize = rand(6, 14)
    const swirlFrequency = rand(2, 4)
    const degreeShift = rand(-20, 20)
    const direction = Math.random() < 0.5 ? -1 : 1
    const size = rand(14, 22)

    const keyframes = generateSwirlKeyframes({
      distance,
      pathScale,
      degreeShift,
      swirlSize,
      swirlFrequency,
      direction
    })

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 100 100')
    svg.setAttribute('width', `${size}`)
    svg.setAttribute('height', `${size}`)
    svg.style.position = 'absolute'
    svg.style.left = '50%'
    svg.style.top = '50%'
    svg.style.marginLeft = `-${size / 2}px`
    svg.style.marginTop = `-${size / 2}px`
    svg.style.pointerEvents = 'none'
    svg.style.zIndex = '9999'
    svg.style.overflow = 'visible'

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', HEART_SVG_PATH)
    path.style.fill = 'currentColor'
    svg.appendChild(path)

    parentEl.appendChild(svg)

    const anim = svg.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      fill: 'forwards'
    })

    anim.onfinish = () => {
      svg.remove()
    }
  }
}

function initializeHeart(rootEl, props) {
  // Ensure the parent element is positioned so absolute hearts align
  if (window.getComputedStyle(rootEl).position === 'static') {
    rootEl.style.position = 'relative'
  }

  rootEl.addEventListener('mouseenter', () => {
    if (props.animateOnMouseOver) {
      spawnHeartSwirl(rootEl, rand(600, 1500))
    }
  })

  rootEl.addEventListener('click', (e) => {
    spawnHeartSwirl(rootEl, rand(1500, 3000))
    if (props.animateOnClick) {
      document.body.style.transition = 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1), transform 2s cubic-bezier(0.4, 0, 0.2, 1)'
      document.body.style.transformOrigin = 'center center'
      document.body.style.transform = 'scale(1.5)'
      document.body.style.opacity = '0'

      setTimeout(() => {
        if (typeof props.onClick === 'function') {
          props.onClick()
        }
      }, 2000)
    } else {
      if (typeof props.onClick === 'function') {
        props.onClick()
      }
    }
  })
}

function mainHeart(props = {}) {
  if (typeof document === 'undefined') return
  const hearts = Array.from(document.querySelectorAll('.heart'))
  if (!hearts.length) return
  const config = {
    animateOnMouseOver: props.animateOnMouseOver ?? true,
    animateOnClick: props.animateOnClick ?? true,
    onClick: props.onClick || (() => {})
  }
  hearts.forEach((h) => initializeHeart(h, config))
}

if (typeof window !== 'undefined') {
  window.mainHeart = mainHeart
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateSwirlKeyframes,
    spawnHeartSwirl,
    mainHeart
  }
}
