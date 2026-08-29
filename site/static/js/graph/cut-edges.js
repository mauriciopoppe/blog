import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm'

fetch('/js/graph/data/bridges.json')
  .then((r) => r.json())
  .then((data) => {
    greuler({
      target: '#figure-bridges',
      data: data
    }).update()
  })

fetch('/js/graph/data/bridges-directed.json')
  .then((r) => r.json())
  .then((data) => {
    greuler({
      directed: true,
      target: '#figure-bridges-directed',
      data: data
    }).update()
  })
