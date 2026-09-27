const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const isDevMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    main: path.join(__dirname, './src/main/index.ts')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        loader: 'esbuild-loader',
        options: {}
      },
      {
        test: /\.css$/,
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
          'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    extensionAlias: {
      '.js': ['.ts', '.js']
    }
  },
  stats: {
    errorDetails: true
  },
  plugins: [
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
