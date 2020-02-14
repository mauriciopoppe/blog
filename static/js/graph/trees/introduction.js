document.addEventListener('DOMContentLoaded', function () {
  var width = document.querySelector('article.content').clientWidth
  d3.json('/js/graph/data/tree.json', function (err, data) {
    if (err) { throw err }
    var options = {
      target: '#figure-tree',
      data: data,
      width: width
    }
    greuler(options).update({ iterations: [15, 15, 15] })
  })
})
