import { tree, hierarchy } from 'd3-hierarchy'
/* event = live-binding */
import { select, event } from 'd3-selection'
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom'

import { transform } from '../../utils'
import Nodes from '../Nodes/'
import Links from '../Links/'

const tilt = (conf) => {
  let tiltX
  let tiltY
  const el = conf.source
  const bounds = el.node().getBoundingClientRect()
  const elWidth = bounds.width
  const elHeight = bounds.height
  // el.on('mouseenter', function () { console.log('mouseenter') })
  el.on('mousemove', function () {
    // [-1, 1]
    tiltX = (event.clientX / elWidth) * 2 - 1
    tiltY = (event.clientY / elHeight) * 2 - 1
    if (conf.onMouseMove) {
      conf.onMouseMove.call(this, event, tiltX, tiltY)
    }
  })
  // el.on('mouseleave', function () { console.log('mouseleave') })
}

const Background = function (config) {
  function render (selection) {
    selection.each(function (d, i) {
      const root = select(this)
      root
        .append('circle')
        .attr('class', 'tree-background-blur')
        .attr('fill', 'rgba(80, 81, 79, 1)')
        // .attr('filter', 'url(#shadow)')
        .attr('r', config.radius + 100)
        .style('pointer-events', 'none')
      root
        .append('circle')
        .attr('class', 'tree-background')
        .attr('fill', '#ddd')
        .attr('r', config.radius + 100)
        .style('pointer-events', 'none')
    })
  }

  return render
}

const Tree = (config) => {
  config = Object.assign(config, {
    width: config.target.offsetWidth,
    height: config.target.offsetHeight
  })

  const outerRadius = Math.min(config.width / 2, config.height / 2)
  const innerRadius = outerRadius - 150
  const layout = tree()
    .size([config.height, config.width / 2])
    // .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth)

  // compute layout
  const root = hierarchy(config.data)
  layout(root)

  // svg: join
  const svg = select(config.target).append('svg')
    .attr('height', config.height)
    .attr('width', config.width)
    .on('click', config.onItemBlur)

  // filter
  svg.append('filter')
      .attr('id', 'shadow')
    .append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', 50)

  const zoom = d3Zoom()
    .scaleExtent([1 / 2, 4])
    .on('zoom', zoomed)

  const rect = svg.append('rect')
    .attr('height', config.height)
    .attr('width', config.width)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .call(zoom)
    .call(
      zoom.transform,
      // zoomIdentity.translate(config.width / 2, config.height / 2)
      zoomIdentity // .translate(config.width / 2, config.height / 2)
    )

  function onLabelFocus (node) {
    // stop propagation
    event.stopPropagation()

    console.log(node)

    // const labelRotation = transform().parse(
    //   select(this).attr('transform')
    // ).rotate()[0]

    // move all the elements to the left/right side of the screen
    rect
      .transition()
        .duration(config.duration)
        .call(
          zoom.transform,
          zoomIdentity
            .translate(0, -node.x)
            .scale(1.5)
        )

    // rotate the content
    // const rotationTransform = transform().rotate(-labelRotation)
    // select('.tree-content')
    //   .transition('label')
    //     .attr('transform', rotationTransform)

    // highlight the path in the tree
    config.onItemFocus(node)
  }

  function onLabelBlur () {
    console.log('blur!')
  }

  function zoomed () {
    if (g) {
      g.attr('transform', event.transform)
    }
  }

  const g = svg
      .append('g')
        // .attr('transform', `translate(${config.width / 2}, ${config.height / 2})`)

  // background for tilt
  g.call(Background({ ...config, radius: innerRadius }))

  const gTilt = g
    .append('g')
      .attr('class', 'tree-content-tilt')
    .append('g')
      .attr('class', 'tree-content')

  // links: join
  const links = gTilt.selectAll('.tree-links').data([root])
  // links: enter
  links
    .enter()
      .append('g')
      .attr('class', 'tree-links')
  // links: enter + update
    .merge(links)
      .call(Links(config))

  // nodes: join
  const nodes = gTilt.selectAll('.tree-nodes').data([root])
  // nodes: enter
  nodes
    .enter()
      .append('g')
      .attr('class', 'tree-nodes')
  // nodes: enter + update
    .merge(nodes)
    .call(Nodes({ ...config, onLabelFocus, onLabelBlur }))

  let contentTilt = transform()

  // tilt effect
  // tilt({
  //   source: svg,
  //   onMouseMove (event, tiltX, tiltY) {
  //     contentTilt.translate(tiltX * 20, tiltY * 20)
  //     select('circle.tree-background')
  //       .attr('transform', `translate(${tiltX * 10}, ${tiltY * 10})`)
  //     select('circle.tree-background-blur')
  //       .attr('transform', `translate(${tiltX * -5}, ${tiltY * -5})`)
  //     select('.tree-content-tilt')
  //       .attr('transform', contentTilt)
  //   }
  // })
}

export default Tree
