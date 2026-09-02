/* ==========================================================================
 * Interactive Scalar Tuner (backed by the deterministic serving simulator)
 *
 * Two-column layout: the left column lists feature levers, each with an icon
 * and a link to the upstream docs. The right column stacks comparison plots
 * vertically (chosen metric vs other metrics, including VRAM), each showing a
 * default (untuned) curve and the tuned curve. Metric cards live at the
 * bottom: name, value, and delta vs the no-lever baseline, with unreported
 * metrics dimmed. All numbers come from simulateServing().
 * ========================================================================== */

import { simulateServing } from './serving-simulator.js';
import { UI } from '../ui/tokens.js';

const CHOICES = {
  tps:  { label: 'Throughput (TPS)',      good: 'higher' },
  ttft: { label: 'Time to First Token',   good: 'lower'  },
  tpot: { label: 'Time per Output Token', good: 'lower'  },
};

// Each choice starts at a baseline where its own metric is poor, so toggling
// levers has somewhere to push it to, at the expense of the other objectives.
const BASELINE = {
  tps:  { concurrency: 16, maxBatch: 64, chunkSize: 0, pdDisaggregation: false, speculativeK: 0, kvCacheGb: 24 },
  ttft: { concurrency: 64, maxBatch: 48, chunkSize: 0, pdDisaggregation: false, speculativeK: 0, kvCacheGb: 24 },
  tpot: { concurrency: 48, maxBatch: 64, chunkSize: 0, pdDisaggregation: false, speculativeK: 0, kvCacheGb: 24 },
};

// Feature levers per choice: a label, a one-line description of the trade-off,
// a config delta applied on top of the baseline when enabled, an icon, and a
// link to the upstream docs for the feature.
export const LEVERS = {
  tps: [
    { icon: '📦', label: 'Max batched tokens', desc: 'More sequences per step. TPS up, TPOT up, VRAM up.', site: 'vLLM docs', cfg: { maxBatch: 128, concurrency: 64 }, link: 'https://docs.vllm.ai/en/latest/configuration/optimization/' },
    { icon: '🔀', label: 'Higher concurrency', desc: 'More in-flight load. TPS up, TTFT up.', site: 'vLLM docs', cfg: { concurrency: 128 }, link: 'https://docs.vllm.ai/en/latest/configuration/optimization/' },
    { icon: '🗃️', label: 'Saturate KV cache', desc: 'Bigger effective batch. TPS up, VRAM up.', site: 'vLLM blog', cfg: { kvCacheGb: 48, concurrency: 64 }, link: 'https://blog.vllm.ai/2023/06/20/vllm.html' },
    { icon: '⚡', label: 'Speculative decoding', desc: 'Draft model proposes tokens. TPS up, quality down.', site: 'vLLM docs', cfg: { speculativeK: 4 }, link: 'https://docs.vllm.ai/en/latest/features/speculative_decoding/' },
  ],
  ttft: [
    { icon: '🚦', label: 'Priority scheduling', desc: 'New requests jump the queue. TTFT down, TPS down.', site: 'vLLM docs', cfg: { priority: true }, link: 'https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/' },
    { icon: '🚌', label: 'Larger batches', desc: 'More batch slots. TTFT down, TPOT and VRAM up.', site: 'Anyscale blog', cfg: { maxBatch: 96 }, link: 'https://www.anyscale.com/blog/continuous-batching-llm-inference' },
    { icon: '🐢', label: 'Lower concurrency', desc: 'Less in-flight load. TTFT down, TPS down.', site: 'vLLM docs', cfg: { concurrency: 32 }, link: 'https://docs.vllm.ai/en/latest/configuration/optimization/' },
    { icon: '🧩', label: 'Disaggregated prefill', desc: 'Separate prefill pool. Low TTFT, nearly double VRAM.', site: 'vLLM docs', cfg: { pdDisaggregation: true }, link: 'https://docs.vllm.ai/en/latest/features/disagg_prefill/' },
  ],
  tpot: [
    { icon: '⚡', label: 'Speculative decoding', desc: 'More tokens per step. TPOT down, TPS up, quality down.', site: 'vLLM docs', cfg: { speculativeK: 4 }, link: 'https://docs.vllm.ai/en/latest/features/speculative_decoding/' },
    { icon: '🧱', label: 'Chunked prefill', desc: 'Stops prefill stalling decode. TPOT tail down, TTFT up.', site: 'vLLM docs', cfg: { chunkSize: 128 }, link: 'https://docs.vllm.ai/en/latest/configuration/optimization/' },
    { icon: '🧩', label: 'Disaggregated prefill', desc: 'Decode runs undisturbed. TPOT down, TTFT and VRAM up.', site: 'vLLM docs', cfg: { pdDisaggregation: true }, link: 'https://docs.vllm.ai/en/latest/features/disagg_prefill/' },
    { icon: '🐢', label: 'Lower concurrency', desc: 'Smaller batch, less attention cost. TPOT down, TPS down.', site: 'vLLM docs', cfg: { concurrency: 8 }, link: 'https://docs.vllm.ai/en/latest/configuration/optimization/' },
  ],
};

// Build the effective simulator config from the baseline plus enabled levers.
export function buildSimConfig(choice, enabledIndices) {
  const cfg = { ...BASELINE[choice] };
  enabledIndices.forEach((idx) => {
    Object.assign(cfg, LEVERS[choice][idx].cfg);
  });
  return cfg;
}

const METRIC_GOOD = { tps: 'higher', ttft: 'lower', tpot: 'lower', vram: 'lower' };
const METRIC_LABEL = { tps: 'Throughput', ttft: 'TTFT', tpot: 'TPOT', vram: 'VRAM' };
const METRIC_UNIT = { tps: 'tok/s', ttft: 'ms', tpot: 'ms', vram: 'GB' };

// Collapse a simulator result into the four reported metrics.
export function simToMetrics(sim) {
  return { tps: sim.tps, ttft: sim.ttftP50, tpot: sim.tpotP50, vram: sim.vramGb };
}

// Delta per metric vs the no-lever baseline (the untuned config).
export function diffsVsBaseline(baseline, current) {
  const out = {};
  Object.keys(METRIC_LABEL).forEach((m) => { out[m] = current[m] - baseline[m]; });
  return out;
}

const TRIALS = 5;

// Sample the engine several times at a config, the way a benchmark would:
// run the workload with different request mixes and report the median of each
// metric. Returns the same shape as simulateServing().
export function sampleSim(cfg, trials = TRIALS) {
  const runs = [];
  for (let i = 0; i < trials; i++) {
    runs.push(simulateServing({ ...cfg, seed: (cfg.seed ?? 7) + i * 1009 }));
  }
  const median = (arr) => [...arr].sort((a, b) => a - b)[Math.floor(arr.length / 2)];
  return {
    tps: median(runs.map((r) => r.tps)),
    ttftP50: median(runs.map((r) => r.ttftP50)),
    ttftP99: median(runs.map((r) => r.ttftP99)),
    tpotP50: median(runs.map((r) => r.tpotP50)),
    tpotP99: median(runs.map((r) => r.tpotP99)),
    quality: median(runs.map((r) => r.quality)),
    vramGb: median(runs.map((r) => r.vramGb)),
    utilization: median(runs.map((r) => r.utilization)),
    batch: median(runs.map((r) => r.batch)),
    queued: median(runs.map((r) => r.queued)),
  };
}

// Comparison plots per choice: chosen metric on Y, an "other" metric on X.
// Each plots a default (untuned) curve and the tuned curve.
const PLOTS = {
  tps:  [
    { x: 'tpot', y: 'tps', xl: 'TPOT (ms)', yl: 'TPS' },
    { x: 'ttft', y: 'tps', xl: 'TTFT (ms)', yl: 'TPS' },
    { x: 'vram', y: 'tps', xl: 'VRAM (GB)', yl: 'TPS' },
  ],
  ttft: [
    { x: 'tps',  y: 'ttft', xl: 'TPS',      yl: 'TTFT (ms)' },
    { x: 'tpot', y: 'ttft', xl: 'TPOT (ms)', yl: 'TTFT (ms)' },
    { x: 'vram', y: 'ttft', xl: 'VRAM (GB)', yl: 'TTFT (ms)' },
  ],
  tpot: [
    { x: 'tps',  y: 'tpot', xl: 'TPS',      yl: 'TPOT (ms)' },
    { x: 'ttft', y: 'tpot', xl: 'TTFT (ms)', yl: 'TPOT (ms)' },
    { x: 'vram', y: 'tpot', xl: 'VRAM (GB)', yl: 'TPOT (ms)' },
  ],
};

function simMetric(sim, metric) {
  return {
    tps: sim.tps,
    ttft: sim.ttftP50,
    tpot: sim.tpotP50,
    vram: sim.vramGb,
  }[metric];
}

function fmt(metric, v) {
  return v.toLocaleString('en-US', { maximumFractionDigits: metric === 'tps' || metric === 'vram' ? 1 : 0 });
}

// Rounded tick label for axis values.
function tickFmt(metric, v) {
  if (metric === 'tps') return Math.round(v).toLocaleString('en-US');
  if (metric === 'vram') return v.toFixed(1);
  return String(Math.round(v));
}

export function initScalarTuner(containerId = '#scalar-tuner') {
  const container = document.querySelector(containerId);
  if (!container) return;

  const SEG_ACTIVE = UI.segmented.itemActive;
  const SEG_INACTIVE = UI.segmented.itemInactive;

  let choice = 'tps';
  const on = {};
  Object.keys(LEVERS).forEach((k) => { on[k] = new Set(); });

  // The no-lever baseline per choice; every diff is measured against it.
  let baselineSim = sampleSim(buildSimConfig(choice, []));
  let baseline = simToMetrics(baselineSim);

  function currentConfig() {
    return buildSimConfig(choice, [...on[choice]]);
  }

  function currentSim() {
    return sampleSim(currentConfig());
  }

  function render() {
    const sim = currentSim();
    const metrics = simToMetrics(sim);
    const header = container.querySelector('.st-title');
    header.textContent = `Tune a single number: ${CHOICES[choice].label}`;

    const readout = container.querySelector('#st-value-readout');
    readout.textContent = `${on[choice].size}/${LEVERS[choice].length} levers`;

    // Metric cards (bottom strip): name, value, and delta vs the baseline.
    // Unreported metrics are dimmed.
    const diffs = diffsVsBaseline(baseline, metrics);
    Object.keys(METRIC_LABEL).forEach((metric) => {
      const card = container.querySelector(`.st-metric[data-metric="${metric}"]`);
      const isPrimary = metric === choice;
      card.classList.toggle('tw-opacity-55', !isPrimary);
      card.classList.toggle('tw-opacity-100', isPrimary);
      card.title = isPrimary ? `${METRIC_LABEL[metric]}: ${METRIC_GOOD[metric]} is better` : '';
      card.querySelector('.st-value').textContent = fmt(metric, metrics[metric]);

      const trendArrow = card.querySelector('.st-trend-arrow');
      const trendText = card.querySelector('.st-trend-text');

      const delta = diffs[metric];
      const dir = delta > 0 ? '▲' : delta < 0 ? '▼' : '';
      const sign = delta > 0 ? '+' : delta < 0 ? '−' : '';
      const improved = METRIC_GOOD[metric] === 'higher' ? delta > 0 : delta < 0;
      const colorClass = delta === 0 ? 'tw-text-[var(--grey-light)]' : improved ? 'tw-text-[#22c55e]' : 'tw-text-[#ef4444]';
      trendArrow.textContent = dir;
      trendArrow.className = `st-trend-arrow ${colorClass}`;
      trendText.textContent = delta === 0 ? '0' : `${sign}${fmt(metric, Math.abs(delta))} ${METRIC_UNIT[metric]}`;
      trendText.className = `st-trend-text ${colorClass}`;
    });

    // Sweep load once per config and reuse the data for every plot.
    const sweep = (cfg) => {
      const pts = [];
      for (let con = 4; con <= 192; con += 4) {
        pts.push(sampleSim({ ...cfg, concurrency: con }));
      }
      return pts;
    };
    const defaultPts = sweep(BASELINE[choice]);
    const tunedPts = sweep(currentConfig());

    const plotsWrap = container.querySelector('#st-plots');
    plotsWrap.innerHTML = PLOTS[choice].map((p) => {
      const svg = buildPlot(p, defaultPts, tunedPts, sim, baselineSim);
      return `<div class="st-plot-cell tw-bg-[var(--grey-dark)] tw-rounded-[8px] tw-p-1.5">
        <div class="tw-text-[0.72rem] tw-leading-snug tw-text-[var(--grey-light)] tw-mb-0.5">${p.yl} vs ${p.xl}</div>
        ${svg}
      </div>`;
    }).join('');
  }

  // Build one comparison plot as an inline SVG string. Two curves: default
  // (grey) and tuned (primary). A ring marks the no-lever operating point on
  // the default curve, and a dot marks the current operating point on the
  // tuned curve. Axes carry labels and tick values.
  function buildPlot(p, defaultPts, tunedPts, current, baseline) {
    const W = 420, H = 100, L = 46, B = 22, T = 8, R = 12;
    const all = [...defaultPts, ...tunedPts];
    const xVals = all.map((s) => simMetric(s, p.x));
    const yVals = all.map((s) => simMetric(s, p.y));
    let xMin = Math.min(...xVals), xMax = Math.max(...xVals);
    let yMin = Math.min(...yVals), yMax = Math.max(...yVals);
    if (xMax === xMin) xMax = xMin + 1;
    if (yMax === yMin) yMax = yMin + 1;
    const padX = (xMax - xMin) * 0.08, padY = (yMax - yMin) * 0.08;
    xMin -= padX; xMax += padX; yMin -= padY; yMax += padY;
    // Metrics are never negative; keep the padded range inside [0, ...].
    xMin = Math.max(0, xMin); yMin = Math.max(0, yMin);

    const sx = (v) => L + ((v - xMin) / (xMax - xMin)) * (W - L - R);
    const sy = (v) => T + (1 - (v - yMin) / (yMax - yMin)) * (H - T - B);

    const curve = (pts, color, width) => {
      let d = '';
      pts.forEach((s, i) => {
        d += `${i === 0 ? 'M' : 'L'} ${sx(simMetric(s, p.x)).toFixed(1)} ${sy(simMetric(s, p.y)).toFixed(1)} `;
      });
      return `<path d="${d.trim()}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
    };

    const cx = sx(simMetric(current, p.x)).toFixed(1);
    const cy = sy(simMetric(current, p.y)).toFixed(1);
    const bx = sx(simMetric(baseline, p.x)).toFixed(1);
    const by = sy(simMetric(baseline, p.y)).toFixed(1);

    // Axis ticks (3 labels per axis)
    const xTicks = [0, 0.5, 1].map((f) => {
      const v = xMin + (xMax - xMin) * f;
      return `<text x="${sx(v).toFixed(1)}" y="${H - B + 14}" text-anchor="middle" font-size="9" fill="var(--grey-light)">${tickFmt(p.x, v)}</text>`;
    }).join('');
    const yTicks = [0, 0.5, 1].map((f) => {
      const v = yMin + (yMax - yMin) * f;
      return `<text x="${L - 6}" y="${(sy(v) + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="var(--grey-light)">${tickFmt(p.y, v)}</text>`;
    }).join('');

    return `<svg viewBox="0 0 ${W} ${H}" class="tw-w-full tw-h-auto tw-font-serif">
      <line x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2"/>
      <line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2"/>
      ${xTicks}
      ${yTicks}
      <text x="${W - R}" y="${H - B - 5}" text-anchor="end" font-size="10" fill="var(--grey-light)">${p.xl}</text>
      <text x="${L + 8}" y="${T + 2}" transform="rotate(-90 ${L + 8} ${T + 2})" text-anchor="end" font-size="10" fill="var(--grey-light)">${p.yl}</text>
      ${curve(defaultPts, 'var(--grey)', 1.5)}
      ${curve(tunedPts, 'rgb(var(--primary))', 2)}
      <circle cx="${bx}" cy="${by}" r="5" fill="var(--grey-darker)" stroke="var(--grey-lighter)" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy}" r="4.5" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2"/>
    </svg>`;
  }

  container.innerHTML = `
    <div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden">
      <header class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
        <div class="st-title tw-font-sans tw-text-sm tw-font-semibold tw-text-primary">Tune a single number</div>
        <div class="tw-font-serif tw-text-sm tw-text-[var(--grey-light)]">run the simulated engine, toggle levers, compare the trade-offs</div>
      </header>

      <div class="tw-p-2.5 tw-font-serif tw-text-[var(--grey-lighter)]">
        <div class="${UI.segmented.group} tw-inline-flex tw-mb-2.5" role="radiogroup" aria-label="Metric to tune">
          ${Object.entries(CHOICES).map(([key, cfg]) => `
            <button type="button" class="st-choice ${key === 'tps' ? SEG_ACTIVE : SEG_INACTIVE}" data-choice="${key}" role="radio" aria-checked="${key === 'tps'}">${cfg.label}</button>
          `).join('')}
        </div>

        <div class="tw-flex tw-gap-2.5 tw-flex-wrap tw-items-start max-[860px]:tw-flex-col">
          <div class="tw-flex-none tw-w-[260px] tw-min-w-[200px] max-[860px]:tw-w-full max-[860px]:tw-min-w-0">
            <div class="tw-flex tw-justify-between tw-items-center tw-mb-2 tw-h-6">
              <span class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-light)]">Feature levers</span>
              <strong id="st-value-readout" class="tw-font-bold tw-text-[0.75rem] tw-text-[var(--grey-lighter)]"></strong>
            </div>
            <div id="st-features" class="tw-flex tw-flex-col tw-gap-1.5"></div>
          </div>
          <div class="tw-hidden md:tw-block tw-w-px tw-self-stretch tw-bg-[var(--ring-border)]"></div>
          <div class="tw-flex-1 tw-min-w-[320px] max-[860px]:tw-w-full max-[860px]:tw-min-w-0">
            <div class="tw-mb-2 tw-h-6 tw-flex tw-items-center tw-justify-start tw-gap-x-3 tw-gap-y-1 tw-flex-wrap tw-text-[0.75rem] tw-leading-snug tw-text-[var(--grey-light)]">
              <span class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-text-[var(--grey-light)] tw-mr-2">Legend</span>
              <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-4 tw-h-0.5 tw-rounded-full tw-bg-[var(--grey)]"></span> untuned</span>
              <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-4 tw-h-0.5 tw-rounded-full tw-bg-primary"></span> tuned</span>
              <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-border tw-border-[var(--grey-lighter)]"></span> no-lever point</span>
              <span class="tw-inline-flex tw-items-center tw-gap-1"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-border-2 tw-border-primary tw-bg-[var(--grey-darker)]"></span> current</span>
            </div>
            <div id="st-plots" class="tw-flex tw-flex-col tw-gap-2"></div>
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-mt-2 tw-text-[0.68rem] tw-leading-snug tw-text-[var(--grey-light)]">▲ up · ▼ down · green = better · red = worse · deltas vs the no-lever baseline</div>

        <div class="tw-grid tw-grid-cols-[repeat(auto-fit,minmax(120px,1fr))] tw-gap-2 tw-mt-2">
          ${Object.keys(METRIC_LABEL).map((metric) => `
            <div class="st-metric tw-flex tw-flex-col tw-items-center tw-text-center tw-bg-[var(--grey-dark)] tw-rounded-[8px] tw-p-1.5" data-metric="${metric}">
              <span class="tw-font-sans tw-text-[0.625rem] tw-leading-snug tw-text-[var(--grey-light)] tw-tracking-[0.4px]">${METRIC_LABEL[metric]}</span>
              <span class="st-value tw-text-[0.98rem] tw-leading-snug tw-font-bold tw-text-[var(--grey-lighter)] tw-my-0.5"></span>
              <span class="st-trend tw-flex tw-items-center tw-gap-0.5 tw-text-[0.68rem] tw-leading-snug tw-whitespace-nowrap">
                <span class="st-trend-arrow"></span>
                <span class="st-trend-text"></span>
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  function renderFeatures() {
    const wrap = container.querySelector('#st-features');
    wrap.innerHTML = LEVERS[choice].map((lever, idx) => {
      const active = on[choice].has(idx);
      return `<div class="st-lever tw-flex tw-items-start tw-gap-2 ${active ? 'tw-bg-primary-soft' : 'tw-bg-[var(--grey-dark)]'} tw-border tw-border-[var(--ring-border)] tw-rounded-[6px] tw-p-2 tw-cursor-pointer tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-bg-primary-soft hover:tw-shadow-raised" data-idx="${idx}">
        <button type="button" class="st-toggle tw-flex-1 tw-min-w-0 tw-bg-transparent tw-border-none tw-p-0 tw-m-0 tw-text-left tw-text-inherit tw-font-inherit tw-cursor-pointer" data-idx="${idx}">
          <span class="tw-flex tw-items-center tw-gap-1.5 tw-font-sans tw-text-[0.75rem] tw-leading-snug tw-font-semibold ${active ? 'tw-text-primary' : 'tw-text-[var(--grey-lighter)]'}">
            <span class="tw-text-[0.95rem] tw-leading-none">${lever.icon}</span>
            <span>${active ? '✓ ' : ''}${lever.label}</span>
          </span>
          <span class="tw-block tw-mt-1 tw-text-[0.7rem] tw-leading-snug tw-text-[var(--grey-light)]">${lever.desc} (<a href="${lever.link}" target="_blank" rel="noopener" title="${lever.label}: ${lever.site}" class="tw-text-[var(--grey-light)]">${lever.site}</a>)</span>
        </button>
      </div>`;
    }).join('');
    wrap.querySelectorAll('.st-toggle').forEach((btn) => {
      btn.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', (e) => e.stopPropagation());
      });
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.idx);
        if (on[choice].has(idx)) on[choice].delete(idx);
        else on[choice].add(idx);
        renderFeatures();
        render();
      });
    });
  }

  container.querySelectorAll('.st-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      choice = btn.dataset.choice;
      baselineSim = sampleSim(buildSimConfig(choice, []));
      baseline = simToMetrics(baselineSim);
      container.querySelectorAll('.st-choice').forEach((b) => {
        b.className = `st-choice ${b === btn ? SEG_ACTIVE : SEG_INACTIVE}`;
        b.setAttribute('aria-checked', String(b === btn));
      });
      renderFeatures();
      render();
    });
  });

  container.querySelectorAll('.st-choice')[0].className = `st-choice ${SEG_ACTIVE}`;
  renderFeatures();
  render();
}

// Auto-initialize when loaded as an ES module
if (typeof window !== 'undefined') {
  initScalarTuner();
}
