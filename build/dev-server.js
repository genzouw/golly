'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const devConfigPromise = require('./webpack.dev.conf')

// webpack-cli を使わず Node API で起動する (e2e のランナーと同じ API)
devConfigPromise.then(async devConfig => {
  const compiler = webpack(devConfig)
  const server = new WebpackDevServer(devConfig.devServer, compiler)
  await server.start()
}).catch(err => {
  console.error(err)
  process.exit(1)
})
