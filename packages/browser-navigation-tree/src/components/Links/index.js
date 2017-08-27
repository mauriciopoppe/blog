import { select } from 'd3-selection'
import { linkHorizontal } from 'd3-shape'
import { easeLinear } from 'd3-ease'
// import { transition } from 'd3-transition'

import './styles.css'

const Links = (config) => {
  function links (selection) {
    selection.each(function (d, i) {
      // console.log(d.descendants())
      const links = select(this)
        .selectAll('.tree-link').data(d.links())

      const line = linkHorizontal()
        .x(d => d.y)
        .y(d => d.x)

      // enter
      links
        .enter()
          .append('path')
          .attr('class', 'tree-link')
          .attr('d', line)
          .each(function (d) {
            // needs to be computed on runtime
            d.totalLength = this.getTotalLength()
          })
          .attr('stroke-dasharray', d => `${d.totalLength} ${d.totalLength}`)
          .attr('stroke-dashoffset', d => d.totalLength)
        .transition()
          .duration(config.duration)
          .ease(easeLinear)
          .delay((d, i) =>
            config.initialDelay +
            config.duration * ((Number(config.delayEach) * i) + Math.min(d.source.depth, d.target.depth) + 1)
          )
          .attr('stroke-dashoffset', 0)
      // enter + update
        // .merge(links)
    })
  }
  return links
}

export default Links
