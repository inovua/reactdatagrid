/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getColumnInfo from '../getColumnInfo';

describe('getColumnInfo', () => {
  it('should inject columns for groupBy', () => {
    const { visibleColumns } = getColumnInfo(
      { columns: [{ name: 'firstName', width: 200 }], groupNestingSize: 15 },
      { groupBy: ['firstName'] }
    );

    expect(
      visibleColumns.map(c => {
        return { name: c.name, width: c.computedWidth };
      })
    ).to.deep.equal([
      { name: '__col_generated-groupBy-0', width: 15 },
      { name: 'firstName', width: 200 },
    ]);
  });

  it('should only inject missing columns for groupBy', () => {
    const { visibleColumns, lockedStartColumns } = getColumnInfo(
      {
        columns: [
          { name: 'generated', width: 15, groupColumn: true, locked: true },
          { name: 'firstName', width: 200, locked: true },
          { name: 'lastName', width: 200 },
        ],
        groupNestingSize: 15,
      },
      { groupBy: ['firstName', 'x'] }
    );

    const visible = visibleColumns.map(c => {
      return { name: c.name, width: c.computedWidth, locked: c.computedLocked };
    });

    expect(visible).to.deep.equal([
      { name: '__col_generated-groupBy-1', width: 15, locked: 'start' },
      { name: 'generated', width: 15, locked: 'start' },
      { name: 'firstName', width: 200, locked: 'start' },
      { name: 'lastName', width: 200, locked: undefined },
    ]);

    expect(
      lockedStartColumns.map(c => {
        return {
          name: c.name,
          width: c.computedWidth,
          locked: c.computedLocked,
        };
      })
    ).to.deep.equal([
      { name: '__col_generated-groupBy-1', width: 15, locked: 'start' },
      { name: 'generated', width: 15, locked: 'start' },
      { name: 'firstName', width: 200, locked: 'start' },
    ]);
  });
});
