'use strict'

const object = require('unit.js').object
const array = require('unit.js').array
const assert = require('unit.js').assert
const sinon = require('sinon')

describe('Crop Element', () => {

  describe('constructor', () => {

    let cropElement

    beforeEach(() => {
      cropElement = new CropElement({})
    })

    it('should set up events properly', () => {
      object(cropElement._events).is({})
    })

  })

  describe('#initialize', () => {

    let el
    let _this
    let attachStub
    let preventDefaultStub
    beforeEach(() => {
      el = document.createElement('div')
      _this = {
        _events: {}
      }
      preventDefaultStub = sinon.stub()
      attachStub = sinon.stub(global, 'attach')
      attachStub.returns({})
      attachStub.callsArgWith(2, {preventDefault: preventDefaultStub})
    })

    afterEach(() => {
      attachStub.restore()
    })

    it('should initialize properly', () => {
      CropElement.prototype.initialize.call(_this, el)
      object(_this.element).is(el)
      assert.equal(_this.element.getAttribute('unselectable'), 'on', 'unselectable wasnt set')
      object(_this._events.dragStart).is({})
      assert(preventDefaultStub.calledOnce, 'prevent default wasnt called')
    })

  })

  describe('#rect', () => {

    let _this

    beforeEach(() => {
      _this = {
        element: document.createElement('div')
      }
    })

    it('should return bounds properly', () => {
      const rect = CropElement.prototype.rect.call(_this)
      // jsDom doesn't implement layout engine so we can't really do assertions here
      // the return of getBoundingClientRect is an object with all 0s
      array(Object.keys(rect)).is(['top', 'right', 'bottom', 'left', 'height', 'width', 'x', 'y'])
    })

  })

  describe('#drag', () => {

    let _this
    let attachStub

    beforeEach(() => {
      _this = {
        _events: {},
        tinycrop: sinon.createStubInstance(TinyCrop),
        element: document.createElement('div')
      }
      attachStub = sinon.stub(global, 'attach')
    })

    afterEach(() => {
      attachStub.restore()
    })

    it('should set up the events properly', () => {
      attachStub.onCall(0).returns('mousemove').callsArgWith(2, {type: 'mousemove'})
      attachStub.onCall(1).returns('mouseup').callsArgWith(2, {type: 'mouseup'})
      CropElement.prototype.drag.call(_this, {})
      assert(_this.tinycrop.drag.calledOnce, 'drag stub was not called once')
      object(_this.tinycrop.drag.firstCall.args[1]).is({type: 'mousemove'})
      assert(_this.tinycrop.finish.calledOnce, 'finish stub was not called once')
      object(_this.tinycrop.finish.firstCall.args[0]).is({type: 'mouseup'})
      object(_this._events).is({mousemove: 'mousemove', mouseup: 'mouseup'})
    })

  })

  describe('#size', () => {

    let _this
    let attachStub

    beforeEach(() => {
      _this = {
        _events: {},
        tinycrop: sinon.createStubInstance(TinyCrop),
        element: document.createElement('div')
      }
      attachStub = sinon.stub(global, 'attach')
    })

    afterEach(() => {
      attachStub.restore()
    })

    it('should set up the events properly', () => {
      attachStub.onCall(0).returns('mousemove').callsArgWith(2, {type: 'mousemove'})
      attachStub.onCall(1).returns('mouseup').callsArgWith(2, {type: 'mouseup'})
      CropElement.prototype.size.call(_this, {})
      assert(_this.tinycrop.size.calledOnce, 'size stub was not called once')
      object(_this.tinycrop.size.firstCall.args[1]).is({type: 'mousemove'})
      assert(_this.tinycrop.finish.calledOnce, 'finish stub was not called once')
      object(_this.tinycrop.finish.firstCall.args[0]).is({type: 'mouseup'})
      object(_this._events).is({mousemove: 'mousemove', mouseup: 'mouseup'})
    })

  })

  describe('#finish', () => {

    let _this

    beforeEach(() => {
      _this = {
        _events: {}
      }
    })

    it('should do nothing if no events are present', () => {
      CropElement.prototype.finish.call(_this)
      object(_this._events).is({})
    })

    it('should call each of the events if present', () => {
      const mousedownStub = sinon.stub()
      const mouseupStub = sinon.stub()
      const mousemoveStub = sinon.stub()
      _this._events = {
        mousedown: mousedownStub,
        mouseup: mouseupStub,
        mousemove: mousemoveStub
      }
      CropElement.prototype.finish.call(_this)
      assert(mousedownStub.calledOnce, 'mousedown wasnt called once')
      assert(mouseupStub.calledOnce, 'mouseup wasnt called once')
      assert(mousemoveStub.calledOnce, 'mousemove wasnt called once')
      object(_this._events).is({
        mousedown: null,
        mouseup: null,
        mousemove: null
      })
    })

  })

  describe('#destroy', () => {
    let _this
    let removeChildStub

    let mousedownStub
    let mouseupStub
    let mousemoveStub

    beforeEach(() => {
      _this = {
        _events: {},
        element: document.createElement('div')
      }
      document.body.appendChild(_this.element)
      _this.element.setAttribute('unselectable', 'on')
      removeChildStub = sinon.stub(_this.element.parentNode, 'removeChild')

      mousedownStub = sinon.stub()
      mouseupStub = sinon.stub()
      mousemoveStub = sinon.stub()
      _this._events = {
        mousedown: mousedownStub,
        mouseup: mouseupStub,
        mousemove: mousemoveStub,
        somethingElse: null
      }
    })

    afterEach(() => {
      _this.element.parentNode.removeChild(_this.element)
      removeChildStub.restore()
    })

    it('should remove the element when no parameter provided', () => {
      CropElement.prototype.destroy.call(_this)
      assert(mousedownStub.called, 'mousedown disposable wasnt called')
      assert(mouseupStub.called, 'mouseup disposable wasnt called')
      assert(mousemoveStub.called, 'mousemove disposable wasnt called')
      assert.equal(_this.element.getAttribute('unselectable'), null)
      assert(removeChildStub.calledOnce, 'element was not removed from dom')
    })

    it('should not remove the element when false provided', () => {
      CropElement.prototype.destroy.call(_this, false)
      assert(mousedownStub.called, 'mousedown disposable wasnt called')
      assert(mouseupStub.called, 'mouseup disposable wasnt called')
      assert(mousemoveStub.called, 'mousemove disposable wasnt called')
      assert.equal(_this.element.getAttribute('unselectable'), null)
      assert.equal(removeChildStub.callCount, 0, 'element was removed from dom')
    })
  })


})
