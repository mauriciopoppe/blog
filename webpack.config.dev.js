const merge = require('webpack-merge')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const common = require('./webpack.config.common')

module.exports = merge(common, {
  mode: 'development',

  output: {
    filename: '[name].js'
  },

  devServer: {
    host: 'localhost',
    port: process.env.PORT || 3000,
    static: {
      directory: path.join(process.cwd(), './dist')
    },
    allowedHosts: 'all',
    open: true,
    hot: false,
    historyApiFallback: {
      rewrites: [{ from: /./, to: '404.html' }]
    }
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['dist/**/*.js', 'dist/**/*.css', 'site/assets', 'site/data/webpackAssets.json']
    })
  ]
})
