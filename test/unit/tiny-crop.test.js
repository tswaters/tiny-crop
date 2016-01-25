'use strict'

const assert = require('unit.js').assert
const object = require('unit.js').object
const array = require('unit.js').array
const _ = require('lodash')
const sinon = require('sinon')

describe('TinyCrop', () => {

  describe('constructor', () => {

    let getElementByIdStub
    let appendHeadStub
    let validateNumberStub
    let initializeStub
    let getImageStub
    let cropperStub
    let handleStub
    let imageStub

    beforeEach(() => {
      getElementByIdStub = sinon.stub(document, 'getElementById')
      appendHeadStub = sinon.stub(document.head, 'appendChild')
      validateNumberStub = sinon.stub(global, 'validateNumber', (num) => num)
      initializeStub = sinon.stub(TinyCrop.prototype, 'initialize')
      getImageStub = sinon.stub(global, 'getImage')
      cropperStub = sinon.stub(global, 'Cropper')
      handleStub = sinon.stub(global, 'Handle')
      imageStub = sinon.stub(global, 'CropImage')
    })

    afterEach(() => {
      getElementByIdStub.restore()
      appendHeadStub.restore()
      validateNumberStub.restore()
      initializeStub.restore()
      getImageStub.restore()
      cropperStub.restore()
      handleStub.restore()
      imageStub.restore()
    })

    it('should initialize properly with no parameters', () => {
      const tc = new TinyCrop()
      object(tc._cropDimensions).is({})
      assert.equal(tc.minWidth, 0)
      assert.equal(tc.maxWidth, Infinity)
      assert.equal(tc.minHeight, 0)
      assert.equal(tc.maxHeight, Infinity)
      object(tc._events).is({done: []})
      assert.equal(appendHeadStub.callCount, 1, 'style was not appended')
      assert.equal(cropperStub.callCount, 1, 'cropper was not called once')
      assert.equal(handleStub.callCount, 8, 'cropper was not called')
      assert.equal(imageStub.callCount, 1, 'image stub wasnt called once')
    })

    it('should set all options properly', () => {
      const img = document.createElement('img')
      const tc = new TinyCrop({
        minHeight: 10,
        maxHeight: 20,
        minWidth: 30,
        maxWidth: 40,
        image: img
      })
      object(tc._cropDimensions).is({})
      assert.equal(tc.minHeight, 10)
      assert.equal(tc.maxHeight, 20)
      assert.equal(tc.minWidth, 30)
      assert.equal(tc.maxWidth, 40)
      assert.equal(appendHeadStub.callCount, 1, 'style was not appended')
      assert.equal(cropperStub.callCount, 1, 'cropper was not called once')
      assert.equal(handleStub.callCount, 8, 'cropper was not called')
      assert.equal(imageStub.callCount, 1, 'image stub wasnt called once')
      object(getImageStub.firstCall.args[0]).is(img)
    })

    it('should only append css once', () => {
      getElementByIdStub.withArgs('tiny-crop-css').returns({})
      new TinyCrop()
      assert.equal(appendHeadStub.callCount, 0, 'style was appended')
    })

  })

  describe('#initialize', () => {
    let _this

    beforeEach(() => {
      _this = {
        _image: sinon.createStubInstance(CropImage),
        _cropper: sinon.createStubInstance(Cropper),
        _handles: [
          sinon.createStubInstance(Handle)
        ]
      }
    })

    it('should call initialize, retrieve bounds and call startSize', () => {
      const img = document.createElement('img')
      _this._image.bounds.returns({})
      TinyCrop.prototype.initialize.call(_this, img)
      assert.equal(_this._image.initialize.callCount, 1, 'image#initialize not called')
      assert.equal(_this._cropper.initialize.callCount, 1, 'cropper#initialize not called')
      assert.equal(_this._handles[0].initialize.callCount, 1, 'handle[0]#initialize not called')
      object(_this._bounds).is({})
      assert.equal(_this._image.startSize.callCount, 1, 'startSize was not called')
    })

  })

  describe('#start', () => {

    let attachStub
    let _this

    beforeEach(() => {
      attachStub = sinon.stub(global, 'attach')
      _this = {
        _cropper: sinon.createStubInstance(Cropper),
        finish: sinon.stub()
      }
    })

    afterEach(() => {
      attachStub.restore()
    })

    it('should call cropper.start and attach document mouseup handler', () => {
      attachStub.returns({})
      attachStub.callsArgWith(2, {clientX: 1, clientY: 1})
      TinyCrop.prototype.start.call(_this)
      object(attachStub.firstCall.args[0]).is(document)
      assert.equal(attachStub.firstCall.args[1], 'mouseup')
      assert(_this._cropper.start.called, 'start was not called')
      assert(_this.finish.called, 'finish was not called')
      object(_this._docMouseUp).is({})
    })

  })

  describe('#restart', () => {
    let _this

    beforeEach(() => {
      _this = {
        _cropDimensions: {},
        startSize: sinon.stub()
      }
    })

    it('should reset cropDimensions and call startSize with anchor', () => {
      TinyCrop.prototype.restart.call(_this, 'anchor')
      object(_this._cropDimensions).is({
        height: 0,
        width: 0,
        bottom: null,
        right: null,
        left: null,
        top: null
      })
      assert(_this.startSize.called, 'startSize wasnt called')
      assert.equal(_this.startSize.firstCall.args[0], 'anchor', 'first argument wasnt right')
    })

  })

  describe('#finish', () => {

    let _this

    beforeEach(() => {
      _this = {
        _events: {
          done: [sinon.stub()]
        },
        _cropper: _.merge(sinon.createStubInstance(Cropper), {element: document.createElement('div')}),
        _image: sinon.createStubInstance(CropImage),
        _handles: [sinon.createStubInstance(Handle)]
      }
    })

    it('should remove docMouseUp if attached - and do the rest', () => {
      const docMouseUpStub = sinon.stub()
      _this._docMouseUp = docMouseUpStub
      TinyCrop.prototype.finish.call(_this)
      assert(docMouseUpStub.called, 'mouseup disposable wasnt called')
      assert.equal(_this._docMouseUp, null, '_docMouseUp is not null')
      assert(_this._cropper.element.classList.contains('finished'), 'cropper class list doesnt contain finished')
      assert(_this._handles[0].startSize.called, 'handle start size wasnt called')
      assert(_this._handles[0].finish.called, 'handle finish wasnt called')
      assert(_this._cropper.finish.called, 'cropper finish wasnt called')
      assert(_this._cropper.startDrag.called, 'cropper startDrag wasnt called')
      assert(_this._image.finish.called, 'image finish wasnt called')
      assert(_this._image.startSize.called, 'image startSize wasnt called')
      assert(_this._events.done[0].called, 'done event wasnt called')
    })

    it('should be ok if docMouseUp isnt there - and do the rest', () => {
      TinyCrop.prototype.finish.call(_this)
      assert.equal(_this._docMouseUp, null, '_docMouseUp is not null')
      assert(_this._cropper.element.classList.contains('finished'), 'cropper class list doesnt contain finished')
      assert(_this._handles[0].startSize.called, 'handle start size wasnt called')
      assert(_this._handles[0].finish.called, 'handle finish wasnt called')
      assert(_this._cropper.finish.called, 'cropper finish wasnt called')
      assert(_this._cropper.startDrag.called, 'cropper startDrag wasnt called')
      assert(_this._image.finish.called, 'image finish wasnt called')
      assert(_this._image.startSize.called, 'image startSize wasnt called')
      assert(_this._events.done[0].called, 'done event wasnt called')
    })

  })

  describe('#startSize', () => {
    let _this

    beforeEach(() => {
      _this = {
        start: sinon.stub(),
        _image: sinon.createStubInstance(CropImage),
        _cropper: sinon.createStubInstance(Cropper),
        _handles: [sinon.createStubInstance(Handle)]
      }
    })

    it('should call start and size on all the things', () => {
      TinyCrop.prototype.startSize.call(_this, 'anchor')
      assert(_this.start.called, 'start was not called')
      assert(_this._image.size.called, 'image size not called')
      assert(_this._cropper.size.called, 'cropper size not called')
      assert(_this._handles[0].size.called, 'handle size not called')
      assert.equal(_this._image.size.firstCall.args[0], 'anchor', 'image size not called')
      assert.equal(_this._cropper.size.firstCall.args[0], 'anchor', 'cropper size not called')
      assert.equal(_this._handles[0].size.firstCall.args[0], 'anchor', 'handle size not called')
    })

  })

  describe('#startDrag', () => {
    let _this

    beforeEach(() => {
      _this = {
        start: sinon.stub(),
        _image: sinon.createStubInstance(CropImage),
        _cropper: sinon.createStubInstance(Cropper),
        _handles: [sinon.createStubInstance(Handle)]
      }
    })

    it('should call start and size on all the things', () => {
      TinyCrop.prototype.startDrag.call(_this, 'anchor')
      assert(_this.start.called, 'start was not called')
      assert(_this._image.drag.called, 'image size not called')
      assert(_this._cropper.drag.called, 'cropper size not called')
      assert(_this._handles[0].drag.called, 'handle size not called')
      assert.equal(_this._image.drag.firstCall.args[0], 'anchor', 'image size not called')
      assert.equal(_this._cropper.drag.firstCall.args[0], 'anchor', 'cropper size not called')
      assert.equal(_this._handles[0].drag.firstCall.args[0], 'anchor', 'handle size not called')
    })

  })

  describe('#size', () => {
    let _this

    beforeEach(() => {
      _this = {
        minHeight: 0,
        maxHeight: Infinity,
        minWidth: 0,
        maxWidth: Infinity,
        _bounds: {
          min: {x: 100, y: 100},
          max: {x: 500, y: 500}
        },
        _cropDimensions: {
          top: null,
          bottom: null,
          height: null,
          left: null,
          right: null,
          width: null
        },
        _cropper: sinon.createStubInstance(Cropper)
      }
    })

    it('should update crop dimensions properly - y anchor, non-inverse, less than minHeight', () => {
      _this.minHeight = 200
      TinyCrop.prototype.size.call(_this, {y: 0}, {clientY: 150})
      object(_.omitBy(_this._cropper.update.firstCall.args[0], _.isNull)).is({height: 200, top: 0})
    })

    it('should update crop dimensions properly - y anchor, non-inverse, greater than maxHeight', () => {
      _this.maxHeight = 200
      TinyCrop.prototype.size.call(_this, {y: 0}, {clientY: 250})
      object(_.omitBy(_this._cropper.update.firstCall.args[0], _.isNull)).is({height: 200, top: 0})
    })

    it('should update crop dimensions properly - y anchor, inverse, less than minHeight', () => {
      window.innerHeight = 1000
      _this.minHeight = 200
      TinyCrop.prototype.size.call(_this, {y: 500}, {clientY: 450})
      object(_.omitBy(_this._cropper.update.firstCall.args[0], _.isNull)).is({height: 200, bottom: 500})
    })

    it('should update crop dimensions properly - y anchor, inverse, greater than maxHeight', () => {
      window.innerHeight = 1000
      _this.maxHeight = 200
      TinyCrop.prototype.size.call(_this, {y: 500}, {clientY: 0})
      object(_.omitBy(_this._cropper.update.firstCall.args[0], _.isNull)).is({height: 200, bottom: 500})
    })

    it('should update crop dimensions properly - x anchor, non-inverse, less than minHeight', () => {
      _this.minWidth = 200
      TinyCrop.prototype.size.call(_this, {x: 0}, {clientX: 150})
      object(_.omitBy(_this._cropper.update.firstCall.args[0], _.isNull)).is({width: 200, left: 0})
    })

    it('should update crop dimensions properly - x anchor, non-inverse, greater than maxHeight', () => {
      _this.maxWidth = 200
      TinyCrop.prototype.size.call(_this, {x: 0}, {clientX: 250})
      object(_.omitBy(_this._cropper.update.firstCall.args[0], _.isNull)).is({width: 200, left: 0})
    })

    it('should update crop dimensions properly - x anchor, inverse, less than minHeight', () => {
      window.innerWidth = 1000
      _this.minWidth = 200
      TinyCrop.prototype.size.call(_this, {x: 500}, {clientX: 450})
      object(_.omitBy(_this._cropper.update.firstCall.args[0], _.isNull)).is({width: 200, right: 500})
    })

    it('should update crop dimensions properly - x anchor, inverse, greater than maxHeight', () => {
      window.innerWidth = 1000
      _this.maxWidth = 200
      TinyCrop.prototype.size.call(_this, {x: 500}, {clientX: 0})
      object(_.omitBy(_this._cropper.update.firstCall.args[0], _.isNull)).is({width: 200, right: 500})
    })

  })

  describe('#drag', () => {
    let _this

    beforeEach(() => {
      _this = {
        _bounds: {
          min: {x: 100, y: 100},
          max: {x: 500, y: 500}
        },
        _cropDimensions: {
          height: 100,
          width: 100
        },
        _cropper: sinon.createStubInstance(Cropper)
      }
    })

    it('should update the position of the cropper properly - dont go below min dimensions', () => {
      TinyCrop.prototype.drag.call(_this, {x: 50, y: 50}, {clientX: 50, clientY: 50})
      object(_this._cropper.update.firstCall.args[0]).is({
        height: 100,
        width: 100,
        top: 100,
        right: null,
        bottom: null,
        left: 100
      })
    })

    it('should update the position of the cropper properly - dont go above max dimensions', () => {
      TinyCrop.prototype.drag.call(_this, {x: 50, y: 50}, {clientX: 1000, clientY: 1000})
      object(_this._cropper.update.firstCall.args[0]).is({
        height: 100,
        width: 100,
        top: 400,
        right: null,
        bottom: null,
        left: 400
      })
    })
  })

  describe('#on', () => {

    let _this

    beforeEach(() => {
      _this = {_events: {done: []}}
    })

    it('should throw if eventName not a string', () => {
      assert.throws(() => { TinyCrop.prototype.on.call(_this) }, /invalid parameters provided to tinycrop/gi)
    })

    it('should throw for invalid eventName', () => {
      assert.throws(() => { TinyCrop.prototype.on.call(_this, 'invalid') }, /invalid parameters provided to tinycrop/gi)
    })

    it('#on should throw if fn is not a function', () => {
      assert.throws(() => { TinyCrop.prototype.on.call(_this, 'done') }, /invalid parameters provided to tinycrop/gi)
    })

    it('should register the event properly', () => {
      _this.off = sinon.stub()
      const stub = sinon.stub()
      const disposable = TinyCrop.prototype.on.call(_this, 'done', stub)
      array(_this._events.done).is([stub])
      disposable()
      assert.equal(_this.off.callCount, 1)
    })

  })

  describe('#off', () => {

    let _this

    beforeEach(() => {
      _this = {_events: {done: []}}
    })

    it('should throw if eventName not a string', () => {
      assert.throws(() => { TinyCrop.prototype.off.call(_this) }, /invalid parameters provided to tinycrop/gi)
    })

    it('should throw for invalid eventName', () => {
      assert.throws(() => { TinyCrop.prototype.off.call(_this, 'invalid') }, /invalid parameters provided to tinycrop/gi)
    })

    it('should remove all event handlers if fn not provided', () => {
      _this._events.done = [1, 3, 4]
      TinyCrop.prototype.off.call(_this, 'done')
      array(_this._events.done).is([])
    })

    it('should throw for non-function fn parameter', () => {
      assert.throws(() => { TinyCrop.prototype.off.call(_this, 'done', 'invalid') }, /invalid parameters provided to tinycrop/gi)
    })

    it('should throw if provided function isnt a known event handler', () => {
      assert.throws(() => { TinyCrop.prototype.off.call(_this, 'done', sinon.stub()) }, /invalid parameters provided to tinycrop/gi)
    })

    it('should remove events properly', () => {
      const stub1 = sinon.stub()
      const stub2 = sinon.stub()
      _this._events.done = [stub1, stub2]
      TinyCrop.prototype.off.call(_this, 'done', stub1)
      array(_this._events.done).is([stub2])
    })
  })

  describe('#destroy', () => {

    let _this

    beforeEach(() => {
      _this = {
        _events: {done: []},
        _image: sinon.createStubInstance(CropImage),
        _cropper: sinon.createStubInstance(Cropper),
        _handles: [sinon.createStubInstance(Handle)]
      }
    })


    it('should remove docMouseUp if present - and the rest', () => {
      const docMouseUpStub = sinon.stub()
      _this._docMouseUp = docMouseUpStub
      TinyCrop.prototype.destroy.call(_this)
      assert(docMouseUpStub.called, 'docMouseUp wasnt called')
      assert.equal(_this.docMouseUp, null, 'docMouseUp wasnt nulled')
      object(_this._events.done).is([])
      assert(_this._image.destroy.called, 'image destroy was not called')
      assert(_this._cropper.destroy.called, 'cropper destroy was not called')
      assert(_this._handles[0].destroy.called, 'handle destroy was not called')
    })

    it('should be fine if docMouseUp not present - and the rest', () => {
      TinyCrop.prototype.destroy.call(_this)
      object(_this._events.done).is([])
      assert(_this._image.destroy.called, 'image destroy was not called')
      assert(_this._cropper.destroy.called, 'cropper destroy was not called')
      assert(_this._handles[0].destroy.called, 'handle destroy was not called')
    })


  })


})
