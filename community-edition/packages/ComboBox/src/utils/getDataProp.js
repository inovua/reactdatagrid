/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const getDataProp = propName => {
  if (propName == null) {
    return null;
  }

  return item => {
    if (!item) {
      return null;
    }
    return typeof propName === 'function' ? propName(item) : item[propName];
  };
};

export default getDataProp;
