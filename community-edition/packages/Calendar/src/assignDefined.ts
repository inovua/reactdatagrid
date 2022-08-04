/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from '../../../common/assign';

const filter = (object: any) => {
  return Object.keys(object).reduce((acc: any, prop: any) => {
    const value = object[prop];

    if (value !== undefined) {
      acc[prop] = value;
    }

    return acc;
  }, {});
};

export default (target: any, ...args: any[]) => {
  return assign(target, ...args.map(filter));
};
