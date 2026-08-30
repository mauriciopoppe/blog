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

export function initQuaternionSlerpExplorer(containerId = 'quaternion-slerp-explorer') {
  const root = document.getElementById(containerId)
  if (!root) return

  const PRESET_BASE = 'slerp-preset-btn tw-flex-1 tw-text-center tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-px-2.5 tw-py-1 tw-leading-none tw-cursor-pointer'
  const PRESET_INACTIVE = PRESET_BASE + ' tw-bg-transparent tw-text-[var(--grey-light)]'
  const PRESET_ACTIVE = PRESET_BASE + ' tw-bg-primary-soft tw-text-primary'
  const MODE_BASE = 'slerp-mode-btn tw-flex-1 tw-text-center tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-px-2.5 tw-py-1 tw-leading-none tw-cursor-pointer'
  const MODE_INACTIVE = MODE_BASE + ' tw-bg-transparent tw-text-[var(--grey-light)]'
  const MODE_ACTIVE = MODE_BASE + ' tw-bg-primary-soft tw-text-primary'
  const PLAY_NEUTRAL = 'tw-flex-1 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft'
  const PLAY_ACTIVE = 'tw-flex-1 tw-bg-primary-soft tw-border tw-border-primary-border tw-text-primary tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-gap-1 hover:tw-bg-primary-soft hover:tw-border-primary'
  const BADGE_POS = 'tw-absolute tw-top-2.5 tw-right-2.5 tw-pointer-events-none'

  root.innerHTML = `
    <style>
      .slerp-slider { -webkit-appearance: none; appearance: none; height: 28px; background: transparent; cursor: pointer; --range-fill: 50%; }
      .slerp-slider::-webkit-slider-runnable-track { height: 8px; border-radius: 999px; background: linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) var(--range-fill), var(--ring-border) var(--range-fill), var(--ring-border) 100%); }
      .slerp-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); margin-top: -5px; box-shadow: var(--elevation-subtle); }
      .slerp-slider::-moz-range-track { height: 8px; border-radius: 999px; background: var(--ring-border); }
      .slerp-slider::-moz-range-progress { height: 8px; border-radius: 999px; background: rgb(var(--primary)); }
      .slerp-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); box-shadow: var(--elevation-subtle); }
      .slerp-slider:hover::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
      .slerp-slider:hover::-moz-range-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
      .slerp-slider:focus-visible { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; border-radius: 999px; }
      .slerp-code-block .tok-comment { color: var(--grey); font-style: italic; }
      .slerp-code-block .tok-keyword { color: rgb(var(--primary)); }
      .slerp-code-block .tok-number { color: #fbbf24; }
      .slerp-code-block .tok-class { color: #38bdf8; }
      .slerp-code-block .tok-fn { color: #34d399; }
      .slerp-badge-tag { font-size: 10.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
      .slerp-badge-good { background: rgba(80, 200, 120, 0.15); color: #50c878; border: 1px solid rgba(80, 200, 120, 0.3); }
      .slerp-badge-warn { background: rgba(255, 180, 60, 0.15); color: #ffb43c; border: 1px solid rgba(255, 180, 60, 0.3); }
      #quaternion-slerp-explorer .slerp-code-block { font-size: 0.625rem; }
      #quaternion-slerp-explorer .katex { font-size: 0.8em !important; }
    </style>

    <div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden tw-font-sans">
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
        <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary tw-flex tw-items-center tw-gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
          </svg>
          Quaternion SLERP vs Euler LERP Flight Simulator
        </div>
        <div class="tw-font-serif tw-text-sm tw-text-[var(--grey-light)]">3D Geodesic vs Decoupled Interpolation</div>
      </div>

      <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif max-[860px]:tw-grid-cols-1">
        <div class="tw-flex tw-flex-col tw-gap-2">
          <!-- Presets -->
          <div class="tw-flex tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden">
            <button type="button" class="${PRESET_ACTIVE}" data-preset="gimbal_lock">Gimbal 90°</button>
            <button type="button" class="${PRESET_INACTIVE}" data-preset="aerobatic_flip">Aerobatic Flip</button>
            <button type="button" class="${PRESET_INACTIVE}" data-preset="diagonal_turn">Banked Turn</button>
          </div>

          <!-- Mode Toggle -->
          <div class="tw-flex tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden">
            <button type="button" class="${MODE_ACTIVE}" data-mode="slerp">Quaternion SLERP</button>
            <button type="button" class="${MODE_INACTIVE}" data-mode="euler">Euler Angle LERP</button>
          </div>

          <!-- Preset Description -->
          <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[30px]" id="slerp-desc"></div>

          <!-- Playback Controls + Slider -->
          <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-gap-1.5">
            <div class="tw-flex tw-gap-1.5 tw-items-stretch">
            <button type="button" class="tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft" id="slerp-btn-prev" title="Step Back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2.5"></line></svg>
            </button>
            <button type="button" class="${PLAY_NEUTRAL}" id="slerp-btn-play">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Play Flight</span>
            </button>
            <button type="button" class="tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft" id="slerp-btn-next" title="Step Forward">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.5"></line></svg>
            </button>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2">
              <span class="tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-text-primary tw-min-w-[48px]" id="slerp-t-val">t = 0.00</span>
              <input type="range" class="slerp-slider tw-flex-1" id="slerp-slider" min="0" max="1" step="0.01" value="0">
            </div>
          </div>

        </div>

        <!-- 3D Canvas -->
        <div class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[320px] tw-overflow-hidden" id="slerp-canvas-container">
          <div class="tw-absolute tw-bottom-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-px-2 tw-py-1 tw-rounded-md tw-text-[11px] tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-items-center tw-gap-x-3 tw-gap-y-1 tw-flex-wrap" id="slerp-overlay">
            <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #ef4444;"></span> +X (Forward)</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #22c55e;"></span> +Y (Up)</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #3b82f6;"></span> +Z (Right)</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1" id="slerp-legend-axis"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #fbbf24;"></span> Axis $\\hat{\\mathbf{n}}$</span>
          </div>
          <span id="slerp-status-badge" class="slerp-badge-tag slerp-badge-good tw-absolute tw-top-2.5 tw-right-2.5 tw-pointer-events-none">Shortest Geodesic (S³)</span>
        </div>
      </div>

      <!-- Three.js Code Card (full width, below the simulator) -->
      <div class="tw-p-2.5 tw-pt-0 tw-font-serif">
        <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-2">
          <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-lighter)] tw-mb-1">Three.js Code</div>
          <pre class="slerp-code-block tw-m-0 tw-p-2 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded tw-font-mono tw-text-[0.6875rem] tw-leading-relaxed tw-text-[var(--grey-lighter)] tw-whitespace-pre-wrap tw-overflow-x-hidden" id="slerp-code">const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0))</pre>
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
    syncSliderFill(slider)

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
      statusBadge.className = `slerp-badge-tag slerp-badge-good ${BADGE_POS}`
      statusBadge.textContent = 'Shortest Geodesic (S³)'
    } else {
      statusBadge.className = `slerp-badge-tag slerp-badge-warn ${BADGE_POS}`
      statusBadge.textContent = 'Euler Decoupled (Distorted)'
    }

    // Play button icon
    if (state.isPlaying) {
      playBtn.className = PLAY_ACTIVE
      playBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        <span>Pause</span>
      `
    } else {
      playBtn.className = PLAY_NEUTRAL
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
      root.querySelectorAll('.slerp-preset-btn').forEach(b => { b.className = PRESET_INACTIVE })
      btn.className = PRESET_ACTIVE
      engine.applyPreset(btn.dataset.preset)
    })
  })

  // Mode Toggle Buttons
  root.querySelectorAll('.slerp-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.slerp-mode-btn').forEach(b => { b.className = MODE_INACTIVE })
      btn.className = MODE_ACTIVE
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
    syncSliderFill(slider)
  })

  function syncSliderFill(sl) {
    const pct = ((parseFloat(sl.value) - parseFloat(sl.min)) / (parseFloat(sl.max) - parseFloat(sl.min))) * 100
    sl.style.setProperty('--range-fill', pct + '%')
  }
  syncSliderFill(slider)

  // Render LaTeX in overlay
  const overlayEl = root.querySelector('#slerp-overlay')
  if (overlayEl) {
    overlayEl.innerHTML = renderTextWithMath(overlayEl.innerHTML)
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
