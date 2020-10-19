const { interpolateLab } = require('d3-interpolate')

// https://i.redd.it/aepphltiqy911.png
// const colors = ['#D40078', '#F6019D', '#920075', '#650D89', '#023788']

// const colors = ['#D40078', '#F6019D', '#920075', '#650D89']
// const colors = ['#F9C80E', '#FF4365', '#791E94', '#541388']
// const colors = ['#241734', '#2E2157', '#FD3777', '#F706CF', '#FD1D53'].reverse()
// const colors = ['#7C1B2F', '#A0344E', '#A45571', '#631836', '#451035', '#2E0B1A']
// const colors = ['#A45571', '#631836', '#451035', '#2E0B1A']
// const colors = ['#A45571', '#631836', '#451035']
// const colors = ['#B42761', '#712753', '#642157', '#121032']
const colors = ['#b95a70', '#212220']
const bannerColors = ['#b95a70', '#00b1e6', '#48F913', '#F9C80E', '#B94B69']

function bannerColorChanger(delta) {
  // fast updates kill the browser, the color doesn't need to match while the animation is going on
  if (!bannerColorChanger.last || delta - bannerColorChanger.last > 100) {
    const k = (Math.cos(delta / 5000) + 1) / 2
    colors[0] = bannerColorsInterpolator(k)

    window.document.documentElement.style.setProperty('--primary', colors[0])
    // colorUpdater.updateVarsInDocument('primary', colors[0])
    bannerColorChanger.last = delta
  }
}

// NOTE: this function is run in both node and the browser
function getColors() {
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
 * Interpolate over `colors`, the returning function should be called with a number in the range [0, 1[
 *
 * @param colors
 * @returns {function(*): *}
 */
function genColorsInterpolator(colors) {
  return function (n) {
    // [0,1] -> [0,n]
    const norm = n * colors.length
    // index in colors
    const i = Math.floor(norm)
    // [0, 1]
    const left = norm - i
    return interpolateLab(colors[i], colors[i + 1])(left)
  }
}

/**
 * Interpolates over the application colors
 * @type {function(*): *}
 */
const t = genColorsInterpolator(colors)

/**
 * Interpolates over the banner colors
 * @type {function(*): *}
 */
const bannerColorsInterpolator = genColorsInterpolator(bannerColors)

module.exports = {
  getColors,
  bannerColorChanger,
  t
}
