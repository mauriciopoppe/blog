/**
 * Weighted Sum Demo: what a scalarized objective can and cannot reach
 *
 * One widget, one SVG, four animated states: Setup, Step 1 (dominated sample),
 * Step 2 (supported B), Step 3 (unsupported C). The SVG cross-fades layers
 * per step; the playback bar advances through the states.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

function renderMath(tex) {
  if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(tex, { displayMode: true, throwOnError: false })
    } catch {
      return tex
    }
  }
  return tex
}

export function initWeightedSumDemo(containerId = '#weighted-sum-demo') {
  const root = document.querySelector(containerId)
  if (!root) return

  const CTRL_BTN = 'tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:tw-shadow-none disabled:hover:tw-shadow-none disabled:hover:tw-border-[var(--ring-border)] disabled:hover:tw-text-[var(--grey-light)] disabled:hover:tw-bg-[var(--grey-dark)] disabled:hover:tw-filter-none'
  const PLAY_NEUTRAL = 'tw-flex-1 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft'
  const PLAY_ACTIVE = 'tw-flex-1 tw-bg-primary-soft tw-border tw-border-primary-border tw-text-primary tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-bg-primary-soft hover:tw-border-primary'

  const STEP_ROW_BASE = 'step-row tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1 tw-rounded-md tw-bg-[var(--grey-dark)] tw-transition'
  const STEP_ROW_ACTIVE = 'step-row tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1 tw-rounded-md tw-border tw-border-[rgba(var(--primary),0.6)] tw-bg-[rgba(var(--primary),0.08)] tw-transition'
  const STEP_ROW_COMPLETED = 'step-row tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1 tw-rounded-md tw-bg-[var(--grey-dark)] tw-opacity-55 tw-pointer-events-none'
  const STEP_BADGE_BASE = 'tw-w-[18px] tw-h-[18px] tw-rounded-full tw-text-[10px] tw-font-bold tw-flex tw-items-center tw-justify-center tw-bg-[var(--grey-darker)] tw-text-[var(--grey-light)] tw-shrink-0'
  const STEP_BADGE_ACTIVE = 'tw-w-[18px] tw-h-[18px] tw-rounded-full tw-text-[10px] tw-font-bold tw-flex tw-items-center tw-justify-center tw-bg-[rgb(var(--primary))] tw-text-[var(--grey-darker)] tw-shrink-0'
  const STEP_BADGE_COMPLETED = 'tw-w-[18px] tw-h-[18px] tw-rounded-full tw-text-[10px] tw-font-bold tw-flex tw-items-center tw-justify-center tw-bg-[var(--grey)] tw-text-[var(--grey-lighter)] tw-shrink-0'

  const STEPS = [
    {
      name: 'Setup',
      desc: 'Gray dots are the configurations already measured. The ringed points are the kept, non-dominated ones. They already trace the frontier.'
    },
    {
      name: 'Step 1 · dominated',
      desc: 'Only the amber dot is being evaluated. The highlighted ringed point sits at the same latency and beats it on throughput, so the amber sample is discarded.'
    },
    {
      name: 'Step 2 · supported (B)',
      desc: 'B is evaluated against the nearest frontier point: g = 121.5 beats g = 168.5, and no measured point beats B on both objectives. Keep it. It joins the frontier.'
    },
    {
      name: 'Step 3 · unsupported (C)',
      desc: 'C is on the frontier: no measured point beats it on both objectives, so it stays in the kept set just like (300, 86). The weighted sum is a different lens: under these weights g(C) = 208 ranks below g = 193, so a single-number optimizer would pass over C even though the frontier keeps it.'
    }
  ]

  // The evaluation: f₁ = latency = x, f₂ = inverse throughput = 170 − y,
  // g = 0.5·f₁ + 0.5·f₂ minimized. Lower g is better. The frontier points are
  // always listed; each step tests one candidate against one frontier point.
  const FRONTIER_POINTS = [
    { point: '(240, 97)', f1: 240, f2: 97, g: 168.5 },
    { point: '(300, 86)', f1: 300, f2: 86, g: 193 },
    { point: '(420, 54)', f1: 420, f2: 54, g: 237 },
    { point: '(480, 33)', f1: 480, f2: 33, g: 256.5 },
    { point: '(540, 18)', f1: 540, f2: 18, g: 279 },
    { point: 'B (140, 103)', f1: 140, f2: 103, g: 121.5, since: 3 }
  ]
  // Each candidate is tested at its step against a frontier point by its (f1, f2).
  const CANDIDATES = [
    { step: 1, point: 'sample', f1: 480, f2: 95, g: 287.5, comparedF1: 480, comparedF2: 33, decision: 'discard' },
    { step: 2, point: 'B', f1: 140, f2: 103, g: 121.5, comparedF1: 240, comparedF2: 97, decision: 'keep' },
    { step: 3, point: 'C', f1: 340, f2: 76, g: 208, comparedF1: 300, comparedF2: 86, decision: 'missed' }
  ]

  root.innerHTML = `
    <style>
      #weighted-sum-demo .ws-layer { transition: opacity 0.35s ease; }
      #weighted-sum-demo .ws-layer.ws-hidden { opacity: 0; }
      #weighted-sum-demo .katex-display { font-size: 0.8em !important; margin: 0.35em 0 !important; }
      #weighted-sum-demo table { font-size: 0.65rem; font-family: var(--family-serif, system-ui, serif); line-height: 1.4; }
      #weighted-sum-demo table th,
      #weighted-sum-demo table td {
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
        padding: 2px 6px;
        vertical-align: middle;
      }
      #weighted-sum-demo table thead th {
        font-family: var(--family-sans, system-ui, sans-serif);
        font-weight: 600;
      }
    </style>

    <div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden">
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
        <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary">What a weighted sum can and cannot reach</div>
        <div class="tw-font-serif tw-text-sm tw-text-[var(--grey-light)]">Setup + three sample decisions</div>
      </div>

      <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif tw-text-[var(--grey-lighter)] max-[860px]:tw-grid-cols-1">
        <!-- Left: step pipeline + playback -->
        <div class="tw-flex tw-flex-col tw-gap-2">
          <div id="ws-step-pipeline" class="tw-flex tw-flex-col tw-gap-1"></div>

          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-gap-1.5 tw-items-stretch">
            <button type="button" id="ws-btn-reset" class="${CTRL_BTN}" title="Reset to Setup">↺</button>
            <button type="button" id="ws-btn-back" class="${CTRL_BTN}" title="Step Back">⏮</button>
            <button type="button" id="ws-btn-play" class="${PLAY_NEUTRAL}"><span id="ws-play-text">▶ Play</span></button>
            <button type="button" id="ws-btn-forward" class="${CTRL_BTN}" title="Step Forward">⏭</button>
          </div>

          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[76px]" id="ws-desc"></div>
        </div>

        <!-- Right: the single animated SVG -->
        <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-p-2">
          <div class="tw-flex tw-items-center tw-gap-x-3 tw-gap-y-1 tw-flex-wrap tw-text-[0.75rem] tw-leading-snug tw-text-[var(--grey-light)] tw-mb-1">
            <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-bg-[var(--grey)] tw-opacity-50"></span> already measured</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-bg-[#fbbf24] tw-border tw-border-[var(--grey-darker)]"></span> the sample this step decides on</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-bg-[var(--grey-darker)] tw-border tw-border-[rgb(var(--primary))]"></span> non-dominated (kept)</span>
          </div>

          <svg viewBox="0 0 560 200" class="tw-w-full tw-h-auto tw-font-sans">
            <!-- Base: axes + better corner -->
            <line x1="70" y1="170" x2="540" y2="170" stroke="var(--grey)" stroke-width="1.5" />
            <polygon points="540,165 552,170 540,175" fill="var(--grey)" />
            <text x="305" y="190" fill="var(--grey-light)" font-size="11" text-anchor="middle">Latency &#8594; worse</text>
            <line x1="70" y1="170" x2="70" y2="30" stroke="var(--grey)" stroke-width="1.5" />
            <polygon points="65,30 70,18 75,30" fill="var(--grey)" />
            <text x="55" y="100" fill="var(--grey-light)" font-size="11" transform="rotate(-90 55 100)" text-anchor="middle">Throughput &#8594; worse</text>
            <text x="90" y="189" fill="#22c55e" font-size="11" font-weight="600" text-anchor="start">better</text>
            <line x1="122" y1="185" x2="100" y2="195" stroke="#22c55e" stroke-width="1.5" />
            <polygon points="100,195 96,187 106,190" fill="#22c55e" />

            <!-- Gray scatter: already measured (all steps) -->
            <g class="ws-layer">
              <circle cx="176" cy="50" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="186" cy="38" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="197" cy="66" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="210" cy="36" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="216" cy="66" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="235" cy="36" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="261" cy="44" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="262" cy="63" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="276" cy="67" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="280" cy="54" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="295" cy="77" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="317" cy="41" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="340" cy="73" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="360" cy="75" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="387" cy="71" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="387" cy="53" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="413" cy="97" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="417" cy="73" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="434" cy="100" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="444" cy="74" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="463" cy="78" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="474" cy="91" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="475" cy="117" r="4" fill="var(--grey)" opacity="0.45" />
              <circle cx="499" cy="110" r="4" fill="var(--grey)" opacity="0.45" />
            </g>

            <!-- Frontier: kept non-dominated points so far. B and C are
                 introduced as samples in their own steps, so they are not
                 part of the base frontier. -->
            <g class="ws-layer">
              <circle cx="240" cy="73" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="1.5" />
              <circle cx="300" cy="84" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="1.5" />
              <circle cx="420" cy="116" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="1.5" />
              <circle cx="480" cy="137" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="1.5" />
              <circle cx="540" cy="152" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="1.5" />
            </g>

            <!-- Step 1: dominated sample -->
            <g class="ws-layer ws-hidden" id="ws-layer-s1">
              <circle cx="480" cy="75" r="6" fill="#fbbf24" stroke="var(--grey-darker)" stroke-width="1.5" />
              <line x1="480" y1="75" x2="480" y2="137" stroke="var(--grey)" stroke-width="1" stroke-dasharray="3 3" />
              <circle cx="480" cy="137" r="6" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
              <text x="486" y="68" fill="var(--grey-lighter)" font-size="11" text-anchor="start">g = 287.5</text>
              <text x="486" y="150" fill="var(--grey-light)" font-size="11" text-anchor="start">g = 256.5</text>
            </g>

            <!-- Step 2: supported B -->
            <g class="ws-layer ws-hidden" id="ws-layer-s2">
              <circle cx="140" cy="67" r="6" fill="#fbbf24" stroke="var(--grey-darker)" stroke-width="1.5" />
              <text x="150" y="54" fill="var(--grey-lighter)" font-size="12" font-weight="bold" text-anchor="start">B</text>
              <line x1="140" y1="67" x2="240" y2="73" stroke="var(--grey)" stroke-width="1" stroke-dasharray="3 3" />
              <circle cx="240" cy="73" r="6" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
              <text x="150" y="92" fill="var(--grey-lighter)" font-size="11" text-anchor="start">g = 121.5</text>
              <text x="250" y="92" fill="var(--grey-light)" font-size="11" text-anchor="start">g = 168.5</text>
            </g>

            <!-- Step 3: unsupported C (a legitimate frontier trade-off the weighted sum ranks lower) -->
            <g class="ws-layer ws-hidden" id="ws-layer-s3">
              <circle cx="140" cy="67" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="1.5" />
              <circle cx="340" cy="94" r="6" fill="#fbbf24" stroke="var(--grey-darker)" stroke-width="1.5" />
              <text x="350" y="112" fill="rgb(var(--primary))" font-size="12" font-weight="bold" text-anchor="start">C</text>
              <text x="350" y="126" fill="var(--grey-lighter)" font-size="11" text-anchor="start">g = 208</text>
              <line x1="340" y1="94" x2="300" y2="84" stroke="var(--grey)" stroke-width="1" stroke-dasharray="3 3" />
              <circle cx="300" cy="84" r="6" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
              <text x="292" y="74" fill="var(--grey-lighter)" font-size="11" text-anchor="end">g = 193</text>
            </g>
          </svg>

          <div class="tw-mt-2 tw-flex tw-flex-col tw-items-center tw-gap-0.5">
            <div class="ws-formula tw-text-[var(--grey-lighter)]"></div>
              <div class="tw-text-[0.7rem] tw-leading-snug tw-text-[var(--grey-light)]"><strong class="tw-text-[var(--grey-lighter)]">lower is better</strong> &#183; 170 = best throughput on the axis</div>
            </div>

          <table class="tw-mt-1 tw-w-full tw-border-collapse tw-text-[0.65rem] tw-leading-snug" id="ws-table">
            <thead>
              <tr class="tw-font-sans tw-text-[var(--grey-light)]">
                <th class="tw-text-left tw-font-semibold tw-px-1.5 tw-py-0.5 tw-border-b tw-border-[var(--ring-border)]">Point</th>
                <th class="tw-text-right tw-font-semibold tw-px-1.5 tw-py-0.5 tw-border-b tw-border-[var(--ring-border)]">f&#8321;</th>
                <th class="tw-text-right tw-font-semibold tw-px-1.5 tw-py-0.5 tw-border-b tw-border-[var(--ring-border)]">f&#8322; (&#8722;tput)</th>
                <th class="tw-text-right tw-font-semibold tw-px-1.5 tw-py-0.5 tw-border-b tw-border-[var(--ring-border)]">g</th>
                <th class="tw-text-right tw-font-semibold tw-px-1.5 tw-py-0.5 tw-border-b tw-border-[var(--ring-border)]">vs g</th>
                <th class="tw-text-left tw-font-semibold tw-px-1.5 tw-py-0.5 tw-border-b tw-border-[var(--ring-border)]">decision</th>
              </tr>
            </thead>
            <tbody id="ws-table-body" class="tw-text-[var(--grey-light)]"></tbody>
          </table>
        </div>
      </div>
    </div>
  `

  const stepPipeline = root.querySelector('#ws-step-pipeline')
  const descEl = root.querySelector('#ws-desc')
  const tableBody = root.querySelector('#ws-table-body')
  const tableEl = root.querySelector('#ws-table')
  const formulaEl = root.querySelector('.ws-formula')
  const playBtn = root.querySelector('#ws-btn-play')
  const playText = root.querySelector('#ws-play-text')
  const backBtn = root.querySelector('#ws-btn-back')
  const forwardBtn = root.querySelector('#ws-btn-forward')
  const resetBtn = root.querySelector('#ws-btn-reset')
  const layers = {
    s1: root.querySelector('#ws-layer-s1'),
    s2: root.querySelector('#ws-layer-s2'),
    s3: root.querySelector('#ws-layer-s3')
  }

  let currentStep = 0
  let isPlaying = false
  let timer = null

  function renderStepRows() {
    stepPipeline.innerHTML = STEPS.map((s, i) => `
      <div id="ws-step-${i}" class="${i < currentStep ? STEP_ROW_COMPLETED : i === currentStep ? STEP_ROW_ACTIVE : STEP_ROW_BASE}">
        <div class="tw-flex tw-items-center tw-gap-1.5 tw-min-w-0">
          <div class="step-badge ${i < currentStep ? STEP_BADGE_COMPLETED : i === currentStep ? STEP_BADGE_ACTIVE : STEP_BADGE_BASE}">${i < currentStep ? '✓' : i === 0 ? 'S' : i}</div>
          <span class="tw-font-sans tw-text-[0.6875rem] tw-font-semibold tw-text-[var(--grey-lighter)] tw-truncate">${s.name}</span>
        </div>
      </div>
    `).join('')
  }

  function renderTable() {
    // The frontier is always listed; the current step's candidate row sits below.
    const candidate = CANDIDATES.find((c) => c.step === currentStep)
    tableEl.style.display = 'none'
    const rows = []
    FRONTIER_POINTS.filter((f) => (f.since === undefined ? true : currentStep >= f.since)).forEach((f, i) => {
      const compared = candidate && candidate.comparedF1 === f.f1 && candidate.comparedF2 === f.f2
      rows.push(`
        <tr class="${compared ? 'tw-bg-primary-soft tw-text-[var(--grey-lighter)]' : 'tw-text-[var(--grey-light)]'}">
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-font-mono">${f.point}</td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-text-right tw-font-mono">${f.f1}</td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-text-right tw-font-mono">${f.f2}</td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-text-right tw-font-mono">${f.g}</td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)]"></td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-font-semibold tw-text-[var(--grey-light)]">frontier</td>
        </tr>
      `)
    })
    if (candidate) {
      rows.push(`
        <tr class="tw-bg-primary-soft tw-text-[var(--grey-lighter)]">
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-font-mono">${candidate.point}</td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-text-right tw-font-mono">${candidate.f1}</td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-text-right tw-font-mono">${candidate.f2}</td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-text-right tw-font-mono">${candidate.g}</td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] tw-text-right tw-font-mono">${FRONTIER_POINTS.find((f) => f.f1 === candidate.comparedF1 && f.f2 === candidate.comparedF2).g}</td>
          <td class="tw-px-1.5 tw-py-1 tw-border-b tw-border-[var(--ring-border)] ${candidate.decision === 'keep' ? 'tw-text-[#22c55e]' : candidate.decision === 'discard' ? 'tw-text-[#ef4444]' : 'tw-text-primary'} tw-font-semibold">${candidate.decision}</td>
        </tr>
      `)
    }
    tableEl.style.display = ''
    tableBody.innerHTML = rows.join('')
  }

  function render() {
    renderStepRows()
    descEl.textContent = STEPS[currentStep].desc
    renderTable()
    if (formulaEl) formulaEl.innerHTML = renderMath('\\begin{aligned} g(x) &= 0.5\\, f_1(x) + 0.5\\, f_2(x) \\\\ f_1(x) &= x = \\text{latency} \\\\ f_2(x) &= 170 - y = \\text{inverse throughput} \\end{aligned}')

    layers.s1.classList.toggle('ws-hidden', currentStep !== 1)
    layers.s2.classList.toggle('ws-hidden', currentStep !== 2)
    layers.s3.classList.toggle('ws-hidden', currentStep !== 3)

    backBtn.disabled = currentStep === 0
    resetBtn.disabled = currentStep === 0
    forwardBtn.disabled = currentStep === STEPS.length - 1

    if (isPlaying) {
      playBtn.className = PLAY_ACTIVE
      playText.textContent = '⏸ Pause'
    } else if (currentStep === STEPS.length - 1) {
      playBtn.className = PLAY_NEUTRAL
      playText.textContent = '↺ Replay'
    } else {
      playBtn.className = PLAY_NEUTRAL
      playText.textContent = '▶ Play'
    }
  }

  function stop() {
    isPlaying = false
    if (timer) clearTimeout(timer)
    timer = null
    render()
  }

  function play() {
    if (currentStep === STEPS.length - 1) {
      currentStep = 0
      render()
    }
    isPlaying = true
    render()
    const advance = () => {
      timer = setTimeout(() => {
        if (!isPlaying) return
        if (currentStep < STEPS.length - 1) {
          currentStep += 1
          render()
          advance()
        } else {
          stop()
        }
      }, 1800)
    }
    advance()
  }

  resetBtn.addEventListener('click', () => {
    stop()
    currentStep = 0
    render()
  })

  backBtn.addEventListener('click', () => {
    stop()
    currentStep = Math.max(0, currentStep - 1)
    render()
  })

  forwardBtn.addEventListener('click', () => {
    stop()
    currentStep = Math.min(STEPS.length - 1, currentStep + 1)
    render()
  })

  playBtn.addEventListener('click', () => {
    if (isPlaying) stop()
    else play()
  })

  render()
}

// Auto-initialize when loaded as an ES module
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initWeightedSumDemo())
  } else {
    initWeightedSumDemo()
  }
}
