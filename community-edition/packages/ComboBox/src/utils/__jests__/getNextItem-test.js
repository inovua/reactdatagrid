/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getNextItem from '../getNextItem';

describe('getNextItem', () => {
  it('returns next item when direction is 1', () => {
    const test = getNextItem({
      data: [{ id: 1 }, { id: 2 }],
      id: 1,
      getIdProperty: item => item.id,
    });
    expect(test).toEqual(2);
  });
  it('if it has length 1 it returns the same id', () => {
    const test = getNextItem({
      data: [{ id: 1 }],
      id: 1,
      getIdProperty: item => item.id,
    });
    expect(test).toEqual(1);
  });
  it('returns previous item whe direction is -1', () => {
    const test = getNextItem({
      data: [{ id: 1 }, { id: 2 }, { id: 3 }],
      id: 2,
      getIdProperty: item => item.id,
      direction: -1,
    });
    expect(test).toEqual(1);
  });
  it('navigates to next item if the curret item is disabled', () => {
    const test = getNextItem({
      data: [{ id: 1 }, { id: 2, disabled: true }, { id: 3 }],
      id: 1,
      getIdProperty: item => item.id,
      direction: 1,
    });
    expect(test).toEqual(3);
  });
});
