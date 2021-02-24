/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assignFilter from '../../packages/assign-filter';

function isDefined(value) {
  return value !== undefined;
}

export default (target, ...sources) => {
  return assignFilter(isDefined, target, ...sources);
};
