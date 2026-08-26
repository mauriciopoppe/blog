import { QueuingEngine } from '/js/performance/queuing-engine.js';

export function initUtilizationSimulator(containerId = '#interactive-utilization-simulator') {
  const container = document.querySelector(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="background: var(--grey-darker); border: 1px solid var(--grey-dark); border-radius: 12px; padding: 18px; font-family: var(--family-sans, system-ui, sans-serif); color: var(--grey-lighter);">
      
      <!-- Top Row: Title, Presets & Actions -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
        <span style="font-size: 1.05rem; font-weight: 600; color: var(--grey-lighter);">Live Queuing Simulator</span>
        
        <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
          <button id="preset-under" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">35% (Under)</button>
          <button id="preset-knee" style="background: rgba(var(--primary), 0.2); border: 1px solid rgba(var(--primary), 0.6); color: var(--grey-lighter); padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">75% (Knee)</button>
          <button id="preset-sat" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">98% (Sat)</button>
          <div style="width: 1px; height: 18px; background: rgba(255, 255, 255, 0.1); margin: 0 4px;"></div>
          <button id="btn-play-pause" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 0; min-width: 34px; text-align: center; border-radius: 6px; font-size: 0.85rem; cursor: pointer;" title="Pause / Resume">⏸</button>
          <button id="btn-reset" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-light); padding: 5px 0; min-width: 34px; text-align: center; border-radius: 6px; font-size: 0.85rem; cursor: pointer;" title="Reset Simulation">↺</button>
          <button id="btn-speed" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 8px; min-width: 44px; text-align: center; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">1.0x</button>
        </div>
      </div>

      <!-- Row 2: Sliders Grid with Value below Name -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; background: var(--grey-dark); padding: 12px 16px; border-radius: 8px; margin-bottom: 14px;">
        <!-- Slider 1: Arrival Rate -->
        <div>
          <div style="font-size: 0.78rem; color: var(--grey-light);">Arrival Rate (λ)</div>
          <div id="val-lambda" style="font-size: 0.98rem; font-weight: 600; color: rgb(var(--primary)); margin: 2px 0 6px 0;">3.0 req/s</div>
          <input type="range" id="slider-lambda" min="0.5" max="8.0" step="0.1" value="3.0" style="width: 100%; accent-color: rgb(var(--primary)); cursor: pointer;">
        </div>

        <!-- Slider 2: Cores -->
        <div>
          <div style="font-size: 0.78rem; color: var(--grey-light);">Worker Cores (c)</div>
          <div id="val-cores" style="font-size: 0.98rem; font-weight: 600; color: rgb(var(--primary)); margin: 2px 0 6px 0;">2 Cores</div>
          <input type="range" id="slider-cores" min="1" max="4" step="1" value="2" style="width: 100%; accent-color: rgb(var(--primary)); cursor: pointer;">
        </div>

        <!-- Slider 3: Service Rate -->
        <div>
          <div style="font-size: 0.78rem; color: var(--grey-light);">Worker Rate (μ)</div>
          <div id="val-mu" style="font-size: 0.98rem; font-weight: 600; color: rgb(var(--primary)); margin: 2px 0 6px 0;">2.0 req/s (S = 0.50s)</div>
          <input type="range" id="slider-mu" min="0.5" max="5.0" step="0.1" value="2.0" style="width: 100%; accent-color: rgb(var(--primary)); cursor: pointer;">
        </div>
      </div>

      <!-- Row 3: Live Sweeping Gantt Canvas with Queue Buffer & Worker Lanes -->
      <div style="position: relative; width: 100%; height: 190px; background: var(--grey-dark); border: 1px solid var(--grey-dark); border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
        <canvas id="sim-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
      </div>

      <!-- Row 4: Tiny Metric Cards Grid (including P50 and P90) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(115px, 1fr)); gap: 8px; margin-bottom: 8px;">
        <!-- Card 1: Theoretical Utilization -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Util (theoretical)</div>
          <div id="stat-theo-rho" style="font-size: 1.08rem; font-weight: 600; color: var(--grey-lighter); margin: 2px 0;">75.0%</div>
          <div id="stat-theo-cap" style="font-size: 0.70rem; color: var(--grey-light);">Cap: 4.0 req/s</div>
        </div>

        <!-- Card 2: Live Measured Utilization -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Util (measured, 5s)</div>
          <div id="stat-measured-rho" style="font-size: 1.08rem; font-weight: 600; color: rgb(var(--primary)); margin: 2px 0;">74.2%</div>
          <div id="stat-headroom" style="font-size: 0.70rem; color: var(--grey-light);">Headroom: 25.8%</div>
        </div>

        <!-- Card 3: In-Flight Queue -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Queue Depth</div>
          <div id="stat-queue-len" style="font-size: 1.08rem; font-weight: 600; color: var(--grey-lighter); margin: 2px 0;">0</div>
          <div style="font-size: 0.70rem; color: var(--grey-light);">Peak: <span id="stat-queue-max">1</span> in line</div>
        </div>

        <!-- Card 4: P50 Median Latency -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Latency (P50)</div>
          <div id="stat-latency-p50" style="font-size: 1.08rem; font-weight: 600; color: var(--grey-lighter); margin: 2px 0;">0.46s</div>
          <div id="stat-latency-mean" style="font-size: 0.70rem; color: var(--grey-light);">Mean: 0.52s</div>
        </div>

        <!-- Card 5: P90 Tail Latency -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Tail Latency (P90)</div>
          <div id="stat-latency-p90" style="font-size: 1.08rem; font-weight: 600; color: #ffb74d; margin: 2px 0;">1.12s</div>
          <div id="stat-latency-wait" style="font-size: 0.70rem; color: var(--grey-light);">Wait: 0.12s</div>
        </div>
      </div>

      <!-- Diagnostic Status Line -->
      <div id="diagnostic-summary" style="font-size: 0.78rem; color: var(--grey-light); text-align: center; padding: 2px 8px;">
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
    const metrics = engine.getMetrics();
    const avgServiceS = (1 / mu);

    valLambda.textContent = `${lambda.toFixed(1)} req/s`;
    valCores.textContent = `${cores} Core${cores > 1 ? 's' : ''}`;
    valMu.textContent = `${mu.toFixed(1)} req/s (S = ${avgServiceS.toFixed(2)}s)`;

    statTheoRho.textContent = `${metrics.theoreticalRho.toFixed(1)}%`;
    statTheoCap.textContent = `Cap: ${metrics.capacity.toFixed(1)} req/s`;

    btnPresetUnder.style.background = 'var(--grey-dark)';
    btnPresetUnder.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    btnPresetKnee.style.background = 'var(--grey-dark)';
    btnPresetKnee.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    btnPresetSat.style.background = 'var(--grey-dark)';
    btnPresetSat.style.borderColor = 'rgba(255, 255, 255, 0.08)';

    if (metrics.theoreticalRho < 55) {
      btnPresetUnder.style.background = 'rgba(76, 175, 80, 0.2)';
      btnPresetUnder.style.borderColor = 'rgba(76, 175, 80, 0.6)';
      diagnosticSummary.textContent = `Near-zero queue wait (W ≈ ${avgServiceS.toFixed(2)}s); low hardware efficiency`;
    } else if (metrics.theoreticalRho <= 85) {
      btnPresetKnee.style.background = 'rgba(var(--primary), 0.2)';
      btnPresetKnee.style.borderColor = 'rgba(var(--primary), 0.6)';
      diagnosticSummary.textContent = `Healthy ~${metrics.theoreticalHeadroom.toFixed(0)}% headroom absorbing traffic bursts`;
    } else {
      btnPresetSat.style.background = 'rgba(244, 67, 54, 0.2)';
      btnPresetSat.style.borderColor = 'rgba(244, 67, 54, 0.6)';
      diagnosticSummary.textContent = 'Queue exploding! Latency degrading asymptotically';
    }
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
