import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

function getContainerWidth(element, defaultWidth = 660) {
  if (!element) return defaultWidth;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 ? rect.width : defaultWidth;
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
  initChunkingSimulation();
}
