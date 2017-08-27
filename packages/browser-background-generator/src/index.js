import { Nest, equilateral } from '@mauriciopoppe-blog/browser-triangle'
import * as d3 from 'd3'

export default function generate () {
  const containers = d3.select(document.body)
    .selectAll('svg.background-triangle-container')
    .data([
      { translate: [100, 100], side: Math.random() * 100 + 100 },
      { translate: [200, 200], side: Math.random() * 100 + 100 }
    ])

  const enter = containers.enter()
    .append('svg')
      .attr('width', 100)
      .attr('height', 100)

  const defs = enter.append('defs')
  const gradient = defs.append('linearGradient')
     .attr('id', 'svgGradient')
     .attr('x1', '0%')
     .attr('x2', '100%')
     .attr('y1', '0%')
     .attr('y2', '100%')
  gradient.append('stop')
     .attr('class', 'start')
     .attr('offset', '0%')
     .attr('stop-color', 'red')
     .attr('stop-opacity', 1)
  gradient.append('stop')
     .attr('class', 'end')
     .attr('offset', '100%')
     .attr('stop-color', 'blue')
     .attr('stop-opacity', 1)

  enter
    .append('g')
    .attr('transform', d => `translate(50, 50)`)
    .attr('class', 'background-triangle-container')
    .call(Nest({
      triangle: equilateral(80),
      rotate (i) { return (i * 5) * Math.PI / 180 },
      scale (i) { return 1 - 0.1 * i },
      iterations: 10
    }))
}
