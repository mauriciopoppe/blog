/**
 * Interactive Hockey Stick Latency Curve Explorer (M/M/1)
 * Visualizes the non-linear relationship between utilization (rho),
 * service execution time (S), and total response time (W = S / (1 - rho)).
 */

export function calculateQueueMetrics(rho, serviceTimeMs) {
  const safeRho = Math.max(0.0, Math.min(0.99, rho));
  const s = Math.max(0.1, serviceTimeMs);
  const multiplier = 1 / (1 - safeRho);
  const queueMultiplier = safeRho / (1 - safeRho);
  const waitTimeMs = queueMultiplier * s;
  const totalResponseTimeMs = multiplier * s;
  const lambdaReqSec = safeRho / (s / 1000);

  return {
    rho: safeRho,
    rhoPct: (safeRho * 100).toFixed(0),
    serviceTimeMs: s,
    lambdaReqSec: Math.round(lambdaReqSec),
    multiplier: multiplier.toFixed(1),
    queueMultiplier: queueMultiplier.toFixed(1),
    waitTimeMs: Math.round(waitTimeMs * 10) / 10,
    totalResponseTimeMs: Math.round(totalResponseTimeMs * 10) / 10,
  };
}

export function initHockeyStickExplorer(containerId = '#hockey-stick-explorer') {
  const container = typeof containerId === 'string' ? document.querySelector(containerId) : containerId;
  if (!container) return;

  let serviceTime = 10; // ms
  let currentRho = 0.75; // 75% default

  container.innerHTML = `
    <style>
      #hockey-stick-explorer .hs-slider { -webkit-appearance: none; appearance: none; height: 28px; background: transparent; --range-fill: 50%; }
      #hockey-stick-explorer .hs-slider::-webkit-slider-runnable-track { height: 8px; border-radius: 999px; background: linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) var(--range-fill), var(--ring-border) var(--range-fill), var(--ring-border) 100%); }
      #hockey-stick-explorer .hs-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); margin-top: -5px; box-shadow: var(--elevation-subtle); }
      #hockey-stick-explorer .hs-slider::-moz-range-track { height: 8px; border-radius: 999px; background: var(--ring-border); }
      #hockey-stick-explorer .hs-slider::-moz-range-progress { height: 8px; border-radius: 999px; background: rgb(var(--primary)); }
      #hockey-stick-explorer .hs-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); box-shadow: var(--elevation-subtle); }
      #hockey-stick-explorer .hs-slider:hover::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
      #hockey-stick-explorer .hs-slider:hover::-moz-range-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
      #hockey-stick-explorer .hs-slider:focus-visible { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; border-radius: 999px; }
    </style>
    <div class="tw-my-4 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden">
      <header class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
        <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary">Hockey Stick Latency Curve</div>
        <div class="tw-text-sm tw-text-[var(--grey-light)]">✦ Hover or drag across the graph to inspect any load point</div>
      </header>
      <div class="tw-p-2.5">
        <!-- Service Time Slider -->
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
          <span style="font-size: 0.82rem; font-weight: 600; color: var(--grey-lighter); white-space: nowrap;">Service Time ($S$):</span>
          <input type="range" id="slider-service-time" class="hs-slider" min="2" max="50" step="1" value="10" style="flex: 1; min-width: 60px;">
          <strong id="label-service-time" style="color: rgb(var(--primary)); font-size: 0.9rem; min-width: 42px; text-align: right;">10 ms</strong>
        </div>

      <!-- Interactive SVG Curve Canvas -->
      <div id="curve-svg-wrapper" style="width: 100%; position: relative; cursor: crosshair; touch-action: none;">
        <svg id="hockey-svg" viewBox="0 0 880 390" width="100%" style="width: 100%; height: auto; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-dark); border-radius: 8px; padding: 12px 16px; box-sizing: border-box;">
          <defs>
            <linearGradient id="exp-curve-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#81c784" />
              <stop offset="60%" stop-color="#ffb74d" />
              <stop offset="85%" stop-color="rgb(var(--primary))" />
              <stop offset="100%" stop-color="#ffa726" />
            </linearGradient>
            <linearGradient id="exp-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(var(--primary), 0.25)" />
              <stop offset="100%" stop-color="rgba(var(--primary), 0.0)" />
            </linearGradient>
          </defs>

          <!-- Zone Header Titles -->
          <text x="260" y="26" fill="#81c784" font-size="11" font-weight="700" letter-spacing="0.04em" text-anchor="middle">SAFE ZONE (0% - 50% LOAD)</text>
          <text x="530" y="26" fill="#ffb74d" font-size="11" font-weight="700" letter-spacing="0.04em" text-anchor="middle">THE KNEE (50% - 75%)</text>
          <text x="710" y="26" fill="#ffa726" font-size="11" font-weight="700" letter-spacing="0.04em" text-anchor="middle">SATURATION CLIFF (75% - 100%)</text>

          <!-- Zone Background Bands -->
          <rect x="80" y="38" width="360" height="272" fill="#81c784" fill-opacity="0.04" rx="4" />
          <rect x="440" y="38" width="180" height="272" fill="#ffb74d" fill-opacity="0.04" rx="4" />
          <rect x="620" y="38" width="180" height="272" fill="#ffa726" fill-opacity="0.05" rx="4" />

          <!-- Fixed Top-Left Transparent Live Readout HUD -->
          <g id="fixed-hud-group" style="pointer-events: none;">
            <text id="hud-title" x="96" y="58" fill="var(--grey-lighter)" font-size="13" font-weight="700">Load: ρ = 75% (The Knee)</text>
            <text id="hud-line1" x="96" y="78" fill="rgb(var(--primary))" font-size="12" font-weight="600">Total Latency (W): 40.0 ms (4.0×)</text>
            <text id="hud-line2" x="96" y="96" fill="#ffa726" font-size="12" font-weight="600">Queue Wait (Wq): 30.0 ms</text>
            <text id="hud-line3" x="96" y="112" fill="var(--grey-light)" font-size="11" font-weight="500">Arrival Rate (λ): 75 req/s</text>
          </g>

          <!-- Horizontal Grid Lines -->
          <line x1="80" y1="286" x2="800" y2="286" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1" />
          <line x1="80" y1="263" x2="800" y2="263" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1" />
          <line x1="80" y1="216" x2="800" y2="216" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1" />
          <line x1="80" y1="168" x2="800" y2="168" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1" />
          <line x1="80" y1="121" x2="800" y2="121" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1" />
          <line x1="80" y1="74" x2="800" y2="74" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1" />

          <!-- Vertical Grid Lines -->
          <line x1="80" y1="38" x2="80" y2="310" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
          <line x1="260" y1="38" x2="260" y2="310" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
          <line x1="440" y1="38" x2="440" y2="310" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
          <line x1="620" y1="38" x2="620" y2="310" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
          <line x1="728" y1="38" x2="728" y2="310" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />

          <!-- Asymptote Line -->
          <line x1="800" y1="38" x2="800" y2="310" stroke="#ffa726" stroke-width="1.5" stroke-dasharray="4 4" />
          <text x="794" y="145" fill="#ffa726" font-size="10" font-weight="700" text-anchor="end">Capacity Limit (ρ = 1.0)</text>
          <text x="794" y="160" fill="#ffa726" font-size="10" font-weight="600" text-anchor="end">Latency W → ∞</text>

          <!-- Y-Axis Ticks -->
          <text x="72" y="290" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="end">1.0×</text>
          <text x="72" y="267" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="end">2.0×</text>
          <text x="72" y="220" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="end">4.0×</text>
          <text x="72" y="172" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="end">6.0×</text>
          <text x="72" y="125" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="end">8.0×</text>
          <text x="72" y="78" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="end">10.0×</text>

          <!-- X-Axis Ticks -->
          <text x="80" y="332" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="middle">0%</text>
          <text x="260" y="332" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="middle">25%</text>
          <text x="440" y="332" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="middle">50%</text>
          <text x="620" y="332" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="middle">75%</text>
          <text x="728" y="332" fill="var(--grey-light)" font-size="11" font-weight="600" text-anchor="middle">90%</text>
          <text x="800" y="332" fill="#ffa726" font-size="11" font-weight="700" text-anchor="middle">100%</text>

          <!-- Axis Titles -->
          <text x="440" y="362" fill="var(--grey-lighter)" font-size="12" font-weight="700" letter-spacing="0.05em" text-anchor="middle">SERVER UTILIZATION (ρ = λ / μ)</text>
          <text x="18" y="175" fill="var(--grey-lighter)" font-size="11" font-weight="700" letter-spacing="0.04em" transform="rotate(-90 18 175)" text-anchor="middle">RESPONSE TIME MULTIPLIER (W / S)</text>

          <!-- The Curve Area & Stroke -->
          <path d="M 80 286 L 152 284 L 224 280 L 296 276 L 368 271 L 440 263 L 512 251 L 584 231 L 620 216 L 656 192 L 692 152 L 728 74 L 738 45 L 738 310 L 80 310 Z" fill="url(#exp-area-grad)" />
          <path d="M 80 286 L 152 284 L 224 280 L 296 276 L 368 271 L 440 263 L 512 251 L 584 231 L 620 216 L 656 192 L 692 152 L 728 74 L 738 45" fill="none" stroke="url(#exp-curve-grad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Landmark 1: 0% -->
          <circle cx="80" cy="286" r="4" fill="#81c784" stroke="var(--grey-darker)" stroke-width="2" />
          <text id="lm-text-0" x="88" y="278" fill="#81c784" font-size="10.5" font-weight="700">1.0× (10ms)</text>

          <!-- Landmark 2: 50% -->
          <circle cx="440" cy="263" r="4.5" fill="#ffb74d" stroke="var(--grey-darker)" stroke-width="2" />
          <line x1="440" y1="263" x2="440" y2="310" stroke="#ffb74d" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
          <text id="lm-text-50" x="440" y="248" fill="#ffb74d" font-size="10.5" font-weight="700" text-anchor="middle">2.0× (20ms)</text>

          <!-- Landmark 3: 75% -->
          <circle cx="620" cy="216" r="4.5" fill="rgb(var(--primary))" stroke="var(--grey-darker)" stroke-width="2" />
          <line x1="620" y1="216" x2="620" y2="310" stroke="rgb(var(--primary))" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
          <text id="lm-text-75" x="605" y="206" fill="rgb(var(--primary))" font-size="10.5" font-weight="700" text-anchor="end">4.0× (40ms)</text>

          <!-- Landmark 4: 90% -->
          <circle cx="728" cy="74" r="4.5" fill="#ffa726" stroke="var(--grey-darker)" stroke-width="2" />
          <line x1="728" y1="74" x2="728" y2="310" stroke="#ffa726" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
          <text id="lm-text-90" x="716" y="80" fill="#ffa726" font-size="10.5" font-weight="700" text-anchor="end">10.0× (100ms)</text>

          <!-- Active Dynamic Scrubber Marker (Dot & Track Line Only) -->
          <g id="active-marker-group" style="pointer-events: none;">
            <line id="active-v-line" x1="620" y1="216" x2="620" y2="310" stroke="var(--grey-lighter)" stroke-width="1.5" stroke-dasharray="2 2" />
            <circle id="active-pulse" cx="620" cy="216" r="10" fill="rgb(var(--primary))" fill-opacity="0.25" />
            <circle id="active-dot" cx="620" cy="216" r="5.5" fill="var(--grey-lighter)" stroke="rgb(var(--primary))" stroke-width="2.5" />
          </g>
        </svg>
      </div>
      </div>
    </div>
  `;

  // Elements
  const sliderS = container.querySelector('#slider-service-time');
  const labelS = container.querySelector('#label-service-time');
  const svgEl = container.querySelector('#hockey-svg');
  const svgWrapper = container.querySelector('#curve-svg-wrapper');

  const lm0 = container.querySelector('#lm-text-0');
  const lm50 = container.querySelector('#lm-text-50');
  const lm75 = container.querySelector('#lm-text-75');
  const lm90 = container.querySelector('#lm-text-90');

  const activeVLine = container.querySelector('#active-v-line');
  const activePulse = container.querySelector('#active-pulse');
  const activeDot = container.querySelector('#active-dot');

  const hudTitle = container.querySelector('#hud-title');
  const hudLine1 = container.querySelector('#hud-line1');
  const hudLine2 = container.querySelector('#hud-line2');
  const hudLine3 = container.querySelector('#hud-line3');

  // Curve coordinates mapping: x in [80, 800], rho in [0, 1]
  function getCurveCoords(rho) {
    const x = 80 + rho * 720;
    const mult = 1 / Math.max(0.01, 1 - rho);
    const clampedMult = Math.min(11.0, mult);
    const y = 310 - (clampedMult * 23.55);
    return { x: Math.max(80, Math.min(790, x)), y: Math.max(45, Math.min(286, y)) };
  }

  function update() {
    const metrics = calculateQueueMetrics(currentRho, serviceTime);

    labelS.textContent = `${serviceTime} ms`;

    // Dynamic landmark texts
    lm0.textContent = `1.0× (${metrics.serviceTimeMs}ms)`;
    lm50.textContent = `2.0× (${metrics.serviceTimeMs * 2}ms)`;
    lm75.textContent = `4.0× (${metrics.serviceTimeMs * 4}ms)`;
    lm90.textContent = `10.0× (${metrics.serviceTimeMs * 10}ms)`;

    // Active scrubber dot position
    const { x, y } = getCurveCoords(currentRho);
    activeVLine.setAttribute('x1', x);
    activeVLine.setAttribute('y1', y);
    activeVLine.setAttribute('x2', x);
    activeVLine.setAttribute('y2', '310');

    activePulse.setAttribute('cx', x);
    activePulse.setAttribute('cy', y);
    activeDot.setAttribute('cx', x);
    activeDot.setAttribute('cy', y);

    // Update fixed top-left HUD
    let zoneDesc = 'Safe Zone';
    if (currentRho > 0.75) zoneDesc = 'Saturation Cliff';
    else if (currentRho >= 0.50) zoneDesc = 'The Knee';

    hudTitle.textContent = `Load: ρ = ${metrics.rhoPct}% (${zoneDesc})`;
    hudLine1.textContent = `Total Latency (W): ${metrics.totalResponseTimeMs} ms (${metrics.multiplier}×)`;
    hudLine2.textContent = `Queue Wait (Wq): ${metrics.waitTimeMs} ms`;
    hudLine3.textContent = `Arrival Rate (λ): ${metrics.lambdaReqSec} req/s`;
  }

  function handlePointerMove(e) {
    const rect = svgEl.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const relativeX = clientX - rect.left;
    const svgX = relativeX * (880 / rect.width);
    const newRho = Math.max(0.0, Math.min(0.95, (svgX - 80) / 720));
    currentRho = Math.round(newRho * 100) / 100;
    update();
  }

  svgWrapper.addEventListener('mousemove', handlePointerMove);
  svgWrapper.addEventListener('touchmove', handlePointerMove, { passive: true });
  svgWrapper.addEventListener('touchstart', handlePointerMove, { passive: true });

  sliderS.addEventListener('input', (e) => {
    serviceTime = parseFloat(e.target.value);
    syncSliderFill(sliderS);
    update();
  });

  function syncSliderFill(slider) {
    const pct = ((parseFloat(slider.value) - parseFloat(slider.min)) / (parseFloat(slider.max) - parseFloat(slider.min))) * 100;
    slider.style.setProperty('--range-fill', pct + '%');
  }
  syncSliderFill(sliderS);

  update();
}

// Auto-initialize if container present
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initHockeyStickExplorer());
  } else {
    initHockeyStickExplorer();
  }
}
