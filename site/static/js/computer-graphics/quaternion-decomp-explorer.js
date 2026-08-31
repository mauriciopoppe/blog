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
  if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(tex, {
        displayMode: isDisplay,
        throwOnError: false
      })
    } catch {
      return tex
    }
  }
  return tex
}

function renderTextWithMath(str) {
  if (!str) return ''
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
      .decomp-slider {
        -webkit-appearance: none;
        appearance: none;
        height: 28px;
        background: transparent;
        cursor: pointer;
        --range-fill: 50%;
      }
      .decomp-slider::-webkit-slider-runnable-track { height: 8px; border-radius: 999px; background: linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) var(--range-fill), var(--ring-border) var(--range-fill), var(--ring-border) 100%); }
      .decomp-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); margin-top: -5px; box-shadow: var(--elevation-subtle); }
      .decomp-slider::-moz-range-track { height: 8px; border-radius: 999px; background: var(--ring-border); }
      .decomp-slider::-moz-range-progress { height: 8px; border-radius: 999px; background: rgb(var(--primary)); }
      .decomp-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); box-shadow: var(--elevation-subtle); }
      .decomp-slider:hover::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
      .decomp-slider:hover::-moz-range-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
      .decomp-slider:focus-visible { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; border-radius: 999px; }
      #quaternion-decomp-explorer .katex { font-size: 0.9em !important; }
      #quaternion-decomp-explorer #decomp-overlay .katex { font-size: 1.15em !important; }
    </style>

    <div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden tw-font-sans">
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
        <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary tw-flex tw-items-center tw-gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          3D Vector Decomposition &amp; Sandwich Rotation
        </div>
        <div class="tw-font-serif tw-text-sm tw-text-[var(--grey-light)]">Interactive Three.js Visualizer</div>
      </div>

      <div class="tw-grid tw-grid-cols-[330px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif max-[860px]:tw-grid-cols-1">
        <!-- Left Column: Controls & Telemetry -->
        <div class="tw-flex tw-flex-col tw-gap-2.5">
          <!-- Preset Card -->
          <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-3 tw-py-2.5 tw-flex tw-flex-col tw-gap-1.5">
            <div class="tw-font-sans tw-text-[0.8125rem] tw-font-semibold tw-text-[var(--grey-lighter)]">Vector Configuration</div>
            <select class="tw-w-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle tw-text-[var(--grey-lighter)] tw-rounded-md tw-px-2.5 tw-py-1.5 tw-text-xs tw-font-semibold tw-cursor-pointer focus:tw-outline-none focus:tw-border-[rgb(var(--primary))]" id="decomp-preset-select">
              <option value="perpendicular">1. Strictly Perpendicular (v ⊥ n̂)</option>
              <option value="arbitrary" selected>2. General Arbitrary 3D Vector</option>
              <option value="axial">3. Axial Vector (v ∥ n̂)</option>
            </select>
            <div class="tw-text-xs tw-leading-relaxed tw-text-[var(--grey-light)]" id="decomp-desc"></div>
          </div>

          <!-- Playback Controls -->
          <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-3 tw-py-2.5 tw-flex tw-flex-col tw-gap-1.5">
            <div class="tw-font-sans tw-text-[0.8125rem] tw-font-semibold tw-text-[var(--grey-lighter)]">Angle Scrubbing (θ)</div>
            <div class="tw-flex tw-gap-1.5 tw-items-center">
              <button type="button" class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-3 tw-py-2 tw-rounded-md tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-inline-flex tw-items-center tw-gap-1 hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft" id="decomp-btn-play">▶ Play</button>
              <button type="button" class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-3 tw-py-2 tw-rounded-md tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-inline-flex tw-items-center tw-gap-1 hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft" id="decomp-btn-reset">Reset</button>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2 tw-bg-[var(--grey-dark)] tw-px-2.5 tw-py-1.5 tw-rounded-md">
              <span class="tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-text-primary tw-min-w-[48px]" id="decomp-theta-label">θ = 0.0°</span>
              <input type="range" class="decomp-slider tw-flex-1" id="decomp-slider" min="0" max="6.28318" step="0.01" value="0" />
            </div>
          </div>

          <!-- Vector Telemetry Card -->
          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[11.5px] tw-leading-tight tw-flex tw-flex-col tw-gap-1.5" id="decomp-data-card">
            <div class="tw-font-sans tw-text-[0.8125rem] tw-font-semibold tw-text-[var(--grey-lighter)]">Algebraic Decomposition</div>
            <div class="tw-flex tw-justify-between tw-items-center tw-gap-2">
              <span class="decomp-label tw-font-serif tw-text-[0.75rem] tw-text-[var(--grey-light)]">${renderTextWithMath('Original $\\mathbf{v}$')}</span>
              <span class="tw-font-mono tw-text-[11px] tw-text-[var(--grey-lighter)]" id="decomp-v-orig">[ 1.20, 0.90, 0.00 ]</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center tw-gap-2">
              <span class="decomp-label tw-font-serif tw-text-[0.75rem] tw-text-[var(--grey-light)]">${renderTextWithMath('Dot Product $\\hat{\\mathbf{n}} \\cdot \\mathbf{v}$')}</span>
              <span class="tw-font-mono tw-text-[11px] tw-text-[var(--grey-lighter)]" id="decomp-dot-val">0.90</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center tw-gap-2">
              <span class="decomp-label tw-font-serif tw-text-[0.75rem] tw-text-[var(--grey-light)]">${renderTextWithMath('Parallel $\\mathbf{v}_\\parallel$')}</span>
              <span class="tw-font-mono tw-text-[11px] tw-text-[var(--grey-lighter)]" id="decomp-v-par">[ 0.00, 0.90, 0.00 ]</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center tw-gap-2">
              <span class="decomp-label tw-font-serif tw-text-[0.75rem] tw-text-[var(--grey-light)]">${renderTextWithMath('Perpendicular $\\mathbf{v}_\\perp$')}</span>
              <span class="tw-font-mono tw-text-[11px] tw-text-[var(--grey-lighter)]" id="decomp-v-perp">[ 1.20, 0.00, 0.00 ]</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center tw-gap-2">
              <span class="decomp-label tw-font-serif tw-text-[0.75rem] tw-text-[var(--grey-light)]">${renderTextWithMath('Rotated $\\mathbf{v}^\\prime = q \\mathbf{v} q^*$')}</span>
              <span class="tw-font-mono tw-text-[11px] tw-font-bold tw-text-[#34d399]" id="decomp-v-prime">[ 1.20, 0.90, 0.00 ]</span>
            </div>
          </div>
        </div>

        <!-- Right Column: 3D Canvas -->
        <div class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[380px] tw-overflow-hidden" id="decomp-canvas-container">
          <div class="tw-absolute tw-bottom-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-text-xs tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-flex-col tw-gap-1" id="decomp-overlay">
            <div class="tw-flex tw-items-center tw-gap-x-3.5 tw-leading-tight">
              <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: rgb(var(--primary));"></span> ${renderTextWithMath('$\\mathbf{v}$ (Original)')}</span>
              <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #fbbf24;"></span> ${renderTextWithMath('$\\mathbf{v}_\\parallel$ (Parallel)')}</span>
              <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #dadada;"></span> ${renderTextWithMath('$\\mathbf{v}_\\perp$ (Perp)')}</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-x-3.5 tw-leading-tight">
              <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #34d399;"></span> ${renderTextWithMath('$\\mathbf{v}^\\prime$ (Rotated)')}</span>
              <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #fbbf24;"></span> ${renderTextWithMath('Axis $\\hat{\\mathbf{n}}$')}</span>
            </div>
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
    syncSliderFill(slider)

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
    syncSliderFill(slider)
  })

  function syncSliderFill(sl) {
    const pct = ((parseFloat(sl.value) - parseFloat(sl.min)) / (parseFloat(sl.max) - parseFloat(sl.min))) * 100
    sl.style.setProperty('--range-fill', pct + '%')
  }
  syncSliderFill(slider)

  // Render KaTeX in static overlay & labels
  const labelsContainer = root.querySelector('#decomp-labels-container')
  if (labelsContainer) {
    labelsContainer.querySelectorAll('.decomp-3d-label').forEach((el) => {
      el.innerHTML = renderTextWithMath(el.innerHTML)
    })
  }
  const overlayEl = root.querySelector('#decomp-overlay')
  if (overlayEl) {
    overlayEl.innerHTML = renderTextWithMath(overlayEl.innerHTML)
  }
  const dataCardEl = root.querySelector('#decomp-data-card')
  if (dataCardEl) {
    dataCardEl.querySelectorAll('.decomp-label').forEach((el) => {
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
