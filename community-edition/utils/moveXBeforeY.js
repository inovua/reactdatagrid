/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (array, from, to) => {
  if (!Array.isArray(array)) {
    array = [];
  }
  const result = [].concat(array);

  const len = array.length;
  if (
    from === to ||
    !len ||
    from == null ||
    to == null ||
    from >= len ||
    to > len
  ) {
    return result;
  }
  from = Array.isArray(from) ? from : [from];

  const lessThanCount = from.reduce((acc, index) => {
    return acc + (index < to ? 1 : 0);
  }, 0);

  const values = from.map(index => array[index]).reverse();

  // remove all from numbers, one at a time
  []
    .concat(from)
    .sort((a, b) => b - a)
    .forEach(index => {
      result.splice(index, 1);
    });

  from.reverse().forEach((index, i) => {
    result.splice(to - lessThanCount, 0, values[i]);
  });

  return result;
};
