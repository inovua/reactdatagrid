/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import isSelected from '../isSelected';

describe('isSelected', () => {
  it('checks if the item is selected', () => {
    expect(isSelected({ id: 1, value: 1 })).toBe(true);
    expect(isSelected({ id: 1, value: 0 })).toBe(false);

    expect(isSelected({ id: 1, value: [1] })).toBe(true);
    expect(isSelected({ id: 1, value: [1, 2, 3] })).toBe(true);
    expect(isSelected({ id: 1, value: [0, 2, 3] })).toBe(false);
  });
});
