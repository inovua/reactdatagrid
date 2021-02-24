/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getGroupedItems from '../getGroupedItems';

describe('getGroupedItems', () => {
  it('returns the full list when all items fit', () => {
    const boxes = [30, 20, 20, 30];
    const maxSize = 100;
    const test = getGroupedItems({ boxes, maxSize });
    expect(test).toBe(false);
  });
  it('separates corecty the indexes in visible and overflowItems', () => {
    const boxes = [20, 30, 30, 30];
    const maxSize = 100;
    const test = getGroupedItems({ boxes, maxSize });

    expect(test.visibleIndexes).toEqual([0, 1, 2]);
    expect(test.overflowIndexes).toEqual([3]);
  });
  it('overflow control can make one item more to overflow', () => {
    const boxes = [30, 30, 30, 30];
    const maxSize = 100;
    const overflowControlSize = 20;
    const test = getGroupedItems({ boxes, maxSize, overflowControlSize });

    expect(test.visibleIndexes).toEqual([0, 1]);
    expect(test.overflowIndexes).toEqual([2, 3]);
  });
});
