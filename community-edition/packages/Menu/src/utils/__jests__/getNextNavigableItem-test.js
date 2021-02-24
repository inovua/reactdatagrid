/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getNextNavigableItem from '../getNextNavigableItem';

describe('getNextNavigableItem', () => {
  it('should get first non disabled item in 1 direction, from top to bottom', () => {
    const items = [
      { disabled: true },
      { disabled: true },
      { disabled: true },
      { disabled: false }, // 3
      { disabled: true },
      '-',
      { disabled: false }, // 6
      { disabled: false },
      { disabled: true },
    ];
    expect(getNextNavigableItem(items, 3, 1)).toEqual(6);
  });
  it('should get first non disabled item in -1 direction, from bottom to top', () => {
    const items = [
      { disabled: true },
      { disabled: true },
      { disabled: true },
      { disabled: false }, // 3
      '-',
      { disabled: true },
      { disabled: false }, // 6
      { disabled: false },
      { disabled: true },
    ];
    expect(getNextNavigableItem(items, 6, -1)).toEqual(3);
  });
});
