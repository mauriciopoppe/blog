const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const isDevMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    main: path.join(__dirname, './src/main/index.js'),
    sunset: path.join(__dirname, './src/sunset/index.js'),
    voronoi: path.join(__dirname, './src/voronoi/index.js'),
    jukebox: path.join(__dirname, './src/jukebox/index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    library: '[name]'
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDevMode,
              reloadAll: true
            }
          },
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass')
            }
          }
        ]
      }
    ]
  },
  // resolve: {
  //   alias: {
  //     Containers: path.resolve(process.cwd(), 'src/containers/'),
  //     Components: path.resolve(process.cwd(), 'src/components/')
  //   }
  // },
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    // new webpack.ProvidePlugin({
    //   fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    // }),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isDevMode ? '[name].css' : '[name].[hash:5].css',
      chunkFilename: isDevMode ? '[id].css' : '[id].[hash:5].css'
    }),

    new AssetsPlugin({
      filename: 'webpack.json',
      path: path.join(process.cwd(), 'site/data'),
      prettyPrint: true
    })
  ]
}
