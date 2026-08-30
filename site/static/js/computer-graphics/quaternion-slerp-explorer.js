import { QuaternionSlerpEngine, SLERP_PRESETS } from './quaternion-slerp-engine.js'

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
  const str = val.toFixed(3)
  return val >= 0 ? ` ${str}` : str
}

export function initQuaternionSlerpExplorer(containerId = 'quaternion-slerp-explorer') {
  const root = document.getElementById(containerId)
  if (!root) return

  root.innerHTML = `
    <style>
      .slerp-sim-wrap {
        margin: 1.75rem 0;
        background: var(--grey-darker);
        border: 1px solid var(--grey-dark);
        border-radius: 12px;
        overflow: hidden;
        font-family: var(--family-sans, system-ui, sans-serif);
      }
      .slerp-sim-header {
        padding: 10px 14px;
        background: var(--grey-dark);
        border-bottom: 1px solid var(--grey-dark);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      .slerp-sim-title {
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: rgb(var(--primary));
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .slerp-sim-badge {
        font-size: 11px;
        letter-spacing: 0.04em;
        color: var(--grey-light);
      }
      .slerp-sim-body {
        display: grid;
        grid-template-columns: 335px 1fr;
        gap: 10px;
        padding: 10px 10px 0;
      }
      @media (max-width: 860px) {
        .slerp-sim-body {
          grid-template-columns: 1fr;
        }
      }
      .slerp-code-row {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
      .slerp-sim-left {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .slerp-sim-presets {
        display: flex;
        gap: 5px;
      }
      .slerp-preset-btn {
        flex: 1;
        font-size: 11px;
        font-weight: 600;
        padding: 5px 6px;
        border-radius: 6px;
        border: 1px solid var(--grey-dark);
        background: var(--grey-dark);
        color: var(--grey-light);
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
      }
      .slerp-preset-btn:hover {
        color: rgb(var(--primary));
        border-color: rgba(var(--primary), 0.5);
        filter: drop-shadow(0px 0px 4px rgba(var(--primary), 0.35)) brightness(1.1);
      }
      .slerp-preset-btn.active {
        background: rgba(var(--primary), 0.16);
        color: rgb(var(--primary));
        border-color: rgba(var(--primary), 0.5);
      }
      .slerp-mode-toggle {
        display: flex;
        gap: 6px;
        background: var(--grey-dark);
        padding: 3px;
        border-radius: 7px;
      }
      .slerp-mode-btn {
        flex: 1;
        font-size: 11.5px;
        font-weight: 700;
        padding: 5px 8px;
        border-radius: 5px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--grey-light);
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
      }
      .slerp-mode-btn:hover {
        color: var(--grey-lighter);
      }
      .slerp-mode-btn.active {
        background: var(--grey-darker);
        color: rgb(var(--primary));
        border-color: rgba(var(--primary), 0.4);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      .slerp-sim-desc {
        font-size: 11.5px;
        line-height: 1.45;
        color: var(--grey-light);
        background: var(--grey-dark);
        padding: 7px 9px;
        border-radius: 6px;
        min-height: 38px;
      }
      .slerp-sim-controls {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .slerp-ctrl-btn {
        padding: 5px 8px;
        height: 28px;
        border-radius: 5px;
        font-size: 11.5px;
        font-weight: 700;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: var(--grey-darker);
        color: var(--grey-lighter);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .slerp-ctrl-btn:hover {
        color: rgb(var(--primary));
        border-color: rgba(var(--primary), 0.5);
        filter: drop-shadow(0px 0px 4px rgba(var(--primary), 0.35)) brightness(1.1);
      }
      .slerp-play-btn {
        flex: 1;
        background: rgba(var(--primary), 0.16);
        color: rgb(var(--primary));
        border-color: rgba(var(--primary), 0.35);
        gap: 5px;
      }
      .slerp-play-btn:hover {
        background: rgba(var(--primary), 0.28);
        border-color: rgb(var(--primary));
      }
      .slerp-slider-row {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--grey-dark);
        padding: 5px 9px;
        border-radius: 6px;
      }
      .slerp-slider-label {
        font-size: 11.5px;
        font-weight: 700;
        color: rgb(var(--primary));
        min-width: 32px;
      }
      .slerp-slider {
        flex: 1;
        accent-color: rgb(var(--primary));
        cursor: pointer;
      }
      .slerp-data-card {
        background: var(--grey-dark);
        border-radius: 6px;
        padding: 7px 9px;
        font-size: 11.5px;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .slerp-data-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .slerp-data-label {
        color: var(--grey-light);
        font-size: 11px;
      }
      .slerp-data-val {
        font-family: monospace;
        font-size: 11px;
        color: var(--grey-lighter);
      }
      .slerp-code-card {
        width: 100%;
        box-sizing: border-box;
        background: var(--grey-dark);
        border-radius: 6px;
        padding: 7px 9px;
      }
      .slerp-code-label {
        color: var(--grey-light);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.05em;
        margin-bottom: 6px;
      }
      .slerp-sim-wrap .slerp-code-block {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 6px 8px;
        background: var(--grey-darker);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 5px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 16px;
        line-height: 1.5;
        color: var(--grey-lighter);
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
        overflow-x: hidden;
      }
      .slerp-sim-wrap .slerp-code-block .tok-comment {
        color: var(--grey);
        font-style: italic;
      }
      .slerp-sim-wrap .slerp-code-block .tok-keyword {
        color: rgb(var(--primary));
      }
      .slerp-sim-wrap .slerp-code-block .tok-number {
        color: #fbbf24;
      }
      .slerp-sim-wrap .slerp-code-block .tok-class {
        color: #38bdf8;
      }
      .slerp-sim-wrap .slerp-code-block .tok-fn {
        color: #34d399;
      }
      .slerp-data-hint {
        font-size: 10px;
        line-height: 1.4;
        color: var(--grey-light);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 5px;
        margin-top: 2px;
      }
      .slerp-badge-tag {
        font-size: 10.5px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .slerp-badge-good {
        background: rgba(80, 200, 120, 0.15);
        color: #50c878;
        border: 1px solid rgba(80, 200, 120, 0.3);
      }
      .slerp-badge-warn {
        background: rgba(255, 180, 60, 0.15);
        color: #ffb43c;
        border: 1px solid rgba(255, 180, 60, 0.3);
      }
      .slerp-canvas-wrap {
        position: relative;
        background: var(--grey-darker);
        border: 1px solid var(--grey-dark);
        border-radius: 10px;
        min-height: 320px;
        overflow: hidden;
      }
      .slerp-canvas-overlay {
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
      .slerp-sim-wrap .katex {
        font-size: 1.25em !important;
      }
      .slerp-sim-wrap .slerp-desc-box .katex {
        font-size: 1.2em !important;
      }
      .slerp-sim-wrap .slerp-data-card .katex {
        font-size: 1.25em !important;
      }
      .slerp-sim-wrap .slerp-canvas-overlay .katex {
        font-size: 1.25em !important;
      }
    </style>

    <div class="slerp-sim-wrap">
      <div class="slerp-sim-header">
        <div class="slerp-sim-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
          </svg>
          Quaternion SLERP vs Euler LERP Flight Simulator
        </div>
        <div class="slerp-sim-badge">3D Geodesic vs Decoupled Interpolation</div>
      </div>

      <div class="slerp-sim-body">
        <div class="slerp-sim-left">
          <!-- Presets -->
          <div class="slerp-sim-presets">
            <button class="slerp-preset-btn active" data-preset="gimbal_lock">Gimbal 90°</button>
            <button class="slerp-preset-btn" data-preset="aerobatic_flip">Aerobatic Flip</button>
            <button class="slerp-preset-btn" data-preset="diagonal_turn">Banked Turn</button>
          </div>

          <!-- Mode Toggle -->
          <div class="slerp-mode-toggle">
            <button class="slerp-mode-btn active" data-mode="slerp">Quaternion SLERP</button>
            <button class="slerp-mode-btn" data-mode="euler">Euler Angle LERP</button>
          </div>

          <!-- Preset Description -->
          <div class="slerp-sim-desc" id="slerp-desc"></div>

          <!-- Playback Controls -->
          <div class="slerp-sim-controls">
            <button class="slerp-ctrl-btn" id="slerp-btn-prev" title="Step Back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2.5"></line></svg>
            </button>
            <button class="slerp-ctrl-btn" id="slerp-btn-next" title="Step Forward">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.5"></line></svg>
            </button>
            <button class="slerp-ctrl-btn slerp-play-btn" id="slerp-btn-play">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Play Flight</span>
            </button>
          </div>

          <!-- Slider Row -->
          <div class="slerp-slider-row">
            <span class="slerp-slider-label" id="slerp-t-val">t = 0.00</span>
            <input type="range" class="slerp-slider" id="slerp-slider" min="0" max="1" step="0.01" value="0">
          </div>

          <!-- Live Telemetry Card -->
          <div class="slerp-data-card">
            <div class="slerp-data-row">
              <span class="slerp-data-label">Interpolation Path</span>
              <span id="slerp-status-badge" class="slerp-badge-tag slerp-badge-good">Shortest Geodesic (S³)</span>
            </div>
            <div class="slerp-data-row">
              <span class="slerp-data-label">Quaternion $q(t)$</span>
              <span class="slerp-data-val" id="slerp-quat-val">[ 1.000, 0.000, 0.000, 0.000 ]</span>
            </div>
            <div class="slerp-data-row">
              <span class="slerp-data-label">Rotation Axis $\\hat{\\mathbf{n}}$</span>
              <span class="slerp-data-val" id="slerp-axis-val">( 1.00, 0.00, 0.00 )</span>
            </div>
            <div class="slerp-data-row">
              <span class="slerp-data-label">Current Angle $\\theta(t)$</span>
              <span class="slerp-data-val" id="slerp-angle-val">0.0°</span>
            </div>
            <div class="slerp-data-row">
              <span class="slerp-data-label">Total Angular Distance</span>
              <span class="slerp-data-val" id="slerp-total-angle-val">90.0°</span>
            </div>
            <div class="slerp-data-hint">SLERP keeps $\\hat{\\mathbf{n}}$ fixed and sweeps $\\theta$ linearly; Euler LERP wobbles both.</div>
          </div>
        </div>

        <!-- 3D Canvas -->
        <div class="slerp-canvas-wrap" id="slerp-canvas-container">
          <div class="slerp-canvas-overlay">
            <span class="legend-item"><span class="legend-dot" style="background: #ef4444;"></span> +X (Forward)</span>
            <span class="legend-item"><span class="legend-dot" style="background: #22c55e;"></span> +Y (Up)</span>
            <span class="legend-item"><span class="legend-dot" style="background: #3b82f6;"></span> +Z (Right)</span>
            <span class="legend-item" id="slerp-legend-axis"><span class="legend-dot" style="background: #fbbf24;"></span> Axis $\\hat{\\mathbf{n}}$</span>
          </div>
        </div>
      </div>

      <!-- Three.js Code Card (full width, below the simulator) -->
      <div class="slerp-code-row">
        <div class="slerp-code-card">
          <div class="slerp-code-label">Three.js Code</div>
          <pre class="slerp-code-block" id="slerp-code">const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0))</pre>
        </div>
      </div>
    </div>
  `

  const canvasContainer = root.querySelector('#slerp-canvas-container')
  const engine = new QuaternionSlerpEngine(canvasContainer)

  const descEl = root.querySelector('#slerp-desc')
  const playBtn = root.querySelector('#slerp-btn-play')
  const prevBtn = root.querySelector('#slerp-btn-prev')
  const nextBtn = root.querySelector('#slerp-btn-next')
  const slider = root.querySelector('#slerp-slider')
  const tValEl = root.querySelector('#slerp-t-val')
  const statusBadge = root.querySelector('#slerp-status-badge')
  const quatValEl = root.querySelector('#slerp-quat-val')
  const axisValEl = root.querySelector('#slerp-axis-val')
  const angleValEl = root.querySelector('#slerp-angle-val')
  const totalAngleValEl = root.querySelector('#slerp-total-angle-val')
  const legendAxisEl = root.querySelector('#slerp-legend-axis')
  const codeEl = root.querySelector('#slerp-code')

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

  function updateUI(state) {
    const preset = SLERP_PRESETS[state.presetKey]
    if (preset) {
      descEl.innerHTML = renderTextWithMath(preset.description)
    }

    tValEl.textContent = `t = ${state.progress.toFixed(2)}`
    slider.value = state.progress

    const [w, x, y, z] = state.quaternion
    quatValEl.textContent = `[ ${formatNum(w)}, ${formatNum(x)}, ${formatNum(y)}, ${formatNum(z)} ]`

    const [ax, ay, az] = state.axis
    axisValEl.textContent = `( ${formatNum(ax)}, ${formatNum(ay)}, ${formatNum(az)} )`

    const deg = ((state.angle * 180) / Math.PI).toFixed(1)
    angleValEl.textContent = `${deg}°`

    const totalDeg = ((state.totalAngularDistance * 180) / Math.PI).toFixed(1)
    totalAngleValEl.textContent = `${totalDeg}°`

    if (codeEl) {
      if (state.mode === 'slerp' && preset) {
        const [p0, y0, r0] = preset.startEuler
        const [p1, y1, r1] = preset.endEuler
        codeEl.innerHTML = highlightCode([
          `// q1: start orientation (pitch ${fmtDeg(p0)}, yaw ${fmtDeg(y0)}, roll ${fmtDeg(r0)})`,
          `const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(${fmtRad(p0)}, ${fmtRad(y0)}, ${fmtRad(r0)}))`,
          `// q2: target orientation (pitch ${fmtDeg(p1)}, yaw ${fmtDeg(y1)}, roll ${fmtDeg(r1)})`,
          `const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(${fmtRad(p1)}, ${fmtRad(y1)}, ${fmtRad(r1)}))`,
          `// SLERP at t = ${state.progress.toFixed(2)}: shortest geodesic, constant angular speed`,
          `const q = q1.clone().slerp(q2, ${state.progress.toFixed(2)})`,
          `// Orient the mesh`,
          `mesh.quaternion.copy(q)`
        ].join('\n'))
      } else {
        const [pitch, yaw, roll] = state.euler
        codeEl.innerHTML = highlightCode([
          `// Euler LERP: pitch, yaw, roll blended independently, then converted`,
          `const e = new THREE.Euler(${fmtRad(pitch)}, ${fmtRad(yaw)}, ${fmtRad(roll)}) // ${fmtDeg(pitch)} · ${fmtDeg(yaw)} · ${fmtDeg(roll)}`,
          `const q = new THREE.Quaternion().setFromEuler(e)`,
          `// Orient the mesh`,
          `mesh.quaternion.copy(q)`
        ].join('\n'))
      }
    }

    if (legendAxisEl) {
      legendAxisEl.style.display = state.mode === 'slerp' ? 'inline-flex' : 'none'
    }

    if (state.mode === 'slerp') {
      statusBadge.className = 'slerp-badge-tag slerp-badge-good'
      statusBadge.textContent = 'Shortest Geodesic (S³)'
    } else {
      statusBadge.className = 'slerp-badge-tag slerp-badge-warn'
      statusBadge.textContent = 'Euler Decoupled (Distorted)'
    }

    // Play button icon
    if (state.isPlaying) {
      playBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        <span>Pause</span>
      `
    } else {
      playBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span>Play Flight</span>
      `
    }
  }

  engine.on('update', updateUI)

  // Preset Buttons
  root.querySelectorAll('.slerp-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.slerp-preset-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      engine.applyPreset(btn.dataset.preset)
    })
  })

  // Mode Toggle Buttons
  root.querySelectorAll('.slerp-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.slerp-mode-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      engine.setMode(btn.dataset.mode)
    })
  })

  // Play / Pause
  playBtn.addEventListener('click', () => engine.togglePlay())

  // Step Controls
  prevBtn.addEventListener('click', () => {
    engine.pause()
    engine.setProgress(Math.max(0, engine.progress - 0.05))
  })

  nextBtn.addEventListener('click', () => {
    engine.pause()
    engine.setProgress(Math.min(1, engine.progress + 0.05))
  })

  // Slider Scrubbing
  slider.addEventListener('input', (e) => {
    engine.pause()
    engine.setProgress(parseFloat(e.target.value))
  })

  // Render LaTeX in overlay
  const overlayEl = root.querySelector('.slerp-canvas-overlay')
  if (overlayEl) {
    overlayEl.innerHTML = renderTextWithMath(overlayEl.innerHTML)
  }
  // Render LaTeX in static telemetry labels
  const dataCardEl = root.querySelector('.slerp-data-card')
  if (dataCardEl) {
    dataCardEl.querySelectorAll('.slerp-data-label, .slerp-data-hint').forEach((el) => {
      el.innerHTML = renderTextWithMath(el.innerHTML)
    })
  }

  // Initialize initial state
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
    document.addEventListener('DOMContentLoaded', () => initQuaternionSlerpExplorer())
  } else {
    initQuaternionSlerpExplorer()
  }
}
