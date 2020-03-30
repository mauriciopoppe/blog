const merge = require('webpack-merge')
const TerserWebpackPlugin = require('terser-webpack-plugin')
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const common = require('./webpack.config.common.js')

module.exports = merge(common, {
  mode: 'production',

  output: {
    filename: '[name].[hash:5].js',
    chunkFilename: '[id].[hash:5].js',
    library: '[name]'
  },
  devtool: 'cheap-source-map',
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({})
      // NOTE: css is instead modified by netlify
      // new OptimizeCSSAssetsPlugin({})
    ]
  }
})
