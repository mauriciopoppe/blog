const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const isDevMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    main: path.join(__dirname, './src/main/index.ts'),
    sunset: path.join(__dirname, './src/sunset/index.ts'),
    voronoi: path.join(__dirname, './src/voronoi/index.ts'),
    jukebox: path.join(__dirname, './src/jukebox/index.ts'),
    learnFrench: path.join(__dirname, './src/learn-french/App.jsx')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    library: '[name]'
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: {
          // JavaScript version to transpile to
          target: 'es2015'
        }
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
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // css-loader v4 introduced a change that makes url(/images/foo) fail
              // I use the above for the image to use in the background of the
              // interview preparation article, disabling it makes it work fine again.
              url: false
            }
          },
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs']
    }
  },
  optimization: {
    runtimeChunk: 'single'
  },
  stats: {
    errorDetails: true
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    // }),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isDevMode ? '[name].css' : '[name].[contenthash:5].css',
      chunkFilename: isDevMode ? '[id].css' : '[id].[contenthash:5].css'
    }),

    new AssetsPlugin({
      filename: 'webpackAssets.json',
      path: path.join(process.cwd(), 'site/data'),
      prettyPrint: true
    })
  ]
}
