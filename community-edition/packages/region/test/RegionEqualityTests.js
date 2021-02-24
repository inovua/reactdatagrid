/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Region equal', function() {
  var Region = require('../lib');

  it('size should return fine', function() {
    var r = Region({
      top: 10,
      left: 10,
      width: 10,
      height: 10,
    });

    r.equalsSize({
      width: 10,
      height: 10,
    }).should.equal(true);
  });
});
