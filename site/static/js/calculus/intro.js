import functionPlot from 'https://esm.sh/function-plot@1.25.4'

const articleEl = document.querySelector('article.content') || document.querySelector('article[role=main]') || document.body
const contentsBounds = articleEl.getBoundingClientRect()
let width = 600
let height = 350
if (contentsBounds.width && contentsBounds.width < width) {
  const ratio = contentsBounds.width / width
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
