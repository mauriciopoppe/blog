import { QueuingEngine } from '/js/performance/queuing-engine.js';

export function initUtilizationSimulator(containerId = '#interactive-utilization-simulator') {
  const container = document.querySelector(containerId);
  if (!container) return;

  const CTRL = 'tw-font-serif tw-text-[0.9rem] tw-font-semibold tw-leading-none tw-px-3 tw-py-2 tw-rounded-[6px] tw-border tw-border-[var(--ring-border)] tw-bg-[var(--grey-dark)] tw-text-[var(--grey-light)] tw-cursor-pointer tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-bg-primary-soft hover:tw-text-primary hover:tw-shadow-raised';
  const SEG_BASE = 'tw-appearance-none tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-leading-none tw-px-3 tw-py-2 tw-cursor-pointer';
  const SEG_INACTIVE = SEG_BASE + ' tw-bg-transparent tw-text-[var(--grey-light)]';
  const SEG_UNDER = SEG_BASE + ' tw-bg-[rgba(76,175,80,0.16)] tw-text-[#4caf50]';
  const SEG_KNEE = SEG_BASE + ' tw-bg-primary-soft tw-text-primary';
  const SEG_SAT = SEG_BASE + ' tw-bg-[rgba(244,67,54,0.16)] tw-text-[#f44336]';

  container.innerHTML = `
    <div class="tw-bg-[var(--grey-darker)] tw-rounded-[12px] tw-p-[18px] tw-font-serif tw-text-[var(--grey-lighter)]">
      <style>
        #interactive-utilization-simulator .lls-slider { -webkit-appearance: none; appearance: none; height: 28px; background: transparent; --range-fill: 50%; }
        #interactive-utilization-simulator .lls-slider::-webkit-slider-runnable-track { height: 8px; border-radius: 999px; background: linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) var(--range-fill), var(--ring-border) var(--range-fill), var(--ring-border) 100%); }
        #interactive-utilization-simulator .lls-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); margin-top: -5px; box-shadow: var(--elevation-subtle); }
        #interactive-utilization-simulator .lls-slider::-moz-range-track { height: 8px; border-radius: 999px; background: var(--ring-border); }
        #interactive-utilization-simulator .lls-slider::-moz-range-progress { height: 8px; border-radius: 999px; background: rgb(var(--primary)); }
        #interactive-utilization-simulator .lls-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); box-shadow: var(--elevation-subtle); }
        #interactive-utilization-simulator .lls-slider:hover::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
        #interactive-utilization-simulator .lls-slider:hover::-moz-range-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
        #interactive-utilization-simulator .lls-slider:focus-visible { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; border-radius: 999px; }
      </style>

      <!-- Top Row: Presets & Actions -->
      <div class="tw-flex tw-justify-between tw-items-center tw-flex-wrap tw-gap-2.5 tw-mb-3.5">
        <div class="tw-flex tw-items-center tw-gap-1.5 tw-flex-wrap">
          <div class="tw-inline-flex tw-border tw-border-[var(--ring-border)] tw-rounded-[6px] tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden" role="radiogroup" aria-label="Preset">
            <button type="button" id="preset-under" class="${SEG_INACTIVE}" role="radio" aria-checked="false">35% (Under)</button>
            <button type="button" id="preset-knee" class="${SEG_KNEE}" role="radio" aria-checked="true">75% (Knee)</button>
            <button type="button" id="preset-sat" class="${SEG_INACTIVE}" role="radio" aria-checked="false">98% (Sat)</button>
          </div>
          <div class="tw-w-px tw-h-[18px] tw-bg-white/15 tw-mx-1"></div>
          <button type="button" id="btn-play-pause" class="${CTRL} tw-min-w-[34px] tw-text-center" title="Pause / Resume">⏸</button>
          <button type="button" id="btn-reset" class="${CTRL} tw-min-w-[34px] tw-text-center" title="Reset Simulation">↺</button>
          <button type="button" id="btn-speed" class="${CTRL} tw-min-w-[44px] tw-text-center">1.0x</button>
        </div>
      </div>

      <!-- Row 2: Sliders -->
      <div class="tw-grid tw-grid-cols-3 tw-gap-5 tw-mb-4">
        <div>
          <div class="tw-flex tw-justify-between tw-items-center tw-gap-2 tw-text-[0.75rem]">
            <span class="tw-text-[var(--grey-light)]">Arrival Rate (λ)</span>
            <span id="val-lambda" class="tw-font-semibold tw-text-primary tw-whitespace-nowrap">3.0 req/s</span>
          </div>
          <input type="range" id="slider-lambda" class="lls-slider tw-w-full tw-cursor-pointer tw-mt-1" min="0.5" max="8.0" step="0.1" value="3.0">
        </div>
        <div>
          <div class="tw-flex tw-justify-between tw-items-center tw-gap-2 tw-text-[0.75rem]">
            <span class="tw-text-[var(--grey-light)]">Worker Cores (c)</span>
            <span id="val-cores" class="tw-font-semibold tw-text-primary tw-whitespace-nowrap">2 Cores</span>
          </div>
          <input type="range" id="slider-cores" class="lls-slider tw-w-full tw-cursor-pointer tw-mt-1" min="1" max="4" step="1" value="2">
        </div>
        <div>
          <div class="tw-flex tw-justify-between tw-items-center tw-gap-2 tw-text-[0.75rem]">
            <span class="tw-text-[var(--grey-light)]">Worker Rate (μ)</span>
            <span id="val-mu" class="tw-font-semibold tw-text-primary tw-whitespace-nowrap">2.0 req/s</span>
          </div>
          <input type="range" id="slider-mu" class="lls-slider tw-w-full tw-cursor-pointer tw-mt-1" min="0.5" max="5.0" step="0.1" value="2.0">
        </div>
      </div>

      <!-- Row 3: Gantt Canvas -->
      <div class="tw-relative tw-w-full tw-h-[190px] tw-bg-[var(--grey-dark)] tw-rounded-lg tw-overflow-hidden tw-mb-3">
        <canvas id="sim-canvas" class="tw-w-full tw-h-full tw-block"></canvas>
      </div>

      <!-- Row 4: Metric Cards -->
      <div class="tw-grid tw-grid-cols-[repeat(auto-fit,minmax(115px,1fr))] tw-gap-2 tw-mb-2">
        <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center">
          <div class="tw-text-[0.75rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Util (theoretical)</div>
          <div id="stat-theo-rho" class="tw-font-sans tw-text-[1rem] tw-font-semibold tw-text-[var(--grey-lighter)]">75.0%</div>
          <div id="stat-theo-cap" class="tw-text-[0.65rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Cap: 4.0 req/s</div>
        </div>
        <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center">
          <div class="tw-text-[0.75rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Util (measured)</div>
          <div id="stat-measured-rho" class="tw-font-sans tw-text-[1rem] tw-font-semibold tw-text-primary">74.2%</div>
          <div id="stat-headroom" class="tw-text-[0.65rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Headroom: 25.8%</div>
        </div>
        <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center">
          <div class="tw-text-[0.75rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Queue Depth</div>
          <div id="stat-queue-len" class="tw-font-sans tw-text-[1rem] tw-font-semibold tw-text-[var(--grey-lighter)]">0</div>
          <div class="tw-text-[0.65rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Peak: <span id="stat-queue-max">1</span></div>
        </div>
        <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center">
          <div class="tw-text-[0.75rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Latency (P50)</div>
          <div id="stat-latency-p50" class="tw-font-sans tw-text-[1rem] tw-font-semibold tw-text-[var(--grey-lighter)]">0.46s</div>
          <div id="stat-latency-mean" class="tw-text-[0.65rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Mean: 0.52s</div>
        </div>
        <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center">
          <div class="tw-text-[0.75rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Tail Latency (P90)</div>
          <div id="stat-latency-p90" class="tw-font-sans tw-text-[1rem] tw-font-semibold tw-text-[#ffb74d]">1.12s</div>
          <div id="stat-latency-wait" class="tw-text-[0.65rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Wait: 0.12s</div>
        </div>
      </div>

      <!-- Diagnostic Status Line -->
      <div id="diagnostic-summary" class="tw-text-[0.78rem] tw-text-[var(--grey-light)] tw-text-center tw-px-2 tw-py-0.5">
        Healthy ~25% headroom absorbing traffic bursts
      </div>
    </div>
  `;

  // DOM Elements
  const sliderLambda = container.querySelector('#slider-lambda');
  const sliderCores = container.querySelector('#slider-cores');
  const sliderMu = container.querySelector('#slider-mu');

  const valLambda = container.querySelector('#val-lambda');
  const valCores = container.querySelector('#val-cores');
  const valMu = container.querySelector('#val-mu');

  const statTheoRho = container.querySelector('#stat-theo-rho');
  const statTheoCap = container.querySelector('#stat-theo-cap');
  const statMeasuredRho = container.querySelector('#stat-measured-rho');
  const statHeadroom = container.querySelector('#stat-headroom');
  const statQueueLen = container.querySelector('#stat-queue-len');
  const statQueueMax = container.querySelector('#stat-queue-max');
  const statLatencyP50 = container.querySelector('#stat-latency-p50');
  const statLatencyMean = container.querySelector('#stat-latency-mean');
  const statLatencyP90 = container.querySelector('#stat-latency-p90');
  const statLatencyWait = container.querySelector('#stat-latency-wait');
  const diagnosticSummary = container.querySelector('#diagnostic-summary');

  const btnPlayPause = container.querySelector('#btn-play-pause');
  const btnReset = container.querySelector('#btn-reset');
  const btnSpeed = container.querySelector('#btn-speed');

  const btnPresetUnder = container.querySelector('#preset-under');
  const btnPresetKnee = container.querySelector('#preset-knee');
  const btnPresetSat = container.querySelector('#preset-sat');

  const canvas = container.querySelector('#sim-canvas');
  const ctx = canvas.getContext('2d');

  // Simulation Parameters
  let lambda = 3.0; // req / s
  let cores = 2;    // count
  let mu = 2.0;     // req / s / core
  const speedOptions = [
    { label: '1.0x', speed: 1.0 },
    { label: '2.0x', speed: 2.0 },
    { label: '4.0x', speed: 4.0 }
  ];
  let speedIndex = 0;
  let simSpeed = speedOptions[0].speed;
  let isRunning = true;
  const WINDOW_DURATION = 5.0;

  const engine = new QueuingEngine({
    lambda: lambda,
    cores: cores,
    mu: mu,
    windowDuration: WINDOW_DURATION
  });

  function resetSim() {
    engine.reset();
    engine.setParameters({ lambda, cores, mu });
    updateStaticMetrics();
    updateLiveDashboard(true);
    draw();
  }

  function updateStaticMetrics() {
    syncSliderFill(sliderLambda);
    syncSliderFill(sliderCores);
    syncSliderFill(sliderMu);

    const metrics = engine.getMetrics();
    const avgServiceS = (1 / mu);

    valLambda.textContent = `${lambda.toFixed(1)} req/s`;
    valCores.textContent = `${cores} Core${cores > 1 ? 's' : ''}`;
    valMu.textContent = `${mu.toFixed(1)} req/s`;

    statTheoRho.textContent = `${metrics.theoreticalRho.toFixed(1)}%`;
    statTheoCap.textContent = `Cap: ${metrics.capacity.toFixed(1)} req/s`;

    btnPresetUnder.className = SEG_INACTIVE;
    btnPresetUnder.setAttribute('aria-checked', 'false');
    btnPresetKnee.className = SEG_INACTIVE;
    btnPresetKnee.setAttribute('aria-checked', 'false');
    btnPresetSat.className = SEG_INACTIVE;
    btnPresetSat.setAttribute('aria-checked', 'false');

    if (metrics.theoreticalRho < 55) {
      btnPresetUnder.className = SEG_UNDER;
      btnPresetUnder.setAttribute('aria-checked', 'true');
      diagnosticSummary.textContent = `Near-zero queue wait (W ≈ ${avgServiceS.toFixed(2)}s); low hardware efficiency`;
    } else if (metrics.theoreticalRho <= 85) {
      btnPresetKnee.className = SEG_KNEE;
      btnPresetKnee.setAttribute('aria-checked', 'true');
      diagnosticSummary.textContent = `Healthy ~${metrics.theoreticalHeadroom.toFixed(0)}% headroom absorbing traffic bursts`;
    } else {
      btnPresetSat.className = SEG_SAT;
      btnPresetSat.setAttribute('aria-checked', 'true');
      diagnosticSummary.textContent = 'Queue exploding! Latency degrading asymptotically';
    }
  }

  function syncSliderFill(slider) {
    const pct = ((parseFloat(slider.value) - parseFloat(slider.min)) / (parseFloat(slider.max) - parseFloat(slider.min))) * 100;
    slider.style.setProperty('--range-fill', pct + '%');
  }

  btnPresetUnder.addEventListener('click', () => {
    lambda = 1.4;
    cores = 2;
    mu = 2.0;
    sliderLambda.value = lambda;
    sliderCores.value = cores;
    sliderMu.value = mu;
    engine.setParameters({ lambda, cores, mu });
    resetSim();
  });

  btnPresetKnee.addEventListener('click', () => {
    lambda = 3.0;
    cores = 2;
    mu = 2.0;
    sliderLambda.value = lambda;
    sliderCores.value = cores;
    sliderMu.value = mu;
    engine.setParameters({ lambda, cores, mu });
    resetSim();
  });

  btnPresetSat.addEventListener('click', () => {
    lambda = 3.9;
    cores = 2;
    mu = 2.0;
    sliderLambda.value = lambda;
    sliderCores.value = cores;
    sliderMu.value = mu;
    engine.setParameters({ lambda, cores, mu });
    resetSim();
  });

  sliderLambda.addEventListener('input', (e) => {
    lambda = parseFloat(e.target.value);
    engine.setParameters({ lambda });
    updateStaticMetrics();
  });

  sliderCores.addEventListener('input', (e) => {
    cores = parseInt(e.target.value, 10);
    engine.setParameters({ cores });
    updateStaticMetrics();
  });

  sliderMu.addEventListener('input', (e) => {
    mu = parseFloat(e.target.value);
    engine.setParameters({ mu });
    updateStaticMetrics();
  });

  btnPlayPause.addEventListener('click', () => {
    isRunning = !isRunning;
    btnPlayPause.textContent = isRunning ? '⏸' : '▶';
    if (isRunning) {
      startAnimation();
    }
  });

  btnReset.addEventListener('click', resetSim);

  btnSpeed.addEventListener('click', () => {
    speedIndex = (speedIndex + 1) % speedOptions.length;
    simSpeed = speedOptions[speedIndex].speed;
    btnSpeed.textContent = speedOptions[speedIndex].label;
  });

  let canvasWidth = 700;
  let canvasHeight = 190;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvasWidth = rect.width;
    canvasHeight = rect.height;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let lastRealTime = performance.now();

  function simStep(dt) {
    engine.setParameters({ lambda, cores, mu });
    engine.step(dt);
  }

  function updateLiveDashboard(force = false) {
    if (engine.sweepTime <= 0.05 && !force) return;

    const metrics = engine.getMetrics();
    statMeasuredRho.textContent = `${metrics.measuredRho.toFixed(1)}%`;
    statHeadroom.textContent = `Headroom: ${metrics.headroom.toFixed(1)}%`;
    statQueueLen.textContent = `${metrics.queueLength}`;
    statQueueMax.textContent = `${metrics.peakQueue}`;
    statLatencyP50.textContent = `${metrics.p50.toFixed(2)}s`;
    statLatencyP90.textContent = `${metrics.p90.toFixed(2)}s`;
    statLatencyMean.textContent = `Mean: ${metrics.meanLatency.toFixed(2)}s`;
    statLatencyWait.textContent = `Wait: ${metrics.meanWait.toFixed(2)}s`;

    if (metrics.measuredRho >= 95.0 || metrics.queueLength > 3) {
      statMeasuredRho.style.color = '#f44336';
    } else if (metrics.measuredRho > 75.0) {
      statMeasuredRho.style.color = '#ffb74d';
    } else {
      statMeasuredRho.style.color = 'rgb(var(--primary))';
    }

    if (metrics.p90 > 2.0) {
      statLatencyP90.style.color = '#f44336';
    } else if (metrics.p90 > 1.2) {
      statLatencyP90.style.color = '#ffb74d';
    } else {
      statLatencyP90.style.color = 'rgb(var(--primary))';
    }

    // Dynamic Live Diagnostic Line
    if (metrics.rawLoad >= 100.0) {
      diagnosticSummary.textContent = `🚨 Overload! Demand (${metrics.lambda.toFixed(1)} req/s) exceeds cluster capacity (${metrics.capacity.toFixed(1)} req/s)`;
    } else if (metrics.queueLength > 3) {
      diagnosticSummary.textContent = `⚠️ Absorbing transient burst: ${metrics.queueLength} requests in queue, workers running at 100% capacity`;
    } else if (metrics.theoreticalRho < 55) {
      const avgS = (1.0 / mu).toFixed(2);
      diagnosticSummary.textContent = `Near-zero queue wait (W ≈ ${avgS}s); low hardware efficiency`;
    } else {
      diagnosticSummary.textContent = `Healthy ~${metrics.theoreticalHeadroom.toFixed(0)}% headroom absorbing traffic bursts`;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const leftMargin = 85;
    const rightMargin = 20;
    const topMargin = 26;
    const bottomMargin = 22;
    const timelineWidth = canvasWidth - leftMargin - rightMargin;
    const timelineHeight = canvasHeight - topMargin - bottomMargin;

    const totalTracks = 1 + engine.workers.length;
    const laneHeight = Math.min(30, (timelineHeight - (totalTracks - 1) * 6) / totalTracks);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    const cycleBaseTime = engine.windowCycle * WINDOW_DURATION;

    for (let t = 0; t <= WINDOW_DURATION; t += 1.0) {
      const x = leftMargin + (t / WINDOW_DURATION) * timelineWidth;
      ctx.beginPath();
      ctx.moveTo(x, topMargin);
      ctx.lineTo(x, topMargin + timelineHeight);
      ctx.stroke();

      const labelSec = cycleBaseTime + t;
      ctx.fillText(`${labelSec.toFixed(0)}s`, x, topMargin + timelineHeight + 15);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftMargin, topMargin + timelineHeight);
    ctx.lineTo(leftMargin + timelineWidth, topMargin + timelineHeight);
    ctx.stroke();

    // 2. Track 0: Dedicated Queue Track (Items travel alongside timeline pointer)
    const queueY = topMargin;
    ctx.fillStyle = 'rgba(255, 193, 7, 0.9)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Queue', 12, queueY + laneHeight / 2 + 4);

    ctx.fillStyle = 'rgba(255, 193, 7, 0.03)';
    ctx.strokeStyle = 'rgba(255, 193, 7, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftMargin, queueY, timelineWidth, laneHeight, 4);
    ctx.fill();
    ctx.stroke();

    const sweepX = leftMargin + (engine.sweepTime / WINDOW_DURATION) * timelineWidth;

    // Always display the queue count status text inside the Queue track
    ctx.fillStyle = engine.queue.length > 0 ? 'rgba(255, 213, 79, 0.75)' : 'rgba(255, 255, 255, 0.25)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`(${engine.queue.length} waiting in queue)`, leftMargin + 10, queueY + laneHeight / 2 + 4);

    // Render a single compact badge following the pointer indicating pending queue count (xN)
    if (engine.queue.length > 0) {
      const count = engine.queue.length;
      const headJob = engine.queue[0];
      const waitSoFar = Math.max(0, engine.sweepTime - headJob.arrivalTime);

      const badgeText = count === 1 
        ? `1 queued (${waitSoFar.toFixed(1)}s wait)` 
        : `×${count} in queue (${waitSoFar.toFixed(1)}s wait)`;

      ctx.font = '9.5px sans-serif';
      const textWidth = ctx.measureText(badgeText).width;
      const badgeW = Math.max(68, textWidth + 14);

      // Clamp cleanly to timeline boundaries so it never overflows offscreen
      let badgeX = Math.min(sweepX + 6, (canvasWidth - rightMargin) - badgeW - 2);
      badgeX = Math.max(leftMargin + 115, badgeX);

      ctx.fillStyle = count > 3 ? 'rgba(244, 67, 54, 0.28)' : 'rgba(255, 193, 7, 0.25)';
      ctx.strokeStyle = count > 3 ? 'rgba(244, 67, 54, 0.85)' : 'rgba(255, 193, 7, 0.85)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(badgeX, queueY + 2, badgeW, laneHeight - 4, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = count > 3 ? '#ffcdd2' : '#ffecb3';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, badgeX + badgeW / 2, queueY + laneHeight / 2 + 3.5);
    }

    engine.workers.forEach((w, idx) => {
      const laneY = topMargin + (idx + 1) * (laneHeight + 6);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Worker ${idx + 1}`, 12, laneY + laneHeight / 2 + 4);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(leftMargin, laneY, timelineWidth, laneHeight, 4);
      ctx.fill();
      ctx.stroke();

      w.blocks.forEach(b => {
        const x1 = leftMargin + (b.start / WINDOW_DURATION) * timelineWidth;
        const visibleEnd = Math.min(engine.sweepTime, b.end);
        if (visibleEnd > b.start) {
          const x2 = leftMargin + (visibleEnd / WINDOW_DURATION) * timelineWidth;
          const blockW = Math.max(2, x2 - x1);

          const isTail = (b.duration || (1.0 / mu)) > (1.5 / mu);
          ctx.fillStyle = isTail ? 'rgba(255, 152, 0, 0.25)' : 'rgba(235, 87, 87, 0.22)';
          ctx.strokeStyle = isTail ? 'rgba(255, 152, 0, 0.85)' : 'rgba(235, 87, 87, 0.65)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(x1, laneY + 2, blockW, laneHeight - 4, 3);
          ctx.fill();
          ctx.stroke();

          if (blockW > 28) {
            ctx.fillStyle = isTail ? '#ffe0b2' : 'rgba(255, 255, 255, 0.9)';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            const durText = b.duration ? `${b.duration.toFixed(2)}s` : `${(1.0 / mu).toFixed(2)}s`;
            ctx.fillText(durText, x1 + blockW / 2, laneY + laneHeight / 2 + 4);
          }
        }
      });
    });

    ctx.strokeStyle = 'rgba(235, 87, 87, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sweepX, topMargin - 4);
    ctx.lineTo(sweepX, topMargin + timelineHeight + 4);
    ctx.stroke();

    ctx.fillStyle = 'rgba(235, 87, 87, 0.9)';
    ctx.beginPath();
    ctx.arc(sweepX, topMargin - 4, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  let isVisible = false;
  let rafId = null;

  function animationLoop(timestamp) {
    if (!isVisible) {
      rafId = null;
      return;
    }

    const elapsedRealSec = Math.min(0.1, (timestamp - lastRealTime) / 1000);
    lastRealTime = timestamp;

    if (isRunning) {
      const simDt = elapsedRealSec * 0.40 * simSpeed;
      simStep(simDt);
      updateLiveDashboard();
    }

    draw();
    rafId = requestAnimationFrame(animationLoop);
  }

  function startAnimation() {
    if (isVisible && !rafId) {
      lastRealTime = performance.now();
      rafId = requestAnimationFrame(animationLoop);
    }
  }

  // Observe visibility to run animation loop only when visible in viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startAnimation();
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    }, { threshold: 0.05 });

    observer.observe(container);
  } else {
    isVisible = true;
    startAnimation();
  }

  resetSim();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initUtilizationSimulator());
  } else {
    initUtilizationSimulator();
  }
}
