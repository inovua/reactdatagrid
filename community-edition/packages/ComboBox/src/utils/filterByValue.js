/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import isSelected from './isSelected';

function filterByValue({ data, getIdProperty, value }) {
  return data.filter(item => {
    const id = getIdProperty(item);
    return !isSelected({ id, value });
  });
}

export default filterByValue;
