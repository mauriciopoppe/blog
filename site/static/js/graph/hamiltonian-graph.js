import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm'

fetch('/js/graph/data/hamiltonian-graph.json')
  .then((response) => response.json())
  .then((data) => {
    const options = {
      target: '#figure-hamiltonian-graph',
      data: data
    }
    const instance = greuler(options).update()

    const path = [0, 1, 3, 8, 12, 13, 9, 4, 5, 6, 10, 14, 11, 7, 2, 0]
    let last = path.shift()
    function run() {
      const next = path.shift()
      const edge = options.data.edges.filter(function (e) {
        return (
          (e.source.index === last && e.target.index === next) || (e.source.index === next && e.target.index === last)
        )
      })

      if (edge && edge[0]) {
        edge[0]['class'] = 'highlight'
      }
      last = next
      instance.update()

      if (path.length) {
        setTimeout(run, 1000)
      }
    }

    run()
  })
