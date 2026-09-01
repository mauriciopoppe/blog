import { QuaternionSlerpEngine, SLERP_PRESETS } from './quaternion-slerp-engine.js'
import { html, render, useState, useEffect, useRef } from '../ui/preact.js'
import { WidgetFrame } from '../ui/WidgetFrame.js'
import { SegmentedGroup } from '../ui/SegmentedGroup.js'
import { RangeSlider } from '../ui/RangeSlider.js'
import { StepPlayback } from '../ui/StepPlayback.js'

function renderMath(tex, isDisplay = false) {
  if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(tex, { displayMode: isDisplay, throwOnError: false })
    } catch {
      return tex
    }
  }
  return tex
}

function renderTextWithMath(str) {
  if (!str) return ''
  return str.replace(/\$([^\$]+)\$/g, (_, math) => renderMath(math))
}

function fmtRad(v) {
  const val = Math.abs(v) < 0.0001 ? 0 : v
  return val.toFixed(2)
}

function fmtDeg(v) {
  const val = Math.abs(v) < 0.0001 ? 0 : v
  return `${((val * 180) / Math.PI).toFixed(1)}°`
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightCode(code) {
  return escapeHtml(code).replace(
    /(\/\/[^\n]*)|(\bconst\b|\bnew\b)|(\b\d+(?:\.\d+)?\b)|(\bTHREE\b)|(\.\w+\s*\()/g,
    (m, comment, keyword, number, cls, fn) => {
      if (comment) return `<span class="tok-comment">${comment}</span>`
      if (keyword) return `<span class="tok-keyword">${keyword}</span>`
      if (number) return `<span class="tok-number">${number}</span>`
      if (cls) return `<span class="tok-class">${cls}</span>`
      if (fn) return `<span class="tok-fn">${fn}</span>`
      return m
    }
  )
}

const PRESETS = [
  { label: 'Gimbal 90°', value: 'gimbal_lock' },
  { label: 'Aerobatic Flip', value: 'aerobatic_flip' },
  { label: 'Banked Turn', value: 'diagonal_turn' }
]

const MODES = [
  { label: 'Quaternion SLERP', value: 'slerp' },
  { label: 'Euler Angle LERP', value: 'euler' }
]

export function QuaternionSlerpExplorer() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  const [presetKey, setPresetKey] = useState('gimbal_lock')
  const [mode, setMode] = useState('slerp')
  const [t, setT] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [euler, setEuler] = useState([0, 0, 0])

  useEffect(() => {
    if (!canvasRef.current) return
    const engine = new QuaternionSlerpEngine(canvasRef.current)
    engineRef.current = engine

    const handleUpdate = (state) => {
      setT(state.progress)
      setIsPlaying(state.isPlaying)
      setMode(state.mode)
      setPresetKey(state.presetKey)
      setEuler(state.euler || [0, 0, 0])
    }

    engine.on('update', handleUpdate)

    return () => {
      engine.dispose()
      engineRef.current = null
    }
  }, [])

  const preset = SLERP_PRESETS[presetKey]

  const handlePresetChange = (newPreset) => {
    setPresetKey(newPreset)
    if (engineRef.current) {
      engineRef.current.applyPreset(newPreset)
    }
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    if (engineRef.current) {
      engineRef.current.setMode(newMode)
    }
  }

  const handleSliderChange = (newT) => {
    setT(newT)
    if (engineRef.current) {
      engineRef.current.setProgress(newT)
      if (isPlaying) {
        engineRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleTogglePlay = () => {
    if (!engineRef.current) return
    if (isPlaying) {
      engineRef.current.pause()
      setIsPlaying(false)
    } else {
      if (t >= 0.999) {
        engineRef.current.setProgress(0)
      }
      engineRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleStepBack = () => {
    if (!engineRef.current) return
    const prevT = Math.max(0, Number((t - 0.05).toFixed(2)))
    engineRef.current.setProgress(prevT)
    if (isPlaying) {
      engineRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleStepForward = () => {
    if (!engineRef.current) return
    const nextT = Math.min(1, Number((t + 0.05).toFixed(2)))
    engineRef.current.setProgress(nextT)
    if (isPlaying) {
      engineRef.current.pause()
      setIsPlaying(false)
    }
  }

  let codeString = ''
  if (mode === 'slerp' && preset) {
    const [p0, y0, r0] = preset.startEuler
    const [p1, y1, r1] = preset.endEuler
    codeString = [
      `// q1: start orientation (pitch ${fmtDeg(p0)}, yaw ${fmtDeg(y0)}, roll ${fmtDeg(r0)})`,
      `const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(${fmtRad(p0)}, ${fmtRad(y0)}, ${fmtRad(r0)}))`,
      `// q2: target orientation (pitch ${fmtDeg(p1)}, yaw ${fmtDeg(y1)}, roll ${fmtDeg(r1)})`,
      `const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(${fmtRad(p1)}, ${fmtRad(y1)}, ${fmtRad(r1)}))`,
      `// SLERP at t = ${t.toFixed(2)}: shortest geodesic, constant angular speed`,
      `const q = q1.clone().slerp(q2, ${t.toFixed(2)})`,
      `// Orient the mesh`,
      `mesh.quaternion.copy(q)`
    ].join('\n')
  } else {
    const [pitch, yaw, roll] = euler
    codeString = [
      `// Euler LERP: pitch, yaw, roll blended independently, then converted`,
      `const e = new THREE.Euler(${fmtRad(pitch)}, ${fmtRad(yaw)}, ${fmtRad(roll)}) // ${fmtDeg(pitch)} · ${fmtDeg(yaw)} · ${fmtDeg(roll)}`,
      `const q = new THREE.Quaternion().setFromEuler(e)`,
      `// Orient the mesh`,
      `mesh.quaternion.copy(q)`
    ].join('\n')
  }

  return html`
    <style>
      .slerp-code-block .tok-comment { color: var(--grey); font-style: italic; }
      .slerp-code-block .tok-keyword { color: rgb(var(--primary)); }
      .slerp-code-block .tok-number { color: #fbbf24; }
      .slerp-code-block .tok-class { color: #38bdf8; }
      .slerp-code-block .tok-fn { color: #34d399; }
      .slerp-badge-tag { font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
      .slerp-badge-good { background: rgba(80, 200, 120, 0.15); color: #50c878; }
      .slerp-badge-warn { background: rgba(255, 180, 60, 0.15); color: #ffb43c; }
      #quaternion-slerp-explorer .slerp-code-block { font-size: 0.625rem; }
      #quaternion-slerp-explorer .katex { font-size: 0.8em !important; }
      #quaternion-slerp-explorer #slerp-overlay .katex { font-size: 1.15em !important; }
    </style>

    <${WidgetFrame}
      title="Quaternion SLERP vs Euler LERP Flight Simulator"
      descriptor="Interactive Three.js visualizer">
      <div class="tw-grid tw-grid-cols-[330px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif max-[860px]:tw-grid-cols-1">
        <!-- Left Panel: Controls -->
        <div class="tw-flex tw-flex-col tw-gap-2">
          <!-- Preset selector -->
          <${SegmentedGroup}
            options=${PRESETS}
            value=${presetKey}
            onChange=${handlePresetChange} />

          <!-- Interpolation Mode selector -->
          <${SegmentedGroup}
            options=${MODES}
            value=${mode}
            onChange=${handleModeChange} />

          <!-- Preset Description -->
          <div
            class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[30px]"
            dangerouslySetInnerHTML=${{ __html: renderTextWithMath(preset?.description) }} />

          <!-- Playback Controls + Slider -->
          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-gap-1.5">
            <${StepPlayback}
              currentStep=${Math.round(t * 100)}
              totalSteps=${101}
              isPlaying=${isPlaying}
              playLabel="Play Flight"
              showReset=${false}
              onStepBack=${handleStepBack}
              onStepForward=${handleStepForward}
              onTogglePlay=${handleTogglePlay} />

            <${RangeSlider}
              id="slerp-slider"
              value=${t}
              valueText="t = ${t.toFixed(2)}"
              min=${0}
              max=${1}
              step=${0.01}
              onChange=${handleSliderChange} />
          </div>
        </div>

        <!-- 3D Canvas -->
        <div
          class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[320px] tw-overflow-hidden"
          ref=${canvasRef}>
          <div class="tw-absolute tw-bottom-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-text-xs tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-items-center tw-gap-x-3.5 tw-whitespace-nowrap" id="slerp-overlay">
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #ef4444;"></span> +X (Forward)</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #22c55e;"></span> +Y (Up)</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #3b82f6;"></span> +Z (Right)</span>
            ${mode === 'slerp' ? html`
              <span class="tw-inline-flex tw-items-center tw-gap-1.5">
                <span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #fbbf24;"></span>
                <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath('Axis $\\hat{\\mathbf{n}}$') }} />
              </span>
            ` : null}
          </div>
          <span class="slerp-badge-tag ${mode === 'slerp' ? 'slerp-badge-good' : 'slerp-badge-warn'} tw-absolute tw-top-2.5 tw-right-2.5 tw-pointer-events-none">
            ${mode === 'slerp' ? 'Shortest Geodesic (S³)' : 'Euler Decoupled (Distorted)'}
          </span>
        </div>
      </div>

      <!-- Three.js Code Card (full width, below the simulator) -->
      <div class="tw-p-2.5 tw-pt-0 tw-font-serif">
        <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2">
          <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-lighter)] tw-mb-1">Three.js Code</div>
          <pre
            class="slerp-code-block tw-m-0 tw-p-2 tw-bg-[var(--grey-darker)] tw-rounded tw-font-mono tw-text-[0.6875rem] tw-leading-relaxed tw-text-[var(--grey-lighter)] tw-whitespace-pre-wrap tw-overflow-x-hidden"
            dangerouslySetInnerHTML=${{ __html: highlightCode(codeString) }} />
        </div>
      </div>
    <//>
  `
}

export function initQuaternionSlerpExplorer(containerId = 'quaternion-slerp-explorer') {
  const root = document.getElementById(containerId)
  if (!root) return
  render(html`<${QuaternionSlerpExplorer} />`, root)
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initQuaternionSlerpExplorer())
  } else {
    initQuaternionSlerpExplorer()
  }
}
