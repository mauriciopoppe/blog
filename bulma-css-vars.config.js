/**
 * Integrates bulma-css-vars with the app
 *
 * - define only colors in this file, other bulma variables should be defined in _variables.scss
 */

const Color = require('color')
const colors = require('./src/main/colors')

const c = {}

c['grey-darker'] = '#212220'
c['grey-dark'] = '#2b2b2b'
c['grey'] = '#ABABAA'
c['grey-light'] = '#C5C5C4'
c['grey-lighter'] = '#DEDEDD'

c['orange'] = '#f89406'
c['green'] = '#62c462'
c['blue'] = '#5bc0de'
c['red'] = '#ee5f5b'

// override
c['primary'] = Color(colors.t(0)).object()
c['info'] = Color(colors.t(0.5)).object()
c['warning'] = Color(colors.t(1)).object()

c['link'] = '#fafafa'
c['link-invert'] = c['link']
c['link-hover'] = Color(c['link']).lighten(0.05).object()
c['link-focus'] = Color(c['link']).darken(0.15).object()
c['link-focus-border'] = Color(c['link']).darken(0.05).object()
c['link-active-border'] = c['link-focus-border']

module.exports = {
  jsOutputFile: 'src/main/bulma-generated/bulma-colors.js',
  sassOutputFile: 'src/main/bulma-generated/generated-bulma-vars.sass',
  cssFallbackOutputFile: 'src/main/bulma-generated/generated-fallback.css',
  colorDefs: c,
  sassEntryFile: 'src/main/sass/main.scss',
  transition: '0.5s ease'
}
