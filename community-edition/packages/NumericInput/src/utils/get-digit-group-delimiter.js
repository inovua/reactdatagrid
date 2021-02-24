/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default function getDigitGroupDelimiter(locale) {
  const number = 1000;
  return number.toLocaleString(locale).replace(/[01]/g, '') || ','; // we need || "," since SAFARI does not work correctly
}
