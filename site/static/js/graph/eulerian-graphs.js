document.addEventListener('DOMContentLoaded', function () {
  function getJson(file, callback) {
    fetch(file)
      .then((response) => response.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err))
  }

  const greuler = window.greuler
  getJson('/js/graph/data/eulerian-graph.json', function (error, data) {
    greuler({
      target: '#figure-eulerian-graph',
      data: data
    }).update()
  })

  getJson('/js/graph/data/eulerian-trail.json', function (error, data) {
    greuler({
      target: '#figure-eulerian-trail',
      data: data
    }).update()
  })
  getJson('/js/graph/data/konigsberg-bridges.json', function (error, data) {
    greuler({
      target: '#figure-konigsberg-bridges',
      data: data
    }).update()
  })

  getJson('/js/graph/data/eulerian-graph.json', function (error, data) {
    // var options = {
    //   target: '#figure-find-eulerian-trail',
    //   data: data
    // }
    //
    // var instance = greuler(options).update()
    //
    // // vertices in trail
    // var trailEl = d3.select(options.target).append('div')
    //
    // var edge_pointer = []
    // var edge_id = {}
    // var g = []
    // var n, m
    //
    // var trail = []
    // var stack = []
    //
    // function stackAnimation() {
    //   var stackSelection = d3.select('#stack').selectAll('span').data(stack)
    //   stackSelection
    //     .enter()
    //     .append('span')
    //     .style('opacity', 0)
    //     .text(function (d) {
    //       return d
    //     })
    //     .transition()
    //     .style('opacity', 1)
    //   stackSelection.exit().transition().style('opacity', 0).remove()
    //
    //   d3.select('#trail')
    //     .selectAll('span')
    //     .data(trail)
    //     .enter()
    //     .append('span')
    //     .style('opacity', 0)
    //     .text(function (d) {
    //       return d
    //     })
    //     .transition()
    //     .style('opacity', 1)
    // }
    //
    // function euler() {
    //   var player = new greuler.player.Generator(instance)
    //   player.run(function* algorithm(instance) {
    //     function* eulerianTrail(u) {
    //       // stack manipulation/animation
    //       stack.push(u)
    //       stackAnimation()
    //
    //       yield function () {
    //         instance.selector.getNode({ id: u }).transition().attr('fill', 'black')
    //       }
    //
    //       var edges = instance.graph.getIncidentEdges({ id: u })
    //       for (var i = 0; i < edges.length; i += 1) {
    //         var e = edges[i]
    //         var next = e.target.id === u ? e.source.id : e.target.id
    //
    //         if (e.used) {
    //           continue
    //         }
    //         e.used = true
    //
    //         yield function () {
    //           instance.selector.traverseAllEdgesBetween({ source: u, target: next }, { keepStroke: false })
    //         }
    //
    //         yield* eulerianTrail(next)
    //       }
    //
    //       // stack manipulation/animation
    //       trail.push(stack.pop())
    //
    //       yield function () {
    //         if (trail.length > 1) {
    //           instance.selector.traverseAllEdgesBetween({
    //             source: trail[trail.length - 2],
    //             target: trail[trail.length - 1]
    //           })
    //         }
    //       }
    //
    //       stackAnimation()
    //
    //       yield function () {
    //         instance.selector.getNode({ id: u }).transition().attr('fill', '#2980B9')
    //       }
    //     }
    //     yield* eulerianTrail(0)
    //
    //     // node traversal is given by trail
    //     // for (var i = 0; i < trail.length; i += 1) {
    //     //   yield function () {
    //     //     instance.selector.traverseAllEdgesBetween(
    //     //       { source: trail[i], target: trail[i + 1] }
    //     //     );
    //     //   };
    //     // }
    //   })
    // }
    //
    // var root = d3.select(options.target).node()
    // var trackRun = false
    // document.addEventListener('scroll', function (e) {
    //   var scrollTop = window.scrollY
    //   if (!trackRun && scrollTop + window.innerHeight >= root.offsetTop + root.clientHeight) {
    //     trackRun = true
    //     // var el = d3.select('.overlay');
    //     // var parent = el.node().parentNode;
    //     // el.style('width', parent.clientWidth + 'px');
    //     // el.style('height', parent.clientHeight + 'px');
    //     euler()
    //     d3.select(options.target)
    //       .selectAll('svg')
    //       .transition()
    //       .duration(500)
    //       .attr('opacity', 0)
    //       .transition()
    //       .duration(500)
    //       .attr('opacity', 1)
    //       .transition()
    //       .duration(500)
    //       .attr('opacity', 0)
    //       .transition()
    //       .duration(500)
    //       .attr('opacity', 1)
    //       .transition()
    //       .duration(500)
    //       .attr('opacity', 0)
    //       .transition()
    //       .duration(500)
    //       .attr('opacity', 1)
    //   }
    // })
  })
})
