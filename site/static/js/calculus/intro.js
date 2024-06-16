window.addEventListener('load', function () {
  var d3 = window.d3
  var functionPlot = window.functionPlot

  var contentsBounds = document.querySelector('article[role=main]').getBoundingClientRect()
  var width = 600
  var height = 350
  if (contentsBounds.width < width) {
    var ratio = contentsBounds.width / width
    width *= ratio
    height *= ratio
  }

  // formula as curve
  functionPlot({
    title: 'A formula represented as a curve',
    target: '#formula-as-a-curve',
    width: width,
    height: height,
    yAxis: { domain: [-1, 7] },
    data: [
      {
        title: 'f(x) = x^2',
        fn: 'x^2'
      }
    ]
  })

  // for other than 0
  functionPlot({
    title: 'A formula defined for any x != 0',
    target: '#for-other-than-0',
    width: width,
    height: height,
    xAxis: { domain: [-2, 2] },
    data: [
      {
        title: 'f(x) = 1/x',
        fn: '1/x'
      }
    ]
  })
})
