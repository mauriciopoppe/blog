window.addEventListener('load', function () {
  function getJson(file, callback) {
    fetch(file)
      .then((response) => response.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err))
  }

  getJson('/js/graph/data/tree.json', function (err, data) {
    if (err) {
      throw err
    }
    const options = {
      target: '#figure-tree',
      data: data
    }
    window.greuler(options).update()
  })
})
