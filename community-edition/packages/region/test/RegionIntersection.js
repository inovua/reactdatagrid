/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Region intersection', function() {
  var Region = require('../lib');

  it('should containPoint', function() {
    var inner = Region({
      left: 97,
      right: 147,
      top: 51,
      bottom: 251,
    });

    var outer = Region({
      left: 11,
      right: 447,
      top: 51,
      bottom: 937,
    });

    outer
      .getIntersection(inner)
      .getArea()
      .should.equal(inner.getArea());
  });
});
