'use strict'

require('mocha-jsdom')()

const vm = require('vm')
const fs = require('fs')
const path = require('path')

;[
  './src/min.js',
  './src/util.js',
  './src/cropElement.js',
  './src/cropper.js',
  './src/handle.js',
  './src/cropImage.js',
  './src/tiny-crop.js'
].forEach(file => {
  // see: https://github.com/gotwarlost/istanbul/issues/352
  vm.runInThisContext(fs.readFileSync(file).toString(), path.resolve(file))
})
