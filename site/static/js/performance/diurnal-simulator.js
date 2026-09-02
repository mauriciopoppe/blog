import { html, render, useState, useEffect, useRef } from '../ui/preact.js';
import { WidgetFrame } from '../ui/WidgetFrame.js';
import { SegmentedGroup } from '../ui/SegmentedGroup.js';
import { RangeSlider } from '../ui/RangeSlider.js';
import { MetricCard } from '../ui/MetricCard.js';
import { UI } from '../ui/tokens.js';
import { QueuingEngine } from './queuing-engine.js';

export function getDiurnalLambda(hour) {
  const baseTrough = 1.2;
  const peakAmp = 6.8;
  const bell = Math.exp(-Math.pow(hour - 14.0, 2) / (2 * Math.pow(3.8, 2)));
  const morningBump = 1.0 * Math.exp(-Math.pow(hour - 9.0, 2) / (2 * Math.pow(1.8, 2)));
  return baseTrough + peakAmp * bell + morningBump;
}

export function getProvisionedCores(hour, strat) {
  if (strat === 'static') {
    return 3;
  }
  const currentLam = getDiurnalLambda(hour);
  const desired = Math.ceil(currentLam / (0.70 * 2.0));
  return Math.max(1, Math.min(6, desired));
}

const STRATEGY_OPTIONS = [
  { label: 'Static (3 Cores)', value: 'static' },
  { label: 'Autoscaling (Target 70%)', value: 'auto' }
];

const TIME_PRESETS = [
  { hour: 3, label: '03:00 (Night)' },
  { hour: 9, label: '09:00 (Morning)' },
  { hour: 14, label: '14:00 (Peak)' },
  { hour: 21, label: '21:00 (Evening)' }
];

const SPEED_LEVELS = [
  { label: '1.0x', speed: 1.0 },
  { label: '2.0x', speed: 2.0 },
  { label: '4.0x', speed: 4.0 }
];

export function DiurnalSimulator() {
  const macroCanvasRef = useRef(null);
  const microCanvasRef = useRef(null);
  const sliderRef = useRef(null);
  const timeLabelRef = useRef(null);
  const presetContainerRef = useRef(null);
  const engineRef = useRef(null);
  const drawRef = useRef(null);
  const stateRef = useRef({
    currentHour: 9.0,
    strategy: 'auto',
    isRunning: true,
    speedMultiplier: 1.0,
    speedIdx: 0
  });

  const [strategy, setStrategy] = useState('auto');
  const [isRunning, setIsRunning] = useState(true);
  const [speedIdx, setSpeedIdx] = useState(0);

  const [metrics, setMetrics] = useState({
    lambda: 5.6,
    capacity: 8.0,
    cores: 4,
    measuredRho: 70.0,
    headroom: 30.0,
    p50: 0.5,
    p90: 1.1,
    meanLatency: 0.6,
    meanWait: 0.1
  });

  useEffect(() => {
    stateRef.current.strategy = strategy;
    stateRef.current.isRunning = isRunning;
    stateRef.current.speedMultiplier = SPEED_LEVELS[speedIdx].speed;
    stateRef.current.speedIdx = speedIdx;
  }, [strategy, isRunning, speedIdx]);

  const getTimeString = (h) => {
    const hourInt = Math.floor(h);
    const minInt = Math.floor((h % 1) * 60);
    const timeStr = `${hourInt.toString().padStart(2, '0')}:${minInt.toString().padStart(2, '0')}`;
    let phaseStr = 'Late Night (Low Traffic)';
    if (h >= 6 && h < 11) phaseStr = 'Morning Ramp';
    else if (h >= 11 && h < 18) phaseStr = 'Peak Business';
    else if (h >= 18 && h < 23) phaseStr = 'Evening Taper';
    return { timeStr, phaseStr };
  };

  const syncSlider = (hour) => {
    if (sliderRef.current) {
      sliderRef.current.value = hour;
      const pct = (hour / 24) * 100;
      sliderRef.current.style.setProperty('--range-fill', `${pct.toFixed(1)}%`);
    }
  };

  const updateTimeDisplay = (h) => {
    const { timeStr, phaseStr } = getTimeString(h);
    if (timeLabelRef.current) {
      timeLabelRef.current.textContent = `${timeStr} (${phaseStr})`;
    }
    const activePresetHour = h < 6 ? 3 : h < 11 ? 9 : h < 18 ? 14 : 21;
    if (presetContainerRef.current) {
      const btns = presetContainerRef.current.querySelectorAll('button[data-hour]');
      btns.forEach((btn) => {
        const btnHour = Number(btn.getAttribute('data-hour'));
        if (btnHour === activePresetHour) {
          btn.className = 'tw-absolute tw-text-[0.72rem] tw-cursor-pointer tw-text-center tw-whitespace-nowrap tw-bg-transparent tw-border-0 tw-p-0 tw-text-primary tw-font-semibold';
        } else {
          btn.className = 'tw-absolute tw-text-[0.72rem] tw-cursor-pointer tw-text-center tw-whitespace-nowrap tw-bg-transparent tw-border-0 tw-p-0 tw-text-[var(--grey-light)] hover:tw-text-primary';
        }
      });
    }
  };

  const setTime = (val) => {
    const num = Math.max(0, Math.min(24, Number(val)));
    stateRef.current.currentHour = num;
    syncSlider(num);
    updateTimeDisplay(num);
    if (engineRef.current) {
      const lam = getDiurnalLambda(num);
      const cores = getProvisionedCores(num, stateRef.current.strategy);
      engineRef.current.setParameters({ lambda: lam, cores, mu: 2.0 });
      engineRef.current.reset();
    }
    if (drawRef.current) {
      drawRef.current.drawMacroCanvas(num, stateRef.current.strategy);
      drawRef.current.drawMicroCanvas();
    }
  };

  useEffect(() => {
    const macroCanvas = macroCanvasRef.current;
    const microCanvas = microCanvasRef.current;
    if (!macroCanvas || !microCanvas) return;

    const macroCtx = macroCanvas.getContext('2d');
    const microCtx = microCanvas.getContext('2d');
    const MU_RATE = 2.0;
    const WINDOW_DURATION = 5.0;

    const engine = new QueuingEngine({
      lambda: getDiurnalLambda(9.0),
      cores: getProvisionedCores(9.0, 'auto'),
      mu: MU_RATE,
      windowDuration: WINDOW_DURATION
    });
    engineRef.current = engine;

    let macroWidth = 700;
    let macroHeight = 110;
    let microWidth = 700;
    let microHeight = 165;

    function resizeCanvases() {
      if (!macroCanvas.parentElement || !microCanvas.parentElement) return;
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
    syncSlider(9.0);
    updateTimeDisplay(9.0);

    function drawMacroCanvas(hour, strat) {
      macroCtx.clearRect(0, 0, macroWidth, macroHeight);

      const leftPad = 50;
      const rightPad = 20;
      const topPad = 16;
      const botPad = 22;
      const plotW = macroWidth - leftPad - rightPad;
      const plotH = macroHeight - topPad - botPad;
      const maxRate = 14.0;

      macroCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      macroCtx.lineWidth = 1;
      macroCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      macroCtx.font = '10px sans-serif';
      macroCtx.textAlign = 'center';

      for (let t = 0; t <= 24; t += 4) {
        const x = leftPad + (t / 24) * plotW;
        macroCtx.beginPath();
        macroCtx.moveTo(x, topPad);
        macroCtx.lineTo(x, topPad + plotH);
        macroCtx.stroke();
        macroCtx.fillText(`${t}:00`, x, topPad + plotH + 14);
      }

      for (let r = 0; r <= maxRate; r += 4) {
        const y = topPad + plotH - (r / maxRate) * plotH;
        macroCtx.beginPath();
        macroCtx.moveTo(leftPad, y);
        macroCtx.lineTo(leftPad + plotW, y);
        macroCtx.stroke();
        macroCtx.textAlign = 'right';
        macroCtx.fillText(`${r}`, leftPad - 8, y + 3);
      }

      // Provisioned Capacity Step Area C(t)
      macroCtx.strokeStyle = '#4caf50';
      macroCtx.lineWidth = 1.8;
      macroCtx.beginPath();
      for (let hStep = 0; hStep <= 24; hStep += 0.2) {
        const cap = getProvisionedCores(hStep, strat) * MU_RATE;
        const x = leftPad + (hStep / 24) * plotW;
        const y = topPad + plotH - (cap / maxRate) * plotH;
        if (hStep === 0) macroCtx.moveTo(x, y);
        else macroCtx.lineTo(x, y);
      }
      macroCtx.stroke();

      // Traffic Demand Area Gradient Fill
      const grad = macroCtx.createLinearGradient(0, topPad, 0, topPad + plotH);
      grad.addColorStop(0, 'rgba(235, 87, 87, 0.38)');
      grad.addColorStop(1, 'rgba(235, 87, 87, 0.03)');

      macroCtx.fillStyle = grad;
      macroCtx.beginPath();
      macroCtx.moveTo(leftPad, topPad + plotH);
      for (let hStep = 0; hStep <= 24; hStep += 0.2) {
        const lam = getDiurnalLambda(hStep);
        const x = leftPad + (hStep / 24) * plotW;
        const y = topPad + plotH - (lam / maxRate) * plotH;
        macroCtx.lineTo(x, y);
      }
      macroCtx.lineTo(leftPad + plotW, topPad + plotH);
      macroCtx.closePath();
      macroCtx.fill();

      // Traffic Demand Stroke λ(t)
      macroCtx.strokeStyle = 'rgb(var(--primary))';
      macroCtx.lineWidth = 2.4;
      macroCtx.beginPath();
      for (let hStep = 0; hStep <= 24; hStep += 0.2) {
        const lam = getDiurnalLambda(hStep);
        const x = leftPad + (hStep / 24) * plotW;
        const y = topPad + plotH - (lam / maxRate) * plotH;
        if (hStep === 0) macroCtx.moveTo(x, y);
        else macroCtx.lineTo(x, y);
      }
      macroCtx.stroke();

      // Legend
      macroCtx.font = '10px sans-serif';
      macroCtx.textAlign = 'left';
      macroCtx.fillStyle = 'rgb(var(--primary))';
      macroCtx.fillText('— Traffic Demand λ(t)', leftPad + 10, topPad + 4);
      macroCtx.fillStyle = '#4caf50';
      macroCtx.fillText('— Capacity C(t)', leftPad + 145, topPad + 4);

      // Current Time Needle & Indicators
      const needleX = leftPad + (hour / 24) * plotW;
      macroCtx.strokeStyle = '#ffffff';
      macroCtx.lineWidth = 1.8;
      macroCtx.beginPath();
      macroCtx.moveTo(needleX, topPad - 3);
      macroCtx.lineTo(needleX, topPad + plotH + 3);
      macroCtx.stroke();

      macroCtx.fillStyle = '#ffffff';
      macroCtx.beginPath();
      macroCtx.arc(needleX, topPad - 3, 3.5, 0, Math.PI * 2);
      macroCtx.fill();

      macroCtx.beginPath();
      macroCtx.moveTo(needleX - 3.5, topPad + plotH - 1);
      macroCtx.lineTo(needleX + 3.5, topPad + plotH - 1);
      macroCtx.lineTo(needleX, topPad + plotH + 4);
      macroCtx.closePath();
      macroCtx.fill();
    }

    function drawMicroCanvas() {
      microCtx.clearRect(0, 0, microWidth, microHeight);

      const leftPad = 68;
      const rightPad = 20;
      const topPad = 18;
      const botPad = 22;
      const plotW = microWidth - leftPad - rightPad;
      const plotH = microHeight - topPad - botPad;

      const totalTracks = 1 + engine.workers.length;
      const laneH = Math.min(22, (plotH - (totalTracks - 1) * 4) / totalTracks);

      microCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      microCtx.lineWidth = 1;
      microCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      microCtx.font = '10px sans-serif';
      microCtx.textAlign = 'center';

      for (let t = 0; t <= WINDOW_DURATION; t += 1.0) {
        const x = leftPad + (t / WINDOW_DURATION) * plotW;
        microCtx.beginPath();
        microCtx.moveTo(x, topPad);
        microCtx.lineTo(x, topPad + plotH);
        microCtx.stroke();
        microCtx.fillText(`${t.toFixed(0)}s`, x, topPad + plotH + 14);
      }

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

      microCtx.fillStyle = engine.queue.length > 0 ? 'rgba(255, 213, 79, 0.85)' : 'rgba(255, 255, 255, 0.25)';
      microCtx.fillText(`(${engine.queue.length} in queue)`, leftPad + 8, qY + laneH / 2 + 3);

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

        w.blocks.forEach((b) => {
          const x1 = leftPad + (b.start / WINDOW_DURATION) * plotW;
          const visEnd = Math.min(engine.sweepTime, b.end);
          if (visEnd > b.start) {
            const x2 = leftPad + (visEnd / WINDOW_DURATION) * plotW;
            const bw = Math.max(2, x2 - x1);

            const isTail = (b.duration || 0.5) > 0.75;
            microCtx.fillStyle = isTail ? 'rgba(245, 158, 11, 0.30)' : 'rgba(16, 185, 129, 0.26)';
            microCtx.strokeStyle = isTail ? 'rgba(245, 158, 11, 0.90)' : 'rgba(16, 185, 129, 0.85)';
            microCtx.lineWidth = 1;
            microCtx.beginPath();
            microCtx.roundRect(x1, lY + 2, bw, laneH - 4, 3);
            microCtx.fill();
            microCtx.stroke();

            if (bw > 26) {
              microCtx.fillStyle = isTail ? '#fef3c7' : '#d1fae5';
              microCtx.font = '9px sans-serif';
              microCtx.textAlign = 'center';
              const durText = b.duration ? `${b.duration.toFixed(2)}s` : '0.50s';
              microCtx.fillText(durText, x1 + bw / 2, lY + laneH / 2 + 3);
            }
          }
        });
      });

      const sweepX = leftPad + (engine.sweepTime / WINDOW_DURATION) * plotW;
      microCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      microCtx.lineWidth = 1.5;
      microCtx.beginPath();
      microCtx.moveTo(sweepX, topPad - 3);
      microCtx.lineTo(sweepX, topPad + plotH + 3);
      microCtx.stroke();
    }

    let lastTimestamp = null;
    let animId = null;

    function loop(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      const { isRunning: running, currentHour: h, strategy: strat, speedMultiplier } = stateRef.current;

      let nextH = h;
      if (running) {
        const hourDelta = dt * 0.20 * speedMultiplier;
        nextH = (h + hourDelta) % 24.0;
        stateRef.current.currentHour = nextH;
        syncSlider(nextH);
        updateTimeDisplay(nextH);

        const currentLam = getDiurnalLambda(nextH);
        const activeCores = getProvisionedCores(nextH, strat);
        engine.setParameters({ lambda: currentLam, cores: activeCores, mu: MU_RATE });
        engine.step(dt * 0.40 * speedMultiplier);
      }

      drawMacroCanvas(nextH, strat);
      drawMicroCanvas();
      setMetrics(engine.getMetrics());

      animId = requestAnimationFrame(loop);
    }

    drawRef.current = { drawMacroCanvas, drawMicroCanvas };
    animId = requestAnimationFrame(loop);

    return () => {
      drawRef.current = null;
      window.removeEventListener('resize', resizeCanvases);
      if (animId) cancelAnimationFrame(animId);
      engine.dispose?.();
    };
  }, []);

  const handleStrategyChange = (newStrat) => {
    setStrategy(newStrat);
    stateRef.current.strategy = newStrat;
    if (engineRef.current) {
      const lam = getDiurnalLambda(stateRef.current.currentHour);
      const cores = getProvisionedCores(stateRef.current.currentHour, newStrat);
      engineRef.current.setParameters({ lambda: lam, cores, mu: 2.0 });
      engineRef.current.reset();
    }
    if (drawRef.current) {
      drawRef.current.drawMacroCanvas(stateRef.current.currentHour, newStrat);
      drawRef.current.drawMicroCanvas();
    }
  };

  const handlePlayToggle = () => {
    const next = !isRunning;
    setIsRunning(next);
    stateRef.current.isRunning = next;
  };

  const handleReset = () => {
    setTime(9.0);
  };

  const handleSpeedToggle = () => {
    const nextIdx = (speedIdx + 1) % SPEED_LEVELS.length;
    setSpeedIdx(nextIdx);
  };

  let diagnosticText = '';
  if (strategy === 'static') {
    if (stateRef.current.currentHour >= 12 && stateRef.current.currentHour <= 16) {
      diagnosticText = `⚠️ Peak demand (${metrics.lambda.toFixed(1)} req/s) exceeds 3-core capacity (6.0 req/s)! Severe queue backlog and latency spikes.`;
    } else if (stateRef.current.currentHour < 6) {
      diagnosticText = `💸 Late night (low traffic): 3 cores provisioned for ${metrics.lambda.toFixed(1)} req/s traffic (utilization ~${metrics.measuredRho.toFixed(0)}%). Significant idle infrastructure cost.`;
    } else {
      diagnosticText = 'Static 3-core provisioning running with variable headroom.';
    }
  } else {
    diagnosticText = `✅ Autoscaling dynamically adjusted to ${metrics.cores} cores, keeping utilization near target (~70-80%) and latency low.`;
  }

  return html`
    <${WidgetFrame}
      title="Diurnal Traffic & Capacity Simulator"
      descriptor="24-hour cyclical load with microscopic queue simulation">
      <div class="tw-p-3.5">
        <div class="tw-flex tw-justify-between tw-items-center tw-flex-wrap tw-gap-2.5 tw-mb-3.5">
          <div class="tw-flex tw-items-center tw-gap-2 tw-flex-wrap">
            <${SegmentedGroup}
              options=${STRATEGY_OPTIONS}
              value=${strategy}
              onChange=${handleStrategyChange} />
            <div class="tw-w-px tw-h-[18px] tw-bg-white/15 tw-mx-1"></div>
            <button type="button" class=${UI.btn.ctrl} onClick=${handlePlayToggle} title="Play / Pause">
              ${isRunning ? '⏸' : '▶'}
            </button>
            <button type="button" class=${UI.btn.ctrl} onClick=${handleReset} title="Reset to 9:00 (Morning)">
              ↺
            </button>
            <button type="button" class=${UI.btn.ctrl} onClick=${handleSpeedToggle}>
              ${SPEED_LEVELS[speedIdx].label}
            </button>
          </div>
        </div>

        <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-p-3 tw-mb-4">
          <div class="tw-flex tw-justify-between tw-items-center tw-gap-2 tw-text-[0.75rem] tw-mb-2">
            <span class="tw-text-[var(--grey-light)]">Time of Day</span>
            <span ref=${timeLabelRef} class="tw-font-semibold tw-text-primary">09:00 (Morning Ramp)</span>
          </div>

          <div ref=${presetContainerRef} class="tw-relative tw-w-full tw-h-[26px] tw-mt-2 tw-mb-3">
            ${TIME_PRESETS.map((p) => {
              const leftPct = (p.hour / 24) * 100;
              const isActive = p.hour === 9;

              return html`
                <button
                  key=${p.hour}
                  data-hour=${p.hour}
                  type="button"
                  class="tw-absolute tw-text-[0.72rem] tw-cursor-pointer tw-text-center tw-whitespace-nowrap tw-bg-transparent tw-border-0 tw-p-0 ${isActive ? 'tw-text-primary tw-font-semibold' : 'tw-text-[var(--grey-light)] hover:tw-text-primary'}"
                  style="left: ${leftPct}%; transform: translateX(-50%);"
                  onClick=${() => setTime(p.hour)}>
                  <span>${p.label}</span>
                  <span class="tw-block tw-text-[0.68rem] tw-leading-none -tw-mt-0.5">↓</span>
                </button>
              `;
            })}
          </div>

          <${RangeSlider}
            className="tw-mt-3"
            inputRef=${sliderRef}
            id="diurnal-time-slider"
            min=${0}
            max=${24}
            step=${0.1}
            defaultValue=${9.0}
            onChange=${(val) => setTime(val)} />
        </div>

        <div class="tw-relative tw-w-full tw-h-[110px] tw-bg-[var(--grey-dark)] tw-rounded-lg tw-overflow-hidden tw-mb-2.5">
          <canvas ref=${macroCanvasRef} class="tw-w-full tw-h-full tw-block"></canvas>
        </div>

        <div class="tw-flex tw-justify-between tw-items-center tw-mb-1 tw-px-0.5">
          <div class="tw-text-[0.74rem] tw-font-semibold tw-text-primary tw-flex tw-items-center tw-gap-1 tw-font-sans">
            <span>🔍</span> <span>Microscopic Core Activity (Sampled at Vertical Needle Above)</span>
          </div>
          <div class="tw-text-[0.68rem] tw-text-[var(--grey-light)]">5.0s Sample Slice</div>
        </div>

        <div class="tw-relative tw-w-full tw-h-[165px] tw-bg-[var(--grey-dark)] tw-rounded-lg tw-overflow-hidden tw-mb-3">
          <canvas ref=${microCanvasRef} class="tw-w-full tw-h-full tw-block"></canvas>
        </div>

        <div class="tw-grid tw-grid-cols-[repeat(auto-fit,minmax(115px,1fr))] tw-gap-2 tw-mb-2">
          <${MetricCard}
            label="Traffic Demand (λ)"
            value="${metrics.lambda.toFixed(1)} req/s"
            caption=${getTimeString(stateRef.current.currentHour).phaseStr} />
          <${MetricCard}
            label="Capacity (c · μ)"
            value="${metrics.capacity.toFixed(1)} req/s"
            caption="${metrics.cores} Core${metrics.cores > 1 ? 's' : ''} ${strategy === 'auto' ? '(Auto)' : '(Fixed)'}" />
          <${MetricCard}
            label="Util (5s window)"
            value="${metrics.measuredRho.toFixed(1)}%"
            caption="Headroom: ${metrics.headroom.toFixed(1)}%"
            valueColor=${metrics.measuredRho > 90 ? 'tw-text-[#f44336]' : metrics.measuredRho > 75 ? 'tw-text-[#ffb74d]' : 'tw-text-primary'} />
          <${MetricCard}
            label="Latency (P50)"
            value="${metrics.p50.toFixed(2)}s"
            caption="Mean: ${metrics.meanLatency.toFixed(2)}s" />
          <${MetricCard}
            label="Tail Latency (P90)"
            value="${metrics.p90.toFixed(2)}s"
            caption="Wait: ${metrics.meanWait.toFixed(2)}s"
            valueColor=${metrics.p90 > 1.5 ? 'tw-text-[#f44336]' : metrics.p90 > 1.0 ? 'tw-text-[#ffb74d]' : 'tw-text-primary'} />
        </div>

        <div class="tw-text-[0.78rem] tw-text-[var(--grey-light)] tw-text-center tw-px-2 tw-py-1">
          ${diagnosticText}
        </div>
      </div>
    <//>
  `;
}

export function initDiurnalSimulator(containerId = 'interactive-diurnal-simulator') {
  const container = document.getElementById(containerId);
  if (!container) return;
  render(html`<${DiurnalSimulator} />`, container);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initDiurnalSimulator());
  } else {
    initDiurnalSimulator();
  }
}
