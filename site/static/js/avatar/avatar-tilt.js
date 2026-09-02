/**
 * Interactive 3D Parallax Tilt Effect for Profile Avatar
 *
 * Computes pointer offset relative to avatar center and applies
 * spring-damped 3D rotation, translation, and reactive drop shadow.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

export function computeTilt(
  cursorX,
  cursorY,
  centerX,
  centerY,
  viewportWidth,
  viewportHeight,
  maxTilt = 3.0,
  maxTranslate = 1.8
) {
  const halfW = Math.max(1, viewportWidth / 2)
  const halfH = Math.max(1, viewportHeight / 2)

  // Normalized distance from center (-1 to 1)
  const dx = Math.max(-1, Math.min(1, (cursorX - centerX) / halfW))
  const dy = Math.max(-1, Math.min(1, (cursorY - centerY) / halfH))

  // Rotate towards mouse: cursor above (dy < 0) tilts top forward/back
  const rotX = -dy * maxTilt
  const rotY = dx * maxTilt
  const transX = dx * maxTranslate
  const transY = dy * maxTranslate

  // Shadow casts away from cursor
  const shadowX = -dx * 3
  const shadowY = -dy * 3
  const shadowIntensity = 0.2 + Math.min(0.1, (Math.abs(dx) + Math.abs(dy)) * 0.05)

  return {
    rotX,
    rotY,
    transX,
    transY,
    shadowX,
    shadowY,
    shadowIntensity
  }
}

export function lerpVal(curr, target, factor = 0.06) {
  return curr + (target - curr) * factor
}

export function avatarTiltMain() {
  if (typeof window === 'undefined') return
  if (typeof document === 'undefined') return

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return

  const scenes = document.querySelectorAll('.js-avatar-scene, .profile-avatar-scene')
  const singleAvatars = document.querySelectorAll('.js-avatar-tilt')

  const layeredStates = Array.from(scenes).map((container) => {
    container.style.perspective = '600px'
    const bg = container.querySelector('.js-avatar-bg')
    const fg = container.querySelector('.js-avatar-fg')

    if (bg) {
      bg.style.willChange = 'transform'
      bg.style.transformStyle = 'preserve-3d'
    }
    if (fg) {
      fg.style.willChange = 'transform'
      fg.style.transformStyle = 'preserve-3d'
    }

    return {
      container,
      bg,
      fg,
      isVisible: true,
      currRotX: 0,
      currRotY: 0,
      currTransX: 0,
      currTransY: 0,
      currShadowX: 0,
      currShadowY: 0,
      targetRotX: 0,
      targetRotY: 0,
      targetTransX: 0,
      targetTransY: 0,
      targetShadowX: 0,
      targetShadowY: 0
    }
  })

  // Single avatar states for backwards compatibility
  const singleStates = Array.from(singleAvatars).map((el) => {
    const parent = el.parentElement
    if (parent && !parent.style.perspective) {
      parent.style.perspective = '600px'
    }
    el.style.transformStyle = 'preserve-3d'
    el.style.willChange = 'transform'

    return {
      el,
      isVisible: true,
      currRotX: 0,
      currRotY: 0,
      currTransX: 0,
      currTransY: 0,
      currShadowX: 0,
      currShadowY: 0,
      targetRotX: 0,
      targetRotY: 0,
      targetTransX: 0,
      targetTransY: 0,
      targetShadowX: 0,
      targetShadowY: 0
    }
  })

  if (!layeredStates.length && !singleStates.length) return

  // IntersectionObserver to avoid animating or tracking mouse when offscreen
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          layeredStates.forEach((s) => {
            if (s.container === entry.target) {
              s.isVisible = entry.isIntersecting
            }
          })
          singleStates.forEach((s) => {
            if (s.el === entry.target) {
              s.isVisible = entry.isIntersecting
            }
          })
        })
      },
      { threshold: 0.05 }
    )

    layeredStates.forEach((s) => observer.observe(s.container))
    singleStates.forEach((s) => observer.observe(s.el))
  }

  let isMoving = false

  const tick = () => {
    let stillAnimating = false

    // Update layered scenes
    layeredStates.forEach((state) => {
      if (!state.isVisible && Math.abs(state.currRotX) < 0.01 && Math.abs(state.currRotY) < 0.01) {
        return
      }

      state.currRotX = lerpVal(state.currRotX, state.targetRotX)
      state.currRotY = lerpVal(state.currRotY, state.targetRotY)
      state.currTransX = lerpVal(state.currTransX, state.targetTransX)
      state.currTransY = lerpVal(state.currTransY, state.targetTransY)
      state.currShadowX = lerpVal(state.currShadowX, state.targetShadowX)
      state.currShadowY = lerpVal(state.currShadowY, state.targetShadowY)

      const diff =
        Math.abs(state.targetRotX - state.currRotX) +
        Math.abs(state.targetRotY - state.currRotY) +
        Math.abs(state.targetTransX - state.currTransX) +
        Math.abs(state.targetTransY - state.currTransY)

      if (diff > 0.005) {
        stillAnimating = true
      }

      // Background moves slightly in opposite direction with scale buffer
      if (state.bg) {
        const bgX = -state.currTransX * 0.2
        const bgY = -state.currTransY * 0.2
        state.bg.style.transform = `translate3d(${bgX.toFixed(2)}px, ${bgY.toFixed(2)}px, 0) scale(1.05)`
      }

      // Foreground subject moves forward towards cursor with very subtle 3D tilt
      if (state.fg) {
        const fgX = state.currTransX * 0.5
        const fgY = state.currTransY * 0.5
        state.fg.style.transform = `translate3d(${fgX.toFixed(2)}px, ${fgY.toFixed(2)}px, 4px) rotateX(${state.currRotX.toFixed(2)}deg) rotateY(${state.currRotY.toFixed(2)}deg) scale(1.01)`
      }

    })

    // Update single avatars
    singleStates.forEach((state) => {
      if (!state.isVisible && Math.abs(state.currRotX) < 0.01 && Math.abs(state.currRotY) < 0.01) {
        return
      }

      state.currRotX = lerpVal(state.currRotX, state.targetRotX)
      state.currRotY = lerpVal(state.currRotY, state.targetRotY)
      state.currTransX = lerpVal(state.currTransX, state.targetTransX)
      state.currTransY = lerpVal(state.currTransY, state.targetTransY)
      state.currShadowX = lerpVal(state.currShadowX, state.targetShadowX)
      state.currShadowY = lerpVal(state.currShadowY, state.targetShadowY)

      const diff =
        Math.abs(state.targetRotX - state.currRotX) +
        Math.abs(state.targetRotY - state.currRotY) +
        Math.abs(state.targetTransX - state.currTransX) +
        Math.abs(state.targetTransY - state.currTransY)

      if (diff > 0.005) {
        stillAnimating = true
      }

      const translation = state.el.dataset.avatarDraggable === 'true'
        ? 'translate3d(0, 0, 0)'
        : `translate3d(${state.currTransX.toFixed(2)}px, ${state.currTransY.toFixed(2)}px, 0)`
      state.el.style.transform = `${translation} rotateX(${state.currRotX.toFixed(2)}deg) rotateY(${state.currRotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`
    })

    if (stillAnimating) {
      requestAnimationFrame(tick)
    } else {
      isMoving = false
    }
  }

  const onMouseMove = (e) => {
    const hasVisible = layeredStates.some((s) => s.isVisible) || singleStates.some((s) => s.isVisible)
    if (!hasVisible) return

    const vw = window.innerWidth
    const vh = window.innerHeight

    layeredStates.forEach((state) => {
      if (!state.isVisible) return
      const rect = state.container.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const tilt = computeTilt(e.clientX, e.clientY, cx, cy, vw, vh, 3.0, 1.8)
      state.targetRotX = tilt.rotX
      state.targetRotY = tilt.rotY
      state.targetTransX = tilt.transX
      state.targetTransY = tilt.transY
      state.targetShadowX = tilt.shadowX
      state.targetShadowY = tilt.shadowY
    })

    singleStates.forEach((state) => {
      if (!state.isVisible) return
      const rect = state.el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const tilt = computeTilt(e.clientX, e.clientY, cx, cy, vw, vh)
      state.targetRotX = tilt.rotX
      state.targetRotY = tilt.rotY
      state.targetTransX = tilt.transX
      state.targetTransY = tilt.transY
      state.targetShadowX = tilt.shadowX
      state.targetShadowY = tilt.shadowY
    })

    if (!isMoving) {
      isMoving = true
      requestAnimationFrame(tick)
    }
  }

  const onMouseLeave = () => {
    layeredStates.forEach((state) => {
      state.targetRotX = 0
      state.targetRotY = 0
      state.targetTransX = 0
      state.targetTransY = 0
      state.targetShadowX = 0
      state.targetShadowY = 0
    })

    singleStates.forEach((state) => {
      state.targetRotX = 0
      state.targetRotY = 0
      state.targetTransX = 0
      state.targetTransY = 0
      state.targetShadowX = 0
      state.targetShadowY = 0
    })

    if (!isMoving) {
      isMoving = true
      requestAnimationFrame(tick)
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.addEventListener('mouseleave', onMouseLeave, { passive: true })
}
