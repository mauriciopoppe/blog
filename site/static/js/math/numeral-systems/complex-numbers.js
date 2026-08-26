import functionPlot from 'https://cdn.jsdelivr.net/npm/function-plot@1.25.4/+esm'

function unitCircle() {
  return {
    x: 'cos(t)',
    y: 'sin(t)',
    color: 'lightgrey',
    graphType: 'polyline',
    fnType: 'parametric'
  }
}

function vector(ends, offset) {
  return {
    vector: ends,
    offset: offset,
    fnType: 'vector',
    graphType: 'polyline'
  }
}

function updateFormat(instance) {
  const format = instance.meta.yAxis.tickFormat()
  const imaginaryFormat = function (d) {
    return format(d) + ' i'
  }
  instance.meta.yAxis.tickFormat(imaginaryFormat)
  instance.draw()
}

;(() => {
  const instance = functionPlot({
    target: '#complex-plane',
    xLabel: 'real',
    yLabel: 'imaginary',
    grid: true,
    xDomain: [-6, 6],
    data: [vector([1, 0]), vector([0, 1]), vector([-1, 0]), vector([0, -1]), unitCircle()]
  })
  updateFormat(instance)
})()
;(() => {
  const instance = functionPlot({
    target: '#complex-2-i',
    xLabel: 'real',
    yLabel: 'imaginary',
    grid: true,
    xDomain: [-6, 6],
    data: [vector([2, 1]), vector([-1, 2]), vector([-1, 2]), vector([1, -2]), unitCircle()]
  })
  updateFormat(instance)
})()
;(() => {
  const n = 1 / Math.sqrt(2)
  const instance = functionPlot({
    target: '#complex-square-root',
    xLabel: 'real',
    yLabel: 'imaginary',
    grid: true,
    xDomain: [-6, 6],
    data: [vector([n, n]), vector([-n, n]), unitCircle()]
  })
  updateFormat(instance)
})()
;(() => {
  const n = 1 / Math.sqrt(2)
  const instance = functionPlot({
    target: '#complex-45',
    xLabel: 'real',
    yLabel: 'imaginary',
    grid: true,
    xDomain: [-6, 6],
    data: [vector([2, 1]), vector([n, 3 * n]), unitCircle()]
  })
  updateFormat(instance)
})()
