
import * as _ from 'lodash';
import {assert} from 'unit.js';
import TinyCrop from '../../src/tiny-crop';

describe('TinyCropy', () => {

  it('shold create properly', () => {
    var tc = new TinyCrop();
    assert(!_.isUndefined(tc), 'tc was undefined');
  });

});
