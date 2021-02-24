/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import clamp from '../../../../common/clamp';
/**
 * Returns next item that shoud be selected.
 * If the item has something on the right it should change to that one
 * if not it should check the one on the left.
 * @param  {Stirng|Number} id
 * @param  {String[]|Number[]} value
 * @return {String|Number} newActivetag
 */
function getNewActiveTagOnRemove({ id, value, dir }) {
  dir = dir || -1;
  if (!Array.isArray(value) || value.length === 1) {
    return null;
  }
  let newActiveTag = null;
  const currentIndex = value.indexOf(id);
  const lastIndex = value.length - 1;
  let newIndex = clamp(currentIndex + dir, 0, lastIndex);
  if (dir == 1 && currentIndex === lastIndex) {
    newIndex = clamp(currentIndex - 1, 0, lastIndex);
  }

  if (dir == -1 && currentIndex == 0 && lastIndex > 0) {
    newIndex = 1;
  }

  newActiveTag = value[newIndex];

  return newActiveTag;
}

export default getNewActiveTagOnRemove;
