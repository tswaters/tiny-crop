/**
 * @file ./src/cropElement
 * @description main file for the CropElement class
 */

'use strict'

/**
* @summary Base class for tiny-crop elements.
* @description
* <p>Contains common functionality. Each "element"" (e.g., each of the handles,
* the cropper element and image) inherits from this class.</p>
* <p>The main tiny-crop class calls drag/size on all available elements.
* This attaches mouseMove and mouseUp handlers to all the elements. This
* ensures when a mouse event occurs on multiple elements, the user gets a
* consistent response i.e., if the mousepointer goes over a handle vs. cropper
* vs. image, it'll behave the same way.</p>
* <p>Also included is common functionality for removing all event handlers. Once
* a mouseUp is fired Tiny-crop will call 'finish' on all elements -- this
* ensures event handlers are cleaned up properly.</p>
* @class CropElement
*/
function CropElement (opts) {
  this.element = null
  this._events = {}
  this.tinycrop = opts.tinycrop
}

/** @lends CropElement.prototype **/
CropElement.prototype = {

  /**
   * Initialize the element's dom node
   * @param {DomElement} element
   */
  initialize (element) {
    this.element = element
    this.element.setAttribute('unselectable', 'on') // for IE<10
    this._events.dragStart = attach(this.element, 'dragstart', e => e.preventDefault())
  },

  /**
   * Returns a mutable rectangle of the current element
   * @returns {ClientRect} not *exactly* a ClientRect, but same properties.
   */
  rect () {
    const rect = this.element.getBoundingClientRect()
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      height: rect.height,
      width: rect.width,
      x: rect.x,
      y: rect.y
    }
  },

  /**
   * Starts a drag operation - attaches mousemove for the operation and mouseup for stopping.
   * @param {{x:number, y:number}} anchor around which the drag operation started.
   */
  drag (anchor) {
    this._events.mousemove = attach(this.element, mousemove, ev => this.tinycrop.drag(anchor, ev))
    this._events.mouseup = attach(this.element, mouseup, ev => this.tinycrop.finish(ev))
  },

  /**
   * Starts a size operation - attaches mousemove for the operation and mouseup for stopping.
   * @param {{x:number, y:number}} anchor around which the size operation started.
   */
  size (anchor) {
    this._events.mousemove = attach(this.element, mousemove, ev => this.tinycrop.size(anchor, ev))
    this._events.mouseup = attach(this.element, mouseup, ev => this.tinycrop.finish(ev))
  },

  /**
   * Signifies an operation has finished - remove all the related events that may have been attached.
   */
  finish () {
    if (this._events.mousedown) { this._events.mousedown(); this._events.mousedown = null }
    if (this._events.mouseup) { this._events.mouseup(); this._events.mouseup = null }
    if (this._events.mousemove) { this._events.mousemove(); this._events.mousemove = null }
  },

  /**
   * Removes all event handlers and if `true` passed, removes the element from the DOM.
   * @param {boolean} [removeElement=false] whether or not to remove the element from the DOM.
   */
  destroy (/*removeElement */) {
    const removeElement = typeof arguments[0] === 'undefined' ? true : arguments[0]
    this.element.removeAttribute('unselectable') // for IE<10
    forEach(this._events, disposable => { if (disposable) { disposable() }})
    if (removeElement) { this.element.parentNode.removeChild(this.element) }
  }
}
