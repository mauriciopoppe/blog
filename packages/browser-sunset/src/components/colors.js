const { interpolateLab } = require('d3-interpolate')
const colors = ['#E92EFB', '#FF2079', '#440BD4', '#04005E']

// NOTE: this function is run in both node and website
function getColors () {
  const out = []
  for (let i = 0; i < colors.length - 1; i += 1) {
    const j = i + 1
    const t = interpolateLab(colors[i], colors[j])
    const n = 20
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
