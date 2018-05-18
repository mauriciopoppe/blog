const path = require('path')
const camelCase = require('camelcase')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const plugins = [
  new FriendlyErrorsWebpackPlugin()
]

const entry = path.join(process.cwd(), './src/index.js')
const location = path.join(__dirname, '../../static/js/browser/', path.basename(process.cwd()))

module.exports = {
  entry,
  output: {
    path: location,
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: camelCase(path.basename(process.cwd())),
    publicPath: `/${path.basename(process.cwd())}/`
  },
  module: {
    rules: [{
      // test: /\.(js|jsx)$/,
      // enforce: 'pre',
      // exclude: /node_modules/,
      // use: 'eslint-loader'
    // }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.svg$/,
      use: 'svg-sprite-loader'
    },
    { test: /\.(glsl|frag|vert)$/, use: 'raw-loader', exclude: /node_modules/ },
    { test: /\.(glsl|frag|vert)$/, use: 'glslify-loader', exclude: /node_modules/ },
    {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    }]
  },
  resolve: {
    alias: {
      Containers: path.resolve(process.cwd(), 'src/containers/'),
      Components: path.resolve(process.cwd(), 'src/components/')
    }
  },
  devtool: 'cheap-module-source-map',
  plugins
}
