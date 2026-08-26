import { CoffeeShopEngine } from '/js/performance/coffee-shop-engine.js';

export function initLittlesLawSimulator(containerId = '#interactive-littles-law-simulator') {
  const container = document.querySelector(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="background: var(--grey-darker); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; font-family: var(--family-sans, system-ui, sans-serif); color: var(--grey-lighter);">
      
      <!-- Top Bar: Header, Presets & Action Buttons -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
        <div>
          <span style="font-size: 1.05rem; font-weight: 700; color: var(--grey-lighter);">Interactive Bookstore & Lounge Simulator</span>
          <span style="font-size: 0.82rem; color: var(--grey-light); margin-left: 8px;">Little's Law (L = λ · W)</span>
        </div>
        
        <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
          <button id="coffee-preset-light" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">Quick Browse (L = 2)</button>
          <button id="coffee-preset-steady" style="background: rgba(var(--primary), 0.2); border: 1px solid rgba(var(--primary), 0.6); color: var(--grey-lighter); padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">Steady (L = 6)</button>
          <button id="coffee-preset-rush" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">Busy Lounge (L = 15)</button>
          <div style="width: 1px; height: 18px; background: rgba(255, 255, 255, 0.1); margin: 0 4px;"></div>
          <button id="coffee-btn-play" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 0; min-width: 34px; text-align: center; border-radius: 6px; font-size: 0.85rem; cursor: pointer;" title="Pause / Play">⏸</button>
          <button id="coffee-btn-reset" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-light); padding: 5px 0; min-width: 34px; text-align: center; border-radius: 6px; font-size: 0.85rem; cursor: pointer;" title="Reset Simulation">↺</button>
          <button id="coffee-btn-speed" style="background: var(--grey-dark); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--grey-lighter); padding: 5px 8px; min-width: 44px; text-align: center; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">1.0x</button>
        </div>
      </div>

      <!-- Sliders Row (Two clean columns) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: var(--grey-dark); padding: 12px 16px; border-radius: 8px; margin-bottom: 14px; border: 1px solid rgba(255, 255, 255, 0.05);">
        <!-- Slider 1: Arrival Rate (lambda) -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.80rem; color: var(--grey-light);">
            <span>Arrival Rate (λ)</span>
            <span id="coffee-val-lambda" style="font-weight: 700; color: rgb(var(--primary));">1.5 people / sec</span>
          </div>
          <input type="range" id="coffee-slider-lambda" min="0.5" max="4.0" step="0.1" value="1.5" style="width: 100%; accent-color: rgb(var(--primary)); cursor: pointer; margin-top: 6px;">
        </div>

        <!-- Slider 2: Duration in Shop (W) -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.80rem; color: var(--grey-light);">
            <span>Duration in Lounge (W)</span>
            <span id="coffee-val-w" style="font-weight: 700; color: #ffb74d;">4.0 seconds</span>
          </div>
          <input type="range" id="coffee-slider-w" min="1.0" max="8.0" step="0.5" value="4.0" style="width: 100%; accent-color: #ffb74d; cursor: pointer; margin-top: 6px;">
        </div>
      </div>

      <!-- 2D Top-View Floor Plan Canvas -->
      <div style="position: relative; width: 100%; height: 280px; background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
        <canvas id="coffee-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
      </div>

      <!-- Single Elegant Little's Law Summary Line (Theoretical vs Practical) -->
      <div style="background: var(--grey-dark); padding: 12px 18px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.06); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; font-size: 0.90rem;">
        <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
          <span style="font-weight: 700; color: var(--grey-lighter);">Little's Law:</span>
          <span style="color: var(--grey-light);">L = λ · W =</span>
          <span id="coffee-stat-formula" style="font-weight: 700; color: var(--grey-lighter);">1.5 × 4.0s = <span id="coffee-stat-l-theo" style="color: #81c784; font-weight: 800; font-size: 1.05rem;">6.0</span></span>
          <span style="color: var(--grey-light); font-size: 0.80rem;">(Theoretical Target)</span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: var(--grey-light);">Live in Store:</span>
          <span id="coffee-stat-l-obs" style="font-size: 1.15rem; font-weight: 800; color: rgb(var(--primary));">6</span>
          <span style="color: var(--grey-light); font-size: 0.80rem;">visitors (Observed Snapshot)</span>
        </div>
      </div>

    </div>
  `;

  // Initialize Engine
  const engine = new CoffeeShopEngine({
    lambda: 1.5,
    durationW: 4.0
  });

  // DOM Elements
  const canvas = container.querySelector('#coffee-canvas');
  const ctx = canvas.getContext('2d');
  const sliderLambda = container.querySelector('#coffee-slider-lambda');
  const sliderW = container.querySelector('#coffee-slider-w');
  const valLambda = container.querySelector('#coffee-val-lambda');
  const valW = container.querySelector('#coffee-val-w');

  const statFormula = container.querySelector('#coffee-stat-formula');
  const statLTheo = container.querySelector('#coffee-stat-l-theo');
  const statLObs = container.querySelector('#coffee-stat-l-obs');

  const btnPlay = container.querySelector('#coffee-btn-play');
  const btnReset = container.querySelector('#coffee-btn-reset');
  const btnSpeed = container.querySelector('#coffee-btn-speed');

  const presetLight = container.querySelector('#coffee-preset-light');
  const presetSteady = container.querySelector('#coffee-preset-steady');
  const presetRush = container.querySelector('#coffee-preset-rush');

  // Animation State
  let isRunning = true;
  let speedMultiplier = 1.0;
  let lastTime = performance.now();

  // Responsive Canvas Sizing
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Control Listeners
  sliderLambda.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    engine.setLambda(val);
    valLambda.textContent = `${val.toFixed(1)} people / sec`;
    clearActivePresets();
    updateMetricsUI();
  });

  sliderW.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    engine.setDurationW(val);
    valW.textContent = `${val.toFixed(1)} seconds`;
    clearActivePresets();
    updateMetricsUI();
  });

  function clearActivePresets() {
    [presetLight, presetSteady, presetRush].forEach(btn => {
      btn.style.background = 'var(--grey-dark)';
      btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    });
  }

  function applyPreset(btn, lambda, wVal) {
    clearActivePresets();
    btn.style.background = 'rgba(var(--primary), 0.2)';
    btn.style.borderColor = 'rgba(var(--primary), 0.6)';
    sliderLambda.value = lambda;
    sliderW.value = wVal;
    engine.setLambda(lambda);
    engine.setDurationW(wVal);
    valLambda.textContent = `${lambda.toFixed(1)} people / sec`;
    valW.textContent = `${wVal.toFixed(1)} seconds`;
    updateMetricsUI();
  }

  presetLight.addEventListener('click', () => applyPreset(presetLight, 1.0, 2.0));
  presetSteady.addEventListener('click', () => applyPreset(presetSteady, 1.5, 4.0));
  presetRush.addEventListener('click', () => applyPreset(presetRush, 2.5, 6.0));

  btnPlay.addEventListener('click', () => {
    isRunning = !isRunning;
    btnPlay.textContent = isRunning ? '⏸' : '▶';
  });

  btnReset.addEventListener('click', () => {
    engine.reset();
    updateMetricsUI();
  });

  btnSpeed.addEventListener('click', () => {
    if (speedMultiplier === 1.0) {
      speedMultiplier = 2.0;
      btnSpeed.textContent = '2.0x';
    } else {
      speedMultiplier = 1.0;
      btnSpeed.textContent = '1.0x';
    }
  });

  function updateMetricsUI() {
    const metrics = engine.getMetrics();
    const theoL = (metrics.lambda * metrics.durationW).toFixed(1);
    statFormula.innerHTML = `${metrics.lambda.toFixed(1)} × ${metrics.durationW.toFixed(1)}s = <span id="coffee-stat-l-theo" style="color: #81c784; font-weight: 800; font-size: 1.05rem;">${theoL}</span>`;
    statLObs.textContent = metrics.liveCount;
  }

  // Color Palette for visitor avatars
  const avatarColors = [
    { fill: '#ff7043', stroke: '#ffab91' }, // Orange
    { fill: '#42a5f5', stroke: '#90caf9' }, // Blue
    { fill: '#ab47bc', stroke: '#ce93d8' }, // Purple
    { fill: '#26a69a', stroke: '#80cbc4' }, // Teal
    { fill: '#ec407a', stroke: '#f48fb1' }  // Pink
  ];

  // Render Loop
  function render(timestamp) {
    const deltaMs = Math.min(50, timestamp - lastTime);
    lastTime = timestamp;

    if (isRunning) {
      const dt = (deltaMs / 1000) * speedMultiplier;
      engine.update(dt);
      updateMetricsUI();
    }

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Bookstore & Reading Lounge Floor Plan
    // Entrance Zone (Left)
    const inBoxX = 0.015 * w;
    const inBoxW = 0.085 * w;
    const inBoxY = 0.35 * h;
    const inBoxH = 0.30 * h;

    ctx.fillStyle = 'rgba(129, 199, 132, 0.08)';
    ctx.strokeStyle = 'rgba(129, 199, 132, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(inBoxX, inBoxY, inBoxW, inBoxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#81c784';
    ctx.font = 'bold 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IN', inBoxX + inBoxW / 2, inBoxY + inBoxH * 0.44);
    ctx.font = '600 9.5px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#9e9e9e';
    ctx.fillText('(λ)', inBoxX + inBoxW / 2, inBoxY + inBoxH * 0.75);

    // Lounge & Reading Area (Center)
    const loungeX = 0.12 * w;
    const loungeW = 0.74 * w;
    const loungeY = 0.15 * h;
    const loungeH = 0.72 * h;

    ctx.fillStyle = 'rgba(255, 183, 77, 0.02)';
    ctx.strokeStyle = 'rgba(255, 183, 77, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(loungeX, loungeY, loungeW, loungeH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffb74d';
    ctx.font = 'bold 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BOOKSTORE & READING LOUNGE (Duration W)', loungeX + loungeW / 2, loungeY + 18);

    // Draw Subtle Reading Desks on the floor
    const deskRows = [
      [0.22, 0.34], [0.38, 0.34], [0.54, 0.34], [0.70, 0.34],
      [0.22, 0.52], [0.38, 0.52], [0.54, 0.52], [0.70, 0.52],
      [0.22, 0.70], [0.38, 0.70], [0.54, 0.70], [0.70, 0.70]
    ];
    for (const desk of deskRows) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(desk[0] * w - 18, desk[1] * h - 10, 36, 20, 4);
      ctx.fill();
      ctx.stroke();

      // Mini Book / Coffee icon on desk
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📖', desk[0] * w, desk[1] * h + 3);
    }

    // Exit Zone (Right)
    const outBoxX = 0.885 * w;
    const outBoxW = 0.085 * w;
    const outBoxY = 0.35 * h;
    const outBoxH = 0.30 * h;

    ctx.fillStyle = 'rgba(129, 199, 132, 0.08)';
    ctx.strokeStyle = 'rgba(129, 199, 132, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(outBoxX, outBoxY, outBoxW, outBoxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#81c784';
    ctx.font = 'bold 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OUT', outBoxX + outBoxW / 2, outBoxY + outBoxH * 0.54);

    // 2. Draw Visitors with Individual Countdown Progress Bars
    const visitors = engine.getVisitors();
    for (const v of visitors) {
      const px = v.x * w;
      const py = v.y * h;
      const palette = avatarColors[v.colorVariant];

      // Subtle shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.arc(px + 1, py + 2, 10, 0, Math.PI * 2);
      ctx.fill();

      // Avatar Body
      ctx.fillStyle = palette.fill;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Individual Progress Bar above head showing remaining time W
      const barW = 20;
      const barH = 3.5;
      const barX = px - barW / 2;
      const barY = py - 16;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 2);
      ctx.fill();

      // Green progress fill indicating remaining time
      ctx.fillStyle = '#81c784';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * (1.0 - v.progress), barH, 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// Auto-mount on DOM load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initLittlesLawSimulator());
  } else {
    initLittlesLawSimulator();
  }
}
