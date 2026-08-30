import { CoordinateFrameEngine, FRAME_PRESETS } from './coordinate-frame-engine.js'

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

export function initCoordinateFrameExplorer(containerId = 'coordinate-frame-simulator') {
  const root = document.getElementById(containerId)
  if (!root) return

  const PRESET_BASE = 'preset-btn tw-flex-1 tw-text-center tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-px-2.5 tw-py-1.5 tw-leading-none tw-cursor-pointer'
  const PRESET_INACTIVE = PRESET_BASE + ' tw-bg-transparent tw-text-[var(--grey-light)]'
  const PRESET_ACTIVE = PRESET_BASE + ' tw-bg-primary-soft tw-text-primary'

  const CTRL_BTN = 'tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:hover:tw-border-[var(--ring-border)] disabled:hover:tw-text-[var(--grey-light)] disabled:hover:tw-bg-[var(--grey-dark)]'
  const PLAY_NEUTRAL = 'tw-flex-1 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft'
  const PLAY_ACTIVE = 'tw-flex-1 tw-bg-primary-soft tw-border tw-border-primary-border tw-text-primary tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-bg-primary-soft hover:tw-border-primary'

  const STEP_ROW_BASE = 'step-row tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1 tw-rounded-md tw-border tw-border-[var(--ring-border)] tw-bg-[var(--grey-dark)] tw-transition'
  const STEP_ROW_ACTIVE = 'step-row tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1 tw-rounded-md tw-border tw-border-[rgba(var(--primary),0.6)] tw-bg-[rgba(var(--primary),0.08)] tw-transition'
  const STEP_ROW_COMPLETED = 'step-row tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1 tw-rounded-md tw-border tw-border-[var(--ring-border)] tw-bg-[var(--grey-dark)] tw-opacity-55 tw-pointer-events-none'

  const STEP_BADGE_BASE = 'tw-w-[18px] tw-h-[18px] tw-rounded-full tw-text-[10px] tw-font-bold tw-flex tw-items-center tw-justify-center tw-bg-[var(--grey-darker)] tw-text-[var(--grey-light)] tw-shrink-0'
  const STEP_BADGE_ACTIVE = 'tw-w-[18px] tw-h-[18px] tw-rounded-full tw-text-[10px] tw-font-bold tw-flex tw-items-center tw-justify-center tw-bg-[rgb(var(--primary))] tw-text-[var(--grey-darker)] tw-shrink-0'
  const STEP_BADGE_COMPLETED = 'tw-w-[18px] tw-h-[18px] tw-rounded-full tw-text-[10px] tw-font-bold tw-flex tw-items-center tw-justify-center tw-bg-[var(--grey)] tw-text-[var(--grey-lighter)] tw-shrink-0'

  const STEP_SYMBOL = 'step-symbol tw-text-[13.5px] tw-font-bold tw-text-primary tw-bg-[var(--grey-darker)] tw-px-[7px] tw-py-[2px] tw-rounded-[4px] tw-flex tw-items-center tw-justify-center tw-min-w-[32px] tw-shrink-0'

  const cameraRevealNote = `
    <div class="tw-mt-1 tw-text-[0.6875rem] tw-leading-tight tw-text-[var(--grey-light)]">
      The camera, its view (PiP), and the frustum appear once the transform completes
    </div>`

  // Build UI Container with Scoped Styles matching the Design System
  root.innerHTML = `
    <style>
      @keyframes coord-flash {
        0% { color: rgb(var(--primary)); text-shadow: 0 0 6px rgba(var(--primary), 0.55); }
        100% { color: var(--grey-light); text-shadow: none; }
      }
      .coord-flash {
        animation: coord-flash 1.2s ease-out;
      }
      #coordinate-frame-simulator .katex {
        font-size: 0.8em !important;
      }
      #coordinate-frame-simulator .step-symbol .katex {
        font-size: 1.25em !important;
      }
      #coordinate-frame-simulator .coord-chip .katex {
        font-size: 1.15em !important;
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
          Coordinate Frames & Camera View Transform
        </div>
        <div class="tw-font-serif tw-text-sm tw-text-[var(--grey-light)]">${renderTextWithMath('Watch $\\mathbf{p}$ keep its $(u,v,w)$ coordinates as the world moves')}</div>
      </div>

      <!-- Main Body Grid -->
      <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif max-[860px]:tw-grid-cols-1">
        <!-- Left Panel -->
        <div class="tw-flex tw-flex-col tw-gap-1.5">
          <!-- Presets -->
          <div class="tw-flex tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden" id="frame-preset-buttons">
            <button type="button" data-preset="default_camera" class="${PRESET_ACTIVE}">Default Camera</button>
            <button type="button" data-preset="top_down" class="${PRESET_INACTIVE}">Top-Down</button>
            <button type="button" data-preset="pure_offset" class="${PRESET_INACTIVE}">Pure Offset</button>
          </div>

          <!-- Description Callout -->
          <div id="frame-desc-box" class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-1.5 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[30px]">
            ${FRAME_PRESETS.default_camera.description}${cameraRevealNote}
          </div>

          <!-- Step Progression Pipeline -->
          <div id="frame-step-pipeline" class="tw-flex tw-flex-col tw-gap-1">
            <!-- Rendered dynamically -->
          </div>

          <!-- Playback Controls -->
          <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-1.5 tw-flex tw-gap-1.5 tw-items-stretch">
            <button type="button" id="btn-frame-reset" class="${CTRL_BTN}" title="Reset to Rest State">↺</button>
            <button type="button" id="btn-frame-back" class="${CTRL_BTN}" title="Step Back">⏮</button>
            <button type="button" id="btn-frame-play" class="${PLAY_NEUTRAL}">
              <span id="frame-play-text">▶ Play</span>
            </button>
            <button type="button" id="btn-frame-forward" class="${CTRL_BTN}" title="Step Forward">⏭</button>
          </div>

          <!-- Live Frame Matrix Display -->
          <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-1.5">
            <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-light)] tw-tracking-[0.05em] tw-mb-1 tw-flex tw-justify-between tw-items-center tw-gap-2 tw-whitespace-nowrap">
              <span id="label-frame-mat">Frame Matrix $\mathbf{M}_{\text{frame}}$</span>
              <span class="tw-font-mono tw-text-[0.625rem] tw-text-[var(--grey-light)]">4×4 Float32</span>
            </div>
            <div id="frame-matrix-grid" class="tw-grid tw-grid-cols-4 tw-gap-0.5 tw-bg-[var(--grey-darker)] tw-p-1 tw-rounded-[5px] tw-font-mono tw-text-[11px] tw-text-center tw-border tw-border-[var(--ring-border)]"></div>
          </div>
        </div>

        <!-- Right 3D Viewport -->
        <div class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[320px] tw-overflow-hidden">
          <div id="frame-three-mount" class="tw-w-full tw-h-full tw-min-h-[340px]"></div>

          <div class="coord-chip tw-absolute tw-top-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-px-2 tw-py-1 tw-rounded-md tw-text-[11px] tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-flex-col tw-gap-0.5">
            <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-whitespace-nowrap tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">🌐 Canonical</span>
              <span class="tw-font-mono tw-text-[var(--grey-light)] tw-flex tw-items-baseline tw-gap-1"><span id="label-p-xyz">$\\mathbf{p}_{\\text{xyz}}$</span>: <span id="val-p-xyz">(0.0, 0.0, 0.0)</span></span>
            </div>
            <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-whitespace-nowrap tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">📷 Nested</span>
              <span class="tw-font-mono tw-text-[var(--grey-light)] tw-flex tw-items-baseline tw-gap-1"><span id="label-p-uvw">$\\mathbf{p}_{\\text{uvw}}$</span>: <span id="val-p-uvw">(0.0, 0.0, 0.0)</span></span>
            </div>
          </div>

          <div class="tw-absolute tw-bottom-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-px-2 tw-py-1 tw-rounded-md tw-text-[11px] tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-flex-col tw-gap-0.5">
            <div class="tw-flex tw-items-center tw-gap-1.5 tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">${renderTextWithMath('Canonical $(x,y,z)$:')}</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#ef4444]"></span> +x</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#22c55e]"></span> +y</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#38bdf8]"></span> +z</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-1.5 tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">${renderTextWithMath('Nested $(u,v,w)$:')}</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#f43f5e]"></span> +u</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#10b981]"></span> +v</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#3b82f6]"></span> +w</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-1.5 tw-leading-tight">
              <span class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">Target:</span>
              <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#fbbf24]"></span> p</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const mountContainer = root.querySelector('#frame-three-mount')
  const engine = new CoordinateFrameEngine(mountContainer)

  const descBox = root.querySelector('#frame-desc-box')
  const playText = root.querySelector('#frame-play-text')
  const matrixGrid = root.querySelector('#frame-matrix-grid')
  const valPxyz = root.querySelector('#val-p-xyz')
  const valPuvw = root.querySelector('#val-p-uvw')
  const stepPipeline = root.querySelector('#frame-step-pipeline')
  let prevIsDone = false

  // Only the two actual view transform steps — the starting configuration
  // is the premise/setup, not a step of its own.
  const stepsDef = [
    {
      num: '1',
      name: 'Translate by −e',
      desc: 'Displace eye to canonical origin $(0,0,0)$',
      symbol: '\\mathbf{T}_{-\\mathbf{e}}',
      term: 'T_-e',
      engineStep: 1   // corresponds to engine currentStepIndex = 1
    },
    {
      num: '2',
      name: 'Rotate by Rᵀ',
      desc: 'Align $(u,v,w)$ with canonical $(x,y,z)$',
      symbol: '\\mathbf{R}^{T}',
      term: 'R^T',
      engineStep: 2
    }
  ]

  function renderStepsUI() {
    stepPipeline.innerHTML = stepsDef.map((s, idx) => `
      <div id="frame-step-${idx}" class="${STEP_ROW_BASE}">
        <div class="tw-flex tw-items-center tw-gap-1.5 tw-flex-1 tw-min-w-0">
          <div class="step-badge ${STEP_BADGE_BASE}">${s.num}</div>
          <div class="tw-flex tw-flex-col tw-min-w-0">
            <span class="tw-font-sans tw-text-[0.6875rem] tw-font-semibold tw-text-[var(--grey-lighter)]">${renderTextWithMath(s.name)}</span>
            <span class="tw-font-serif tw-text-[0.75rem] tw-leading-tight tw-text-[var(--grey-light)]">${renderTextWithMath(s.desc)}</span>
          </div>
        </div>
        <div class="${STEP_SYMBOL}" data-math-term="${s.term}" title="Hover to view Definition">${renderMath(s.symbol)}</div>
      </div>
    `).join('')
  }

  function updateMatrixDisplay(elts) {
    let html = ''
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = elts[c * 4 + r]
        const isDiagonal = r === c
        const isHighlight = val !== (isDiagonal ? 1 : 0)
        html += `<span class="${isHighlight ? 'tw-text-primary tw-font-bold' : 'tw-text-[var(--grey-light)]'}">${formatNum(val)}</span>`
      }
    }
    matrixGrid.innerHTML = html
  }

  function updateUI(state) {
    // Preset buttons
    root.querySelectorAll('.preset-btn').forEach(btn => {
      btn.className = btn.dataset.preset === state.presetKey ? PRESET_ACTIVE : PRESET_INACTIVE
    })

    // Preset description
    const preset = FRAME_PRESETS[state.presetKey]
    if (preset) {
      descBox.innerHTML = renderTextWithMath(preset.description) + cameraRevealNote
    }

    // Static Math Labels
    const labelPxyz = root.querySelector('#label-p-xyz')
    if (labelPxyz) labelPxyz.innerHTML = renderMath('\\mathbf{p}_{\\text{xyz}}')
    const labelPuvw = root.querySelector('#label-p-uvw')
    if (labelPuvw) labelPuvw.innerHTML = renderMath('\\mathbf{p}_{\\text{uvw}}')
    const labelFrameMat = root.querySelector('#label-frame-mat')

    // Completion state: all transforms applied
    const isDone = state.currentStepIndex >= 2 && Math.abs(state.animationProgress - 2) < 0.01
    engine.setRestReveal(isDone)

    // When the chain is fully applied there is no next step, so disable
    // stepping forward until reset or step back.
    const forwardBtn = root.querySelector('#btn-frame-forward')
    if (forwardBtn) forwardBtn.disabled = isDone

    // Step rows: 2 rows (T_{-e} and R^T), row i maps to engine step i+1.
    // Passive status cards — interaction lives on the playback buttons only.
    // active    = currentStepIndex === i   → this is the next pending transform
    // completed = currentStepIndex > i     → transform already applied
    // plain     = currentStepIndex < i     → future
    for (let i = 0; i < stepsDef.length; i++) {
      const row = root.querySelector(`#frame-step-${i}`)
      const badge = row ? row.querySelector('.step-badge') : null
      if (!row) continue
      const engineStep = stepsDef[i].engineStep  // 1 or 2
      if (isDone || state.currentStepIndex >= engineStep) {
        // Transform already applied
        row.className = STEP_ROW_COMPLETED
        if (badge) badge.className = `step-badge ${STEP_BADGE_COMPLETED}`
        if (badge) badge.textContent = '✓'
      } else if (state.currentStepIndex === engineStep - 1) {
        // Next pending — highlighted
        row.className = STEP_ROW_ACTIVE
        if (badge) badge.className = `step-badge ${STEP_BADGE_ACTIVE}`
        if (badge) badge.textContent = stepsDef[i].num
      } else {
        // Future (not yet reachable without applying previous step)
        row.className = STEP_ROW_BASE
        if (badge) badge.className = `step-badge ${STEP_BADGE_BASE}`
        if (badge) badge.textContent = stepsDef[i].num
      }
    }

    // Play button: neutral at rest, primary while playing, label swaps
    const playBtn = root.querySelector('#btn-frame-play')
    if (state.isPlaying) {
      playBtn.className = PLAY_ACTIVE
      playText.textContent = '⏸ Pause'
    } else if (isDone) {
      playBtn.className = PLAY_NEUTRAL
      playText.textContent = '↺ Replay'
    } else {
      playBtn.className = PLAY_NEUTRAL
      playText.textContent = '▶ Play'
    }

    // Coordinate displays (compact 1-decimal format)
    valPxyz.textContent = `(${formatCoord(state.pointWorld[0])}, ${formatCoord(state.pointWorld[1])}, ${formatCoord(state.pointWorld[2])})`
    valPuvw.textContent = `(${formatCoord(state.pointLocal[0])}, ${formatCoord(state.pointLocal[1])}, ${formatCoord(state.pointLocal[2])})`

    // Matrix — the display mirrors the pipeline: the frame matrix at rest,
    // the T_-e translation after step 1, and the full view matrix after step 2.
    if (state.currentStepIndex === 2) {
      if (labelFrameMat) labelFrameMat.innerHTML = `View Matrix ${renderMath('\\mathbf{M}_{\\text{view}} = \\mathbf{R}^T \\mathbf{T}_{-\\mathbf{e}}')}`
      updateMatrixDisplay(state.viewMatrix)
    } else if (state.currentStepIndex === 1) {
      if (labelFrameMat) labelFrameMat.innerHTML = `Step 1: Translation ${renderMath('\\mathbf{T}_{-\\mathbf{e}}')}`
      updateMatrixDisplay(state.translationMatrix)
    } else {
      if (labelFrameMat) labelFrameMat.innerHTML = `Frame Matrix ${renderMath('\\mathbf{M}_{\\text{frame}}')}`
      updateMatrixDisplay(state.frameMatrix)
    }

    // Flash the nested-coordinate readout when the chain completes, pointing
    // at the invariant: p_uvw kept its coordinates while the world moved.
    if (isDone && !prevIsDone) {
      valPuvw.classList.remove('coord-flash')
      setTimeout(() => valPuvw.classList.add('coord-flash'), 0)
    }
    prevIsDone = isDone
  }

  // Hook preset clicks
  root.querySelector('#frame-preset-buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('.preset-btn')
    if (btn && btn.dataset.preset) {
      engine.applyPreset(btn.dataset.preset)
    }
  })

  // Hook playback controls
  root.querySelector('#btn-frame-play').addEventListener('click', () => {
    if (engine.isPlaying) {
      engine.pause()
    } else {
      // If transforms are fully applied, reset to step 0 before playing again
      const isDone = engine.currentStepIndex >= 2 && Math.abs(engine.animationProgress - 2) < 0.01
      if (isDone) engine.reset()
      engine.play()
    }
  })

  root.querySelector('#btn-frame-reset').addEventListener('click', () => engine.reset())
  root.querySelector('#btn-frame-back').addEventListener('click', () => engine.stepBackward())
  root.querySelector('#btn-frame-forward').addEventListener('click', () => engine.stepForward())

  engine.on('state-changed', (state) => updateUI(state))

  // Live coordinate updates during step animation. state-changed only fires at
  // step boundaries; this keeps p_xyz tracking the point as it slides through
  // the view transform.
  engine.on('point-updated', ({ pointWorld, pointLocal }) => {
    valPxyz.textContent = `(${formatCoord(pointWorld[0])}, ${formatCoord(pointWorld[1])}, ${formatCoord(pointWorld[2])})`
    valPuvw.textContent = `(${formatCoord(pointLocal[0])}, ${formatCoord(pointLocal[1])}, ${formatCoord(pointLocal[2])})`
  })

  // Initial render
  renderStepsUI()
  updateUI(engine.getState())

  // Re-render when KaTeX finishes loading
  if (typeof window !== 'undefined' && !window.katex) {
    window.addEventListener('load', () => {
      renderStepsUI()
      updateUI(engine.getState())
    }, { once: true })
  }
}

// Auto initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCoordinateFrameExplorer())
  } else {
    initCoordinateFrameExplorer()
  }
}
