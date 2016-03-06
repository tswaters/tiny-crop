/**
 * @file tiny-crop
 * @description main cropper file definition
 */

'use strict'

/**
 * @class TinyCrop
 * @constructor
 * @param {*} [opts={}] options
 * @param {string|HTMLImageElement} [opts.image] image element to attach to
 * @param {number|string} [opts.minWidth=0] minimum width for the crop
 * @param {number|string} [opts.minWidth=Infinity] maximum width for the crop
 * @param {number|string} [opts.minWidth=0] minimum height for the crop
 * @param {number|string} [opts.minWidth=Infinity] maximum height for the crop
 */
function TinyCrop (/*opts*/) {
  const opts = arguments[0] || {}


  /**
   * Minimum width of the crop dimension
   * @type {number}
   * @access private
   */
  this.minWidth = validateNumber(parseInt(opts.minWidth, 10) || 0)

  /**
   * Maximum width of the crop dimension
   * @type {number}
   * @access private
   */
  this.maxWidth = validateNumber(parseInt(opts.maxWidth, 10) || Infinity)

  /**
   * Minimum height of the crop dimension
   * @type {number}
   * @access private
   */
  this.minHeight = validateNumber(parseInt(opts.minHeight, 10) || 0)

  /**
   * Maximum height of the crop dimension
   * @type {number}
   * @access private
   */
  this.maxHeight = validateNumber(parseInt(opts.maxHeight, 10) || Infinity)

  /**
   * Image tied to the TinyCrop instance
   * Note - this name will be minified away by uglifyjs
   * @type {CropImage}
   * @private
   */
  this._image = new CropImage({tinycrop: this})

  /**
   * Cropper element tied to the TinyCrop instance
   * Note - this name will be minified away by uglifyjs
   * @type {Cropper}
   * @private
   */
  this._cropper = new Cropper({tinycrop: this})

  /**
   * Array of handles tied to the TinyCrop instance
   * Note - this name will be minified away by uglifyjs
   * @type {Handle[]}
   * @private
   */
  this._handles = [
    north,
    south,
    east,
    west,
    north + east,
    north + west,
    south + east,
    south + west
  ].map(handle => new Handle({tinycrop: this, handle}))

  this._cropDimensions = {}

  this._bounds = {}

  this._events = {done: []}

  this._docMouseUp = null

  let styleElement = document.getElementById('tiny-crop-css')
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = 'tiny-crop-css'
    styleElement.type = 'text/css'
    document.head.appendChild(styleElement)
    styleElement.innerHTML = [
      `.crop-target,.${handle},.${croparea}{user-select:none;box-sizing:border-box}`,
      `.${croparea}{opacity:.5;display:none;background-color:#AAA;border:1px solid;position:absolute}`,
      `.${croparea}.finished .${handle}{display:block}`,
      `.${handle}{position:absolute;border:2px solid;display:none;background-color:#fff;width:10px;height:10px;z-index:2}`,
      `.${croparea}.active{display:block}`,
      `.${croparea}.finished{cursor:move}`,
      `.${handle}[${data + north}]{cursor:n-resize}`,
      `.${handle}[${data + west}]{cursor:e-resize}`,
      `.${handle}[${data + east}]{cursor:w-resize}`,
      `.${handle}[${data + south}]{cursor:s-resize}`,
      `.${handle}[${data + north + west}]{cursor:nw-resize}`,
      `.${handle}[${data + north + east}]{cursor:ne-resize}`,
      `.${handle}[${data + south + west}]{cursor:sw-resize}`,
      `.${handle}[${data + south + east}]{cursor:se-resize}`,
      `.${handle}[${data + north}],.${handle}[${data + north + east}],.${handle}[${data + north + west}]{top:-1px}`,
      `.${handle}[${data + south}],.${handle}[${data + south + east}],.${handle}[${data + south + west}]{bottom:-1px}`,
      `.${handle}[${data + east}],.${handle}[${data + north + east}],.${handle}[${data + south + east}]{right:-1px}`,
      `.${handle}[${data + west}],.${handle}[${data + north + west}],.${handle}[${data + south + west}]{left:-1px}`,
      `.${handle}[${data + north}],.${handle}[${data + south}],.${handle}[${data + east}],.${handle}[${data + west}]{z-index:1}`,
      `.${handle}[${data + north}],.${handle}[${data + south}]{width:100%}`,
      `.${handle}[${data + east}],.${handle}[${data + west}]{height:100%})`
    ].join('')
  }

  this.initialize(getImage(opts.image))

}

/** @lends TinyCrop.prototype **/
TinyCrop.prototype = {

  /**
   * Initializes tiny-crop.
   * @param {HTMLImageElement} image image to attach to.
   */
  initialize (image) {
    this._image.initialize(image)
    this._cropper.initialize()
    this._handles.forEach(handle => handle.initialize(this._cropper.element))
    this._bounds = this._image.bounds()
    this._image.startSize()
  },

  /**
   * Signifies a crop operation has started
   */
  start () {
    this._cropper.start()
    this._docMouseUp = attach(document, 'mouseup', () => this.finish())
  },

  /**
   * Resets the crop operation to initial state
   */
  restart (anchor) {
    this._cropDimensions.height = 0
    this._cropDimensions.width = 0
    this._cropDimensions.bottom = null
    this._cropDimensions.right = null
    this._cropDimensions.left = null
    this._cropDimensions.top = null
    this.startSize(anchor)
  },

  /**
   * Signifies a crop operation has completed
   * @emits done
   */
  finish () {
    if (this._docMouseUp) { this._docMouseUp(); this._docMouseUp = null }
    this._cropper.element.classList.add('finished')
    this._handles.forEach(handle => handle.finish())
    this._cropper.finish()
    this._image.finish()
    this._image.startSize()
    this._cropper.startDrag()
    this._handles.forEach(handle => handle.startSize(this._cropDimensions))
    this._events.done.forEach(fn => fn(this._cropper.rect()))
  },

  /**
   * Starts a size operation given the provided anchor
   * @param {*} anchor x/y coordinates from which the operation was started
   */
  startSize (anchor) {
    this.start()
    this._image.size(anchor)
    this._cropper.size(anchor)
    this._handles.forEach(handle => handle.size(anchor))
  },

  /**
   * Starts a drag operation given the provided anchor
   * @param {*} anchor x/y coordinates from which the operation was started
   */
  startDrag (anchor) {
    this.start()
    this._image.drag(anchor)
    this._cropper.drag(anchor)
    this._handles.forEach(handle => handle.drag(anchor))
  },

  /**
   * Sizing operation - resizes the crop element based on event arguments and initial anchor
   * @param {*} anchor x/y coordinates from which the operation was started
   * @param {MouseEvent} e underlying mouse event.
   */
  size (anchor, e) {
    let inverse

    if (anchor.y != null) {
      inverse = e.clientY < anchor.y
      const height = Math[min](
        Math[max](this.minHeight, inverse ? anchor.y - this._bounds.min.y : this._bounds.max.y - anchor.y),
        Math[max](this.minHeight, Math.abs(e.clientY - anchor.y)),
        this.maxHeight
      )
      this._cropDimensions.top = !inverse ? Math[min](anchor.y, this._bounds.max.y - height) : null
      this._cropDimensions.bottom = inverse ? Math[min](
        window.innerHeight - anchor.y,
        window.innerHeight - (this._bounds.min.y + height)
      ) : null
      this._cropDimensions.height = height
    }
    if (anchor.x != null) {
      inverse = e.clientX < anchor.x
      const width = Math[min](
        Math[max](this.minWidth, inverse ? anchor.x - this._bounds.min.x : this._bounds.max.x - anchor.x),
        Math[max](this.minWidth, Math.abs(e.clientX - anchor.x)),
        this.maxWidth
      )
      this._cropDimensions.left = !inverse ? Math[min](anchor.x, this._bounds.max.x - width) : null
      this._cropDimensions.right = inverse ? Math[min](
        window.innerWidth - anchor.x,
        window.innerWidth - (this._bounds.min.x + width)
      ) : null
      this._cropDimensions.width = width
    }

    this._cropDimensions = this._cropper.update(this._cropDimensions)
  },

  /**
   * Sizing operation - moves the crop element without changing size based on event arguments and initial anchor
   * @param {*} anchor x/y coordinates from which the operation was started
   * @param {MouseEvent} e underlying mouse event.
   */
  drag (anchor, e) {
    this._cropDimensions.top = Math[max](this._bounds.min.y, Math[min](e.clientY - anchor.y, this._bounds.max.y - this._cropDimensions.height))
    this._cropDimensions.right = null
    this._cropDimensions.bottom = null
    this._cropDimensions.left = Math[max](this._bounds.min.x, Math[min](e.clientX - anchor.x, this._bounds.max.x - this._cropDimensions.width))
    this._cropper.update(this._cropDimensions)
  },

  /**
   * Attaches an event to the cropper
   * @param {string} eventName name of the event ('done')
   * @param {function} fn function to invoke
   * @returns {function} when called, removes event listener
   */
  on (eventName, fn) {
    if (typeof eventName !== 'string' || !this._events[eventName] || typeof fn !== 'function') {
      throw new Error(parameterError)
    }
    this._events[eventName].push(fn)
    return () => this.off(eventName, fn)
  },

  /**
   * Removes an event from the cropper
   * @param {string} eventName name of the event ('done')
   * @param {function} [fn] function to invoke - when not provided, all events are removed
   */
  off (eventName, fn) {
    if (typeof eventName !== 'string' || !this._events[eventName]) {
      throw new Error(parameterError)
    }
    if (typeof fn === 'undefined') {
      this._events[eventName] = []
      return
    }
    if (typeof fn !== 'function') {
      throw new Error(parameterError)
    }
    const index = this._events[eventName].indexOf(fn)
    if (index === -1) {
      throw new Error(parameterError)
    }
    this._events[eventName].splice(index, 1)
  },

  /**
   * Removes all traces of this TinyCrop instance from the page
   */
  destroy () {
    if (this._docMouseUp) { this._docMouseUp(); this._docMouseUp = null }
    this._events.done = []
    this._image.destroy()
    this._cropper.destroy()
    this._handles.forEach(handle => handle.destroy())
  }

}
