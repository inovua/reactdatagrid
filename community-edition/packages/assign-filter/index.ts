/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function assignFilter(
  filter: (value: any, propsName: string, obj: object) => boolean,
  target: object,
  ...args: any
) {
  var filteredArgs = args.map(function(obj: object) {
    if (obj == null) {
      return obj;
    }

    return Object.keys(obj).reduce(function(acc: object, propName: string) {
      var value = obj[propName as keyof object];

      if (filter(value, propName, obj)) {
        acc[propName as keyof object] = value;
      }

      return acc;
    }, {});
  });

  return Object.assign(target, ...filteredArgs);
}

export default assignFilter;
