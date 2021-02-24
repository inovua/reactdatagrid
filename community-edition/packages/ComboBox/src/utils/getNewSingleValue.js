/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Returns the new value
 * @param  {String|number} id
 * @param  {String|number} value
 * @return {String|number}
 */
function getNewSingleValue({ id, value, toggle = true }) {
  if (value == null) {
    return id;
  }

  if (toggle) {
    return id === value ? null : id;
  }

  return id;
}

export default getNewSingleValue;
