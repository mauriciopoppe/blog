import { CoffeeShopEngine } from '/js/performance/coffee-shop-engine.js';

export function initLittlesLawSimulator(containerId = '#interactive-littles-law-simulator') {
  const container = document.querySelector(containerId);
  if (!container) return;

  const CTRL = 'tw-font-serif tw-text-[0.9rem] tw-font-semibold tw-leading-none tw-px-3 tw-py-2 tw-rounded-[6px] tw-border tw-border-[var(--ring-border)] tw-bg-[var(--grey-dark)] tw-text-[var(--grey-light)] tw-cursor-pointer tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-bg-primary-soft hover:tw-text-primary hover:tw-shadow-raised';
  const SEG_ACTIVE = 'tw-appearance-none tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-leading-none tw-px-3 tw-py-2 tw-bg-primary-soft tw-text-primary tw-cursor-pointer';
  const SEG_INACTIVE = 'tw-appearance-none tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-leading-none tw-px-3 tw-py-2 tw-bg-transparent tw-text-[var(--grey-light)] tw-cursor-pointer hover:tw-bg-[var(--accent-tint)] hover:tw-text-primary';

  container.innerHTML = `
    <div class="tw-bg-[var(--grey-darker)] tw-rounded-[12px] tw-p-[18px] tw-font-serif tw-text-[var(--grey-lighter)]">
      <style>
        #interactive-littles-law-simulator .lls-slider { -webkit-appearance: none; appearance: none; height: 28px; background: transparent; --range-fill: 50%; }
        #interactive-littles-law-simulator .lls-slider::-webkit-slider-runnable-track { height: 8px; border-radius: 999px; background: linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) var(--range-fill), var(--ring-border) var(--range-fill), var(--ring-border) 100%); }
        #interactive-littles-law-simulator .lls-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); margin-top: -5px; box-shadow: var(--elevation-subtle); }
        #interactive-littles-law-simulator .lls-slider::-moz-range-track { height: 8px; border-radius: 999px; background: var(--ring-border); }
        #interactive-littles-law-simulator .lls-slider::-moz-range-progress { height: 8px; border-radius: 999px; background: rgb(var(--primary)); }
        #interactive-littles-law-simulator .lls-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); box-shadow: var(--elevation-subtle); }
        #interactive-littles-law-simulator .lls-slider:hover::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
        #interactive-littles-law-simulator .lls-slider:hover::-moz-range-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
        #interactive-littles-law-simulator .lls-slider:focus-visible { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; border-radius: 999px; }
      </style>

      <!-- Control Bar -->
      <div class="tw-flex tw-justify-between tw-items-center tw-flex-wrap tw-gap-2.5 tw-mb-3.5">
        <div class="tw-flex tw-items-center tw-gap-1.5 tw-flex-wrap">
          <div class="tw-inline-flex tw-border tw-border-[var(--ring-border)] tw-rounded-[6px] tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden" role="radiogroup" aria-label="Preset">
            <button type="button" id="coffee-preset-light" class="${SEG_INACTIVE}" role="radio" aria-checked="false">Quick Browse (L = 2)</button>
            <button type="button" id="coffee-preset-steady" class="${SEG_ACTIVE}" role="radio" aria-checked="true">Steady (L = 6)</button>
            <button type="button" id="coffee-preset-rush" class="${SEG_INACTIVE}" role="radio" aria-checked="false">Busy Lounge (L = 15)</button>
          </div>
          <div class="tw-w-px tw-h-[18px] tw-bg-white/15 tw-mx-1"></div>
          <button type="button" id="coffee-btn-play" class="${CTRL} tw-min-w-[34px] tw-text-center" title="Pause / Play">⏸</button>
          <button type="button" id="coffee-btn-reset" class="${CTRL} tw-min-w-[34px] tw-text-center" title="Reset Simulation">↺</button>
          <button type="button" id="coffee-btn-speed" class="${CTRL} tw-min-w-[44px] tw-text-center">1.0x</button>
        </div>
      </div>

      <!-- Sliders Row -->
      <div class="tw-grid tw-grid-cols-2 tw-gap-5 tw-mb-4">
        <div>
          <div class="tw-flex tw-justify-between tw-text-[0.8rem] tw-text-[var(--grey-light)]">
            <span>Arrival Rate (λ)</span>
            <span id="coffee-val-lambda" class="tw-font-bold tw-text-primary">1.5 people / sec</span>
          </div>
          <input type="range" id="coffee-slider-lambda" class="lls-slider tw-w-full tw-cursor-pointer tw-mt-1.5" min="0.5" max="4.0" step="0.1" value="1.5">
        </div>
        <div>
          <div class="tw-flex tw-justify-between tw-text-[0.8rem] tw-text-[var(--grey-light)]">
            <span>Duration in Lounge (W)</span>
            <span id="coffee-val-w" class="tw-font-bold tw-text-primary">4.0 seconds</span>
          </div>
          <input type="range" id="coffee-slider-w" class="lls-slider tw-w-full tw-cursor-pointer tw-mt-1.5" min="1.0" max="8.0" step="0.5" value="4.0">
        </div>
      </div>

      <!-- 2D Top-View Floor Plan Canvas -->
      <div class="tw-relative tw-w-full tw-h-[280px] tw-bg-black/25 tw-rounded-lg tw-overflow-hidden tw-mb-3">
        <canvas id="coffee-canvas" class="tw-w-full tw-h-full tw-block"></canvas>
      </div>

      <!-- Little's Law Summary Line -->
      <div class="tw-bg-[var(--grey-dark)] tw-p-3 tw-rounded-lg tw-flex tw-flex-col tw-items-start tw-gap-1 tw-text-[0.9rem]">
        <div class="tw-flex tw-items-center tw-flex-wrap tw-gap-1.5">
          <span class="tw-font-bold tw-text-[var(--grey-lighter)]">Little's Law:</span>
          <span class="tw-text-[var(--grey-light)]">L = λ · W =</span>
          <span id="coffee-stat-formula" class="tw-font-bold tw-text-[var(--grey-lighter)]">1.5 × 4.0s = <span id="coffee-stat-l-theo" class="tw-text-[#81c784] tw-font-extrabold tw-text-[1rem]">6.0</span></span>
          <span class="tw-text-[var(--grey-light)] tw-text-[0.8rem]">(Theoretical Target)</span>
        </div>
        
        <div class="tw-flex tw-items-center tw-gap-2 tw-leading-none">
          <span class="tw-text-[var(--grey-light)]">Live in Store:</span>
          <span id="coffee-stat-l-obs" class="tw-text-[1rem] tw-font-extrabold tw-text-primary">6</span>
          <span class="tw-text-[var(--grey-light)] tw-text-[0.8rem]">visitors (Observed Snapshot)</span>
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
    syncSliderFill(sliderLambda);
    clearActivePresets();
    updateMetricsUI();
  });

  sliderW.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    engine.setDurationW(val);
    valW.textContent = `${val.toFixed(1)} seconds`;
    syncSliderFill(sliderW);
    clearActivePresets();
    updateMetricsUI();
  });

  function syncSliderFill(slider) {
    const pct = ((parseFloat(slider.value) - parseFloat(slider.min)) / (parseFloat(slider.max) - parseFloat(slider.min))) * 100;
    slider.style.setProperty('--range-fill', pct + '%');
  }

  function clearActivePresets() {
    [presetLight, presetSteady, presetRush].forEach(btn => {
      btn.className = SEG_INACTIVE;
      btn.setAttribute('aria-checked', 'false');
    });
  }

  function applyPreset(btn, lambda, wVal) {
    clearActivePresets();
    btn.className = SEG_ACTIVE;
    btn.setAttribute('aria-checked', 'true');
    sliderLambda.value = lambda;
    sliderW.value = wVal;
    syncSliderFill(sliderLambda);
    syncSliderFill(sliderW);
    engine.setLambda(lambda);
    engine.setDurationW(wVal);
    valLambda.textContent = `${lambda.toFixed(1)} people / sec`;
    valW.textContent = `${wVal.toFixed(1)} seconds`;
    updateMetricsUI();
  }

  syncSliderFill(sliderLambda);
  syncSliderFill(sliderW);

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
    statFormula.innerHTML = `${metrics.lambda.toFixed(1)} × ${metrics.durationW.toFixed(1)}s = <span id="coffee-stat-l-theo" class="tw-text-[#81c784] tw-font-extrabold tw-text-[1.05rem]">${theoL}</span>`;
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
