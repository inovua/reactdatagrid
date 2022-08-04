/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import toMoment, { Moment } from '../toMoment';

const CONFIG = {
  // the format in which days should be displayed in month view
  dayFormat: 'D',

  // the format in which months should be displayed in year view
  monthFormat: 'MMMM',

  // the format in which years should be displayed in decade view
  yearFormat: 'YYYY',
};

const f = (mom: Moment, format: string) => toMoment(mom).format(format);

export default {
  day(mom: Moment, format: string | undefined) {
    return f(mom, format || CONFIG.dayFormat);
  },

  month(mom: Moment, format: string | undefined) {
    return f(mom, format || CONFIG.monthFormat);
  },

  year(mom: Moment, format: string | undefined) {
    return f(mom, format || CONFIG.yearFormat);
  },
};
