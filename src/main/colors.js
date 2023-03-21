// const { ColorUpdater } = require('bulma-css-vars')
const { interpolateLab } = require('d3-interpolate')
const { color } = require('d3-color')

// // This file is generated through ./node_modules/.bin/bulma-css-vars
// // and exports the variable window.bulmaCssVarsDef
// if (!('bulmaCssVarsDef' in global) && 'window' in global) {
//   require('./theme-dark/bulma-colors.js')
// }

// https://i.redd.it/aepphltiqy911.png
// const colors = ['#D40078', '#F6019D', '#920075', '#650D89', '#023788']

// const colors = ['#D40078', '#F6019D', '#920075', '#650D89']
// const colors = ['#F9C80E', '#FF4365', '#791E94', '#541388']
// const colors = ['#241734', '#2E2157', '#FD3777', '#F706CF', '#FD1D53'].reverse()
// const colors = ['#7C1B2F', '#A0344E', '#A45571', '#631836', '#451035', '#2E0B1A']
// const colors = ['#A45571', '#631836', '#451035', '#2E0B1A']
// const colors = ['#A45571', '#631836', '#451035']
// const colors = ['#B42761', '#712753', '#642157', '#121032']

function colorsInterpolator(colors, n) {
  // [0,1] -> [0,n]
  const norm = n * (colors.length - 1)
  // index in colors
  const i = Math.floor(norm)
  // [0, 1]
  const left = norm - i
  return interpolateLab(colors[i], colors[i + 1])(left)
}

class Theme {
  constructor() {
    this.colors = ['#b95a70', '#212220']
    this.bannerColors = ['#b95a70', '#00b1e6', '#48F913', '#F9C80E', '#B94B69']
    this.style = {
      dark: {
        'grey-darker': '#212220',
        'grey-dark': '#2b2b2b',
        grey: '#ababab',
        'grey-light': '#c5c5c5',
        'grey-lighter': '#dedede',
        primary: color(this.t(0)).formatHex(),
        info: color(this.t(0.5)).formatHex(),
        warning: color(this.t(1)).formatHex(),
        link: '#fafafa',
        'link-invert': '#fafafa',
        'link-hover': '#ffffff',
        'link-focus': '#d4d4d4',
        'link-focus-border': '#ededed',
        'link-active-border': '#ededed',
        orange: '#f89406',
        green: '#62c462',
        blue: '#5bc0de',
        red: '#ee5f5b'
      },
      light: {
        'grey-darker': '#fefefe',
        'grey-dark': '#fafafa',
        grey: '#f8f8f8',
        'grey-light': '#333333',
        'grey-lighter': '#151515',
        primary: color(this.t(0)).formatHex(),
        info: color(this.t(0.5)).formatHex(),
        warning: color(this.t(1)).formatHex(),
        link: '#555555',
        'link-invert': '#fafafa',
        'link-hover': '#333333',
        'link-focus': '#333333',
        'link-focus-border': '#333333',
        'link-active-border': '#333333',
        orange: '#f89406',
        green: '#62c462',
        blue: '#5bc0de',
        red: '#ee5f5b'
      }
    }
  }

  getTheme(theme) {
    return this.style[theme]
  }

  // updateTheme(theme) {
  //   if (!(theme in this.style)) {
  //     throw new Error(`Theme ${theme} not found in the available styles`)
  //   }
  //   const updater = new ColorUpdater(global.bulmaCssVarsDef)
  //   const selectedTheme = this.style[theme]
  //   for (let key in selectedTheme) {
  //     updater.updateVarsInDocument(key, selectedTheme[key])
  //   }
  // }

  /**
   * getFlattenedColorPalette returns a flattened interpolated version of the color palette.
   */
  getFlattenedColorPalette() {
    const out = []
    for (let i = 0; i < this.colors.length - 1; i += 1) {
      const j = i + 1
      const t = interpolateLab(this.colors[i], this.colors[j])
      // create 100 colors
      const n = 100 / (this.colors.length - 1)
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
  t(n) {
    return colorsInterpolator(this.colors, n)
  }

  /**
   * Interpolates over the banner colors
   * @type {function(*): *}
   */
  bannerInterpolation(n) {
    return colorsInterpolator(this.bannerColors, n)
  }
}

const theme = new Theme()
module.exports = {
  theme
}
