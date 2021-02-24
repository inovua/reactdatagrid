/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import findItemIndex from './findItemIndex';

/**
 * Returns the next items id in the list
 * @param  {Function} getIdProperty [description]
 * @param  {Array} data
 * @param  {String|Number} id - current item id
 * @return {String|Number}
 */
function getNextItem(config) {
  const { data, id, getIdProperty, direction = 1 } = config;
  if (!Array.isArray(data) || !data.length || !getIdProperty || id == null) {
    return null;
  }

  if (data.length === 1) {
    return id;
  }

  /**
   * check if any items are valid targets,
   * if all are disabled return null
   **/
  const enabledItems = data.filter(item => !item.disabled);
  if (enabledItems.length === 0) {
    return null;
  }

  const currentIndex = findItemIndex({ data, id, getIdProperty });

  let nextIndex;
  if (direction === 1) {
    nextIndex = currentIndex + 1;
    nextIndex = nextIndex > data.length - 1 ? 0 : nextIndex;
  } else {
    nextIndex = currentIndex - 1;
    nextIndex = nextIndex >= 0 ? nextIndex : data.length - 1;
  }

  const newItem = data[nextIndex];
  let newActiveId = getIdProperty(newItem);

  if (newItem.disabled) {
    newActiveId = getNextItem({
      ...config,
      id: newActiveId,
    });
  }

  return newActiveId;
}

export default getNextItem;
