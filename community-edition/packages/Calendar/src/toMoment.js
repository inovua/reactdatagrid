/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import moment from 'moment';

/**
 * This function will be used to convert a date to a moment.
 *
 * It accepts input as sring, date or moment
 *
 * @param  {String/Date/Moment} value
 *
 * @param  {String} [dateFormat] if value is string, it will be parsed to a moment
 * using this format.
 * You can skip this argument and only specify the config instead,
 * where you can have a dateFormat property
 *
 * @param  {Object} [config]
 * @param  {String} [config.dateFormat] a dateFormat string
 * @param  {String} [config.locale] a locale
 * @param  {Boolean} [config.strict] whether to perform strict parsing on strings
 *
 * @return {Moment}
 */
export default (value, dateFormat, config) => {
  if (typeof dateFormat === 'object') {
    config = dateFormat;
    dateFormat = null;
  }

  const strict = !!(config && config.strict);
  const locale = config && config.locale;

  dateFormat = dateFormat || (config && config.dateFormat) || 'YYYY-MM-DD';

  if (typeof value == 'string') {
    return moment(value, dateFormat, locale, strict);
  }

  value = value == null ? new Date() : value;

  return moment(value, undefined, locale, strict);
};
