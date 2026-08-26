import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm'

fetch('/js/graph/data/eulerian-graph.json')
  .then((response) => response.json())
  .then((data) => {
    greuler({
      target: '#figure-eulerian-graph',
      data: data
    }).update()
  })

fetch('/js/graph/data/eulerian-trail.json')
  .then((response) => response.json())
  .then((data) => {
    greuler({
      target: '#figure-eulerian-trail',
      data: data
    }).update()
  })

fetch('/js/graph/data/konigsberg-bridges.json')
  .then((response) => response.json())
  .then((data) => {
    greuler({
      target: '#figure-konigsberg-bridges',
      data: data
    }).update()
  })
