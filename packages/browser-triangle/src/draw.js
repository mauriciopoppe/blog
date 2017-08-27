import * as d3 from 'd3'
import { nest } from './'

export function Nest (config) {
  // default getter
  const lineGenerator = d3.line().curve(d3.curveLinearClosed)

  function my (selection) {
    const t = nest(config)
    selection.each(function (d, i) {
      const root = d3.select(this)
        .append('g')
        .on('mouseenter', rotate(true))
        .on('mouseleave', rotate(false))
        .selectAll('path').data(t)

      // root.enter()
      //   .append('rect')
      //   .attr('width', 100)
      //   .attr('height', 100)

      root.enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'url(#svgGradient)')
        .attr('opacity', (d, i) => (i) / t.length)
        .attr('stroke-width', 1)
        .attr('d', lineGenerator)
        .attr('transform', `rotate(0)`)

      function rotate (rotate) {
        return function () {
          d3.select(this).selectAll('path')
            .transition()
              .duration(1000)
              .delay((_, i) => i * 100)
              .attr('transform', `rotate(${rotate ? 180 : 0})`)
        }
      }
    })
  }

  return my
}
