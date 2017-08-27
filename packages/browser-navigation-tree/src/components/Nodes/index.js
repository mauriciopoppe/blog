import { select } from 'd3-selection'

import './styles.css'

const toDeg = r => r * 180 / Math.PI

function radialPoint (x, y) {
  return [y, x]
  // return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)]
}

const Nodes = (config) => {
  return function (selection) {
    selection.each(function (d, i) {
      const nodes = select(this)
        .selectAll('.tree-node-wrap').data(d.descendants())

      const delayFn = (d, i) => {
        let mult = +config.delayEach
        return config.initialDelay + (
          d.depth + 1 - mult + mult * i) * config.duration
      }

      // enter
      const wrapEnter = nodes
        .enter()
          .append('g')
          .attr('class', 'tree-node-wrap')
          .attr('transform', d => `translate(${radialPoint(d.x, d.y)})`)
        .merge(nodes)

      wrapEnter.append('circle')
          .attr('class', 'tree-node')
          .attr('r', 0)
          .attr('fill', 'transparent')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
      // enter + update
          .transition()
            .duration(config.duration)
            .delay(delayFn)
            .attr('r', 3)

      // enter
      wrapEnter.append('text')
          .on('click', config.onLabelFocus)
          .attr('class', 'tree-label')
      // enter + update
          .attr('dy', '.31em')
          .attr('x', 6)
          .style('font-size', `${Math.min(config.width, config.height) / 80}px`)
          // .attr('transform', d => (
          //   `rotate(${toDeg(d.x - Math.PI / 2)})`
          // ))
          // .attr('tabindex', 1)
          .attr('text-anchor', 'start')
          .text(d => d.data.title || d.data.path)
          .attr('fill-opacity', 0)
        .transition()
          .duration(config.duration)
          .delay(delayFn)
          .attr('fill-opacity', 1)
    })
  }
}

export default Nodes
