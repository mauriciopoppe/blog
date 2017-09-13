const path = require('path')
const camelCase = require('camelcase')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const plugins = []

// if (process.env.NODE_ENV === 'production') {
//   plugins.push(
//     new UglifyJSPlugin({
//       sourceMap: true,
//       mangle: true,
//       compress: {
//         warnings: false, // Suppress uglification warnings
//         pure_getters: true,
//         unsafe: true,
//         unsafe_comps: true,
//         screw_ie8: true
//       },
//       output: {
//         comments: false
//       },
//       exclude: [/\.min\.js$/gi],
//       parallel: {
//         cache: true,
//         workers: 2
//       }
//     })
//   )
// }

const entry = path.join(process.cwd(), './src/index.js')
const location = path.join(__dirname, '../../static/browser/', path.basename(process.cwd()))

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
    }, {
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
