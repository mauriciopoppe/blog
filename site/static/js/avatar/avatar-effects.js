/* Avatar playback effects adapter. */

import { playerStore, startVisualAnimation, spawnFloatingMusicParticle } from './audio-engine.js'
import { triggerAcousticImpulse, detachDistortionFilters } from './distortion-filter.js'
import { avatarFrameLoop } from './frame-loop.js'

export function createAvatarEffects(avatarEl, store = playerStore) {
  if (!avatarEl) return () => {}

  let visualAnimation = null
  const pendingTimeouts = new Set()
  const pendingEvents = []
  let unsubscribeFrame = null
  let lastDistortionAt = -Infinity
  let sunsetStreamActive = false

  const checkSunsetStream = (overlaps = null) => {
    if (!store.getState().isPlaying) {
      if (sunsetStreamActive && typeof window.__SUNSET_MUSIC_STREAM_STOP__ === 'function') {
        window.__SUNSET_MUSIC_STREAM_STOP__()
      }
      sunsetStreamActive = false
      return
    }
    const sunset = document.querySelector('#browser-sunset')
    if (!sunset) return
    const avatarRect = avatarEl.getBoundingClientRect()
    const sunsetRect = sunset.getBoundingClientRect()
    const isOverlapping = overlaps ?? (
      avatarRect.right >= sunsetRect.left && avatarRect.left <= sunsetRect.right &&
      avatarRect.bottom >= sunsetRect.top && avatarRect.top <= sunsetRect.bottom
    )
    if (isOverlapping && !sunsetStreamActive && typeof window.__SUNSET_MUSIC_STREAM_START__ === 'function') {
      sunsetStreamActive = true
      console.info('[DEBUG-sunset-music-stream] start', { overlaps: true, playing: true })
      window.__SUNSET_MUSIC_STREAM_START__()
    } else if (!isOverlapping && sunsetStreamActive) {
      sunsetStreamActive = false
      console.info('[DEBUG-sunset-music-stream] stop', { overlaps: false, playing: true })
      window.__SUNSET_MUSIC_STREAM_STOP__?.()
    }
  }

  const clearPendingTimeouts = () => {
    pendingTimeouts.forEach((id) => clearTimeout(id))
    pendingTimeouts.clear()
  }

  const stopEffects = () => {
    clearPendingTimeouts()
    pendingEvents.length = 0
    if (unsubscribeFrame) {
      unsubscribeFrame()
      unsubscribeFrame = null
    }
    if (visualAnimation) {
      visualAnimation.stop()
      visualAnimation = null
    }
    if (sunsetStreamActive) window.__SUNSET_MUSIC_STREAM_STOP__?.()
    sunsetStreamActive = false
    avatarEl.classList.remove('is-playing')
    detachDistortionFilters()
  }

  const handleState = (state) => {
    if (state.isPlaying) {
      checkSunsetStream()
      if (!visualAnimation) {
        avatarEl.classList.add('is-playing')
        visualAnimation = startVisualAnimation(avatarEl)
        unsubscribeFrame = avatarFrameLoop.subscribe(processEvents)
      }
    } else {
      stopEffects()
    }
  }

  const applyEvent = (event) => {
    if (!store.getState().isPlaying) return

    if (event.type === 'beat-scheduled') {
      if (store.getState().isMetronome) spawnFloatingMusicParticle(avatarEl, event.label, true)
      return
    }

    const intensity = Math.min(1.0, Math.max(0.4, (event.velocity || 0.7) * 1.3))
    const fg = avatarEl.querySelector('.js-avatar-fg')
    const bg = avatarEl.querySelector('.js-avatar-bg')
    const rot = (Math.random() - 0.5) * (event.frequency > 450 ? 6.0 : 4.0)

    if (!visualAnimation) return
    visualAnimation.pushWave(event.frequency, event.role === 'background' ? 'background' : 'avatar', event.velocity)

    if (event.role === 'background') {
      if (bg) {
        bg.style.transition = 'transform 0.07s ease-out'
        bg.style.transform = `scale(${(0.98 - intensity * 0.015).toFixed(3)})`
      }
    } else if (fg) {
      fg.style.transition = 'transform 0.07s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      fg.style.transform = `scale(${(1.03 + intensity * 0.04).toFixed(3)}) rotate(${(-rot * 0.3).toFixed(2)}deg)`
    }

    const resetId = setTimeout(() => {
      pendingTimeouts.delete(resetId)
      if (event.role === 'background') {
        if (bg) {
          bg.style.transition = 'transform 0.18s ease-out'
          bg.style.transform = ''
        }
      } else if (fg) {
        fg.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
        fg.style.transform = ''
      }
    }, 85)
    pendingTimeouts.add(resetId)

    spawnFloatingMusicParticle(avatarEl, event.name.replace(/[0-9]/g, ''))
    const now = performance.now()
    if (!window.matchMedia('(pointer: coarse)').matches && now - lastDistortionAt >= 70) {
      lastDistortionAt = now
      triggerAcousticImpulse(intensity * 0.65, event.frequency, avatarEl)
    }
  }

  function processEvents() {
    const context = store.audioContextInstance
    if (!context || !store.getState().isPlaying) return
    const dueEvents = []
    for (let i = pendingEvents.length - 1; i >= 0; i--) {
      if (pendingEvents[i].audioTime <= context.currentTime) {
        dueEvents.push(pendingEvents[i])
        pendingEvents.splice(i, 1)
      }
    }
    dueEvents.sort((a, b) => a.audioTime - b.audioTime)
    dueEvents.forEach(applyEvent)
  }

  const handleEvent = (event) => {
    if (event.type !== 'note-scheduled' && event.type !== 'beat-scheduled') return
    pendingEvents.push(event)
  }

  const handleSunsetOverlap = (event) => checkSunsetStream(event.detail?.overlaps)

  const unsubscribeState = store.subscribe(handleState)
  const unsubscribeEvents = store.subscribeEvents(handleEvent)
  avatarEl.addEventListener('avatar-sunset-overlap', handleSunsetOverlap)

  return () => {
    unsubscribeState()
    unsubscribeEvents()
    avatarEl.removeEventListener('avatar-sunset-overlap', handleSunsetOverlap)
    stopEffects()
  }
}
