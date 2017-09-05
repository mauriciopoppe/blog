document.addEventListener('DOMContentLoaded', function () {
  var d3 = window.d3
  var greuler = window.greuler
  d3.json('/js/graph/data/introduction.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-introduction',
      data: data
    }).update()
  })

  d3.json('/js/graph/data/complete-graph.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-complete-graph',
      data: data
    }).update({ iterations: [30, 30, 30] })
  })

  d3.json('/js/graph/data/complement-graph.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-complement-graph',
      data: data
    }).update()
  })

  d3.json('/js/graph/data/bipartite-graph.json', function (err, data) {
    if (err) { throw err }
    var instance = greuler({
      target: '#figure-bipartite-graph',
      data: data
    }).update()

    instance.events.on('firstLayoutEnd', function () {
      var nodes = instance.graph.getNodesByFn(function (n) {
        return [6, 8].indexOf(n.id) !== -1
      })
      // console.log(nodes)
      instance.selector.innerNodeSelector(
        instance.selector.select(nodes)
      ).transition('custom')
        .attr('fill', 'red')
    })
  })

  d3.json('/js/graph/data/biconnected-graph.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-biconnected-graph',
      data: data
    }).update()
  })

  d3.json('/js/graph/data/pseudograph.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-pseudograph',
      data: data
    }).update()
  })

  d3.json('/js/graph/data/multigraph.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-multigraph',
      data: data
    }).update()
  })

  d3.json('/js/graph/data/weighted-graph.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-weighted-graph',
      data: data
    }).update()
  })

  d3.json('/js/graph/data/directed-graph.json', function (err, data) {
    if (err) { throw err }
    greuler({
      directed: true,
      target: '#figure-directed-graph',
      data: data
    }).update()
  })

  d3.json('/js/graph/data/degree-sequence.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-degree-sequence',
      data: data
    }).update({ iterations: [10, 10, 10] })
  })

  d3.json('/js/graph/data/adjacency-incidence-matrix.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-adjacency-incidence-matrix',
      data: data
    }).update()
  })
})
