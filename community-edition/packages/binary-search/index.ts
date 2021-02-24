/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

type TypeComparator<A, B> = (
  a: A,
  b: B,
  index?: number,
  haystack?: ArrayLike<A>
) => any;

export default <A, B>(
  haystack: ArrayLike<A>,
  needle: B,
  comparator: TypeComparator<A, B>,
  low?: number,
  high?: number
) => {
  var mid, cmp;

  if (low === undefined) low = 0;
  else {
    low = low | 0;
    if (low < 0 || low >= haystack.length)
      throw new RangeError('invalid lower bound');
  }

  if (high === undefined) high = haystack.length - 1;
  else {
    high = high | 0;
    if (high < low || high >= haystack.length)
      throw new RangeError('invalid upper bound');
  }

  while (low <= high) {
    /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
     * to double (which gives the wrong results). */
    mid = low + ((high - low) >> 1);
    cmp = +comparator(haystack[mid], needle, mid, haystack);

    /* Too low. */
    if (cmp < 0.0) low = mid + 1;
    /* Too high. */ else if (cmp > 0.0) high = mid - 1;
    /* Key found. */ else return mid;
  }

  /* Key not found. */
  return ~low;
};
