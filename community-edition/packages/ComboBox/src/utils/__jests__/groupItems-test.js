/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import groupItems from '../groupItems';

describe('groupItems', () => {
  it('separates items into two groups', () => {
    const items = [1, 2, 3, 4, 5];
    const maxTagsLength = 3;
    expect(groupItems({ items, maxTagsLength })).toEqual({
      visibleItems: [1, 2, 3],
      remainingItems: [4, 5],
    });
  });
  it('separates in one grop when maxTagsLength === 0', () => {
    const items = [1, 2, 3, 4, 5];
    const maxTagsLength = 0;
    expect(groupItems({ items, maxTagsLength })).toEqual({
      visibleItems: [],
      remainingItems: [1, 2, 3, 4, 5],
    });
  });
});
