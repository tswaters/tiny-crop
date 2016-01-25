/**
 * @module src/util
 * @description utilities
 */

'use strict'

/**
 * Adds css to the page.
 * @param {string} id id of the style element to search for
 * @param {string} css css to use as the inner text node.
 */
export function attachPageCss (id, css) {
  let styleElement = document.getElementById(id)
  if (!styleElement) { styleElement = document.createElement('style') }
  styleElement.type = 'text/css'
  styleElement.innerHTML = css
  document.head.appendChild(styleElement)
}

/**
 * Attaches event listener, returns function that removes.
 * @param {DomElement} element dom node to attach to.
 * @param {string} eventName event name
 * @param {function()} fn function to attach.
 * @returns {function()} a function that, when called, removes event listener
 * @example
 * var element = document.getElementById('some-element')
 * var disposable = Events.attach(element, 'click', () => { console.log('clicked'); })
 * disposable() // removes event handler
 */
export function attach (element, eventName, fn) {
  const handle = function (e) {
    e.stopPropagation()
    fn.call(this, e)
  }
  element.addEventListener(eventName, handle)
  return function () {
    element.removeEventListener(eventName, handle)
  }
}

/**
 * Ensures a DOM element that is an image from a string (from document) or object (assuming this is image)
 * (either passed directly, or through getElementById)
 * @param {string|object} thing
 * @returns {HTMLImageElement} image element
 */
export function getImage (thing) {
  let ret
  if (isString(thing) && isNull(ret = document.getElementById(thing))) {
    throw new Error('Could not find element #' + thing)
  }
  else if (thing instanceof HTMLImageElement) {
    ret = thing
  }
  if (!(ret && ret instanceof HTMLImageElement)) {
    throw new Error('Provided argument, ' + thing + 'did not resolve to image')
  }
  return ret
}

/**
 * Retrieves a ClientRect, ensuring height/width are present (IE8 doesn't include these)
 * @param {HTMLElement} element dom element for getting the rect for
 * @returns {ClientRect} rectangle guarenteed to include height/width.
 */
export function safeGetRect (element) {
  let rect = element.getBoundingClientRect()

  // IE8 doesn't provide height/width
  if (!(rect.height || rect.width)) {

    // also doesn't like overriding properties on native objects.
    rect = {
      'top': rect.top,
      'bottom': rect.bottom,
      'left': rect.left,
      'right': rect.right,
      'height': rect.bottom - rect.top,
      'width': rect.right - rect.left
    }

  }

  return rect
}

/**
 * Verifies a passed parameter is a valid number to work with.
 * @memberOf Crop
 * @param {*} value parameter value to check
 * @param {object} [opts={}] options (optional)
 * @param {number} [opts.min=-Infinity] minimum value
 * @param {number} [opts.max=Infinity] maximum value
 * @returns {number|null} the number or null if invalid.
 */
export function validateNumber (value, opts) {
  opts = opts || {}
  const minValue = isNumber(opts.min) ? opts.min : -Infinity
  const maxValue = isNumber(opts.max) ? opts.max : Infinity
  return !isNumber(value) || value < minValue || value > maxValue ?
    null :
    value
}

/**
 * Applies function to each element in collection or array
 * @param {Array|Object} array iteratable entity
 * @param {function()} iterator function applied to each item
 * @returns {Array|Object} returns array passed in.
 */
export function forEach (array, iterator) {
  const isArray = typeof array.length !== 'undefined'
  const enumerable = isArray ? array : Object.keys(array)
  const length = enumerable.length
  let i = -1
  while (++i < length) {
    const index = isArray ? i : enumerable[i]
    if (iterator(array[index], index, array) === false) {
      break
    }
  }
  return array
}

/**
 * Returns whether or not provided value isundefined
 * @param {*} item thing to check if undefined.
 * @returns {boolean} whether passed item was undefined.
 */
export function isUndefined (item) {
  return typeof item === 'undefined'
}

/**
 * Returns whether or not provided value is null
 * @param {*} item thing to check if null.
 * @returns {boolean} whether passed item was null.
 */
export function isNull (item) {
  return item === null
}

/**
 * Returns whether or not provided value is a function
 * @param {*} item thing to check if function.
 * @returns {boolean} whether passed item is a function.
 */
export function isFunction (item) {
  return typeof item === 'function'
}

/**
 * Version of _.isNumber.
 * @param {*} item item to check if is number or not
 * @returns {boolean} whether the passed item is a number or not.
 */
export function isNumber (item) {
  return typeof item === 'number' ||
    typeof item === 'object' && Object.prototype.toString.call(item) === '[object Number]' ||
    false
}

/**
 * Version of _.isString.
 * @param {*} item item to check if is number or not
 * @returns {boolean} whether the passed item is a string or not.
 */
export function isString (item) {
  return typeof item === 'string' ||
    typeof item === 'object' && Object.prototype.toString.call(item) === '[object String]' ||
    false
}
