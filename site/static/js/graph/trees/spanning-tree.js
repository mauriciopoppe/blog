import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm'

fetch('/js/graph/data/spanning-tree.json')
  .then((response) => response.json())
  .then((data) => {
    greuler({
      target: '#figure-spanning-tree',
      data: data
    }).update()
  })

fetch('/js/graph/data/minimum-spanning-tree.json')
  .then((response) => response.json())
  .then((data) => {
    greuler({
      target: '#figure-minimum-spanning-tree',
      data: data
    }).update()
  })
