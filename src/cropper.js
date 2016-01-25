/**
 * @file cropImage
 * @description main file for the Cropper class
 */

'use strict'

/**
 * @class Cropper
 * @extends CropElement
 */
function Cropper (opts) {
  CropElement.call(this, opts)
}

inherits(Cropper, CropElement, /** @lends Cropper.prototype **/  {

  /**
   * Initialize the dom nodes for the cropper element.
   */
  initialize () {
    CropElement.prototype.initialize.call(this, d.createElement('div'))
    this.element.classList.add(croparea)
    d.body.appendChild(this.element)
  },

  /**
   * identifies that the crop operation has started
   * called after an operation has started - sets classes on the cropper element.
   */
  start () {
    this.element.classList.add('active')
    this.element.classList.remove('finished')
  },

  /**
   * attaches drag functionality to the cropper
   * called after a crop region has been created, allows user to move it.
   */
  startDrag () {
    this._events.mousedown = attach(this.element, mousedown, e => {
      this.tinycrop.startDrag({x: e.offsetX, y: e.offsetY}, e)
    })
  },

  /**
   * Updates the css styles of the cropper element.
   * @param {*} dimensions new cropDimensions to update to
   * @returns {*} rectangle for the new positions.
   */
  update (dimensions) {
    this.element.style.top = dimensions.top != null ? `${dimensions.top}px` : ''
    this.element.style.right = dimensions.right != null ? `${dimensions.right}px` : ''
    this.element.style.bottom = dimensions.bottom != null ? `${dimensions.bottom}px` : ''
    this.element.style.left = dimensions.left != null ? `${dimensions.left}px` : ''
    this.element.style.width = `${dimensions.width}px`
    this.element.style.height = `${dimensions.height}px`
    return this.rect()
  }
})
