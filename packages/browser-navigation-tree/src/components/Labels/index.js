import { select } from 'd3-selection'
import './styles.css'

const toDeg = r => r * 180 / Math.PI

const Labels = () => {
  return function (selection) {
    selection.each(function (d, i) {
      const labels = select(this)
        .selectAll('.tree-label').data(d.descendants())

      // enter
      labels
        .enter()
          .append('text')
          .attr('class', 'tree-label')
      // enter + update
        .merge(labels)
          .attr('dy', '.31em')
          .attr('x', d => (d.x < Math.PI) === !d.children ? 6 : -6)
          .attr('font', '10px')
          .attr('transform', d => (
            `rotate(${toDeg(d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2)})`
          ))
          .attr('text-anchor', d => (d.x < Math.PI) === !d.children ? 'start' : 'end')
          .text(d => d.data.path)
    })
  }
}

export default Labels
