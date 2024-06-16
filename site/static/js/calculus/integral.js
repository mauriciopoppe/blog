window.addEventListener('load', function () {
  var functionPlot = window.functionPlot

  var contentsBounds = document.querySelector('article[role=main]').getBoundingClientRect()
  var width = 600
  var height = 350
  if (contentsBounds.width < width) {
    var ratio = contentsBounds.width / width
    width *= ratio
    height *= ratio
  }

  functionPlot({
    target: '#area-a-b',
    width: width,
    height: height,
    xAxis: { domain: [0, 3] },
    yAxis: { domain: [0, 5] },
    data: [
      {
        fn: 'x * x'
      }
    ],
    annotations: [
      { x: 1, text: 'a' },
      { x: 2, text: 'b' }
    ]
  })

  functionPlot({
    target: '#area-first-approximation',
    xAxis: { domain: [0, 3] },
    yAxis: { domain: [0, 5] },
    width: width,
    height: height,
    xDomain: [0, 3],
    yDomain: [0, 5],
    annotations: [
      { x: 1, text: 'a' },
      { x: 2, text: 'b' },
      { y: 4, text: 'm_1' }
    ],
    data: [
      {
        fn: 'x * x'
      },
      {
        fn: 'x * x',
        range: [1, 2],
        nSamples: 2,
        closed: true
      }
    ]
  })

  functionPlot({
    target: '#area-second-approximation',
    width: width,
    height: height,
    xAxis: { domain: [0, 3] },
    yAxis: { domain: [0, 5] },
    annotations: [
      { x: 1, text: 'a' },
      { x: 2, text: 'b' },
      { y: 4, text: 'm_1' },
      { y: 2.25, text: 'm_2' }
    ],
    data: [
      {
        fn: 'x * x'
      },
      {
        fn: 'x * x',
        range: [1, 2],
        nSamples: 3,
        closed: true
      }
    ]
  })
  ;(function () {
    var options = {
      target: '#sum-area',
      width: width,
      height: height,
      disableZoom: true,
      xAxis: { domain: [0, 3] },
      yAxis: { domain: [0, 5] },
      annotations: [
        { x: 1, text: 'a' },
        { x: 2, text: 'b' }
      ],
      data: [
        {
          fn: 'x * x'
        },
        {
          fn: 'x * x',
          range: [1, 2],
          nSamples: 30,
          closed: true
        }
      ]
    }

    functionPlot(options)
    var $el = document.querySelector('#sum-area-slider')
    $el.addEventListener('change', function () {
      var value = this.value
      options.data[1].nSamples = value
      functionPlot(options)
    })
  })()

  functionPlot({
    target: '#numerical-trapezoid',
    width: width,
    height: height,
    xAxis: { domain: [-2.5, 2.5] },
    yAxis: { domain: [-1, 7] },
    disableZoom: true,
    annotations: [
      { x: -2, text: 'y_0' },
      { x: -1.5, text: 'y_1' },
      { x: -1, text: 'y_2' },
      { x: -0.5, text: 'y_3' },
      { x: 0.5, text: 'y_4' },
      { x: 1, text: 'y_5' },
      { x: 1.5, text: 'y_6' },
      { x: 2, text: 'y_7' }
    ],
    data: [
      {
        fn: '-x * x + 4'
      },
      {
        fn: '-x * x + 4',
        range: [-2, 2],
        nSamples: 9,
        closed: true,
        graphType: 'polyline'
      }
    ]
  })

  functionPlot({
    target: '#numerical-simpson',
    width: width,
    height: height,
    xAxis: { domain: [-2, 2] },
    yAxis: { domain: [-1, 7] },
    annotations: [
      { x: -1, text: '-h' },
      { x: 0, text: '0' },
      { x: 1, text: 'h' },
      { y: 2, text: 'y_0' },
      { y: 3, text: 'y_1' },
      { y: 6, text: 'y_2' }
    ],
    data: [
      {
        fn: 'x * x + 3 + 2 * x',
        range: [-1, 1],
        closed: true
      }
    ]
  })
})
