/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default function(
  obj: object,
  key: string,
  defaultValue?: any,
  undef?: any
) {
  const keys: string[] = key.split
    ? key.split('.')
    : Array.isArray(key)
    ? key
    : [key];
  for (let propIndex = 0; propIndex < keys.length; propIndex++) {
    obj = obj ? (obj as { [key: string]: any })[keys[propIndex]] : undef;
  }
  return obj === undef ? defaultValue : obj;
}
