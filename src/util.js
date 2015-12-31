/**
 * @module src/util
 * @description utilities
 */

'use strict';

/**
 * Verifies a passed parameter is a valid number to work with.
 * @memberOf Crop
 * @param {*} value parameter value to check
 * @param {*} [opts={}] options (optional)
 * @param {number} [opts.min=-Infinity] minimum value
 * @param {number} [opts.max=Infinity] maximum value
 * @returns {number|null} the number or null if invalid.
 */
export function validateNumber (value, opts) {
  opts = opts || {};
  let minValue = isNumber(opts.min) ? opts.min : -Infinity;
  let maxValue = isNumber(opts.max) ? opts.max : Infinity;
  return !isNumber(value) || value <= minValue || value >= maxValue ?
    null :
    value;
}

/**
 * Applies function to each element in collection or array
 * @param {Array|Object} array iteratable entity
 * @param {function()} iterator function applied to each item
 * @returns {Array|Object} returns array passed in.
 */
export function forEach (array, iterator) {
  let isArray = typeof array.length !== 'undefined';
  let enumerable = isArray ? array : Object.keys(array);
  let length = enumerable.length;
  let i = -1;
  while (++i < length) {
    let index = isArray ? i : enumerable[i];
    if (iterator(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Returns whether or not provided value isundefined
 * @param {*} item thing to check if undefined.
 * @returns {boolean} whether passed item was undefined.
 */
export function isUndefined (item) {
  return typeof item === 'undefined';
}

/**
 * Returns whether or not provided value is null
 * @param {*} item thing to check if null.
 * @returns {boolean} whether passed item was null.
 */
export function isNull (item) {
  return item === null;
}

/**
 * Returns whether or not provided value is a function
 * @param {*} item thing to check if function.
 * @returns {boolean} whether passed item is a function.
 */
export function isFunction (item) {
  return typeof item === 'function';
}

/**
 * Version of _.isNumber.
 * @param {*} item item to check if is number or not
 * @returns {boolean} whether the passed item is a number or not.
 */
export function isNumber (item) {
  return typeof item === 'number' ||
    typeof item === 'object' && Object.prototype.toString.call(item) === '[object Number]' ||
    false;
}

/**
 * Version of _.isString.
 * @param {*} item item to check if is number or not
 * @returns {boolean} whether the passed item is a string or not.
 */
export function isString (item) {
  return typeof item === 'string' ||
    typeof item === 'object' && Object.prototype.toString.call(item) === '[object String]' ||
    false;
}
