import { CoffeeShopEngine } from './coffee-shop-engine.js';
import { html, render, useState, useEffect, useRef } from '../ui/preact.js';
import { WidgetFrame } from '../ui/WidgetFrame.js';
import { SegmentedGroup } from '../ui/SegmentedGroup.js';
import { RangeSlider } from '../ui/RangeSlider.js';
import { MetricCard } from '../ui/MetricCard.js';
import { UI } from '../ui/tokens.js';

const PRESETS = [
  { label: 'Quick Browse (L = 2)', value: 'light', lambda: 1.0, w: 2.0 },
  { label: 'Steady (L = 6)', value: 'steady', lambda: 1.5, w: 4.0 },
  { label: 'Busy Lounge (L = 15)', value: 'rush', lambda: 2.5, w: 6.0 }
];

export function LittlesLawSimulator() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [preset, setPreset] = useState('steady');
  const [lambda, setLambda] = useState(1.5);
  const [durationW, setDurationW] = useState(4.0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.0);
  const [liveCount, setLiveCount] = useState(6);

  useEffect(() => {
    const engine = new CoffeeShopEngine({
      lambda,
      durationW,
      running: isPlaying,
      speedMultiplier: speed
    });
    engineRef.current = engine;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let lastTime = performance.now();

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    }

    const ro = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const avatarColors = [
      { fill: '#ff7043', stroke: '#ffab91' },
      { fill: '#42a5f5', stroke: '#90caf9' },
      { fill: '#ab47bc', stroke: '#ce93d8' },
      { fill: '#26a69a', stroke: '#80cbc4' },
      { fill: '#ec407a', stroke: '#f48fb1' }
    ];

    function draw(timestamp) {
      const deltaMs = Math.min(50, timestamp - lastTime);
      lastTime = timestamp;

      if (engine.running) {
        const dt = (deltaMs / 1000) * engine.speedMultiplier;
        engine.update(dt);
        const m = engine.getMetrics();
        setLiveCount(m.liveCount);
      }

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Floor Plan
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
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('IN', inBoxX + inBoxW / 2, inBoxY + inBoxH * 0.44);
      ctx.font = '600 9.5px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('Arrivals', inBoxX + inBoxW / 2, inBoxY + inBoxH * 0.72);

      const outBoxW = 0.085 * w;
      const outBoxX = w - outBoxW - 0.015 * w;
      const outBoxY = 0.35 * h;
      const outBoxH = 0.30 * h;

      ctx.fillStyle = 'rgba(239, 83, 80, 0.08)';
      ctx.strokeStyle = 'rgba(239, 83, 80, 0.3)';
      ctx.beginPath();
      ctx.roundRect(outBoxX, outBoxY, outBoxW, outBoxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef5350';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OUT', outBoxX + outBoxW / 2, outBoxY + outBoxH * 0.44);
      ctx.font = '600 9.5px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('Departures', outBoxX + outBoxW / 2, outBoxY + outBoxH * 0.72);

      // Main Lounge Area
      const loungeX = inBoxX + inBoxW + 0.02 * w;
      const loungeW = outBoxX - loungeX - 0.02 * w;
      const loungeY = 0.06 * h;
      const loungeH = 0.88 * h;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(loungeX, loungeY, loungeW, loungeH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '600 12px var(--family-sans, system-ui, sans-serif)';
      ctx.textAlign = 'center';
      ctx.fillText('Bookstore & Reading Lounge Area', loungeX + loungeW / 2, loungeY + 22);

      // Visitors
      for (const v of engine.visitors) {
        const px = v.x * w;
        const py = v.y * h;
        const col = avatarColors[v.id % avatarColors.length];

        ctx.fillStyle = col.fill;
        ctx.strokeStyle = col.stroke;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const barW = 20;
        const barH = 3.5;
        const barX = px - barW / 2;
        const barY = py - 16;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 2);
        ctx.fill();

        ctx.fillStyle = '#81c784';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW * (1.0 - v.progress), barH, 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handlePresetChange = (newVal) => {
    setPreset(newVal);
    const p = PRESETS.find((opt) => opt.value === newVal);
    if (!p) return;
    setLambda(p.lambda);
    setDurationW(p.w);
    if (engineRef.current) {
      engineRef.current.setLambda(p.lambda);
      engineRef.current.setDurationW(p.w);
    }
  };

  const handleLambdaChange = (val) => {
    setLambda(val);
    setPreset('');
    if (engineRef.current) {
      engineRef.current.setLambda(val);
    }
  };

  const handleDurationWChange = (val) => {
    setDurationW(val);
    setPreset('');
    if (engineRef.current) {
      engineRef.current.setDurationW(val);
    }
  };

  const handleTogglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (engineRef.current) {
      engineRef.current.running = next;
    }
  };

  const handleReset = () => {
    if (engineRef.current) {
      engineRef.current.reset();
      setLiveCount(0);
    }
  };

  const handleSpeedToggle = () => {
    const nextSpeed = speed === 1.0 ? 2.0 : 1.0;
    setSpeed(nextSpeed);
    if (engineRef.current) {
      engineRef.current.speedMultiplier = nextSpeed;
    }
  };

  const theoL = (lambda * durationW).toFixed(1);

  return html`
    <${WidgetFrame}
      title="Little's Law Live Simulation (L = λ · W)"
      descriptor="Top-view Bookstore & Lounge simulation">
      <div class="tw-p-4 tw-font-serif tw-text-[var(--grey-lighter)]">
        <!-- Control Bar -->
        <div class="tw-flex tw-justify-between tw-items-center tw-flex-wrap tw-gap-2.5 tw-mb-3.5">
          <div class="tw-flex tw-items-center tw-gap-1.5 tw-flex-wrap">
            <${SegmentedGroup}
              options=${PRESETS}
              value=${preset}
              onChange=${handlePresetChange} />
            <div class="tw-w-px tw-h-[18px] tw-bg-white/15 tw-mx-1"></div>
            <button
              type="button"
              class=${UI.btn.ctrl}
              title="Pause / Play"
              onClick=${handleTogglePlay}>
              ${isPlaying ? '⏸' : '▶'}
            </button>
            <button
              type="button"
              class=${UI.btn.ctrl}
              title="Reset Simulation"
              onClick=${handleReset}>
              ↺
            </button>
            <button
              type="button"
              class=${UI.btn.ctrl}
              onClick=${handleSpeedToggle}>
              ${speed.toFixed(1)}x
            </button>
          </div>
        </div>

        <!-- Sliders Row -->
        <div class="tw-grid tw-grid-cols-2 tw-gap-5 tw-mb-4 max-[640px]:tw-grid-cols-1">
          <${RangeSlider}
            id="coffee-slider-lambda"
            label="Arrival Rate (λ)"
            valueText="${lambda.toFixed(1)} people / sec"
            min=${0.5}
            max=${4.0}
            step=${0.1}
            value=${lambda}
            onChange=${handleLambdaChange} />
          <${RangeSlider}
            id="coffee-slider-w"
            label="Duration in Lounge (W)"
            valueText="${durationW.toFixed(1)} seconds"
            min=${1.0}
            max=${8.0}
            step=${0.5}
            value=${durationW}
            onChange=${handleDurationWChange} />
        </div>

        <!-- 2D Top-View Floor Plan Canvas -->
        <div class="tw-relative tw-w-full tw-h-[280px] tw-bg-black/25 tw-rounded-lg tw-overflow-hidden tw-mb-3">
          <canvas ref=${canvasRef} class="tw-w-full tw-h-full tw-block"></canvas>
        </div>

        <!-- Little's Law Summary Metric Cards -->
        <div class="tw-grid tw-grid-cols-2 tw-gap-2">
          <${MetricCard}
            label="Theoretical Target (L = λ · W)"
            value="${theoL}"
            caption="${lambda.toFixed(1)} × ${durationW.toFixed(1)}s"
            valueColor="tw-text-[#81c784]" />
          <${MetricCard}
            label="Live Observed in Store"
            value="${liveCount}"
            caption="Snapshot Count"
            valueColor="tw-text-primary" />
        </div>
      </div>
    <//>
  `;
}

export function initLittlesLawSimulator(containerId = '#interactive-littles-law-simulator') {
  const container = document.querySelector(containerId);
  if (!container) return;
  render(html`<${LittlesLawSimulator} />`, container);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initLittlesLawSimulator());
  } else {
    initLittlesLawSimulator();
  }
}
