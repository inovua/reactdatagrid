/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Region from '../region';

/**
 * @static
 * Aligns the source region to the target region, so as to correspond to the given alignment.
 *
 * NOTE that this method makes changes on the sourceRegion in order for it to be aligned as specified.
 *
 * @param {Region} sourceRegion
 * @param {Region} targetRegion
 *
 * @param {String} align A string with 2 valid align positions, eg: 'tr-bl'.
 * For valid positions, see {@link Region#getPoint}
 *
 * Having 2 regions, we need to be able to align them as we wish:
 *
 * for example, if we have
 *
 *       source    target
 *       ________________
 *       ____
 *      |    |     ________
 *      |____|    |        |
 *                |        |
 *                |________|
 *
 * and we align 't-t', we get:
 *
 *       source    target
 *       _________________
 *
 *       ____      ________
 *      |    |    |        |
 *      |____|    |        |
 *                |________|
 *
 *  In this case, the source was moved down to be aligned to the top of the target
 *
 *
 * and if we align 'tc-tc' we get
 *
 *       source     target
 *       __________________
 *
 *                 ________
 *                | |    | |
 *                | |____| |
 *                |________|
 *
 *  Since the source was moved to have the top-center point to be the same with target top-center
 *
 *
 *
 * @return {RegionClass} The Region class
 */
Region.align = function(sourceRegion, targetRegion, align) {
  targetRegion = Region.from(targetRegion);

  align = (align || 'c-c').split('-');

  //<debug>
  if (align.length != 2) {
    console.warn(
      "Incorrect region alignment! The align parameter need to be in the form 'br-c', that is, a - separated string!",
      align
    );
  }
  //</debug>

  return Region.alignToPoint(
    sourceRegion,
    targetRegion.getPoint(align[1]),
    align[0]
  );
};

/**
 * Modifies the given region to be aligned to the point, as specified by anchor
 *
 * @param {Region} region The region to align to the point
 * @param {Object} point The point to be used as a reference
 * @param {Number} point.x
 * @param {Number} point.y
 * @param {String} anchor The position where to anchor the region to the point. See {@link #getPoint} for available options/
 *
 * @return {Region} the given region
 */
Region.alignToPoint = function(region, point, anchor) {
  region = Region.from(region);

  var sourcePoint = region.getPoint(anchor);
  var count = 0;
  var shiftObj = {};

  if (sourcePoint.x != null && point.x != null) {
    count++;
    shiftObj.left = point.x - sourcePoint.x;
  }

  if (sourcePoint.y != null && point.y != null) {
    count++;
    shiftObj.top = point.y - sourcePoint.y;
  }

  if (count) {
    region.shift(shiftObj);
  }

  return region;
};
