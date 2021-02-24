/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Region from '../region';
/**
 *
 * Aligns this region to the given region
 * @param {Region} region
 * @param {String} alignPositions For available positions, see {@link #getPoint}
 *
 *     eg: 'tr-bl'
 *
 * @return this
 */
Region.prototype.alignToRegion = function(region, alignPositions) {
  Region.align(this, region, alignPositions);

  return this;
};

/**
 * Aligns this region to the given point, in the anchor position
 * @param {Object} point eg: {x: 20, y: 600}
 * @param {Number} point.x
 * @param {Number} point.y
 *
 * @param {String} anchor For available positions, see {@link #getPoint}
 *
 *     eg: 'bl'
 *
 * @return this
 */
Region.prototype.alignToPoint = function(point, anchor) {
  Region.alignToPoint(this, point, anchor);

  return this;
};
