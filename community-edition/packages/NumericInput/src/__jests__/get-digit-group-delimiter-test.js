/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getDigitGroup from '../utils/get-digit-group-delimiter';

describe('getDigitGroup utils function', () => {
  it('should get decimal character when no locale used', () => {
    const delimiter = getDigitGroup();
    expect(!!delimiter).toBe(true);
  });

  it('should get digit group character "," for en-GB locale', () => {
    const delimiter = getDigitGroup('en-GB');
    expect(delimiter).toBe(',');
  });

  xit('should get digit group character "." for ro-RO locale', () => {
    const delimiter = getDigitGroup('ro-RO');
    expect(delimiter).toBe('.');
  });
});
