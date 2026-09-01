import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { html, render, useState, useEffect, useRef } from '../ui/preact.js';
import { WidgetFrame } from '../ui/WidgetFrame.js';
import { SegmentedGroup } from '../ui/SegmentedGroup.js';
import { RangeSlider } from '../ui/RangeSlider.js';
import { MetricCard } from '../ui/MetricCard.js';
import { UI } from '../ui/tokens.js';

function renderKaTeX(tex, fallbackHtml) {
  if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(tex, { displayMode: false, throwOnError: false });
    } catch {
      return fallbackHtml || tex;
    }
  }
  return fallbackHtml || tex;
}

const PRESET_OPTIONS = [
  { label: '50% (1.0x)', value: '0.50', rho: 0.5 },
  { label: '75% (3.0x)', value: '0.75', rho: 0.75 },
  { label: '90% (9.0x)', value: '0.90', rho: 0.90 }
];

export function CoinFlipSimulator() {
  const chartRef = useRef(null);

  const [preset, setPreset] = useState('0.50');
  const [rho, setRho] = useState(0.50);
  const [serviceTimeMs, setServiceTimeMs] = useState(10);
  const [simulatedCounts, setSimulatedCounts] = useState({});
  const [totalSimulated, setTotalSimulated] = useState(0);
  const [totalJobsSum, setTotalJobsSum] = useState(0);
  const [logHtml, setLogHtml] = useState(
    'Click <strong>Simulate 1 Arrival</strong> or <strong>Simulate 500 Arrivals</strong> to generate traffic.'
  );

  const getTheoreticalProb = (k, currentRho) => (1 - currentRho) * Math.pow(currentRho, k);

  const simulateOneArrival = (currentRho) => {
    let jobs = 0;
    const flips = [];
    while (true) {
      const roll = Math.random();
      if (roll < currentRho) {
        jobs += 1;
        flips.push({ success: true, roll });
        if (jobs > 50) break;
      } else {
        flips.push({ success: false, roll });
        break;
      }
    }
    return { jobs, flips };
  };

  const handlePresetChange = (newVal) => {
    setPreset(newVal);
    const p = PRESET_OPTIONS.find((opt) => opt.value === newVal);
    if (!p) return;
    setRho(p.rho);
    setServiceTimeMs(10);
    setSimulatedCounts({});
    setTotalSimulated(0);
    setTotalJobsSum(0);
    setLogHtml('Simulator reset. Click <strong>Simulate 1 Arrival</strong> to generate traffic.');
  };

  const handleRhoChange = (val) => {
    setRho(val);
    setPreset('');
    setSimulatedCounts({});
    setTotalSimulated(0);
    setTotalJobsSum(0);
  };

  const handleServiceChange = (val) => {
    setServiceTimeMs(val);
  };

  const handleSingleFlip = () => {
    const { jobs, flips } = simulateOneArrival(rho);
    const newCounts = { ...simulatedCounts, [jobs]: (simulatedCounts[jobs] || 0) + 1 };
    setSimulatedCounts(newCounts);
    setTotalSimulated((prev) => prev + 1);
    setTotalJobsSum((prev) => prev + jobs);

    let htmlLog = '';
    if (jobs === 0) {
      htmlLog = `<span style="background: rgba(129, 199, 132, 0.2); color: #81c784; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Worker Idle (k=0)</span> → <span style="color: var(--grey-lighter);">Executes immediately with <strong>0 ms queue wait</strong></span>`;
    } else {
      htmlLog = `<span style="background: rgba(var(--primary), 0.2); color: rgb(var(--primary)); padding: 2px 6px; border-radius: 4px; font-weight: 700;">Worker Busy</span>`;
      flips.forEach((f, idx) => {
        const rollPct = (f.roll * 100).toFixed(0);
        const targetPct = (rho * 100).toFixed(0);
        if (f.success) {
          htmlLog += ` → <span style="background: rgba(var(--primary), 0.15); color: rgb(var(--primary)); padding: 2px 6px; border-radius: 4px;">🪙 Flip ${idx + 1}: ${rollPct}% < ${targetPct}% (+1 job)</span>`;
        } else {
          htmlLog += ` → <span style="background: rgba(255, 167, 38, 0.2); color: #ffa726; padding: 2px 6px; border-radius: 4px;">🪙 Stop</span>`;
        }
      });
      const waitTime = jobs * serviceTimeMs;
      htmlLog += ` ⇒ <strong style="color: var(--grey-lighter); margin-left: 4px;">k = ${jobs} jobs ahead</strong> (<span style="color: #ffb74d;">${waitTime}ms queue wait</span>)`;
    }
    setLogHtml(htmlLog);
  };

  const handleBatchRun = (count = 500) => {
    const newCounts = { ...simulatedCounts };
    let newJobs = 0;
    for (let i = 0; i < count; i++) {
      const { jobs } = simulateOneArrival(rho);
      newCounts[jobs] = (newCounts[jobs] || 0) + 1;
      newJobs += jobs;
    }
    const newTotal = totalSimulated + count;
    const newSum = totalJobsSum + newJobs;
    setSimulatedCounts(newCounts);
    setTotalSimulated(newTotal);
    setTotalJobsSum(newSum);

    const empMean = (newSum / newTotal).toFixed(2);
    const theoryMean = (rho / (1 - rho)).toFixed(2);
    const empWait = ((newSum / newTotal) * serviceTimeMs).toFixed(1);
    setLogHtml(`
      <span style="color: #81c784; font-weight: 600;">✓ Simulated ${count} arrivals.</span>
      <span style="color: var(--grey-lighter); margin-left: 8px;">Sample mean backlog: <strong>${empMean} jobs</strong> (vs. Theoretical <strong>${theoryMean} jobs</strong>) ⇒ Average wait: <strong>${empWait} ms</strong></span>
    `);
  };

  const handleReset = () => {
    setSimulatedCounts({});
    setTotalSimulated(0);
    setTotalJobsSum(0);
    setLogHtml('Simulator reset. Click <strong>Simulate 1 Arrival</strong> or <strong>Simulate 500 Arrivals</strong> to generate traffic.');
  };

  useEffect(() => {
    const chartEl = chartRef.current;
    if (!chartEl) return;
    d3.select(chartEl).selectAll('*').remove();

    const margin = { top: 15, right: 12, bottom: 30, left: 40 };
    const rect = chartEl.getBoundingClientRect();
    const width = rect.width - margin.left - margin.right;
    const height = rect.height - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    const svg = d3.select(chartEl)
      .append('svg')
      .attr('class', 'tex2jax_ignore')
      .attr('width', '100%')
      .attr('height', '100%');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const xAxisGroup = g.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`);
    const yAxisGroup = g.append('g').attr('class', 'y-axis');
    const barsGroup = g.append('g').attr('class', 'bars');

    const maxK = 7;
    const data = [];
    for (let k = 0; k <= maxK; k++) {
      const theory = getTheoreticalProb(k, rho);
      const obsCount = simulatedCounts[k] || 0;
      const observed = totalSimulated > 0 ? obsCount / totalSimulated : 0;
      data.push({ k, theory, observed });
    }

    const xScale = d3.scaleBand()
      .domain(data.map((d) => `${d.k}`))
      .range([0, width])
      .padding(0.2);

    const maxProb = Math.max(d3.max(data, (d) => Math.max(d.theory, d.observed)) || 0.5, 0.4);
    const yScale = d3.scaleLinear()
      .domain([0, Math.min(1.0, maxProb * 1.15)])
      .range([height, 0]);

    xAxisGroup
      .call(d3.axisBottom(xScale).tickFormat((d) => (d === '0' ? 'k=0' : `k=${d}`)))
      .call((g) => g.selectAll('text').attr('fill', 'var(--grey-light)').attr('font-size', '9px'))
      .call((g) => g.selectAll('line').attr('stroke', 'var(--grey)'))
      .call((g) => g.select('.domain').attr('stroke', 'var(--grey)'));

    yAxisGroup
      .call(d3.axisLeft(yScale).ticks(4).tickFormat(d3.format('.0%')))
      .call((g) => g.selectAll('text').attr('fill', 'var(--grey-light)').attr('font-size', '9px'))
      .call((g) => g.selectAll('line').attr('stroke', 'var(--grey)'))
      .call((g) => g.select('.domain').attr('stroke', 'var(--grey)'));

    const subBandWidth = xScale.bandwidth() / 2;

    const barGroups = barsGroup.selectAll('.bar-group')
      .data(data, (d) => d.k)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(${xScale(`${d.k}`)},0)`);

    barGroups.append('rect')
      .attr('class', 'theory-bar')
      .attr('x', 0)
      .attr('y', (d) => yScale(d.theory))
      .attr('width', subBandWidth - 1)
      .attr('height', (d) => height - yScale(d.theory))
      .attr('fill', 'rgba(var(--primary), 0.35)')
      .attr('stroke', 'rgb(var(--primary))')
      .attr('stroke-width', 1)
      .attr('rx', 2);

    barGroups.append('rect')
      .attr('class', 'observed-bar')
      .attr('x', subBandWidth)
      .attr('y', (d) => yScale(d.observed))
      .attr('width', subBandWidth - 1)
      .attr('height', (d) => height - yScale(d.observed))
      .attr('fill', totalSimulated > 0 ? 'rgba(129, 199, 132, 0.75)' : 'transparent')
      .attr('stroke', totalSimulated > 0 ? '#81c784' : 'transparent')
      .attr('stroke-width', 1)
      .attr('rx', 2);

    barGroups.append('text')
      .attr('class', 'theory-label')
      .attr('x', subBandWidth / 2)
      .attr('y', (d) => Math.max(yScale(d.theory) - 3, 9))
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--grey-lighter)')
      .attr('font-size', '8.5px')
      .text((d) => `${(d.theory * 100).toFixed(0)}%`);
  }, [rho, simulatedCounts, totalSimulated]);

  const lambda = rho / (serviceTimeMs / 1000);
  const theoryBacklog = rho / (1 - rho);
  const theoryWait = (rho * serviceTimeMs) / (1 - rho);
  const totalW = theoryWait + serviceTimeMs;
  const simMean = totalSimulated > 0 ? (totalJobsSum / totalSimulated).toFixed(2) : '—';

  return html`
    <style>
      #coin-flip-simulator .metric-calc { white-space: nowrap !important; line-height: 1.15 !important; }
      #coin-flip-simulator .metric-calc .katex { white-space: nowrap !important; font-size: 0.80em !important; line-height: 1.15 !important; }
      #coin-flip-simulator .metric-header { white-space: nowrap !important; line-height: 1.15 !important; }
      #coin-flip-simulator .metric-header .katex { font-size: 0.92em !important; }
      #coin-flip-simulator .table-footer-math .katex { font-size: 1.08em !important; }
    </style>

    <${WidgetFrame}
      title="Theoretical State Probabilities & Wait Times"
      descriptor="Markov queue state probabilities and weighted wait times">
      <div class="tw-p-3.5">
        <div class="tw-flex tw-items-center tw-gap-3.5 tw-mb-4 tw-flex-wrap">
          <div class="tw-flex-none">
            <${SegmentedGroup}
              options=${PRESET_OPTIONS}
              value=${preset}
              onChange=${handlePresetChange} />
          </div>
          <div class="tw-flex tw-items-center tw-gap-3.5 tw-flex-1 tw-min-w-[340px] tw-flex-wrap max-[640px]:tw-min-w-full">
            <div class="tw-flex-1 tw-min-w-[150px]">
              <${RangeSlider}
                id="sim-rho-slider"
                label="Load (ρ)"
                valueText="${Math.round(rho * 100)}%"
                min=${0.10}
                max=${0.95}
                step=${0.05}
                value=${rho}
                onChange=${handleRhoChange} />
            </div>
            <div class="tw-w-px tw-h-[22px] tw-bg-white/15"></div>
            <div class="tw-flex-1 tw-min-w-[150px]">
              <${RangeSlider}
                id="sim-s-slider"
                label="Service (S)"
                valueText="${serviceTimeMs} ms"
                min=${5}
                max=${100}
                step=${5}
                value=${serviceTimeMs}
                onChange=${handleServiceChange} />
            </div>
          </div>
        </div>

        <div class="tw-overflow-x-auto tw-mb-3">
          <table class="tw-w-full tw-border-collapse tw-text-[0.8rem] tw-text-left">
            <thead>
              <tr class="tw-border-b tw-border-[var(--grey)] tw-text-[var(--grey-light)]">
                <th class="tw-p-1.5 tw-font-semibold">State (k)</th>
                <th class="tw-p-1.5 tw-font-semibold">Wait (k × S)</th>
                <th class="tw-p-1.5 tw-font-semibold">Probability P(N = k)</th>
                <th class="tw-p-1.5 tw-font-semibold tw-text-right">Weighted (Wait × P)</th>
              </tr>
            </thead>
            <tbody>
              ${[0, 1, 2, 3, 4].map((k) => {
                const p = getTheoreticalProb(k, rho);
                const wait = k * serviceTimeMs;
                const weighted = p * wait;
                const rhoStr = rho.toFixed(2);
                const formulaStr = k === 0 ? `(1 − ${rhoStr})` : `(1 − ${rhoStr}) × ${rhoStr}<sup>${k}</sup>`;

                return html`
                  <tr key=${k} class="tw-border-b tw-border-[var(--grey)]">
                    <td class="tw-p-1 tw-text-[var(--grey-lighter)]">
                      ${k === 0
                        ? html`<strong class="tw-text-[#81c784]">k = 0 (Idle)</strong>`
                        : `k = ${k} jobs`}
                    </td>
                    <td class="tw-p-1 tw-text-[var(--grey-light)]">${wait} ms</td>
                    <td class="tw-p-1 tw-text-[var(--grey-light)]">
                      <span class="tw-text-[0.72rem] tw-text-[var(--grey)] tw-mr-1" dangerouslySetInnerHTML=${{ __html: formulaStr + ' =' }} />
                      <span class="tw-text-[var(--grey-lighter)]">${(p * 100).toFixed(1)}%</span>
                    </td>
                    <td class="tw-p-1 tw-text-primary tw-text-right tw-font-semibold">
                      <span class="tw-text-[0.72rem] tw-text-[var(--grey)] tw-font-normal tw-mr-1">${wait} × ${p.toFixed(3)} =</span>
                      ${weighted.toFixed(2)} ms
                    </td>
                  </tr>
                `;
              })}
              <tr class="tw-border-b tw-border-[var(--grey)] tw-text-[var(--grey-light)]">
                <td class="tw-p-1">k ≥ 5 jobs (tail)</td>
                <td class="tw-p-1">50+ ms</td>
                <td class="tw-p-1">
                  <span class="tw-text-[0.72rem] tw-text-[var(--grey)] tw-mr-1">${rho.toFixed(2)}<sup>5</sup> =</span>
                  <span class="tw-text-[var(--grey-lighter)]">${(Math.pow(rho, 5) * 100).toFixed(1)}%</span>
                </td>
                <td class="tw-p-1 tw-text-primary tw-text-right tw-font-semibold">
                  <span class="tw-text-[0.72rem] tw-text-[var(--grey)] tw-font-normal tw-mr-1">tail sum =</span>
                  ${Math.max(0, theoryWait - [0, 1, 2, 3, 4].reduce((acc, k) => acc + getTheoreticalProb(k, rho) * (k * serviceTimeMs), 0)).toFixed(2)} ms
                </td>
              </tr>
              <tr class="tw-font-bold tw-text-[var(--grey-lighter)] tw-bg-white/[0.03]">
                <td class="tw-p-1.5">Total Average</td>
                <td class="tw-p-1.5 tw-text-[var(--grey-light)]">—</td>
                <td class="table-footer-math tw-p-1.5 tw-text-[var(--grey-light)]">
                  <span dangerouslySetInnerHTML=${{ __html: renderKaTeX('\\sum P = 100\\%', 'Σ P = 100%') }} />
                </td>
                <td class="table-footer-math tw-p-1.5 tw-text-primary tw-text-right">
                  <span dangerouslySetInnerHTML=${{ __html: renderKaTeX(`W_q = ${theoryWait.toFixed(1)}\\text{ ms}`, `W_q = ${theoryWait.toFixed(1)} ms`) }} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="tw-grid tw-grid-cols-[repeat(auto-fit,minmax(140px,1fr))] tw-gap-2">
          <${MetricCard}
            label="Arrival Rate (λ)"
            value="${lambda.toFixed(1)} req/s"
            caption="ρ / S" />
          <${MetricCard}
            label="Expected Backlog (L)"
            value="${theoryBacklog.toFixed(2)} jobs"
            caption="ρ / (1 − ρ)"
            valueColor="tw-text-primary" />
          <${MetricCard}
            label="Queue Wait (Wq)"
            value="${theoryWait.toFixed(1)} ms"
            caption="L · S"
            valueColor="tw-text-[#ffb74d]" />
          <${MetricCard}
            label="Total Latency (W)"
            value="${totalW.toFixed(1)} ms"
            caption="Wq + S"
            valueColor="tw-text-[#81c784]" />
        </div>
      </div>
    <//>

    <${WidgetFrame}
      title="Monte Carlo Arrival Simulator"
      descriptor="${totalSimulated} arrivals simulated">
      <div class="tw-p-2.5">
        <div class="tw-flex tw-gap-2 tw-flex-wrap tw-mb-2.5 tw-items-center">
          <button type="button" class=${UI.btn.ctrl} onClick=${handleSingleFlip}>🎲 Simulate 1 Arrival</button>
          <button type="button" class=${UI.btn.ctrl} onClick=${() => handleBatchRun(500)}>⚡ Simulate 500 Arrivals</button>
          <button type="button" class=${UI.btn.ctrl} onClick=${handleReset}>↺ Reset</button>
        </div>

        <div
          class="tw-min-h-[34px] tw-bg-[var(--grey-dark)] tw-rounded-md tw-p-2.5 tw-mb-3.5 tw-text-[0.82rem] tw-text-[var(--grey-light)] tw-flex tw-items-center tw-flex-wrap tw-gap-1.5"
          dangerouslySetInnerHTML=${{ __html: logHtml }} />

        <div class="tw-mb-3">
          <div class="tw-flex tw-justify-between tw-items-center tw-mb-1.5 tw-flex-wrap tw-gap-1.5">
            <span class="tw-text-[0.8rem] tw-text-[var(--grey-light)] tw-font-semibold">
              Distribution <span dangerouslySetInnerHTML=${{ __html: renderKaTeX('P(N = k)', 'P(N = k)') }} />:
            </span>
            <div class="tw-flex tw-gap-3 tw-text-[0.75rem]">
              <span class="tw-flex tw-items-center tw-gap-1 tw-text-primary">
                <span class="tw-inline-block tw-w-2.5 tw-h-2.5 tw-bg-primary/50 tw-border tw-border-primary tw-rounded-[2px]"></span> Theoretical
              </span>
              <span class="tw-flex tw-items-center tw-gap-1 tw-text-[#81c784]">
                <span class="tw-inline-block tw-w-2.5 tw-h-2.5 tw-bg-[#81c784]/70 tw-rounded-[2px]"></span> Simulated
              </span>
            </div>
          </div>
          <div ref=${chartRef} class="tw-w-full tw-h-[200px] tw-relative"></div>
        </div>

        <div class="tw-grid tw-grid-cols-2 tw-gap-2">
          <${MetricCard}
            label="Arrival Load (ρ)"
            value="${(rho * 100).toFixed(1)}%"
            caption="Theoretical" />
          <${MetricCard}
            label="Simulated Mean (L_sim)"
            value="${simMean} jobs"
            caption="${totalSimulated} samples"
            valueColor="tw-text-[#81c784]" />
        </div>
      </div>
    <//>
  `;
}

export function initCoinFlipSimulator(containerId = '#coin-flip-simulator') {
  const container = document.querySelector(containerId);
  if (!container) return;
  render(html`<${CoinFlipSimulator} />`, container);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCoinFlipSimulator());
  } else {
    initCoinFlipSimulator();
  }
}
