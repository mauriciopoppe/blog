import functionPlot from 'https://esm.sh/function-plot@1.25.4'

if (document.querySelector('#line')) {
  functionPlot({
    target: '#line',
    grid: true,
    data: [{
      fn: '2 + x'
    }]
  })
}

if (document.querySelector('#affine-1')) {
  functionPlot({
    target: '#affine-1',
    annotations: [{ x: 1 }, { y: 1 }],
    data: [{
      points: [[-1, -1], [2, 2], [1, 1]],
      fnType: 'points',
      graphType: 'scatter',
      attr: { r: 5 }
    }]
  })
}
