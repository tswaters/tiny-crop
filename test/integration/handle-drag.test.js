'use strict'

const _ = require('lodash')
const base = require('./base')
const assert = require('unit.js').assert

describe('execise the cropper - resize handles', () => {

  before(() => {
    browser.addCommand('setupTinyCrop', base.setup)
    browser.addCommand('destroyTinyCrop', base.destroy)
    browser.addCommand('dragTinyCrop', base.drag)
    browser.addCommand('dragHandle', base.dragHandle)
    browser.url('/index.html')
  })

  beforeEach(() => {
    browser.setupTinyCrop({
      image: 'image',
      minWidth: 25,
      minHeight: 25,
      maxWidth: 75,
      maxHeight: 75
    })
    browser.dragTinyCrop({
      element: '#image',
      start: {x: 75, y: 75},
      end: {x: 100, y: 100}
    })
  })

  afterEach(() => {
    browser.destroyTinyCrop()
  })

  it('should allow for resizing - north - non-inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-north="true"]',
      end: {x: 0, y: 0}, result: (dims) => { assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - north - inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-north="true"]',
      end: {x: 0, y: 225}, result: (dims) => { assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - northeast - non-inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-northeast="true"]',
      end: {x: 225, y: 0}, result: (dims) => { assert.equal(dims.width, 75); assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - northeast - inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-northeast="true"]',
      end: {x: 0, y: 225}, result: (dims) => { assert.equal(dims.width, 75); assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - northwest - non-inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-northwest="true"]',
      end: {x: 0, y: 0}, result: (dims) => { assert.equal(dims.width, 75); assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - northwest - inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-northwest="true"]',
      end: {x: 225, y: 225}, result: (dims) => { assert.equal(dims.width, 75); assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - south - non-inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-south="true"]',
      end: {x: 0, y: 255}, result: (dims) => { assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - south - inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-south="true"]',
      end: {x: 0, y: 0}, result: (dims) => { assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - southeast - non-inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-southeast="true"]',
      end: {x: 255, y: 255}, result: (dims) => { assert.equal(dims.width, 75); assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - southeast - inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-southeast="true"]',
      end: {x: 0, y: 0}, result: (dims) => { assert.equal(dims.width, 75); assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - southwest - non-inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-southwest="true"]',
      end: {x: 0, y: 255}, result: (dims) => { assert.equal(dims.width, 75); assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - southwest - inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-southwest="true"]',
      end: {x: 255, y: 0}, result: (dims) => { assert.equal(dims.width, 75); assert.equal(dims.height, 75) }
    })
  })

  it('should allow for resizing - east - non-inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-east="true"]',
      end: {x: 225, y: 0}, result: (dims) => { assert.equal(dims.width, 75) }
    })
  })

  it('should allow for resizing - east - inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-east="true"]',
      end: {x: 0, y: 0}, result: (dims) => { assert.equal(dims.width, 75) }
    })
  })

  it('should allow for resizing - west - non-inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-west="true"]',
      end: {x: 0, y: 0}, result: (dims) => { assert.equal(dims.width, 75) }
    })
  })

  it('should allow for resizing - west - inverse', () => {
    browser.dragHandle({parent: '#image', element: '.handle[data-west="true"]',
      end: {x: 225, y: 0}, result: (dims) => { assert.equal(dims.width, 75) }
    })
  })


})
