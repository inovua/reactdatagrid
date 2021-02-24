/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Region from '../region';

import ALIGN_TO_NORMALIZED from './alignToNormalized';

/**
 * @localdoc Given source and target regions, and the given alignments required, returns a region that is the resulting allignment.
 * Does not modify the sourceRegion.
 *
 * Example
 *
 *      var sourceRegion = inovua.getInstance({
 *          alias  : 'z.region',
 *          top    : 10,
 *          left   : 10,
 *          bottom : 40,
 *          right  : 100
 *      })
 *
 *      var targetRegion = inovua.getInstance({
 *          alias  : 'z.region',
 *          top    : 10,
 *          left   : 10,
 *          bottom : 40,
 *          right  : 100
 *      })
 *      //has top-left at (10,10)
 *      //and bottom-right at (40, 100)
 *
 *      var alignRegion = alignable.COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, 'tl-br')
 *
 *      //alignRegion will be a clone of sourceRegion, but will have the
 *      //top-left corner aligned with bottom-right of targetRegion
 *
 *      alignRegion.get() // => { top: 40, left: 100, bottom: 70, right: 190 }
 *
 * @param  {Region} sourceRegion The source region to align to targetRegion
 * @param  {Region} targetRegion The target region to which to align the sourceRegion
 * @param  {String/String[]} positions    A string ( delimited by "-" characters ) or an array of strings with the position to try, in the order of their priority.
 * See Region#getPoint for a list of available positions. They can be combined in any way.
 * @param  {Object} config      A config object with other configuration for the alignment
 * @param  {Object/Object[]} config.offset      Optional offsets. Either an object or an array with a different offset for each position
 * @param  {Element/Region/Boolean} config.constrain  The constrain to region or element. If the boolean true, Region.getDocRegion() will be used
 * @param  {Object/Boolean} config.sync   A boolean object that indicates whether to sync sourceRegion and targetRegion sizes (width/height or both). Can be
 *
 *  * true - in order to sync both width and height
 *  * { width: true }  - to only sync width
 *  * { height: true } - to only sync height
 *  * { size: true }   - to sync both width and height
 *
 * @return {Object} an object with the following keys:
 *
 *  * position - the position where the alignment was made. One of the given positions
 *  * region   - the region where the alignment is in place
 *  * positionChanged - boolean value indicating if the position of the returned region is different from the position of sourceRegion
 *  * widthChanged    - boolean value indicating if the width of the returned region is different from the width of sourceRegion
 *  * heightChanged   - boolean value indicating if the height of the returned region is different from the height of sourceRegion
 */
function COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, positions, config) {
  sourceRegion = Region.from(sourceRegion);

  var sourceClone = sourceRegion.clone();
  var position = ALIGN_TO_NORMALIZED(
    sourceClone,
    targetRegion,
    positions,
    config
  );

  return {
    position: position,
    region: sourceClone,
    widthChanged: sourceClone.getWidth() != sourceRegion.getWidth(),
    heightChanged: sourceClone.getHeight() != sourceRegion.getHeight(),
    positionChanged: sourceClone.equalsPosition(sourceRegion),
  };
}

export default COMPUTE_ALIGN_REGION;
