const merge = require('webpack-merge')

const common = require('./webpack.config.common.js')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash:5].js',
    chunkFilename: '[id].[contenthash:5].js',
    library: '[name]'
  }
})
