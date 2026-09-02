/*
 * Avatar Interactive Acoustic Guitar: Audio & Synthesis Engine
 *
 * Physical modeling (Karplus-Strong), metronome synthesis, on-demand CSV note
 * loader with in-memory caching, and visual harmonic ribbon renderer.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { DEFAULT_SONG, SONGS_MANIFEST } from './songs-manifest.js'
import {
  triggerAcousticImpulse,
  spawnAcousticRefractionLens,
  detachDistortionFilters
} from './distortion-filter.js'

// Fast parser for compact CSV note representation: time,freq,dur,vel,name
export function parseNotesCsv(csvText) {
  const lines = csvText.trim().split('\n')
  const notes = []
  const startIdx = lines[0].startsWith('time') ? 1 : 0

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const parts = line.split(',')
    notes.push({
      time: parseFloat(parts[0]),
      freq: parseFloat(parts[1]),
      dur: parseFloat(parts[2]),
      vel: parseFloat(parts[3]),
      name: parts[4]
    })
  }
  return notes
}

// In-memory caches for metadata and parsed note arrays
const metadataCache = new Map()
const notesCache = new Map()

export async function ensureSongMetadataLoaded(songItem) {
  if (metadataCache.has(songItem.id)) {
    return metadataCache.get(songItem.id)
  }
  const metaUrl = `${songItem.dir}metadata.json`
  const resp = await fetch(metaUrl)
  if (!resp.ok) {
    throw new Error(`Failed to fetch song metadata from ${metaUrl}: ${resp.status}`)
  }
  const metadata = await resp.json()
  metadataCache.set(songItem.id, metadata)
  return metadata
}

export async function ensureSongNotesLoaded(songItem) {
  if (notesCache.has(songItem.id)) {
    return notesCache.get(songItem.id)
  }
  const csvUrl = `${songItem.dir}notes.csv`
  const resp = await fetch(csvUrl)
  if (!resp.ok) {
    throw new Error(`Failed to fetch song notes from ${csvUrl}: ${resp.status}`)
  }
  const csvText = await resp.text()
  const notes = parseNotesCsv(csvText)
  notesCache.set(songItem.id, notes)
  return notes
}

// Karplus-Strong string synthesis: acoustic guitar physical modeling
export function generatePluckBuffer(
  audioCtx,
  frequency,
  duration = 2.2,
  decay = 0.992,
  brightness = 0.78
) {
  const sampleRate = audioCtx.sampleRate
  const totalSamples = Math.floor(sampleRate * duration)
  const buffer = audioCtx.createBuffer(1, totalSamples, sampleRate)
  const data = buffer.getChannelData(0)

  const period = Math.max(2, Math.round(sampleRate / frequency))
  const noiseBuffer = new Float32Array(period)

  let prevNoise = 0
  for (let i = 0; i < period; i++) {
    const raw = Math.random() * 2 - 1
    prevNoise = prevNoise * (1 - brightness) + raw * brightness
    noiseBuffer[i] = prevNoise
  }

  let readIdx = 0
  let prevSample = 0

  for (let n = 0; n < totalSamples; n++) {
    const currentNoise = noiseBuffer[readIdx]
    const filtered = 0.5 * (currentNoise + prevSample) * decay
    prevSample = currentNoise
    noiseBuffer[readIdx] = filtered
    data[n] = filtered

    readIdx = (readIdx + 1) % period
  }

  return buffer
}

// Crisp, audible woodblock metronome click
export function playMetronomeClick(
  audioCtx,
  destination,
  time,
  isAccent
) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(isAccent ? 1350 : 850, time)
  osc.frequency.exponentialRampToValueAtTime(isAccent ? 600 : 400, time + 0.025)

  gain.gain.setValueAtTime(isAccent ? 0.35 : 0.20, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035)

  osc.connect(gain)
  gain.connect(destination)

  osc.start(time)
  osc.stop(time + 0.04)

  return osc
}

// Analytics dispatcher
export function trackMidiEvent(action, params = {}) {
  if (typeof window === 'undefined') return
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', `midi_${action}`, {
        event_category: 'avatar_mini_player',
        ...params
      })
    } else if (typeof window.ga === 'function') {
      window.ga('send', 'event', 'avatar_mini_player', action, params.label || '')
    }
  } catch (e) {
    // Non-blocking analytics
  }
}

// Harmonic Ribbon Canvas Renderer
export function renderHarmonicRibbons(
  ctx,
  width,
  height,
  waves,
  time
) {
  const centerX = width / 2
  const centerY = height / 2

  waves.forEach((wave) => {
    ctx.save()
    ctx.beginPath()

    const points = 60
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const ripple = Math.sin(angle * wave.frequency + time * 7.5) * (4.5 * wave.opacity)
      const r = wave.radius + ripple

      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    ctx.strokeStyle = wave.color.replace('ALPHA', wave.opacity.toFixed(3))
    ctx.lineWidth = 2.0 * wave.opacity
    ctx.stroke()
    ctx.restore()
  })
}

// Visual context for harmonic sound waves
let activeVisualContext = null

export function startVisualAnimation(avatarEl) {
  if (activeVisualContext && activeVisualContext.isRunning) {
    activeVisualContext.avatarEl = avatarEl
    return
  }

  const parent = avatarEl.parentElement || avatarEl
  parent.classList.add('tw-relative')

  const avatarWidth = avatarEl.offsetWidth || 75
  const avatarHeight = avatarEl.offsetHeight || 75
  const avatarRadius = avatarWidth / 2
  const canvasSize = Math.max(260, avatarWidth * 4.0)
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const canvas = document.createElement('canvas')
  canvas.className = 'avatar-waves-canvas'
  canvas.width = canvasSize * dpr
  canvas.height = canvasSize * dpr
  canvas.style.position = 'absolute'
  canvas.style.top = `${avatarEl.offsetTop + avatarHeight / 2}px`
  canvas.style.left = `${avatarEl.offsetLeft + avatarWidth / 2}px`
  canvas.style.transform = 'translate(-50%, -50%)'
  canvas.style.width = `${canvasSize}px`
  canvas.style.height = `${canvasSize}px`
  canvas.style.zIndex = '5'
  canvas.style.pointerEvents = 'none'
  parent.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }
  ctx.scale(dpr, dpr)

  const colors = [
    'rgba(255, 112, 67, ALPHA)', // Coral Primary
    'rgba(251, 191, 36, ALPHA)', // Warm Gold
    'rgba(244, 63, 94, ALPHA)', // Rose
    'rgba(255, 171, 0, ALPHA)' // Amber
  ]

  const vContext = {
    canvas,
    ctx,
    waves: [],
    avatarEl,
    avatarRadius,
    isRunning: true,
    colorIdx: 0,
    startTime: performance.now(),
    lastTime: performance.now(),
    canvasSize
  }
  activeVisualContext = vContext

  const updatePosition = () => {
    if (!vContext.isRunning || !vContext.canvas.parentElement) return
    const curAvatar = vContext.avatarEl
    const aW = curAvatar.offsetWidth || 75
    const aH = curAvatar.offsetHeight || 75
    vContext.avatarRadius = aW / 2
    vContext.canvas.style.top = `${curAvatar.offsetTop + aH / 2}px`
    vContext.canvas.style.left = `${curAvatar.offsetLeft + aW / 2}px`
  }
  window.addEventListener('resize', updatePosition)

  window.__avatarWavePush = (freq) => {
    if (!activeVisualContext) return
    activeVisualContext.waves.push({
      radius: activeVisualContext.avatarRadius - 4,
      maxRadius: activeVisualContext.canvasSize / 2,
      speed: 60 + (freq / 700) * 25,
      frequency: 3 + Math.floor((freq / 200) % 4),
      opacity: 0.95,
      color: colors[activeVisualContext.colorIdx++ % colors.length]
    })
  }

  function animate(now) {
    if (!vContext.isRunning || !vContext.ctx) return
    const dt = Math.min((now - vContext.lastTime) / 1000, 0.05)
    vContext.lastTime = now
    const elapsed = (now - vContext.startTime) / 1000

    vContext.ctx.clearRect(0, 0, vContext.canvasSize, vContext.canvasSize)

    for (let i = vContext.waves.length - 1; i >= 0; i--) {
      const w = vContext.waves[i]
      w.radius += w.speed * dt
      const progress = (w.radius - vContext.avatarRadius) / (w.maxRadius - vContext.avatarRadius)
      w.opacity = Math.max(0, 1.0 - Math.pow(progress, 1.4))
      if (w.opacity <= 0.01) {
        vContext.waves.splice(i, 1)
      }
    }

    renderHarmonicRibbons(vContext.ctx, vContext.canvasSize, vContext.canvasSize, vContext.waves, elapsed)

    if (playerStore.getState().isPlaying || vContext.waves.length > 0) {
      requestAnimationFrame(animate)
    } else {
      cleanup()
    }
  }

  const cleanup = () => {
    vContext.isRunning = false
    window.removeEventListener('resize', updatePosition)
    delete window.__avatarWavePush
    if (vContext.canvas.parentElement) {
      vContext.canvas.remove()
    }
    if (activeVisualContext === vContext) {
      activeVisualContext = null
    }
  }

  requestAnimationFrame(animate)
}

// Spawns floating musical note particles
export function spawnFloatingMusicParticle(originEl, text, isTick) {
  if (typeof document === 'undefined' || !originEl) return

  const parent = originEl.parentElement || originEl
  parent.classList.add('tw-relative')

  const originWidth = originEl.offsetWidth || 75
  const originHeight = originEl.offsetHeight || 75
  const startX = originEl.offsetLeft + originWidth * (0.2 + Math.random() * 0.6)
  const startY = originEl.offsetTop + originHeight * 0.1

  const particle = document.createElement('div')
  const defaultGlyphs = ['🥀', '♪', '♫', '✨']
  const displayText = text || defaultGlyphs[Math.floor(Math.random() * defaultGlyphs.length)]

  particle.textContent = displayText
  particle.style.position = 'absolute'
  particle.style.left = `${startX}px`
  particle.style.top = `${startY}px`
  particle.style.zIndex = '9999'
  particle.style.pointerEvents = 'none'
  particle.style.fontSize = isTick ? '13px' : (text ? '15px' : `${15 + Math.random() * 10}px`)
  particle.style.color = isTick ? '#38bdf8' : (Math.random() > 0.4 ? 'rgb(var(--primary))' : '#fbbf24')
  particle.style.fontWeight = 'bold'
  particle.style.fontFamily = 'var(--family-sans, sans-serif)'
  particle.style.textShadow = isTick ? '0 0 8px rgba(56, 189, 248, 0.7)' : '0 0 10px rgba(255, 112, 67, 0.7)'
  particle.style.transition = 'all 0.9s cubic-bezier(0.25, 1, 0.5, 1)'
  particle.style.transform = 'translateY(0px) scale(0.6) rotate(0deg)'
  particle.style.opacity = '1'

  parent.appendChild(particle)

  requestAnimationFrame(() => {
    const deltaX = (Math.random() - 0.5) * 60
    const deltaY = -45 - Math.random() * 40
    const rot = (Math.random() - 0.5) * 35
    particle.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.25) rotate(${rot}deg)`
    particle.style.opacity = '0'
  })

  setTimeout(() => {
    particle.remove()
  }, 950)
}

// Reactive Player Store & Web Audio Coordinator
class PlayerStore {
  constructor() {
    this.listeners = new Set()
    this.audioContextInstance = null
    this.metronomeGainNode = null
    this.currentPlayback = null
    this.progressAnimId = null
    this.activeTimeouts = new Set()
    this.songs = SONGS_MANIFEST
    this.state = {
      phraseIndex: 0,
      isPlaying: false,
      isContinuous: false,
      isMetronome: false,
      progress: 0,
      currentBar: 1,
      currentBeat: 1,
      song: DEFAULT_SONG,
      metadata: null,
      phrase: null
    }

    // Pre-fetch lightweight metadata for the default song (only ~5KB)
    this.initDefaultSong()
  }

  async initDefaultSong() {
    try {
      const metadata = await ensureSongMetadataLoaded(DEFAULT_SONG)
      const firstPhrase = metadata.phrases ? metadata.phrases[0] : null
      this.setState({
        metadata,
        phrase: firstPhrase,
        currentBar: firstPhrase ? firstPhrase.startBar : 1,
        currentBeat: firstPhrase ? firstPhrase.startBeat : 1
      })
    } catch (e) {
      console.error('Error loading default song metadata:', e)
    }
  }

  getState() {
    return this.state
  }

  setState(partial) {
    this.state = { ...this.state, ...partial }
    if (this.state.metadata && this.state.metadata.phrases) {
      this.state.phrase = this.state.metadata.phrases[this.state.phraseIndex] || null
    }
    this.listeners.forEach((listener) => listener(this.state))
  }

  subscribe(listener) {
    this.listeners.add(listener)
    listener(this.state)
    return () => this.listeners.delete(listener)
  }

  getAudioContext() {
    if (!this.audioContextInstance && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      this.audioContextInstance = new AudioCtx()
      this.metronomeGainNode = this.audioContextInstance.createGain()
      this.metronomeGainNode.gain.setValueAtTime(this.state.isMetronome ? 1.0 : 0.0, this.audioContextInstance.currentTime)
      this.metronomeGainNode.connect(this.audioContextInstance.destination)
    }
    return this.audioContextInstance
  }

  stop() {
    // Clear all pending timeouts
    this.activeTimeouts.forEach((id) => clearTimeout(id))
    this.activeTimeouts.clear()

    if (this.currentPlayback) {
      this.currentPlayback.stop()
      this.currentPlayback = null
    }
    if (this.progressAnimId !== null) {
      cancelAnimationFrame(this.progressAnimId)
      this.progressAnimId = null
    }

    const currentPhrase = this.state.phrase
    const avatars = document.querySelectorAll('.js-avatar-scene, .profile-avatar-scene')
    avatars.forEach((el) => {
      el.classList.remove('is-playing')
      el.style.transform = 'none'
    })
    detachDistortionFilters()

    this.setState({
      isPlaying: false,
      progress: 0,
      currentBar: currentPhrase ? currentPhrase.startBar : 1,
      currentBeat: currentPhrase ? currentPhrase.startBeat : 1
    })
  }

  async playVerse(targetIndex, avatarEl) {
    const song = this.state.song

    // Ensure metadata is loaded
    let metadata = this.state.metadata
    if (!metadata) {
      metadata = await ensureSongMetadataLoaded(song)
      this.setState({ metadata })
    }

    const phrases = metadata.phrases || []
    if (!phrases.length) return

    const newIdx = (targetIndex + phrases.length) % phrases.length
    const phrase = phrases[newIdx]

    this.stop()

    // On-demand fetch of notes.csv only when user initiates playback
    let notes = []
    try {
      notes = await ensureSongNotesLoaded(song)
    } catch (err) {
      console.error('Error loading song notes:', err)
      return
    }

    const ctx = this.getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Update real-time metronome gain
    if (this.metronomeGainNode) {
      this.metronomeGainNode.gain.setValueAtTime(this.state.isMetronome ? 1.0 : 0.0, ctx.currentTime)
    }

    const activeAvatar = avatarEl || document.querySelector('.js-avatar-scene, .profile-avatar-scene')
    if (activeAvatar) {
      activeAvatar.classList.add('is-playing')
      startVisualAnimation(activeAvatar)
    }

    this.setState({
      phraseIndex: newIdx,
      phrase,
      isPlaying: true,
      progress: 0,
      currentBar: phrase.startBar,
      currentBeat: phrase.startBeat
    })

    trackMidiEvent('play_verse', {
      phrase_index: newIdx,
      title: phrase.title,
      duration: phrase.duration
    })

    // Slice notes from CSV index range
    const phraseNotes = notes.slice(phrase.startRow, phrase.startRow + phrase.rowCount)

    // Synthesize notes and schedule playback
    const startTime = ctx.currentTime + 0.05
    const activeNodes = []

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.35, startTime)
    if (!this.state.isContinuous) {
      const fadeStart = startTime + Math.max(0, phrase.duration - 0.2)
      masterGain.gain.setValueAtTime(0.35, fadeStart)
      masterGain.gain.linearRampToValueAtTime(0.001, startTime + phrase.duration + 0.4)
    }
    masterGain.connect(ctx.destination)
    activeNodes.push(masterGain)

    // Schedule MIDI Notes
    phraseNotes.forEach((note) => {
      const noteTime = startTime + note.time
      const buffer = generatePluckBuffer(ctx, note.freq, Math.min(note.dur + 1.2, 3.5), 0.993, 0.78)
      const src = ctx.createBufferSource()
      src.buffer = buffer

      const noteGain = ctx.createGain()
      noteGain.gain.setValueAtTime(note.vel, noteTime)
      noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.dur + 1.0)

      src.connect(noteGain)
      noteGain.connect(masterGain)

      src.start(noteTime)
      src.stop(noteTime + note.dur + 1.2)
      activeNodes.push(src)

      // Schedule visual particle & subtle acoustic strum bounce
      const delayMs = (noteTime - ctx.currentTime) * 1000
      if (delayMs >= 0) {
        const timeoutId = setTimeout(() => {
          this.activeTimeouts.delete(timeoutId)
          if (!this.state.isPlaying) return
          if (activeAvatar) {
            // Cutout and background elements for layered 3D bounce
            const fg = activeAvatar.querySelector('.js-avatar-fg')
            const bg = activeAvatar.querySelector('.js-avatar-bg')

            // Velocity & pitch dynamic response
            const intensity = Math.min(1.0, Math.max(0.4, (note.vel || 0.7) * 1.3))
            const isHigh = note.freq > 450
            const bounceScale = 1.05 + intensity * 0.05
            const rot = (Math.random() - 0.5) * (isHigh ? 6.0 : 4.0)

            // 1. Avatar container bounce (punchy spring)
            activeAvatar.style.transition = 'transform 0.07s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            activeAvatar.style.transform = `scale(${bounceScale.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`

            // 2. Cutout foreground bounce (subtle head/guitar bob)
            if (fg) {
              const fgBobY = -1.2 * intensity
              const fgScale = 1.02 + intensity * 0.025
              const fgRot = -rot * 0.3
              fg.style.transition = 'transform 0.07s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              fg.style.transform = `translateY(${fgBobY.toFixed(1)}px) scale(${fgScale.toFixed(3)}) rotate(${fgRot.toFixed(2)}deg)`
            }

            // 3. Subtle background pulse
            if (bg) {
              const bgScale = 1.03 + intensity * 0.02
              bg.style.transition = 'transform 0.07s ease-out'
              bg.style.transform = `scale(${bgScale.toFixed(3)})`
            }

            const resetId = setTimeout(() => {
              this.activeTimeouts.delete(resetId)
              if (activeAvatar) {
                activeAvatar.style.transition = 'transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1)'
                activeAvatar.style.transform = ''

                if (fg) {
                  fg.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  fg.style.transform = ''
                }
                if (bg) {
                  bg.style.transition = 'transform 0.18s ease-out'
                  bg.style.transform = ''
                }
              }
            }, 85)
            this.activeTimeouts.add(resetId)

            spawnFloatingMusicParticle(activeAvatar, note.name.replace(/[0-9]/g, ''))

            // Acoustic DOM distortion shader & expanding caustic refraction lens
            const parent = activeAvatar.parentElement || activeAvatar
            triggerAcousticImpulse(intensity, note.freq, activeAvatar)
            spawnAcousticRefractionLens(parent, activeAvatar, intensity, note.freq)
          }
          if (window.__avatarWavePush) {
            window.__avatarWavePush(note.freq)
          }
        }, delayMs)
        this.activeTimeouts.add(timeoutId)
      }
    })

    // Schedule Metronome Ticks onto dedicated real-time controllable gain node
    const beatsPerBar = (metadata && metadata.beatsPerBar) || song.beatsPerBar || 4
    const accents = (metadata && metadata.accents) || song.accents || [1]
    const totalBeats = Math.max(1, (phrase.endBar - phrase.startBar) * beatsPerBar + (phrase.endBeat - phrase.startBeat))
    const secondsPerBeat = phrase.duration / totalBeats
    let currentBeatTime = startTime
    let beatIdx = 0

    while (currentBeatTime < startTime + phrase.duration) {
      const currentBeatInBar = ((phrase.startBeat - 1 + beatIdx) % beatsPerBar) + 1
      const isAccent = accents.includes(currentBeatInBar)
      const isDownbeat = currentBeatInBar === 1
      const exactTime = currentBeatTime
      const tickDelay = (currentBeatTime - ctx.currentTime) * 1000

      // Real-time controllable audio metronome
      if (this.metronomeGainNode) {
        const osc = playMetronomeClick(ctx, this.metronomeGainNode, exactTime, isAccent)
        activeNodes.push(osc)
      }

      // Visual particle for downbeats
      if (tickDelay >= 0 && isDownbeat) {
        const currentBarForParticle = phrase.startBar + Math.floor((phrase.startBeat - 1 + beatIdx) / beatsPerBar)
        const tId = setTimeout(() => {
          this.activeTimeouts.delete(tId)
          if (!this.state.isPlaying) return
          if (activeAvatar && this.state.isMetronome) {
            spawnFloatingMusicParticle(activeAvatar, `⏱ Bar ${currentBarForParticle}.1`, true)
          }
        }, tickDelay)
        this.activeTimeouts.add(tId)
      }

      currentBeatTime += secondsPerBeat
      beatIdx++
    }

    // Precise, Continuous Progress Bar & Bar.Beat Counter Loop
    const phraseStartPerf = performance.now()
    const phraseDurationMs = phrase.duration * 1000

    const updateProgress = () => {
      if (!this.state.isPlaying) return
      const elapsedMs = performance.now() - phraseStartPerf
      const ratio = Math.min(1, Math.max(0, elapsedMs / phraseDurationMs))

      const elapsedSec = elapsedMs / 1000
      const currentBeatOffset = Math.min(totalBeats - 1, Math.max(0, Math.floor(elapsedSec / secondsPerBeat)))
      const totalBeatCounter = (phrase.startBar - 1) * beatsPerBar + (phrase.startBeat - 1) + currentBeatOffset
      const calculatedBar = Math.floor(totalBeatCounter / beatsPerBar) + 1
      const calculatedBeat = (totalBeatCounter % beatsPerBar) + 1

      this.setState({
        progress: ratio,
        currentBar: calculatedBar,
        currentBeat: calculatedBeat
      })

      if (ratio < 1) {
        this.progressAnimId = requestAnimationFrame(updateProgress)
      }
    }
    this.progressAnimId = requestAnimationFrame(updateProgress)

    // Completion / Loop handling
    const timeoutDuration = this.state.isContinuous ? phrase.duration * 1000 : (phrase.duration * 1000 + 40)
    const completionTimeoutId = setTimeout(() => {
      this.activeTimeouts.delete(completionTimeoutId)
      if (!this.state.isPlaying) return
      const nextIdx = (this.state.phraseIndex + 1) % phrases.length
      const nextPhrase = phrases[nextIdx]

      if (this.state.isContinuous) {
        this.playVerse(nextIdx, activeAvatar)
      } else {
        this.stop()
        this.setState({
          phraseIndex: nextIdx,
          phrase: nextPhrase,
          progress: 0,
          currentBar: nextPhrase ? nextPhrase.startBar : 1,
          currentBeat: nextPhrase ? nextPhrase.startBeat : 1
        })
      }
    }, timeoutDuration)
    this.activeTimeouts.add(completionTimeoutId)

    this.currentPlayback = {
      stop: () => {
        clearTimeout(completionTimeoutId)
        activeNodes.forEach((node) => {
          try {
            if ('stop' in node && typeof node.stop === 'function') node.stop()
            node.disconnect()
          } catch (e) {}
        })
      }
    }
  }

  togglePlay(avatarEl) {
    if (this.state.isPlaying) {
      this.stop()
    } else {
      this.playVerse(this.state.phraseIndex, avatarEl)
    }
  }

  nextVerse(avatarEl) {
    const total = this.state.metadata ? this.state.metadata.phrases.length : 1
    const nextIdx = (this.state.phraseIndex + 1) % total
    if (this.state.isPlaying) {
      this.playVerse(nextIdx, avatarEl)
    } else {
      const nextPhrase = this.state.metadata ? this.state.metadata.phrases[nextIdx] : null
      this.setState({
        phraseIndex: nextIdx,
        progress: 0,
        currentBar: nextPhrase ? nextPhrase.startBar : 1,
        currentBeat: nextPhrase ? nextPhrase.startBeat : 1
      })
    }
  }

  prevVerse(avatarEl) {
    const total = this.state.metadata ? this.state.metadata.phrases.length : 1
    const prevIdx = (this.state.phraseIndex - 1 + total) % total
    if (this.state.isPlaying) {
      this.playVerse(prevIdx, avatarEl)
    } else {
      const prevPhrase = this.state.metadata ? this.state.metadata.phrases[prevIdx] : null
      this.setState({
        phraseIndex: prevIdx,
        progress: 0,
        currentBar: prevPhrase ? prevPhrase.startBar : 1,
        currentBeat: prevPhrase ? prevPhrase.startBeat : 1
      })
    }
  }

  toggleLoop() {
    this.setState({ isContinuous: !this.state.isContinuous })
  }

  toggleMetronome() {
    const nextVal = !this.state.isMetronome
    this.setState({ isMetronome: nextVal })

    // Real-time instant audio gain toggle mid-playback
    if (this.metronomeGainNode && this.audioContextInstance) {
      this.metronomeGainNode.gain.setValueAtTime(nextVal ? 1.0 : 0.0, this.audioContextInstance.currentTime)
    }
  }

  async selectSong(songId, avatarEl) {
    const targetSong = this.songs.find((s) => s.id === songId) || this.songs[0]
    if (this.state.song.id === targetSong.id) return

    const wasPlaying = this.state.isPlaying
    this.stop()

    try {
      const metadata = await ensureSongMetadataLoaded(targetSong)
      const firstPhrase = metadata.phrases ? metadata.phrases[0] : null
      this.setState({
        song: targetSong,
        metadata,
        phraseIndex: 0,
        progress: 0,
        currentBar: firstPhrase ? firstPhrase.startBar : 1,
        currentBeat: firstPhrase ? firstPhrase.startBeat : 1
      })

      if (wasPlaying) {
        this.playVerse(0, avatarEl)
      }
    } catch (e) {
      console.error('Error switching song:', e)
    }
  }

  cycleSong(avatarEl) {
    const curIdx = this.songs.findIndex((s) => s.id === this.state.song.id)
    const nextIdx = (curIdx + 1) % this.songs.length
    this.selectSong(this.songs[nextIdx].id, avatarEl)
  }
}

export const playerStore = new PlayerStore()
