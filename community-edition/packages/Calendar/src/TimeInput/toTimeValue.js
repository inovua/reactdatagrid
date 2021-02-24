/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import leftPad from '../utils/leftPad';

export default ({ value, separator = ':', meridiem }) => {
  const parts = value.split(separator);

  const hours = parts[0];
  const minutes = parts[1];
  const seconds = parts[2];

  const result = { hours, minutes };

  if (typeof seconds == 'string' && seconds.length) {
    result.seconds = seconds;
  }

  if (meridiem && seconds !== undefined && seconds * 1 != seconds) {
    result.seconds = leftPad(parseInt(seconds, 10));
  }

  if (meridiem && seconds === undefined && minutes * 1 != minutes) {
    result.minutes = leftPad(parseInt(minutes, 10));
  }

  if (meridiem) {
    const meridiems = ['am', 'AM', 'pm', 'PM'];
    const indexes = meridiems.map(m => (seconds || minutes).indexOf(m));

    indexes.forEach((indexOf, i) => {
      if (indexOf != -1) {
        result.meridiem = meridiems[i];
      }
    });
  }

  return result;
};
