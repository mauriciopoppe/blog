/**
 * Interactive 3D Vector Decomposition & Quaternion Sandwich Explorer
 *
 * Implements:
 * - 3D vector decomposition (parallel projection + perpendicular rejection)
 * - KaTeX telemetry for v, v_parallel, v_perp, and rotated v' = q v q*
 * - Presets for Perpendicular, Arbitrary, and Axial vectors
 * - Angle scrubbing slider and animation playback controls
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { QuaternionDecompEngine } from './quaternion-decomp-engine.js'

function renderMath(tex, isDisplay = false) {
  if (typeof katex !== 'undefined') {
    return katex.renderToString(tex, {
      displayMode: isDisplay,
      throwOnError: false
    })
  }
  return tex
}

function renderTextWithMath(str) {
  return str
    .replace(/\$\$([^$]+)\$\$/g, (_, tex) => renderMath(tex, true))
    .replace(/\$([^$]+)\$/g, (_, tex) => renderMath(tex, false))
}

const DECOMP_PRESETS = {
  perpendicular: {
    title: 'Perpendicular Vector (v ⊥ n̂)',
    vector: [1.4, 0, 0],
    description:
      'When vector $\\mathbf{v}$ lies entirely in orthogonal plane $\\mathcal{P} \\perp \\hat{\\mathbf{n}}$, parallel component $\\mathbf{v}_\\parallel = \\mathbf{0}$ and dot product $\\hat{\\mathbf{n}} \\cdot \\mathbf{v} = 0$. One-sided rotor $qp = [0, \\cos\\theta \\mathbf{v} + \\sin\\theta(\\hat{\\mathbf{n}}\\times\\mathbf{v})]$ performs a direct 2D planar rotation with **zero scalar leakage**.'
  },
  arbitrary: {
    title: 'General Arbitrary 3D Vector',
    vector: [1.2, 0.9, 0],
    description:
      'When $\\mathbf{v}$ is inclined, non-zero projection $\\mathbf{v}_\\parallel = (\\mathbf{v}\\cdot\\hat{\\mathbf{n}})\\hat{\\mathbf{n}}$ causes one-sided $qp$ to leak scalar terms ($-\\lambda \\hat{\\mathbf{n}}\\cdot\\mathbf{v}$). The sandwich product $p^\\prime = q p q^*$ cancels this leakage: $\\mathbf{v}_\\parallel$ stays untouched while $\\mathbf{v}_\\perp$ rotates by $\\theta$.'
  },
  axial: {
    title: 'Axial Vector (v ∥ n̂)',
    vector: [0, 1.4, 0],
    description:
      'When $\\mathbf{v}$ aligns with rotation axis $\\hat{\\mathbf{n}}$, perpendicular component $\\mathbf{v}_\\perp = \\mathbf{0}$. The sandwich product evaluates to $q \\mathbf{v} q^* = \\mathbf{v}$, demonstrating that vectors along the rotation axis remain completely invariant.'
  }
}

function formatNum(n) {
  const rounded = Math.abs(n) < 0.001 ? 0 : n
  const s = rounded.toFixed(2)
  return rounded >= 0 ? `+${s}` : s
}

export function initQuaternionDecompExplorer(containerId = 'quaternion-decomp-explorer') {
  const root = document.getElementById(containerId)
  if (!root) return

  root.innerHTML = `
    <style>
      .decomp-sim-wrap {
        margin: 1.75rem 0;
        background: var(--grey-darker);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        overflow: hidden;
        font-family: var(--family-sans, system-ui, sans-serif);
      }
      .decomp-sim-header {
        padding: 10px 14px;
        background: var(--grey-dark);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      .decomp-sim-title {
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.06em;
        color: rgb(var(--primary));
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .decomp-sim-badge {
        font-size: 11px;
        letter-spacing: 0.04em;
        color: var(--grey-light);
      }
      .decomp-sim-body {
        display: grid;
        grid-template-columns: 330px 1fr;
        gap: 12px;
        padding: 12px;
      }
      @media (max-width: 860px) {
        .decomp-sim-body {
          grid-template-columns: 1fr;
        }
      }
      .decomp-sim-left {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .decomp-card {
        background: var(--grey-dark);
        border-radius: 8px;
        padding: 10px 12px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .decomp-card-title {
        font-size: 11.5px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: var(--grey-lighter);
        text-transform: uppercase;
      }
      .decomp-preset-select {
        background: var(--grey-darker);
        color: var(--grey-lighter);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
      }
      .decomp-preset-select:focus {
        outline: none;
        border-color: rgb(var(--primary));
      }
      .decomp-desc-box {
        font-size: 12px;
        line-height: 1.5;
        color: var(--grey-light);
      }
      .decomp-controls-row {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .decomp-btn {
        background: var(--grey-darker);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--grey-lighter);
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .decomp-btn:hover {
        border-color: rgb(var(--primary));
        color: rgb(var(--primary));
      }
      .decomp-btn.active {
        background: rgb(var(--primary));
        color: var(--grey-darker);
        border-color: rgb(var(--primary));
      }
      .decomp-slider-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--grey-dark);
        padding: 6px 10px;
        border-radius: 6px;
      }
      .decomp-slider-label {
        font-size: 11.5px;
        font-weight: 700;
        color: #34d399;
        min-width: 48px;
      }
      .decomp-slider {
        flex: 1;
        accent-color: #34d399;
        cursor: pointer;
      }
      .decomp-data-card {
        background: var(--grey-dark);
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 11.5px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .decomp-data-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }
      .decomp-data-label {
        color: var(--grey-light);
        font-size: 11px;
      }
      .decomp-data-val {
        font-family: monospace;
        font-size: 11px;
        color: var(--grey-lighter);
      }
      .decomp-canvas-wrap {
        position: relative;
        background: var(--grey-darker);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        min-height: 380px;
        overflow: hidden;
      }
      .decomp-canvas-overlay {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: var(--grey-dark);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 5px 9px;
        border-radius: 6px;
        font-size: 10.5px;
        color: var(--grey-light);
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .legend-dot {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }
      .decomp-sim-wrap .katex {
        font-size: 1.25em !important;
      }
      .decomp-sim-wrap .decomp-desc-box .katex {
        font-size: 1.2em !important;
      }
      .decomp-sim-wrap .decomp-data-card .katex {
        font-size: 1.25em !important;
      }
      .decomp-sim-wrap .decomp-canvas-overlay .katex {
        font-size: 1.25em !important;
      }
    </style>

    <div class="decomp-sim-wrap">
      <div class="decomp-sim-header">
        <div class="decomp-sim-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          3D VECTOR DECOMPOSITION &amp; SANDWICH ROTATION
        </div>
        <div class="decomp-sim-badge">Interactive Three.js Visualizer</div>
      </div>

      <div class="decomp-sim-body">
        <!-- Left Column: Controls & Telemetry -->
        <div class="decomp-sim-left">
          <!-- Preset Card -->
          <div class="decomp-card">
            <div class="decomp-card-title">Vector Configuration</div>
            <select class="decomp-preset-select" id="decomp-preset-select">
              <option value="perpendicular">1. Strictly Perpendicular (v ⊥ n̂)</option>
              <option value="arbitrary" selected>2. General Arbitrary 3D Vector</option>
              <option value="axial">3. Axial Vector (v ∥ n̂)</option>
            </select>
            <div class="decomp-desc-box" id="decomp-desc"></div>
          </div>

          <!-- Playback Controls -->
          <div class="decomp-card">
            <div class="decomp-card-title">Angle Scrubbing (θ)</div>
            <div class="decomp-controls-row">
              <button class="decomp-btn" id="decomp-btn-play">▶ Play</button>
              <button class="decomp-btn" id="decomp-btn-reset">Reset</button>
            </div>
            <div class="decomp-slider-wrap">
              <span class="decomp-slider-label" id="decomp-theta-label">θ = 0.0°</span>
              <input type="range" class="decomp-slider" id="decomp-slider" min="0" max="6.28318" step="0.01" value="0" />
            </div>
          </div>

          <!-- Vector Telemetry Card -->
          <div class="decomp-data-card">
            <div class="decomp-card-title">Algebraic Decomposition</div>
            <div class="decomp-data-row">
              <span class="decomp-data-label">Original $\\mathbf{v}$</span>
              <span class="decomp-data-val" id="decomp-v-orig">[ 1.20, 0.90, 0.00 ]</span>
            </div>
            <div class="decomp-data-row">
              <span class="decomp-data-label">Dot Product $\\hat{\\mathbf{n}} \\cdot \\mathbf{v}$</span>
              <span class="decomp-data-val" id="decomp-dot-val">0.90</span>
            </div>
            <div class="decomp-data-row">
              <span class="decomp-data-label">Parallel $\\mathbf{v}_\\parallel$</span>
              <span class="decomp-data-val" id="decomp-v-par">[ 0.00, 0.90, 0.00 ]</span>
            </div>
            <div class="decomp-data-row">
              <span class="decomp-data-label">Perpendicular $\\mathbf{v}_\\perp$</span>
              <span class="decomp-data-val" id="decomp-v-perp">[ 1.20, 0.00, 0.00 ]</span>
            </div>
            <div class="decomp-data-row">
              <span class="decomp-data-label">Rotated $\\mathbf{v}^\\prime = q \\mathbf{v} q^*$</span>
              <span class="decomp-data-val" style="color: #34d399; font-weight: 700;" id="decomp-v-prime">[ 1.20, 0.90, 0.00 ]</span>
            </div>
          </div>
        </div>

        <!-- Right Column: 3D Canvas -->
        <div class="decomp-canvas-wrap" id="decomp-canvas-container">
          <div class="decomp-canvas-overlay">
            <span class="legend-item"><span class="legend-dot" style="background: rgb(var(--primary));"></span> $\\mathbf{v}$ (Original)</span>
            <span class="legend-item"><span class="legend-dot" style="background: #fbbf24;"></span> $\\mathbf{v}_\\parallel$ (Parallel)</span>
            <span class="legend-item"><span class="legend-dot" style="background: #dadada;"></span> $\\mathbf{v}_\\perp$ (Perp)</span>
            <span class="legend-item"><span class="legend-dot" style="background: #34d399;"></span> $\\mathbf{v}^\\prime$ (Rotated)</span>
            <span class="legend-item"><span class="legend-dot" style="background: #fbbf24;"></span> Axis $\\hat{\\mathbf{n}}$</span>
          </div>
        </div>
      </div>
    </div>
  `

  const canvasContainer = root.querySelector('#decomp-canvas-container')
  const engine = new QuaternionDecompEngine(canvasContainer)

  const presetSelect = root.querySelector('#decomp-preset-select')
  const descEl = root.querySelector('#decomp-desc')
  const playBtn = root.querySelector('#decomp-btn-play')
  const resetBtn = root.querySelector('#decomp-btn-reset')
  const slider = root.querySelector('#decomp-slider')
  const thetaLabel = root.querySelector('#decomp-theta-label')

  const vOrigEl = root.querySelector('#decomp-v-orig')
  const dotValEl = root.querySelector('#decomp-dot-val')
  const vParEl = root.querySelector('#decomp-v-par')
  const vPerpEl = root.querySelector('#decomp-v-perp')
  const vPrimeEl = root.querySelector('#decomp-v-prime')

  function applyPreset(key) {
    const preset = DECOMP_PRESETS[key] || DECOMP_PRESETS.arbitrary
    engine.setVector(preset.vector)
    descEl.innerHTML = renderTextWithMath(preset.description)
  }

  function updateUI(state) {
    thetaLabel.textContent = `θ = ${state.angleDeg.toFixed(1)}°`
    slider.value = state.angleRad

    const [vx, vy, vz] = state.vOriginal
    vOrigEl.textContent = `[ ${formatNum(vx)}, ${formatNum(vy)}, ${formatNum(vz)} ]`

    dotValEl.textContent = state.dotProduct.toFixed(2)

    const [px, py, pz] = state.vParallel
    vParEl.textContent = `[ ${formatNum(px)}, ${formatNum(py)}, ${formatNum(pz)} ]`

    const [qx, qy, qz] = state.vPerp
    vPerpEl.textContent = `[ ${formatNum(qx)}, ${formatNum(qy)}, ${formatNum(qz)} ]`

    const [rx, ry, rz] = state.vPrime
    vPrimeEl.textContent = `[ ${formatNum(rx)}, ${formatNum(ry)}, ${formatNum(rz)} ]`

    playBtn.textContent = state.isPlaying ? '❚❚ Pause' : '▶ Play'
    if (state.isPlaying) {
      playBtn.classList.add('active')
    } else {
      playBtn.classList.remove('active')
    }
  }

  engine.subscribe(updateUI)

  presetSelect.addEventListener('change', (e) => {
    applyPreset(e.target.value)
  })

  playBtn.addEventListener('click', () => engine.togglePlay())
  resetBtn.addEventListener('click', () => {
    engine.pause()
    engine.setAngle(0)
  })

  slider.addEventListener('input', (e) => {
    engine.pause()
    engine.setAngle(parseFloat(e.target.value))
  })

  // Render KaTeX in static overlay & labels
  const labelsContainer = root.querySelector('#decomp-labels-container')
  if (labelsContainer) {
    labelsContainer.querySelectorAll('.decomp-3d-label').forEach((el) => {
      el.innerHTML = renderTextWithMath(el.innerHTML)
    })
  }
  const overlayEl = root.querySelector('.decomp-canvas-overlay')
  if (overlayEl) {
    overlayEl.innerHTML = renderTextWithMath(overlayEl.innerHTML)
  }
  const dataCardEl = root.querySelector('.decomp-data-card')
  if (dataCardEl) {
    dataCardEl.querySelectorAll('.decomp-data-label').forEach((el) => {
      el.innerHTML = renderTextWithMath(el.innerHTML)
    })
  }

  applyPreset('arbitrary')
  engine.emitState()

  // Pause the render loop when the simulator leaves the viewport
  if (typeof IntersectionObserver !== 'undefined') {
    const viewportObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          engine.resumeLoop()
        } else {
          engine.pauseLoop()
        }
      })
    })
    viewportObserver.observe(root)
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      engine.pauseLoop()
    } else {
      engine.resumeLoop()
    }
  })
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initQuaternionDecompExplorer())
  } else {
    initQuaternionDecompExplorer()
  }
}
