/*eslint no-unused-vars: 0*/

'use strict';

((root, factory) => {
  if (typeof define === 'function' && define.amd) { define([], factory) }
  else if (typeof exports === 'object') { module.exports = factory() }
  else { root.TinyCrop = factory() }
})(this, () => {

/* @include min.js */
/* @include util.js */
/* @include cropElement.js */
/* @include cropper.js */
/* @include handle.js */
/* @include cropImage.js */
/* @include tiny-crop.js */

  return TinyCrop
})
