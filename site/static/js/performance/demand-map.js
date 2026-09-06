import { html, render, useState } from '../ui/preact.js'
import { WidgetFrame } from '../ui/WidgetFrame.js'
import { RangeSlider } from '../ui/RangeSlider.js'
import { UI } from '../ui/tokens.js'
import { DemandMapEngine, DEFAULT_SUBSYSTEMS } from './demand-map-engine.js'

const COLORS = {
  silicon: 'rgb(var(--primary))',
  kernel: '#fbbf24',
  host: '#34d399',
  runtime: '#ff7043',
  orchestration: '#a78bfa'
}

function formatNumber(value, digits = 1) {
  if (!Number.isFinite(value)) return '∞'
  return Number(value.toFixed(digits)).toString()
}

function DemandChart({ state }) {
  const maxValue = Math.max(1, ...state.subsystems.map((subsystem) => subsystem.normalizedDemandMs))
  const chartWidth = 420
  const barWidth = (value) => (value / maxValue) * chartWidth

  return html`
    <svg viewBox="0 0 620 240" role="img" aria-label="Capacity-adjusted service demand by inference subsystem" class="tw-w-full tw-h-auto tw-rounded-md tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)]">
      <title>Capacity-adjusted demand</title>
      <desc>Each bar shows service demand divided by the subsystem's parallel capacity. The longest bar is the current raw-capacity bottleneck.</desc>
      <text x="28" y="20" fill="var(--grey-lighter)" font-family="var(--family-sans, system-ui, sans-serif)" font-size="15" font-weight="600">Capacity-adjusted demand Dₖ / mₖ</text>
      <text x="28" y="35" fill="var(--grey-light)" font-family="var(--family-serif, system-ui, serif)" font-size="12">Lower demand leaves more room for throughput.</text>
      ${state.subsystems.map((subsystem, index) => {
        const y = 43 + index * 30
        const isBottleneck = subsystem.id === state.bottleneckId
        const color = COLORS[subsystem.id] || 'rgb(var(--primary))'
        return html`
          <g key=${subsystem.id} opacity=${isBottleneck ? 1 : 0.82}>
            <text x="28" y=${y + 14} fill=${isBottleneck ? 'rgb(var(--primary))' : 'var(--grey-lighter)'} font-family="var(--family-sans, system-ui, sans-serif)" font-size="13" font-weight=${isBottleneck ? 700 : 500}>${subsystem.label}</text>
            <rect x="142" y=${y + 3} width=${chartWidth} height="16" rx="4" fill="var(--grey-dark)" />
            <rect x="142" y=${y + 3} width=${barWidth(subsystem.normalizedDemandMs)} height="16" rx="4" fill=${color} style="transition: width 260ms ease, opacity 180ms ease;" />
            <text x=${Math.min(584, 150 + barWidth(subsystem.normalizedDemandMs))} y=${y + 15} fill="var(--grey-lighter)" font-family="var(--family-sans, system-ui, sans-serif)" font-size="12" font-weight="600">${formatNumber(subsystem.normalizedDemandMs)} ms</text>
          </g>
        `
      })}
      <text x="28" y="226" fill="var(--grey-light)" font-family="var(--family-serif, system-ui, serif)" font-size="12">The longest capacity-adjusted bar limits the ideal raw capacity.</text>
    </svg>
  `
}

function SubsystemControls({ state, onChange }) {
  const bottleneck = state.subsystems.find((subsystem) => subsystem.id === state.bottleneckId)

  return html`
    <div class="tw-flex tw-flex-col tw-gap-1 tw-rounded-lg tw-bg-[var(--grey-dark)] tw-px-2.5 tw-py-1">
      <div class="tw-pb-0.5 tw-font-sans tw-text-xs tw-leading-relaxed tw-text-[var(--grey-light)]">Adjust the shared model inputs with the sliders. Demand is Dₖ = VₖSₖ, and the longest capacity-adjusted bar determines the current raw-capacity bottleneck.</div>
      ${state.subsystems.map((subsystem) => {
        const isBottleneck = subsystem.id === state.bottleneckId
        return html`
          <div key=${subsystem.id} class="tw-grid tw-grid-cols-[minmax(145px,0.7fr)_minmax(0,2fr)] tw-items-center tw-gap-3 tw-border-b tw-border-[rgba(255,255,255,0.08)] tw-py-0.5 last:tw-border-b-0 max-[559px]:tw-grid-cols-1 ${isBottleneck ? 'tw-rounded-md tw-bg-primary-soft tw-px-2' : ''}">
            <div class="tw-flex tw-items-baseline tw-justify-between tw-gap-2">
              <span class="tw-font-sans tw-text-xs tw-font-semibold tw-text-[var(--grey-lighter)]">${subsystem.label}</span>
              <span class="tw-whitespace-nowrap tw-font-sans tw-text-xs tw-text-[var(--grey-light)]">Dₖ = ${formatNumber(subsystem.demandMs)} ms</span>
            </div>
            <div class="tw-grid tw-grid-cols-3 tw-gap-3">
              <${RangeSlider} className="demand-map-slider" id=${`${subsystem.id}-visits`} label="Vₖ" valueText=${formatNumber(subsystem.visits)} min="0" max="12" step="0.5" value=${subsystem.visits} onChange=${(value) => onChange(subsystem.id, { visits: value })} />
              <${RangeSlider} className="demand-map-slider" id=${`${subsystem.id}-service`} label="Sₖ (ms)" valueText=${formatNumber(subsystem.serviceMs)} min="0.1" max="20" step="0.1" value=${subsystem.serviceMs} onChange=${(value) => onChange(subsystem.id, { serviceMs: value })} />
              <${RangeSlider} className="demand-map-slider" id=${`${subsystem.id}-capacity`} label="mₖ" valueText=${formatNumber(subsystem.capacity, 0)} min="1" max="8" step="1" value=${subsystem.capacity} onChange=${(value) => onChange(subsystem.id, { capacity: value })} />
            </div>
          </div>
        `
      })}
      <div class="tw-flex tw-flex-wrap tw-items-baseline tw-justify-between tw-gap-2 tw-border-t tw-border-[rgba(255,255,255,0.08)] tw-pt-1.5 tw-font-sans" aria-live="polite">
        <div class="tw-text-sm tw-font-semibold tw-text-primary">Current raw-capacity bottleneck: ${bottleneck?.label || 'none'}</div>
        <div class="tw-text-xs tw-text-[var(--grey-light)]">λₛₐₜ ≈ ${formatNumber(state.saturationRps, 0)} requests/s</div>
      </div>
    </div>
  `
}

function DemandMap() {
  const [engine] = useState(() => new DemandMapEngine(DEFAULT_SUBSYSTEMS))
  const [state, setState] = useState(() => engine.getState())
  const update = (subsystemId, changes) => setState(engine.setSubsystem(subsystemId, changes))
  const improveBottleneck = () => setState(engine.improveSubsystem(state.bottleneckId, 0.1))
  const reset = () => setState(engine.reset())

  return html`
    <${WidgetFrame} title="Demand map: finding the current bottleneck" descriptor="Change visits, service time, or capacity and watch the raw-capacity bottleneck move" className="demand-map-widget">
      <style>
        .demand-map-widget .demand-map-slider { display: grid; grid-template-columns: max-content minmax(0, 1fr); align-items: center; column-gap: 0.15rem; }
        .demand-map-widget .demand-map-slider > div { min-width: 0; justify-content: flex-start; gap: 0.1rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
        .demand-map-widget .demand-map-slider .range-slider-value { display: inline-block; width: 1.35rem; text-align: right; }
        .demand-map-widget .demand-map-slider > input { min-width: 0; height: 16px; }
        .demand-map-widget .demand-map-slider .ux-range::-webkit-slider-runnable-track { height: 5px; }
        .demand-map-widget .demand-map-slider .ux-range::-webkit-slider-thumb { width: 13px; height: 13px; margin-top: -4px; }
        .demand-map-widget .demand-map-slider .ux-range::-moz-range-track, .demand-map-widget .demand-map-slider .ux-range::-moz-range-progress { height: 5px; }
        .demand-map-widget .demand-map-slider .ux-range::-moz-range-thumb { width: 13px; height: 13px; }
      </style>
      <div class="tw-flex tw-flex-col tw-gap-2 tw-p-2 tw-font-serif tw-text-[var(--grey-lighter)]">
        <div class="tw-flex tw-flex-col tw-gap-2">
          <${SubsystemControls} state=${state} onChange=${update} />
          <div class="tw-flex tw-flex-wrap tw-gap-2 tw-pt-1"><button type="button" class=${UI.btn.ctrl} onClick=${improveBottleneck}>Improve bottleneck −10%</button><button type="button" class=${UI.btn.ctrl} onClick=${reset}>Reset</button></div>
        </div>
        <div class="tw-min-w-0"><${DemandChart} state=${state} /></div>
      </div>
    </${WidgetFrame}>
  `
}

const mount = document.getElementById('inference-demand-map')
if (mount) render(html`<${DemandMap} />`, mount)
