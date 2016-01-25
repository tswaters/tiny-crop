
import * as Util from './util'

/**
 * @summary Base class for tiny-crop elements.
 * @description
 * Contains common functionality. Each "element"" (e.g., each of the handles,
 * the cropper element and image) inherits from this class.
 *
 * The main tiny-crop class calls drag/size/resize on all available elements.
 * This attaches mouseMove and mouseUp handlers to all the elements. This
 * ensures when a mouse event occurs on multiple elements, the user gets a
 * consistent response i.e., if the mousepointer goes over a handle vs. cropper
 * vs. image, it'll behave the same way.
 *
 * Also included is common functionality for removing all event handlers. Once
 * a mouseUp is fired Tiny-crop will call 'finish' on all elements -- this
 * ensures event handlers are cleaned up properly.
 *
 * @class Element
 */
export default class Element {

  /**
   * Constructor call - set up events and a dragstart event that prevents dragging.
   */
  constructor (element) {
    this.element = element
    this.element.setAttribute('unselectable', 'on') // for IE<10
    this.events = {}
    this.events.dragStart = Util.attach(this.element, 'dragstart', (e) => e.preventDefault())
  }

  /**
   * Starts a drag operation - attaches mousemove for the operation and mouseup for stopping.
   * @param {{x:number, y:number}} anchor around which the drag operation started.
   */
  drag (anchor) {
    this.events.mouseMove = Util.attach(this.element, 'mousemove', (ev) => this.tinycrop.drag(anchor, ev))
    this.events.mouseUp = Util.attach(this.element, 'mouseup', (ev) => this.tinycrop.finish(ev))
  }

  /**
   * Starts a size operation - attaches mousemove for the operation and mouseup for stopping.
   * @param {{x:number, y:number}} anchor around which the size operation started.
   */
  size (anchor) {
    this.events.mouseMove = Util.attach(this.element, 'mousemove', (ev) => this.tinycrop.size(anchor, ev))
    this.events.mouseUp = Util.attach(this.element, 'mouseup', (ev) => this.tinycrop.finish(ev))
  }

  /**
   * Starts a resize operation - attaches mousemove for the operation and mouseup for stopping.
   * @param {{x:number, y:number}} anchor around which the resize operation started.
   */
  resize (anchor) {
    this.events.mouseMove = Util.attach(this.element, 'mousemove', (ev) => this.tinycrop.size(anchor, ev))
    this.events.mouseUp = Util.attach(this.element, 'mouseup', (ev) => this.tinycrop.finish(ev))
  }

  /**
   * Signifies an operation has finished - remove all the related events that may have been attached..
   */
  finish () {
    if (this.events.mouseDown) { this.events.mouseDown(); this.events.mouseDown = null }
    if (this.events.mouseUp) { this.events.mouseUp(); this.events.mouseUp = null }
    if (this.events.mouseMove) { this.events.mouseMove(); this.events.mouseMove = null }
  }

  /**
   * Returns a ClientRect for the associated element.
   */
  bounds () {
    return Util.safeGetRect(this.element)
  }

  /**
   * Removes all event handlers and if `true` passed, removes the element from the DOM.
   * @param {boolean} [removeElement=false] whether or not to remove the element from the DOM.
   */
  destroy (removeElement) {
    Util.forEach(this.events, (disposable) => { if (disposable) disposable() })
    if (Util.isUndefined(removeElement)) { removeElement = true }
    if (removeElement) { this.element.parentNode.removeChild(this.element) }
  }
}
