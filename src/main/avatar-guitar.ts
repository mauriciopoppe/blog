/*
 * Avatar Interactive Acoustic Guitar: Mini Bar Player with Continuous Playback & Metronome
 *
 * Full multi-verse player for Sheena Ringo's "Crime and Punishment" (罪と罰).
 * Features:
 * - Hover-only interactive mini bar player mounted above avatar
 * - Displays Singer (Sheena Ringo) & Song Name (Crime and Punishment)
 * - Real-time smooth progress bar animation synced across viewports
 * - Play / Pause icon toggles with state
 * - Continuous playback starts disabled (toggleable)
 * - Single verse skip forward/back
 * - Enable/Disable metronome toggle
 * - Exact [bar.beat] semi-open interval tracking
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { MIDI_SONGS, MidiNote, MidiSong } from './songs-midi.js'

// Karplus-Strong string synthesis: acoustic guitar physical modeling
export function generatePluckBuffer(
  audioCtx: AudioContext,
  frequency: number,
  duration = 2.2,
  decay = 0.992,
  brightness = 0.76
): AudioBuffer {
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
  audioCtx: AudioContext,
  destination: AudioNode,
  time: number,
  isAccent: boolean
): AudioNode {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(isAccent ? 1350 : 850, time)
  osc.frequency.exponentialRampToValueAtTime(isAccent ? 600 : 400, time + 0.025)

  gain.gain.setValueAtTime(isAccent ? 0.55 : 0.35, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035)

  osc.connect(gain)
  gain.connect(destination)

  osc.start(time)
  osc.stop(time + 0.04)

  return osc
}

// Google Analytics event dispatcher for mini midi player
export function trackMidiEvent(action: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return
  try {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', `midi_${action}`, {
        event_category: 'avatar_mini_player',
        ...params
      })
    } else if (typeof (window as any).ga === 'function') {
      (window as any).ga('send', 'event', 'avatar_mini_player', action, params.label || '')
    }
  } catch (e) {
    // Non-blocking analytics
  }
}

// Global Player State
let phraseIndex = 0
let isPlaying = false
let isContinuous = false // Starts disabled as requested
let isMetronomeEnabled = false
let audioContextInstance: AudioContext | null = null
let currentPlayback: { stop: () => void } | null = null
let currentAnimationCancel: (() => void) | null = null
let progressAnimId: number | null = null

export function getCurrentSong(): MidiSong {
  return MIDI_SONGS[0]
}

export function getAudioContext(): AudioContext {
  if (!audioContextInstance && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    audioContextInstance = new AudioCtx()
  }
  return audioContextInstance!
}

export function stopPlayback() {
  isPlaying = false
  if (currentPlayback) {
    currentPlayback.stop()
    currentPlayback = null
  }
  if (currentAnimationCancel) {
    currentAnimationCancel()
    currentAnimationCancel = null
  }
  if (progressAnimId !== null) {
    cancelAnimationFrame(progressAnimId)
    progressAnimId = null
  }
  updateMiniPlayerUI()
}

export function playVerse(
  targetIndex: number,
  avatarEl?: HTMLElement
) {
  const song = getCurrentSong()
  phraseIndex = (targetIndex + song.phrases.length) % song.phrases.length
  const phrase = song.phrases[phraseIndex]

  if (currentPlayback) {
    currentPlayback.stop()
    currentPlayback = null
  }
  if (progressAnimId !== null) {
    cancelAnimationFrame(progressAnimId)
    progressAnimId = null
  }

  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  isPlaying = true
  updateMiniPlayerUI()

  // Master output with acoustic body resonance filter
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0.18, ctx.currentTime)

  const bodyFilter = ctx.createBiquadFilter()
  bodyFilter.type = 'peaking'
  bodyFilter.frequency.value = 190
  bodyFilter.Q.value = 1.8
  bodyFilter.gain.value = 2.4

  masterGain.connect(bodyFilter)
  bodyFilter.connect(ctx.destination)

  const activeSources: (AudioBufferSourceNode | AudioNode)[] = []
  const activeTimers: number[] = []

  const startTime = ctx.currentTime + 0.04

  // 1. Schedule metronome ticks (if enabled)
  const BPM = 118.99992463338107
  const EIGHTH_SEC = 60 / (BPM * 2) // 0.25210084s per eighth note beat in 6/8
  const totalEighths = Math.round((phrase.duration || 12.1) / EIGHTH_SEC)
  const startAbsBeat = (phrase.startBar - 1) * 6 + (phrase.startBeat - 1)

  for (let b = 0; b < totalEighths; b++) {
    const currentAbsBeat = startAbsBeat + b
    const currentBar = Math.floor(currentAbsBeat / 6) + 1
    const currentBeat = (currentAbsBeat % 6) + 1
    const isDownbeat = currentBeat === 1

    const timer = window.setTimeout(() => {
      onTick(currentBar, currentBeat, isDownbeat)
    }, b * EIGHTH_SEC * 1000)
    activeTimers.push(timer)
  }

  // 2. Schedule MIDI guitar notes
  phrase.notes.forEach((note) => {
    const noteStart = startTime + note.time

    const stringBuffer = generatePluckBuffer(ctx, note.freq, note.dur + 0.8, 0.993, 0.76)
    const source = ctx.createBufferSource()
    source.buffer = stringBuffer

    const noteGain = ctx.createGain()
    const velScale = Math.min(1.25, Math.max(0.45, note.vel * 2.8))
    const vol = 0.52 * velScale
    noteGain.gain.setValueAtTime(vol, noteStart)
    noteGain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.dur + 0.6)

    source.connect(noteGain)
    noteGain.connect(masterGain)
    source.start(noteStart)
    activeSources.push(source)

    const timer = window.setTimeout(() => {
      onNote(note, song, avatarEl)
    }, note.time * 1000)
    activeTimers.push(timer)
  })

  const phraseDuration = phrase.duration || 12.1
  const lastNote = phrase.notes[phrase.notes.length - 1]
  const notesEnd = lastNote ? lastNote.time + lastNote.dur : 0
  // In continuous mode, transition strictly on the musical grid (phraseDuration) with 0 added delay
  const transitionDuration = isContinuous ? phraseDuration : Math.max(phraseDuration, notesEnd + 0.3)

  // Smooth continuous 60fps progress bar animation across all player instances
  const progressStart = performance.now()
  function stepProgress() {
    if (!isPlaying) return
    const elapsed = (performance.now() - progressStart) / 1000
    const pct = Math.min(100, Math.max(0, (elapsed / phraseDuration) * 100))
    const progressEls = document.querySelectorAll<HTMLElement>('.js-mini-player-progress')
    progressEls.forEach((el) => {
      el.style.width = `${pct}%`
    })
    if (elapsed < transitionDuration && isPlaying) {
      progressAnimId = requestAnimationFrame(stepProgress)
    }
  }
  progressAnimId = requestAnimationFrame(stepProgress)

  const endTimer = window.setTimeout(() => {
    if (isPlaying) {
      trackMidiEvent('verse_completed', {
        verse_index: phraseIndex,
        verse_title: phrase.title,
        continuous: isContinuous
      })
      if (isContinuous) {
        // Advance to next verse at exact interval boundary without any extra beat
        playVerse((phraseIndex + 1) % song.phrases.length, avatarEl)
      } else {
        // Advance phraseIndex so next click on Play continues where we left off
        phraseIndex = (phraseIndex + 1) % song.phrases.length
        stopPlayback()
      }
    }
  }, transitionDuration * 1000)
  activeTimers.push(endTimer)

  const stop = () => {
    activeTimers.forEach((t) => clearTimeout(t))
    activeSources.forEach((s) => {
      try {
        if ('stop' in s && typeof (s as any).stop === 'function') {
          (s as any).stop()
        }
      } catch (e) {}
    })
    try {
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05)
    } catch (e) {}
  }

  currentPlayback = { stop }

  // Launch visual wave ribbons and particle animation
  if (avatarEl) {
    startVisualAnimation(avatarEl, transitionDuration)
  }
}

function onNote(note: MidiNote, song: MidiSong, avatarEl?: HTMLElement) {
  if (!avatarEl) return

  avatarEl.style.transition = 'transform 0.06s ease-out'
  const rot = (Math.random() - 0.5) * 5
  const scale = note.freq > 500 ? 1.08 : 1.04
  avatarEl.style.transform = `scale(${scale}) rotate(${rot}deg)`

  spawnFloatingMusicParticle(avatarEl, note.name, false)

  setTimeout(() => {
    avatarEl.style.transition = 'transform 0.12s ease-out'
    avatarEl.style.transform = 'none'
  }, 75)

  if ((window as any).__avatarWavePush) {
    (window as any).__avatarWavePush(note.freq)
  }
}

function onTick(bar: number, beat: number, isDownbeat: boolean) {
  const tickEls = document.querySelectorAll<HTMLElement>('.js-mini-player-ticker')
  tickEls.forEach((el) => {
    el.textContent = `Bar ${bar}.${beat}`
  })

  if (isMetronomeEnabled) {
    const ctx = getAudioContext()
    if (ctx.state !== 'suspended') {
      playMetronomeClick(ctx, ctx.destination, ctx.currentTime, isDownbeat)
    }
  }

  if (isDownbeat && isMetronomeEnabled) {
    const avatars = document.querySelectorAll<HTMLElement>('.js-avatar-scene, .profile-avatar-scene')
    avatars.forEach((avatar) => {
      spawnFloatingMusicParticle(avatar, `⏱ Bar ${bar}.1`, true)
    })
  }
}

export interface HarmonicWave {
  radius: number
  maxRadius: number
  speed: number
  frequency: number
  opacity: number
  color: string
}

export function renderHarmonicRibbons(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  waves: HarmonicWave[],
  time: number
): void {
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

interface VisualContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  waves: HarmonicWave[]
  avatarEl: HTMLElement
  isRunning: boolean
  colorIdx: number
  startTime: number
  lastTime: number
  canvasSize: number
}

let activeVisualContext: VisualContext | null = null

function startVisualAnimation(avatarEl: HTMLElement, _durationSec: number) {
  if (activeVisualContext && activeVisualContext.isRunning) {
    // Keep active visual context running and smoothly update avatar element reference
    activeVisualContext.avatarEl = avatarEl
    return
  }

  const rect = avatarEl.getBoundingClientRect()
  const canvasSize = Math.max(260, rect.width * 4.0)
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const canvas = document.createElement('canvas')
  canvas.width = canvasSize * dpr
  canvas.height = canvasSize * dpr
  canvas.style.position = 'fixed'
  canvas.style.top = `${rect.top + rect.height / 2 - canvasSize / 2}px`
  canvas.style.left = `${rect.left + rect.width / 2 - canvasSize / 2}px`
  canvas.style.width = `${canvasSize}px`
  canvas.style.height = `${canvasSize}px`
  canvas.style.zIndex = '99999'
  canvas.style.pointerEvents = 'none'
  document.body.appendChild(canvas)

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

  const vContext: VisualContext = {
    canvas,
    ctx,
    waves: [],
    avatarEl,
    isRunning: true,
    colorIdx: 0,
    startTime: performance.now(),
    lastTime: performance.now(),
    canvasSize
  }
  activeVisualContext = vContext

  ;(window as any).__avatarWavePush = (freq: number) => {
    if (!activeVisualContext) return
    const curAvatar = activeVisualContext.avatarEl
    const curRect = curAvatar.getBoundingClientRect()
    activeVisualContext.waves.push({
      radius: curRect.width / 2 - 4,
      maxRadius: activeVisualContext.canvasSize / 2,
      speed: 60 + (freq / 700) * 25,
      frequency: 3 + Math.floor((freq / 200) % 4),
      opacity: 0.95,
      color: colors[activeVisualContext.colorIdx++ % colors.length]
    })
  }

  function animate(now: number) {
    if (!vContext.isRunning || !vContext.ctx) return
    const dt = Math.min((now - vContext.lastTime) / 1000, 0.05)
    vContext.lastTime = now
    const elapsed = (now - vContext.startTime) / 1000

    const curRect = vContext.avatarEl.getBoundingClientRect()
    vContext.canvas.style.top = `${curRect.top + curRect.height / 2 - vContext.canvasSize / 2}px`
    vContext.canvas.style.left = `${curRect.left + curRect.width / 2 - vContext.canvasSize / 2}px`

    vContext.ctx.clearRect(0, 0, vContext.canvasSize, vContext.canvasSize)

    for (let i = vContext.waves.length - 1; i >= 0; i--) {
      const w = vContext.waves[i]
      w.radius += w.speed * dt
      const progress = (w.radius - curRect.width / 2) / (w.maxRadius - curRect.width / 2)
      w.opacity = Math.max(0, 1.0 - Math.pow(progress, 1.4))
      if (w.opacity <= 0.01) {
        vContext.waves.splice(i, 1)
      }
    }

    renderHarmonicRibbons(vContext.ctx, vContext.canvasSize, vContext.canvasSize, vContext.waves, elapsed)

    if (isPlaying || vContext.waves.length > 0) {
      requestAnimationFrame(animate)
    } else {
      cleanup()
    }
  }

  const cleanup = () => {
    vContext.isRunning = false
    delete (window as any).__avatarWavePush
    if (vContext.canvas.parentElement) {
      vContext.canvas.remove()
    }
    if (activeVisualContext === vContext) {
      activeVisualContext = null
    }
  }

  currentAnimationCancel = cleanup
  requestAnimationFrame(animate)
}

// Spawns floating musical note or metronome tick particles when clicked
export function spawnFloatingMusicParticle(originEl: HTMLElement, text?: string, isTick?: boolean) {
  if (typeof document === 'undefined') return

  const rect = originEl.getBoundingClientRect()
  const scrollX = window.scrollX || window.pageXOffset || 0
  const scrollY = window.scrollY || window.pageYOffset || 0
  const particle = document.createElement('div')
  const defaultGlyphs = ['🥀', '♪', '♫', '✨']
  const displayText = text || defaultGlyphs[Math.floor(Math.random() * defaultGlyphs.length)]
  const startX = rect.left + scrollX + rect.width * (0.2 + Math.random() * 0.6)
  const startY = rect.top + scrollY + rect.height * 0.1

  particle.textContent = displayText
  particle.style.position = 'absolute'
  particle.style.left = `${startX}px`
  particle.style.top = `${startY}px`
  particle.style.zIndex = '999999'
  particle.style.pointerEvents = 'none'
  particle.style.fontSize = isTick ? '13px' : (text ? '15px' : `${15 + Math.random() * 10}px`)
  particle.style.color = isTick ? '#38bdf8' : (Math.random() > 0.4 ? 'rgb(var(--primary))' : '#fbbf24')
  particle.style.fontWeight = 'bold'
  particle.style.fontFamily = 'var(--family-sans, sans-serif)'
  particle.style.textShadow = isTick ? '0 0 8px rgba(56, 189, 248, 0.7)' : '0 0 10px rgba(255, 112, 67, 0.7)'
  particle.style.transition = 'all 0.9s cubic-bezier(0.25, 1, 0.5, 1)'
  particle.style.transform = 'translateY(0px) scale(0.6) rotate(0deg)'
  particle.style.opacity = '1'

  document.body.appendChild(particle)

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

// Builds the interactive hover-only mini bar player mounted above the avatar
export function setupAvatarMiniPlayer(avatar: HTMLElement) {
  const parent = avatar.parentElement
  if (!parent) return

  if (getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative'
  }

  if (parent.querySelector('.js-avatar-mini-player')) return

  const song = getCurrentSong()
  const phrase = song.phrases[phraseIndex]
  const player = document.createElement('div')

  const MINI_BTN_CLASS = 'tw-bg-[var(--grey-dark)]/80 tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-rounded-md tw-px-1.5 tw-py-0.5 tw-font-semibold tw-cursor-pointer tw-leading-none tw-shadow-subtle hover:tw-bg-primary-soft hover:tw-border-primary hover:tw-text-primary hover:tw-shadow-raised tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-0.5'
  const MINI_BTN_PLAY_CLASS = 'tw-bg-[var(--grey-dark)]/80 tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-lighter)] tw-rounded-md tw-px-2 tw-py-0.5 tw-font-bold tw-cursor-pointer tw-leading-none tw-shadow-subtle hover:tw-bg-primary-soft hover:tw-border-primary hover:tw-text-primary hover:tw-shadow-raised tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-0.5'

  player.className = 'js-avatar-mini-player avatar-mini-player tw-text-xs tw-absolute tw-bottom-[calc(100%+8px)] tw-left-1/2 -tw-translate-x-1/2 tw-translate-y-2 tw-scale-[0.96] tw-opacity-0 tw-pointer-events-none tw-z-50 tw-backdrop-blur-md tw-border tw-border-primary tw-rounded-xl tw-shadow-deep tw-p-2 tw-w-max tw-max-w-[calc(100vw-32px)] tw-box-border tw-select-none tw-transition-all tw-duration-200'
  player.style.background = 'color-mix(in srgb, var(--grey-darker) 85%, transparent)'
  player.innerHTML = `
    <div class="mini-player-body tw-flex tw-flex-col tw-gap-1">
      <div class="mini-player-header tw-flex tw-items-center tw-justify-between tw-gap-2 tw-border-b tw-border-white/10 tw-pb-1">
        <span class="mini-player-icon tw-text-sm tw-leading-none tw-shrink-0">${song.icon}</span>
        <div class="mini-player-meta tw-flex tw-flex-col tw-items-end tw-text-right tw-min-w-0 tw-leading-tight">
          <span class="mini-player-song-name tw-text-[var(--grey-lighter)] tw-font-bold tw-truncate">${song.name}</span>
          <span class="mini-player-artist tw-text-primary tw-font-medium tw-text-[0.68rem] tw-truncate">${song.artist}</span>
        </div>
      </div>
      <div class="mini-player-track tw-w-full tw-h-[2.5px] tw-bg-white/20 tw-rounded-full tw-overflow-hidden tw-my-0.5 tw-relative">
        <div class="mini-player-progress-bar js-mini-player-progress tw-w-0 tw-h-full tw-bg-primary tw-shadow-[0_0_10px_rgba(var(--primary),0.9)] tw-rounded-full"></div>
      </div>
      <div class="mini-player-verse-row tw-flex tw-justify-between tw-items-center tw-gap-1.5 tw-leading-tight">
        <span class="mini-player-verse-title js-mini-player-title tw-text-[var(--grey-light)] tw-font-medium tw-truncate tw-max-w-[170px]">${phrase.title}</span>
        <span class="mini-player-ticker js-mini-player-ticker tw-text-primary tw-font-bold tw-whitespace-nowrap tw-bg-primary-soft tw-px-1 tw-py-[1px] tw-rounded tw-border tw-border-primary/25 tw-text-[0.65rem] tw-leading-none">119 BPM</span>
      </div>
      <div class="mini-player-controls tw-flex tw-items-center tw-justify-center tw-gap-1 tw-mt-0.5">
        <button type="button" class="mini-btn js-btn-metro ${MINI_BTN_CLASS} ${isMetronomeEnabled ? 'is-active' : ''}" title="Toggle Metronome (⏱)">⏱ Metro</button>
        <button type="button" class="mini-btn js-btn-prev ${MINI_BTN_CLASS}" title="Previous verse (⏮)">⏮</button>
        <button type="button" class="mini-btn mini-btn-play js-btn-play ${MINI_BTN_PLAY_CLASS}" title="Play (▶)">▶</button>
        <button type="button" class="mini-btn js-btn-next ${MINI_BTN_CLASS}" title="Next verse (⏭)">⏭</button>
        <button type="button" class="mini-btn js-btn-loop ${MINI_BTN_CLASS} ${isContinuous ? 'is-active' : ''}" title="Continuous Playback (🔁)">🔁 Auto</button>
      </div>
    </div>
  `

  if (!document.getElementById('avatar-mini-player-style')) {
    const style = document.createElement('style')
    style.id = 'avatar-mini-player-style'
    style.textContent = `
      .avatar-mini-player.is-hovered,
      .avatar-mini-player:hover {
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: translateX(-50%) translateY(0px) scale(1) !important;
      }
      .mini-btn.is-active,
      .mini-btn.is-playing {
        background: rgba(var(--primary), 0.25) !important;
        border-color: rgb(var(--primary)) !important;
        color: rgb(var(--primary)) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 10px rgba(var(--primary), 0.4) !important;
      }
      .js-avatar-scene.is-playing {
        border-color: rgb(var(--primary)) !important;
        box-shadow: 0 0 14px rgba(var(--primary), 0.5), var(--elevation-raised) !important;
      }
    `
    document.head.appendChild(style)
  }

  parent.appendChild(player)

  // Hover visibility handling: show player ONLY when hovering the exact circular avatar or the player itself
  let hoverTimeout: number | null = null
  const onEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      hoverTimeout = null
    }
    player.classList.add('is-hovered')
  }
  const onLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    hoverTimeout = window.setTimeout(() => {
      player.classList.remove('is-hovered')
    }, 300)
  }

  avatar.addEventListener('mouseenter', onEnter)
  avatar.addEventListener('mouseleave', onLeave)
  player.addEventListener('mouseenter', onEnter)
  player.addEventListener('mouseleave', onLeave)

  // Attach button listeners
  const btnPrev = player.querySelector('.js-btn-prev')
  const btnPlay = player.querySelector('.js-btn-play')
  const btnNext = player.querySelector('.js-btn-next')
  const btnMetro = player.querySelector('.js-btn-metro')
  const btnLoop = player.querySelector('.js-btn-loop')

  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation()
      const prevIdx = (phraseIndex - 1 + song.phrases.length) % song.phrases.length
      trackMidiEvent('prev_verse', {
        from_index: phraseIndex,
        to_index: prevIdx,
        verse_title: song.phrases[prevIdx].title
      })
      playVerse(prevIdx, avatar)
    })
  }

  if (btnPlay) {
    btnPlay.addEventListener('click', (e) => {
      e.stopPropagation()
      trackMidiEvent('play_pause_click', {
        action_type: isPlaying ? 'pause' : 'play',
        verse_index: phraseIndex,
        verse_title: song.phrases[phraseIndex].title
      })
      if (isPlaying) {
        stopPlayback()
      } else {
        playVerse(phraseIndex, avatar)
      }
    })
  }

  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation()
      const nextIdx = (phraseIndex + 1) % song.phrases.length
      trackMidiEvent('next_verse', {
        from_index: phraseIndex,
        to_index: nextIdx,
        verse_title: song.phrases[nextIdx].title
      })
      playVerse(nextIdx, avatar)
    })
  }

  if (btnMetro) {
    btnMetro.addEventListener('click', (e) => {
      e.stopPropagation()
      isMetronomeEnabled = !isMetronomeEnabled
      trackMidiEvent('metronome_toggle', {
        enabled: isMetronomeEnabled,
        verse_index: phraseIndex
      })
      const allMetroBtns = document.querySelectorAll('.js-btn-metro')
      allMetroBtns.forEach((btn) => {
        btn.classList.toggle('is-active', isMetronomeEnabled)
      })
    })
  }

  if (btnLoop) {
    btnLoop.addEventListener('click', (e) => {
      e.stopPropagation()
      isContinuous = !isContinuous
      trackMidiEvent('continuous_toggle', {
        enabled: isContinuous,
        verse_index: phraseIndex
      })
      btnLoop.classList.toggle('is-active', isContinuous)
    })
  }
}

export function updateMiniPlayerUI() {
  const song = getCurrentSong()
  const phrase = song.phrases[phraseIndex % song.phrases.length]

  const titleEls = document.querySelectorAll<HTMLElement>('.js-mini-player-title')
  titleEls.forEach((el) => {
    el.textContent = phrase.title
  })

  const btnPlays = document.querySelectorAll<HTMLElement>('.js-btn-play')
  btnPlays.forEach((btn) => {
    btn.textContent = isPlaying ? '⏸' : '▶'
    btn.title = isPlaying ? 'Pause (⏸)' : 'Play (▶)'
    btn.classList.toggle('is-playing', isPlaying)
  })

  const players = document.querySelectorAll<HTMLElement>('.js-avatar-mini-player')
  players.forEach((p) => {
    p.classList.toggle('is-playing', isPlaying)
  })

  const avatars = document.querySelectorAll<HTMLElement>('.js-avatar-scene')
  avatars.forEach((a) => {
    a.classList.toggle('is-playing', isPlaying)
  })

  if (!isPlaying) {
    const progressEls = document.querySelectorAll<HTMLElement>('.js-mini-player-progress')
    progressEls.forEach((el) => {
      el.style.width = '0%'
    })
    const tickEls = document.querySelectorAll<HTMLElement>('.js-mini-player-ticker')
    tickEls.forEach((el) => {
      el.textContent = '119 BPM'
    })
  }
}

export function avatarGuitarMain() {
  if (typeof document === 'undefined') return

  const attachListener = () => {
    const avatars = document.querySelectorAll<HTMLElement>(
      '.profile-avatar-scene, .js-avatar-scene, .profile-avatar, .js-avatar-tilt, img[src*="2025-guitar2"]'
    )
    avatars.forEach((avatar) => {
      avatar.style.cursor = 'pointer'
      avatar.setAttribute('title', '🥀 Click to play/pause Sheena Ringo - Crime and Punishment (罪と罰)!')

      setupAvatarMiniPlayer(avatar)

      avatar.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        trackMidiEvent('avatar_click', {
          action_type: isPlaying ? 'pause' : 'play',
          verse_index: phraseIndex,
          verse_title: getCurrentSong().phrases[phraseIndex].title
        })
        if (isPlaying) {
          stopPlayback()
        } else {
          playVerse(phraseIndex, avatar)
        }
      })
    })
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    attachListener()
  } else {
    document.addEventListener('DOMContentLoaded', attachListener)
  }
}
