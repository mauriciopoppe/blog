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
import { avatarFrameLoop } from './frame-loop.js'
import { buildSongTimeline, findPhraseAtOffset, getPhrasePosition } from './playback-timeline.js'

const MAX_ACTIVE_WAVES = 48

// Fast parser for compact CSV note representation: time,freq,dur,vel,name[,hand]
export function parseNotesCsv(csvText) {
  const lines = csvText.trim().split('\n')
  const notes = []
  const startIdx = lines[0].startsWith('time') ? 1 : 0

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const parts = line.split(',')
    const frequency = parseFloat(parts[1])
    notes.push({
      time: parseFloat(parts[0]),
      freq: frequency,
      dur: parseFloat(parts[2]),
      vel: parseFloat(parts[3]),
      name: parts[4],
      hand: parts[5] || (frequency < 261.63 ? 'left' : 'right')
    })
  }
  return notes
}

// In-memory caches for metadata and parsed note arrays
const metadataCache = new Map()
const notesCache = new Map()
const pluckBufferCache = new WeakMap()

export function getRandomSong(songs = SONGS_MANIFEST, random = Math.random()) {
  if (!songs.length) return DEFAULT_SONG
  const index = Math.min(songs.length - 1, Math.floor(random * songs.length))
  return songs[index]
}

function getPluckBuffer(audioCtx, frequency, duration) {
  let cache = pluckBufferCache.get(audioCtx)
  if (!cache) {
    cache = new Map()
    pluckBufferCache.set(audioCtx, cache)
  }
  const key = `${frequency}:${duration}`
  if (!cache.has(key)) {
    cache.set(key, generatePluckBuffer(audioCtx, frequency, duration, 0.993, 0.78))
  }
  return cache.get(key)
}

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
export function generatePluckBuffer(audioCtx, frequency, duration = 2.2, decay = 0.992, brightness = 0.78) {
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
export function playMetronomeClick(audioCtx, destination, time, isAccent) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(isAccent ? 1350 : 850, time)
  osc.frequency.exponentialRampToValueAtTime(isAccent ? 600 : 400, time + 0.025)

  gain.gain.setValueAtTime(isAccent ? 0.35 : 0.2, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035)

  osc.connect(gain)
  gain.connect(destination)

  osc.start(time)
  osc.stop(time + 0.04)

  return osc
}

export function getPhraseMasterLevel(phrase, baseLevel = 0.35) {
  const phraseGain = Number(phrase?.gain)
  const normalizedGain = Number.isFinite(phraseGain)
    ? Math.max(0, Math.min(1, phraseGain))
    : 1
  return baseLevel * normalizedGain
}

export function resetMasterGainForLoop(masterGain, time, level = 0.35) {
  masterGain.gain.cancelScheduledValues(time)
  masterGain.gain.setValueAtTime(level, time)
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
export function renderHarmonicRibbons(ctx, width, height, waves, time) {
  const centerX = width / 2
  const centerY = height / 2

  waves.forEach((wave) => {
    ctx.save()
    ctx.beginPath()

    const points = 60
    const isBackground = wave.role === 'background'
    const style = isBackground ? wave.style : null
    const orbitX = style === 'orbit' ? Math.cos(time * 1.7 + wave.phase) * 10 : 0
    const orbitY = style === 'orbit' ? Math.sin(time * 1.4 + wave.phase) * 7 : 0

    if (style === 'spokes' || style === 'burst') {
      const rayCount = style === 'burst' ? 20 : 14
      const rayLength = style === 'burst' ? 15 : 9
      ctx.strokeStyle = wave.color.replace('ALPHA', wave.opacity.toFixed(3))
      ctx.lineWidth = (style === 'burst' ? 1.5 : 1.2) * wave.opacity
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + (style === 'burst' ? wave.phase : 0)
        const innerRadius = wave.radius - 2
        const outerRadius = innerRadius + rayLength * (0.55 + 0.45 * Math.sin(i * 2.3 + wave.frequency / 100))
        ctx.beginPath()
        ctx.moveTo(centerX + Math.cos(angle) * innerRadius, centerY + Math.sin(angle) * innerRadius)
        ctx.lineTo(centerX + Math.cos(angle) * outerRadius, centerY + Math.sin(angle) * outerRadius)
        ctx.stroke()
      }
      ctx.restore()
      return
    }

    if (style === 'spiral') {
      ctx.strokeStyle = wave.color.replace('ALPHA', wave.opacity.toFixed(3))
      ctx.lineWidth = 1.6 * wave.opacity
      ctx.beginPath()
      const turns = 1.7
      const spiralPoints = 90
      for (let i = 0; i <= spiralPoints; i++) {
        const progress = i / spiralPoints
        const angle = wave.phase + progress * Math.PI * 2 * turns + time * 1.8
        const radius = wave.radius - 18 + progress * 36
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.restore()
      return
    }

    if (style === 'constellation') {
      const starCount = 12
      ctx.fillStyle = wave.color.replace('ALPHA', wave.opacity.toFixed(3))
      for (let i = 0; i < starCount; i++) {
        const angle = (i / starCount) * Math.PI * 2 + wave.phase
        const radius = wave.radius + Math.sin(i * 4.1 + wave.frequency) * 8
        ctx.beginPath()
        ctx.arc(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius, 1.5 * wave.opacity, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
      return
    }
    if (style === 'spectrum') {
      const bars = 28
      ctx.strokeStyle = wave.color.replace('ALPHA', wave.opacity.toFixed(3))
      ctx.lineWidth = 1.8 * wave.opacity
      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2
        const modulation = 0.5 + 0.5 * Math.sin(i * 1.9 + wave.frequency / 95)
        const innerRadius = wave.radius - 3
        const outerRadius = innerRadius + 4 + modulation * 10 * wave.opacity
        ctx.beginPath()
        ctx.moveTo(centerX + Math.cos(angle) * innerRadius, centerY + Math.sin(angle) * innerRadius)
        ctx.lineTo(centerX + Math.cos(angle) * outerRadius, centerY + Math.sin(angle) * outerRadius)
        ctx.stroke()
      }
      ctx.restore()
      return
    }

    if (style === 'satellites') {
      const satelliteCount = 3
      ctx.fillStyle = wave.color.replace('ALPHA', wave.opacity.toFixed(3))
      for (let i = 0; i < satelliteCount; i++) {
        const angle = time * (1.2 + i * 0.15) + wave.phase + (i * Math.PI * 2) / satelliteCount
        const radius = wave.radius + 7 + i * 4
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        ctx.beginPath()
        ctx.arc(x, y, (2.2 - i * 0.35) * wave.opacity, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
      return
    }

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const timeSpeed = style === 'membrane' ? 2.6 : (isBackground ? 3.5 : 7.5)
      const amplitude = style === 'membrane' ? 7 : (isBackground ? 2.5 : 4.5)
      const ripple = Math.sin(angle * wave.frequency + time * timeSpeed) * (amplitude * wave.opacity)
      const r = wave.radius + ripple

      const x = centerX + orbitX + Math.cos(angle) * r
      const y = centerY + orbitY + Math.sin(angle) * r

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    ctx.strokeStyle = wave.color.replace('ALPHA', wave.opacity.toFixed(3))
    ctx.lineWidth = (isBackground ? 1.4 : 2.0) * wave.opacity
    if (isBackground && style === 'segments') {
      ctx.lineWidth = 2.4 * wave.opacity
      ctx.setLineDash([16, 12])
      ctx.lineDashOffset = -time * 20
    }
    if (isBackground && style === 'membrane') {
      ctx.lineWidth = 2.2 * wave.opacity
      ctx.fillStyle = wave.color.replace('ALPHA', (wave.opacity * 0.08).toFixed(3))
      ctx.shadowColor = wave.color.replace('ALPHA', (wave.opacity * 0.2).toFixed(3))
      ctx.shadowBlur = 5
      ctx.fill()
    }
    ctx.stroke()
    ctx.restore()
  })
}

// Visual context for harmonic sound waves
let activeVisualContext = null

export function startVisualAnimation(avatarEl) {
  if (activeVisualContext && activeVisualContext.isRunning) {
    activeVisualContext.avatarEl = avatarEl
    return {
      pushWave: activeVisualContext.pushWave,
      stop: () => {
        activeVisualContext.isRunning = false
      }
    }
  }

  const parent = avatarEl.parentElement || avatarEl
  parent.classList.add('tw-relative')
  const originalAvatarPosition = avatarEl.style.position
  const originalAvatarZIndex = avatarEl.style.zIndex
  if (!originalAvatarPosition) avatarEl.style.position = 'relative'
  avatarEl.style.zIndex = '1'

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
    canvasSize,
    originalAvatarPosition,
    originalAvatarZIndex
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

  const pushWave = (freq, role = 'avatar') => {
    if (!activeVisualContext) return
    if (activeVisualContext.waves.length >= MAX_ACTIVE_WAVES) {
      activeVisualContext.waves.splice(0, activeVisualContext.waves.length - MAX_ACTIVE_WAVES + 1)
    }
    activeVisualContext.waves.push({
      radius: activeVisualContext.avatarRadius + (role === 'background' ? 8 : -4),
      maxRadius: activeVisualContext.canvasSize / 2,
      speed: role === 'background' ? 38 + (freq / 700) * 12 : 60 + (freq / 700) * 25,
      frequency: role === 'background' ? 2 + Math.floor((freq / 260) % 3) : 3 + Math.floor((freq / 200) % 4),
      opacity: role === 'background' ? 0.55 : 0.95,
      role,
      style: role === 'background' ? 'constellation' : null,
      phase: Math.random() * Math.PI * 2,
      color: role === 'background' ? 'rgba(251, 191, 36, ALPHA)' : colors[activeVisualContext.colorIdx++ % colors.length]
    })
  }
  vContext.pushWave = pushWave

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
    if (!playerStore.getState().isPlaying && vContext.waves.length === 0) {
      cleanup()
    }
  }

  const cleanup = () => {
    vContext.isRunning = false
    if (vContext.unsubscribeFrame) vContext.unsubscribeFrame()
    window.removeEventListener('resize', updatePosition)
    if (vContext.canvas.parentElement) {
      vContext.canvas.remove()
    }
    vContext.avatarEl.style.position = vContext.originalAvatarPosition
    vContext.avatarEl.style.zIndex = vContext.originalAvatarZIndex
    if (activeVisualContext === vContext) {
      activeVisualContext = null
    }
  }

  vContext.unsubscribeFrame = avatarFrameLoop.subscribe(animate)

  return {
    pushWave,
    stop: cleanup
  }
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
  particle.style.fontSize = isTick ? '13px' : text ? '15px' : `${15 + Math.random() * 10}px`
  particle.style.color = isTick ? '#38bdf8' : Math.random() > 0.4 ? 'rgb(var(--primary))' : '#fbbf24'
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
    this.eventListeners = new Set()
    this.audioContextInstance = null
    this.metronomeGainNode = null
    this.currentPlayback = null
    this.unsubscribeProgress = null
    this.activeTimeouts = new Set()
    this.songs = SONGS_MANIFEST
    const initialSong = typeof window !== 'undefined' ? getRandomSong(this.songs) : DEFAULT_SONG
    this.state = {
      phraseIndex: 0,
      isPlaying: false,
      isContinuous: false,
      isMetronome: false,
      progress: 0,
      currentBar: 1,
      currentBeat: 1,
      song: initialSong,
      metadata: null,
      phrase: null
    }

    // Pre-fetch lightweight metadata for the initial song (only ~5KB)
    if (typeof window !== 'undefined') this.initDefaultSong()
  }

  async initDefaultSong() {
    try {
      const metadata = await ensureSongMetadataLoaded(this.state.song)
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

  subscribeEvents(listener) {
    this.eventListeners.add(listener)
    return () => this.eventListeners.delete(listener)
  }

  emitEvent(event) {
    this.eventListeners.forEach((listener) => listener(event))
  }

  getAudioContext() {
    if (!this.audioContextInstance && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      this.audioContextInstance = new AudioCtx()
      this.metronomeGainNode = this.audioContextInstance.createGain()
      this.metronomeGainNode.gain.setValueAtTime(
        this.state.isMetronome ? 1.0 : 0.0,
        this.audioContextInstance.currentTime
      )
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
    if (this.unsubscribeProgress) {
      this.unsubscribeProgress()
      this.unsubscribeProgress = null
    }

    const currentPhrase = this.state.phrase
    this.setState({
      isPlaying: false,
      progress: 0,
      currentBar: currentPhrase ? currentPhrase.startBar : 1,
      currentBeat: currentPhrase ? currentPhrase.startBeat : 1
    })
  }

  async playVerse(targetIndex) {
    const song = this.state.song
    let metadata = this.state.metadata
    if (!metadata) {
      metadata = await ensureSongMetadataLoaded(song)
      this.setState({ metadata })
    }

    const phrases = metadata.phrases || []
    if (!phrases.length) return

    let notes
    try {
      notes = await ensureSongNotesLoaded(song)
    } catch (err) {
      console.error('Error loading song notes:', err)
      return
    }

    const timeline = buildSongTimeline(metadata, notes)
    const newIdx = (targetIndex + phrases.length) % phrases.length
    const phrase = timeline.phrases[newIdx]
    this.stop()

    const ctx = this.getAudioContext()
    if (ctx.state === 'suspended') await ctx.resume()
    if (this.metronomeGainNode) {
      this.metronomeGainNode.gain.setValueAtTime(this.state.isMetronome ? 1.0 : 0.0, ctx.currentTime)
    }

    const startTime = ctx.currentTime + (this.state.isContinuous ? 0.15 : 0.05)
    const activeNodes = []
    const startOffset = phrase.offset
    const cycleDuration = timeline.duration
    const session = {
      startTime,
      startOffset,
      scheduledUntil: startTime,
      extensionTimer: null,
      completionId: null,
      continuous: this.state.isContinuous,
      stopped: false
    }
    const lookAheadSeconds = 8

    const masterGain = ctx.createGain()
    const masterLevel = getPhraseMasterLevel(phrase)
    masterGain.gain.setValueAtTime(masterLevel, startTime)
    masterGain.connect(ctx.destination)
    activeNodes.push(masterGain)

    this.setState({
      phraseIndex: newIdx,
      phrase,
      isPlaying: true,
      progress: 0,
      currentBar: phrase.startBar,
      currentBeat: phrase.startBeat
    })
    trackMidiEvent('play_verse', { phrase_index: newIdx, title: phrase.title, duration: phrase.duration })

    const relativeOffset = (offset) => ((offset - startOffset) % cycleDuration + cycleDuration) % cycleDuration
    const scheduleWindow = (windowStartOffset) => {
      const windowEndOffset = windowStartOffset + lookAheadSeconds
      const scheduleOccurrences = (offset, callback) => {
        const relative = relativeOffset(offset)
        let cycle = Math.floor((windowStartOffset - relative) / cycleDuration)
        let occurrence = relative + cycle * cycleDuration
        while (occurrence < windowEndOffset) {
          if (occurrence >= windowStartOffset) callback(startTime + occurrence)
          cycle++
          occurrence = relative + cycle * cycleDuration
        }
      }

      timeline.phrases.forEach((currentPhrase) => {
        const phraseLevel = getPhraseMasterLevel(currentPhrase)
        scheduleOccurrences(currentPhrase.offset, (phraseTime) => {
          masterGain.gain.setValueAtTime(phraseLevel, phraseTime)
        })
      })

      timeline.notes.forEach((note) => {
        scheduleOccurrences(note.audioOffset, (noteTime) => {
        const buffer = getPluckBuffer(ctx, note.freq, Math.min(note.dur + 1.2, 3.5))
        const source = ctx.createBufferSource()
        source.buffer = buffer
        const noteGain = ctx.createGain()
        const noteLevel = note.hand === 'left' ? note.vel * 0.62 : note.vel
        noteGain.gain.setValueAtTime(noteLevel, noteTime)
        noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.dur + 1.0)
        source.connect(noteGain)
        noteGain.connect(masterGain)
        source.start(noteTime)
        source.stop(noteTime + note.dur + 1.2)
        activeNodes.push(source)
        this.emitEvent({
          type: 'note-scheduled',
          audioTime: noteTime,
          frequency: note.freq,
          velocity: note.vel,
          name: note.name,
          role: note.hand === 'left' ? 'background' : 'avatar'
        })
        })
      })

      if (!this.metronomeGainNode) return
      const beatsPerBar = metadata.beatsPerBar || song.beatsPerBar || 4
      const accents = metadata.accents || song.accents || [1]
      timeline.phrases.forEach((currentPhrase) => {
        const totalBeats = Math.max(1, (currentPhrase.endBar - currentPhrase.startBar) * beatsPerBar + (currentPhrase.endBeat - currentPhrase.startBeat))
        const secondsPerBeat = currentPhrase.duration / totalBeats
        for (let beatIdx = 0; beatIdx < totalBeats; beatIdx++) {
          const beatOffset = currentPhrase.offset + beatIdx * secondsPerBeat
          const beatInBar = ((currentPhrase.startBeat - 1 + beatIdx) % beatsPerBar) + 1
          const isDownbeat = beatInBar === 1
          scheduleOccurrences(beatOffset, (beatTime) => {
            activeNodes.push(playMetronomeClick(ctx, this.metronomeGainNode, beatTime, accents.includes(beatInBar)))
            if (isDownbeat) {
              this.emitEvent({
                type: 'beat-scheduled',
                audioTime: beatTime,
                label: `⏱ Bar ${currentPhrase.startBar + Math.floor((currentPhrase.startBeat - 1 + beatIdx) / beatsPerBar)}.1`
              })
            }
            })
        }
      })
    }

    const scheduleMore = () => {
      if (session.stopped) return
      const delay = Math.max(0, (session.scheduledUntil - ctx.currentTime - 1) * 1000)
      const id = setTimeout(() => {
        this.activeTimeouts.delete(id)
        session.extensionTimer = null
        scheduleWindow(session.scheduledUntil - startTime)
        session.scheduledUntil += lookAheadSeconds
        scheduleMore()
      }, delay)
      this.activeTimeouts.add(id)
      session.extensionTimer = id
    }

    let finishPlayback = null
    if (session.continuous) {
      scheduleWindow(0)
      session.scheduledUntil += lookAheadSeconds
      scheduleMore()
    } else {
      const phraseEnd = startTime + phrase.duration
      timeline.notes
        .filter((note) => note.phraseIndex === newIdx)
        .forEach((note) => {
          const noteTime = startTime + note.time
          const buffer = getPluckBuffer(ctx, note.freq, Math.min(note.dur + 1.2, 3.5))
          const source = ctx.createBufferSource()
          source.buffer = buffer
          const noteGain = ctx.createGain()
          const noteLevel = note.hand === 'left' ? note.vel * 0.62 : note.vel
          noteGain.gain.setValueAtTime(noteLevel, noteTime)
          noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.dur + 1.0)
          source.connect(noteGain)
          noteGain.connect(masterGain)
          source.start(noteTime)
          source.stop(noteTime + note.dur + 1.2)
          activeNodes.push(source)
          this.emitEvent({ type: 'note-scheduled', audioTime: noteTime, frequency: note.freq, velocity: note.vel, name: note.name, role: note.hand === 'left' ? 'background' : 'avatar' })
        })
      if (this.metronomeGainNode) {
        const beatsPerBar = metadata.beatsPerBar || song.beatsPerBar || 4
        const accents = metadata.accents || song.accents || [1]
        const totalBeats = Math.max(
          1,
          (phrase.endBar - phrase.startBar) * beatsPerBar + (phrase.endBeat - phrase.startBeat)
        )
        const secondsPerBeat = phrase.duration / totalBeats
        for (let beatIdx = 0; beatIdx < totalBeats; beatIdx++) {
          const beatTime = startTime + beatIdx * secondsPerBeat
          const beatInBar = ((phrase.startBeat - 1 + beatIdx) % beatsPerBar) + 1
          activeNodes.push(playMetronomeClick(ctx, this.metronomeGainNode, beatTime, accents.includes(beatInBar)))
          if (beatInBar === 1) {
            this.emitEvent({
              type: 'beat-scheduled',
              audioTime: beatTime,
              label: `⏱ Bar ${phrase.startBar + Math.floor((phrase.startBeat - 1 + beatIdx) / beatsPerBar)}.1`
            })
          }
        }
      }
      masterGain.gain.setValueAtTime(masterLevel, startTime + Math.max(0, phrase.duration - 0.2))
      masterGain.gain.linearRampToValueAtTime(0.001, startTime + phrase.duration + 0.4)
      finishPlayback = () => {
        if (!this.state.isPlaying) return
        this.stop()
        const nextIdx = (this.state.phraseIndex + 1) % phrases.length
        const nextPhrase = timeline.phrases[nextIdx]
        this.setState({
          phraseIndex: nextIdx,
          phrase: nextPhrase,
          progress: 0,
          currentBar: nextPhrase.startBar,
          currentBeat: nextPhrase.startBeat
        })
      }
      const completionId = setTimeout(() => {
        this.activeTimeouts.delete(completionId)
        session.completionId = null
        finishPlayback()
      }, Math.max(0, (phraseEnd - ctx.currentTime) * 1000))
      this.activeTimeouts.add(completionId)
      session.completionId = completionId
      session.scheduledUntil = phraseEnd
    }

    let lastProgressBucket = -1
    const updateProgress = () => {
      if (session.stopped || !this.state.isPlaying) return
      const elapsed = Math.max(0, ctx.currentTime - startTime)
      if (!this.state.isContinuous && elapsed >= phrase.duration) {
        finishPlayback()
        return
      }
      const songOffset = session.continuous
        ? (startOffset + elapsed) % cycleDuration
        : Math.min(startOffset + elapsed, startOffset + phrase.duration)
      const position = getPhrasePosition(timeline, songOffset, metadata.beatsPerBar || song.beatsPerBar || 4)
      if (!position) return
      const progressBucket = Math.floor(position.progress * 10)
      if (progressBucket !== lastProgressBucket || position.phrase.index !== this.state.phraseIndex) {
        lastProgressBucket = progressBucket
      }
      this.setState({
        phraseIndex: position.phrase.index,
        progress: Math.min(0.999, position.progress),
        currentBar: position.currentBar,
        currentBeat: position.currentBeat
      })
    }
    this.unsubscribeProgress = avatarFrameLoop.subscribe(updateProgress)

    this.currentPlayback = {
      stop: () => {
        session.stopped = true
        activeNodes.forEach((node) => {
          try {
            if (typeof node.stop === 'function') node.stop()
            node.disconnect()
          } catch (e) {}
        })
      },
      setContinuous: (enabled) => {
        if (session.stopped || session.continuous === enabled) return
        session.continuous = enabled

        if (enabled) {
          const currentOffset = (startOffset + Math.max(0, ctx.currentTime - startTime)) % cycleDuration
          resetMasterGainForLoop(masterGain, ctx.currentTime, getPhraseMasterLevel(findPhraseAtOffset(timeline, currentOffset)))
          if (session.completionId) {
            clearTimeout(session.completionId)
            this.activeTimeouts.delete(session.completionId)
            session.completionId = null
          }
          if (!session.extensionTimer) {
            session.scheduledUntil = Math.max(session.scheduledUntil, ctx.currentTime)
            scheduleWindow(session.scheduledUntil - startTime)
            session.scheduledUntil += lookAheadSeconds
            scheduleMore()
          }
        } else if (session.extensionTimer) {
          clearTimeout(session.extensionTimer)
          this.activeTimeouts.delete(session.extensionTimer)
          session.extensionTimer = null
        }

        if (!enabled) {
          const elapsed = Math.max(0, ctx.currentTime - startTime)
          const songOffset = (startOffset + elapsed) % cycleDuration
          const currentPhrase = timeline.phrases[this.state.phraseIndex]
          let remaining = currentPhrase.offset + currentPhrase.duration - songOffset
          if (remaining <= 0) remaining += cycleDuration
          const completionId = setTimeout(() => {
            this.activeTimeouts.delete(completionId)
            session.completionId = null
            finishPlayback()
          }, remaining * 1000)
          this.activeTimeouts.add(completionId)
          session.completionId = completionId
        }
      }
    }
  }

  togglePlay() {
    if (this.state.isPlaying) {
      this.stop()
    } else {
      this.playVerse(this.state.phraseIndex)
    }
  }

  nextVerse() {
    const total = this.state.metadata ? this.state.metadata.phrases.length : 1
    const nextIdx = (this.state.phraseIndex + 1) % total
    if (this.state.isPlaying) {
      this.playVerse(nextIdx)
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

  prevVerse() {
    const total = this.state.metadata ? this.state.metadata.phrases.length : 1
    const prevIdx = (this.state.phraseIndex - 1 + total) % total
    if (this.state.isPlaying) {
      this.playVerse(prevIdx)
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
    const nextValue = !this.state.isContinuous
    this.setState({ isContinuous: nextValue })
    if (this.state.isPlaying && this.currentPlayback?.setContinuous) {
      this.currentPlayback.setContinuous(nextValue)
    }
  }

  toggleMetronome() {
    const nextVal = !this.state.isMetronome
    this.setState({ isMetronome: nextVal })

    // Real-time instant audio gain toggle mid-playback
    if (this.metronomeGainNode && this.audioContextInstance) {
      this.metronomeGainNode.gain.setValueAtTime(nextVal ? 1.0 : 0.0, this.audioContextInstance.currentTime)
    }
  }

  async selectSong(songId) {
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
        this.playVerse(0)
      }
    } catch (e) {
      console.error('Error switching song:', e)
    }
  }

  cycleSong() {
    const curIdx = this.songs.findIndex((s) => s.id === this.state.song.id)
    const nextIdx = (curIdx + 1) % this.songs.length
    this.selectSong(this.songs[nextIdx].id)
  }

  selectRandomSong() {
    if (this.songs.length < 2) return
    const currentIndex = this.songs.findIndex((s) => s.id === this.state.song.id)
    const offset = 1 + Math.floor(Math.random() * (this.songs.length - 1))
    const targetIndex = (currentIndex + offset) % this.songs.length
    this.selectSong(this.songs[targetIndex].id)
  }
}

export const playerStore = new PlayerStore()
