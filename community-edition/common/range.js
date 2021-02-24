/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Creates a range from start to end (not including end) using step as increment.
 * @param  {Number} start    Start Value
 * @param  {Number} end      End Value, it is noninclusive
 * @param  {Number} [step=1] Increment Value
 * @return {Array}          Range from start to end
 */
function range(start = 0, end, step = 1) {
  const collection = [];
  for (let i = start; i < end; i += step) {
    collection.push(i);
  }

  return collection;
}

export default range;
