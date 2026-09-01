import { CoordinateFrameEngine, FRAME_PRESETS } from './coordinate-frame-engine.js'
import { html, render, useState, useEffect, useRef } from '../ui/preact.js'
import { WidgetFrame } from '../ui/WidgetFrame.js'
import { SegmentedGroup } from '../ui/SegmentedGroup.js'
import { StepPlayback } from '../ui/StepPlayback.js'
import { StepRow } from '../ui/StepRow.js'

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

function formatNum(n) {
  const val = Math.abs(n) < 0.0001 ? 0 : n
  const str = val.toFixed(2)
  return val >= 0 ? ` ${str}` : str
}

function formatCoord(n) {
  const val = Math.abs(n) < 0.05 ? 0 : n
  return val.toFixed(1)
}

const PRESET_OPTIONS = [
  { label: 'Default Camera', value: 'default_camera' },
  { label: 'Top-Down', value: 'top_down' },
  { label: 'Pure Offset', value: 'pure_offset' }
]

const STEPS_DEF = [
  {
    num: '1',
    name: 'Translation $\\mathbf{T}_{-\\mathbf{e}}$',
    desc: 'Shift camera position $\\mathbf{e}$ to origin',
    symbol: '\\mathbf{T}_{-\\mathbf{e}}',
    term: 'T_-e',
    engineStep: 1
  },
  {
    num: '2',
    name: 'Rotation $\\mathbf{R}^T$',
    desc: 'Align $(u,v,w)$ axes with world $(x,y,z)$',
    symbol: '\\mathbf{R}^{T}',
    term: 'R^T',
    engineStep: 2
  }
]

export function CoordinateFrameExplorer() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  const [presetKey, setPresetKey] = useState('default_camera')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [pointWorld, setPointWorld] = useState([0, 0, 0])
  const [pointLocal, setPointLocal] = useState([0, 0, 0])
  const [activeMatrix, setActiveMatrix] = useState({
    label: 'Frame Matrix $\\mathbf{M}_{\\text{frame}}$',
    elts: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  })

  const preset = FRAME_PRESETS[presetKey]

  useEffect(() => {
    if (!canvasRef.current) return
    const engine = new CoordinateFrameEngine(canvasRef.current)
    engineRef.current = engine

    const handleState = (state) => {
      setPresetKey(state.presetKey)
      setCurrentStepIndex(state.currentStepIndex)
      setIsPlaying(state.isPlaying)
      setIsAnimating(Boolean(state.isAnimating || state.isPlaying || Math.abs(state.animationProgress - state.targetStepIndex) > 0.001))
      setPointWorld([...state.pointWorld])
      setPointLocal([...state.pointLocal])

      const done = state.currentStepIndex >= 2 && Math.abs(state.animationProgress - 2) < 0.01
      engine.setRestReveal(done)

      if (state.currentStepIndex === 2) {
        setActiveMatrix({
          label: 'View Matrix $\\mathbf{M}_{\\text{view}} = \\mathbf{R}^T \\mathbf{T}_{-\\mathbf{e}}$',
          elts: [...state.viewMatrix]
        })
      } else if (state.currentStepIndex === 1) {
        setActiveMatrix({
          label: 'Step 1: Translation $\\mathbf{T}_{-\\mathbf{e}}$',
          elts: [...state.translationMatrix]
        })
      } else {
        setActiveMatrix({
          label: 'Frame Matrix $\\mathbf{M}_{\\text{frame}}$',
          elts: [...state.frameMatrix]
        })
      }
    }

    engine.on('state-changed', handleState)
    engine.on('point-updated', ({ pointWorld: pw, pointLocal: pl }) => {
      setPointWorld([...pw])
      setPointLocal([...pl])
    })

    handleState(engine.getState())

    return () => {
      engine.dispose?.()
      engineRef.current = null
    }
  }, [])

  const handlePresetChange = (newKey) => {
    setPresetKey(newKey)
    if (engineRef.current) {
      engineRef.current.applyPreset(newKey)
    }
  }

  const isDone = currentStepIndex >= 2
  const handleTogglePlay = () => {
    if (!engineRef.current) return
    if (isPlaying) {
      engineRef.current.pause()
    } else {
      if (isDone) engineRef.current.reset()
      engineRef.current.play()
    }
  }

  const handleReset = () => {
    if (engineRef.current) engineRef.current.reset()
  }

  const handleStepBack = () => {
    if (engineRef.current) engineRef.current.stepBackward()
  }

  const handleStepForward = () => {
    if (engineRef.current) engineRef.current.stepForward()
  }

  return html`
    <style>
      #coordinate-frame-simulator .katex { font-size: 0.88em !important; }
      #coordinate-frame-simulator .coord-chip .katex { font-size: 0.95em !important; }
      #coordinate-frame-simulator .coord-legend .katex { font-size: 0.95em !important; }
    </style>

    <${WidgetFrame}
      title="Coordinate Frames & Camera View Transform"
      descriptor="Watch p keep its (u,v,w) coordinates as the world moves">
      <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif max-[860px]:tw-grid-cols-1">
        <div class="tw-flex tw-flex-col tw-gap-1.5">
          <${SegmentedGroup}
            options=${PRESET_OPTIONS}
            value=${presetKey}
            onChange=${handlePresetChange} />

          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[30px]">
            <div dangerouslySetInnerHTML=${{ __html: renderTextWithMath(preset?.description) }} />
            <div class="tw-mt-1 tw-text-[0.6875rem] tw-leading-tight tw-text-[var(--grey-light)]">
              The camera, its view (PiP), and the frustum appear once the transform completes
            </div>
          </div>

          <div>
            <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-light)] tw-tracking-[0.05em] tw-mb-1 tw-flex tw-justify-between tw-items-center">
              <span>View Transform Steps</span>
            </div>
            <div class="tw-flex tw-flex-col tw-gap-1">
              ${STEPS_DEF.map((s, idx) => {
                const isStepCompleted = isDone || currentStepIndex >= s.engineStep
                const isStepActive = currentStepIndex === s.engineStep - 1

                return html`
                  <${StepRow}
                    key=${idx}
                    stepNumber=${s.num}
                    title=${s.name}
                    description=${s.desc}
                    symbol=${s.symbol}
                    isCompleted=${isStepCompleted}
                    isActive=${isStepActive}
                    isAnimating=${isAnimating} />
                `
              })}
            </div>
          </div>

          <${StepPlayback}
            currentStep=${currentStepIndex}
            totalSteps=${3}
            zeroIsOrigin=${false}
            isPlaying=${isPlaying}
            onReset=${handleReset}
            onStepBack=${handleStepBack}
            onStepForward=${handleStepForward}
            onTogglePlay=${handleTogglePlay} />

          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-1.5">
            <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-light)] tw-tracking-[0.05em] tw-mb-1 tw-flex tw-justify-between tw-items-center tw-gap-2 tw-whitespace-nowrap">
              <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath(activeMatrix.label) }} />
              <span class="tw-font-mono tw-text-[0.625rem] tw-text-[var(--grey-light)]">4×4 Float32</span>
            </div>
            <div class="tw-grid tw-grid-cols-4 tw-gap-0.5 tw-bg-[var(--grey-darker)] tw-p-1 tw-rounded-[5px] tw-font-mono tw-text-[11px] tw-text-center">
              ${[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => {
                  const val = activeMatrix.elts[c * 4 + r]
                  const isDiagonal = r === c
                  const isHighlight = Math.abs(val - (isDiagonal ? 1 : 0)) > 0.001
                  return html`
                    <span key="${r}-${c}" class="tw-py-0.5 ${isHighlight ? 'tw-text-primary tw-font-bold' : 'tw-text-[var(--grey-light)]'}">
                      ${formatNum(val)}
                    </span>
                  `
                })
              )}
            </div>
          </div>
        </div>

        <div class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[340px] tw-overflow-hidden">
          <div class="tw-w-full tw-h-full tw-min-h-[340px]" ref=${canvasRef}></div>

          <!-- Top-Left Floating Coordinate Chip -->
          <div class="coord-chip tw-absolute tw-top-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-text-[0.72rem] tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-flex-col tw-gap-0.5">
            <div class="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-whitespace-nowrap tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">🌐 Canonical</span>
              <span class="tw-font-mono tw-text-[var(--grey-light)] tw-flex tw-items-baseline tw-gap-1">
                <span dangerouslySetInnerHTML=${{ __html: renderMath('\\mathbf{p}_{\\text{xyz}}') }} />: (${formatCoord(pointWorld[0])}, ${formatCoord(pointWorld[1])}, ${formatCoord(pointWorld[2])})
              </span>
            </div>
            <div class="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-whitespace-nowrap tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">📷 Nested</span>
              <span class="tw-font-mono tw-text-[var(--grey-light)] tw-flex tw-items-baseline tw-gap-1">
                <span dangerouslySetInnerHTML=${{ __html: renderMath('\\mathbf{p}_{\\text{uvw}}') }} />: (${formatCoord(pointLocal[0])}, ${formatCoord(pointLocal[1])}, ${formatCoord(pointLocal[2])})
              </span>
            </div>
          </div>

          <!-- Bottom-Left Floating Legend Overlay -->
          <div class="coord-legend tw-absolute tw-bottom-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-text-[0.72rem] tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-flex-col tw-gap-0.5">
            <div class="tw-flex tw-items-center tw-gap-1.5 tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">
                <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath('Canonical $(x,y,z)$: ') }} />
              </span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-[#ef4444]"></span> +x</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-[#22c55e]"></span> +y</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-[#38bdf8]"></span> +z</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-1.5 tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">
                <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath('Nested $(u,v,w)$: ') }} />
              </span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-[#f43f5e]"></span> +u</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-[#10b981]"></span> +v</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-[#3b82f6]"></span> +w</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-1.5 tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">Target:</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-[#fbbf24]"></span> p</span>
            </div>
          </div>
        </div>
      </div>
    <//>
  `
}

export function initCoordinateFrameExplorer(containerId = 'coordinate-frame-simulator') {
  const root = document.getElementById(containerId)
  if (!root) return
  render(html`<${CoordinateFrameExplorer} />`, root)
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCoordinateFrameExplorer())
  } else {
    initCoordinateFrameExplorer()
  }
}
