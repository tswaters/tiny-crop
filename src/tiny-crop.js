/**
 * @description main cropper library.
 */
'use strict';

import * as Utils from './util';

/**
 * @class TinyCrop
 */
export default class TinyCrop {

  constructor (opts) {

    opts = opts || {};

    /**
     * Minimum width of the cropper element.
     * @type {Number}
     */
    this.minWidth = Utils.validateNumber(opts.minWidth) || -Infinity;

    /**
     * Minimum height of the cropper element.
     * @type {Number}
     */
    this.minHeight = Utils.validateNumber(opts.minHeight) || -Infinity;

    /**
     * Maximum width of the cropper element.
     * @type {Number}
     */
    this.maxWidth = Utils.validateNumber(opts.maxWidth) || Infinity;

    /**
     * Maximum height of the cropper element.
     * @type {Number}
     */
    this.maxHeight = Utils.validateNumber(opts.maxHeight) || Infinity;

    // todo: finish this.

  }
}
