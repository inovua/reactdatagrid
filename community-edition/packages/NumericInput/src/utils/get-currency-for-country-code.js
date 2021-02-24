/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import countryCurrencyCodes from '../data/countryCurrencyCodes';
import countries from '../data/countries';
import find from './find';

let countriesByCountryCode = countries.reduce((accumulator, country) => {
  accumulator[country.code] = country.name;
  accumulator[country.code.toLowerCase()] = country.name;
  return accumulator;
}, {});

export default function getCurrencyForCountryCode(
  locale,
  currencyDisplay = 'symbol'
) {
  const code = locale.split('-')[1];
  const countryNameByCode = countriesByCountryCode[code];
  if (countryNameByCode) {
    const country =
      countriesByCountryCode[code] &&
      countriesByCountryCode[code].toLowerCase();
    const currency = find(countryCurrencyCodes, countryCode => {
      return (countryCode.countries || []).indexOf(country) !== -1;
    });
    if (currency) {
      return new Number(1)
        .toLocaleString(locale, {
          style: 'currency',
          currency: currency.code,
          currencyDisplay,
        })
        .replace(/[0-9\.\,]/g, '');
    }
    return '';
  } else {
    console.error(
      `Cannot get currency based on country code. Country ${code} not found.`
    );
    return '';
  }
}
