/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Region', function() {
  var Region = require('../lib');

  it('should have correct width', function() {
    var r = Region({
      top: 10,
      left: 20,
      right: 40,
      bottom: 20,
    });

    r.getWidth().should.equal(20);
  });

  it('should have correct height', function() {
    var r = new Region({
      top: 10,
      left: 20,
      width: 30,
      height: 40,
    });

    r.getBottom().should.equal(50);
  });

  it('should return correct intersection', function() {
    var r1 = Region({
      top: 10,
      left: 10,
      right: 40,
      bottom: 40,
    });

    var r2 = Region({
      top: 20,
      left: 15,
      right: 45,
      bottom: 35,
    });

    var intersection = r1.getIntersection(r2);

    intersection.get().should.eql({
      top: 20,
      left: 15,
      right: 40,
      bottom: 35,
    });
  });
});
