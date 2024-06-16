window.addEventListener('load', function () {
  function getJson(file, callback) {
    fetch(file)
      .then((response) => response.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err))
  }

  getJson('/js/graph/data/spanning-tree.json', function (err, data) {
    if (err) {
      throw err
    }
    window
      .greuler({
        target: '#figure-spanning-tree',
        data: data
      })
      .update()
  })

  getJson('/js/graph/data/minimum-spanning-tree.json', function (err, data) {
    if (err) {
      throw err
    }
    window
      .greuler({
        target: '#figure-minimum-spanning-tree',
        data: data
      })
      .update()
  })
})
