'use strict';

import {assert, sinon} from 'unit.js';
import * as _ from 'lodash';
import * as Util from '../../src/util';

describe('util', () => {

  describe('#forEach', () => {

    it('should iterate arrays properly', () => {
      var stub = sinon.stub();
      Util.forEach([1, 2, 3], stub);
      assert.equal(stub.callCount, 3);
    });

    it('should iterate objects properly', () => {
      var stub = sinon.stub();
      Util.forEach({1: '1', 2: '2', 3: '3'}, stub);
      assert.equal(stub.callCount, 3);
    });

    it('should break out early', () => {
      var stub = sinon.stub().returns(false);
      Util.forEach([1, 2, 3], stub);
      assert.equal(stub.callCount, 1);
    });

  });

  describe('#validateNumber', () => {

    it('should return null if below min value', () => {
      assert.equal(Util.validateNumber(-10, {min: 0}), null, 'ret was not null!');
    });

    it('should return null if above max value', () => {
      assert.equal(Util.validateNumber(20, {max: 10}), null, 'ret was not null!');
    });

    it('should return the number if it appears ok', () => {
      assert.equal(Util.validateNumber(5, {min: 0, max: 10}), 5, 'ret was not 5!');
    });

    it('should return null for non-numbers', () => {
      assert.equal(Util.validateNumber(null), null);
      assert.equal(Util.validateNumber(undefined), null);
      assert.equal(Util.validateNumber([]), null);
      assert.equal(Util.validateNumber(''), null);
    });

  });

  // make sure complex objects are kept by reference
  var noop = () => {};
  var num = new Number(5);
  var str = new String('');

  var types = [
    undefined,
    null,
    noop,
    NaN,
    num,
    5,
    str,
    ''
  ];

  var typeChecks = {
    'isUndefined': [undefined],
    'isNull': [null],
    'isFunction': [noop],
    'isNumber': [num, 5, NaN],
    'isString': [str, '']
  };

  _.forEach(typeChecks, (values, key) => {
    describe('#' + key, () => {

      var validTypes = values;
      var invalidTypes = _.without(types, ...values);
      if (key === 'isNumber') { _.remove(invalidTypes, _.isNaN); } // NaN !== NaN

      it('should return true if the value is ok', () => {
        _.forEach(validTypes, (type) => {
          assert.equal(Util[key](type), true, 'invalid response for ' + JSON.stringify(type));
        });
      });

      it('should return false for all other types', () => {
        _.forEach(invalidTypes, (type) => {
          assert.equal(Util[key](type), false, 'invalid response for ' + JSON.stringify(type));
        });
      });
    });
  });

});
