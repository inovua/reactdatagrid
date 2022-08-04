/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import leftPad from '../utils/leftPad';

export type TypeTimeValue = {
  hours?: string;
  minutes?: string;
  seconds?: string;
  meridiem?: string | boolean;
};

export default ({
  value,
  separator = ':',
  meridiem,
}: {
  value?: string;
  separator?: string;
  meridiem?: string | boolean;
}): TypeTimeValue => {
  const parts: string[] = value!.split(separator);

  const hours: any = parts[0];
  const minutes: any = parts[1];
  const seconds: any = parts[2];

  const result: TypeTimeValue = { hours, minutes };

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
