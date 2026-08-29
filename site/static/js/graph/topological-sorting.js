import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm'

fetch('/js/graph/data/topological-sorting.json')
  .then((response) => response.json())
  .then((data) => {
    const el = document.querySelector('article.content')
    const width = el ? el.clientWidth : 600
    greuler({
      directed: true,
      target: '#figure-topological-sorting',
      data: data,
      width: width
    }).update({ iterations: [30, 30, 30] })
  })
