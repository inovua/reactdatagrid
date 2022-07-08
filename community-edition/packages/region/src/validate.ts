/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import { Region } from './types';

/**
 * @static
 * Returns true if the given region is valid, false otherwise.
 * @param  {Region} region The region to check
 * @return {Boolean}        True, if the region is valid, false otherwise.
 * A region is valid if
 *  * left <= right  &&
 *  * top  <= bottom
 */
export default function validate(region: Region): boolean {
  var isValid = true;

  if (region.right! < region.left!) {
    isValid = false;
    region.right = region.left;
  }

  if (region.bottom! < region.top) {
    isValid = false;
    region.bottom = region.top;
  }

  return isValid;
}
