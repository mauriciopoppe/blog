document.addEventListener('DOMContentLoaded', function () {
  d3.json('/js/graph/data/tree.json', function (err, data) {
    if (err) { throw err }
    var options = {
      target: '#figure-tree',
      data: data
    }
    greuler(options).update({ iterations: [15, 15, 15] })
  })
})
