/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const contains = (stack, needle) => {
  for (let i = 0; i < stack.length; i++) {
    if (stack[i] == needle) {
      return true;
    }
  }
  return false;
};

/**
 * Returns an object that holds the items
 * asociated with the value.
 * @param  {String|Number|String[]|Number[]} value
 * @param  {Object} dataMap
 * @return {Object}
 */

function getValueMap({ value, dataMap, oldValueMap }) {
  if (value == null) {
    return oldValueMap;
  }

  let valueMap = { ...oldValueMap };

  value = Array.isArray(value) ? value : [value];

  // clean up extra values which are not in the "value" array
  valueMap = Object.keys(valueMap).reduce((acc, id) => {
    if (contains(value, id)) {
      acc[id] = valueMap[id];
    }
    return acc;
  }, {});

  value.forEach(id => {
    if (dataMap && dataMap[id]) {
      valueMap[id] = dataMap[id];
    }
  });

  return valueMap;
}

export default getValueMap;
