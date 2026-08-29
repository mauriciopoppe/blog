import functionPlot from 'https://esm.sh/function-plot@1.25.4'

function unitCircle() {
  return {
    x: 'cos(t)',
    y: 'sin(t)',
    color: 'lightgrey',
    fnType: 'parametric',
    graphType: 'polyline'
  }
}

if (document.querySelector('#two-dimensions')) {
  functionPlot({
    target: '#two-dimensions',
    grid: true,
    xAxis: { domain: [-6, 6] },
    data: [
      { vector: [1, 0], color: '#FFCCCB', fnType: 'vector', graphType: 'polyline' },
      { vector: [0, 1], color: '#add8e6', fnType: 'vector', graphType: 'polyline' },
      { vector: [0.86602540378, 0.5], color: 'red', fnType: 'vector', graphType: 'polyline' },
      { vector: [-0.5, 0.86602540378], color: 'blue', fnType: 'vector', graphType: 'polyline' },
      unitCircle()
    ]
  })
}
