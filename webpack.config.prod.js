const merge = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const common = require('./webpack.config.common.js')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash:5].js',
    chunkFilename: '[id].[contenthash:5].js',
    library: '[name]'
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin()
    ]
  }
})
