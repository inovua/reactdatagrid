/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import distribute from './distributeSpaceToColumns';

describe('positive distributeSpaceToColumns', () => {
  it('should distribute 100 to 2 cols when there are no restrictions', () => {
    const { widths, remaining, columnWidths } = distribute(100, [{}, {}]);
    expect(widths).toEqual([50, 50]);
    expect(columnWidths).toEqual([50, 50]);
    expect(remaining).toEqual(0);
  });

  it('should distribute 100 to 3 cols when there are no restrictions', () => {
    const { widths, remaining, columnWidths } = distribute(100, [{}, {}, {}]);
    expect(widths).toEqual([33, 33, 34]);
    expect(columnWidths).toEqual([33, 33, 34]);
    expect(remaining).toEqual(0);
  });

  it('should distribute 100 to 3 cols when first col can only accept 10', () => {
    const { widths, remaining, columnWidths } = distribute(100, [
      { computedWidth: 30, maxWidth: 40 },
      {},
      {},
    ]);
    expect(widths).toEqual([10, 56, 34]);
    expect(columnWidths).toEqual([40, 56, 34]);
    expect(remaining).toEqual(0);
  });

  it('should distribute 100 to 3 cols when first col can only accept 10, and lastColumn 20', () => {
    const { widths, remaining, columnWidths } = distribute(100, [
      { computedWidth: 30, maxWidth: 40 },
      {},
      { computedWidth: 100, maxWidth: 120 },
    ]);
    expect(widths).toEqual([10, 70, 20]);
    expect(columnWidths).toEqual([40, 70, 120]);
    expect(remaining).toEqual(0);
  });

  it('should distribute 100 to 3 cols when first col can only accept 10, second can accept 60, lastColumn 20', () => {
    const { widths, remaining, columnWidths } = distribute(100, [
      { computedWidth: 30, maxWidth: 40 },
      // +10
      { computedWidth: 40, maxWidth: 100 },
      // +56 in first round +4 in second round
      // +20
      { computedWidth: 100, maxWidth: 120 },
    ]);
    expect(widths).toEqual([10, 60, 20]);
    expect(columnWidths).toEqual([40, 100, 120]);
    expect(remaining).toEqual(10);
  });
});

describe('negative distributeSpaceToColumns', () => {
  it('should distribute -100 to 2 cols when there are no restrictions', () => {
    const { widths, remaining, columnWidths } = distribute(-100, [{}, {}]);
    expect(widths).toEqual([-50, -50]);
    expect(columnWidths).toEqual([-50, -50]);
    expect(remaining).toEqual(0);
  });

  it('should distribute 100 to 3 cols when there are no restrictions', () => {
    const { widths, remaining, columnWidths } = distribute(-100, [{}, {}, {}]);
    expect(widths).toEqual([-33, -33, -34]);
    expect(columnWidths).toEqual([-33, -33, -34]);
    expect(remaining).toEqual(0);
  });

  it('should distribute 100 to 3 cols when first col can only accept 10', () => {
    const { widths, remaining, columnWidths } = distribute(-100, [
      { computedWidth: 30, minWidth: 20 },
      {},
      {},
    ]);
    expect(widths).toEqual([-10, -56, -34]);
    expect(columnWidths).toEqual([20, -56, -34]);
    expect(remaining).toEqual(0);
  });

  it('should distribute 100 to 3 cols when first col can only accept 10, and lastColumn 20', () => {
    const { widths, remaining, columnWidths } = distribute(-100, [
      { computedWidth: 30, minWidth: 20 },
      {},
      { computedWidth: 100, minWidth: 80 },
    ]);
    expect(widths).toEqual([-10, -70, -20]);
    expect(columnWidths).toEqual([20, -70, 80]);
    expect(remaining).toEqual(0);
  });

  it('should distribute 100 to 3 cols when first col can only accept 10, second can accept 60, lastColumn 20', () => {
    const { widths, remaining, columnWidths } = distribute(-100, [
      { computedWidth: 30, minWidth: 20 },
      // +10
      { computedWidth: 100, minWidth: 40 },
      // +56 in first round +4 in second round
      // +20
      { computedWidth: 100, minWidth: 80 },
    ]);
    expect(widths).toEqual([-10, -60, -20]);
    expect(columnWidths).toEqual([20, 40, 80]);
    expect(remaining).toEqual(-10);
  });
});
