const merge = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const common = require('./webpack.config.common.js')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash:5].js'
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  }
})
