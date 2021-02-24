/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import normalize from './index';

describe('normalizeColumns', () => {
  it('should work ok for most simple case', () => {
    const columns = [
      {
        name: 'a',
        width: 200,
      },
      {
        name: 'b',
        width: 300,
      },
    ];
    const result = normalize({
      columns,
      columnMaxWidth: 500,
      columnMinWidth: 100,
    });
    expect(result.visibleColumns).toEqual([
      {
        id: 'a',
        name: 'a',
        width: 200,
        keepFlex: true,
        isColumn: true,
        computedWidth: 200,
        computedFlex: null,
        computedAbsoluteIndex: 0,
        computedVisibleIndex: 0,
        computedVisibleCount: 2,
        computedSortable: false,
        computedSortInfo: null,
        computedHeader: 'a',
        computedInitialIndex: 0,
        computedOffset: 0,
        computedLocked: false,
        computedLockable: false,
        computedResizable: false,
        computedVisible: true,
        computedMaxWidth: 500,
        computedMinWidth: 100,
      },
      {
        id: 'b',
        name: 'b',
        width: 300,
        keepFlex: true,
        isColumn: true,
        computedWidth: 300,
        computedFlex: null,
        computedOffset: 200,
        computedAbsoluteIndex: 1,
        computedInitialIndex: 1,
        computedVisibleIndex: 1,
        computedVisibleCount: 2,
        computedSortable: false,
        computedLockable: false,
        computedLocked: false,
        computedResizable: false,
        computedSortInfo: null,
        computedHeader: 'b',
        computedVisible: true,
        computedMaxWidth: 500,
        computedMinWidth: 100,
      },
    ]);
  });

  it('should work when there are columns locked start', () => {
    const columns = [
      {
        name: 'a',
        width: 200,
        defaultLocked: true,
      },
      {
        name: 'b',
        width: 300,
      },
      {
        name: 'c',
        defaultFlex: 1,
      },
      {
        name: 'd',
        defaultFlex: 2,
      },
    ];

    const result = normalize({
      columns,
      columnMaxWidth: 500,
      columnMinWidth: 100,
      availableSize: 1100,
    });
    expect(
      result.visibleColumns.map(c => {
        return {
          name: c.name,
          computedWidth: c.computedWidth,
          computedFlex: c.computedFlex,
        };
      })
    ).toEqual([
      {
        name: 'a',
        computedFlex: null,
        computedWidth: 200,
      },
      {
        name: 'b',
        computedFlex: null,
        computedWidth: 300,
      },
      { name: 'c', computedFlex: 1, computedWidth: 200 },
      {
        name: 'd',
        computedFlex: 2,
        computedWidth: 400,
      },
    ]);

    expect(
      result.lockedStartColumns.map(c => {
        return c.name;
      })
    ).toEqual(['a']);
    expect(
      result.unlockedColumns.map(c => {
        return c.name;
      })
    ).toEqual(['b', 'c', 'd']);

    expect(result.visibleColumns.map(c => c.computedWidth)).toEqual([
      200,
      300,
      200,
      400,
    ]);
    expect(result.columnWidthPrefixSums).toEqual([0, 200, 500, 700]);
  });
});
