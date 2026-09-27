import { html, render, useEffect, useRef, useState } from '../ui/preact.js';
import { WidgetFrame } from '../ui/WidgetFrame.js';
import { RangeSlider } from '../ui/RangeSlider.js';
import { UI } from '../ui/tokens.js';
import {
  VarianceQueueEngine,
  SERVICE_B_SHORT_SEC,
  SERVICE_B_LONG_SEC
} from './variance-queue-engine.js';

const SPEEDS = [
  { factor: 0.5, label: '0.5×' },
  { factor: 1, label: '1×' }
];
const SIMULATION_RATE = 0.35;
const BATCH_SECONDS = 100;

function getThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  const primary = styles.getPropertyValue('--primary').trim();
  return {
    primary: `rgb(${primary})`,
    primarySoft: `rgba(${primary}, 0.26)`,
    foreground: styles.getPropertyValue('--grey-lighter').trim(),
    muted: styles.getPropertyValue('--grey-light').trim(),
    surface: styles.getPropertyValue('--grey-dark').trim(),
    green: '#81c784',
    greenSoft: 'rgba(129, 199, 132, 0.22)',
    orange: '#ffa726',
    orangeSoft: 'rgba(255, 167, 38, 0.25)',
    grid: 'rgba(255, 255, 255, 0.12)'
  };
}

function drawQueueBadge(ctx, text, x, y, color, colors, timelineLeft, timelineRight) {
  ctx.font = '600 10px var(--family-sans, system-ui, sans-serif)';
  const width = ctx.measureText(text).width + 12;
  const badgeX = x + 7 + width <= timelineRight - 4
    ? x + 7
    : Math.max(timelineLeft + 4, x - width - 7);
  ctx.fillStyle = colors.surface;
  ctx.globalAlpha = 0.96;
  ctx.fillRect(badgeX, y - 10, width, 20);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(badgeX, y - 10, width, 20);
  ctx.fillStyle = colors.foreground;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, badgeX + width / 2, y);
}

function drawTimeline(canvas, engine) {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  if (!width || !height) return;

  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const colors = getThemeColors();
  const left = width < 480 ? 108 : 132;
  const right = 18;
  const timelineWidth = Math.max(100, width - left - right);
  const timelineTop = 50;
  const laneHeight = Math.min(58, Math.max(44, (height - 92) / 2));
  const laneGap = 22;
  const axisY = timelineTop + laneHeight * 2 + laneGap + 22;
  const windowDuration = engine.timelineWindowSec;
  const windowStart = Math.floor(engine.simTime / windowDuration) * windowDuration;
  const windowEnd = windowStart + windowDuration;
  const timeToX = (time) => left + ((time - windowStart) / windowDuration) * timelineWidth;

  ctx.font = '500 11px var(--family-sans, system-ui, sans-serif)';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = colors.muted;
  ctx.textAlign = 'left';
  ctx.fillText('Shared arrivals', left, 18);
  ctx.textAlign = 'right';
  ctx.fillText(`t = ${engine.simTime.toFixed(1)} s`, width - right, 18);

  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const x = left + (i / 4) * timelineWidth;
    ctx.beginPath();
    ctx.moveTo(x, timelineTop - 12);
    ctx.lineTo(x, axisY - 4);
    ctx.stroke();
  }

  for (const arrival of engine.arrivals) {
    if (arrival.arrivalTime < windowStart || arrival.arrivalTime > windowEnd) continue;
    const x = timeToX(arrival.arrivalTime);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, timelineTop - 12);
    ctx.lineTo(x, timelineTop - 3);
    ctx.stroke();
  }

  const laneDefinitions = [
    { lane: engine.lanes[0], label: 'Service A', detail: 'fixed 10ms', color: colors.green },
    { lane: engine.lanes[1], label: 'Service B', detail: '90% 1ms · 10% 91ms', color: colors.orange }
  ];
  const queueSeries = laneDefinitions.map(({ lane }) => (
    engine.getQueueDepthSeries(lane, windowStart, windowEnd)
  ));
  const maxQueueDepth = Math.max(1, ...queueSeries.flat());

  laneDefinitions.forEach(({ lane, label, detail, color }, index) => {
    const y = timelineTop + index * (laneHeight + laneGap);
    const state = engine.getLaneState(lane);

    ctx.fillStyle = colors.surface;
    ctx.globalAlpha = 0.65;
    ctx.fillRect(left, y, timelineWidth, laneHeight);
    ctx.globalAlpha = 1;

    ctx.fillStyle = colors.foreground;
    ctx.font = '600 12px var(--family-sans, system-ui, sans-serif)';
    ctx.textAlign = 'right';
    ctx.fillText(label, left - 10, y + 16);
    ctx.fillStyle = colors.muted;
    ctx.font = '500 10.5px var(--family-sans, system-ui, sans-serif)';
    ctx.fillText(detail, left - 10, y + 36);

    for (const job of lane.timelineJobs) {
      if (job.endTime < windowStart || job.startTime > windowEnd) continue;
      const x = timeToX(Math.max(job.startTime, windowStart));
      const endX = timeToX(Math.min(job.endTime, windowEnd));
      const barWidth = Math.max(2, endX - x);
      const isLong = job.serviceTime === SERVICE_B_LONG_SEC;
      const isActive = job.startTime <= engine.simTime && job.endTime > engine.simTime;

      ctx.fillStyle = isLong ? colors.orangeSoft : (index === 0 ? colors.greenSoft : colors.primarySoft);
      ctx.globalAlpha = 0.82;
      ctx.fillRect(x, y + 5, barWidth, 22);
      ctx.globalAlpha = 1;

      if (isActive) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y + 5, barWidth, 22);
      }

      if (isLong || (barWidth > 34 && job.serviceTime !== SERVICE_B_SHORT_SEC)) {
        ctx.fillStyle = colors.foreground;
        ctx.font = '500 10px var(--family-sans, system-ui, sans-serif)';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(job.serviceTime * 1000)}ms`, x + barWidth / 2, y + 16);
      }
    }

    ctx.fillStyle = colors.muted;
    ctx.font = '500 9px var(--family-sans, system-ui, sans-serif)';
    ctx.textAlign = 'right';
    ctx.fillText('queue depth', left - 10, y + laneHeight - 7);

    const queueValues = queueSeries[index];
    const queueBottom = y + laneHeight - 4;
    const queueTop = queueBottom - 10;
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, queueBottom);
    ctx.lineTo(left + timelineWidth, queueBottom);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    queueValues.forEach((queueDepth, queueIndex) => {
      const x = left + (queueIndex / (queueValues.length - 1)) * timelineWidth;
      const queueY = queueBottom - (queueDepth / maxQueueDepth) * (queueBottom - queueTop);
      if (queueIndex === 0) ctx.moveTo(x, queueY);
      else ctx.lineTo(x, queueY);
    });
    ctx.stroke();

    const playheadX = Math.max(left, Math.min(left + timelineWidth, timeToX(engine.simTime)));
    drawQueueBadge(
      ctx,
      `queue ${state.queueLength}`,
      playheadX,
      y + 31,
      color,
      colors,
      left,
      left + timelineWidth
    );
  });

  const playheadX = Math.max(left, Math.min(left + timelineWidth, timeToX(engine.simTime)));
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(playheadX, timelineTop - 14);
  ctx.lineTo(playheadX, axisY - 4);
  ctx.stroke();

  ctx.strokeStyle = colors.muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(left, axisY);
  ctx.lineTo(left + timelineWidth, axisY);
  ctx.stroke();

  ctx.fillStyle = colors.muted;
  ctx.font = '500 10.5px var(--family-sans, system-ui, sans-serif)';
  ctx.textAlign = 'center';
  for (let i = 0; i <= 4; i += 1) {
    const x = left + (i / 4) * timelineWidth;
    const time = windowStart + (windowDuration * i) / 4;
    ctx.fillText(`${Math.round(time * 1000)}ms`, x, axisY + 12);
  }
}

function formatWaitMs(value) {
  if (value == null) return '…';
  if (!Number.isFinite(value)) return '∞';
  return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${value.toFixed(0)}ms`;
}

export function VarianceQueueSimulator() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const playingRef = useRef(true);
  const speedRef = useRef(SPEEDS[0].factor);
  const [lambda, setLambda] = useState(80);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [metrics, setMetrics] = useState({
    timeMs: 0,
    arrivals: 0,
    lanes: [{ queueLength: 0, meanWaitMs: 0 }, { queueLength: 0, meanWaitMs: 0 }]
  });

  useEffect(() => {
    const engine = new VarianceQueueEngine({ lambda, seed: 42 });
    engineRef.current = engine;
    playingRef.current = true;
    setIsPlaying(true);

    let animationId;
    let lastTime = performance.now();
    let lastMetricsTime = lastTime;

    const resizeObserver = new ResizeObserver(() => {
      if (canvasRef.current) drawTimeline(canvasRef.current, engine);
    });
    if (canvasRef.current?.parentElement) resizeObserver.observe(canvasRef.current.parentElement);

    const loop = (timestamp) => {
      const elapsed = Math.min(0.05, (timestamp - lastTime) / 1000);
      lastTime = timestamp;

      if (playingRef.current) engine.step(elapsed * SIMULATION_RATE * speedRef.current);

      if (timestamp - lastMetricsTime >= 100) {
        setMetrics(engine.getMetrics());
        lastMetricsTime = timestamp;
      }
      if (canvasRef.current) drawTimeline(canvasRef.current, engine);
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [lambda]);

  const togglePlaying = () => {
    const next = !isPlaying;
    playingRef.current = next;
    setIsPlaying(next);
  };

  const reset = () => {
    engineRef.current?.reset();
    setMetrics(engineRef.current?.getMetrics());
  };

  const runBatch = () => {
    if (!engineRef.current) return;
    engineRef.current.step(BATCH_SECONDS);
    playingRef.current = false;
    setIsPlaying(false);
    setMetrics(engineRef.current.getMetrics());
  };

  const cycleSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length;
    speedRef.current = SPEEDS[next].factor;
    setSpeedIndex(next);
  };

  const a = metrics.lanes[0] || { queueLength: 0, meanWaitMs: 0 };
  const b = metrics.lanes[1] || { queueLength: 0, meanWaitMs: 0 };

  return html`
    <${WidgetFrame}
      title="Service-time variance in a FIFO queue"
      descriptor="The same arrivals feed two workers with the same mean service time">
      <div class="tw-p-3.5 tw-font-serif tw-text-[var(--grey-lighter)]">
        <div class="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-2.5 tw-mb-3">
          <div class="tw-flex tw-items-center tw-gap-2 tw-flex-wrap">
            <button type="button" class=${UI.btn.ctrl} onClick=${togglePlaying}>
              ${isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button type="button" class=${UI.btn.ctrl} onClick=${reset}>↺ Reset</button>
            <button type="button" class=${UI.btn.ctrl} onClick=${cycleSpeed} aria-label="Animation speed: ${SPEEDS[speedIndex].label}">${SPEEDS[speedIndex].label}</button>
            <div class="tw-flex tw-items-center tw-border-l tw-border-[var(--ring-border)] tw-pl-2">
              <button type="button" class=${UI.btn.ctrl} onClick=${runBatch} title="Advance the simulation by 100 seconds and pause">Run ${BATCH_SECONDS}s</button>
            </div>
          </div>
          <div class="tw-text-xs tw-text-[var(--grey-light)] tw-tabular-nums">
            Same λ = ${lambda} req/s · mean S = 10ms
          </div>
        </div>

        <div class="tw-mb-3">
          <${RangeSlider}
            id="variance-queue-lambda"
            label="Arrival Rate (λ)"
            valueText="${lambda} req/s"
            min=${40}
            max=${100}
            step=${5}
            value=${lambda}
            onChange=${setLambda} />
        </div>

        <div class="tw-relative tw-w-full tw-h-[250px] tw-bg-[var(--grey-dark)] tw-rounded-lg tw-overflow-hidden">
          <canvas ref=${canvasRef} aria-label="Animated comparison of fixed and high-variance service times" class="tw-w-full tw-h-full tw-block"></canvas>
        </div>

        <div class="tw-flex tw-justify-between tw-flex-wrap tw-gap-x-4 tw-gap-y-1 tw-mt-2 tw-text-xs tw-text-[var(--grey-light)] tw-tabular-nums" aria-live="polite">
          <span><span class="tw-text-[#81c784]">Service A</span>: mean wait ${formatWaitMs(a.meanWaitMs)} · theory ${formatWaitMs(a.theoryWaitMs)}</span>
          <span><span class="tw-text-[#ffa726]">Service B</span>: mean wait ${formatWaitMs(b.meanWaitMs)} · theory ${formatWaitMs(b.theoryWaitMs)}</span>
        </div>
      </div>
    <//>
  `;
}

export function initVarianceQueueSimulator(containerId = '#variance-queue-simulator') {
  const container = document.querySelector(containerId);
  if (!container) return;
  render(html`<${VarianceQueueSimulator} />`, container);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initVarianceQueueSimulator());
  } else {
    initVarianceQueueSimulator();
  }
}
