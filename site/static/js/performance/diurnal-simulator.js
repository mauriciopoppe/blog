import { QueuingEngine } from '/js/performance/queuing-engine.js';

export function initDiurnalSimulator() {
  const container = document.getElementById('interactive-diurnal-simulator');
  if (!container) return;

  // Render UI Shell
  container.innerHTML = `
    <div style="background: var(--grey-darker); border: 1px solid var(--grey-dark); border-radius: 12px; padding: 18px; margin: 2rem 0; font-family: var(--family-sans, system-ui, sans-serif);">
      <!-- Header Row -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
        <div>
          <span style="font-size: 1.05rem; font-weight: 600; color: var(--grey-lighter);">24-Hour Diurnal Traffic & Autoscaling</span>
          <div style="font-size: 0.76rem; color: var(--grey-light); margin-top: 2px;">Simulating day/night traffic waves and dynamic core elasticity</div>
        </div>
        
        <!-- Action Buttons -->
        <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
          <button id="diurnal-strategy-static" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">Static (3 Cores)</button>
          <button id="diurnal-strategy-auto" style="background: rgba(var(--primary), 0.2); border: 1px solid rgba(var(--primary), 0.6); color: var(--grey-lighter); padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">Autoscaling (Target 70%)</button>
          <div style="width: 1px; height: 18px; background: rgba(255, 255, 255, 0.1); margin: 0 4px;"></div>
          <button id="diurnal-btn-play-pause" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 0; min-width: 34px; text-align: center; border-radius: 6px; font-size: 0.85rem; cursor: pointer;" title="Play / Pause">⏸</button>
          <button id="diurnal-btn-reset" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-light); padding: 5px 0; min-width: 34px; text-align: center; border-radius: 6px; font-size: 0.85rem; cursor: pointer;" title="Reset to 9:00 (Morning)">↺</button>
          <button id="diurnal-btn-speed" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 8px; min-width: 44px; text-align: center; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">1.0x</button>
        </div>
      </div>

      <!-- Time Scrubber Row with Proportional Preset Markers -->
      <div style="background: var(--grey-dark); padding: 12px 16px; border-radius: 8px; margin-bottom: 12px;">
        <!-- Line 1: Time of Day on its own line -->
        <div style="margin-bottom: 12px;">
          <div style="font-size: 0.74rem; color: var(--grey-light);">Time of Day</div>
          <div id="diurnal-time-label" style="font-size: 1.02rem; font-weight: 600; color: rgb(var(--primary)); margin-top: 1px;">09:00 (Morning Ramp)</div>
        </div>

        <!-- Positioned Markers Container directly above corresponding points on Slider -->
        <div style="position: relative; width: 100%; height: 30px; margin-bottom: 24px;">
          <div class="diurnal-time-preset" data-hour="3" style="position: absolute; left: 12.5%; transform: translateX(-50%); font-size: 0.72rem; color: var(--grey-light); cursor: pointer; text-align: center; white-space: nowrap; transition: color 0.15s;">
            03:00 (Night)<span style="font-size: 0.68rem; display: block; line-height: 1; margin-top: 1px;">↓</span>
          </div>
          <div class="diurnal-time-preset" data-hour="9" style="position: absolute; left: 37.5%; transform: translateX(-50%); font-size: 0.72rem; color: rgb(var(--primary)); font-weight: 600; cursor: pointer; text-align: center; white-space: nowrap; transition: color 0.15s;">
            09:00 (Morning)<span style="font-size: 0.68rem; display: block; line-height: 1; margin-top: 1px;">↓</span>
          </div>
          <div class="diurnal-time-preset" data-hour="14" style="position: absolute; left: 58.33%; transform: translateX(-50%); font-size: 0.72rem; color: var(--grey-light); cursor: pointer; text-align: center; white-space: nowrap; transition: color 0.15s;">
            14:00 (Peak)<span style="font-size: 0.68rem; display: block; line-height: 1; margin-top: 1px;">↓</span>
          </div>
          <div class="diurnal-time-preset" data-hour="21" style="position: absolute; left: 87.5%; transform: translateX(-50%); font-size: 0.72rem; color: var(--grey-light); cursor: pointer; text-align: center; white-space: nowrap; transition: color 0.15s;">
            21:00 (Evening)<span style="font-size: 0.68rem; display: block; line-height: 1; margin-top: 1px;">↓</span>
          </div>
        </div>

        <input type="range" id="diurnal-time-slider" min="0" max="24" step="0.1" value="9.0" style="width: 100%; accent-color: rgb(var(--primary)); cursor: pointer; display: block; margin: 0;">
      </div>

      <!-- Canvas 1: 24-Hour Diurnal Overview Wave -->
      <div style="position: relative; width: 100%; height: 110px; background: var(--grey-dark); border-radius: 8px; border: 1px solid var(--grey-dark); margin-bottom: 10px; overflow: hidden;">
        <canvas id="diurnal-macro-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
      </div>

      <!-- Connective Micro Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding: 0 2px;">
        <div style="font-size: 0.74rem; font-weight: 600; color: rgb(var(--primary)); display: flex; align-items: center; gap: 4px;">
          <span>🔍</span> <span>Microscopic Core Activity (Sampled at Vertical Needle Above)</span>
        </div>
        <div style="font-size: 0.68rem; color: var(--grey-light);">5.0s Sample Slice</div>
      </div>

      <!-- Canvas 2: Microscopic Active Core Tracks & Live Queue -->
      <div style="position: relative; width: 100%; height: 165px; background: var(--grey-dark); border-radius: 8px; border: 1px solid var(--grey-dark); margin-bottom: 12px; overflow: hidden;">
        <canvas id="diurnal-micro-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
      </div>

      <!-- Metrics Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(115px, 1fr)); gap: 8px; margin-bottom: 8px;">
        <!-- Card 1: Traffic Demand -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Traffic Demand (λ)</div>
          <div id="stat-diurnal-lambda" style="font-size: 1.05rem; font-weight: 600; color: var(--grey-lighter); margin: 2px 0;">7.8 req/s</div>
          <div id="stat-diurnal-phase" style="font-size: 0.70rem; color: var(--grey-light);">Peak Hours</div>
        </div>

        <!-- Card 2: Provisioned Cores & Capacity -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Capacity (c · μ)</div>
          <div id="stat-diurnal-capacity" style="font-size: 1.05rem; font-weight: 600; color: var(--grey-lighter); margin: 2px 0;">10.0 req/s</div>
          <div id="stat-diurnal-cores" style="font-size: 0.70rem; color: var(--grey-light);">5 Cores active</div>
        </div>

        <!-- Card 3: Utilization (ρ) -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Utilization (measured, 5s)</div>
          <div id="stat-diurnal-rho" style="font-size: 1.05rem; font-weight: 600; color: rgb(var(--primary)); margin: 2px 0;">78.0%</div>
          <div id="stat-diurnal-headroom" style="font-size: 0.70rem; color: var(--grey-light);">Headroom: 22.0%</div>
        </div>

        <!-- Card 4: P50 Latency -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Latency (P50)</div>
          <div id="stat-diurnal-p50" style="font-size: 1.05rem; font-weight: 600; color: var(--grey-lighter); margin: 2px 0;">0.48s</div>
          <div style="font-size: 0.70rem; color: var(--grey-light);">Mean: <span id="stat-diurnal-mean">0.54s</span></div>
        </div>

        <!-- Card 5: P90 Tail Latency -->
        <div style="background: var(--grey-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--grey-dark);">
          <div style="font-size: 0.70rem; color: var(--grey-light);">Tail Latency (P90)</div>
          <div id="stat-diurnal-p90" style="font-size: 1.05rem; font-weight: 600; color: #ffb74d; margin: 2px 0;">1.15s</div>
          <div id="stat-diurnal-wait" style="font-size: 0.70rem; color: var(--grey-light);">Wait: 0.15s</div>
        </div>
      </div>

      <!-- Diagnostic Status Line -->
      <div id="diurnal-diagnostic-summary" style="font-size: 0.78rem; color: var(--grey-light); text-align: center; padding: 2px 8px;">
        Autoscaling dynamically provisioned 5 cores to maintain safe 78% utilization during peak.
      </div>
    </div>
  `;

  // DOM Elements
  const strategyStatic = container.querySelector('#diurnal-strategy-static');
  const strategyAuto = container.querySelector('#diurnal-strategy-auto');
  const btnPlayPause = container.querySelector('#diurnal-btn-play-pause');
  const btnReset = container.querySelector('#diurnal-btn-reset');
  const btnSpeed = container.querySelector('#diurnal-btn-speed');

  const timeSlider = container.querySelector('#diurnal-time-slider');
  const timeLabel = container.querySelector('#diurnal-time-label');
  const timePresets = container.querySelectorAll('.diurnal-time-preset');

  const macroCanvas = container.querySelector('#diurnal-macro-canvas');
  const microCanvas = container.querySelector('#diurnal-micro-canvas');
  const macroCtx = macroCanvas.getContext('2d');
  const microCtx = microCanvas.getContext('2d');

  const statLambda = container.querySelector('#stat-diurnal-lambda');
  const statPhase = container.querySelector('#stat-diurnal-phase');
  const statCapacity = container.querySelector('#stat-diurnal-capacity');
  const statCores = container.querySelector('#stat-diurnal-cores');
  const statRho = container.querySelector('#stat-diurnal-rho');
  const statHeadroom = container.querySelector('#stat-diurnal-headroom');
  const statP50 = container.querySelector('#stat-diurnal-p50');
  const statMean = container.querySelector('#stat-diurnal-mean');
  const statP90 = container.querySelector('#stat-diurnal-p90');
  const statWait = container.querySelector('#stat-diurnal-wait');
  const diagnosticSummary = container.querySelector('#diurnal-diagnostic-summary');

  // Simulation State
  let strategy = 'auto'; // 'static' | 'auto'
  let currentHour = 9.0; // Default to 9:00 AM (Morning Ramp)
  let isRunning = true;
  let speedMultiplier = 1.0;
  const speedLevels = [
    { label: '1.0x', speed: 1.0 },
    { label: '2.0x', speed: 2.0 },
    { label: '4.0x', speed: 4.0 }
  ];
  let speedIdx = 0;

  const MU_RATE = 2.0; // 2.0 req/s per core (S = 0.5s)
  const STATIC_CORES = 3;
  const WINDOW_DURATION = 5.0; // 5s sweeping micro-window

  // Diurnal Traffic Function λ(t)
  function getDiurnalLambda(hour) {
    const baseTrough = 1.2;
    const peakAmp = 6.8;
    // Gaussian peak centered at 14.0 (2 PM) with width sigma = 3.8h
    const bell = Math.exp(-Math.pow(hour - 14.0, 2) / (2 * Math.pow(3.8, 2)));
    // Morning mini-bump at 9 AM
    const morningBump = 1.0 * Math.exp(-Math.pow(hour - 9.0, 2) / (2 * Math.pow(1.8, 2)));
    return baseTrough + (peakAmp * bell) + morningBump;
  }

  // Determine provisioned cores c(t)
  function getProvisionedCores(hour, strat) {
    if (strat === 'static') {
      return STATIC_CORES;
    }
    const currentLam = getDiurnalLambda(hour);
    // Target 70% utilization: desiredCores = ceil(lambda / (0.70 * mu))
    const desired = Math.ceil(currentLam / (0.70 * MU_RATE));
    return Math.max(1, Math.min(6, desired));
  }

  // Pure Queuing Simulation Engine
  const engine = new QueuingEngine({
    lambda: getDiurnalLambda(currentHour),
    cores: getProvisionedCores(currentHour, strategy),
    mu: MU_RATE,
    windowDuration: WINDOW_DURATION
  });

  function resetMicroSim(hardReset = false) {
    const lam = getDiurnalLambda(currentHour);
    const cores = getProvisionedCores(currentHour, strategy);
    // Apply parameters before resetting so the engine seeds its rolling
    // utilization with the current hour's theoretical value instead of the
    // stale pre-reset traffic profile.
    engine.setParameters({ lambda: lam, cores: cores, mu: MU_RATE });
    if (hardReset) {
      engine.reset();
    }
    drawMacroCanvas();
    drawMicroCanvas();
    updateDashboard();
  }

  // Resize Canvases
  let macroWidth = 700;
  let macroHeight = 110;
  let microWidth = 700;
  let microHeight = 165;

  function resizeCanvases() {
    const rect = macroCanvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    macroWidth = rect.width;
    macroHeight = rect.height;
    macroCanvas.width = macroWidth * dpr;
    macroCanvas.height = macroHeight * dpr;
    macroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const microRect = microCanvas.parentElement.getBoundingClientRect();
    microWidth = microRect.width;
    microHeight = microRect.height;
    microCanvas.width = microWidth * dpr;
    microCanvas.height = microHeight * dpr;
    microCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();
  resetMicroSim(true);

  // Step Simulation
  let lastTimestamp = null;

  function simStep(dt) {
    // 1. Advance Day/Night Hour (smooth 24-hour cycle over ~120 seconds at 1.0x)
    const hourDelta = (dt * 0.20 * speedMultiplier);
    currentHour = (currentHour + hourDelta) % 24.0;
    timeSlider.value = currentHour.toFixed(1);

    const currentLam = getDiurnalLambda(currentHour);
    const activeCores = getProvisionedCores(currentHour, strategy);

    // Update engine parameters and advance simulation
    engine.setParameters({
      lambda: currentLam,
      cores: activeCores,
      mu: MU_RATE
    });

    const simDt = dt * 0.40 * speedMultiplier;
    engine.step(simDt);
  }

  // Draw Top Macro 24-Hour Wave Canvas
  function drawMacroCanvas() {
    macroCtx.clearRect(0, 0, macroWidth, macroHeight);

    const leftPad = 50;
    const rightPad = 20;
    const topPad = 16;
    const botPad = 22;
    const plotW = macroWidth - leftPad - rightPad;
    const plotH = macroHeight - topPad - botPad;

    const maxRate = 14.0;

    // Time Ticks (0h, 4h, 8h, 12h, 16h, 20h, 24h)
    macroCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    macroCtx.lineWidth = 1;
    macroCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    macroCtx.font = '10px sans-serif';
    macroCtx.textAlign = 'center';

    for (let h = 0; h <= 24; h += 4) {
      const x = leftPad + (h / 24) * plotW;
      macroCtx.beginPath();
      macroCtx.moveTo(x, topPad);
      macroCtx.lineTo(x, topPad + plotH);
      macroCtx.stroke();

      const hStr = `${h.toString().padStart(2, '0')}:00`;
      macroCtx.fillText(hStr, x, topPad + plotH + 14);
    }

    // Y Axis Label
    macroCtx.textAlign = 'right';
    macroCtx.fillText('12 req/s', leftPad - 8, topPad + 10);
    macroCtx.fillText('0', leftPad - 8, topPad + plotH);

    // Draw Provisioned Capacity Step Area C(t)
    macroCtx.strokeStyle = 'rgba(76, 175, 80, 0.75)';
    macroCtx.lineWidth = 1.5;
    macroCtx.beginPath();

    for (let h = 0; h <= 24; h += 0.2) {
      const cores = getProvisionedCores(h, strategy);
      const cap = cores * MU_RATE;
      const x = leftPad + (h / 24) * plotW;
      const y = topPad + plotH - (cap / maxRate) * plotH;
      if (h === 0) macroCtx.moveTo(x, y);
      else macroCtx.lineTo(x, y);
    }
    macroCtx.stroke();

    // Draw Traffic Demand Curve λ(t) with gradient fill
    const grad = macroCtx.createLinearGradient(0, topPad, 0, topPad + plotH);
    grad.addColorStop(0, 'rgba(255, 107, 107, 0.45)');
    grad.addColorStop(1, 'rgba(255, 107, 107, 0.03)');

    macroCtx.fillStyle = grad;
    macroCtx.beginPath();
    macroCtx.moveTo(leftPad, topPad + plotH);

    for (let h = 0; h <= 24; h += 0.2) {
      const lam = getDiurnalLambda(h);
      const x = leftPad + (h / 24) * plotW;
      const y = topPad + plotH - (lam / maxRate) * plotH;
      macroCtx.lineTo(x, y);
    }
    macroCtx.lineTo(leftPad + plotW, topPad + plotH);
    macroCtx.closePath();
    macroCtx.fill();

    macroCtx.strokeStyle = '#ff6b6b';
    macroCtx.lineWidth = 2.5;
    macroCtx.beginPath();
    for (let h = 0; h <= 24; h += 0.2) {
      const lam = getDiurnalLambda(h);
      const x = leftPad + (h / 24) * plotW;
      const y = topPad + plotH - (lam / maxRate) * plotH;
      if (h === 0) macroCtx.moveTo(x, y);
      else macroCtx.lineTo(x, y);
    }
    macroCtx.stroke();

    // Legend
    macroCtx.font = '10px sans-serif';
    macroCtx.textAlign = 'left';
    macroCtx.fillStyle = '#ff6b6b';
    macroCtx.fillText('— Traffic Demand λ(t)', leftPad + 10, topPad + 10);
    macroCtx.fillStyle = '#66bb6a';
    macroCtx.fillText('— Capacity C(t)', leftPad + 140, topPad + 10);

    // Current Time Needle with pointer arrow to micro canvas below
    const needleX = leftPad + (currentHour / 24) * plotW;
    macroCtx.strokeStyle = '#ffffff';
    macroCtx.lineWidth = 2;
    macroCtx.beginPath();
    macroCtx.moveTo(needleX, topPad - 2);
    macroCtx.lineTo(needleX, topPad + plotH + 2);
    macroCtx.stroke();

    macroCtx.fillStyle = '#ffffff';
    macroCtx.beginPath();
    macroCtx.arc(needleX, topPad - 2, 3.5, 0, Math.PI * 2);
    macroCtx.fill();

    // Downward arrow at bottom of needle pointing to micro canvas
    macroCtx.fillStyle = '#ffffff';
    macroCtx.beginPath();
    macroCtx.moveTo(needleX - 4, topPad + plotH - 1);
    macroCtx.lineTo(needleX + 4, topPad + plotH - 1);
    macroCtx.lineTo(needleX, topPad + plotH + 5);
    macroCtx.closePath();
    macroCtx.fill();
  }

  // Draw Bottom Micro Gantt Canvas
  function drawMicroCanvas() {
    microCtx.clearRect(0, 0, microWidth, microHeight);

    const leftPad = 80;
    const rightPad = 20;
    const topPad = 24;
    const botPad = 20;
    const plotW = microWidth - leftPad - rightPad;
    const plotH = microHeight - topPad - botPad;

    const cores = engine.workers.length;
    const totalTracks = 1 + cores;
    const laneH = Math.min(22, (plotH - (totalTracks - 1) * 4) / totalTracks);

    // Subtle vertical grid guidelines
    microCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    microCtx.lineWidth = 1;

    for (let t = 0; t <= WINDOW_DURATION; t += 1.0) {
      const x = leftPad + (t / WINDOW_DURATION) * plotW;
      microCtx.beginPath();
      microCtx.moveTo(x, topPad);
      microCtx.lineTo(x, topPad + plotH);
      microCtx.stroke();
    }

    microCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    microCtx.beginPath();
    microCtx.moveTo(leftPad, topPad + plotH);
    microCtx.lineTo(leftPad + plotW, topPad + plotH);
    microCtx.stroke();

    const sweepX = leftPad + (engine.sweepTime / WINDOW_DURATION) * plotW;

    // Queue Track
    const qY = topPad;
    microCtx.fillStyle = 'rgba(255, 193, 7, 0.9)';
    microCtx.font = '10px sans-serif';
    microCtx.textAlign = 'left';
    microCtx.fillText('Queue', 14, qY + laneH / 2 + 3);

    microCtx.fillStyle = 'rgba(255, 193, 7, 0.03)';
    microCtx.strokeStyle = 'rgba(255, 193, 7, 0.2)';
    microCtx.lineWidth = 1;
    microCtx.beginPath();
    microCtx.roundRect(leftPad, qY, plotW, laneH, 3);
    microCtx.fill();
    microCtx.stroke();

    // Permanent Queue Count Text
    microCtx.fillStyle = engine.queue.length > 0 ? 'rgba(255, 213, 79, 0.85)' : 'rgba(255, 255, 255, 0.25)';
    microCtx.fillText(`(${engine.queue.length} in queue)`, leftPad + 8, qY + laneH / 2 + 3);

    // Queue Badge following needle
    if (engine.queue.length > 0) {
      const count = engine.queue.length;
      const head = engine.queue[0];
      const wait = Math.max(0, engine.sweepTime - head.arrivalTime);
      const txt = count === 1 ? `1 queued (${wait.toFixed(1)}s wait)` : `×${count} in queue (${wait.toFixed(1)}s wait)`;

      microCtx.font = '9px sans-serif';
      const textW = microCtx.measureText(txt).width;
      const bW = Math.max(68, textW + 14);
      let bX = Math.min(sweepX + 6, (microWidth - rightPad) - bW - 2);
      bX = Math.max(leftPad + 110, bX);

      microCtx.fillStyle = count > 3 ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255, 193, 7, 0.25)';
      microCtx.strokeStyle = count > 3 ? 'rgba(244, 67, 54, 0.85)' : 'rgba(255, 193, 7, 0.85)';
      microCtx.lineWidth = 1;
      microCtx.beginPath();
      microCtx.roundRect(bX, qY + 2, bW, laneH - 4, 3);
      microCtx.fill();
      microCtx.stroke();

      microCtx.fillStyle = count > 3 ? '#ffcdd2' : '#ffecb3';
      microCtx.textAlign = 'center';
      microCtx.fillText(txt, bX + bW / 2, qY + laneH / 2 + 3);
    }

    // Worker Tracks
    engine.workers.forEach((w, idx) => {
      const lY = topPad + (idx + 1) * (laneH + 4);

      microCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      microCtx.font = '10px sans-serif';
      microCtx.textAlign = 'left';
      microCtx.fillText(`Worker ${idx + 1}`, 14, lY + laneH / 2 + 3);

      microCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      microCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      microCtx.lineWidth = 1;
      microCtx.beginPath();
      microCtx.roundRect(leftPad, lY, plotW, laneH, 3);
      microCtx.fill();
      microCtx.stroke();

      // Render job blocks with duration
      w.blocks.forEach(b => {
        const x1 = leftPad + (b.start / WINDOW_DURATION) * plotW;
        const visEnd = Math.min(engine.sweepTime, b.end);
        if (visEnd > b.start) {
          const x2 = leftPad + (visEnd / WINDOW_DURATION) * plotW;
          const bw = Math.max(2, x2 - x1);

          const isTail = (b.duration || 0.5) > 0.75;
          microCtx.fillStyle = isTail ? 'rgba(255, 152, 0, 0.25)' : 'rgba(235, 87, 87, 0.22)';
          microCtx.strokeStyle = isTail ? 'rgba(255, 152, 0, 0.85)' : 'rgba(235, 87, 87, 0.75)';
          microCtx.lineWidth = 1;
          microCtx.beginPath();
          microCtx.roundRect(x1, lY + 2, bw, laneH - 4, 3);
          microCtx.fill();
          microCtx.stroke();

          if (bw > 26) {
            microCtx.fillStyle = isTail ? '#ffe0b2' : 'rgba(255, 255, 255, 0.9)';
            microCtx.font = '9px sans-serif';
            microCtx.textAlign = 'center';
            const durText = b.duration ? `${b.duration.toFixed(2)}s` : '0.50s';
            microCtx.fillText(durText, x1 + bw / 2, lY + laneH / 2 + 3);
          }
        }
      });
    });

    // Sweeping Needle
    microCtx.strokeStyle = 'rgba(235, 87, 87, 0.75)';
    microCtx.lineWidth = 1.5;
    microCtx.beginPath();
    microCtx.moveTo(sweepX, topPad - 3);
    microCtx.lineTo(sweepX, topPad + plotH + 3);
    microCtx.stroke();
  }

  function updateDashboard() {
    const metrics = engine.getMetrics();

    // Time Label
    const hourInt = Math.floor(currentHour);
    const minInt = Math.floor((currentHour % 1) * 60);
    const timeStr = `${hourInt.toString().padStart(2, '0')}:${minInt.toString().padStart(2, '0')}`;
    let phaseStr = 'Late Night (Low Traffic)';
    if (currentHour >= 6 && currentHour < 11) phaseStr = 'Morning Ramp';
    else if (currentHour >= 11 && currentHour < 18) phaseStr = 'Peak Business';
    else if (currentHour >= 18 && currentHour < 23) phaseStr = 'Evening Taper';

    timeLabel.textContent = `${timeStr} (${phaseStr})`;

    // Dynamically highlight the active phase preset marker based on time of day
    const activePresetHour = currentHour < 6 ? 3 : currentHour < 11 ? 9 : currentHour < 18 ? 14 : 21;
    timePresets.forEach(b => {
      const h = parseFloat(b.getAttribute('data-hour'));
      if (h === activePresetHour) {
        b.style.color = 'rgb(var(--primary))';
        b.style.fontWeight = '600';
      } else {
        b.style.color = 'var(--grey-light)';
        b.style.fontWeight = 'normal';
      }
    });

    statLambda.textContent = `${metrics.lambda.toFixed(1)} req/s`;
    statPhase.textContent = phaseStr;
    statCapacity.textContent = `${metrics.capacity.toFixed(1)} req/s`;
    statCores.textContent = `${metrics.cores} Core${metrics.cores > 1 ? 's' : ''} ${strategy === 'auto' ? '(Autoscaled)' : '(Fixed)'}`;

    statRho.textContent = `${metrics.measuredRho.toFixed(1)}%`;
    const overloadNote = metrics.rawLoad > 100.0 ? ' (Overload)' : '';
    statHeadroom.textContent = `Headroom: ${metrics.headroom.toFixed(1)}%${overloadNote} (24h avg: ${metrics.cumulativeRho.toFixed(1)}%)`;

    if (metrics.measuredRho >= 95.0 || metrics.rawLoad > 100.0) {
      statRho.style.color = '#f44336';
    } else if (metrics.measuredRho > 75.0) {
      statRho.style.color = '#ffb74d';
    } else {
      statRho.style.color = 'rgb(var(--primary))';
    }

    statP50.textContent = `${metrics.p50.toFixed(2)}s`;
    statP90.textContent = `${metrics.p90.toFixed(2)}s`;
    statMean.textContent = `${metrics.meanLatency.toFixed(2)}s`;
    statWait.textContent = `Wait: ${metrics.meanWait.toFixed(2)}s`;

    if (metrics.p90 > 2.0) {
      statP90.style.color = '#f44336';
    } else if (metrics.p90 > 1.2) {
      statP90.style.color = '#ffb74d';
    } else {
      statP90.style.color = 'rgb(var(--primary))';
    }

    // Diagnostic Summary
    if (strategy === 'static') {
      if (currentHour >= 12 && currentHour <= 16) {
        diagnosticSummary.textContent = `⚠️ Peak demand (${metrics.lambda.toFixed(1)} req/s) exceeds 3-core capacity (6.0 req/s)! Severe queue backlog and latency spikes.`;
      } else if (currentHour < 6) {
        diagnosticSummary.textContent = `💸 Late night (low traffic): 3 cores provisioned for ${metrics.lambda.toFixed(1)} req/s traffic (utilization ~${metrics.measuredRho.toFixed(0)}%). Significant idle infrastructure cost.`;
      } else {
        diagnosticSummary.textContent = `Static 3-core provisioning running with variable headroom.`;
      }
    } else {
      diagnosticSummary.textContent = `✅ Autoscaling dynamically adjusted to ${metrics.cores} cores, keeping utilization near target (~70-80%) and latency low.`;
    }
  }

  // Animation Loop with Visibility Observer
  let animFrameId = null;

  function loop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    if (isRunning) {
      simStep(dt);
    }

    drawMacroCanvas();
    drawMicroCanvas();
    updateDashboard();

    animFrameId = requestAnimationFrame(loop);
  }

  function startAnimation() {
    if (!animFrameId) {
      lastTimestamp = null;
      animFrameId = requestAnimationFrame(loop);
    }
  }

  function stopAnimation() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  // IntersectionObserver to pause when offscreen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lastTimestamp = performance.now();
        startAnimation();
      } else {
        stopAnimation();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(container);

  // Event Handlers
  strategyStatic.addEventListener('click', () => {
    strategy = 'static';
    currentHour = 9.0;
    timeSlider.value = 9.0;
    strategyStatic.style.background = 'rgba(var(--primary), 0.2)';
    strategyStatic.style.borderColor = 'rgba(var(--primary), 0.6)';
    strategyAuto.style.background = 'var(--grey-dark)';
    strategyAuto.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    resetMicroSim(true);
  });

  strategyAuto.addEventListener('click', () => {
    strategy = 'auto';
    currentHour = 9.0;
    timeSlider.value = 9.0;
    strategyAuto.style.background = 'rgba(var(--primary), 0.2)';
    strategyAuto.style.borderColor = 'rgba(var(--primary), 0.6)';
    strategyStatic.style.background = 'var(--grey-dark)';
    strategyStatic.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    resetMicroSim(true);
  });

  timeSlider.addEventListener('input', (e) => {
    currentHour = parseFloat(e.target.value);
    resetMicroSim(false);
  });

  timePresets.forEach(btn => {
    btn.addEventListener('click', () => {
      const h = parseFloat(btn.getAttribute('data-hour'));
      currentHour = h;
      timeSlider.value = h;
      timePresets.forEach(b => {
        b.style.color = 'var(--grey-light)';
        b.style.fontWeight = 'normal';
      });
      btn.style.color = 'rgb(var(--primary))';
      btn.style.fontWeight = '600';
      resetMicroSim(false);
    });
  });

  btnPlayPause.addEventListener('click', () => {
    isRunning = !isRunning;
    btnPlayPause.textContent = isRunning ? '⏸' : '▶';
  });

  btnReset.addEventListener('click', () => {
    currentHour = 9.0;
    timeSlider.value = 9.0;
    resetMicroSim(true);
  });

  btnSpeed.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % speedLevels.length;
    speedMultiplier = speedLevels[speedIdx].speed;
    btnSpeed.textContent = speedLevels[speedIdx].label;
  });
}

// Auto initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDiurnalSimulator);
} else {
  initDiurnalSimulator();
}
