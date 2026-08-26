import functionPlot from 'https://cdn.jsdelivr.net/npm/function-plot@1.25.4/+esm'

functionPlot({
  target: '#approximation-at-point',
  data: [
    {
      fn: '5 * (x^4) - (x^3) + (x^2) - (x)'
    },
    {
      fn: '20 * (x^3) - 3 * (x^2) + 2 *x'
    },
    {
      fn: '60 * (x^)'
    }
  ]
})
