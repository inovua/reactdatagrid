/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getGroups from '../getGroups';

describe('getGroups', () => {
  it('returns the correct groups description', () => {
    const expected = {
      0: {
        title: 'group 1',
        indexAjustment: 1,
      },
      3: {
        title: 'group 2',
        indexAjustment: 2,
      },
      6: {
        title: 'group 3',
        indexAjustment: 3,
      },
      10: {
        title: 'group 4',
        indexAjustment: 4,
      },
      12: {
        title: 'group 1',
        indexAjustment: 5,
      },
    };
    const data = [
      { group: 'group 1' },
      { group: 'group 1' },
      { group: 'group 2' },
      { group: 'group 2' },
      { group: 'group 3' },
      { group: 'group 3' },
      { group: 'group 3' },
      { group: 'group 4' },
      { group: 'group 1' },
      { group: 'group 1' },
    ];

    const test = getGroups(data);
    expect(test).toEqual(expected);
  });
});
