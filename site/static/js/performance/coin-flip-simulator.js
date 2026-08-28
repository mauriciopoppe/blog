import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

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

export function initCoinFlipSimulator(containerId = '#coin-flip-simulator') {
  const container = document.querySelector(containerId);
  if (!container) return;

  container.innerHTML = `
    <style>
      #coin-flip-simulator .metric-calc {
        white-space: nowrap !important;
        line-height: 1.15 !important;
      }
      #coin-flip-simulator .metric-calc .katex {
        white-space: nowrap !important;
        font-size: 0.80em !important;
        line-height: 1.15 !important;
      }
      #coin-flip-simulator .metric-header {
        white-space: nowrap !important;
        line-height: 1.15 !important;
      }
      #coin-flip-simulator .metric-header .katex {
        font-size: 0.92em !important;
      }
      #coin-flip-simulator .table-footer-math .katex {
        font-size: 1.08em !important;
      }
    </style>
    <div style="background: var(--grey-darker); border: 1px solid var(--grey-dark); border-radius: 12px; padding: 18px; font-family: var(--family-sans, system-ui, sans-serif); margin: 1.5rem 0;">
      <!-- Title & Header -->
      <div style="margin-bottom: 16px;">
        <h4 style="margin: 0; font-size: 1.15rem; color: var(--grey-lighter);">Interactive Arrival & Queue Depth Simulator</h4>
        <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: var(--grey-light);">
          Each request finds <strong style="color: var(--grey-lighter);">${renderKaTeX('k', '<i>k</i>')}</strong> existing jobs ahead with probability <strong style="color: rgb(var(--primary));">${renderKaTeX('P(N = k) = (1 - \\rho)\\rho^k', '<i>P</i>(<i>N</i> = <i>k</i>) = (1 − <i>ρ</i>)<i>ρ</i><sup><i>k</i></sup>')}</strong>.
        </p>
      </div>

      <!-- PANEL 1: Theoretical Model & State Table -->
      <div style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 10px;">
          <div style="font-size: 0.88rem; font-weight: 700; color: var(--grey-lighter); display: flex; align-items: center; gap: 6px;">
            <span>1. Theoretical State Probabilities & Wait Times</span>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="preset-btn" data-rho="0.5" style="background: var(--grey-darker); color: var(--grey-lighter); border: 1px solid var(--grey); border-radius: 6px; padding: 3px 8px; font-size: 0.78rem; cursor: pointer;">50% (1.0x)</button>
            <button class="preset-btn" data-rho="0.75" style="background: var(--grey-darker); color: var(--grey-lighter); border: 1px solid var(--grey); border-radius: 6px; padding: 3px 8px; font-size: 0.78rem; cursor: pointer;">75% (3.0x)</button>
            <button class="preset-btn" data-rho="0.90" style="background: var(--grey-darker); color: var(--grey-lighter); border: 1px solid var(--grey); border-radius: 6px; padding: 3px 8px; font-size: 0.78rem; cursor: pointer;">90% (9.0x)</button>
          </div>
        </div>

        <!-- Unified 1-Line Slider Control Strip (Utilization ρ and Service Time S) -->
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px; background: var(--grey-darker); padding: 8px 12px; border-radius: 8px; flex-wrap: wrap;">
          <!-- Utilization Slider -->
          <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 190px;">
            <span style="font-size: 0.82rem; color: var(--grey-light); white-space: nowrap;">
              Load (${renderKaTeX('\\rho', '<i>ρ</i>')}): <strong id="sim-rho-val" style="color: var(--grey-lighter); font-variant-numeric: tabular-nums; display: inline-block; width: 34px; text-align: right;">50%</strong>
            </span>
            <input type="range" id="sim-rho-slider" min="0.10" max="0.95" step="0.05" value="0.50" style="flex: 1; min-width: 70px; accent-color: rgb(var(--primary));">
          </div>

          <!-- Subtle Vertical Separator -->
          <div style="width: 1px; height: 18px; background: rgba(255, 255, 255, 0.12);"></div>

          <!-- Service Time S Slider -->
          <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 190px;">
            <span style="font-size: 0.82rem; color: var(--grey-light); white-space: nowrap;">
              Service (${renderKaTeX('S', '<i>S</i>')}): <strong id="sim-s-val" style="color: var(--grey-lighter); font-variant-numeric: tabular-nums; display: inline-block; width: 48px; text-align: right;">10 ms</strong>
            </span>
            <input type="range" id="sim-s-slider" min="5" max="100" step="5" value="10" style="flex: 1; min-width: 70px; accent-color: #ffb74d;">
          </div>
        </div>

        <!-- Dynamic State Table -->
        <div style="overflow-x: auto; margin-bottom: 12px;">
          <table id="dynamic-state-table" style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid var(--grey); color: var(--grey-light);">
                <th style="padding: 6px 8px; font-weight: 600;">State (${renderKaTeX('k', '<i>k</i>')})</th>
                <th style="padding: 6px 8px; font-weight: 600;">Wait (${renderKaTeX('k \\times S', '<i>k</i> × <i>S</i>')})</th>
                <th style="padding: 6px 8px; font-weight: 600;">Probability ${renderKaTeX('P(N = k)', '<i>P</i>(<i>N</i> = <i>k</i>)')}</th>
                <th style="padding: 6px 8px; font-weight: 600; text-align: right;">Weighted (${renderKaTeX('\\text{Wait} \\times P', 'Wait × <i>P</i>')})</th>
              </tr>
            </thead>
            <tbody id="table-body">
              <!-- Dynamically rendered rows -->
            </tbody>
          </table>
        </div>

        <!-- Panel 1 Theoretical Metrics (λ, L, Wq, W) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 10px;">
          <div style="background: var(--grey-darker); padding: 8px 10px; border-radius: 8px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="metric-header" style="font-size: 0.75rem; font-weight: 600; color: var(--grey-light); letter-spacing: 0.01em;">Arrival Rate (${renderKaTeX('\\lambda', '<i>\\lambda</i>')})</div>
              <div id="metric-lambda-calc" class="metric-calc" style="font-size: 0.82rem; color: var(--grey-lighter); margin: 4px 0 1px 0; min-height: 32px; display: flex; align-items: center; justify-content: center;"></div>
            </div>
            <div id="metric-lambda" style="font-size: 1.15rem; font-weight: 700; color: var(--grey-lighter); margin-top: 2px;">50.0 req/s</div>
          </div>
          <div style="background: var(--grey-darker); padding: 8px 10px; border-radius: 8px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="metric-header" style="font-size: 0.75rem; font-weight: 600; color: var(--grey-light); letter-spacing: 0.01em;">Expected Backlog (${renderKaTeX('L', '<i>L</i>')})</div>
              <div id="metric-theory-calc" class="metric-calc" style="font-size: 0.82rem; color: var(--grey-lighter); margin: 4px 0 1px 0; min-height: 32px; display: flex; align-items: center; justify-content: center;"></div>
            </div>
            <div id="metric-theory" style="font-size: 1.15rem; font-weight: 700; color: rgb(var(--primary)); margin-top: 2px;">1.00 jobs</div>
          </div>
          <div style="background: var(--grey-darker); padding: 8px 10px; border-radius: 8px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="metric-header" style="font-size: 0.75rem; font-weight: 600; color: var(--grey-light); letter-spacing: 0.01em;">Queue Wait (${renderKaTeX('W_q', '<i>W</i><sub>q</sub>')})</div>
              <div class="metric-calc" style="font-size: 0.82rem; color: var(--grey-lighter); margin: 4px 0 1px 0; min-height: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; line-height: 1.15;">
                <div style="line-height: 1.15;">${renderKaTeX('W_q = L \\cdot S', '<i>W</i><sub>q</sub> = <i>L</i> · <i>S</i>')}</div>
                <div id="metric-wait-calc" style="color: rgba(255, 255, 255, 0.75); font-size: 0.78rem; line-height: 1.15;"></div>
              </div>
            </div>
            <div id="metric-wait" style="font-size: 1.15rem; font-weight: 700; color: #ffb74d; margin-top: 2px;">10.0 ms</div>
          </div>
          <div style="background: var(--grey-darker); padding: 8px 10px; border-radius: 8px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="metric-header" style="font-size: 0.75rem; font-weight: 600; color: var(--grey-light); letter-spacing: 0.01em;">Total Latency (${renderKaTeX('W', '<i>W</i>')})</div>
              <div class="metric-calc" style="font-size: 0.82rem; color: var(--grey-lighter); margin: 4px 0 1px 0; min-height: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; line-height: 1.15;">
                <div style="line-height: 1.15;">${renderKaTeX('W = W_q + S', '<i>W</i> = <i>W</i><sub>q</sub> + <i>S</i>')}</div>
                <div id="metric-total-w-calc" style="color: rgba(255, 255, 255, 0.75); font-size: 0.78rem; line-height: 1.15;"></div>
              </div>
            </div>
            <div id="metric-total-w" style="font-size: 1.15rem; font-weight: 700; color: #81c784; margin-top: 2px;">20.0 ms</div>
          </div>
        </div>
      </div>

      <!-- PANEL 2: Empirical Simulator & Distribution -->
      <div style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 14px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 10px;">
          <div style="font-size: 0.88rem; font-weight: 700; color: var(--grey-lighter);">
            2. Monte Carlo Arrival Simulator
          </div>
          <span id="sim-count" style="font-size: 0.78rem; color: var(--grey-light);">0 arrivals simulated</span>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; align-items: center;">
          <button id="btn-flip-one" style="background: rgb(var(--primary)); color: #fff; border: none; border-radius: 6px; padding: 6px 12px; font-size: 0.82rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            🎲 Simulate 1 Arrival
          </button>
          <button id="btn-run-batch" style="background: var(--grey-darker); color: var(--grey-lighter); border: 1px solid var(--grey); border-radius: 6px; padding: 6px 12px; font-size: 0.82rem; font-weight: 600; cursor: pointer;">
            ⚡ Simulate 500 Arrivals
          </button>
          <button id="btn-reset" style="background: transparent; color: var(--grey-light); border: 1px solid var(--grey-darker); border-radius: 6px; padding: 6px 10px; font-size: 0.82rem; cursor: pointer;">
            ↺ Reset
          </button>
        </div>

        <!-- Live Step-by-Step Coin Flip Log -->
        <div id="flip-step-log" style="min-height: 34px; background: var(--grey-darker); border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; font-size: 0.82rem; color: var(--grey-light); display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
          <span style="color: var(--grey-lighter);">Click <strong>Simulate 1 Arrival</strong> to watch coin flips determine queue state.</span>
        </div>

        <!-- Distribution Chart -->
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
            <span style="font-size: 0.8rem; color: var(--grey-light); font-weight: 600;">Distribution ${renderKaTeX('P(N = k)', '<i>P</i>(<i>N</i> = <i>k</i>)')}:</span>
            <div style="display: flex; gap: 12px; font-size: 0.75rem;">
              <span style="display: flex; align-items: center; gap: 4px; color: rgb(var(--primary));"><span style="display: inline-block; width: 9px; height: 9px; background: rgba(var(--primary), 0.5); border: 1px solid rgb(var(--primary)); border-radius: 2px;"></span> Theoretical</span>
              <span style="display: flex; align-items: center; gap: 4px; color: #81c784;"><span style="display: inline-block; width: 9px; height: 9px; background: rgba(129, 199, 132, 0.7); border-radius: 2px;"></span> Simulated</span>
            </div>
          </div>
          <div id="coin-dist-chart" style="width: 100%; height: 200px; position: relative;"></div>
        </div>

        <!-- Panel 2 Empirical Metrics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 10px;">
          <div style="background: var(--grey-darker); padding: 8px 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 0.76rem; font-weight: 600; color: var(--grey-light); letter-spacing: 0.02em;">Arrival Load (${renderKaTeX('\\rho', '<i>ρ</i>')})</div>
            <div id="metric-rho" style="font-size: 1.15rem; font-weight: 700; color: var(--grey-lighter); margin-top: 2px;">50.0%</div>
          </div>
          <div style="background: var(--grey-darker); padding: 8px 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 0.76rem; font-weight: 600; color: var(--grey-light); letter-spacing: 0.02em;">Simulated Mean (${renderKaTeX('L_{\\text{sim}}', '<i>L</i><sub>sim</sub>')})</div>
            <div id="metric-sim-mean" style="font-size: 1.15rem; font-weight: 700; color: #81c784; margin-top: 2px;">—</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const rhoSlider = container.querySelector('#sim-rho-slider');
  const rhoVal = container.querySelector('#sim-rho-val');
  const sSlider = container.querySelector('#sim-s-slider');
  const sVal = container.querySelector('#sim-s-val');
  const metricLambda = container.querySelector('#metric-lambda');
  const metricLambdaCalc = container.querySelector('#metric-lambda-calc');
  const metricTotalW = container.querySelector('#metric-total-w');
  const metricTotalWCalc = container.querySelector('#metric-total-w-calc');
  const metricRho = container.querySelector('#metric-rho');
  const metricTheory = container.querySelector('#metric-theory');
  const metricTheoryCalc = container.querySelector('#metric-theory-calc');
  const metricSimMean = container.querySelector('#metric-sim-mean');
  const metricWait = container.querySelector('#metric-wait');
  const metricWaitCalc = container.querySelector('#metric-wait-calc');
  const btnFlipOne = container.querySelector('#btn-flip-one');
  const btnRunBatch = container.querySelector('#btn-run-batch');
  const btnReset = container.querySelector('#btn-reset');
  const simCountEl = container.querySelector('#sim-count');
  const flipStepLog = container.querySelector('#flip-step-log');
  const tableBody = container.querySelector('#table-body');
  const chartEl = container.querySelector('#coin-dist-chart');
  const presetBtns = container.querySelectorAll('.preset-btn');

  let rho = 0.50;
  let serviceTimeMs = 10;
  let simulatedCounts = {};
  let totalSimulated = 0;
  let totalJobsSum = 0;

  const margin = { top: 15, right: 12, bottom: 30, left: 40 };
  const svg = d3.select(chartEl)
    .append('svg')
    .attr('class', 'tex2jax_ignore')
    .attr('width', '100%')
    .attr('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  const xAxisGroup = g.append('g').attr('class', 'x-axis');
  const yAxisGroup = g.append('g').attr('class', 'y-axis');
  const barsGroup = g.append('g').attr('class', 'bars');

  function getTheoreticalProb(k, currentRho) {
    return (1 - currentRho) * Math.pow(currentRho, k);
  }

  function simulateOneArrival(currentRho) {
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
  }

  function renderTable() {
    let rowsHtml = '';
    const maxTableRow = 4;
    let accumulatedProb = 0;
    let accumulatedWait = 0;

    const oneMinusRhoStr = (1 - rho).toFixed(2);
    const rhoStr = rho.toFixed(2);

    for (let k = 0; k <= maxTableRow; k++) {
      const p = getTheoreticalProb(k, rho);
      accumulatedProb += p;
      const wait = k * serviceTimeMs;
      const weighted = p * wait;
      accumulatedWait += weighted;

      const stateLabel = k === 0 
        ? '<strong style="color: #81c784;">k = 0 (Idle)</strong>' 
        : `k = ${k} jobs`;
      const pPct = (p * 100).toFixed(1) + '%';
      const waitStr = `${wait} ms`;
      const weightedStr = `${weighted.toFixed(2)} ms`;

      const formulaStr = k === 0 
        ? `(1 − ${rhoStr})` 
        : `(1 − ${rhoStr}) × ${rhoStr}<sup>${k}</sup>`;

      rowsHtml += `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
          <td style="padding: 4px 6px; color: var(--grey-lighter);">${stateLabel}</td>
          <td style="padding: 4px 6px; color: var(--grey-light);">${waitStr}</td>
          <td style="padding: 4px 6px; color: var(--grey-light);">
            <span style="font-size: 0.72rem; color: var(--grey); margin-right: 4px;">${formulaStr} =</span>
            <span style="color: var(--grey-lighter);">${pPct}</span>
          </td>
          <td style="padding: 4px 6px; color: rgb(var(--primary)); text-align: right; font-weight: 600;">
            <span style="font-size: 0.72rem; color: var(--grey); font-weight: 400; margin-right: 4px;">${wait} × ${(p).toFixed(3)} =</span>
            ${weightedStr}
          </td>
        </tr>
      `;
    }

    // Tail row (k >= 5)
    const tailProb = Math.pow(rho, maxTableRow + 1);
    const theoryTotalWait = (rho * serviceTimeMs) / (1 - rho);
    const tailWeighted = Math.max(0, theoryTotalWait - accumulatedWait);

    rowsHtml += `
      <tr style="border-bottom: 1px solid var(--grey); color: var(--grey-light);">
        <td style="padding: 4px 6px;">k ≥ 5 jobs (tail)</td>
        <td style="padding: 4px 6px;">50+ ms</td>
        <td style="padding: 4px 6px;">
          <span style="font-size: 0.72rem; color: var(--grey); margin-right: 4px;">${rhoStr}<sup>5</sup> =</span>
          <span style="color: var(--grey-lighter);">${(tailProb * 100).toFixed(1)}%</span>
        </td>
        <td style="padding: 4px 6px; color: rgb(var(--primary)); text-align: right; font-weight: 600;">
          <span style="font-size: 0.72rem; color: var(--grey); font-weight: 400; margin-right: 4px;">tail sum =</span>
          ${tailWeighted.toFixed(2)} ms
        </td>
      </tr>
      <tr style="font-weight: 700; color: var(--grey-lighter); background: rgba(255, 255, 255, 0.03);">
        <td style="padding: 6px 6px;">Total Average</td>
        <td style="padding: 6px 6px; color: var(--grey-light);">—</td>
        <td class="table-footer-math" style="padding: 6px 6px; color: var(--grey-light); font-size: 0.90rem;">${renderKaTeX('\\sum P = 100\\%', 'Σ P = 100%')}</td>
        <td class="table-footer-math" style="padding: 6px 6px; color: rgb(var(--primary)); text-align: right; font-weight: 700; font-size: 0.95rem;">${renderKaTeX(`W_q = ${theoryTotalWait.toFixed(1)}\\text{ ms}`, `<i>W</i><sub>q</sub> = ${theoryTotalWait.toFixed(1)} ms`)}</td>
      </tr>
    `;

    tableBody.innerHTML = rowsHtml;
  }

  function updateMetrics() {
    rhoVal.textContent = `${Math.round(rho * 100)}%`;
    sVal.textContent = `${serviceTimeMs} ms`;
    metricRho.textContent = `${(rho * 100).toFixed(1)}%`;
    const lambda = rho / (serviceTimeMs / 1000);
    const theoryBacklog = rho / (1 - rho);
    const theoryWait = (rho * serviceTimeMs) / (1 - rho);
    const totalW = theoryWait + serviceTimeMs;

    metricLambda.textContent = `${lambda.toFixed(1)} req/s`;
    metricLambdaCalc.innerHTML = renderKaTeX(`\\lambda = \\frac{\\rho}{S} = \\frac{${rho.toFixed(2)}}{${(serviceTimeMs / 1000).toFixed(3)}\\text{s}}`, `<i>λ</i> = <i>ρ</i> / <i>S</i> = ${rho.toFixed(2)} / ${(serviceTimeMs / 1000).toFixed(3)}s`);

    metricTheory.textContent = `${theoryBacklog.toFixed(2)} jobs`;
    metricTheoryCalc.innerHTML = renderKaTeX(`L = \\frac{\\rho}{1 - \\rho} = \\frac{${rho.toFixed(2)}}{${(1 - rho).toFixed(2)}}`, `<i>L</i> = <i>ρ</i> / (1 − <i>ρ</i>) = ${rho.toFixed(2)} / ${(1 - rho).toFixed(2)}`);

    metricWait.textContent = `${theoryWait.toFixed(1)} ms`;
    metricWaitCalc.innerHTML = renderKaTeX(`${theoryBacklog.toFixed(2)} \\times ${serviceTimeMs}\\text{ms}`, `${theoryBacklog.toFixed(2)} × ${serviceTimeMs}ms`);

    metricTotalW.textContent = `${totalW.toFixed(1)} ms`;
    metricTotalWCalc.innerHTML = renderKaTeX(`${theoryWait.toFixed(1)}\\text{ms} + ${serviceTimeMs}\\text{ms}`, `${theoryWait.toFixed(1)}ms + ${serviceTimeMs}ms`);

    if (totalSimulated > 0) {
      const empMean = totalJobsSum / totalSimulated;
      metricSimMean.textContent = `${empMean.toFixed(2)} jobs`;
      simCountEl.textContent = `${totalSimulated.toLocaleString()} arrivals simulated`;
    } else {
      metricSimMean.textContent = '—';
      simCountEl.textContent = '0 arrivals simulated';
    }

    renderTable();
  }

  function renderChart() {
    const rect = chartEl.getBoundingClientRect();
    const width = (rect.width > 0 ? rect.width : 280) - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    let maxK = 5;
    if (rho >= 0.75) maxK = 7;
    if (rho >= 0.90) maxK = 10;

    const data = [];
    for (let k = 0; k <= maxK; k++) {
      const theory = getTheoreticalProb(k, rho);
      const observedCount = simulatedCounts[k] || 0;
      const observedFreq = totalSimulated > 0 ? observedCount / totalSimulated : 0;
      data.push({ k, theory, observed: observedFreq, count: observedCount });
    }

    const maxProb = Math.max(d3.max(data, d => Math.max(d.theory, d.observed)) || 0.5, 0.4);

    const xScale = d3.scaleBand()
      .domain(data.map(d => `${d.k}`))
      .range([0, width])
      .padding(0.24);

    const yScale = d3.scaleLinear()
      .domain([0, maxProb * 1.1])
      .range([height, 0]);

    xAxisGroup.attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d === '0' ? 'k=0' : `k=${d}`))
      .call(g => g.selectAll('text').attr('fill', 'var(--grey-light)').attr('font-size', '9px'))
      .call(g => g.selectAll('line').attr('stroke', 'var(--grey)'))
      .call(g => g.select('.domain').attr('stroke', 'var(--grey)'));

    yAxisGroup
      .call(d3.axisLeft(yScale).ticks(4).tickFormat(d3.format('.0%')))
      .call(g => g.selectAll('text').attr('fill', 'var(--grey-light)').attr('font-size', '9px'))
      .call(g => g.selectAll('line').attr('stroke', 'var(--grey)'))
      .call(g => g.select('.domain').attr('stroke', 'var(--grey)'));

    const subBandWidth = xScale.bandwidth() / 2;

    const barGroups = barsGroup.selectAll('.bar-group')
      .data(data, d => d.k);

    barGroups.exit().remove();

    const barGroupsEnter = barGroups.enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(${xScale(`${d.k}`)},0)`);

    barGroupsEnter.append('rect').attr('class', 'theory-bar');
    barGroupsEnter.append('rect').attr('class', 'observed-bar');
    barGroupsEnter.append('text').attr('class', 'theory-label');

    const barGroupsUpdate = barGroupsEnter.merge(barGroups)
      .attr('transform', d => `translate(${xScale(`${d.k}`)},0)`);

    barGroupsUpdate.select('.theory-bar')
      .attr('x', 0)
      .attr('y', d => yScale(d.theory))
      .attr('width', subBandWidth - 1)
      .attr('height', d => height - yScale(d.theory))
      .attr('fill', 'rgba(var(--primary), 0.35)')
      .attr('stroke', 'rgb(var(--primary))')
      .attr('stroke-width', 1)
      .attr('rx', 2);

    barGroupsUpdate.select('.observed-bar')
      .attr('x', subBandWidth)
      .attr('y', d => yScale(d.observed))
      .attr('width', subBandWidth - 1)
      .attr('height', d => height - yScale(d.observed))
      .attr('fill', totalSimulated > 0 ? 'rgba(129, 199, 132, 0.75)' : 'transparent')
      .attr('stroke', totalSimulated > 0 ? '#81c784' : 'transparent')
      .attr('stroke-width', 1)
      .attr('rx', 2);

    barGroupsUpdate.select('.theory-label')
      .attr('x', subBandWidth / 2)
      .attr('y', d => Math.max(yScale(d.theory) - 3, 9))
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--grey-lighter)')
      .attr('font-size', '8.5px')
      .text(d => `${(d.theory * 100).toFixed(0)}%`);
  }

  function handleSingleFlip() {
    const { jobs, flips } = simulateOneArrival(rho);

    simulatedCounts[jobs] = (simulatedCounts[jobs] || 0) + 1;
    totalSimulated += 1;
    totalJobsSum += jobs;

    let logHtml = '';
    if (jobs === 0) {
      logHtml = `<span style="background: rgba(129, 199, 132, 0.2); color: #81c784; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Worker Idle (k=0)</span> → <span style="color: var(--grey-lighter);">Executes immediately with <strong>0 ms queue wait</strong></span>`;
    } else {
      logHtml = `<span style="background: rgba(var(--primary), 0.2); color: rgb(var(--primary)); padding: 2px 6px; border-radius: 4px; font-weight: 700;">Worker Busy</span>`;
      flips.forEach((f, idx) => {
        const rollPct = (f.roll * 100).toFixed(0);
        const targetPct = (rho * 100).toFixed(0);
        if (f.success) {
          logHtml += ` → <span style="background: rgba(var(--primary), 0.15); color: rgb(var(--primary)); padding: 2px 6px; border-radius: 4px;">🪙 Flip ${idx + 1}: ${rollPct}% < ${targetPct}% (+1 job)</span>`;
        } else {
          logHtml += ` → <span style="background: rgba(255, 167, 38, 0.2); color: #ffa726; padding: 2px 6px; border-radius: 4px;">🪙 Stop</span>`;
        }
      });
      const waitTime = jobs * serviceTimeMs;
      logHtml += ` ⇒ <strong style="color: var(--grey-lighter); margin-left: 4px;">k = ${jobs} jobs ahead</strong> (<span style="color: #ffb74d;">${waitTime}ms queue wait</span>)`;
    }

    flipStepLog.innerHTML = logHtml;

    updateMetrics();
    renderChart();
  }

  function handleBatchRun(count = 500) {
    for (let i = 0; i < count; i++) {
      const { jobs } = simulateOneArrival(rho);
      simulatedCounts[jobs] = (simulatedCounts[jobs] || 0) + 1;
      totalSimulated += 1;
      totalJobsSum += jobs;
    }

    const empMean = (totalJobsSum / totalSimulated).toFixed(2);
    const theoryMean = (rho / (1 - rho)).toFixed(2);
    const empWait = ((totalJobsSum / totalSimulated) * serviceTimeMs).toFixed(1);
    flipStepLog.innerHTML = `
      <span style="color: #81c784; font-weight: 600;">✓ Simulated ${count} arrivals.</span>
      <span style="color: var(--grey-lighter); margin-left: 8px;">Sample mean backlog: <strong>${empMean} jobs</strong> (vs. Theoretical <strong>${theoryMean} jobs</strong>) ⇒ Average wait: <strong>${empWait} ms</strong></span>
    `;

    updateMetrics();
    renderChart();
  }

  function handleReset() {
    simulatedCounts = {};
    totalSimulated = 0;
    totalJobsSum = 0;
    flipStepLog.innerHTML = `<span style="color: var(--grey-lighter);">Simulator reset. Click <strong>Simulate 1 Arrival</strong> or <strong>Simulate 500 Arrivals</strong> to generate traffic.</span>`;
    updateMetrics();
    renderChart();
  }

  rhoSlider.addEventListener('input', (e) => {
    rho = parseFloat(e.target.value);
    handleReset();
  });

  sSlider.addEventListener('input', (e) => {
    serviceTimeMs = parseFloat(e.target.value);
    updateMetrics();
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rho = parseFloat(btn.getAttribute('data-rho'));
      rhoSlider.value = rho;
      serviceTimeMs = 10;
      sSlider.value = 10;
      handleReset();
    });
  });

  btnFlipOne.addEventListener('click', handleSingleFlip);
  btnRunBatch.addEventListener('click', () => handleBatchRun(500));
  btnReset.addEventListener('click', handleReset);

  window.addEventListener('resize', () => {
    renderChart();
  });

  updateMetrics();
  renderChart();

  // If KaTeX runtime finishes loading after initial DOM execution, re-render once ready
  if (typeof window !== 'undefined' && !window.katex) {
    const katexCheckTimer = setInterval(() => {
      if (window.katex) {
        clearInterval(katexCheckTimer);
        updateMetrics();
      }
    }, 100);
    setTimeout(() => clearInterval(katexCheckTimer), 4000);
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCoinFlipSimulator());
  } else {
    initCoinFlipSimulator();
  }
}
