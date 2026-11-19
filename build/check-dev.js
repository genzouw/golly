'use strict'
// dev 設定（webpack.dev.conf.js）がコンパイルできることだけを確認する。
// dev サーバーは起動しない。prod 設定では通らない vue-style-loader 等の検証用
process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const devConfigPromise = require('./webpack.dev.conf')

devConfigPromise.then(devConfig => {
  const compiler = webpack(devConfig)
  compiler.run((err, stats) => {
    compiler.close(() => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(stats.toString({ colors: false, chunks: false, modules: false, children: false }))
      process.exit(stats.hasErrors() ? 1 : 0)
    })
  })
}).catch(err => {
  console.error(err)
  process.exit(1)
})
