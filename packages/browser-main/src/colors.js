const { interpolateLab } = require('d3-interpolate')
// https://i.redd.it/aepphltiqy911.png
const colors = ['#D40078', '#F6019D', '#920075', '#650D89', '#023788']
// const colors = ['#FF6C11', '#FF3864', '#2DE2E6', '#261447', '#0D0221']

// NOTE: this function is run in both node and the browser
function getColors () {
  const out = []
  for (let i = 0; i < colors.length - 1; i += 1) {
    const j = i + 1
    const t = interpolateLab(colors[i], colors[j])
    // create 100 colors
    const n = 100 / (colors.length - 1)
    for (let k = 0; k < n; k += 1) {
      const v = t(k / n)
      out.push(v)
    }
  }
  return out
}

/**
 * interpolates n in colors
 */
function t (n) {
  // [0,1] -> [0,n]
  const norm = n * colors.length
  // floor(norm) for colors
  const i = Math.floor(norm)
  // [0, 1]
  const left = norm - i
  return interpolateLab(colors[i], colors[i + 1])(left)
}

module.exports = {
  getColors, t
}
