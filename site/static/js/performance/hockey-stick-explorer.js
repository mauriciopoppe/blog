/**
 * Interactive Hockey Stick Latency Curve Explorer (M/M/1)
 * Visualizes the non-linear relationship between utilization (rho),
 * service execution time (S), and total response time (W = S / (1 - rho)).
 */

import { html, render, useState, useRef } from '../ui/preact.js';
import { WidgetFrame } from '../ui/WidgetFrame.js';
import { RangeSlider } from '../ui/RangeSlider.js';

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

export function HockeyStickExplorer() {
  const [serviceTime, setServiceTime] = useState(10);
  const [currentRho, setCurrentRho] = useState(0.75);
  const svgRef = useRef(null);

  const metrics = calculateQueueMetrics(currentRho, serviceTime);

  function getCurveCoords(rho) {
    const x = 80 + rho * 720;
    const mult = 1 / Math.max(0.01, 1 - rho);
    const clampedMult = Math.min(11.0, mult);
    const y = 310 - (clampedMult * 23.55);
    return { x: Math.max(80, Math.min(790, x)), y: Math.max(45, Math.min(286, y)) };
  }

  const { x, y } = getCurveCoords(currentRho);

  let zoneDesc = 'Safe Zone';
  if (currentRho > 0.75) zoneDesc = 'Saturation Cliff';
  else if (currentRho >= 0.50) zoneDesc = 'The Knee';

  const handlePointerMove = (e) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const relativeX = clientX - rect.left;
    const svgX = relativeX * (880 / rect.width);
    const newRho = Math.max(0.0, Math.min(0.95, (svgX - 80) / 720));
    setCurrentRho(Math.round(newRho * 100) / 100);
  };

  return html`
    <${WidgetFrame}
      title="Hockey Stick Latency Curve"
      descriptor="Hover or drag across the graph to inspect any load point">
      <div class="tw-p-3.5">
        <div class="tw-mb-3.5">
          <${RangeSlider}
            id="slider-service-time"
            label="Service Time (S)"
            valueText="${serviceTime} ms"
            min=${2}
            max=${50}
            step=${1}
            value=${serviceTime}
            onChange=${setServiceTime} />
        </div>

        <div
          class="tw-w-full tw-relative tw-cursor-crosshair tw-touch-none"
          onMouseMove=${handlePointerMove}
          onTouchMove=${handlePointerMove}
          onTouchStart=${handlePointerMove}>
          <svg
            ref=${svgRef}
            viewBox="0 0 880 390"
            width="100%"
            style="width: 100%; height: auto; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-dark); border-radius: 8px; padding: 12px 16px; box-sizing: border-box;">
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
            <g style="pointer-events: none;">
              <text x="96" y="58" fill="var(--grey-lighter)" font-size="13" font-weight="700">Load: ρ = ${metrics.rhoPct}% (${zoneDesc})</text>
              <text x="96" y="78" fill="rgb(var(--primary))" font-size="12" font-weight="600">Total Latency (W): ${metrics.totalResponseTimeMs} ms (${metrics.multiplier}×)</text>
              <text x="96" y="96" fill="#ffa726" font-size="12" font-weight="600">Queue Wait (Wq): ${metrics.waitTimeMs} ms</text>
              <text x="96" y="112" fill="var(--grey-light)" font-size="11" font-weight="500">Arrival Rate (λ): ${metrics.lambdaReqSec} req/s</text>
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
            <text x="88" y="278" fill="#81c784" font-size="10.5" font-weight="700">1.0× (${metrics.serviceTimeMs}ms)</text>

            <!-- Landmark 2: 50% -->
            <circle cx="440" cy="263" r="4.5" fill="#ffb74d" stroke="var(--grey-darker)" stroke-width="2" />
            <line x1="440" y1="263" x2="440" y2="310" stroke="#ffb74d" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
            <text x="440" y="248" fill="#ffb74d" font-size="10.5" font-weight="700" text-anchor="middle">2.0× (${metrics.serviceTimeMs * 2}ms)</text>

            <!-- Landmark 3: 75% -->
            <circle cx="620" cy="216" r="4.5" fill="rgb(var(--primary))" stroke="var(--grey-darker)" stroke-width="2" />
            <line x1="620" y1="216" x2="620" y2="310" stroke="rgb(var(--primary))" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
            <text x="605" y="206" fill="rgb(var(--primary))" font-size="10.5" font-weight="700" text-anchor="end">4.0× (${metrics.serviceTimeMs * 4}ms)</text>

            <!-- Landmark 4: 90% -->
            <circle cx="728" cy="74" r="4.5" fill="#ffa726" stroke="var(--grey-darker)" stroke-width="2" />
            <line x1="728" y1="74" x2="728" y2="310" stroke="#ffa726" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
            <text x="716" y="80" fill="#ffa726" font-size="10.5" font-weight="700" text-anchor="end">10.0× (${metrics.serviceTimeMs * 10}ms)</text>

            <!-- Active Dynamic Scrubber Marker -->
            <g style="pointer-events: none;">
              <line x1=${x} y1=${y} x2=${x} y2="310" stroke="var(--grey-lighter)" stroke-width="1.5" stroke-dasharray="2 2" />
              <circle cx=${x} cy=${y} r="10" fill="rgb(var(--primary))" fill-opacity="0.25" />
              <circle cx=${x} cy=${y} r="5.5" fill="var(--grey-lighter)" stroke="rgb(var(--primary))" stroke-width="2.5" />
            </g>
          </svg>
        </div>
      </div>
    <//>
  `;
}

export function initHockeyStickExplorer(containerId = '#hockey-stick-explorer') {
  const container = typeof containerId === 'string' ? document.querySelector(containerId) : containerId;
  if (!container) return;
  container.innerHTML = '';
  render(html`<${HockeyStickExplorer} />`, container);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initHockeyStickExplorer());
  } else {
    initHockeyStickExplorer();
  }
}
