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
    avatarEl.classList.remove('is-playing')
    detachDistortionFilters()
  }

  const handleState = (state) => {
    if (state.isPlaying) {
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

    if (!visualAnimation) return
    visualAnimation.pushWave(event.frequency)

      const intensity = Math.min(1.0, Math.max(0.4, (event.velocity || 0.7) * 1.3))
      const fg = avatarEl.querySelector('.js-avatar-fg')
      const bg = avatarEl.querySelector('.js-avatar-bg')
      const rot = (Math.random() - 0.5) * (event.frequency > 450 ? 6.0 : 4.0)

      if (fg) {
        fg.style.transition = 'transform 0.07s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        fg.style.transform = `scale(${(1.03 + intensity * 0.04).toFixed(3)}) rotate(${(-rot * 0.3).toFixed(2)}deg)`
      }
      if (bg) {
        bg.style.transition = 'transform 0.07s ease-out'
        bg.style.transform = `scale(${(0.98 - intensity * 0.015).toFixed(3)})`
      }

    const resetId = setTimeout(() => {
      pendingTimeouts.delete(resetId)
      if (fg) {
        fg.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
        fg.style.transform = ''
      }
      if (bg) {
        bg.style.transition = 'transform 0.18s ease-out'
        bg.style.transform = ''
      }
    }, 85)
    pendingTimeouts.add(resetId)

    spawnFloatingMusicParticle(avatarEl, event.name.replace(/[0-9]/g, ''))
    if (!window.matchMedia('(pointer: coarse)').matches) {
      triggerAcousticImpulse(intensity, event.frequency, avatarEl)
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

  const unsubscribeState = store.subscribe(handleState)
  const unsubscribeEvents = store.subscribeEvents(handleEvent)

  return () => {
    unsubscribeState()
    unsubscribeEvents()
    stopEffects()
  }
}
