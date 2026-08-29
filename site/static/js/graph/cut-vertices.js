import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm'

fetch('/js/graph/data/cut-vertex.json')
  .then((r) => r.json())
  .then((data) => {
    greuler({
      target: '#figure-cut-vertex',
      data: data
    }).update()
  })

fetch('/js/graph/data/cut-vertex-2.json')
  .then((r) => r.json())
  .then((data) => {
    greuler({
      target: '#figure-cut-vertex-2',
      data: data
    }).update()
  })
