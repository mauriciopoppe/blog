window.addEventListener('load', function () {
  const greuler = window.greuler

  function getJson(file, callback) {
    fetch(file)
      .then((response) => response.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err))
  }

  getJson('/js/graph/data/introduction.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-introduction',
      data: data
    }).update()
  })

  getJson('/js/graph/data/complete-graph.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-complete-graph',
      data: data
    }).update({ iterations: [30, 30, 30] })
  })

  getJson('/js/graph/data/complement-graph.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-complement-graph',
      data: data
    }).update()
  })

  getJson('/js/graph/data/bipartite-graph.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-bipartite-graph',
      data: data
    }).update()
  })

  getJson('/js/graph/data/biconnected-graph.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-biconnected-graph',
      data: data
    }).update()
  })

  getJson('/js/graph/data/pseudograph.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-pseudograph',
      data: data
    }).update()
  })

  getJson('/js/graph/data/multigraph.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-multigraph',
      data: data
    }).update()
  })

  getJson('/js/graph/data/weighted-graph.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-weighted-graph',
      data: data
    }).update()
  })

  getJson('/js/graph/data/directed-graph.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      directed: true,
      target: '#figure-directed-graph',
      data: data
    }).update()
  })

  getJson('/js/graph/data/degree-sequence.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-degree-sequence',
      data: data
    }).update({ iterations: [10, 10, 10] })
  })

  getJson('/js/graph/data/adjacency-incidence-matrix.json', function (err, data) {
    if (err) {
      throw err
    }
    greuler({
      target: '#figure-adjacency-incidence-matrix',
      data: data
    }).update()
  })
})
