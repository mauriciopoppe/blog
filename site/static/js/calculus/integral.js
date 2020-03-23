document.addEventListener('DOMContentLoaded', function () {
  var d3 = window.d3;
  var functionPlot = window.functionPlot;
  var chart;

  functionPlot({
    target: '#area-a-b',
    xAxis: { domain: [0, 3] },
    yAxis: { domain: [0, 5] },
    data: [{
      fn: 'x * x'
    }],
    annotations: [
      { x: 1, text: 'a' },
      { x: 2, text: 'b' }
    ]
  });

  functionPlot({
    target: '#area-first-approximation',
    xAxis: { domain: [0, 3] },
    yAxis: { domain: [0, 5] },
    xDomain: [0, 3],
    yDomain: [0, 5],
    annotations: [
      { x: 1, text: 'a' },
      { x: 2, text: 'b' },
      { y: 4, text: 'm_1' },
    ],
    data: [{
      fn: 'x * x'
    }, {
      fn: 'x * x',
      range: [1, 2],
      nSamples: 2,
      closed: true
    }]
  });

  functionPlot({
    target: '#area-second-approximation',
    xAxis: { domain: [0, 3] },
    yAxis: { domain: [0, 5] },
    annotations: [
      { x: 1, text: 'a' },
      { x: 2, text: 'b' },
      { y: 4, text: 'm_1' },
      { y: 2.25, text: 'm_2' },
    ],
    data: [{
      fn: 'x * x'
    }, {
      fn: 'x * x',
      range: [1, 2],
      nSamples: 3,
      closed: true
    }]
  });

  (function () {
    var options = {
      target: '#sum-area',
      disableZoom: true,
      xAxis: { domain: [0, 3] },
      yAxis: { domain: [0, 5] },
      annotations: [
        { x: 1, text: 'a' },
        { x: 2, text: 'b'  }
      ],
      data: [{
        fn: 'x * x'
      }, {
        fn: 'x * x',
        range: [1, 2],
        nSamples: 30,
        closed: true
      }]
    };

    functionPlot(options);
    var $el = document.querySelector('#sum-area-slider');
    $el.addEventListener('change', function () {
      var value = this.value;
      options.data[1].nSamples = value;
      functionPlot(options);
    });

  })();

  functionPlot({
    target: '#numerical-trapezoid',
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
      { x: 2 , text: 'y_7' }
    ],
    data: [{
      fn: '-x * x + 4'
    }, {
      fn: '-x * x + 4',
      range: [-2, 2],
      nSamples: 9,
      closed: true,
      graphType: 'polyline'
    }]
  });

  functionPlot({
    target: '#numerical-simpson',
    xAxis: { domain: [-2, 2] },
    yAxis: { domain: [-1, 7] },
    annotations: [
      { x: -1, text: '-h' },
      { x: 0, text: '0' },
      { x: 1, text: 'h' },
      { y: 2, text: 'y_0' },
      { y: 3, text: 'y_1' },
      { y: 6, text: 'y_2' },
    ],
    data: [{
      fn: 'x * x + 3 + 2 * x',
      range: [-1, 1],
      closed: true
    }]
  });

})
