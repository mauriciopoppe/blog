window.addEventListener('load', function () {
  function getJson(file, callback) {
    fetch(file)
      .then((response) => response.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err))
  }
  getJson('/js/graph/data/hamiltonian-graph.json', function (error, data) {
    var options = {
      target: '#figure-hamiltonian-graph',
      data: data
    }
    var instance = greuler(options).update()

    var path = [0, 1, 3, 8, 12, 13, 9, 4, 5, 6, 10, 14, 11, 7, 2, 0]
    var last = path.shift()
    function run() {
      var next = path.shift()
      var edge = options.data.edges.filter(function (e) {
        return (
          (e.source.index === last && e.target.index === next) || (e.source.index === next && e.target.index === last)
        )
      })

      edge[0]['class'] = 'highlight'
      last = next
      instance.update()

      if (path.length) {
        setTimeout(run, 1000)
      }
    }

    run()
  })
})
