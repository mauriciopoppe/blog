import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

function getContainerWidth(element, defaultWidth = 660) {
  if (!element) return defaultWidth;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 ? rect.width : defaultWidth;
}

/* ==========================================================================
 * Interactive M/M/1 Queuing Latency Explorer
 * ========================================================================== */
export function initQueueExplorer(containerId = '#interactive-queue-curve') {
  const container = document.querySelector(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="background: var(--grey-darker); border: 1px solid var(--grey-dark); border-radius: 12px; padding: 20px; font-family: var(--family-sans, system-ui, sans-serif);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 14px; gap: 10px;">
        <h4 style="margin: 0; font-size: 1.15rem; color: var(--grey-lighter);">Interactive M/M/1 Queuing Latency Curve</h4>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.85rem; color: var(--grey-light);">Service Capacity (μ):</span>
          <strong id="mu-val" style="color: rgb(var(--primary)); font-size: 0.95rem;">100 req/s</strong>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <input type="range" id="mu-slider" min="50" max="200" step="10" value="100" style="width: 100%; accent-color: rgb(var(--primary));">
      </div>

      <div id="queue-d3-chart" style="width: 100%; height: 320px; position: relative;"></div>

      <div id="queue-hover-info" style="margin-top: 10px; font-size: 0.85rem; color: var(--grey-light); display: flex; justify-content: space-around; background: var(--grey-dark); padding: 10px; border-radius: 8px; text-align: center;">
        <div>Arrival Rate (λ): <strong id="hover-lambda" style="color: var(--grey-lighter);">50 req/s</strong></div>
        <div>Utilization (ρ = λ/μ): <strong id="hover-rho" style="color: var(--grey-lighter);">50.0%</strong></div>
        <div>Response Time (W): <strong id="hover-w" style="color: rgb(var(--primary));">20.0 ms</strong></div>
      </div>
    </div>
  `;

  const chartEl = container.querySelector('#queue-d3-chart');
  const muSlider = container.querySelector('#mu-slider');
  const muVal = container.querySelector('#mu-val');
  const hoverLambda = container.querySelector('#hover-lambda');
  const hoverRho = container.querySelector('#hover-rho');
  const hoverW = container.querySelector('#hover-w');

  let mu = 100;
  const margin = { top: 20, right: 35, bottom: 45, left: 60 };

  const svg = d3.select(chartEl)
    .append('svg')
    .attr('class', 'tex2jax_ignore')
    .attr('width', '100%')
    .attr('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const gridGroup = g.append('g').attr('class', 'grid');
  const xAxisGroup = g.append('g').attr('class', 'x-axis');
  const yAxisGroup = g.append('g').attr('class', 'y-axis');

  const curvePath = g.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'rgb(var(--primary))')
    .attr('stroke-width', 3.5);

  const kneeCircle = g.append('circle')
    .attr('r', 6)
    .attr('fill', 'rgb(var(--primary))')
    .attr('stroke', 'var(--grey-lighter)')
    .attr('stroke-width', 2);

  const kneeText = g.append('text')
    .attr('fill', 'rgb(var(--primary))')
    .attr('font-size', '11px')
    .attr('font-weight', '600');

  const asymptoteLine = g.append('line')
    .attr('stroke', 'var(--grey)')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '5 4');

  const asymptoteText = g.append('text')
    .attr('fill', 'var(--grey)')
    .attr('font-size', '11px')
    .attr('text-anchor', 'end');

  const hoverLine = g.append('line')
    .attr('stroke', 'var(--grey-lighter)')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3 3')
    .style('opacity', 0);

  const hoverDot = g.append('circle')
    .attr('r', 5)
    .attr('fill', 'var(--grey-lighter)')
    .style('opacity', 0);

  const overlay = g.append('rect')
    .attr('fill', 'none')
    .attr('pointer-events', 'all');

  function updateChart() {
    const width = getContainerWidth(chartEl, 600) - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    overlay.attr('width', width).attr('height', height);

    const xScale = d3.scaleLinear().domain([0, mu * 1.08]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, (1000 / mu) * 8]).range([height, 0]);

    gridGroup.call(
      d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat('')
    ).selectAll('line')
      .attr('stroke', 'var(--grey-dark)')
      .attr('stroke-dasharray', '3 3');
    gridGroup.select('.domain').remove();

    xAxisGroup.attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .selectAll('text')
      .attr('fill', 'var(--grey-light)');
    xAxisGroup.selectAll('line').attr('stroke', 'var(--grey)');
    xAxisGroup.select('.domain').attr('stroke', 'var(--grey)');

    yAxisGroup.call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', 'var(--grey-light)');
    yAxisGroup.selectAll('line').attr('stroke', 'var(--grey)');
    yAxisGroup.select('.domain').attr('stroke', 'var(--grey)');

    const points = [];
    const step = mu / 120;
    for (let l = 0; l <= mu * 0.96; l += step) {
      const wMs = 1000 / (mu - l);
      if (wMs <= yScale.domain()[1] * 1.05) {
        points.push([l, wMs]);
      }
    }

    const lineGenerator = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    curvePath.datum(points).attr('d', lineGenerator);

    asymptoteLine
      .attr('x1', xScale(mu))
      .attr('x2', xScale(mu))
      .attr('y1', 0)
      .attr('y2', height);

    asymptoteText
      .attr('x', xScale(mu) - 6)
      .attr('y', 14)
      .text(`μ = ${mu} req/s`);

    const kneeLambda = mu * 0.8;
    const kneeW = 1000 / (mu - kneeLambda);
    kneeCircle
      .attr('cx', xScale(kneeLambda))
      .attr('cy', yScale(kneeW));

    kneeText
      .attr('x', xScale(kneeLambda) - 10)
      .attr('y', yScale(kneeW) - 12)
      .attr('text-anchor', 'end')
      .text(`Elbow (ρ=0.8, W=${kneeW.toFixed(0)}ms)`);

    overlay.on('mousemove', (event) => {
      const [mx] = d3.pointer(event);
      const curLambda = Math.max(0, Math.min(xScale.invert(mx), mu * 0.95));
      const curW = 1000 / (mu - curLambda);
      const curRho = (curLambda / mu) * 100;

      hoverLambda.textContent = `${curLambda.toFixed(1)} req/s`;
      hoverRho.textContent = `${curRho.toFixed(1)}%`;
      hoverW.textContent = `${curW.toFixed(1)} ms`;

      const px = xScale(curLambda);
      const py = yScale(curW);

      hoverLine
        .style('opacity', 1)
        .attr('x1', px).attr('x2', px)
        .attr('y1', py).attr('y2', height);

      hoverDot
        .style('opacity', 1)
        .attr('cx', px)
        .attr('cy', py);
    });

    overlay.on('mouseleave', () => {
      hoverLine.style('opacity', 0);
      hoverDot.style('opacity', 0);
    });
  }

  muSlider.addEventListener('input', (e) => {
    mu = parseInt(e.target.value, 10);
    muVal.textContent = `${mu} req/s`;
    updateChart();
  });

  window.addEventListener('resize', updateChart);
  updateChart();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initQueueExplorer());
  } else {
    initQueueExplorer();
  }
}
