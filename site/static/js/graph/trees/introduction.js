import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm'

fetch('/js/graph/data/tree.json')
  .then((response) => response.json())
  .then((data) => {
    greuler({
      target: '#figure-tree',
      data: data
    }).update()
  })
