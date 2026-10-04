'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const ESLintPlugin = require('eslint-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

// これ以下のサイズのアセットは data URL として埋め込み、超えるものはファイルとして出力する (旧 url-loader の limit)
const ASSET_INLINE_LIMIT = 10000

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingPlugin = () => new ESLintPlugin({
  extensions: ['js', 'vue'],
  files: [resolve('src'), resolve('test')],
  formatter: require('eslint-friendly-formatter'),
  emitWarning: !config.dev.showEslintErrorsInOverlay
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: ASSET_INLINE_LIMIT } },
        generator: { filename: utils.assetsPath('img/[name].[contenthash:7][ext]') }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: ASSET_INLINE_LIMIT } },
        generator: { filename: utils.assetsPath('media/[name].[contenthash:7][ext]') }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: ASSET_INLINE_LIMIT } },
        generator: { filename: utils.assetsPath('fonts/[name].[contenthash:7][ext]') }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    ...(config.dev.useEslint ? [createLintingPlugin()] : [])
  ]
}
