/**
 * @description main cropper library.
 */
'use strict'

import * as Utils from './util'
import Handle from './handle'
import Cropper from './cropper'
import Image from './image'

/**
 * @class TinyCrop
 */
export default class TinyCrop {

  constructor ({
    minWidth = -Infinity,
    maxWidth = Infinity,
    minHeight = -Infinity,
    maxHeight = Infinity,
    image = null
  } = {}) {

    Utils.attachPageCss('tiny-crop', `
    .crop-target, .handle, .crop-area { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
    .crop-area { opacity: .5; display: none; background-color: #AAA; border: 1px solid black; position: absolute; box-sizing: border-box;}
    .crop-area.finished .handle { display:block; }
    .handle {position:absolute; border: 2px solid black; display: none; background-color:white; opacity: 1; box-sizing: border-box; width: 10px; height: 10px; z-index: 2; }
    .crop-area.active { display:block; }
    .crop-area.finished { cursor: move; }
    .handle[data-north] { cursor: n-resize; }
    .handle[data-east] { cursor: e-resize; }
    .handle[data-west] { cursor: w-resize; }
    .handle[data-south] { cursor: s-resize; }
    .handle[data-north-west] { cursor: nw-resize; }
    .handle[data-north-east] { cursor: ne-resize; }
    .handle[data-south-west] { cursor: sw-resize; }
    .handle[data-south-east] { cursor: se-resize; }
    .handle[data-north], .handle[data-north-east], .handle[data-north-west] { top: -1px; }
    .handle[data-south], .handle[data-south-east], .handle[data-south-west] { bottom: -1px; }
    .handle[data-east], .handle[data-north-east], .handle[data-south-east] { right: -1px; }
    .handle[data-west], .handle[data-north-west], .handle[data-south-west] { left: -1px; }
    .handle[data-north], .handle[data-south], .handle[data-east], .handle[data-west] { z-index: 1; }
    .handle[data-north], .handle[data-south] { width: 100%; }
    .handle[data-east], .handle[data-west] { height: 100%; }`)

    /**
     * Minimum width of the cropper element.
     * @type {Number}
     */
    this.minWidth = Utils.validateNumber(minWidth)

    /**
     * Minimum height of the cropper element.
     * @type {Number}
     */
    this.minHeight = Utils.validateNumber(minHeight)

    /**
     * Maximum width of the cropper element.
     * @type {Number}
     */
    this.maxWidth = Utils.validateNumber(maxWidth)

    /**
     * Maximum height of the cropper element.
     * @type {Number}
     */
    this.maxHeight = Utils.validateNumber(maxHeight)

    this.cropper = new Cropper({ tinycrop: this })

    this.handles = ['north', 'south', 'east', 'west', 'northEast', 'northWest', 'southEast', 'southWest'].map((handle) => {
      return new Handle({
        handle: handle,
        parent: this.cropper.element,
        tinycrop: this
      })
    })

    this.image = new Image({ image: Utils.getImage(image), tinycrop: this })

    var imageBounds = this.image.bounds()

    this.min = {
      x: imageBounds.left,
      y: imageBounds.top
    }

    this.max = {
      x: imageBounds.left + imageBounds.width,
      y: imageBounds.top + imageBounds.height
    }

    this.cropDimensions = {}

    this.events = {
      done: []
    }

    this.image.startSize()

  }

  initialize () {
    this.cropDimensions.height = 0
    this.cropDimensions.width = 0
    this.cropDimensions.bottom = null
    this.cropDimensions.right = null
    this.cropDimensions.left = null
    this.cropDimensions.top = null
  }

  start () {
    this.cropper.element.classList.add('active')
    this.cropper.element.classList.remove('finished')
  }

  startSize (anchor) {
    this.initialize()
    this.start()
    this.image.size(anchor)
    this.cropper.size(anchor)
    this.handles.forEach((handle) => {
      return handle.size(anchor)
    })
  }

  startResize (anchor) {
    this.start()
    this.cropper.resize(anchor)
    this.image.resize(anchor)
    this.handles.forEach((handle) => {
      return handle.resize(anchor)
    })
  }

  startDrag (anchor) {
    this.start()
    this.cropper.drag(anchor)
    this.image.drag(anchor)
    this.handles.forEach((handle) => {
      return handle.drag(anchor)
    })
  }

  size (anchor, e) {

    if (anchor.y) {
      let inverse = e.clientY < anchor.y
      let min = anchor.y
      let max = window.innerHeight - min
      let cur = Math.max(Math.abs(e.clientY - min), this.minHeight)
      let minDim = inverse ? min - this.min.y : this.max.y - min
      this.cropDimensions.top = !inverse ? min : null
      this.cropDimensions.bottom = inverse ? max : null
      this.cropDimensions.height = Math.min(minDim, cur, this.maxHeight)
    }

    if (anchor.x) {
      let inverse = e.clientX < anchor.x
      let min = anchor.x
      let max = window.innerWidth - min
      let cur = Math.max(Math.abs(e.clientX - min), this.minWidth)
      let minDim = inverse ? min - this.min.x : this.max.x - min
      this.cropDimensions.left = !inverse ? min : null
      this.cropDimensions.right = inverse ? max : null
      this.cropDimensions.width = Math.min(minDim, cur, this.maxWidth)
    }

    this.cropper.update(this.cropDimensions)
  }

  drag (anchor, e) {
    var curX = e.clientX - anchor.x
    var curY = e.clientY - anchor.y
    var maxPosX = this.max.x - this.cropDimensions.width
    var maxPosY = this.max.y - this.cropDimensions.height
    this.cropDimensions.top = Math.max(this.min.y, Math.min(curY, maxPosY))
    this.cropDimensions.left = Math.max(this.min.x, Math.min(curX, maxPosX))
    this.cropper.update(this.cropDimensions)
  }

  finish () {

    this.cropper.element.classList.add('finished')
    this.handles.forEach((handle) => {
      return handle.finish()
    })
    this.cropper.finish()
    this.image.finish()
    this.image.startSize()
    this.cropper.startDrag()
    this.handles.forEach((handle) => {
      return handle.startResize(this.cropDimensions)
    })
    this.events.done.forEach((fn) => {
      return fn(this.cropDimensions)
    })
  }

  on (eventName, fn) {
    if (!Utils.isString(eventName)) {
      throw new Error(`TinyCrop#on: eventName not provided (got ${eventName})`)
    }
    if (!(eventName in this.handlers)) {
      throw new Error(`TinyCrop#on: eventName is invalid (got ${eventName})`)
    }
    if (!Utils.isFunction(fn)) {
      throw new Error(`TinyCrop#on fn was not provided to (got ${fn})`)
    }
    this.handlers[eventName].push(fn)
    return () => { return this.off(eventName, fn)}
  }

  off (eventName, fn) {
    if (!Utils.isString(eventName)) {
      throw new Error(`TinyCrop#off: eventName not provided (got ${eventName}`)
    }
    if (!(eventName in this.handlers)) {
      throw new Error(`TinyCrop#off: eventName is invalid (got ${eventName}`)
    }
    if (Utils.isUndefined(fn)) {
      this.handlers[eventName] = []
      return
    }
    if (!Utils.isFunction(fn)) {
      throw new Error(`TinyCrop#off: fn was not provided (got ${fn} )`)
    }
    var index = this.handlers[eventName].indexOf(fn)
    if (index === -1) {
      throw new Error(`TinyCrop#off: tried to detach fn that was never atteched!`)
    }
    this.handlers[eventName].splice(index, 1)
  }

  destroy() {
    this.eventHandlers.forEach((disposable) => {
      if (disposable) disposable()
    })
    this.eventHandlers = []
    this.image.destroy()
    this.cropper.destroy()
    Utils.forEach(this.handles, (handle) => {
      return handle.destroy()
    })
  }


}
