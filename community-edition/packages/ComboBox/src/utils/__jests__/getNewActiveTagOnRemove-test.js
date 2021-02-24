/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getNewActiveTagOnRemove from '../getNewActiveTagOnRemove';

describe('getNewActiveTagOnRemove', () => {
  it('returns the correct activeTag after activeTag was removed', () => {
    expect(getNewActiveTagOnRemove({ id: 2, value: [1, 2, 3] })).toEqual(1);
    expect(getNewActiveTagOnRemove({ id: 3, value: [1, 2, 3] })).toEqual(2);
    expect(getNewActiveTagOnRemove({ id: 3, value: [3] })).toBe(null);
  });
});
