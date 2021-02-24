/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getDecimalDelimiter from '../utils/get-decimal-delimiter';

describe('getDecimalDelimiter utils function', () => {
  it('should get decimal character when no locale used', () => {
    const delimiter = getDecimalDelimiter();
    expect(!!delimiter).toBe(true);
  });

  it('should get decimal character "." for en-GB locale', () => {
    const delimiter = getDecimalDelimiter('en-GB');
    expect(delimiter).toBe('.');
  });

  xit('should get decimal character "," for ro-RO locale', () => {
    const delimiter = getDecimalDelimiter('ro-RO');
    expect(delimiter).toBe(',');
  });
});
