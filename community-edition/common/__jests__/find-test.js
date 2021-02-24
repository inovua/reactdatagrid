/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import find from '../find';

describe('find', () => {
  it('returns null if the collection is null', () => {
    expect(find(null, () => {})).toEqual(null);
  });
  it('returns the first item that matches test', () => {
    const test = [{}, null, false, { a: 'test' }];
    expect(find(test, item => item && item.a === 'test')).toEqual({
      a: 'test',
    });
  });
});
