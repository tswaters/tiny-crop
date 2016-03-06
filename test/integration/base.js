'use strict'


module.exports.setup = function (opts) {
  this.execute((_opts) => {
    window.cropper = new TinyCrop(_opts)
    window.cropper.on('done', (dims) => { window.dims = dims })
  }, opts)
}

module.exports.destroy = function () {
  this.execute(() => {
    window.cropper.destroy()
    delete window.dims
    delete window.cropper
  })
}


module.exports.drag = function (opts) {
  const element = opts.element
  const start = opts.start
  const end = opts.end
  const result = opts.result || function () {}
  this.moveToObject(element, start.x, start.y)
  this.buttonDown()
  this.moveToObject(element, end.x, end.y)
  this.buttonUp()
  const dims = this.execute(() => {
    const ret = window.dims
    delete window.dims
    return ret
  })
  result(dims.value)
}

module.exports.dragHandle = function (opts) {
  const parent = opts.parent
  const element = opts.element
  const end = opts.end
  const result = opts.result || function () {}
  this.moveToObject(element)
  this.buttonDown()
  this.moveToObject(parent, end.x, end.y)
  this.buttonUp()
  const dims = this.execute(() => {
    const ret = window.dims
    delete window.dims
    return ret
  })
  result(dims.value)
}
