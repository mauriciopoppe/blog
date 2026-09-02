/**
 * SVG DOM Displacement Shader Controller for Acoustic Shockwaves.
 *
 * Dynamically injects and modulates tiered SVG displacement filters
 * (<feDisplacementMap> + <feTurbulence>) to physically warp surrounding
 * DOM text, headings, and backdrop elements with radial distance attenuation.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

export const FILTER_ID = 'avatar-dom-distortion'

export const TIERS = [
  { tier: 1, id: `${FILTER_ID}-1`, factor: 1.0 },  // Immediate region: 100% force
  { tier: 2, id: `${FILTER_ID}-2`, factor: 0.62 }, // Adjacent region (e.g. right side): 62% force
  { tier: 3, id: `${FILTER_ID}-3`, factor: 0.35 }  // Outer region: 35% force
]

export function calculateImpulseDecay(elapsedMs, durationMs, initialScale) {
  if (elapsedMs >= durationMs) return 0
  const progress = elapsedMs / durationMs
  // Damped acoustic spring curve
  const damping = Math.exp(-progress * 4.2)
  const wave = Math.cos(progress * Math.PI * 1.5)
  return Math.max(0, initialScale * damping * wave)
}

export function calculateBaseFrequency(freq) {
  // Lower pitch (bass) = broader wave crests (lower frequency)
  // Higher pitch (treble) = tighter acoustic ripples (higher frequency)
  const clampedFreq = Math.max(80, Math.min(1200, freq || 300))
  const normalized = (clampedFreq - 80) / (1200 - 80)
  const baseFreq = 0.025 + normalized * 0.035
  return +baseFreq.toFixed(4)
}

export function calculateTierScale(tier, baseScale) {
  switch (tier) {
    case 1:
      return baseScale * 1.0
    case 2:
      return baseScale * 0.62
    case 3:
      return baseScale * 0.35
    default:
      return 0
  }
}

let activeAnimId = null
let currentScale = 0
let activeRegions = []

export function ensureDistortionFilter() {
  if (typeof document === 'undefined') return null
  let svg = document.getElementById('avatar-distortion-svg')
  if (svg) return svg

  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.id = 'avatar-distortion-svg'
  svg.setAttribute('style', 'position: absolute; width: 0; height: 0; pointer-events: none;')
  svg.setAttribute('aria-hidden', 'true')

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

  const allFilterConfigs = [
    { id: FILTER_ID, dispId: 'avatar-dom-disp', turbId: 'avatar-dom-turb' },
    ...TIERS.map((t) => ({
      id: t.id,
      dispId: `avatar-dom-disp-${t.tier}`,
      turbId: `avatar-dom-turb-${t.tier}`
    }))
  ]

  allFilterConfigs.forEach(({ id, dispId, turbId }) => {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    filter.id = id
    filter.setAttribute('x', '-50%')
    filter.setAttribute('y', '-50%')
    filter.setAttribute('width', '200%')
    filter.setAttribute('height', '200%')
    filter.setAttribute('color-interpolation-filters', 'sRGB')

    const turb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence')
    turb.id = turbId
    turb.setAttribute('class', 'avatar-turb-node')
    turb.setAttribute('type', 'fractalNoise')
    turb.setAttribute('baseFrequency', '0.04 0.04')
    turb.setAttribute('numOctaves', '2')
    turb.setAttribute('result', 'noise')
    turb.setAttribute('seed', '1')

    const disp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
    disp.id = dispId
    disp.setAttribute('class', 'avatar-disp-node')
    disp.setAttribute('in', 'SourceGraphic')
    disp.setAttribute('in2', 'noise')
    disp.setAttribute('scale', '0')
    disp.setAttribute('xChannelSelector', 'R')
    disp.setAttribute('yChannelSelector', 'G')

    filter.appendChild(turb)
    filter.appendChild(disp)
    defs.appendChild(filter)
  })

  svg.appendChild(defs)
  document.body.appendChild(svg)

  return svg
}

export function getAcousticRegions(avatarEl) {
  if (typeof document === 'undefined' || !avatarEl) return []
  const regions = []

  // 1. Profile / Left column on homepage -> Tier 1 (Immediate, 100% force)
  const leftCol = avatarEl.closest('[class*="tw-basis-1/3"]') || avatarEl.closest('.tw-flex-col')
  if (leftCol) {
    regions.push({ el: leftCol, tier: 1 })
  }

  // 2. Favorites & Software / Entire Right column on homepage -> Tier 2 (Adjacent, 62% force)
  const container = avatarEl.closest('.tw-container')
  if (container) {
    const rightCol = container.querySelector('[class*="tw-basis-2/3"]')
    if (rightCol) {
      regions.push({ el: rightCol, tier: 2 })
    }
  }

  // 3. Article page header -> Tier 1
  const noteHeader = avatarEl.closest('[class*="tw-group/note-preview"]') || avatarEl.closest('header')
  if (noteHeader && !regions.some((r) => r.el === noteHeader)) {
    regions.push({ el: noteHeader, tier: 1 })
  }

  // Fallbacks if no main container matched
  if (regions.length === 0) {
    const parent = avatarEl.parentElement
    if (parent) {
      if (parent.parentElement) regions.push({ el: parent.parentElement, tier: 1 })
      if (parent.nextElementSibling) regions.push({ el: parent.nextElementSibling, tier: 2 })
    }
  }

  return regions
}

export function attachDistortionFilters(avatarEl) {
  if (typeof document === 'undefined' || !avatarEl) return
  ensureDistortionFilter()

  const regions = getAcousticRegions(avatarEl)
  activeRegions = regions

  regions.forEach(({ el, tier }) => {
    el.style.filter = `url(#${FILTER_ID}-${tier})`
  })
}

export function detachDistortionFilters() {
  if (typeof document === 'undefined') return
  activeRegions.forEach(({ el }) => {
    if (el) el.style.filter = ''
  })
  activeRegions = []
  const disps = document.querySelectorAll('.avatar-disp-node')
  disps.forEach((d) => d.setAttribute('scale', '0'))
}

export function triggerAcousticImpulse(intensity = 0.8, freq = 300, avatarEl = null) {
  if (typeof document === 'undefined') return
  ensureDistortionFilter()

  const curAvatar = avatarEl || document.querySelector('.js-avatar-scene, .profile-avatar-scene')
  if (curAvatar) {
    attachDistortionFilters(curAvatar)
  }

  const seed = `${Math.floor(Math.random() * 999) + 1}`
  const baseFreq = calculateBaseFrequency(freq)

  // Update turbulence on all tier filters
  const turbs = document.querySelectorAll('.avatar-turb-node')
  turbs.forEach((t) => {
    t.setAttribute('seed', seed)
    t.setAttribute('baseFrequency', `${baseFreq} ${baseFreq}`)
  })

  // Strum scale: 22px to 44px
  const initialScale = Math.min(44, Math.max(22, 32 * intensity))
  currentScale = Math.max(currentScale, initialScale)

  const durationMs = 210
  const startTime = performance.now()

  if (activeAnimId) {
    cancelAnimationFrame(activeAnimId)
    activeAnimId = null
  }

  const step = (now) => {
    const elapsed = now - startTime
    const baseDecay = calculateImpulseDecay(elapsed, durationMs, currentScale)

    // Apply distance-attenuated scales to default and tiered filters
    const defaultDisp = document.getElementById('avatar-dom-disp')
    if (defaultDisp) defaultDisp.setAttribute('scale', baseDecay.toFixed(2))

    TIERS.forEach((t) => {
      const dispEl = document.getElementById(`avatar-dom-disp-${t.tier}`)
      if (dispEl) {
        const tierScale = calculateTierScale(t.tier, baseDecay)
        dispEl.setAttribute('scale', tierScale.toFixed(2))
      }
    })

    if (elapsed < durationMs && baseDecay > 0.05) {
      activeAnimId = requestAnimationFrame(step)
    } else {
      detachDistortionFilters()
      currentScale = 0
      activeAnimId = null
    }
  }

  activeAnimId = requestAnimationFrame(step)
}

export function spawnAcousticRefractionLens(parent, avatarEl, intensity = 0.8, freq = 300) {
  if (typeof document === 'undefined' || !parent || !avatarEl) return
  ensureDistortionFilter()

  const aW = avatarEl.offsetWidth || 75
  const aH = avatarEl.offsetHeight || 75
  const centerX = avatarEl.offsetLeft + aW / 2
  const centerY = avatarEl.offsetTop + aH / 2

  const lens = document.createElement('div')
  lens.className = 'avatar-refraction-lens'
  lens.style.position = 'absolute'
  lens.style.top = `${centerY}px`
  lens.style.left = `${centerX}px`
  lens.style.width = `${aW}px`
  lens.style.height = `${aH}px`
  lens.style.borderRadius = '9999px'
  lens.style.pointerEvents = 'none'
  lens.style.transform = 'translate(-50%, -50%) scale(1)'
  lens.style.transformOrigin = 'center center'
  lens.style.zIndex = '0'

  // Refraction caustic ripple and hardware backdrop distortion
  lens.style.background = 'radial-gradient(circle, transparent 55%, rgba(var(--primary), 0.15) 80%, rgba(255, 255, 255, 0.28) 94%, transparent 100%)'
  lens.style.backdropFilter = `url(#${FILTER_ID}-2) contrast(135%) brightness(115%) blur(0.3px)`
  lens.style.webkitBackdropFilter = `url(#${FILTER_ID}-2) contrast(135%) brightness(115%) blur(0.3px)`
  lens.style.boxShadow = 'inset 0 0 14px rgba(var(--primary), 0.5), 0 0 20px rgba(255, 255, 255, 0.35)'
  lens.style.border = '1.5px solid rgba(var(--primary), 0.45)'

  parent.appendChild(lens)

  const targetScale = 3.6 + intensity * 1.2
  const duration = 400 + Math.min(200, (800 / (freq || 300)) * 60)

  const anim = lens.animate(
    [
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.9 },
      { transform: `translate(-50%, -50%) scale(${targetScale.toFixed(2)})`, opacity: 0 }
    ],
    {
      duration,
      easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
      fill: 'forwards'
    }
  )

  anim.onfinish = () => {
    lens.remove()
  }
}

// Backward compatibility helper
export function applyNearbyTextDistortion(avatarEl) {
  attachDistortionFilters(avatarEl)
}

if (typeof window !== 'undefined') {
  window.__triggerAcousticImpulse = triggerAcousticImpulse
  window.__spawnAcousticRefractionLens = spawnAcousticRefractionLens
}
