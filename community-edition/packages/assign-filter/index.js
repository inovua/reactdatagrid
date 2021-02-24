/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function assignFilter(filter, target, ...args) {
  var filteredArgs = args.map(function(obj) {
    if (obj == null) {
      return obj;
    }

    return Object.keys(obj).reduce(function(acc, propName) {
      var value = obj[propName];

      if (filter(value, propName, obj)) {
        acc[propName] = value;
      }

      return acc;
    }, {});
  });

  return Object.assign(target, ...filteredArgs);
}

export default assignFilter;
