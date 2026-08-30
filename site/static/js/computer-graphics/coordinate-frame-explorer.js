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

  const cameraRevealNote = `
    <div style="margin-top: 6px; font-size: 10px; color: var(--grey-light); line-height: 1.3;">
      The camera, its view (PiP), and the frustum appear once the transform completes
    </div>`

  // Build UI Container with Scoped Styles matching the Design System
  root.innerHTML = `
    <style>
      .coord-sim-wrap {
        margin: 1.75rem 0;
        background: var(--grey-darker);
        border: 1px solid var(--grey-dark);
        border-radius: 12px;
        overflow: hidden;
        font-family: var(--family-sans, system-ui, sans-serif);
      }
      .coord-sim-header {
        padding: 10px 14px;
        background: var(--grey-dark);
        border-bottom: 1px solid var(--grey-dark);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      .coord-sim-title {
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: rgb(var(--primary));
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .coord-sim-badge {
        font-size: 11px;
        letter-spacing: 0.04em;
        color: var(--grey-light);
      }
      .coord-sim-body {
        display: grid;
        grid-template-columns: 335px 1fr;
        gap: 12px;
        padding: 12px;
      }
      @media (max-width: 860px) {
        .coord-sim-body {
          grid-template-columns: 1fr;
        }
      }
      .coord-sim-left {
        display: flex;
        flex-direction: column;
        gap: 9px;
      }
      .coord-sim-presets {
        display: flex;
        gap: 5px;
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
      .coord-sim-wrap .katex {
        font-size: 1.25em !important;
      }
      .coord-chip {
        position: absolute;
        top: 8px;
        left: 8px;
        background: var(--grey-dark);
        border: 1px solid var(--grey-dark);
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 10px;
        line-height: 1.3;
        color: var(--grey-light);
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .coord-chip-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        white-space: nowrap;
        font-family: var(--family-sans, system-ui, sans-serif);
      }
      .coord-chip-label {
        font-weight: 700;
        color: var(--grey-lighter);
      }
      .coord-chip-val {
        font-family: monospace;
        color: var(--grey-light);
        display: flex;
        align-items: baseline;
        gap: 3px;
      }
      .coord-chip .katex {
        font-size: 1.15em !important;
      }
      .coord-sim-desc {
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
        background: var(--grey-dark);
        border: 1px solid transparent;
        transition: all 0.25s ease;
        cursor: pointer;
      }
      .step-row:hover {
        border-color: rgba(var(--primary), 0.3);
      }
      .step-row.active {
        border-color: rgba(var(--primary), 0.6);
        background: rgba(var(--primary), 0.08);
        cursor: pointer;
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
        border: 1px solid var(--grey-dark);
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
        border-color: var(--grey);
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
        flex-direction: column;
        gap: 2px;
        pointer-events: none;
      }
      .legend-row {
        display: flex;
        align-items: center;
        gap: 6px;
        line-height: 1.2;
      }
      @keyframes coord-flash {
        0% { color: rgb(var(--primary)); text-shadow: 0 0 6px rgba(var(--primary), 0.55); }
        100% { color: var(--grey-light); text-shadow: none; }
      }
      .coord-flash {
        animation: coord-flash 1.2s ease-out;
      }
      .legend-title {
        font-weight: 700;
        color: var(--grey-lighter);
        margin-right: 2px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .legend-dot {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }
    </style>

    <div class="coord-sim-wrap">
      <!-- Header -->
      <div class="coord-sim-header">
        <div class="coord-sim-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          Coordinate Frames & Camera View Transform
        </div>
        <div class="coord-sim-badge">Watch $\\mathbf{p}$ keep its $(u,v,w)$ coordinates as the world moves</div>
      </div>

      <!-- Main Body Grid -->
      <div class="coord-sim-body">
        <!-- Left Panel -->
        <div class="coord-sim-left">
          <!-- Presets -->
          <div class="coord-sim-presets" id="frame-preset-buttons">
            <button data-preset="default_camera" class="preset-btn active">Default Camera</button>
            <button data-preset="top_down" class="preset-btn">Top-Down</button>
            <button data-preset="pure_offset" class="preset-btn">Pure Offset</button>
          </div>

          <!-- Description Callout -->
          <div id="frame-desc-box" class="coord-sim-desc">
            ${FRAME_PRESETS.default_camera.description}${cameraRevealNote}
          </div>

          <!-- Step Progression Pipeline -->
          <div>
            <div style="font-size: 10.5px; font-weight: 700; color: var(--grey-light); letter-spacing: 0.05em; margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center;">
              <span>View Transform Pipeline</span>
              <span id="frame-step-badge" style="font-size: 10.5px; color: rgb(var(--primary)); font-family: monospace;">Canonical Space</span>
            </div>

            <div class="step-pipeline-wrap" id="frame-step-pipeline">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- Playback Controls -->
          <div class="playback-bar">
            <button id="btn-frame-reset" class="ctrl-btn" title="Reset to Rest State">↺</button>
            <button id="btn-frame-back" class="ctrl-btn" title="Step Back">⏮</button>
            <button id="btn-frame-play" class="ctrl-btn ctrl-btn-play">
              <span id="frame-play-text">▶ Play Transform</span>
            </button>
            <button id="btn-frame-forward" class="ctrl-btn" title="Step Forward">⏭</button>
          </div>

          <!-- Live Frame Matrix Display -->
          <div class="matrix-box">
            <div style="font-size: 10.5px; font-weight: 700; color: var(--grey-light); letter-spacing: 0.05em; margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center;">
              <span id="label-frame-mat">Frame Matrix $\mathbf{M}_{\text{frame}}$</span>
              <span style="font-size: 9.5px; color: var(--grey-light);">4×4 Float32</span>
            </div>
            <div id="frame-matrix-grid" class="matrix-grid"></div>
          </div>
        </div>

        <!-- Right 3D Viewport -->
        <div class="canvas-viewport">
          <div id="frame-three-mount" style="width: 100%; height: 100%; min-height: 380px;"></div>

          <div class="coord-chip">
            <div class="coord-chip-row">
              <span class="coord-chip-label">🌐 Canonical</span>
              <span class="coord-chip-val"><span id="label-p-xyz">$\\mathbf{p}_{\\text{xyz}}$</span>: <span id="val-p-xyz">(0.0, 0.0, 0.0)</span></span>
            </div>
            <div class="coord-chip-row">
              <span class="coord-chip-label">📷 Nested</span>
              <span class="coord-chip-val"><span id="label-p-uvw">$\\mathbf{p}_{\\text{uvw}}$</span>: <span id="val-p-uvw">(0.0, 0.0, 0.0)</span></span>
            </div>
          </div>

          <div class="canvas-legend">
            <div class="legend-row">
              <span class="legend-title">Canonical $(x,y,z)$:</span>
              <span class="legend-item"><span class="legend-dot" style="background: #ef4444;"></span> +x</span>
              <span class="legend-item"><span class="legend-dot" style="background: #22c55e;"></span> +y</span>
              <span class="legend-item"><span class="legend-dot" style="background: #38bdf8;"></span> +z</span>
            </div>
            <div class="legend-row">
              <span class="legend-title">Nested $(u,v,w)$:</span>
              <span class="legend-item"><span class="legend-dot" style="background: #f43f5e;"></span> +u</span>
              <span class="legend-item"><span class="legend-dot" style="background: #10b981;"></span> +v</span>
              <span class="legend-item"><span class="legend-dot" style="background: #3b82f6;"></span> +w</span>
            </div>
            <div class="legend-row">
              <span class="legend-title">Target:</span>
              <span class="legend-item"><span class="legend-dot" style="background: #fbbf24;"></span> p</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const mountContainer = root.querySelector('#frame-three-mount')
  const engine = new CoordinateFrameEngine(mountContainer)

  const descBox = root.querySelector('#frame-desc-box')
  const stepBadge = root.querySelector('#frame-step-badge')
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
      <div id="frame-step-${idx}" class="step-row" data-step="${idx}">
        <div style="display: flex; align-items: center; gap: 7px; flex: 1; min-width: 0;">
          <div class="step-badge">${s.num}</div>
          <div style="display: flex; align-items: baseline; gap: 6px; overflow: hidden; white-space: nowrap;">
            <span style="font-size: 12.5px; font-weight: 700; color: var(--grey-lighter);">${renderTextWithMath(s.name)}</span>
            <span style="font-size: 11px; color: var(--grey-light);">${renderTextWithMath(s.desc)}</span>
          </div>
        </div>
        <div class="step-symbol" data-math-term="${s.term}" style="cursor: pointer;" title="Hover to view Definition">${renderMath(s.symbol)}</div>
      </div>
    `).join('')

    // Row i clicks jump to engine step i+1
    for (let i = 0; i < stepsDef.length; i++) {
      const row = root.querySelector(`#frame-step-${i}`)
      if (row) {
        row.addEventListener('click', () => {
          engine.targetStepIndex = stepsDef[i].engineStep
          engine.isPlaying = false
          if (engine.digestTimer) clearTimeout(engine.digestTimer)
          engine.emit('state-changed', engine.getState())
        })
      }
    }
  }

  function updateMatrixDisplay(elts) {
    let html = ''
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = elts[c * 4 + r]
        const isDiagonal = r === c
        const isHighlight = val !== (isDiagonal ? 1 : 0)
        html += `<span class="matrix-val ${isHighlight ? 'active' : ''}">${formatNum(val)}</span>`
      }
    }
    matrixGrid.innerHTML = html
  }

  function updateUI(state) {
    // Preset buttons
    root.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === state.presetKey)
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

    // Step Status Badge (shows what comes next, not what just happened)
    if (isDone) {
      stepBadge.textContent = 'View Space ✓'
      stepBadge.style.color = 'rgb(var(--primary))'
    } else if (state.currentStepIndex === 0) {
      stepBadge.textContent = 'Next: Translate (−e)'
      stepBadge.style.color = ''
    } else if (state.currentStepIndex === 1) {
      stepBadge.textContent = 'Next: Rotate (Rᵀ)'
      stepBadge.style.color = ''
    } else {
      stepBadge.textContent = 'Canonical (Rest)'
      stepBadge.style.color = ''
    }

    // Step rows: 2 rows (T_{-e} and R^T), row i maps to engine step i+1.
    // active   = currentStepIndex === i   → this is the next pending transform
    // completed = currentStepIndex > i    → transform already applied (non-clickable)
    // plain    = currentStepIndex < i    → future (clickable to jump ahead)
    for (let i = 0; i < stepsDef.length; i++) {
      const row = root.querySelector(`#frame-step-${i}`)
      const badge = row ? row.querySelector('.step-badge') : null
      if (!row) continue
      const engineStep = stepsDef[i].engineStep  // 1 or 2
      if (isDone || state.currentStepIndex >= engineStep) {
        // Transform already applied
        row.className = 'step-row completed'
        if (badge) badge.textContent = '✓'
      } else if (state.currentStepIndex === engineStep - 1) {
        // Next pending — highlighted
        row.className = 'step-row active'
        if (badge) badge.textContent = stepsDef[i].num
      } else {
        // Future (not yet reachable without applying previous step)
        row.className = 'step-row'
        if (badge) badge.textContent = stepsDef[i].num
      }
    }

    // Play text
    playText.textContent = state.isPlaying ? '⏸ Pause' : isDone ? '↺ Play Again' : '▶ Play Transform'

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
