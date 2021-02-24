/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import normalizeColumns from '../normalizeColumns';
import uuid from 'uuid';

describe('normalizeColumns', () => {
  describe('ids', () => {
    it('should use name as id', () => {
      const v4 = uuid.v4;
      uuid.v4 = () => 'generated_id';

      const { allColumns } = normalizeColumns({
        columns: [{ name: 'name' }, { id: 'xx' }, {}],
      });

      uuid.v4 = v4;
      expect(allColumns[0].id).to.equal('name');
      expect(allColumns[1].id).to.equal('xx');
      expect(allColumns[2].id).to.equal('generated_id');
    });
  });

  describe('width', () => {
    it('should set col.width to be  >= col.minWidth & <= col.maxWidth', () => {
      const { allColumns } = normalizeColumns({
        columns: [
          { minWidth: 100, width: 60 },
          { maxWidth: 10, width: 60 },
        ],
      });

      expect(allColumns[0].width).to.equal(100);
      expect(allColumns[1].width).to.equal(10);
    });
  });

  describe('header', () => {
    it('should set col.header', () => {
      const { allColumns } = normalizeColumns({
        columns: [{ name: 'colName' }],
      });

      expect(allColumns[0].header).to.equal('Col name');
    });
  });

  describe('offset', () => {
    it('should be set on visible columns', () => {
      const { visibleColumns } = normalizeColumns({
        columns: [{ width: 200 }, { width: 300 }, { width: 400 }],
      });

      expect(visibleColumns.map(c => c.offset)).to.eql([0, 200, 500]);
    });
  });

  it('should return columnWidthPrefixSums & columnsSize', () => {
    const {
      visibleColumns,
      columnWidthPrefixSums,
      totalComputedWidth,
    } = normalizeColumns({
      columns: [
        { width: 250 },
        { width: 450 },
        { flex: 1 },
        {
          flex: 2,
        },
      ],
      availableSize: 1000,
    });

    expect(visibleColumns.map(c => c.computedWidth)).to.eql([
      250,
      450,
      100,
      200,
    ]);
    expect(visibleColumns.map(c => c.offset)).to.eql([0, 250, 700, 800]);
    expect(columnWidthPrefixSums).to.eql([0, 250, 700, 800]);
    expect(totalComputedWidth).to.eql(1000);
  });

  it('should compute minColumnsSize & columnsSize correctly', () => {
    const { minColumnsSize, totalComputedWidth } = normalizeColumns({
      columns: [
        { flex: 1, minWidth: 200 },
        { flex: 2, minWidth: 200, visible: false },
        { minWidth: 300 },
        { width: 400 },
      ],
      availableSize: 1000,
    });

    expect(minColumnsSize).to.equal(900);
    expect(totalComputedWidth).to.equal(1000);
  });

  it('should return [] for lockedStartColumns if there are no locked columns', () => {
    const { lockedStartColumns } = normalizeColumns({
      columns: [{ name: 'x' }],
    });

    expect(lockedStartColumns).to.eql([]);
  });

  describe('computedWidth', () => {
    it('should be correct when 3 x flex 1 for 300px space', () => {
      const { allColumns } = normalizeColumns({
        columns: [
          { name: 'first', flex: 1 },
          { name: 'second', flex: 1 },
          { name: 'third', flex: 1 },
        ],
        availableSize: 300,
      });

      const computedWidths = allColumns.map(c => c.computedWidth);

      expect(computedWidths).to.eql([100, 100, 100]);
    });

    it('should be correct when 3 x flex 1 for 300px space minWidth: 250', () => {
      const { allColumns } = normalizeColumns({
        columns: [
          { name: 'first', flex: 1 },
          { name: 'second', flex: 1, minWidth: 250 },
          { name: 'third', flex: 1 },
        ],
        availableSize: 300,
      });

      const computedWidths = allColumns.map(c => c.computedWidth);

      expect(computedWidths).to.eql([25, 250, 25]);
    });

    it('should be correct for flexes [1,2,3] for 300px space minWidth: 250', () => {
      const { allColumns } = normalizeColumns({
        columns: [
          { name: 'first', flex: 1, minWidth: 250 },
          { name: 'second', flex: 2 },
          { name: 'third', flex: 3 },
        ],
        availableSize: 300,
      });

      const computedWidths = allColumns.map(c => c.computedWidth);

      expect(computedWidths).to.eql([250, 20, 30]);
    });

    it('should be correct when 3 x flex 1 for 300px space maxWidth: 50', () => {
      const { allColumns } = normalizeColumns({
        columns: [
          { name: 'first', flex: 1 },
          { name: 'second', flex: 1, maxWidth: 50 },
          { name: 'third', flex: 1 },
        ],
        availableSize: 300,
      });

      const computedWidths = allColumns.map(c => c.computedWidth);

      expect(computedWidths).to.eql([125, 50, 125]);
    });

    it('should be correct when 3 x flex 1 for 300px space maxWidth: 50 and we have other columns as well, one with defaultWidth', () => {
      const { allColumns } = normalizeColumns({
        columns: [
          { name: 'first', flex: 1 },
          { name: 'second', flex: 1, maxWidth: 50 },
          { name: 'third', flex: 1 },
          { name: 'sized', width: 200 },
          { name: 'defaultSized', defaultWidth: 100 },
        ],
        availableSize: 600,
      });

      const computedWidths = allColumns.map(c => c.computedWidth);

      expect(computedWidths).to.eql([125, 50, 125, 200, 100]);
    });

    it('should be correct when 3 x flex 1 for 300px space maxWidth: 50 and there is a invisible col', () => {
      const { visibleColumns } = normalizeColumns({
        columns: [
          { name: 'invisible', flex: 2, visible: false },
          { name: 'first', flex: 1 },
          { name: 'second', flex: 1, maxWidth: 50 },
          { name: 'third', flex: 1 },
        ],
        availableSize: 300,
      });

      const computedWidths = visibleColumns.map(c => c.computedWidth);

      expect(computedWidths).to.eql([125, 50, 125]);
    });

    it('should return totalLockedStartWidth, totalLockedEndWidth, totalUnlockedWidth correctly', () => {
      const {
        totalLockedStartWidth,
        totalLockedEndWidth,
        totalUnlockedWidth,
      } = normalizeColumns({
        columns: [
          { name: 'a', width: 100, locked: true },
          { name: 'first', width: 200, locked: 'start' },
          { name: 'second', flex: 1, locked: 'end' },
          { name: 'third', flex: 3 },
        ],
        availableSize: 400,
      });

      expect(totalLockedStartWidth).to.equal(300);
      expect(totalLockedEndWidth).to.equal(25);
      expect(totalUnlockedWidth).to.equal(75);
    });
  });
});
