const { theme } = require('../colors')

const colorDefs = theme.getTheme('light')
const config = {
  jsOutputFile: '../sass/bulma-generated/bulma-colors.js',
  sassOutputFile: '../sass/bulma-generated/generated-bulma-vars-light.sass',
  cssFallbackOutputFile: '../sass/bulma-generated/generated-fallback-light.css',
  colorDefs: colorDefs,
  sassEntryFile: '../sass/main.scss',
  transition: '0.15s ease',
  globalWebVar: true
}

module.exports = config
