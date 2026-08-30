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
    get description() {
      return `Function composition: ${renderMath('(\\mathbf{T} \\circ \\mathbf{R} \\circ \\mathbf{S})(\\mathbf{v}) = \\mathbf{T}(\\mathbf{R}(\\mathbf{S}(\\mathbf{v})))')}. Scale at origin, Rotate in place, Translate.`
    },
    steps: [
      {
        type: 'scale',
        name: 'Scale S',
        latexSymbol: '\\mathbf{S}',
        mathTerm: 'S',
        badgeName: 'Scale',
        desc: 'Scale geometry at origin',
        x: 1.4,
        y: 0.7,
        z: 1.2
      },
      {
        type: 'rotate',
        name: 'Rotate R_y(45°)',
        latexSymbol: '\\mathbf{R}_y',
        mathTerm: 'R',
        badgeName: 'Rotate Y',
        desc: 'Yaw $45^\\circ$ on local Y axis',
        axis: 'y',
        angleDeg: 45
      },
      {
        type: 'translate',
        name: 'Translate T',
        latexSymbol: '\\mathbf{T}',
        mathTerm: 'T',
        badgeName: 'Translate',
        desc: 'Displace to $(2.5, 1.2, 0)$',
        x: 2.5,
        y: 1.2,
        z: 0
      }
    ]
  },
  rts: {
    id: 'rts',
    title: 'Swapped: RTS (Orbiting)',
    shortTitle: 'Orbit RTS',
    get description() {
      return `Swapped composition: ${renderMath('(\\mathbf{S} \\circ \\mathbf{R} \\circ \\mathbf{T})(\\mathbf{v}) = \\mathbf{S}(\\mathbf{R}(\\mathbf{T}(\\mathbf{v})))')}. Translating first shifts pivot, so rotation orbits around $(0,0,0)$!`
    },
    steps: [
      {
        type: 'translate',
        name: 'Translate T',
        latexSymbol: '\\mathbf{T}',
        mathTerm: 'T',
        badgeName: 'Translate',
        desc: 'Displace $+3$ along +X axis',
        x: 3.0,
        y: 0.5,
        z: 0
      },
      {
        type: 'rotate',
        name: 'Rotate R_y(90°)',
        latexSymbol: '\\mathbf{R}_y',
        mathTerm: 'R',
        badgeName: 'Rotate Y',
        desc: 'Rotate $90^\\circ$ around origin',
        axis: 'y',
        angleDeg: 90
      },
      {
        type: 'scale',
        name: 'Scale S',
        latexSymbol: '\\mathbf{S}',
        mathTerm: 'S',
        badgeName: 'Scale',
        desc: 'Scale displaced mesh',
        x: 1.3,
        y: 1.3,
        z: 1.3
      }
    ]
  },
  multi_rot: {
    id: 'multi_rot',
    title: 'Multi-Axis (TR_y R_z S)',
    shortTitle: 'Roll & Yaw',
    get description() {
      return `Multi-axis composition: ${renderMath('(\\mathbf{T} \\circ \\mathbf{R}_y \\circ \\mathbf{R}_z \\circ \\mathbf{S})(\\mathbf{v})')}. Scale, Roll on Z, Yaw on Y, then Translate.`
    },
    steps: [
      {
        type: 'scale',
        name: 'Scale S',
        latexSymbol: '\\mathbf{S}',
        mathTerm: 'S',
        badgeName: 'Scale',
        desc: 'Elongate forward along X',
        x: 1.5,
        y: 0.9,
        z: 1.0
      },
      {
        type: 'rotate',
        name: 'Roll R_z(35°)',
        latexSymbol: '\\mathbf{R}_z',
        mathTerm: 'R',
        badgeName: 'Roll Z',
        desc: 'Bank $35^\\circ$ on local Z axis',
        axis: 'z',
        angleDeg: 35
      },
      {
        type: 'rotate',
        name: 'Yaw R_y(60°)',
        latexSymbol: '\\mathbf{R}_y',
        mathTerm: 'R',
        badgeName: 'Yaw Y',
        desc: 'Turn $60^\\circ$ on local Y axis',
        axis: 'y',
        angleDeg: 60
      },
      {
        type: 'translate',
        name: 'Translate T',
        latexSymbol: '\\mathbf{T}',
        mathTerm: 'T',
        badgeName: 'Translate',
        desc: 'Displace to $(1.8, 1.5, -1.2)$',
        x: 1.8,
        y: 1.5,
        z: -1.2
      }
    ]
  }
}

export function initCombiningTransformationsExplorer(mountSelector = '#transformation-chain-simulator') {
  const mountEl = typeof mountSelector === 'string' ? document.querySelector(mountSelector) : mountSelector
  if (!mountEl) return

  const PRESET_BASE = 'preset-btn tw-flex-1 tw-text-center tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-px-2.5 tw-py-1.5 tw-leading-none tw-cursor-pointer'
  const PRESET_INACTIVE = PRESET_BASE + ' tw-bg-transparent tw-text-[var(--grey-light)]'
  const PRESET_ACTIVE = PRESET_BASE + ' tw-bg-primary-soft tw-text-primary'

  const CTRL_BTN = 'tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:hover:tw-border-[var(--ring-border)] disabled:hover:tw-text-[var(--grey-light)] disabled:hover:tw-bg-[var(--grey-dark)]'
  const PLAY_NEUTRAL = 'tw-flex-1 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft'
  const PLAY_ACTIVE = 'tw-flex-1 tw-bg-primary-soft tw-border tw-border-primary-border tw-text-primary tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-bg-primary-soft hover:tw-border-primary'

  const STEP_ROW_BASE = 'step-row tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1.5 tw-rounded-md tw-border tw-border-[var(--ring-border)] tw-bg-[var(--grey-dark)] tw-transition'
  const STEP_ROW_ACTIVE = 'step-row tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1.5 tw-rounded-md tw-border tw-border-[rgba(var(--primary),0.6)] tw-bg-[rgba(var(--primary),0.08)] tw-transition'
  const STEP_ROW_COMPLETED = 'step-row tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1.5 tw-rounded-md tw-border tw-border-[var(--ring-border)] tw-bg-[var(--grey-dark)] tw-opacity-55 tw-pointer-events-none'

  const STEP_BADGE_BASE = 'tw-w-[18px] tw-h-[18px] tw-rounded-full tw-text-[10px] tw-font-bold tw-flex tw-items-center tw-justify-center tw-bg-[var(--grey-darker)] tw-text-[var(--grey-light)] tw-shrink-0'
  const STEP_BADGE_ACTIVE = 'tw-w-[18px] tw-h-[18px] tw-rounded-full tw-text-[10px] tw-font-bold tw-flex tw-items-center tw-justify-center tw-bg-[rgb(var(--primary))] tw-text-[var(--grey-darker)] tw-shrink-0'
  const STEP_BADGE_COMPLETED = 'tw-w-[18px] tw-h-[18px] tw-rounded-full tw-text-[10px] tw-font-bold tw-flex tw-items-center tw-justify-center tw-bg-[var(--grey)] tw-text-[var(--grey-lighter)] tw-shrink-0'

  const STEP_SYMBOL = 'step-symbol tw-text-[13.5px] tw-font-bold tw-text-primary tw-bg-[var(--grey-darker)] tw-px-[7px] tw-py-[2px] tw-rounded-[4px] tw-flex tw-items-center tw-justify-center tw-min-w-[32px] tw-shrink-0 tw-cursor-pointer'

  mountEl.innerHTML = `
    <style>
      #transformation-chain-simulator .katex {
        font-size: 0.8em !important;
      }
      #transformation-chain-simulator .step-symbol .katex {
        font-size: 1.25em !important;
      }
    </style>

    <div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden tw-font-sans">
      <!-- Header -->
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
        <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary tw-flex tw-items-center tw-gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          Interactive 3D Transformation Chain Simulator
        </div>
        <div class="tw-font-serif tw-text-sm tw-text-[var(--grey-light)]">Right-to-left evaluation & ghost reference frame</div>
      </div>

      <!-- Main Body Grid -->
      <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif max-[860px]:tw-grid-cols-1">

        <!-- Left Controls & Step Pipeline -->
        <div class="tw-flex tw-flex-col tw-gap-2">
          <!-- Preset Selectors (Left Panel) -->
          <div class="tw-flex tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden" id="preset-buttons">
            <button type="button" data-preset="trs" class="${PRESET_ACTIVE}">Standard TRS</button>
            <button type="button" data-preset="rts" class="${PRESET_INACTIVE}">Orbit RTS</button>
            <button type="button" data-preset="multi_rot" class="${PRESET_INACTIVE}">Roll & Yaw</button>
          </div>

          <!-- Preset Description Callout -->
          <div id="preset-desc-box" class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[30px]">
            ${renderTextWithMath(PRESETS.trs.description)}
          </div>

          <!-- Step Pipeline -->
          <div>
            <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-light)] tw-tracking-[0.05em] tw-mb-1 tw-flex tw-justify-between tw-items-center">
              <span>Sequence (Right → Left)</span>
            </div>

            <div id="step-pipeline-list" class="tw-flex tw-flex-col tw-gap-1">
              <!-- Populated dynamically -->
            </div>
          </div>

          <!-- Playback Controls -->
          <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-gap-1.5 tw-items-stretch">
            <button type="button" id="btn-reset" class="${CTRL_BTN}" title="Reset to Origin">
              ↺
            </button>
            <button type="button" id="btn-step-back" class="${CTRL_BTN}" title="Step Back">
              ⏮
            </button>
            <button type="button" id="btn-play-pause" class="${PLAY_NEUTRAL}">
              <span id="play-text">▶ Play</span>
            </button>
            <button type="button" id="btn-step-forward" class="${CTRL_BTN}" title="Step Forward">
              ⏭
            </button>
          </div>

          <!-- Live 4x4 Matrix Display -->
          <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-2">
            <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-light)] tw-tracking-[0.05em] tw-mb-1 tw-flex tw-justify-between tw-items-center">
              <span>Accumulated Matrix ${renderMath('\\mathbf{M}')}</span>
              <span class="tw-font-mono tw-text-[0.625rem] tw-text-[var(--grey-light)]">4×4 Float32</span>
            </div>
            <div id="matrix-grid-display" class="tw-grid tw-grid-cols-4 tw-gap-0.5 tw-bg-[var(--grey-darker)] tw-p-1 tw-rounded-[5px] tw-font-mono tw-text-[11px] tw-text-center tw-border tw-border-[var(--ring-border)]">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>

        <!-- Right 3D Canvas Viewport (Matches matrix background color) -->
        <div class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[320px] tw-overflow-hidden">
          <div id="three-canvas-container" class="tw-w-full tw-h-full tw-min-h-[340px]"></div>

          <div class="tw-absolute tw-bottom-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-px-2 tw-py-1 tw-rounded-md tw-text-[11px] tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-items-center tw-gap-x-3 tw-gap-y-1 tw-flex-wrap">
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
    </div>
  `

  const canvasContainer = mountEl.querySelector('#three-canvas-container')
  const engine = new TransformEngine({ container: canvasContainer })

  let currentPresetKey = 'trs'

  function renderStepsUI(preset) {
    const listEl = mountEl.querySelector('#step-pipeline-list')
    const descBox = mountEl.querySelector('#preset-desc-box')
    descBox.innerHTML = renderTextWithMath(preset.description)

    listEl.innerHTML = preset.steps.map((step, idx) => `
      <div id="step-row-${idx}" class="${STEP_ROW_BASE}">
        <div class="tw-flex tw-items-center tw-gap-1.5 tw-flex-1 tw-min-w-0">
          <div class="step-badge ${STEP_BADGE_BASE}">${idx + 1}</div>
          <div class="tw-flex tw-items-baseline tw-gap-1.5 tw-overflow-hidden tw-whitespace-nowrap">
            <span class="tw-font-sans tw-text-[0.6875rem] tw-font-semibold tw-text-[var(--grey-lighter)]">${renderTextWithMath(step.badgeName)}</span>
            <span class="tw-font-serif tw-text-[0.75rem] tw-text-[var(--grey-light)] tw-truncate">${renderTextWithMath(step.desc)}</span>
          </div>
        </div>
        <div class="${STEP_SYMBOL}" data-math-term="${step.mathTerm || ''}" title="Hover to view 4×4 Matrix Definition">${renderMath(step.latexSymbol)}</div>
      </div>
    `).join('')
  }

  function updateMatrixDisplay(matrix) {
    const gridEl = mountEl.querySelector('#matrix-grid-display')
    if (!gridEl) return
    const elts = matrix.elements // column-major in Three.js

    let html = ''
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = elts[c * 4 + r]
        const formatted = Math.abs(val) < 0.001 ? '0.00' : val.toFixed(2)
        const isDiagonal = r === c
        const isChanged = val !== (isDiagonal ? 1 : 0)
        html += `<span class="tw-py-0.5 ${isChanged ? 'tw-text-primary tw-font-bold' : 'tw-text-[var(--grey-light)]'}">${formatted}</span>`
      }
    }
    gridEl.innerHTML = html
  }

  function setPreset(key) {
    currentPresetKey = key
    const preset = PRESETS[key]

    mountEl.querySelectorAll('.preset-btn').forEach(btn => {
      btn.className = btn.dataset.preset === key ? PRESET_ACTIVE : PRESET_INACTIVE
    })

    renderStepsUI(preset)
    engine.setChain(preset.steps)
  }

  // Reflect the chain state on the step rows, matching the coordinate-frame
  // explorer: applied steps are disabled (pointer-events none) and show a tick,
  // the next pending step is highlighted. When the chain is done there is no
  // next step, so no row is highlighted.
  //
  // completedCount is the number of fully applied steps (-1 before any), so the
  // next pending step is completedCount + 1.
  function renderStepRows(completedCount, isDone) {
    const preset = PRESETS[currentPresetKey]

    preset.steps.forEach((_, idx) => {
      const row = mountEl.querySelector(`#step-row-${idx}`)
      if (!row) return
      const badge = row.querySelector('.step-badge')
      const state = getStepRowState(completedCount, isDone, idx)

      if (state === 'completed') {
        row.className = STEP_ROW_COMPLETED
        if (badge) badge.className = `step-badge ${STEP_BADGE_COMPLETED}`
        if (badge) badge.textContent = '✓'
      } else if (state === 'active') {
        row.className = STEP_ROW_ACTIVE
        if (badge) badge.className = `step-badge ${STEP_BADGE_ACTIVE}`
        if (badge) badge.textContent = String(idx + 1)
      } else {
        row.className = STEP_ROW_BASE
        if (badge) badge.className = `step-badge ${STEP_BADGE_BASE}`
        if (badge) badge.textContent = String(idx + 1)
      }
    })
  }

  // Derive the row states from the engine's applied count. Called on every
  // event that can change the chain state (animation start, animation finish,
  // step back, reset, completion).
  function syncStepRows() {
    const preset = PRESETS[currentPresetKey]
    const lastIdx = preset.steps.length - 1
    const completedCount = engine.currentStepIndex
    const isDone = completedCount >= lastIdx
    renderStepRows(completedCount, isDone)
    const stepForwardBtn = mountEl.querySelector('#btn-step-forward')
    if (stepForwardBtn) stepForwardBtn.disabled = isDone
  }

  // Engine Event Listeners
  engine.on('stepChange', () => {
    syncStepRows()
  })

  // Playback reaching the final step fires the complete event.
  engine.on('complete', () => {
    syncStepRows()
  })

  engine.on('matrixUpdate', (currentMatrix) => {
    updateMatrixDisplay(currentMatrix)
  })

  engine.on('stateChange', (state) => {
    const playBtn = mountEl.querySelector('#btn-play-pause')
    const playText = mountEl.querySelector('#play-text')
    if (state === 'playing' || state === 'animating_step' || state === 'digest_pause') {
      playBtn.className = PLAY_ACTIVE
      playText.textContent = '⏸ Pause'
    } else {
      playBtn.className = PLAY_NEUTRAL
      playText.textContent = '▶ Play'
    }

    // Any state transition can move the applied count (animation finished,
    // stepped back, reset, all steps applied), so re-derive the row states.
    syncStepRows()
  })

  // Button Hooks
  mountEl.querySelector('#preset-buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('.preset-btn')
    if (btn && btn.dataset.preset) {
      setPreset(btn.dataset.preset)
    }
  })

  mountEl.querySelector('#btn-play-pause').addEventListener('click', () => {
    if (engine.state === 'playing' || engine.state === 'animating_step' || engine.state === 'digest_pause') {
      engine.pause()
    } else {
      engine.play()
    }
  })

  mountEl.querySelector('#btn-reset').addEventListener('click', () => {
    engine.reset()
  })

  mountEl.querySelector('#btn-step-forward').addEventListener('click', () => {
    engine.stepForward()
  })

  mountEl.querySelector('#btn-step-back').addEventListener('click', () => {
    engine.stepBackward()
  })

  // Initial Load (wait for katex if needed)
  if (typeof window !== 'undefined' && !window.katex) {
    window.addEventListener('load', () => setPreset('trs'), { once: true })
  }
  setPreset('trs')

  return engine
}

// Auto-mount if element exists on page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCombiningTransformationsExplorer())
  } else {
    initCombiningTransformationsExplorer()
  }
}
