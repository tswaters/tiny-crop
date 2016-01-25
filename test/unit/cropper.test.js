'use strict'

const assert = require('unit.js').assert
const object = require('unit.js').object
const sinon = require('sinon')

describe('Cropper', () => {

  describe('constructor', () => {

    let cropElementStub

    beforeEach(() => {
      cropElementStub = sinon.stub(global, 'CropElement', () => {})
    })

    afterEach(() => {
      cropElementStub.restore()
    })

    it('should instantiate a cropper properly', () => {
      new Cropper({tinycrop: {}})
      assert(cropElementStub.calledOnce, 'crop element was not called')
    })

  })

  describe('initialize', () => {

    let _this
    let cropElementStub
    let appendStub

    beforeEach(() => {
      cropElementStub = sinon.stub(CropElement.prototype, 'initialize')
      appendStub = sinon.stub(document.body, 'appendChild')
      _this = {
        element: document.createElement('div')
      }
    })

    afterEach(() => {
      cropElementStub.restore()
      appendStub.restore()
    })

    it('should instantiate a cropper properly', () => {
      Cropper.prototype.initialize.call(_this)
      assert(cropElementStub.calledOnce, 'crop element was not called')
      assert(appendStub.calledOnce, 'append was not called')
      assert(_this.element.classList.contains(croparea), 'croparea class not set')
    })

  })

  describe('#start', () => {

    let _this

    beforeEach(() => {
      _this = {
        element: document.createElement('div')
      }
    })

    it('should have correct classes', () => {
      Cropper.prototype.start.call(_this)
      assert(_this.element.classList.contains('active'), 'cropper didnt have active class')
      assert(!_this.element.classList.contains('finished'), 'cropper had finished class')
    })

  })

  describe('#startDrag', () => {

    let _this
    let attachStub

    beforeEach(() => {
      _this = {
        element: document.createElement('div'),
        tinycrop: sinon.createStubInstance(TinyCrop),
        _events: {}
      }
      attachStub = sinon.stub(global, 'attach')
    })

    afterEach(() => {
      attachStub.restore()
    })

    it('should attach an event, event should call tinycrop#startSize', () => {
      attachStub.returns({})
      attachStub.callsArgWith(2, {offsetX: 1, offsetY: 1})
      Cropper.prototype.startDrag.call(_this)
      object(_this._events.mousedown).is({})
      assert(_this.tinycrop.startDrag.callCount, 1)
      object(_this.tinycrop.startDrag.firstCall.args[0]).is({x: 1, y: 1})
      object(attachStub.firstCall.args[0]).is(_this.element)
    })

  })

  describe('update', () => {

    let _this

    beforeEach(() => {
      _this = {
        element: document.createElement('div'),
        rect: sinon.stub()
      }
    })

    it('should set dimensions properly - with TRBL', () => {
      Cropper.prototype.update.call(_this, {height: 100, width: 100})
      assert.equal(_this.element.style.width, '100px')
      assert.equal(_this.element.style.height, '100px')
    })

    it('should set dimensions properly - without TRBL', () => {
      Cropper.prototype.update.call(_this, {height: 100, width: 100, top: 10, right: 10, bottom: 10, left: 10})
      assert.equal(_this.element.style.width, '100px')
      assert.equal(_this.element.style.height, '100px')
      assert.equal(_this.element.style.top, '10px')
      assert.equal(_this.element.style.right, '10px')
      assert.equal(_this.element.style.bottom, '10px')
      assert.equal(_this.element.style.left, '10px')
    })

  })

})
