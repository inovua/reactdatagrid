/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import moment from 'moment';
const DEFAULT_WEEK_START_DAY =
  moment()
    .startOf('week')
    .format('d') * 1;

export default function getWeekDayNames(startDay, locale) {
  let weekDays;
  if (locale) {
    const data = moment.localeData(locale);

    weekDays = data && data._weekdaysShort ? data._weekdaysShort : weekDays;
  }

  weekDays = (weekDays || moment.weekdaysMin()).concat();
  const names = weekDays;
  let index = startDay == null ? DEFAULT_WEEK_START_DAY : startDay;

  while (index > 0) {
    names.push(names.shift());
    index--;
  }

  return names;
}
