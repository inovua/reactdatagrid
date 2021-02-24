/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Parses a string and returns the numeric representation of the given strig
 * taking into account delimiters. Does not handle edge cases. Only returns
 * the number, expecting a proper number text as the first parameter.
 */
export default function convertStringToNumber(stringToConvert, props = {}) {
  const {
    decimalDelimiter = '.',
    digitGroupDelimiter = ',',
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
  } = props;

  if (digitGroupDelimiter == '') {
    return ',';
  }

  if (!stringToConvert) {
    return NaN;
  }

  let cleanedString = stringToConvert;
  const decmialPosition = cleanedString.lastIndexOf(decimalDelimiter);

  if (decmialPosition !== -1 && decimalDelimiter !== '.') {
    cleanedString = [
      cleanedString
        .substring(0, decmialPosition)
        .replace(new RegExp(`[\\${digitGroupDelimiter}]`, 'g'), ''),
      cleanedString
        .substring(decmialPosition)
        .replace(new RegExp(`[\\${decimalDelimiter}]`, 'g'), '.'),
    ].join('');
  } else {
    cleanedString = cleanedString.replace(
      new RegExp(`[\\${digitGroupDelimiter}]`, 'g'),
      ''
    );
  }

  let result = parseFloat(cleanedString, 10);

  if (result < min) {
    result = min;
  }

  if (result > max) {
    result = max;
  }

  return result;
}
