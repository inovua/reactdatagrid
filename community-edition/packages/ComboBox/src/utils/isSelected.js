/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Determines if the item is selected
 * @param  {Number|String}  id
 * @param  {Number|String}  value
 * @return {Boolean}
 */
function isSelected({ id, value }) {
  if (Array.isArray(value)) {
    return value.indexOf(id) !== -1;
  }

  return id === value;
}

export default isSelected;
