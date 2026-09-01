/**
 * Combining Transformations Interactive 3D Explorer
 *
 * Mounts an interactive 3D transformation chain visualizer using TransformEngine.
 * Demonstrates matrix composition order, right-to-left evaluation, non-commutativity,
 * step interpolation with pauses, and real-time 4x4 matrix mathematics with KaTeX rendering.
 *
 * Fully self-contained styling with theme CSS tokens.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { TransformEngine } from './transform-engine.js'
import { getStepRowState } from './combining-transformations-state.js'
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

const PRESETS = {
  trs: {
    id: 'trs',
    title: 'Standard TRS (Model to World)',
    shortTitle: 'Standard TRS',
    description: 'Function composition: $(\\mathbf{T} \\circ \\mathbf{R} \\circ \\mathbf{S})(\\mathbf{v}) = \\mathbf{T}(\\mathbf{R}(\\mathbf{S}(\\mathbf{v})))$. Scale at origin, Rotate in place, Translate.',
    steps: [
      { type: 'scale', name: 'Scale S', latexSymbol: '\\mathbf{S}', mathTerm: 'S', badgeName: 'Scale', desc: 'Scale geometry at origin', x: 1.4, y: 0.7, z: 1.2 },
      { type: 'rotate', name: 'Rotate R_y(45°)', latexSymbol: '\\mathbf{R}_y', mathTerm: 'R', badgeName: 'Rotate Y', desc: 'Yaw $45^\\circ$ on local Y axis', axis: 'y', angleDeg: 45 },
      { type: 'translate', name: 'Translate T', latexSymbol: '\\mathbf{T}', mathTerm: 'T', badgeName: 'Translate', desc: 'Displace to $(2.5, 1.2, 0)$', x: 2.5, y: 1.2, z: 0 }
    ]
  },
  rts: {
    id: 'rts',
    title: 'Swapped: RTS (Orbiting)',
    shortTitle: 'Orbit RTS',
    description: 'Swapped composition: $(\\mathbf{S} \\circ \\mathbf{R} \\circ \\mathbf{T})(\\mathbf{v}) = \\mathbf{S}(\\mathbf{R}(\\mathbf{T}(\\mathbf{v})))$. Translating first shifts pivot, so rotation orbits around $(0,0,0)$!',
    steps: [
      { type: 'translate', name: 'Translate T', latexSymbol: '\\mathbf{T}', mathTerm: 'T', badgeName: 'Translate', desc: 'Displace $+3$ along +X axis', x: 3.0, y: 0.5, z: 0 },
      { type: 'rotate', name: 'Rotate R_y(90°)', latexSymbol: '\\mathbf{R}_y', mathTerm: 'R', badgeName: 'Rotate Y', desc: 'Yaw $90^\\circ$ around origin $(0,0,0)$', axis: 'y', angleDeg: 90 },
      { type: 'scale', name: 'Scale S', latexSymbol: '\\mathbf{S}', mathTerm: 'S', badgeName: 'Scale', desc: 'Scale post-rotation along orbit', x: 1.5, y: 0.5, z: 1.0 }
    ]
  },
  multi_rot: {
    id: 'multi_rot',
    title: 'Compound Rotation: R_z then R_y',
    shortTitle: 'Roll & Yaw',
    description: 'Rotation order matters: $\\mathbf{R}_y \\mathbf{R}_z \\neq \\mathbf{R}_z \\mathbf{R}_y$. Rolling first changes where subsequent yawing points!',
    steps: [
      { type: 'rotate', name: 'Roll R_z(45°)', latexSymbol: '\\mathbf{R}_z', mathTerm: 'R', badgeName: 'Roll Z', desc: 'Roll $45^\\circ$ around Z axis', axis: 'z', angleDeg: 45 },
      { type: 'rotate', name: 'Yaw R_y(45°)', latexSymbol: '\\mathbf{R}_y', mathTerm: 'R', badgeName: 'Yaw Y', desc: 'Yaw $45^\\circ$ around Y axis', axis: 'y', angleDeg: 45 },
      { type: 'translate', name: 'Translate T', latexSymbol: '\\mathbf{T}', mathTerm: 'T', badgeName: 'Translate', desc: 'Displace along new orientation', x: 1.5, y: 1.0, z: -1.0 }
    ]
  }
}

const PRESET_OPTIONS = [
  { label: 'Standard TRS', value: 'trs' },
  { label: 'Orbit RTS', value: 'rts' },
  { label: 'Roll & Yaw', value: 'multi_rot' }
]

export function CombiningTransformationsExplorer() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  const [presetKey, setPresetKey] = useState('trs')
  const [completedCount, setCompletedCount] = useState(-1)
  const [isDone, setIsDone] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [matrixElements, setMatrixElements] = useState([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])

  const preset = PRESETS[presetKey]
  const presetRef = useRef(preset)
  presetRef.current = preset

  useEffect(() => {
    if (!canvasRef.current) return
    const engine = new TransformEngine({ container: canvasRef.current })
    engineRef.current = engine

    engine.on('stepChange', (stepIndex) => {
      const count = typeof stepIndex === 'number' ? stepIndex : -1
      setCompletedCount(count)
      const currentPreset = presetRef.current
      setIsDone(count >= currentPreset.steps.length - 1)
    })

    engine.on('complete', () => {
      setIsDone(true)
    })

    engine.on('matrixUpdate', (matrix) => {
      if (matrix && matrix.elements) {
        setMatrixElements([...matrix.elements])
      }
    })

    engine.on('stateChange', (state) => {
      const active = state === 'playing' || state === 'animating_step' || state === 'digest_pause'
      setIsPlaying(active)
    })

    engine.setChain(preset.steps)

    return () => {
      engine.dispose?.()
      engineRef.current = null
    }
  }, [])

  const handlePresetChange = (newKey) => {
    setPresetKey(newKey)
    setCompletedCount(-1)
    setIsDone(false)
    if (engineRef.current) {
      engineRef.current.setChain(PRESETS[newKey].steps)
    }
  }

  const handleTogglePlay = () => {
    if (!engineRef.current) return
    if (isPlaying) {
      engineRef.current.pause()
    } else {
      if (isDone) {
        engineRef.current.reset()
        setCompletedCount(-1)
        setIsDone(false)
      }
      engineRef.current.play()
    }
  }

  const handleReset = () => {
    if (engineRef.current) engineRef.current.reset()
    setCompletedCount(-1)
    setIsDone(false)
  }

  const handleStepBack = () => {
    if (engineRef.current) engineRef.current.stepBackward()
  }

  const handleStepForward = () => {
    if (engineRef.current) engineRef.current.stepForward()
  }

  const totalSteps = preset.steps.length
  const currentStep = completedCount

  return html`
    <style>
      #matrix-grid-display span { transition: color 0.15s ease; }
      #combining-transformations-explorer .katex { font-size: 0.88em !important; }
    </style>

    <${WidgetFrame}
      title="Interactive 3D Transformation Chain Simulator"
      descriptor="Right-to-left evaluation & ghost reference frame">
      <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif max-[860px]:tw-grid-cols-1">
        <!-- Left Controls & Step Pipeline -->
        <div class="tw-flex tw-flex-col tw-gap-2">
          <!-- Preset Selectors -->
          <${SegmentedGroup}
            options=${PRESET_OPTIONS}
            value=${presetKey}
            onChange=${handlePresetChange} />

          <!-- Preset Description Callout -->
          <div
            class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[30px]"
            dangerouslySetInnerHTML=${{ __html: renderTextWithMath(preset.description) }} />

          <!-- Step Pipeline -->
          <div>
            <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-light)] tw-tracking-[0.05em] tw-mb-1 tw-flex tw-justify-between tw-items-center">
              <span>Sequence (Right → Left)</span>
            </div>

            <div class="tw-flex tw-flex-col tw-gap-1">
              ${preset.steps.map((step, idx) => {
                const rowState = getStepRowState(completedCount, isDone, idx)
                const isCompleted = rowState === 'completed'
                const isActive = rowState === 'active'

                return html`
                  <${StepRow}
                    key=${idx}
                    stepNumber=${idx + 1}
                    title=${step.badgeName}
                    description=${step.desc}
                    symbol=${step.latexSymbol}
                    isCompleted=${isCompleted}
                    isActive=${isActive}
                    isAnimating=${isPlaying} />
                `
              })}
            </div>
          </div>

          <!-- Playback Controls -->
          <${StepPlayback}
            currentStep=${currentStep}
            totalSteps=${totalSteps}
            zeroIsOrigin=${true}
            isPlaying=${isPlaying}
            playLabel="Play"
            showReset=${true}
            onReset=${handleReset}
            onStepBack=${handleStepBack}
            onStepForward=${handleStepForward}
            onTogglePlay=${handleTogglePlay} />

          <!-- Live 4x4 Matrix Display -->
          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2">
            <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-light)] tw-tracking-[0.05em] tw-mb-1 tw-flex tw-justify-between tw-items-center">
              <span>Accumulated Matrix <span dangerouslySetInnerHTML=${{ __html: renderMath('\\mathbf{M}') }} /></span>
              <span class="tw-font-mono tw-text-[0.625rem] tw-text-[var(--grey-light)]">4×4 Float32</span>
            </div>
            <div class="tw-grid tw-grid-cols-4 tw-gap-0.5 tw-bg-[var(--grey-darker)] tw-p-1 tw-rounded-[5px] tw-font-mono tw-text-[11px] tw-text-center">
              ${[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => {
                  const val = matrixElements[c * 4 + r]
                  const formatted = Math.abs(val) < 0.001 ? '0.00' : val.toFixed(2)
                  const isDiagonal = r === c
                  const isChanged = Math.abs(val - (isDiagonal ? 1 : 0)) > 0.001
                  return html`
                    <span key="${r}-${c}" class="tw-py-0.5 ${isChanged ? 'tw-text-primary tw-font-bold' : 'tw-text-[var(--grey-light)]'}">
                      ${formatted}
                    </span>
                  `
                })
              )}
            </div>
          </div>
        </div>

        <!-- Right 3D Canvas Viewport -->
        <div class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[320px] tw-overflow-hidden">
          <div class="tw-w-full tw-h-full tw-min-h-[340px]" ref=${canvasRef}></div>

          <div class="tw-absolute tw-bottom-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-px-2 tw-py-1 tw-rounded-md tw-text-[11px] tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-items-center tw-gap-x-3 tw-gap-y-1 tw-flex-wrap">
            <span class="tw-inline-flex tw-items-center tw-gap-1">
              <span class="tw-inline-block tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#ec5975]"></span> Model (+X/Y/Z)
            </span>
            <span class="tw-inline-flex tw-items-center tw-gap-1">
              <span class="tw-inline-block tw-w-[7px] tw-h-[7px] tw-rounded-full tw-border tw-border-[#71717a]"></span> Ghost Origin
            </span>
            <span>Drag to Orbit · Scroll to Zoom</span>
          </div>
        </div>
      </div>
    <//>
  `
}

export function initCombiningTransformationsExplorer(containerId = 'transformation-chain-simulator') {
  const mountEl = document.getElementById(containerId) || document.getElementById('combining-transformations-explorer')
  if (!mountEl) return
  render(html`<${CombiningTransformationsExplorer} />`, mountEl)
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCombiningTransformationsExplorer())
  } else {
    initCombiningTransformationsExplorer()
  }
}
