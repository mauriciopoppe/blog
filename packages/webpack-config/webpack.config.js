const path = require('path')
const camelCase = require('camelcase')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const plugins = []

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new UglifyJSPlugin({
      parallel: {
        cache: true,
        workers: 2
      }
    })
  )
}

const entry = path.join(process.cwd(), './src/index.js')
const location = path.join(__dirname, '../../static/', path.basename(process.cwd()))

module.exports = {
  entry,
  output: {
    path: location,
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: camelCase(path.basename(process.cwd()))
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
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
  devtool: 'source-map',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    d3: 'd3'
  },
  plugins
}
