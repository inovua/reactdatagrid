/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getNewMultipleValue from '../getNewMultipleValue';

describe('getNewMultipleValue', () => {
  it('returns correct new value', () => {
    expect(getNewMultipleValue({ id: 1, value: null })).toEqual([1]);
    expect(getNewMultipleValue({ id: 1, value: [1] })).toEqual(null);
    expect(getNewMultipleValue({ id: 3, value: [1, 2] })).toEqual([1, 2, 3]);
  });
});
