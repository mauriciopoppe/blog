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

export const ARTICLE_TEXT_EXCLUSION_SELECTOR = 'script, style, pre, code, textarea, svg, .avatar-mini-player, [data-avatar-distortion-fragment]'
export const ARTICLE_FRAGMENT_SELECTOR = '[data-avatar-distortion-fragment], img, video, canvas, pre, table'
export const ARTICLE_TEXT_TARGET_SELECTOR = 'article[role="main"], [data-avatar-distortion-target="note-header"]'
export const DISTORTION_TARGET_SELECTOR = '[data-avatar-distortion-target]'
export const MAX_ACTIVE_ARTICLE_FRAGMENTS = 24

export function canApplyDistortion(el) {
  return Boolean(el) && el.nodeName !== 'HTML' && el.nodeName !== 'BODY'
}

export function isTextualRegion(el) {
  return Boolean(el?.textContent?.trim())
}

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

export function distanceBetweenRects(first, second) {
  const horizontalGap = Math.max(first.left - second.right, second.left - first.right, 0)
  const verticalGap = Math.max(first.top - second.bottom, second.top - first.bottom, 0)
  return Math.hypot(horizontalGap, verticalGap)
}

let activeAnimId = null
let currentScale = 0
let activeRegions = []
let activeFragments = []
let activeFragmentAvatar = null
let lastFragmentTierUpdate = 0
let lastFragmentLayoutKey = ''
let activeDirectTargets = []

function wrapArticleText(root) {
  if (!root || root.dataset.avatarDistortionPrepared === 'true') return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const textNodes = []
  let node
  while ((node = walker.nextNode())) {
    const parent = node.parentElement
    if (!parent || parent.closest(ARTICLE_TEXT_EXCLUSION_SELECTOR)) continue
    if (node.nodeValue && /\S/.test(node.nodeValue)) textNodes.push(node)
  }

  textNodes.forEach((textNode) => {
    const parts = textNode.nodeValue.split(/(\s+)/)
    const fragment = document.createDocumentFragment()
    parts.forEach((part) => {
      if (/\S/.test(part)) {
        const span = document.createElement('span')
        span.dataset.avatarDistortionFragment = 'true'
        span.textContent = part
        fragment.appendChild(span)
      } else {
        fragment.appendChild(document.createTextNode(part))
      }
    })
    textNode.parentNode.replaceChild(fragment, textNode)
  })

  root.dataset.avatarDistortionPrepared = 'true'
}

function tierForDistance(distance, avatarRect) {
  const unit = Math.max(80, avatarRect.width * 1.25)
  if (distance <= unit * 1.5) return 1
  if (distance <= unit * 3) return 2
  if (distance <= unit * 5) return 3
  return 0
}

function attachTextFragments(roots, avatarEl) {
  const targetRoots = (Array.isArray(roots) ? roots : [roots]).filter(Boolean)
  if (!targetRoots.length || !avatarEl) return

  targetRoots.forEach((root) => wrapArticleText(root))
  const avatarRect = avatarEl.getBoundingClientRect()
  const layoutKey = [
    Math.round(avatarRect.left),
    Math.round(avatarRect.top),
    Math.round(avatarRect.width),
    Math.round(avatarRect.height),
    Math.round(window.scrollX),
    Math.round(window.scrollY)
  ].join(':')
  if (activeFragmentAvatar === avatarEl && activeFragments.length && lastFragmentLayoutKey === layoutKey) return
  activeFragments.forEach((el) => {
    el.style.filter = ''
  })
  activeFragments = []
  const candidates = []

  targetRoots.forEach((root, rootIndex) => {
    root.querySelectorAll(ARTICLE_FRAGMENT_SELECTOR).forEach((el) => {
      if (el === avatarEl || avatarEl.contains(el) || el.contains(avatarEl)) return
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const distance = distanceBetweenRects(rect, avatarRect)
      const tier = tierForDistance(distance, avatarRect)
      if (tier) candidates.push({ el, tier, distance, rootIndex })
    })
  })

  const perTargetLimit = Math.max(1, Math.floor(MAX_ACTIVE_ARTICLE_FRAGMENTS / targetRoots.length))
  const selected = targetRoots.flatMap((_, rootIndex) => candidates
    .filter((candidate) => candidate.rootIndex === rootIndex)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, perTargetLimit))
  selected
    .forEach(({ el, tier }) => {
      el.style.filter = `url(#${FILTER_ID}-${tier})`
      activeFragments.push(el)
    })
  activeFragmentAvatar = avatarEl
  lastFragmentLayoutKey = layoutKey
}

function attachArticleFragments(avatarEl) {
  const targets = [...document.querySelectorAll(ARTICLE_TEXT_TARGET_SELECTOR)]
  attachTextFragments(targets, avatarEl)
}

function attachHomepageFragments(avatarEl) {
  const targets = [
    ...document.querySelectorAll(`${DISTORTION_TARGET_SELECTOR}[data-avatar-distortion-target="profile"], ${DISTORTION_TARGET_SELECTOR}[data-avatar-distortion-target="homepage-right"]`)
  ]
  attachTextFragments(targets, avatarEl)
}

function isSmallDockedRegion(el) {
  const rect = el.getBoundingClientRect()
  const maxArea = Math.max(18000, window.innerWidth * window.innerHeight * 0.02)
  return rect.width > 0 && rect.height > 0 && rect.width * rect.height <= maxArea
}

function updateArticleFragmentTiers(now = performance.now()) {
  if (!activeFragmentAvatar || !activeFragments.length) return
  if (now - lastFragmentTierUpdate < 120) return
  lastFragmentTierUpdate = now
  const avatarRect = activeFragmentAvatar.getBoundingClientRect()
  const layoutKey = [
    Math.round(avatarRect.left),
    Math.round(avatarRect.top),
    Math.round(avatarRect.width),
    Math.round(avatarRect.height),
    Math.round(window.scrollX),
    Math.round(window.scrollY)
  ].join(':')
  if (layoutKey === lastFragmentLayoutKey) return
  lastFragmentLayoutKey = layoutKey
  activeFragments.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const tier = tierForDistance(distanceBetweenRects(rect, avatarRect), avatarRect)
    el.style.filter = tier ? `url(#${FILTER_ID}-${tier})` : ''
  })
}

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

  // Explicit text targets are handled separately as distance-ranked fragments.
  // Body-child regions provide the same nearby-surface behavior in both modes.
  const leftCol = avatarEl.closest('[data-avatar-distortion-target="profile"]')
  if (leftCol && isSmallDockedRegion(leftCol)) {
    regions.push({ el: leftCol, tier: 1 })
  }

  // Article page header -> Tier 1
  const noteHeader = avatarEl.closest('[data-avatar-distortion-target="note-header"]') || avatarEl.closest('header')
  if (noteHeader && isSmallDockedRegion(noteHeader) && !regions.some((r) => r.el === noteHeader)) {
    regions.push({ el: noteHeader, tier: 1 })
  }

  // Filter body children individually so both docked and detached avatars
  // react to nearby surfaces without ever filtering html or body.
  {
    const avatarRect = avatarEl.getBoundingClientRect()
    const maxRegionArea = Math.max(18000, window.innerWidth * window.innerHeight * 0.1)
    const candidates = []
    const addDetachedRegion = (el, depth = 0) => {
      if (!canApplyDistortion(el) || el.id === 'avatar-distortion-svg') return
      if (el.matches('script, style, svg')) return
      if (el.contains(avatarEl)) return
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const tier = tierForDistance(distanceBetweenRects(rect, avatarRect), avatarRect)
      if (!tier) return
      if ((rect.width * rect.height > maxRegionArea || isTextualRegion(el)) && depth < 4 && el.children.length) {
        Array.from(el.children).forEach((child) => addDetachedRegion(child, depth + 1))
        return
      }
      if (isTextualRegion(el)) return
      candidates.push({
        el,
        tier,
        distance: distanceBetweenRects(rect, avatarRect)
      })
    }
    Array.from(document.body.children).forEach((el) => addDetachedRegion(el))
    candidates
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .forEach(({ el, tier }) => regions.push({ el, tier }))
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
  if (!document.body.contains(avatarEl)) {
    const directTargets = [
      avatarEl,
      avatarEl.parentElement?.querySelector('.avatar-waves-canvas')
    ].filter(Boolean)
    directTargets.forEach((el) => {
      el.style.filter = `url(#${FILTER_ID}-1)`
      activeDirectTargets.push(el)
    })
  }
  attachHomepageFragments(avatarEl)
  attachArticleFragments(avatarEl)
}

export function detachDistortionFilters() {
  if (typeof document === 'undefined') return
  activeRegions.forEach(({ el }) => {
    if (el) el.style.filter = ''
  })
  activeFragments.forEach((el) => {
    if (el) el.style.filter = ''
  })
  activeDirectTargets.forEach((el) => {
    if (el) el.style.filter = ''
  })
  activeRegions = []
  activeFragments = []
  activeDirectTargets = []
  activeFragmentAvatar = null
  lastFragmentLayoutKey = ''
  lastFragmentTierUpdate = 0
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

  // Keep dense MIDI passages expressive without overwhelming the page.
  const initialScale = Math.min(16, Math.max(8, 14 * intensity))
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
    updateArticleFragmentTiers(now)

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
  lens.style.background = 'radial-gradient(circle, transparent 55%, rgba(var(--primary), 0.15) 80%, rgba(var(--primary), 0.28) 94%, transparent 100%)'
  lens.style.backdropFilter = `url(#${FILTER_ID}-2) contrast(135%) brightness(115%) blur(0.3px)`
  lens.style.webkitBackdropFilter = `url(#${FILTER_ID}-2) contrast(135%) brightness(115%) blur(0.3px)`
  lens.style.boxShadow = 'inset 0 0 14px rgba(var(--primary), 0.5)'
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
