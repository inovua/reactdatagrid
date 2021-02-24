/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default function getDecimalDelimiter(locale) {
  return (1.1).toLocaleString(locale).replace(/1/g, '') || '.'; // we need || "." since SAFARI does not work correctly
}
