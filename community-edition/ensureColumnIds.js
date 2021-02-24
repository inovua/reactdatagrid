/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from 'object-assign';
import setColumnId from './setColumnId';

export default (columns, clone = true) => {
  return columns.map(col => {
    return clone ? setColumnId(assign({}, col)) : setColumnId(col);
  });
};
