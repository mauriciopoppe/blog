import { QueuingEngine } from './queuing-engine.js';
import { html, render, useState, useEffect, useRef } from '../ui/preact.js';
import { WidgetFrame } from '../ui/WidgetFrame.js';
import { SegmentedGroup } from '../ui/SegmentedGroup.js';
import { RangeSlider } from '../ui/RangeSlider.js';
import { MetricCard } from '../ui/MetricCard.js';
import { UI } from '../ui/tokens.js';

const PRESET_OPTIONS = [
  {
    label: '35% (Under)',
    value: 'under',
    lambda: 1.4,
    cores: 2,
    mu: 2.0,
    activeClass: 'tw-appearance-none tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-leading-none tw-px-3 tw-py-2 tw-cursor-pointer tw-bg-[rgba(76,175,80,0.16)] tw-text-[#4caf50]'
  },
  {
    label: '75% (Knee)',
    value: 'knee',
    lambda: 3.0,
    cores: 2,
    mu: 2.0,
    activeClass: 'tw-appearance-none tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-leading-none tw-px-3 tw-py-2 tw-cursor-pointer tw-bg-primary-soft tw-text-primary'
  },
  {
    label: '98% (Sat)',
    value: 'sat',
    lambda: 3.9,
    cores: 2,
    mu: 2.0,
    activeClass: 'tw-appearance-none tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-leading-none tw-px-3 tw-py-2 tw-cursor-pointer tw-bg-[rgba(244,67,54,0.16)] tw-text-[#f44336]'
  }
];

const SPEED_OPTIONS = [
  { label: '1.0x', speed: 1.0 },
  { label: '2.0x', speed: 2.0 },
  { label: '4.0x', speed: 4.0 }
];

export function UtilizationSimulator() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [preset, setPreset] = useState('knee');
  const [lambda, setLambda] = useState(3.0);
  const [cores, setCores] = useState(2);
  const [mu, setMu] = useState(2.0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedIndex, setSpeedIndex] = useState(0);

  const [metrics, setMetrics] = useState({
    theoreticalRho: 75.0,
    capacity: 4.0,
    theoreticalHeadroom: 25.0,
    measuredRho: 75.0,
    headroom: 25.0,
    queueLength: 0,
    peakQueue: 0,
    p50: 0.45,
    p90: 0.95,
    meanLatency: 0.5,
    meanWait: 0.05
  });

  const WINDOW_DURATION = 5.0;

  useEffect(() => {
    const engine = new QueuingEngine({
      lambda,
      cores,
      mu,
      windowDuration: WINDOW_DURATION,
      isRunning: isPlaying
    });
    engineRef.current = engine;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let lastRealTime = performance.now();

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

    function draw() {
      const rect = canvas.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

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

      ctx.fillStyle = engine.queue.length > 0 ? 'rgba(255, 213, 79, 0.75)' : 'rgba(255, 255, 255, 0.25)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`(${engine.queue.length} waiting in queue)`, leftMargin + 10, queueY + laneHeight / 2 + 4);

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

        (w.blocks || []).forEach((block) => {
          const blockStart = block.start;
          const blockEnd = Math.min(block.end, engine.sweepTime);
          if (blockEnd > blockStart) {
            const sX = leftMargin + (blockStart / WINDOW_DURATION) * timelineWidth;
            const sW = Math.max(2, ((blockEnd - blockStart) / WINDOW_DURATION) * timelineWidth);
            const isTail = (block.duration || (1.0 / mu)) > (1.5 / mu);

            ctx.fillStyle = isTail ? 'rgba(255, 152, 0, 0.28)' : 'rgba(235, 87, 87, 0.25)';
            ctx.strokeStyle = isTail ? 'rgba(255, 152, 0, 0.85)' : 'rgba(235, 87, 87, 0.75)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(sX, laneY + 2, sW, laneHeight - 4, 3);
            ctx.fill();
            ctx.stroke();

            if (sW > 28) {
              ctx.fillStyle = isTail ? '#ffe0b2' : 'rgba(255, 255, 255, 0.9)';
              ctx.font = '10px sans-serif';
              ctx.textAlign = 'center';
              const durText = block.duration ? `${block.duration.toFixed(2)}s` : `${(1.0 / mu).toFixed(2)}s`;
              ctx.fillText(durText, sX + sW / 2, laneY + laneHeight / 2 + 3.5);
            }
          }
        });
      });

      ctx.strokeStyle = 'rgb(var(--primary))';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sweepX, topMargin);
      ctx.lineTo(sweepX, topMargin + timelineHeight);
      ctx.stroke();
    }

    function loop(timestamp) {
      const elapsedRealSec = Math.min(0.1, (timestamp - lastRealTime) / 1000);
      lastRealTime = timestamp;

      if (engine.isRunning) {
        const simDt = elapsedRealSec * 0.40 * SPEED_OPTIONS[speedIndex].speed;
        engine.step(simDt);
        const m = engine.getMetrics();
        setMetrics({ ...m });
      }

      draw();
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [speedIndex]);

  const handlePresetChange = (newVal) => {
    setPreset(newVal);
    const p = PRESET_OPTIONS.find((opt) => opt.value === newVal);
    if (!p) return;
    setLambda(p.lambda);
    setCores(p.cores);
    setMu(p.mu);
    if (engineRef.current) {
      engineRef.current.setParameters({ lambda: p.lambda, cores: p.cores, mu: p.mu });
      engineRef.current.reset();
    }
  };

  const handleLambdaChange = (val) => {
    setLambda(val);
    setPreset('');
    if (engineRef.current) engineRef.current.setParameters({ lambda: val });
  };

  const handleCoresChange = (val) => {
    const intVal = Math.round(val);
    setCores(intVal);
    setPreset('');
    if (engineRef.current) engineRef.current.setParameters({ cores: intVal });
  };

  const handleMuChange = (val) => {
    setMu(val);
    setPreset('');
    if (engineRef.current) engineRef.current.setParameters({ mu: val });
  };

  const handleTogglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (engineRef.current) engineRef.current.isRunning = next;
  };

  const handleReset = () => {
    if (engineRef.current) engineRef.current.reset();
  };

  const handleSpeedToggle = () => {
    const nextIdx = (speedIndex + 1) % SPEED_OPTIONS.length;
    setSpeedIndex(nextIdx);
  };

  let diagnosticText = `Healthy ~${metrics.theoreticalHeadroom.toFixed(0)}% headroom absorbing traffic bursts`;
  if (metrics.rawLoad >= 100.0) {
    diagnosticText = `🚨 Overload! Demand (${lambda.toFixed(1)} req/s) exceeds cluster capacity (${(cores * mu).toFixed(1)} req/s)`;
  } else if (metrics.queueLength > 3) {
    diagnosticText = `⚠️ Absorbing transient burst: ${metrics.queueLength} requests in queue, workers running at 100% capacity`;
  } else if (metrics.theoreticalRho < 55) {
    const avgS = (1.0 / mu).toFixed(2);
    diagnosticText = `Near-zero queue wait (W ≈ ${avgS}s); low hardware efficiency`;
  }

  const activePreset = preset || (
    metrics.theoreticalRho < 55 ? 'under' : metrics.theoreticalRho <= 85 ? 'knee' : 'sat'
  );

  return html`
    <${WidgetFrame}
      title="Interactive Utilization Simulator & M/M/c Gantt"
      descriptor="Real-time multi-core queuing and latency timeline">
      <div class="tw-p-4 tw-font-serif tw-text-[var(--grey-lighter)]">
        <div class="tw-flex tw-justify-between tw-items-center tw-flex-wrap tw-gap-2.5 tw-mb-3.5">
          <div class="tw-flex tw-items-center tw-gap-1.5 tw-flex-wrap">
            <${SegmentedGroup}
              options=${PRESET_OPTIONS}
              value=${activePreset}
              onChange=${handlePresetChange} />
            <div class="tw-w-px tw-h-[18px] tw-bg-white/15 tw-mx-1"></div>
            <button
              type="button"
              class=${UI.btn.ctrl}
              title="Pause / Resume"
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
              ${SPEED_OPTIONS[speedIndex].label}
            </button>
          </div>
        </div>

        <div class="tw-grid tw-grid-cols-3 tw-gap-4 tw-mb-4 max-[640px]:tw-grid-cols-1">
          <${RangeSlider}
            id="slider-lambda"
            label="Arrival Rate (λ)"
            valueText="${lambda.toFixed(1)} req/s"
            min=${0.5}
            max=${8.0}
            step=${0.1}
            value=${lambda}
            onChange=${handleLambdaChange} />
          <${RangeSlider}
            id="slider-cores"
            label="Worker Cores (c)"
            valueText="${cores} Core${cores > 1 ? 's' : ''}"
            min=${1}
            max=${4}
            step=${1}
            value=${cores}
            onChange=${handleCoresChange} />
          <${RangeSlider}
            id="slider-mu"
            label="Worker Rate (μ)"
            valueText="${mu.toFixed(1)} req/s"
            min=${0.5}
            max=${5.0}
            step=${0.1}
            value=${mu}
            onChange=${handleMuChange} />
        </div>

        <div class="tw-relative tw-w-full tw-h-[190px] tw-bg-[var(--grey-dark)] tw-rounded-lg tw-overflow-hidden tw-mb-3">
          <canvas ref=${canvasRef} class="tw-w-full tw-h-full tw-block"></canvas>
        </div>

        <div class="tw-grid tw-grid-cols-[repeat(auto-fit,minmax(115px,1fr))] tw-gap-2 tw-mb-2">
          <${MetricCard}
            label="Util (theoretical)"
            value="${metrics.theoreticalRho.toFixed(1)}%"
            caption="Cap: ${(cores * mu).toFixed(1)} req/s" />
          <${MetricCard}
            label="Util (measured)"
            value="${metrics.measuredRho.toFixed(1)}%"
            caption="Headroom: ${metrics.headroom.toFixed(1)}%"
            valueColor=${metrics.measuredRho >= 95 ? 'tw-text-[#f44336]' : metrics.measuredRho > 75 ? 'tw-text-[#ffb74d]' : 'tw-text-primary'} />
          <${MetricCard}
            label="Queue Depth"
            value="${metrics.queueLength}"
            caption="Peak: ${metrics.peakQueue}" />
          <${MetricCard}
            label="Latency (P50)"
            value="${metrics.p50.toFixed(2)}s"
            caption="Mean: ${metrics.meanLatency.toFixed(2)}s" />
          <${MetricCard}
            label="Tail Latency (P90)"
            value="${metrics.p90.toFixed(2)}s"
            caption="Wait: ${metrics.meanWait.toFixed(2)}s"
            valueColor=${metrics.p90 > 2.0 ? 'tw-text-[#f44336]' : metrics.p90 > 1.2 ? 'tw-text-[#ffb74d]' : 'tw-text-primary'} />
        </div>

        <div class="tw-text-[0.78rem] tw-text-[var(--grey-light)] tw-text-center tw-px-2 tw-py-0.5">
          ${diagnosticText}
        </div>
      </div>
    <//>
  `;
}

export function initUtilizationSimulator(containerId = '#interactive-utilization-simulator') {
  const container = document.querySelector(containerId);
  if (!container) return;
  render(html`<${UtilizationSimulator} />`, container);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initUtilizationSimulator());
  } else {
    initUtilizationSimulator();
  }
}
