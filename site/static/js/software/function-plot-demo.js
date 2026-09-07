import functionPlot from 'https://esm.sh/function-plot@1.25.4'

const functionEl = document.querySelector('#software-function-plot')
const derivativeEl = document.querySelector('#software-function-plot-derivative')

if (functionEl && derivativeEl) {
  let lastWidth = 0

  const render = () => {
    const width = Math.floor(functionEl.getBoundingClientRect().width)
    if (!width || width === lastWidth) return
    lastWidth = width

    functionEl.replaceChildren()
    derivativeEl.replaceChildren()

    const height = Math.max(220, Math.floor(width * 0.58))
    const shared = {
      xAxis: { domain: [-4, 8] },
      yAxis: { domain: [-4, 8] },
      width,
      height
    }

    const functionPlotInstance = functionPlot({
      ...shared,
      target: '#software-function-plot',
      annotations: [
        { y: 3.333333333, text: 'max' },
        { y: 2, text: 'min' }
      ],
      data: [
        {
          fn: '(x^3) / 3 - 2 * x * x + 3 * x + 2',
          graphType: 'polyline',
          derivative: {
            fn: 'x * x - 4 * x + 3',
            updateOnMouseMove: true
          }
        }
      ]
    })

    const derivativePlotInstance = functionPlot({
      ...shared,
      target: '#software-function-plot-derivative',
      annotations: [
        { x: 1, text: 'intercept' },
        { x: 3, text: 'intercept' }
      ],
      data: [
        {
          fn: 'x * x - 4 * x + 3',
          graphType: 'polyline'
        }
      ]
    })

    functionPlotInstance.addLink(derivativePlotInstance)
    derivativePlotInstance.addLink(functionPlotInstance)
  }

  render()
  new ResizeObserver(render).observe(functionEl)
}
