'use strict'

const _ = require('lodash')
const base = require('./base')
const assert = require('unit.js').assert

describe('exercise the cropper - min/max dimensions', () => {

  before(() => {
    browser.addCommand('setupTinyCrop', base.setup)
    browser.addCommand('destroyTinyCrop', base.destroy)
    browser.addCommand('dragTinyCrop', base.drag)
    browser.url('/index.html')
  })

  beforeEach(() =>{
    browser.setupTinyCrop({
      image: 'image',
      minWidth: 200,
      minHeight: 200,
      maxWidth: 200,
      maxHeight: 200
    })
  })

  afterEach(() => {
    browser.destroyTinyCrop()
  })

  it('should not allow a crop element below min dimensions - non-inverse', () => {
    browser.dragTinyCrop({
      element: '#image',
      start: {x: 0, y: 0},
      end: {x: 150, y: 150},
      result: (dims) => {
        assert(_.isObject(dims))
        assert.equal(dims.width, 200)
        assert.equal(dims.height, 200)
      }
    })
  })

  it('should not allow a crop element below min dimensions - inverse', () => {
    browser.dragTinyCrop({
      element: '#image',
      start: {x: 350, y: 350},
      end: {x: 340, y: 340},
      result: (dims) => {
        assert(_.isObject(dims))
        assert.equal(dims.width, 200)
        assert.equal(dims.height, 200)
      }
    })
  })

  it('should not allow a crop element above max dimensions - non-inverse', () => {
    browser.dragTinyCrop({
      element: '#image',
      start: {x: 0, y: 0},
      end: {x: 250, y: 250},
      result: (dims) => {
        assert(_.isObject(dims))
        assert.equal(dims.width, 200)
        assert.equal(dims.height, 200)
      }
    })
  })

  it('should not allow a crop element above max dimensions - inverse', () => {
    browser.dragTinyCrop({
      element: '#image',
      start: {x: 350, y: 350},
      end: {x: 0, y: 0},
      result: (dims) => {
        assert(_.isObject(dims))
        assert.equal(dims.width, 200)
        assert.equal(dims.height, 200)
      }
    })
  })

})
