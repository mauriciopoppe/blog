#!/usr/bin/env node
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const dev = process.argv[2] === 'start'
const config = require(dev ? './webpack.config.dev' : './webpack.config.prod')
console.log(dev ? 'running in dev mode' : 'running in prod mode')

let customConfig = {}
try {
  customConfig = require(path.join(process.cwd(), 'webpack.config.js'))
} catch (e) {}

const merged = merge(config, customConfig)
const compiler = webpack(merged)

function clearConsole () {
  process.stdout.write(
    process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H'
  )
}

function compilerCallback (err, stats) {
  if (err) {
    console.error(err.stack || err)
    if (err.details) {
      console.error(err.details)
    }
    return
  }

  const info = stats.toJson()

  if (stats.hasErrors()) {
    console.error(info.errors)
    return
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings)
    return
  }

  const statsOpts = dev ? 'errors-only' : {}
  console.log(stats.toString(statsOpts))
}

if (dev) {
  compiler.watch({}, compilerCallback)
} else {
  compiler.run(compilerCallback)
}
