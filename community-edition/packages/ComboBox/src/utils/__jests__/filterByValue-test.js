/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import filterByValue from '../filterByValue';

describe('filterByValue', () => {
  it('filters out selected items', () => {
    const data = [
      { id: 1, label: 'test1' },
      { id: 2, label: 'test2' },
      { id: 3, label: 'test3' },
    ];
    const expected = [{ id: 2, label: 'test2' }];
    const value = [1, 3];
    const getIdProperty = item => item.id;

    expect(filterByValue({ data, getIdProperty, value })).toEqual(expected);
  });
});
