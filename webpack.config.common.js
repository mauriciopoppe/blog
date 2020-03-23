const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

const camelCase = require('camelcase')
// const location = path.join(__dirname, 'dist/static/js/browser/', path.basename(process.cwd()))

module.exports = {
  entry: {
    main: path.join(__dirname, './src/main/index.js'),
    sunset: path.join(__dirname, './src/sunset/index.js'),
    voronoi: path.join(__dirname, './src/voronoi/index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: '[id]'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        use: 'svg-sprite-loader'
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: 'glslify-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  // resolve: {
  //   alias: {
  //     Containers: path.resolve(process.cwd(), 'src/containers/'),
  //     Components: path.resolve(process.cwd(), 'src/components/')
  //   }
  // },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),

    new AssetsPlugin({
      filename: 'webpack.json',
      path: path.join(process.cwd(), 'site/data'),
      prettyPrint: true
    }),

    new CopyWebpackPlugin([
      {
        from: './site/static/fonts/',
        to: 'fonts/',
        flatten: true
      }
    ])
  ]
}
