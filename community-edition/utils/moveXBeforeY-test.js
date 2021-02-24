/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import moveXBeforeY from './moveXBeforeY';

describe('moveXBeforeY', () => {
  it('should work when from < to', () => {
    const from = 1;
    const to = 3;
    expect(moveXBeforeY([1, 2, 3, 4], from, to)).to.eql([1, 3, 2, 4]);
  });

  it('should work when from == to', () => {
    const from = 1;
    const to = 1;

    const arr = [1, 2, 3, 4];

    expect(moveXBeforeY(arr, from, to)).to.eql([1, 2, 3, 4]);
  });

  it('should work when from is an array', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const from = [1, 2, 5];
    const to = 4;

    expect(moveXBeforeY(arr, from, to)).to.eql([1, 4, 2, 3, 6, 5, 7]);
  });

  it('should work when from is an array and to is the arr.length pos', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const from = [1, 2, 5];
    const to = arr.length;

    expect(moveXBeforeY(arr, from, to)).to.eql([1, 4, 5, 7, 2, 3, 6]);
  });

  it('should work when from < to', () => {
    const from = 3;
    const to = 0;

    expect(moveXBeforeY([1, 2, 3, 4], from, to)).to.eql([4, 1, 2, 3]);
  });

  it('should work on empty array', () => {
    const arr = [];
    expect(moveXBeforeY(arr, 1, 1)).to.eql([]);
  });

  it('should work when index out of range', () => {
    expect(moveXBeforeY([1, 2, 3], 6, 2)).to.eql([1, 2, 3]);
  });

  it('should work when moving an item to the array length position', () => {
    expect(moveXBeforeY([1, 2, 3], 0, 3)).to.eql([2, 3, 1]);
  });

  it('should work when to is array length', () => {
    const from = 0;
    const to = 3;
    expect(moveXBeforeY([1, 2, 3], from, to)).to.eql([2, 3, 1]);
  });
});
