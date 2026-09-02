/**
 * Noise Filter Demo: Noise Bands (sigma_noise) and Minimum Improvement Thresholds (delta_min)
 *
 * One widget, one SVG, four animated states:
 * - Setup: Initial 4-point frontier + Baseline x0
 * - Step 1: Environmental Jitter (Candidate A: false win admitted by raw dominance, discarded by noise filter)
 * - Step 2: Breakthrough with Minor Jitter (Candidate B: true win lost by raw dominance, admitted by noise filter)
 * - Step 3: Baseline Grounding vs. Intransitive Drift (Candidate C: anchored to static baseline x0)
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

export function initNoiseFilterDemo(containerId = '#noise-filter-demo') {
  const root = document.querySelector(containerId)
  if (!root) return

  const CTRL_BTN = 'tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:tw-shadow-none disabled:hover:tw-shadow-none disabled:hover:tw-border-[var(--ring-border)] disabled:hover:tw-text-[var(--grey-light)] disabled:hover:tw-bg-[var(--grey-dark)] disabled:hover:tw-filter-none'
  const PLAY_NEUTRAL = 'tw-flex-1 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft'
  const PLAY_ACTIVE = 'tw-flex-1 tw-bg-primary-soft tw-border tw-border-primary-border tw-text-primary tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-bg-primary-soft hover:tw-border-primary'

  const STEPS = [
    {
      name: 'Setup',
      shortDesc: 'Initial frontier & baseline anchor',
      desc: 'The ringed coral points trace the current non-dominated frontier. The blue diamond is the fixed production baseline $\\mathbf{x}_0 = (300\\text{ms}, 180\\text{tps})$. Shaded boxes show the $\\pm 1\\%$ noise tolerance corridor ($\\sigma_{\\text{noise}}$).'
    },
    {
      name: 'Step 1 · Grounded Frontier',
      shortDesc: 'Operating spectrum anchored to x₀',
      desc: 'All 4 points represent valid engineering trade-offs measured against $\\mathbf{x}_0$: from $P_1$ ($60\\%$ faster TTFT, $-47\\%$ TPS for voice/streaming) to $P_4$ ($+56\\%$ higher throughput for batching). Neither dominates $\\mathbf{x}_0$; all sit on the frontier.'
    },
    {
      name: 'Step 2 · Jitter (False Win)',
      shortDesc: 'Candidate A: within noise band',
      desc: 'Candidate A improves $\\text{TTFT}$ by $0.4\\%$ while $\\text{TPS}$ fluctuates $+0.1\\%$. Raw mathematical dominance admits it (polluting the frontier with jitter). The noise filter treats $0.4\\% < 1\\%$ as a statistical tie and discards it.'
    },
    {
      name: 'Step 3 · Breakthrough (True Win)',
      shortDesc: 'Candidate B: beats bar locally and vs x₀',
      desc: 'Candidate B achieves a $5.5\\%$ $\\text{TTFT}$ reduction vs. nearest point $P_2$ ($30.7\\%$ vs. baseline $\\mathbf{x}_0$) while $\\text{TPS}$ is within noise ($-0.4\\%$). Raw dominance discards it because $\\text{TPS}$ is strictly worse; the noise filter admits the true breakthrough.'
    },
    {
      name: 'Step 4 · Drift Prevention',
      shortDesc: 'Candidate C: eliminates random walk drift',
      desc: 'Candidate C improves $2.8\\%$ over B locally, but vs. fixed baseline $\\mathbf{x}_0$ it only shifts from $-30.7\\%$ to $-32.6\\%$ (an absolute delta of $+1.9\\%$, failing $\\delta_{\\text{min}} = 3\\%$). Grounding deltas to static $\\mathbf{x}_0$ prevents random-walk drift.'
    }
  ]

  const COMPARISONS = [
    {
      step: 0,
      rows: [
        { algo: 'Raw Dominance', badge: 'Active', badgeClass: 'tw-bg-primary tw-text-white', ttft: '—', tps: '—', note: '4 frontier points active' },
        { algo: '(σ,δ)-Filter', badge: 'Active', badgeClass: 'tw-bg-emerald-600 tw-text-white', ttft: '—', tps: '—', note: 'σ = 1%, δ = 3% initialized' }
      ]
    },
    {
      step: 1,
      rows: [
        { algo: 'P₁ (Latency-Optimized)', badge: 'Non-Dominated', badgeClass: 'tw-bg-sky-600 tw-text-white', ttft: '-60.0% vs x₀', tps: '-47.2% vs x₀', note: 'Trade-off: ultra-fast voice / realtime' },
        { algo: 'P₄ (Throughput-Optimized)', badge: 'Non-Dominated', badgeClass: 'tw-bg-indigo-600 tw-text-white', ttft: '+51.7% vs x₀', tps: '+55.6% vs x₀', note: 'Trade-off: high concurrency batching' }
      ]
    },
    {
      step: 2,
      candidate: 'Candidate A (219ms, 160.2 tok/s)',
      rows: [
        { algo: 'Raw Dominance', badge: 'Admitted (Polluted)', badgeClass: 'tw-bg-amber-600 tw-text-white', ttft: '-0.4%', tps: '+0.1%', note: 'Admits 0.4% jitter as new frontier point' },
        { algo: '(σ,δ)-Filter', badge: 'Discarded (Noise)', badgeClass: 'tw-bg-zinc-700 tw-text-zinc-300', ttft: '-0.4%', tps: '+0.1%', note: 'Inside ±1% noise band; fails δ ≥ 3%' }
      ]
    },
    {
      step: 3,
      candidate: 'Candidate B (208ms, 159.3 tok/s)',
      rows: [
        { algo: 'Raw Dominance', badge: 'Lost (Discarded)', badgeClass: 'tw-bg-rose-700 tw-text-white', ttft: '-5.5%', tps: '-0.4%', note: 'Loses 5.5% win because TPS is 0.4% lower' },
        { algo: '(σ,δ)-Filter', badge: 'Admitted (Kept)', badgeClass: 'tw-bg-emerald-600 tw-text-white', ttft: '-5.5% (-30.7% vs x₀)', tps: '-0.4%', note: 'TPS within ±1% noise; beats 3% bar locally and vs x₀' }
      ]
    },
    {
      step: 4,
      candidate: 'Candidate C (202ms, 158.5 tok/s)',
      rows: [
        { algo: 'Sequential Relative', badge: 'Drifting Scale', badgeClass: 'tw-bg-amber-600 tw-text-white', ttft: '-2.8% vs B', tps: '-0.5% vs B', note: 'Chains pairwise checks; risks random walk' },
        { algo: 'Baseline Grounded', badge: 'Discarded (Below Bar)', badgeClass: 'tw-bg-zinc-700 tw-text-zinc-300', ttft: '+1.9% shift vs x₀', tps: '-0.5% vs B', note: 'Shift from -30.7% to -32.6% is < 3% vs x₀; discarded' }
      ]
    }
  ]

  root.innerHTML = `
    <style>
      #noise-filter-demo .nf-layer { transition: opacity 0.35s ease, transform 0.35s ease; }
      #noise-filter-demo .nf-layer.nf-hidden { opacity: 0; pointer-events: none; }
      #noise-filter-demo .katex-display { font-size: 0.85em !important; margin: 0.35em 0 !important; }
      #noise-filter-demo table { font-size: 0.72rem; font-family: var(--family-serif, system-ui, serif); line-height: 1.5; }
      #noise-filter-demo table th,
      #noise-filter-demo table td {
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
        padding: 3px 8px;
        vertical-align: middle;
      }
      #noise-filter-demo table thead th {
        font-family: var(--family-sans, system-ui, sans-serif);
        font-weight: 600;
      }
      #noise-filter-demo .nf-table-scroll { -webkit-overflow-scrolling: touch; }
      #noise-filter-demo .nf-table-scroll table { width: max-content; min-width: 100%; }
    </style>

    <div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden">
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
        <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary">Noise-Aware Filtering vs. Raw Dominance</div>
        <div class="tw-font-serif tw-text-sm tw-text-[var(--grey-light)]">Setup + 4 evaluation steps</div>
      </div>

      <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif tw-text-[var(--grey-lighter)] max-[860px]:tw-grid-cols-1">
        <!-- Left: step pipeline + playback -->
        <div class="tw-flex tw-flex-col tw-gap-2">
          <div id="nf-step-pipeline" class="tw-flex tw-flex-col tw-gap-1"></div>

          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-gap-1.5 tw-items-stretch">
            <button type="button" id="nf-btn-reset" class="${CTRL_BTN}" title="Reset to Setup">↺</button>
            <button type="button" id="nf-btn-back" class="${CTRL_BTN}" title="Step Back">⏮</button>
            <button type="button" id="nf-btn-play" class="${PLAY_NEUTRAL}"><span id="nf-play-text">▶ Play</span></button>
            <button type="button" id="nf-btn-forward" class="${CTRL_BTN}" title="Step Forward">⏭</button>
          </div>

          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[85px]" id="nf-desc"></div>
        </div>

        <!-- Right: the animated SVG canvas -->
        <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-p-2.5 tw-flex tw-flex-col tw-gap-2">
          <div class="tw-flex tw-items-center tw-gap-x-3.5 tw-gap-y-1.5 tw-flex-wrap tw-text-[0.78rem] tw-leading-snug tw-text-[var(--grey-light)]">
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2.5 tw-h-2.5 tw-rounded-full tw-bg-[var(--grey-darker)] tw-border-[1.8px] tw-border-[rgb(var(--primary))]"></span> Frontier point</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2.5 tw-h-2.5 tw-rotate-45 tw-bg-sky-500"></span> Baseline x₀</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-3 tw-h-2.5 tw-bg-primary/20 tw-border tw-border-primary/40 tw-rounded-sm"></span> ±1% noise box</span>
            <span class="tw-inline-flex tw-items-center tw-gap-1.5"><span class="tw-inline-block tw-w-2.5 tw-h-2.5 tw-rounded-full tw-bg-[#fbbf24]"></span> Evaluated candidate</span>
          </div>

          <svg viewBox="0 0 560 235" class="tw-w-full tw-h-auto tw-font-sans">
            <!-- Grid Lines -->
            <line x1="36" y1="200" x2="545" y2="200" stroke="var(--grey)" stroke-width="1.2" />
            <polygon points="545,196 557,200 545,204" fill="var(--grey)" />
            <text x="290" y="224" fill="var(--grey-light)" font-size="13.5" font-weight="600" text-anchor="middle">TTFT (ms) &#8594; (lower is better)</text>
            <text x="525" y="192" fill="var(--grey-light)" font-size="11.5" text-anchor="end">worse &#8594;</text>
            <text x="50" y="192" fill="#22c55e" font-size="11.5" font-weight="600" text-anchor="start">&#8592; better</text>

            <line x1="36" y1="200" x2="36" y2="18" stroke="var(--grey)" stroke-width="1.2" />
            <polygon points="32,18 36,6 40,18" fill="var(--grey)" />
            <text x="20" y="105" fill="var(--grey-light)" font-size="13.5" font-weight="600" transform="rotate(-90 20 105)" text-anchor="middle">TPS (tok/s) &#8594; (higher is better)</text>

            <!-- Discarded Background Scatter -->
            <g opacity="0.35">
              <circle cx="165" cy="152" r="3.5" fill="var(--grey)" />
              <circle cx="205" cy="162" r="3.5" fill="var(--grey)" />
              <circle cx="265" cy="138" r="3.5" fill="var(--grey)" />
              <circle cx="325" cy="122" r="3.5" fill="var(--grey)" />
              <circle cx="390" cy="100" r="3.5" fill="var(--grey)" />
              <circle cx="455" cy="74" r="3.5" fill="var(--grey)" />
              <circle cx="505" cy="52" r="3.5" fill="var(--grey)" />
            </g>

            <!-- Base Frontier Connectors -->
            <path id="nf-base-frontier" class="nf-layer" d="M 112 146 L 225 105 L 345 67 L 475 32" fill="none" stroke="rgba(var(--primary), 0.35)" stroke-width="1.6" stroke-dasharray="4 3" />
            <!-- Updated Frontier Connectors (with B admitted in Step 4) -->
            <path id="nf-updated-frontier" class="nf-layer nf-hidden" d="M 112 146 L 158 107 L 345 67 L 475 32" fill="none" stroke="rgba(var(--primary), 0.5)" stroke-width="2" stroke-dasharray="4 3" />

            <!-- Base Noise Bands around Frontier Points (±1% tolerance boxes) -->
            <g id="nf-noise-boxes">
              <rect x="98" y="137" width="28" height="18" rx="3" fill="rgba(var(--primary), 0.12)" stroke="rgba(var(--primary), 0.35)" stroke-width="1" />
              <rect x="211" y="96" width="28" height="18" rx="3" fill="rgba(var(--primary), 0.12)" stroke="rgba(var(--primary), 0.35)" stroke-width="1" id="nf-box-p2" />
              <rect x="331" y="58" width="28" height="18" rx="3" fill="rgba(var(--primary), 0.12)" stroke="rgba(var(--primary), 0.35)" stroke-width="1" />
              <rect x="461" y="23" width="28" height="18" rx="3" fill="rgba(var(--primary), 0.12)" stroke="rgba(var(--primary), 0.35)" stroke-width="1" />
            </g>

            <!-- Production Baseline x0 -->
            <g transform="translate(315, 90)">
              <polygon points="0,-7 7,0 0,7 -7,0" fill="#0284c7" stroke="#38bdf8" stroke-width="1.3" />
              <text x="10" y="4" fill="#38bdf8" font-size="12.5" font-weight="700">Baseline x₀</text>
            </g>

            <!-- Base Frontier 4 Points -->
            <g id="nf-frontier-points">
              <!-- Point 1 (Low latency, lower TPS) -->
              <circle cx="112" cy="146" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
              <text x="112" y="172" fill="var(--grey-light)" font-size="12.5" font-weight="600" text-anchor="middle">P₁ (120ms, 95tps)</text>

              <!-- Point 2 (Anchor for S2/S3) -->
              <g id="nf-group-p2">
                <circle cx="225" cy="105" r="5.5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" id="nf-pt-2" />
                <text x="225" y="131" fill="var(--grey-light)" font-size="12.5" font-weight="600" text-anchor="middle">P₂ (220ms, 160tps)</text>
              </g>

              <!-- Point 3 -->
              <circle cx="345" cy="67" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
              <text x="345" y="50" fill="var(--grey-light)" font-size="12.5" font-weight="600" text-anchor="middle">P₃ (320ms, 220tps)</text>

              <!-- Point 4 (High TPS, high latency) -->
              <circle cx="475" cy="32" r="5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
              <text x="475" y="18" fill="var(--grey-light)" font-size="12.5" font-weight="600" text-anchor="middle">P₄ (440ms, 280tps)</text>
            </g>

            <!-- Step 1: Grounded Frontier Spectrum (Rays from x0 to all 4 points) -->
            <g class="nf-layer nf-hidden" id="nf-layer-s1">
              <line x1="315" y1="90" x2="112" y2="146" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="3 3" />
              <line x1="315" y1="90" x2="225" y2="105" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="3 3" />
              <line x1="315" y1="90" x2="345" y2="67" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="3 3" />
              <line x1="315" y1="90" x2="475" y2="32" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="3 3" />
              <rect x="44" y="24" width="200" height="64" rx="6" fill="var(--grey-darker)" stroke="#38bdf8" stroke-width="1.2" />
              <text x="54" y="44" fill="#38bdf8" font-size="13" font-weight="700">Grounded Spectrum</text>
              <text x="54" y="62" fill="var(--grey-lighter)" font-size="11.5">P₁: -60% TTFT (Voice / Realtime)</text>
              <text x="54" y="78" fill="var(--grey-light)" font-size="11">P₄: +56% TPS (Max Batching)</text>
            </g>

            <!-- Step 2: Candidate A (Inside Noise Box -> Jitter) -->
            <g class="nf-layer nf-hidden" id="nf-layer-s2">
              <line x1="225" y1="105" x2="221" y2="103" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="2 2" />
              <circle cx="221" cy="103" r="5.5" fill="#fbbf24" stroke="var(--grey-darker)" stroke-width="1.6" />
              <text x="213" y="90" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="end">Cand. A</text>
              <rect x="245" y="72" width="155" height="48" rx="6" fill="var(--grey-darker)" stroke="var(--ring-border)" stroke-width="1" />
              <text x="255" y="91" fill="#fbbf24" font-size="12.5" font-weight="600">ΔTTFT: -0.4%</text>
              <text x="255" y="109" fill="var(--grey-light)" font-size="11.5">Inside ±1% noise box</text>
            </g>

            <!-- Step 3: Candidate B (Exceeds delta_min -> True Breakthrough) -->
            <g class="nf-layer nf-hidden" id="nf-layer-s3">
              <line x1="225" y1="105" x2="158" y2="107" stroke="#22c55e" stroke-width="1.6" stroke-dasharray="3 3" />
              <line x1="315" y1="90" x2="158" y2="107" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="4 3" />
              <circle cx="158" cy="107" r="6.5" fill="#22c55e" stroke="var(--grey-darker)" stroke-width="2" />
              <text x="158" y="132" fill="#22c55e" font-size="13" font-weight="700" text-anchor="middle">Cand. B (208ms)</text>
              <rect x="54" y="24" width="195" height="66" rx="6" fill="var(--grey-darker)" stroke="#22c55e" stroke-width="1.2" />
              <text x="64" y="44" fill="#22c55e" font-size="12.5" font-weight="700">vs. P₂: -5.5% TTFT (≥ 3%)</text>
              <text x="64" y="62" fill="#38bdf8" font-size="12" font-weight="600">vs. x₀: -30.7% TTFT</text>
              <text x="64" y="79" fill="var(--grey-light)" font-size="11">TPS: -0.4% (inside ±1% noise)</text>
            </g>

            <!-- Step 4: Candidate C (Grounded vs Drift) -->
            <g class="nf-layer nf-hidden" id="nf-layer-s4">
              <!-- Admitted B as part of frontier -->
              <rect x="144" y="98" width="28" height="18" rx="3" fill="rgba(var(--primary), 0.12)" stroke="rgba(var(--primary), 0.35)" stroke-width="1" />
              <circle cx="158" cy="107" r="5.5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
              <text x="158" y="130" fill="var(--grey-light)" font-size="12" font-weight="600" text-anchor="middle">B (208ms, 159tps)</text>

              <!-- Connectors to B and x0 -->
              <line x1="158" y1="107" x2="136" y2="110" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="2 2" />
              <line x1="315" y1="90" x2="136" y2="110" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" />
              <circle cx="136" cy="110" r="6" fill="#38bdf8" stroke="var(--grey-darker)" stroke-width="1.6" />
              <text x="124" y="114" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="end">Cand. C</text>

              <rect x="42" y="24" width="195" height="64" rx="6" fill="var(--grey-darker)" stroke="#38bdf8" stroke-width="1.2" />
              <text x="52" y="44" fill="#38bdf8" font-size="12.5" font-weight="700">vs. x₀: -32.6% TTFT</text>
              <text x="52" y="62" fill="#fbbf24" font-size="11.5">vs. Cand B: -2.8% TTFT</text>
              <text x="52" y="78" fill="var(--grey-light)" font-size="10.5">Grounding eliminates drift</text>
            </g>
          </svg>

          <!-- Side-by-side comparison table -->
          <div class="nf-table-scroll tw-max-w-full tw-overflow-x-auto" tabindex="0" aria-label="Noise-aware filtering comparison table">
            <table class="tw-w-max tw-min-w-full tw-border-collapse" id="nf-table">
              <thead>
                <tr class="tw-font-sans tw-text-[var(--grey-light)] tw-border-b tw-border-[var(--ring-border)]">
                  <th class="tw-text-left tw-font-semibold">Method / Mode</th>
                  <th class="tw-text-left tw-font-semibold">Decision</th>
                  <th class="tw-text-right tw-font-semibold">Δ TTFT</th>
                  <th class="tw-text-right tw-font-semibold">Δ TPS</th>
                  <th class="tw-text-left tw-font-semibold">Mechanism / Notes</th>
                </tr>
              </thead>
              <tbody id="nf-table-body" class="tw-text-[var(--grey-light)]"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `

  const stepPipeline = root.querySelector('#nf-step-pipeline')
  const descEl = root.querySelector('#nf-desc')
  const tableBody = root.querySelector('#nf-table-body')
  const playBtn = root.querySelector('#nf-btn-play')
  const playText = root.querySelector('#nf-play-text')
  const backBtn = root.querySelector('#nf-btn-back')
  const forwardBtn = root.querySelector('#nf-btn-forward')
  const resetBtn = root.querySelector('#nf-btn-reset')

  const layers = {
    s1: root.querySelector('#nf-layer-s1'),
    s2: root.querySelector('#nf-layer-s2'),
    s3: root.querySelector('#nf-layer-s3'),
    s4: root.querySelector('#nf-layer-s4'),
    baseFrontier: root.querySelector('#nf-base-frontier'),
    updatedFrontier: root.querySelector('#nf-updated-frontier'),
    groupP2: root.querySelector('#nf-group-p2')
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
    const comp = COMPARISONS[currentStep]
    if (!comp) return

    tableBody.innerHTML = comp.rows
      .map(
        r => `
          <tr class="tw-border-b tw-border-[var(--ring-border)]/50">
            <td class="tw-font-sans tw-font-semibold tw-text-[var(--grey-lighter)]">${r.algo}</td>
            <td><span class="tw-inline-block tw-px-1.5 tw-py-0.5 tw-rounded tw-text-[0.6rem] tw-font-semibold ${r.badgeClass}">${r.badge}</span></td>
            <td class="tw-text-right tw-font-mono ${r.ttft.startsWith('-') ? 'tw-text-emerald-400' : 'tw-text-[var(--grey-light)]'}">${r.ttft}</td>
            <td class="tw-text-right tw-font-mono ${r.tps.startsWith('+') ? 'tw-text-emerald-400' : r.tps.startsWith('-') ? 'tw-text-rose-400' : 'tw-text-[var(--grey-light)]'}">${r.tps}</td>
            <td class="tw-text-[var(--grey-light)]">${r.note}</td>
          </tr>
        `
      )
      .join('')
  }

  function updateVisuals() {
    // Cross-fade SVG layers
    if (layers.s1) layers.s1.classList.toggle('nf-hidden', currentStep !== 1)
    if (layers.s2) layers.s2.classList.toggle('nf-hidden', currentStep !== 2)
    if (layers.s3) layers.s3.classList.toggle('nf-hidden', currentStep !== 3)
    if (layers.s4) layers.s4.classList.toggle('nf-hidden', currentStep !== 4)

    // Toggle base vs updated frontier line
    if (layers.baseFrontier) layers.baseFrontier.classList.toggle('nf-hidden', currentStep === 4)
    if (layers.updatedFrontier) layers.updatedFrontier.classList.toggle('nf-hidden', currentStep !== 4)
    if (layers.groupP2) layers.groupP2.style.opacity = currentStep === 4 ? '0.35' : '1'

    // Update explanation
    const s = STEPS[currentStep]
    if (descEl && s) {
      descEl.innerHTML = renderTextWithMath(s.desc)
    }

    // Update button states
    if (resetBtn) resetBtn.disabled = currentStep === 0
    if (backBtn) backBtn.disabled = currentStep === 0
    if (forwardBtn) forwardBtn.disabled = currentStep === STEPS.length - 1

    if (playBtn && playText) {
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

    renderStepRows()
    updateTable()
  }

  function setStep(idx) {
    currentStep = Math.max(0, Math.min(STEPS.length - 1, idx))
    updateVisuals()
  }

  function play() {
    if (currentStep === STEPS.length - 1) {
      currentStep = 0
    }
    isPlaying = true
    updateVisuals()
    timer = setInterval(() => {
      if (currentStep < STEPS.length - 1) {
        setStep(currentStep + 1)
      } else {
        pause()
      }
    }, 3800)
  }

  function pause() {
    isPlaying = false
    clearInterval(timer)
    timer = null
    updateVisuals()
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isPlaying) pause()
      else play()
    })
  }
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      pause()
      setStep(currentStep - 1)
    })
  }
  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => {
      pause()
      setStep(currentStep + 1)
    })
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      pause()
      setStep(0)
    })
  }

  // Initial render
  setStep(0)
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initNoiseFilterDemo())
  } else {
    initNoiseFilterDemo()
  }
}
