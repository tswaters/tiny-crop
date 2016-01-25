'use strict'

require('./base')

const assert = require('unit.js').assert
const object = require('unit.js').object
const sinon = require('sinon')

describe('util', () => {

  describe('#attach', () => {

    let element
    let addEventListenerSpy
    let removeEventListenerSpy

    beforeEach(() => {
      element = document.createElement('div')
      addEventListenerSpy = sinon.spy(element, 'addEventListener')
      removeEventListenerSpy = sinon.spy(element, 'removeEventListener')
    })

    it('should attach an event handler properly, call the function and allow removal', (done) => {
      const disposable = attach(element, 'click', (ev) => {
        try {
          assert(ev instanceof window.Event)
          disposable()
          assert.equal(addEventListenerSpy.callCount, 1)
          assert.equal(removeEventListenerSpy.callCount, 1)
        }
        catch (e) { return done(e) }
        done()
      })
      element.dispatchEvent(new Event('click'))
    })
  })

  describe('#getImage', () => {

    beforeEach(() => {
    })

    it('should return the image properly by id', () => {
      const image = document.createElement('img')
      image.id = 'test-image'
      document.body.appendChild(image)

      const img = getImage('test-image')
      object(img).is(image)
    })

    it('should return image normally', () => {
      const image = document.createElement('img')
      const img = getImage(image)
      object(img).is(image)
    })

    it('should return errors', () => {
      assert.throws(() => {getImage()}, /invalid parameters provided to tinycrop/)
    })

  })

  describe('#forEach', () => {

    it('should iterate arrays properly', () => {
      const stub = sinon.stub()
      forEach([1, 2, 3], stub)
      assert.equal(stub.callCount, 3)
    })

    it('should iterate objects properly', () => {
      const stub = sinon.stub()
      forEach({1: '1', 2: '2', 3: '3'}, stub)
      assert.equal(stub.callCount, 3)
    })

    it('should break out early', () => {
      const stub = sinon.stub().returns(false)
      forEach([1, 2, 3], stub)
      assert.equal(stub.callCount, 1)
    })
  })

  describe('#validateNumber', () => {

    it('should return null for invalid number', () => {
      assert.equal(validateNumber('invalid'), null, 'ret was not null!')
    })

    it('should return null if below min value', () => {
      assert.equal(validateNumber(-10, {min: 0}), null, 'ret was not null!')
    })

    it('should return null if above max value', () => {
      assert.equal(validateNumber(20, {max: 10}), null, 'ret was not null!')
    })

    it('should return the number if it appears ok', () => {
      assert.equal(validateNumber(5, {min: 0, max: 10}), 5, 'ret was not 5!')
    })

    it('should return null for non-numbers', () => {
      assert.equal(validateNumber(null), null)
      assert.equal(validateNumber(void 0), null)
      assert.equal(validateNumber([]), null)
      assert.equal(validateNumber(''), null)
    })
  })

})
