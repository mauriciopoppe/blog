// const { ColorUpdater } = require('bulma-css-vars')
import { interpolateLab } from 'd3-interpolate'
import { color } from 'd3-color'

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

function colorsInterpolator(colors: string[], n: number): string {
  // [0,1] -> [0,n]
  const norm = n * (colors.length - 1)
  // index in colors
  const i = Math.floor(norm)
  // [0, 1]
  const left = norm - i
  return interpolateLab(colors[i], colors[i + 1])(left)
}

class Theme {
  colors: string[]
  bannerColors: string[]
  style: {
    dark: {}
    light: {}
  }

  constructor() {
    this.colors = ['#C27083', '#212220']
    this.bannerColors = ['#C27083', '#00b1e6', '#48F913', '#F9C80E', '#B94B69']

    // NOTE: changes to these variables require a server restart.
    // The reason is that these values are fed into a node.js program
    // that computes derivative css variables from them and includes them
    // in the spreadsheet.
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
        link: '#c5c5c5',
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
        'grey-darker': '#fffcf3',
        'grey-dark': '#f8f5eb',
        grey: '#f8f8f8',
        'grey-light': '#333333',
        'grey-lighter': '#151515',
        primary: color(this.t(0.1)).formatHex(),
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

  getTheme(theme: 'light' | 'dark') {
    return this.style[theme]
  }

  /**
   * Interpolate over `colors`, the returning function should be called with a number in the range [0, 1[
   */
  t(n: number) {
    return colorsInterpolator(this.colors, n)
  }

  /**
   * Interpolates over the banner colors
   */
  bannerInterpolation(n: number) {
    return colorsInterpolator(this.bannerColors, n)
  }
}

const theme = new Theme()
export { theme }
