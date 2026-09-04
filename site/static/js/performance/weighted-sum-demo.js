/**
 * Weighted Sum Demo: What a Scalarized Objective Can and Cannot Reach
 *
 * One widget, one SVG, four animated states:
 * - Setup: Initial 4-point non-dominated Pareto frontier
 * - Step 1: Dominated Sample (High latency, lower throughput -> Discarded by both)
 * - Step 2: Supported Point B (Extreme breakthrough -> Admitted by both)
 * - Step 3: Unsupported Point C (Concave Pareto-optimal point -> Kept by Pareto, missed by linear weights)
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html, render as preactRender } from '../ui/preact.js'
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

export function initWeightedSumDemo(containerId = '#weighted-sum-demo') {
  const root = document.querySelector(containerId)
  if (!root) return

  const CTRL_BTN = 'tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:tw-shadow-none disabled:hover:tw-shadow-none disabled:hover:tw-border-[var(--ring-border)] disabled:hover:tw-text-[var(--grey-light)] disabled:hover:tw-bg-[var(--grey-dark)] disabled:hover:tw-filter-none'
  const PLAY_NEUTRAL = 'tw-flex-1 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft'
  const PLAY_ACTIVE = 'tw-flex-1 tw-bg-primary-soft tw-border tw-border-primary-border tw-text-primary tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-bg-primary-soft hover:tw-border-primary'

  const STEPS = [
    {
      name: 'Setup',
      shortDesc: 'Initial measured set & active frontier',
      desc: 'Gray dots represent configurations measured during exploration. The coral ringed points trace the current non-dominated frontier $\\mathcal{P}^*$. Both objectives are formulated as minimization ($f_1 = \\text{TTFT}$, $f_2 = 170 - \\text{TPS}$).'
    },
    {
      name: 'Step 1 · Dominated Point',
      shortDesc: 'Beaten on throughput (discarded)',
      desc: 'The amber sample sits at the identical latency ($f_1 = 480$) but achieves lower throughput ($f_2 = 95$ vs. $f_2 = 33$). Its weighted score $g = 287.5$ loses to $g = 256.5$. Both the Pareto filter and weighted sum discard it.'
    },
    {
      name: 'Step 2 · Supported Point B',
      shortDesc: 'Extends frontier knee (admitted)',
      desc: 'Candidate $B$ ($140\\text{ms}$, $67\\text{ inv-tps}$) improves latency significantly with $g(B) = 121.5$, beating nearest point ($g = 168.5$). Because it sits on the convex hull, a single-scalar optimizer and Pareto filter both eagerly accept it.'
    },
    {
      name: 'Step 3 · Unsupported Point C',
      shortDesc: 'Pareto optimal, missed by scalar sum',
      desc: 'Candidate $C$ is strictly Pareto optimal: no configuration beats it on both metrics. But because it sits inside a concave region, the linear weighted sum hyperplane ($g = 193$) touches $(300, 86)$ first, scoring $C$ worse ($g = 208$). A linear scalar optimizer is blind to $C$.'
    }
  ]

  // The 4 base frontier points (540, 18 removed to prevent canvas clipping)
  const FRONTIER_POINTS = [
    { point: '(240, 97)', f1: 240, f2: 97, g: 168.5 },
    { point: '(300, 86)', f1: 300, f2: 86, g: 193.0 },
    { point: '(420, 54)', f1: 420, f2: 54, g: 237.0 },
    { point: '(480, 33)', f1: 480, f2: 33, g: 256.5 },
    { point: 'B (140, 103)', f1: 140, f2: 103, g: 121.5, since: 2 }
  ]

  // Candidates tested at each step
  const CANDIDATES = [
    {
      step: 1,
      point: 'Sample (480, 95)',
      f1: 480,
      f2: 95,
      g: 287.5,
      comparedF1: 480,
      comparedF2: 33,
      comparedG: 256.5,
      decision: 'discard',
      decisionClass: 'tw-text-rose-400'
    },
    {
      step: 2,
      point: 'Candidate B',
      f1: 140,
      f2: 103,
      g: 121.5,
      comparedF1: 240,
      comparedF2: 97,
      comparedG: 168.5,
      decision: 'keep',
      decisionClass: 'tw-text-emerald-400'
    },
    {
      step: 3,
      point: 'Candidate C',
      f1: 340,
      f2: 76,
      g: 208.0,
      comparedF1: 300,
      comparedF2: 86,
      comparedG: 193.0,
      decision: 'missed by scalar',
      decisionClass: 'tw-text-amber-400'
    }
  ]

  root.innerHTML = `
    <style>
      #weighted-sum-demo .ws-layer { transition: opacity 0.35s ease, transform 0.35s ease; }
      #weighted-sum-demo .ws-layer.ws-hidden { opacity: 0; pointer-events: none; }
      #weighted-sum-demo .katex-display { font-size: 0.85em !important; margin: 0.35em 0 !important; }
      #weighted-sum-demo table { font-size: 0.72rem; font-family: var(--family-serif, system-ui, serif); line-height: 1.5; }
      #weighted-sum-demo table th,
      #weighted-sum-demo table td {
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
        padding: 3px 8px;
        vertical-align: middle;
      }
      #weighted-sum-demo table thead th {
        font-family: var(--family-sans, system-ui, sans-serif);
        font-weight: 600;
      }
      #weighted-sum-demo .ws-table-scroll { -webkit-overflow-scrolling: touch; }
      #weighted-sum-demo .ws-table-scroll table { width: max-content; min-width: 100%; }
    </style>

    <div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden">
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
        <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary">What a Weighted Sum Can and Cannot Reach</div>
        <div class="tw-font-serif tw-text-sm tw-text-[var(--grey-light)]">Setup + 3 evaluation steps</div>
      </div>

      <div class="tw-grid tw-grid-cols-[335px_minmax(0,1fr)] tw-gap-2.5 tw-p-2.5 tw-font-serif tw-text-[var(--grey-lighter)] max-[860px]:tw-grid-cols-1">
        <!-- Left: step pipeline + playback -->
        <div class="tw-flex tw-flex-col tw-gap-2">
          <div id="ws-step-pipeline" class="tw-flex tw-flex-col tw-gap-1"></div>

          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-gap-1.5 tw-items-stretch">
            <button type="button" id="ws-btn-reset" class="${CTRL_BTN}" title="Reset to Setup">↺</button>
            <button type="button" id="ws-btn-back" class="${CTRL_BTN}" title="Step Back">⏮</button>
            <button type="button" id="ws-btn-play" class="${PLAY_NEUTRAL}"><span id="ws-play-text">▶ Play</span></button>
            <button type="button" id="ws-btn-forward" class="${CTRL_BTN}" title="Step Forward">⏭</button>
          </div>

          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[85px]" id="ws-desc"></div>
        </div>

        <!-- Right: the animated SVG canvas -->
        <div class="tw-min-w-0 tw-bg-[var(--grey-dark)] tw-rounded-md tw-p-2.5 tw-flex tw-flex-col tw-gap-2">
          <div class="tw-flex tw-items-center tw-gap-x-3.5 tw-gap-y-1.5 tw-flex-wrap tw-text-[0.78rem] tw-leading-snug tw-text-[var(--grey-light)]">
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2.5 tw-h-2.5 tw-rounded-full tw-bg-[var(--grey-darker)] tw-border-[1.8px] tw-border-[rgb(var(--primary))]"></span> Non-dominated frontier</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2.5 tw-h-2.5 tw-rounded-full tw-bg-[#fbbf24]"></span> Evaluated candidate</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-bg-[var(--grey)] tw-opacity-45"></span> Measured point</span>
          </div>

          <svg viewBox="0 0 560 235" class="tw-w-full tw-h-auto tw-font-sans">
            <!-- Grid Lines & Axes -->
            <line x1="45" y1="200" x2="520" y2="200" stroke="var(--grey)" stroke-width="1.2" />
            <polygon points="520,196 532,200 520,204" fill="var(--grey)" />
            <text x="280" y="224" fill="var(--grey-light)" font-size="13.5" font-weight="600" text-anchor="middle">f₁: Latency / TTFT (ms) &#8594; (lower is better)</text>
            <text x="500" y="192" fill="var(--grey-light)" font-size="11.5" text-anchor="end">worse &#8594;</text>
            <text x="58" y="192" fill="#22c55e" font-size="11.5" font-weight="600" text-anchor="start">&#8592; better</text>

            <line x1="45" y1="200" x2="45" y2="20" stroke="var(--grey)" stroke-width="1.2" />
            <polygon points="41,20 45,8 49,20" fill="var(--grey)" />
            <text x="22" y="105" fill="var(--grey-light)" font-size="13.5" font-weight="600" transform="rotate(-90 22 105)" text-anchor="middle">f₂: Inverse TPS &#8594; (lower is better)</text>

            <!-- Gray Measured Scatter (Background) -->
            <g opacity="0.40">
              <circle cx="176" cy="70" r="3.5" fill="var(--grey)" />
              <circle cx="186" cy="58" r="3.5" fill="var(--grey)" />
              <circle cx="197" cy="86" r="3.5" fill="var(--grey)" />
              <circle cx="210" cy="56" r="3.5" fill="var(--grey)" />
              <circle cx="216" cy="86" r="3.5" fill="var(--grey)" />
              <circle cx="235" cy="56" r="3.5" fill="var(--grey)" />
              <circle cx="261" cy="64" r="3.5" fill="var(--grey)" />
              <circle cx="262" cy="83" r="3.5" fill="var(--grey)" />
              <circle cx="276" cy="87" r="3.5" fill="var(--grey)" />
              <circle cx="280" cy="74" r="3.5" fill="var(--grey)" />
              <circle cx="295" cy="97" r="3.5" fill="var(--grey)" />
              <circle cx="317" cy="61" r="3.5" fill="var(--grey)" />
              <circle cx="360" cy="95" r="3.5" fill="var(--grey)" />
              <circle cx="387" cy="91" r="3.5" fill="var(--grey)" />
              <circle cx="387" cy="73" r="3.5" fill="var(--grey)" />
              <circle cx="413" cy="117" r="3.5" fill="var(--grey)" />
              <circle cx="417" cy="93" r="3.5" fill="var(--grey)" />
              <circle cx="434" cy="120" r="3.5" fill="var(--grey)" />
              <circle cx="444" cy="94" r="3.5" fill="var(--grey)" />
              <circle cx="463" cy="98" r="3.5" fill="var(--grey)" />
              <circle cx="474" cy="111" r="3.5" fill="var(--grey)" />
            </g>

            <!-- Base Frontier Line (4 points) -->
            <path id="ws-base-frontier" class="ws-layer" d="M 240 93 L 300 104 L 420 136 L 480 157" fill="none" stroke="rgba(var(--primary), 0.35)" stroke-width="1.6" stroke-dasharray="4 3" />
            <!-- Updated Frontier with B added in Step 2/3 -->
            <path id="ws-updated-frontier" class="ws-layer ws-hidden" d="M 140 87 L 240 93 L 300 104 L 420 136 L 480 157" fill="none" stroke="rgba(var(--primary), 0.5)" stroke-width="2" stroke-dasharray="4 3" />

            <!-- Base Frontier 4 Points -->
            <g id="ws-frontier-points">
              <circle cx="240" cy="93" r="5.5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
              <text x="240" y="80" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">(240, 97)</text>

              <circle cx="300" cy="104" r="5.5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" id="ws-pt-300" />
              <text x="300" y="92" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">(300, 86)</text>

              <circle cx="420" cy="136" r="5.5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
              <text x="420" y="124" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">(420, 54)</text>

              <circle cx="480" cy="157" r="5.5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" id="ws-pt-480" />
              <text x="480" y="174" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">(480, 33)</text>
            </g>

            <!-- Step 1: Dominated Sample Point -->
            <g class="ws-layer ws-hidden" id="ws-layer-s1">
              <line x1="480" y1="95" x2="480" y2="157" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="3 3" />
              <circle cx="480" cy="95" r="6" fill="#fbbf24" stroke="var(--grey-darker)" stroke-width="1.6" />
              <text x="468" y="92" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="end">Sample (480, 95)</text>
              <rect x="290" y="24" width="225" height="58" rx="6" fill="var(--grey-darker)" stroke="#ef4444" stroke-width="1.2" />
              <text x="300" y="44" fill="#ef4444" font-size="12.5" font-weight="700">Dominated by (480, 33)</text>
              <text x="300" y="62" fill="var(--grey-lighter)" font-size="11.5">g(sample) = 287.5 > g = 256.5</text>
              <text x="300" y="76" fill="var(--grey-light)" font-size="10.5">Identical latency, -62 tok/s tput</text>
            </g>

            <!-- Step 2: Supported Point B -->
            <g class="ws-layer ws-hidden" id="ws-layer-s2">
              <line x1="140" y1="87" x2="240" y2="93" stroke="#22c55e" stroke-width="1.6" stroke-dasharray="3 3" />
              <circle cx="140" cy="87" r="6.5" fill="#22c55e" stroke="var(--grey-darker)" stroke-width="2" />
              <text x="140" y="74" fill="#22c55e" font-size="13.5" font-weight="700" text-anchor="middle">Cand. B (140, 103)</text>
              <rect x="54" y="24" width="215" height="58" rx="6" fill="var(--grey-darker)" stroke="#22c55e" stroke-width="1.2" />
              <text x="64" y="44" fill="#22c55e" font-size="12.5" font-weight="700">Supported Breakthrough</text>
              <text x="64" y="62" fill="var(--grey-lighter)" font-size="11.5">g(B) = 121.5 (beats nearest 168.5)</text>
              <text x="64" y="76" fill="var(--grey-light)" font-size="10.5">Convex point: reachable by scalar sum</text>
            </g>

            <!-- Step 3: Unsupported Point C in Concave Pocket (Compared directly with (300, 86)) -->
            <g class="ws-layer ws-hidden" id="ws-layer-s3">
              <!-- Point B remains part of frontier -->
              <circle cx="140" cy="87" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="1.8" />
              
              <!-- Direct comparison connector to (300, 86) -->
              <line x1="340" y1="114" x2="300" y2="104" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3 3" />
              <circle cx="300" cy="104" r="6.5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2.2" />
              <text x="292" y="76" fill="var(--grey-lighter)" font-size="12" font-weight="700" text-anchor="end">g = 193.0</text>

              <!-- Candidate C inside concave bend with label directly below -->
              <circle cx="340" cy="114" r="6.5" fill="#fbbf24" stroke="var(--grey-darker)" stroke-width="2" />
              <text x="340" y="136" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="middle">Cand. C (340, 76)</text>
              <text x="352" y="152" fill="#fbbf24" font-size="12" font-weight="600" text-anchor="start">g = 208.0</text>

              <!-- Callout Box -->
              <rect x="54" y="24" width="225" height="66" rx="6" fill="var(--grey-darker)" stroke="#f59e0b" stroke-width="1.2" />
              <text x="64" y="44" fill="#f59e0b" font-size="12.5" font-weight="700">Non-Convex / Concave Region</text>
              <text x="64" y="62" fill="#22c55e" font-size="11.5">Pareto: Optimal (no point beats C)</text>
              <text x="64" y="79" fill="var(--grey-light)" font-size="11">Weighted Sum: g(C)=208 > 193 (missed!)</text>
            </g>
          </svg>

          <!-- Mathematical Formula -->
          <div class="tw-flex tw-flex-col tw-items-center tw-gap-0.5 tw-mt-0.5">
            <div class="ws-formula tw-text-[var(--grey-lighter)]"></div>
            <div class="tw-text-[0.72rem] tw-leading-snug tw-text-[var(--grey-light)]">
              <strong class="tw-text-[var(--grey-lighter)]">lower is better</strong> &#183; 170 = best throughput on axis
            </div>
          </div>

          <!-- Complete Comparison Table showing active frontier & candidate evaluations -->
          <div class="ws-table-scroll tw-max-w-full tw-overflow-x-auto" tabindex="0" aria-label="Weighted sum comparison table">
            <table class="tw-w-max tw-min-w-full tw-border-collapse tw-mt-1" id="ws-table">
              <thead>
                <tr class="tw-font-sans tw-text-[var(--grey-light)] tw-border-b tw-border-[var(--ring-border)]">
                  <th class="tw-text-left tw-font-semibold">Point</th>
                  <th class="tw-text-right tw-font-semibold">f₁ (TTFT)</th>
                  <th class="tw-text-right tw-font-semibold">f₂ (Inv. TPS)</th>
                  <th class="tw-text-right tw-font-semibold">g(x)</th>
                  <th class="tw-text-right tw-font-semibold">vs. g</th>
                  <th class="tw-text-left tw-font-semibold">Decision</th>
                </tr>
              </thead>
              <tbody id="ws-table-body" class="tw-text-[var(--grey-light)]"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `

  const stepPipeline = root.querySelector('#ws-step-pipeline')
  const descEl = root.querySelector('#ws-desc')
  const tableBody = root.querySelector('#ws-table-body')
  const formulaEl = root.querySelector('.ws-formula')
  const playBtn = root.querySelector('#ws-btn-play')
  const playText = root.querySelector('#ws-play-text')
  const backBtn = root.querySelector('#ws-btn-back')
  const forwardBtn = root.querySelector('#ws-btn-forward')
  const resetBtn = root.querySelector('#ws-btn-reset')

  const layers = {
    s1: root.querySelector('#ws-layer-s1'),
    s2: root.querySelector('#ws-layer-s2'),
    s3: root.querySelector('#ws-layer-s3'),
    baseFrontier: root.querySelector('#ws-base-frontier'),
    updatedFrontier: root.querySelector('#ws-updated-frontier')
  }

  let currentStep = 0
  let isPlaying = false
  let timer = null

  function renderStepRows() {
    preactRender(
      html`
        <div class="tw-flex tw-flex-col tw-gap-1">
          ${STEPS.map(
            (s, idx) => html`
              <${StepRow}
                key=${idx}
                stepNumber=${idx === 0 ? 'S' : idx}
                title=${s.name}
                description=${s.shortDesc}
                isActive=${currentStep === idx}
                isCompleted=${idx < currentStep}
                isAnimating=${isPlaying && idx === currentStep}
              />
            `
          )}
        </div>
      `,
      stepPipeline
    )
  }

  function updateTable() {
    const candidate = CANDIDATES.find((c) => c.step === currentStep)
    const activeFrontier = FRONTIER_POINTS.filter(
      (f) => f.since === undefined || currentStep >= f.since
    )

    const rows = []

    // 1. Render all active frontier points
    activeFrontier.forEach((f) => {
      const isCompared =
        candidate && candidate.comparedF1 === f.f1 && candidate.comparedF2 === f.f2
      rows.push(`
        <tr class="tw-border-b tw-border-[var(--ring-border)]/50 ${
          isCompared ? 'tw-bg-primary-soft tw-text-[var(--grey-lighter)]' : ''
        }">
          <td class="tw-font-mono tw-font-semibold tw-text-[var(--grey-lighter)]">${f.point}</td>
          <td class="tw-text-right tw-font-mono">${f.f1}</td>
          <td class="tw-text-right tw-font-mono">${f.f2}</td>
          <td class="tw-text-right tw-font-mono tw-font-bold tw-text-primary">${f.g.toFixed(1)}</td>
          <td class="tw-text-right tw-font-mono tw-text-[var(--grey-light)]">—</td>
          <td class="tw-font-semibold tw-text-[var(--grey-light)]">frontier</td>
        </tr>
      `)
    })

    // 2. Render candidate being evaluated in current step
    if (candidate) {
      rows.push(`
        <tr class="tw-border-b tw-border-[var(--ring-border)]/50 tw-bg-amber-500/15 tw-text-[var(--grey-lighter)]">
          <td class="tw-font-mono tw-font-bold tw-text-amber-400">${candidate.point}</td>
          <td class="tw-text-right tw-font-mono">${candidate.f1}</td>
          <td class="tw-text-right tw-font-mono">${candidate.f2}</td>
          <td class="tw-text-right tw-font-mono tw-font-bold tw-text-amber-400">${candidate.g.toFixed(1)}</td>
          <td class="tw-text-right tw-font-mono tw-text-[var(--grey-lighter)]">${candidate.comparedG.toFixed(1)}</td>
          <td class="tw-font-bold ${candidate.decisionClass}">${candidate.decision}</td>
        </tr>
      `)
    }

    tableBody.innerHTML = rows.join('')
  }

  function render() {
    renderStepRows()
    descEl.innerHTML = renderTextWithMath(STEPS[currentStep].desc)
    updateTable()

    if (formulaEl) {
      formulaEl.innerHTML = renderMath(
        'g(x) = 0.5\\, f_1(x) + 0.5\\, f_2(x)'
      )
    }

    // Control layer visibility
    layers.s1.classList.toggle('ws-hidden', currentStep !== 1)
    layers.s2.classList.toggle('ws-hidden', currentStep !== 2)
    layers.s3.classList.toggle('ws-hidden', currentStep !== 3)

    if (layers.updatedFrontier && layers.baseFrontier) {
      if (currentStep >= 2) {
        layers.baseFrontier.classList.add('ws-hidden')
        layers.updatedFrontier.classList.remove('ws-hidden')
      } else {
        layers.baseFrontier.classList.remove('ws-hidden')
        layers.updatedFrontier.classList.add('ws-hidden')
      }
    }

    // Button state
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
      }, 2200)
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
