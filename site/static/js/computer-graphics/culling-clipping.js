import functionPlot from 'https://esm.sh/function-plot@1.25.4'

if (document.querySelector('#z')) {
  const n = 1
  const f = 10
  const A = -(f + n) / (f - n)
  const B = (-2 * f * n) / (f - n)
  const xDiff = 2
  functionPlot({
    target: '#z',
    xAxis: { domain: [-f - xDiff, -n + xDiff] },
    annotations: [
      { x: -n, text: '-n' },
      { x: -f, text: '-f' },
      { y: 1, text: '1' },
      { y: -1, text: '-1' }
    ],
    data: [{
      fn: '(A * x + B)/(-x)',
      scope: { A: A, B: B }
    }]
  })
}
