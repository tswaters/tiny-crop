
'use strict'

const assert = require('unit.js').assert
const object = require('unit.js').object
const sinon = require('sinon')

describe('CropImage', () => {

  describe('#constructor', () => {

    let elementStub

    beforeEach(() => {
      elementStub = sinon.stub(global, 'CropElement', () => {this._events = {}})
    })

    afterEach(() => {
      elementStub.restore()
    })

    it('should instantiate an image properly', () => {
      new CropImage({tinycrop: {}})
      assert(elementStub.called, 'cropElement was not called')
    })

  })

  describe('#initialize', () => {

    let _this
    let image
    let cropElementInitializeStub

    beforeEach(() => {
      image = document.createElement('img')
      _this = {
        element: image
      }
      cropElementInitializeStub = sinon.stub(CropElement.prototype, 'initialize')
    })

    afterEach(() => {
      cropElementInitializeStub.restore()
    })

    it('should set up the image element properly', () => {
      CropImage.prototype.initialize.call(_this, image)
      assert(image.classList.contains('crop-target'), 'class not set properly')
    })

  })

  describe('#startSize', () => {

    let _this
    let attachStub

    beforeEach(() => {
      _this = {
        element: document.createElement('img'),
        _events: {},
        tinycrop: sinon.createStubInstance(TinyCrop)
      }
      attachStub = sinon.stub(global, 'attach')
    })

    afterEach(() => {
      attachStub.restore()
    })

    it('should attach an event, event should call tinycrop#startSize', () => {
      attachStub.returns({})
      attachStub.callsArgWith(2, {clientX: 1, clientY: 1})
      CropImage.prototype.startSize.call(_this)
      object(_this._events.mousedown).is({})
      assert(_this.tinycrop.restart.callCount, 1)
      object(_this.tinycrop.restart.firstCall.args[0]).is({x: 1, y: 1})
      object(attachStub.firstCall.args[0]).is(_this.element)
    })

  })

  describe('#bounds', () => {

    let _this
    let clientRectStub

    beforeEach(() => {
      _this = {
        element: document.createElement('img')
      }
      clientRectStub = sinon.stub(_this.element, 'getBoundingClientRect').returns({left: 0, top: 0, width: 10, height: 10})
    })

    afterEach(() => {
      clientRectStub.restore()
    })

    it('should set up the image element properly', () => {
      const bounds = CropImage.prototype.bounds.call(_this)
      object(bounds).is({min: {x: 0, y: 0}, max: {x: 10, y: 10}})
    })

  })

  describe('#destroy', () => {

    let _this
    let elementDestroyStub

    beforeEach(() => {
      _this = {
        element: document.createElement('img')
      }
      elementDestroyStub = sinon.stub(CropElement.prototype, 'destroy')
    })

    afterEach(() => {
      elementDestroyStub.restore()
    })

    it('should set up the image element properly', () => {
      CropImage.prototype.destroy.call(_this)
      assert.equal(CropElement.prototype.destroy.callCount, 1)
      assert.equal(CropElement.prototype.destroy.firstCall.args[0], false)
      assert(!_this.element.classList.contains('crop-target'), 'class not set properly')
    })

  })

})
