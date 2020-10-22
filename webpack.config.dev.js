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
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    contentBase: path.join(process.cwd(), './dist'),
    disableHostCheck: true,
    watchContentBase: true,
    quiet: false,
    open: true,
    historyApiFallback: {
      rewrites: [{ from: /./, to: '404.html' }]
    }
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['dist/**/*.js', 'dist/**/*.css', 'site/data/webpack.json']
    })
  ]
})
