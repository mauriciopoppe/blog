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

  mountEl.innerHTML = `
    <style>
      .transform-sim-wrap {
        width: 100%;
        box-sizing: border-box;
        background: var(--grey-darker);
        border: 1px solid var(--grey-dark);
        border-radius: 12px;
        overflow: hidden;
        margin: 1.75rem 0;
        font-family: var(--family-sans, system-ui, sans-serif);
        color: var(--grey-lighter);
      }
      .transform-sim-wrap .katex {
        font-size: 1.25em !important;
      }
      .transform-sim-header {
        padding: 10px 14px;
        background: var(--grey-dark);
        border-bottom: 1px solid var(--grey-dark);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      .transform-sim-title {
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: rgb(var(--primary));
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .transform-sim-badge {
        font-size: 11px;
        letter-spacing: 0.04em;
        color: var(--grey-light);
      }
      .transform-sim-body {
        display: grid;
        grid-template-columns: 335px 1fr;
        gap: 12px;
        padding: 12px;
      }
      @media (max-width: 860px) {
        .transform-sim-body {
          grid-template-columns: 1fr;
        }
      }
      .transform-controls-panel {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .transform-sim-presets {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;
      }
      .preset-btn {
        flex: 1;
        font-size: 11.5px;
        font-weight: 600;
        padding: 5px 6px;
        border-radius: 6px;
        border: 1px solid var(--grey-dark);
        background: var(--grey-dark);
        color: var(--grey-light);
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
        font-family: var(--family-sans, system-ui, sans-serif);
      }
      .preset-btn:hover {
        color: rgb(var(--primary));
        border-color: rgba(var(--primary), 0.5);
        filter: drop-shadow(0px 0px 4px rgba(var(--primary), 0.35)) brightness(1.1);
      }
      .preset-btn.active {
        background: rgba(var(--primary), 0.16);
        color: rgb(var(--primary));
        border-color: rgba(var(--primary), 0.5);
      }
      .transform-sim-desc {
        font-size: 12px;
        line-height: 1.5;
        color: var(--grey-light);
        background: var(--grey-dark);
        padding: 7px 9px;
        border-radius: 6px;
        border-left: 2px solid rgb(var(--primary));
      }
      .step-pipeline-wrap {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .step-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 8px;
        border-radius: 6px;
        border: 1px solid transparent;
        background: var(--grey-dark);
        transition: all 0.25s ease;
        cursor: pointer;
      }
      .step-row:hover {
        border-color: rgba(var(--primary), 0.3);
      }
      .step-row.active {
        border-color: rgba(var(--primary), 0.6);
        background: rgba(var(--primary), 0.08);
      }
      .step-row.active:hover {
        border-color: rgba(var(--primary), 0.85);
        background: rgba(var(--primary), 0.13);
      }
      .step-row.completed {
        opacity: 0.55;
        pointer-events: none;
        cursor: not-allowed;
      }
      .step-badge {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        font-size: 10px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--grey-darker);
        color: var(--grey-light);
        flex-shrink: 0;
      }
      .step-row.active .step-badge {
        background: rgb(var(--primary));
        color: var(--grey-darker);
      }
      .step-row.completed .step-badge {
        background: var(--grey);
        color: var(--grey-lighter);
      }
      .step-symbol {
        font-size: 13.5px;
        font-weight: 700;
        color: rgb(var(--primary));
        background: var(--grey-darker);
        padding: 2px 7px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        flex-shrink: 0;
      }
      .step-symbol .katex {
        font-size: 1.25em !important;
      }
      .playback-bar {
        background: var(--grey-dark);
        border-radius: 6px;
        padding: 4px 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
      }
      .ctrl-btn {
        padding: 5px 8px;
        border-radius: 5px;
        font-size: 11.5px;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.06);
        background: var(--grey-darker);
        color: var(--grey-lighter);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        font-family: var(--family-sans, system-ui, sans-serif);
      }
      .ctrl-btn:hover {
        color: rgb(var(--primary));
        border-color: rgba(var(--primary), 0.5);
        filter: drop-shadow(0px 0px 4px rgba(var(--primary), 0.35)) brightness(1.1);
      }
      .ctrl-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .ctrl-btn:disabled:hover {
        color: var(--grey-lighter);
        border-color: rgba(255, 255, 255, 0.06);
        filter: none;
      }
      .ctrl-btn-play {
        background: rgba(var(--primary), 0.16);
        color: rgb(var(--primary));
        border: 1px solid rgba(var(--primary), 0.35);
        padding: 5px 12px;
        flex: 1;
      }
      .ctrl-btn-play:hover {
        background: rgba(var(--primary), 0.28);
        border-color: rgb(var(--primary));
        filter: drop-shadow(0px 0px 4px rgba(var(--primary), 0.35)) brightness(1.1);
      }
      .matrix-box {
        background: var(--grey-dark);
        border-radius: 6px;
        padding: 6px 9px;
      }
      .matrix-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2px;
        background: var(--grey-darker);
        padding: 4px 5px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 11px;
        text-align: center;
        border: 1px solid var(--grey-dark);
      }
      .matrix-val {
        padding: 2px 0;
        color: var(--grey-light);
      }
      .matrix-val.active {
        color: rgb(var(--primary));
        font-weight: 700;
      }
      .canvas-viewport {
        position: relative;
        min-height: 380px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid var(--grey-dark);
        background: transparent;
      }
      .canvas-legend {
        position: absolute;
        bottom: 8px;
        left: 8px;
        background: var(--grey-dark);
        border: none;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 10.5px;
        line-height: 1.2;
        color: var(--grey-light);
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: none;
      }
    </style>

    <div class="transform-sim-wrap">
      <!-- Header -->
      <div class="transform-sim-header">
        <div class="transform-sim-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          Interactive 3D Transformation Chain Simulator
        </div>
        <div class="transform-sim-badge">
          Right-to-left evaluation & ghost reference frame
        </div>
      </div>

      <!-- Main Body Grid: Compact Left Column (290px), Full Right Column -->
      <div class="transform-sim-body">

        <!-- Left Controls & Step Pipeline -->
        <div class="transform-controls-panel">
          <!-- Preset Selectors (Left Panel) -->
          <div class="transform-sim-presets" id="preset-buttons">
            <button data-preset="trs" class="preset-btn active">Standard TRS</button>
            <button data-preset="rts" class="preset-btn">Orbit RTS</button>
            <button data-preset="multi_rot" class="preset-btn">Roll & Yaw</button>
          </div>

          <!-- Preset Description Callout -->
          <div id="preset-desc-box" class="transform-sim-desc">
            ${renderTextWithMath(PRESETS.trs.description)}
          </div>

          <!-- Step Pipeline -->
          <div>
            <div style="font-size: 10.5px; font-weight: 700; color: var(--grey-light); letter-spacing: 0.05em; margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center;">
              <span>Sequence (Right → Left)</span>
            </div>

            <div id="step-pipeline-list" class="step-pipeline-wrap">
              <!-- Populated dynamically -->
            </div>
          </div>

          <!-- Playback Controls -->
          <div class="playback-bar">
            <button id="btn-reset" class="ctrl-btn" title="Reset to Origin">
              ↺
            </button>
            <button id="btn-step-back" class="ctrl-btn" title="Step Back">
              ⏮
            </button>
            <button id="btn-play-pause" class="ctrl-btn ctrl-btn-play">
              <span id="play-text">▶ Play Chain</span>
            </button>
            <button id="btn-step-forward" class="ctrl-btn" title="Step Forward">
              ⏭
            </button>
          </div>

          <!-- Live 4x4 Matrix Display -->
          <div class="matrix-box">
            <div style="font-size: 10.5px; font-weight: 700; color: var(--grey-light); letter-spacing: 0.05em; margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center;">
              <span>Accumulated Matrix ${renderMath('\\mathbf{M}')}</span>
              <span style="font-size: 9px; color: var(--grey-light);">4×4 Float32</span>
            </div>
            <div id="matrix-grid-display" class="matrix-grid">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>

        <!-- Right 3D Canvas Viewport (Matches matrix background color) -->
        <div class="canvas-viewport">
          <div id="three-canvas-container" style="width: 100%; height: 100%; min-height: 340px;"></div>

          <div class="canvas-legend">
            <span style="display: flex; align-items: center; gap: 3px;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #ec5975;"></span> Model (+X/Y/Z)
            </span>
            <span style="display: flex; align-items: center; gap: 3px;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; border: 1px solid #71717a;"></span> Ghost Origin
            </span>
            <span style="color: var(--grey-light);">Drag to Orbit · Scroll to Zoom</span>
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
      <div id="step-row-${idx}" class="step-row">
        <div style="display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;">
          <div class="step-badge">${idx + 1}</div>
          <div style="display: flex; align-items: baseline; gap: 6px; overflow: hidden; white-space: nowrap;">
            <span style="font-size: 12.5px; font-weight: 700; color: var(--grey-lighter);">${renderTextWithMath(step.badgeName)}</span>
            <span style="font-size: 11px; color: var(--grey-light); text-overflow: ellipsis; overflow: hidden;">${renderTextWithMath(step.desc)}</span>
          </div>
        </div>
        <div class="step-symbol" data-math-term="${step.mathTerm || ''}" style="cursor: pointer;" title="Hover to view 4×4 Matrix Definition">${renderMath(step.latexSymbol)}</div>
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
        html += `<span class="matrix-val ${isChanged ? 'active' : ''}">${formatted}</span>`
      }
    }
    gridEl.innerHTML = html
  }

  function setPreset(key) {
    currentPresetKey = key
    const preset = PRESETS[key]

    mountEl.querySelectorAll('.preset-btn').forEach(btn => {
      if (btn.dataset.preset === key) {
        btn.classList.add('active')
      } else {
        btn.classList.remove('active')
      }
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
        row.className = 'step-row completed'
        if (badge) badge.textContent = '✓'
      } else if (state === 'active') {
        row.className = 'step-row active'
        if (badge) badge.textContent = String(idx + 1)
      } else {
        row.className = 'step-row'
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
    const playText = mountEl.querySelector('#play-text')
    if (state === 'playing' || state === 'animating_step' || state === 'digest_pause') {
      playText.textContent = '⏸ Pause'
    } else {
      playText.textContent = '▶ Play Chain'
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
