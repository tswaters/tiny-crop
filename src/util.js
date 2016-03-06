/*eslint no-unused-vars: 0*/
/**
 * @file util
 * @description utilities
 */

'use strict'

/**
 * Attaches event listener, returns function that removes.
 * @param {DomElement} element dom node to attach to.
 * @param {string} eventName event name
 * @param {function()} fn function to attach.
 * @returns {function()} a function that, when called, removes event listener
 * @example
 * let element = document.getElementById('some-element')
 * let disposable = Events.attach(element, 'click', () => { console.log('clicked'); })
 * disposable() // removes event handler
 * @access private
 */
function attach (element, eventName, fn) {
  const handle = function (e) {
    e.stopPropagation()
    fn.call(this, e)
  }
  element.addEventListener(eventName, handle)
  return () => {
    element.removeEventListener(eventName, handle)
  }
}

/**
 * Ensures a DOM element that is an image from a string (from document) or object (assuming this is image)
 * (either passed directly, or through getElementById)
 * @param {string|object} thing
 * @returns {HTMLImageElement} image element
 * @access private
 */
function getImage (thing) {
  const image = typeof thing === 'string' ?
    document.getElementById(thing) :
    thing
  if (image instanceof HTMLImageElement) {
    return image
  }
  throw new Error(parameterError)
}

/**
 * Verifies a passed parameter is a valid number to work with.
 * @memberOf Crop[]
 * @param {*} value parameter value to check
 * @param {object} [opts={}] options (optional)
 * @param {number} [opts.min=-Infinity] minimum value
 * @param {number} [opts.max=Infinity] maximum value
 * @returns {number|null} the number or null if invalid.
 * @access private
 */
function validateNumber (value /*, opts */) {
  const opts = arguments[1] || {}
  const minValue = typeof opts.min === 'number' ? opts.min : -Infinity
  const maxValue = typeof opts.max === 'number' ? opts.max : Infinity
  return isNaN(value) || typeof value !== 'number' || value < minValue || value > maxValue ?
    null :
    value
}

/**
 * Applies function to each element in collection or array
 * @param {Array|Object} array iteratable entity
 * @param {function()} iterator function applied to each item
 * @returns {Array|Object} returns array passed in.
 * @access private
 */
function forEach (array, iterator) {
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
 * attaches a prototype with additional attributes to a class.
 * @param {*} ctor constructor
 * @param {*} superCtor super-class constructor
 * @param {*} attrs additional attributes to attach
 * @access private
 */
function inherits (ctor, superCtor, attrs) {
  const proto = Object.create(superCtor.prototype)
  forEach(attrs, (value, key) => {
    proto[key] = value
  })
  ctor.prototype = Object.create(proto)
  ctor.prototype.constructor = superCtor
}
