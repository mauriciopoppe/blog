/** @type {import('tailwindcss').Config} */
import { interpolateLab } from 'd3-interpolate'
import { color } from 'd3-color'
const { createThemes } = require('tw-colors')

const colors = [
  '#C27083', // pink
  '#212220' // dark grey
]

function colorsInterpolator(colors, n) {
  // [0,1] -> [0,n]
  const norm = n * (colors.length - 1)
  // index in colors
  const i = Math.floor(norm)
  // [0, 1]
  const left = norm - i
  return interpolateLab(colors[i], colors[i + 1])(left)
}
module.exports = {
  prefix: 'tw-',
  content: ['src/**/*.{tsx,jsx}', 'site/content/**/*.md', 'site/layouts/**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: color(colorsInterpolator(colors, 0)).formatHex(),
        info: color(colorsInterpolator(colors, 0.5)).formatHex(),
        warning: color(colorsInterpolator(colors, 1)).formatHex()
      }
    }
  },
  plugins: [
    createThemes({
      light: {
        primary: color(colorsInterpolator(colors, 0.1)).formatHex(),
        info: color(colorsInterpolator(colors, 0.5)).formatHex(),
        warning: color(colorsInterpolator(colors, 1)).formatHex()
      }
    })
  ]
}
