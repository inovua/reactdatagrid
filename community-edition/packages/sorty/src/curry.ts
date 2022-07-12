/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeSingleSortInfo } from '.';

function curry(
  fn: (sortInfo: TypeSingleSortInfo[], array: any[]) => any[],
  n?: number
) {
  if (typeof n !== 'number') {
    n = fn.length;
  }

  function getCurryClosure(prevArgs: ConcatArray<never>) {
    function curryClosure(this: any) {
      var len: number = arguments.length;
      var args: any = [].concat(prevArgs);

      if (len) {
        args.push.apply(args, arguments);
      }

      if (args.length < n!) {
        return getCurryClosure(args);
      }

      return fn.apply(this, args);
    }

    return curryClosure;
  }

  return getCurryClosure([]);
}

export default curry;
