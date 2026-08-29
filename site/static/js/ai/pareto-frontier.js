import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

function getContainerWidth(element, defaultWidth = 660) {
  if (!element) return defaultWidth;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 ? rect.width : defaultWidth;
}

/* ==========================================================================
 * Interactive LLM Serving Pareto Frontier Playground
 * ========================================================================== */
export function initParetoPlayground(containerId = '#interactive-pareto-playground') {
  const container = document.querySelector(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="background: var(--grey-darker); border: 1px solid var(--grey-dark); border-radius: 12px; padding: 20px; font-family: var(--family-sans, system-ui, sans-serif);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 14px; gap: 10px;">
        <h4 style="margin: 0; font-size: 1.15rem; color: var(--grey-lighter);">Interactive LLM Serving Pareto Frontier Playground</h4>
        <span id="pareto-badge" style="padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; background: rgba(var(--primary), 0.2); color: rgb(var(--primary)); border: 1px solid rgb(var(--primary));">PARETO OPTIMAL</span>
      </div>

      <!-- Presets for Application Personas -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
        <button id="preset-voice" style="background: var(--grey-dark); border: 1px solid var(--grey); color: var(--grey-lighter); font-size: 0.8rem; padding: 5px 10px; border-radius: 6px; cursor: pointer;">🎙️ Voice Agent Preset</button>
        <button id="preset-chat" style="background: var(--grey-dark); border: 1px solid var(--grey); color: var(--grey-lighter); font-size: 0.8rem; padding: 5px 10px; border-radius: 6px; cursor: pointer;">💬 Chat Copilot Preset</button>
        <button id="preset-batch" style="background: var(--grey-dark); border: 1px solid var(--grey); color: var(--grey-lighter); font-size: 0.8rem; padding: 5px 10px; border-radius: 6px; cursor: pointer;">📄 Batch ETL Preset</button>
      </div>

      <!-- Hyperparameter Controls -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 20px; background: var(--grey-dark); padding: 14px; border-radius: 8px;">
        <div>
          <label style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--grey-light); margin-bottom: 4px;">
            <span>Max Batched Tokens:</span>
            <strong id="val-tokens" style="color: var(--grey-lighter);">2048</strong>
          </label>
          <input type="range" id="slider-tokens" min="256" max="8192" step="256" value="2048" style="width: 100%; accent-color: rgb(var(--primary));">
        </div>

        <div>
          <label style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--grey-light); margin-bottom: 4px;">
            <span>Max Sequences (Concurrency):</span>
            <strong id="val-seqs" style="color: var(--grey-lighter);">32</strong>
          </label>
          <input type="range" id="slider-seqs" min="4" max="128" step="4" value="32" style="width: 100%; accent-color: rgb(var(--primary));">
        </div>

        <div>
          <label style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--grey-light); margin-bottom: 4px;">
            <span>Chunked Prefill Size:</span>
            <strong id="val-chunk" style="color: var(--grey-lighter);">512</strong>
          </label>
          <input type="range" id="slider-chunk" min="128" max="2048" step="128" value="512" style="width: 100%; accent-color: rgb(var(--primary));">
        </div>
      </div>

      <!-- D3 Chart Canvas -->
      <div id="pareto-d3-chart" style="width: 100%; height: 340px; position: relative;"></div>

      <!-- Metrics Readout Card -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; background: var(--grey-dark); padding: 12px; border-radius: 8px; text-align: center; margin-top: 14px;">
        <div>
          <div style="font-size: 0.72rem; color: var(--grey-light); letter-spacing: 0.5px;">System Throughput</div>
          <div id="metric-tps" style="font-size: 1.25rem; font-weight: bold; color: rgb(var(--primary));">3,450 TPS</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--grey-light); letter-spacing: 0.5px;">P99 TTFT</div>
          <div id="metric-ttft" style="font-size: 1.25rem; font-weight: bold; color: var(--grey-lighter);">185 ms</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--grey-light); letter-spacing: 0.5px;">P99 TPOT</div>
          <div id="metric-tpot" style="font-size: 1.25rem; font-weight: bold; color: var(--grey-lighter);">24.2 ms</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--grey-light); letter-spacing: 0.5px;">Est. GPU VRAM</div>
          <div id="metric-vram" style="font-size: 1.25rem; font-weight: bold; color: var(--grey-lighter);">19.8 GB</div>
        </div>
      </div>
    </div>
  `;

  const chartEl = container.querySelector('#pareto-d3-chart');
  const sliderTokens = container.querySelector('#slider-tokens');
  const sliderSeqs = container.querySelector('#slider-seqs');
  const sliderChunk = container.querySelector('#slider-chunk');

  const valTokens = container.querySelector('#val-tokens');
  const valSeqs = container.querySelector('#val-seqs');
  const valChunk = container.querySelector('#val-chunk');

  const metricTps = container.querySelector('#metric-tps');
  const metricTtft = container.querySelector('#metric-ttft');
  const metricTpot = container.querySelector('#metric-tpot');
  const metricVram = container.querySelector('#metric-vram');
  const paretoBadge = container.querySelector('#pareto-badge');

  const margin = { top: 25, right: 35, bottom: 50, left: 65 };

  const svg = d3.select(chartEl)
    .append('svg')
    .attr('class', 'tex2jax_ignore')
    .attr('width', '100%')
    .attr('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Chart groups
  const gridGroup = g.append('g').attr('class', 'grid');
  const areaGroup = g.append('g').attr('class', 'dominated-area');
  const curveGroup = g.append('g').attr('class', 'pareto-envelope');
  const staticPointsGroup = g.append('g').attr('class', 'static-trials');
  const activePointGroup = g.append('g').attr('class', 'active-trial');
  const xAxisGroup = g.append('g').attr('class', 'x-axis');
  const yAxisGroup = g.append('g').attr('class', 'y-axis');

  // Synthetic trial dataset for empirical Pareto visualization
  const empiricalTrials = [
    { tps: 650, latency: 95, name: 'Trial #4 (Strict SLA Voice)', pareto: true },
    { tps: 1850, latency: 170, name: 'Trial #12 (Interactive)', pareto: true },
    { tps: 3600, latency: 260, name: 'Trial #27 (Balanced Copilot)', pareto: true },
    { tps: 6200, latency: 490, name: 'Trial #41 (High Throughput)', pareto: true },
    { tps: 9400, latency: 880, name: 'Trial #58 (Batch ETL)', pareto: true },
    { tps: 1100, latency: 340, name: 'Trial #7 (Dominated - Poor Parallelism)', pareto: false },
    { tps: 2200, latency: 510, name: 'Trial #19 (Dominated - Cache Fragmentation)', pareto: false },
    { tps: 4100, latency: 760, name: 'Trial #33 (Dominated - Unchunked Spikes)', pareto: false }
  ];

  function render() {
    const width = getContainerWidth(chartEl, 600) - margin.left - margin.right;
    const height = 340 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([60, 1000]).range([0, width]);
    const yScale = d3.scaleLinear().domain([400, 10500]).range([height, 0]);

    // Gridlines
    gridGroup.call(
      d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat('')
    ).selectAll('line')
      .attr('stroke', 'var(--grey-dark)')
      .attr('stroke-dasharray', '3 3');
    gridGroup.select('.domain').remove();

    // Axes
    xAxisGroup.attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .selectAll('text')
      .attr('fill', 'var(--grey-light)');
    xAxisGroup.selectAll('line').attr('stroke', 'var(--grey)');
    xAxisGroup.select('.domain').attr('stroke', 'var(--grey)');

    yAxisGroup.call(d3.axisLeft(yScale).ticks(6))
      .selectAll('text')
      .attr('fill', 'var(--grey-light)');
    yAxisGroup.selectAll('line').attr('stroke', 'var(--grey)');
    yAxisGroup.select('.domain').attr('stroke', 'var(--grey)');

    // Axis Labels
    svg.selectAll('.axis-label').remove();
    svg.append('text')
      .attr('class', 'axis-label')
      .attr('x', margin.left + width / 2)
      .attr('y', height + margin.top + 40)
      .attr('fill', 'var(--grey-lighter)')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('text-anchor', 'middle')
      .text('P99 Tail Latency: TTFT + TPOT (ms) [Minimize →]');

    svg.append('text')
      .attr('class', 'axis-label')
      .attr('x', - (margin.top + height / 2))
      .attr('y', 18)
      .attr('fill', 'var(--grey-lighter)')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Throughput: System TPS [Maximize ↑]');

    // Pareto Envelope curve points
    const paretoPoints = empiricalTrials.filter(d => d.pareto).sort((a, b) => a.latency - b.latency);
    const lineGen = d3.line()
      .x(d => xScale(d.latency))
      .y(d => yScale(d.tps))
      .curve(d3.curveMonotoneX);

    curveGroup.selectAll('path').remove();
    curveGroup.append('path')
      .datum(paretoPoints)
      .attr('d', lineGen)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(var(--primary))')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '6 3');

    // Static Trials Scatter
    staticPointsGroup.selectAll('circle').remove();
    staticPointsGroup.selectAll('circle')
      .data(empiricalTrials)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.latency))
      .attr('cy', d => yScale(d.tps))
      .attr('r', d => d.pareto ? 5.5 : 4.5)
      .attr('fill', d => d.pareto ? 'rgb(var(--primary))' : 'var(--grey)')
      .attr('stroke', 'var(--grey-darker)')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.85);

    // Dynamic model equations from slider inputs
    const tokens = parseInt(sliderTokens.value, 10);
    const seqs = parseInt(sliderSeqs.value, 10);
    const chunk = parseInt(sliderChunk.value, 10);

    valTokens.textContent = tokens;
    valSeqs.textContent = seqs;
    valChunk.textContent = chunk;

    const batchEfficiency = Math.log2(tokens / 256 + 1) * 0.46;
    const seqEfficiency = Math.min(seqs / 16, 4.0);
    const curTps = Math.round(720 * (1 + batchEfficiency * 1.55 + seqEfficiency * 0.92));
    const curTtft = Math.round(42 + (seqs * 3.8) + (chunk / 36) + (tokens / 300));
    const chunkSpike = (chunk > 1024) ? ((chunk - 1024) / 55) : 0;
    const curTpot = +(15 + (seqs * 0.28) + chunkSpike).toFixed(1);
    const curTotalLatency = curTtft + (curTpot * 4);
    const curVram = +(14.2 + (seqs * 0.17) + (tokens / 2200)).toFixed(1);

    metricTps.textContent = `${curTps.toLocaleString()} TPS`;
    metricTtft.textContent = `${curTtft} ms`;
    metricTpot.textContent = `${curTpot} ms`;
    metricVram.textContent = `${curVram} GB`;

    // Dynamic Active Point Marker
    const px = xScale(Math.max(60, Math.min(curTotalLatency, 980)));
    const py = yScale(Math.max(400, Math.min(curTps, 10200)));

    activePointGroup.selectAll('*').remove();

    // Crosshair projections
    activePointGroup.append('line')
      .attr('x1', px).attr('x2', px)
      .attr('y1', py).attr('y2', height)
      .attr('stroke', 'rgb(var(--primary))')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3 3')
      .attr('opacity', 0.6);

    activePointGroup.append('line')
      .attr('x1', 0).attr('x2', px)
      .attr('y1', py).attr('y2', py)
      .attr('stroke', 'rgb(var(--primary))')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3 3')
      .attr('opacity', 0.6);

    // Active marker dot
    activePointGroup.append('circle')
      .attr('cx', px)
      .attr('cy', py)
      .attr('r', 8)
      .attr('fill', 'rgb(var(--primary))')
      .attr('stroke', 'var(--grey-lighter)')
      .attr('stroke-width', 2.5);

    // Check Pareto optimality against empirical frontier
    const frontierTps = yScale.invert(py);
    const expectedOptimalLatency = 70 + Math.pow((frontierTps - 500) / 9500, 1.45) * 800;
    const isOptimal = curTotalLatency <= expectedOptimalLatency * 1.25;

    if (isOptimal) {
      paretoBadge.textContent = 'PARETO OPTIMAL';
      paretoBadge.style.background = 'rgba(var(--primary), 0.2)';
      paretoBadge.style.color = 'rgb(var(--primary))';
      paretoBadge.style.borderColor = 'rgb(var(--primary))';
    } else {
      paretoBadge.textContent = 'DOMINATED (Sub-optimal)';
      paretoBadge.style.background = 'var(--grey-dark)';
      paretoBadge.style.color = 'var(--grey-light)';
      paretoBadge.style.borderColor = 'var(--grey)';
    }
  }

  // Presets handlers
  container.querySelector('#preset-voice').addEventListener('click', () => {
    sliderTokens.value = 512;
    sliderSeqs.value = 8;
    sliderChunk.value = 256;
    render();
  });

  container.querySelector('#preset-chat').addEventListener('click', () => {
    sliderTokens.value = 2048;
    sliderSeqs.value = 32;
    sliderChunk.value = 512;
    render();
  });

  container.querySelector('#preset-batch').addEventListener('click', () => {
    sliderTokens.value = 8192;
    sliderSeqs.value = 112;
    sliderChunk.value = 2048;
    render();
  });

  sliderTokens.addEventListener('input', render);
  sliderSeqs.addEventListener('input', render);
  sliderChunk.addEventListener('input', render);

  window.addEventListener('resize', render);
  render();
}

/* ==========================================================================
 * 3. Modern D3 Chunked Prefill Scheduler Simulator
 * ========================================================================== */
export function initChunkingSimulation(containerId = '#interactive-chunking-demo') {
  const container = document.querySelector(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="background: var(--grey-darker); border: 1px solid var(--grey-dark); border-radius: 12px; padding: 20px; font-family: var(--family-sans, system-ui, sans-serif);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <h4 style="margin: 0; font-size: 1.1rem; color: var(--grey-lighter);">Chunked Prefill & Decode Jitter Simulator</h4>
        <span style="font-size: 0.85rem; color: rgb(var(--primary)); font-weight: 600;">Incoming Prompt: 2,048 Tokens</span>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--grey-light); margin-bottom: 6px;">
          <span>Chunk Size ($C$):</span>
          <strong id="chunk-label-text" style="color: var(--grey-lighter);">512 Tokens / Chunk (4 Steps)</strong>
        </label>
        <input type="range" id="chunk-slider-control" min="1" max="4" step="1" value="2" style="width: 100%; accent-color: rgb(var(--primary));">
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--grey-light); margin-top: 4px;">
          <span>256 (Fine Slices)</span>
          <span>512 (Balanced)</span>
          <span>1024 (Coarse)</span>
          <span>2048 (Unchunked)</span>
        </div>
      </div>

      <div id="chunk-d3-timeline" style="width: 100%; min-height: 120px; background: var(--grey-dark); border-radius: 8px; padding: 12px;"></div>

      <div id="chunk-verdict-box" style="margin-top: 12px; font-size: 0.85rem; color: var(--grey-light);"></div>
    </div>
  `;

  const slider = container.querySelector('#chunk-slider-control');
  const labelText = container.querySelector('#chunk-label-text');
  const timelineEl = container.querySelector('#chunk-d3-timeline');
  const verdictBox = container.querySelector('#chunk-verdict-box');

  const configs = [
    { chunk: 256, count: 8, stallMs: 14, title: '256 Tokens (8 Slices)', verdict: 'Minimal decode interruption (~14ms jitter), maintaining smooth streaming at the expense of multiple prefill steps.' },
    { chunk: 512, count: 4, stallMs: 28, title: '512 Tokens (4 Slices)', verdict: 'Balanced trade-off: Preserves human-perceptible reading speed while keeping TTFT low.' },
    { chunk: 1024, count: 2, stallMs: 58, title: '1024 Tokens (2 Slices)', verdict: 'Fast prefill completion, but concurrent decode streams pause for ~58ms per chunk.' },
    { chunk: 2048, count: 1, stallMs: 120, title: '2048 Tokens (Unchunked GEMM)', verdict: 'Fastest single TTFT, but active decode streams experience a noticeable ~120ms freeze, causing severe P99 TPOT degradation.' }
  ];

  function render() {
    const cfg = configs[slider.value - 1];
    labelText.textContent = cfg.title;
    verdictBox.innerHTML = `<strong style="color: var(--grey-lighter);">Analysis:</strong> ${cfg.verdict}`;

    timelineEl.innerHTML = '';
    const timelineSvg = d3.select(timelineEl)
      .append('svg')
      .attr('class', 'tex2jax_ignore')
      .attr('width', '100%')
      .attr('height', 85);

    const totalSteps = cfg.count * 2 - 1;
    const width = getContainerWidth(timelineEl, 580) - 20;
    const stepWidth = Math.max(width / totalSteps, 30);

    for (let i = 0; i < cfg.count; i++) {
      const prefillX = i * stepWidth * 2;

      // Prefill chunk box
      const prefillG = timelineSvg.append('g').attr('transform', `translate(${prefillX}, 10)`);
      prefillG.append('rect')
        .attr('width', stepWidth - 4)
        .attr('height', 60)
        .attr('rx', 5)
        .attr('fill', 'rgba(var(--primary), 0.25)')
        .attr('stroke', 'rgb(var(--primary))')
        .attr('stroke-width', 1.5);

      prefillG.append('text')
        .attr('x', (stepWidth - 4) / 2)
        .attr('y', 25)
        .attr('fill', 'var(--grey-lighter)')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(`Prefill ${i + 1}/${cfg.count}`);

      prefillG.append('text')
        .attr('x', (stepWidth - 4) / 2)
        .attr('y', 45)
        .attr('fill', 'rgb(var(--primary))')
        .attr('font-size', '9px')
        .attr('text-anchor', 'middle')
        .text(`~${cfg.stallMs}ms`);

      // Interleaved decode step
      if (i < cfg.count - 1) {
        const decodeX = prefillX + stepWidth;
        const decodeG = timelineSvg.append('g').attr('transform', `translate(${decodeX}, 18)`);
        decodeG.append('rect')
          .attr('width', stepWidth - 4)
          .attr('height', 44)
          .attr('rx', 4)
          .attr('fill', 'var(--grey-darker)')
          .attr('stroke', 'var(--grey)')
          .attr('stroke-width', 1);

        decodeG.append('text')
          .attr('x', (stepWidth - 4) / 2)
          .attr('y', 26)
          .attr('fill', 'var(--grey-light)')
          .attr('font-size', '9px')
          .attr('text-anchor', 'middle')
          .text('Decode');
      }
    }
  }

  slider.addEventListener('input', render);
  window.addEventListener('resize', render);
  render();
}

// Auto-initialize when loaded as an ES module
if (typeof window !== 'undefined') {
  initParetoPlayground();
  initChunkingSimulation();
}
