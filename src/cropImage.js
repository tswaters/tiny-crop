/**
 * @file cropImage
 * @description main file for the CropImage class
 */

'use strict'

/**
 * @class CropImage
 * @extends CropElement
 * @constructor
 * @param {*} opts options for the constructor
 * @param {TinyCrop} tinycrop reference to tinycrop.
 * wrapper for an image element that tinycrop has been attached to.
 */
function CropImage (opts) {
  CropElement.call(this, opts)
}


inherits(CropImage, CropElement, /** @lends CropImage.prototype **/ {

  /**
   * Initialize the dom node for the image
   * @param {DomNode} image image to initialize
   */
  initialize (image) {
    CropElement.prototype.initialize.call(this, image)
    this.element.classList.add('crop-target')
  },

  /**
   * @summary Resets state to initial
   * @description Used after the crop has finished, allows for starting a new crop region
   */
  startSize () {
    this._events.mousedown = attach(this.element, mousedown, e => {
      this.tinycrop.restart({x: e.clientX, y: e.clientY}, e)
    })
  },

  /**
   * Returns the dimensions within which the cropper is bound
   */
  bounds () {
    const rect = this.element.getBoundingClientRect()
    return {
      min: {
        x: rect.left,
        y: rect.top
      },
      max: {
        x: rect.left + rect.width,
        y: rect.top + rect.height
      }
    }
  },

  /**
   * Additional destroy implementation - remove the classList entry added above.
   */
  destroy () {
    CropElement.prototype.destroy.call(this, false)
    this.element.classList.remove('crop-target')
  }

})
