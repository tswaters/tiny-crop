/**
 * @file handle.js
 * @description main file for the Handle class
 */

'use strict'

/**
 * Handles are used to size the cropper element once cropper dimensions are set
 * @constructor
 * @extends CropElement
 * @param {*} opts options to pass to the constructor
 * @param {TinyCrop} opts.tinycrop reference to tinycrop
 * @param {string} opts.handle handle key identifying what handle it is
 */
function Handle (opts) {
  CropElement.call(this, opts)
  this.handle = opts.handle
  this.north = opts.handle.indexOf(north) > -1
  this.south = opts.handle.indexOf(south) > -1
  this.east = opts.handle.indexOf(east) > -1
  this.west = opts.handle.indexOf(west) > -1
}

inherits(Handle, CropElement, /** @lends Handle.prototype **/ {

  /**
   * Initialize the dom nodes for the handle
   * @param {DomNode} parent parent element to append to (cropper).
   */
  initialize (parent) {
    CropElement.prototype.initialize.call(this, document.createElement('div'))
    this.element.dataset[this.handle] = true
    this.element.classList.add('handle')
    parent.appendChild(this.element)
  },

  /**
   * Signifies we need to be able to size - mousedown on handle starts the process.
   * The anchor is based upon which handle the user has selected.
   * @param {ClientRect} rect rectangle representing the cropper
   */
  startSize (rect) {
    this._events.mousedown = attach(this.element, mousedown, e => {
      this.tinycrop.startSize({
        x:
          this.west ? rect.left + rect.width :
          this.east ? rect.left :
          null,
        y:
          this.north ? rect.top + rect.height :
          this.south ? rect.top :
          null
      }, e)
    })
  }

})
