document.addEventListener('DOMContentLoaded', function () {
  var width = document.querySelector('article.content').clientWidth
  d3.json('/js/graph/data/spanning-tree.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-spanning-tree',
      data: data,
      width: width
    }).update()
  })

  d3.json('/js/graph/data/minimum-spanning-tree.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-minimum-spanning-tree',
      data: data,
      width: width
    }).update()
  })
})
