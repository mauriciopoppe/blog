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
  if (currentAnimationCancel) {
    currentAnimationCancel()
    currentAnimationCancel = null
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
    const tickTime = startTime + b * EIGHTH_SEC
    const currentAbsBeat = startAbsBeat + b
    const currentBar = Math.floor(currentAbsBeat / 6) + 1
    const currentBeat = (currentAbsBeat % 6) + 1
    const isDownbeat = currentBeat === 1

    if (isMetronomeEnabled) {
      const clickNode = playMetronomeClick(ctx, ctx.destination, tickTime, isDownbeat)
      activeSources.push(clickNode)
    }

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

function startVisualAnimation(avatarEl: HTMLElement, durationSec: number) {
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

  const waves: HarmonicWave[] = []
  let colorIdx = 0

  ;(window as any).__avatarWavePush = (freq: number) => {
    waves.push({
      radius: rect.width / 2 - 4,
      maxRadius: canvasSize / 2,
      speed: 60 + (freq / 700) * 25,
      frequency: 3 + Math.floor((freq / 200) % 4),
      opacity: 0.95,
      color: colors[colorIdx++ % colors.length]
    })
  }

  let isRunning = true
  let lastTime = performance.now()
  const startTime = lastTime

  function animate(now: number) {
    if (!ctx || !isRunning) return
    const dt = Math.min((now - lastTime) / 1000, 0.05)
    lastTime = now
    const elapsed = (now - startTime) / 1000

    const curRect = avatarEl.getBoundingClientRect()
    canvas.style.top = `${curRect.top + curRect.height / 2 - canvasSize / 2}px`
    canvas.style.left = `${curRect.left + curRect.width / 2 - canvasSize / 2}px`

    ctx.clearRect(0, 0, canvasSize, canvasSize)

    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i]
      w.radius += w.speed * dt
      const progress = (w.radius - rect.width / 2) / (w.maxRadius - rect.width / 2)
      w.opacity = Math.max(0, 1.0 - Math.pow(progress, 1.4))
      if (w.opacity <= 0.01) {
        waves.splice(i, 1)
      }
    }

    renderHarmonicRibbons(ctx, canvasSize, canvasSize, waves, elapsed)

    if (isRunning && elapsed < durationSec + 1.0) {
      requestAnimationFrame(animate)
    } else {
      cleanup()
    }
  }

  const cleanup = () => {
    isRunning = false
    delete (window as any).__avatarWavePush
    if (canvas.parentElement) {
      canvas.remove()
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
  player.className = 'js-avatar-mini-player avatar-mini-player'
  player.innerHTML = `
    <div class="mini-player-track">
      <div class="mini-player-progress-bar js-mini-player-progress"></div>
    </div>
    <div class="mini-player-body">
      <div class="mini-player-header">
        <span class="mini-player-icon">${song.icon}</span>
        <div class="mini-player-meta">
          <span class="mini-player-artist">${song.artist}</span>
          <span class="mini-player-bullet">•</span>
          <span class="mini-player-song-name">${song.name}</span>
        </div>
      </div>
      <div class="mini-player-verse-row">
        <span class="mini-player-verse-title js-mini-player-title">${phrase.title}</span>
        <span class="mini-player-ticker js-mini-player-ticker">119 BPM</span>
      </div>
      <div class="mini-player-controls">
        <button class="mini-btn js-btn-prev" title="Previous verse (⏮)">⏮</button>
        <button class="mini-btn mini-btn-play js-btn-play" title="Play (▶)">▶</button>
        <button class="mini-btn js-btn-next" title="Next verse (⏭)">⏭</button>
        <button class="mini-btn js-btn-metro ${isMetronomeEnabled ? 'is-active' : ''}" title="Toggle Metronome (⏱)">⏱ Metro</button>
        <button class="mini-btn js-btn-loop ${isContinuous ? 'is-active' : ''}" title="Continuous Playback (🔁)">🔁 Auto</button>
      </div>
    </div>
  `

  if (!document.getElementById('avatar-mini-player-style')) {
    const style = document.createElement('style')
    style.id = 'avatar-mini-player-style'
    style.textContent = `
      .avatar-mini-player {
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%) translateY(8px) scale(0.96);
        opacity: 0;
        pointer-events: none;
        z-index: 50;
        background: var(--grey-dark, #18181b);
        border: 1px solid rgba(var(--primary, 255 112 67), 0.35);
        border-radius: 12px;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.65), 0 0 16px rgba(var(--primary, 255 112 67), 0.2);
        padding: 8px 12px;
        width: 275px;
        box-sizing: border-box;
        font-family: var(--family-sans, system-ui, sans-serif);
        user-select: none;
        transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease, border-color 0.2s ease;
      }
      .avatar-mini-player.is-hovered,
      .avatar-mini-player:hover {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(-50%) translateY(0px) scale(1);
      }
      .mini-player-track {
        width: 100%;
        height: 5px;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 9999px;
        overflow: hidden;
        margin-bottom: 7px;
        position: relative;
      }
      .mini-player-progress-bar {
        width: 0%;
        height: 100%;
        background: rgb(var(--primary, 255 112 67));
        box-shadow: 0 0 12px rgba(var(--primary, 255 112 67), 0.9);
        border-radius: 9999px;
      }
      .mini-player-body {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .mini-player-header {
        display: flex;
        align-items: center;
        gap: 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 4px;
      }
      .mini-player-icon {
        font-size: 13px;
        line-height: 1;
      }
      .mini-player-meta {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mini-player-artist {
        color: rgb(var(--primary, 255 112 67));
        font-weight: 700;
      }
      .mini-player-bullet {
        color: var(--grey-light, #a1a1aa);
        font-size: 10px;
      }
      .mini-player-song-name {
        color: var(--grey-lighter, #f4f4f5);
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mini-player-verse-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
        font-size: 10.5px;
        line-height: 1.2;
      }
      .mini-player-verse-title {
        color: var(--grey-light, #d4d4d8);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 190px;
      }
      .mini-player-ticker {
        color: rgb(var(--primary, 255 112 67));
        font-size: 9.5px;
        font-weight: bold;
        white-space: nowrap;
        background: rgba(var(--primary, 255 112 67), 0.12);
        padding: 1px 5px;
        border-radius: 4px;
        border: 1px solid rgba(var(--primary, 255 112 67), 0.25);
      }
      .mini-player-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        margin-top: 2px;
      }
      .mini-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: var(--grey-lighter, #e4e4e7);
        border-radius: 6px;
        padding: 3px 6px;
        font-size: 10.5px;
        cursor: pointer;
        line-height: 1;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
      }
      .mini-btn:hover {
        background: rgba(var(--primary, 255 112 67), 0.2);
        border-color: rgba(var(--primary, 255 112 67), 0.5);
        color: rgb(var(--primary, 255 112 67));
        transform: scale(1.05);
      }
      .mini-btn.mini-btn-play {
        background: rgba(var(--primary, 255 112 67), 0.25);
        border-color: rgba(var(--primary, 255 112 67), 0.6);
        color: rgb(var(--primary, 255 112 67));
        font-weight: bold;
        padding: 3px 10px;
      }
      .mini-btn.is-active {
        background: rgba(var(--primary, 255 112 67), 0.35);
        border-color: rgb(var(--primary, 255 112 67));
        color: #fff;
        box-shadow: 0 0 8px rgba(var(--primary, 255 112 67), 0.5);
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
      playVerse(prevIdx, avatar)
    })
  }

  if (btnPlay) {
    btnPlay.addEventListener('click', (e) => {
      e.stopPropagation()
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
      playVerse(nextIdx, avatar)
    })
  }

  if (btnMetro) {
    btnMetro.addEventListener('click', (e) => {
      e.stopPropagation()
      isMetronomeEnabled = !isMetronomeEnabled
      btnMetro.classList.toggle('is-active', isMetronomeEnabled)
      if (isPlaying) {
        // Re-trigger current verse with new metronome state
        playVerse(phraseIndex, avatar)
      }
    })
  }

  if (btnLoop) {
    btnLoop.addEventListener('click', (e) => {
      e.stopPropagation()
      isContinuous = !isContinuous
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
  })

  const players = document.querySelectorAll<HTMLElement>('.js-avatar-mini-player')
  players.forEach((p) => {
    p.classList.toggle('is-playing', isPlaying)
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
      avatar.setAttribute('title', '🥀 Click to play Sheena Ringo - Crime and Punishment (罪と罰)!')

      setupAvatarMiniPlayer(avatar)

      avatar.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isPlaying) {
          // If playing, advance to next verse
          playVerse((phraseIndex + 1) % getCurrentSong().phrases.length, avatar)
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
