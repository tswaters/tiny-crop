
'use strict'

const _ = require('lodash')
const sinon = require('sinon')
const assert = require('unit.js').assert
const object = require('unit.js').object

describe('Handle', () => {

  describe('constructor', () => {

    let elementStub

    beforeEach(() => {
      elementStub = sinon.stub(global, 'CropElement', () => {this.events = {}})
    })

    afterEach(() => {
      elementStub.restore()
    })

    it('should instantiate a handle properly - without directions', () => {
      const handle = new Handle({tinycrop: {}, handle: ''})
      assert(!handle.north, 'north was set')
      assert(!handle.south, 'south was set')
      assert(!handle.east, 'east was set')
      assert(!handle.west, 'west was set')
    })

    it('should instantiate a handle properly - with directions', () => {
      const handle = new Handle({tinycrop: {}, handle: [north, south, east, west].join(' ')})
      assert(handle.north, 'north was not set')
      assert(handle.south, 'south was not set')
      assert(handle.east, 'east was not set')
      assert(handle.west, 'west was not set')
    })

  })

  describe('initialize', () => {
    let _this
    let parent
    let cropElementInitializeStub
    let appendStub

    beforeEach(() => {
      cropElementInitializeStub = sinon.stub(CropElement.prototype, 'initialize', () => {})
      _this = {
        element: _.merge(document.createElement('div'), {dataset: {}}),
        handle: 'north'
      }
      parent = document.createElement('div')
      appendStub = sinon.stub(parent, 'appendChild')
    })

    afterEach(() => {
      cropElementInitializeStub.restore()
    })

    it('should initialize a handle properly', () => {
      Handle.prototype.initialize.call(_this, parent)
      assert(cropElementInitializeStub.calledOnce, 'crop element was not called')
      assert(appendStub.calledOnce, 'append was not called')
      assert(_this.element.classList.contains('handle'), 'handle class not set')
      assert(_this.element.dataset.north, 'north dataset not set')
    })

  })

  describe('startSize', () => {

    let _this
    let attachStub
    let rect

    beforeEach(() => {
      attachStub = sinon.stub(global, 'attach')
      rect = {left: 1000, width: 500, top: 1000, height: 500}
      _this = {
        _events: {},
        element: document.createElement('div'),
        tinycrop: sinon.createStubInstance(TinyCrop)
      }
    })

    afterEach(() => {
      attachStub.restore()
    });

    [
      {handle: {north: true},             assertion: {x: null, y: 1500}},
      {handle: {north: true, west: true}, assertion: {x: 1500, y: 1500}},
      {handle: {north: true, east: true}, assertion: {x: 1000, y: 1500}},
      {handle: {south: true},             assertion: {x: null, y: 1000}},
      {handle: {south: true, west: true}, assertion: {x: 1500, y: 1000}},
      {handle: {south: true, east: true}, assertion: {x: 1000, y: 1000}},
      {handle: {west: true},              assertion: {x: 1500, y: null}},
      {handle: {east: true},              assertion: {x: 1000, y: null}}
    ].forEach((item) => it(`should generate anchor properly - ${JSON.stringify(item.handle)}`, ((_handle, _target) => {

      return function () {
        attachStub.returns({})
        attachStub.callsArgWith(2, {})
        Handle.prototype.startSize.call(_.merge(_this, _handle), rect)
        object(_this._events.mousedown).is({})
        assert(_this.tinycrop.startSize.callCount, 1)
        object(_this.tinycrop.startSize.firstCall.args[0]).is(_target)
        object(attachStub.firstCall.args[0]).is(_this.element)
      }
    })(item.handle, item.assertion)))

  })

})
