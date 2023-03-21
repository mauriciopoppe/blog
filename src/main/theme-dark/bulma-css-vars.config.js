const { theme } = require('../colors')

const colorDefs = theme.getTheme('dark')
module.exports = {
  jsOutputFile: '../sass/bulma-generated/bulma-colors.js',
  sassOutputFile: '../sass/bulma-generated/generated-bulma-vars-dark.sass',
  cssFallbackOutputFile: '../sass/bulma-generated/generated-fallback-dark.css',
  colorDefs: colorDefs,
  sassEntryFile: '../sass/main.scss',
  transition: '0.15s ease',
  globalWebVar: true
}
