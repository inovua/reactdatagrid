/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import computeFlexWidths from './computeFlexWidths';

describe('computeFlexWidths', () => {
  it('should compute correctly in simple case', () => {
    expect(
      computeFlexWidths({
        flexes: [1, 1, 1],
        availableSize: 300,
      })
    ).toEqual([100, 100, 100]);
  });

  it('should compute correctly when there is minWidths', () => {
    expect(
      computeFlexWidths({
        flexes: [1, 1, 1],
        minWidths: [null, 200, null],
        availableSize: 301,
      })
    ).toEqual([51, 200, 50]);
  });

  it('should compute correctly when not all are flexes', () => {
    expect(
      computeFlexWidths({
        flexes: [1, 0, 1],
        minWidths: [null, 200, null],
        availableSize: 301,
      })
    ).toEqual([151, null, 150]);
  });

  it('should compute correctly when there is maxWidths', () => {
    expect(
      computeFlexWidths({
        flexes: [2, 1, 1],
        maxWidths: [null, 50, null],
        availableSize: 301,
      })
    ).toEqual([167, 50, 84]);
  });

  it('should compute correctly on special case', () => {
    expect(
      computeFlexWidths({
        flexes: [2, 1, 1],
        minWidths: [null, null, 110],
        availableSize: 300,
      })
    ).toEqual([127, 63, 110]);

    expect(
      computeFlexWidths({
        flexes: [2, 1, 1],
        minWidths: [null, 110, null],
        availableSize: 300,
      })
    ).toEqual([127, 110, 63]);

    expect(
      computeFlexWidths({
        flexes: [2, 1, 1],
        minWidths: [110, null, null],
        availableSize: 300,
      })
    ).toEqual([150, 75, 75]);
  });
});
