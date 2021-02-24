/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import convertStringToNumber from '../utils/convert-string-to-number';

describe('convertStringToNumber utils function', () => {
  it('should convert numbers without any special deilimitors', () => {
    const number = convertStringToNumber('1000');
    expect(number).toBe(1000);
  });

  it('should convert empty/nan/falsy strings', () => {
    expect(convertStringToNumber()).toBeNaN();
    expect(convertStringToNumber('x')).toBeNaN();
  });

  it('should convert number strings keeping in mind decimal delimiter', () => {
    const number1 = convertStringToNumber('1000.00');
    expect(number1).toBe(1000);

    const number2 = convertStringToNumber('1000.05');
    expect(number2).toBe(1000.05);

    const number3 = convertStringToNumber('1000.05', {
      decimalDelimiter: '.',
    });

    expect(number3).toBe(1000.05);

    const number4 = convertStringToNumber('1000,05', {
      decimalDelimiter: ',',
    });

    expect(number4).toBe(1000.05);

    const number5 = convertStringToNumber('1000,00', {
      decimalDelimiter: ',',
    });

    expect(number5).toBe(1000);
  });

  it('should convert numbers having group delimiters', () => {
    const reversedDelimiters = {
      decimalDelimiter: ',',
      digitGroupDelimiter: '.',
    };

    const number1 = convertStringToNumber('100.000', reversedDelimiters);
    expect(number1).toBe(100000);

    const number1b = convertStringToNumber('100,000');
    expect(number1b).toBe(100000);

    const number2 = convertStringToNumber('1.0.0...005', reversedDelimiters);
    expect(number2).toBe(100005);

    const number2b = convertStringToNumber('1,0,0,,,005');
    expect(number2b).toBe(100005);
  });

  it('should convert numbers having group delimiters and decimal delimiters', () => {
    const reversedDelimiters = {
      decimalDelimiter: ',',
      digitGroupDelimiter: '.',
    };

    const number1 = convertStringToNumber('100.000,00', reversedDelimiters);
    expect(number1).toBe(100000);

    const number2 = convertStringToNumber('1.0.0...005,05', reversedDelimiters);
    expect(number2).toBe(100005.05);

    const number1b = convertStringToNumber('100,000.00');
    expect(number1b).toBe(100000);

    const number2b = convertStringToNumber('1,0,0,,,005.05');
    expect(number2b).toBe(100005.05);
  });

  describe('min/max values', () => {
    const minMaxParams = {
      min: 1000,
      max: 2000,
    };

    it('should handle min values', () => {
      const minEdgeNumber = convertStringToNumber('1000', minMaxParams);
      expect(minEdgeNumber).toBe(1000);

      const underMinEdgeNumber = convertStringToNumber('999.9', minMaxParams);
      expect(underMinEdgeNumber).toBe(1000);
    });

    it('should handle max values', () => {
      const validNumber = convertStringToNumber('1500.2', minMaxParams);
      expect(validNumber).toBe(1500.2);

      const maxEdgeNumber = convertStringToNumber('2000', minMaxParams);
      expect(maxEdgeNumber).toBe(2000);

      const overMaxEdgeNumber = convertStringToNumber('2000.1', minMaxParams);
      expect(overMaxEdgeNumber).toBe(2000);
    });
  });
});
