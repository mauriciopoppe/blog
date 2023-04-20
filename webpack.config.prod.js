const merge = require('webpack-merge')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const common = require('./webpack.config.common.js')

module.exports = merge(common, {
  mode: 'production',

  output: {
    filename: '[name].[contenthash:5].js',
    chunkFilename: '[id].[contenthash:5].js',
    library: '[name]'
  },
  devtool: 'cheap-source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({})
      // NOTE: optimized CSS is modified by netlify!
      // Let it optimize it and skip our optimization
      // new OptimizeCSSAssetsPlugin({})
    ]
  }
})
