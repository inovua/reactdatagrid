/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import range from '../range';

describe('range', () => {
  it('constructs correct ranges', () => {
    expect(range(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(range(10, 110, 10)).toEqual([
      10,
      20,
      30,
      40,
      50,
      60,
      70,
      80,
      90,
      100,
    ]);
  });
});
