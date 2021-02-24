/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import hightlightText from './hightlightText';

/**
 * Checkes if label contains text
 * @param  {String} label
 * @param  {String} text
 * @return {Bool}
 */
const defaultFilterFunction = ({ label, text, mode }) => {
  label = label.toLowerCase ? label.toLowerCase() : `${label}`;
  text = text.toLowerCase ? text.toLowerCase() : `${text}`;
  return mode === 'contains'
    ? label.indexOf(text) !== -1
    : label.startsWith(text);
};

/**
 * Filters data source by text
 * @param {Array} data
 * @param {function} getDisplayProperty
 * @param {String} text
 * @return {Array} sortedData
 */
function filterByText({
  data,
  getFilterProperty,
  text,
  filterFunction = defaultFilterFunction,
  mode = 'contains',
  hightlight,
}) {
  if (!Array.isArray(data)) {
    return null;
  }

  const filteredData = data.reduce((acc, item) => {
    const label = getFilterProperty(item);
    const match = filterFunction({ label, text, item, mode });

    if (match) {
      if (hightlight) {
        const newItem = {
          ...item,
          mode,
          matchText: hightlightText({
            queryText: text,
            text: label,
          }),
        };
        acc.push(newItem);
      } else {
        acc.push(item);
      }
    }

    return acc;
  }, []);

  return filteredData;
}

export default filterByText;
