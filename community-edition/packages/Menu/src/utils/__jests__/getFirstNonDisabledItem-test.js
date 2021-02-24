/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getFirstNonDisabledItem from '../getFirstNonDisabledItem';

describe('getFirstNonDisabledItem', () => {
  it('should return the first non disabled index', () => {
    const items = [
      { disabled: true },
      { disabled: true },
      { disabled: true },
      {}, // 3
    ];

    expect(getFirstNonDisabledItem(items)).toEqual(3);
  });
  it('should return null if all elements are disabled', () => {
    const items = [{ disabled: true }, { disabled: true }, { disabled: true }];
    expect(getFirstNonDisabledItem(items)).toEqual(null);
  });
});
