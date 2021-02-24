/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Region from '../region';
import './Region.static';
import './Region.proto';

import COMPUTE_ALIGN_REGION from './computeAlignRegion';

/**
 * region-align module exposes methods for aligning {@link Element} and {@link Region} instances
 *
 * The #alignTo method aligns this to the target element/region using the specified positions. See #alignTo for a graphical example.
 *
 *
 *      var div = Element.select('div.first')
 *
 *      div.alignTo(Element.select('body') , 'br-br')
 *
 *      //aligns the div to be in the bottom-right corner of the body
 *
 * Other useful methods
 *
 *  * {@link #alignRegions} - aligns a given source region to a target region
 *  * {@link #COMPUTE_ALIGN_REGION} - given a source region and a target region, and alignment positions, returns a clone of the source region, but aligned to satisfy the given alignments
 */

/**
 * Aligns sourceRegion to targetRegion. It modifies the sourceRegion in order to perform the correct alignment.
 * See #COMPUTE_ALIGN_REGION for details and examples.
 *
 * This method calls #COMPUTE_ALIGN_REGION passing to it all its arguments. The #COMPUTE_ALIGN_REGION method returns a region that is properly aligned.
 * If this returned region position/size differs from sourceRegion, then the sourceRegion is modified to be an exact copy of the aligned region.
 *
 * @inheritdoc #COMPUTE_ALIGN_REGION
 * @return {String} the position used for alignment
 */
Region.alignRegions = function(sourceRegion, targetRegion, positions, config) {
  var result = COMPUTE_ALIGN_REGION(
    sourceRegion,
    targetRegion,
    positions,
    config
  );
  var alignedRegion = result.region;

  if (!alignedRegion.equals(sourceRegion)) {
    sourceRegion.setRegion(alignedRegion);
  }

  return result.position;
};

/**
 *
 * The #alignTo method aligns this to the given target region, using the specified alignment position(s).
 * You can also specify a constrain for the alignment.
 *
 * Example
 *
 *      BIG
 *      ________________________
 *      |  _______              |
 *      | |       |             |
 *      | |   A   |             |
 *      | |       |      _____  |
 *      | |_______|     |     | |
 *      |               |  B  | |
 *      |               |     | |
 *      |_______________|_____|_|
 *
 * Assume the *BIG* outside rectangle is our constrain region, and you want to align the *A* rectangle
 * to the *B* rectangle. Ideally, you'll want their tops to be aligned, and *A* to be placed at the right side of *B*
 *
 *
 *      //so we would align them using
 *
 *      A.alignTo(B, 'tl-tr', { constrain: BIG })
 *
 * But this would result in
 *
 *       BIG
 *      ________________________
 *      |                       |
 *      |                       |
 *      |                       |
 *      |                _____ _|_____
 *      |               |     | .     |
 *      |               |  B  | . A   |
 *      |               |     | .     |
 *      |_______________|_____|_._____|
 *
 *
 * Which is not what we want. So we specify an array of options to try
 *
 *      A.alignTo(B, ['tl-tr', 'tr-tl'], { constrain: BIG })
 *
 * So by this we mean: try to align A(top,left) with B(top,right) and stick to the BIG constrain. If this is not possible,
 * try the next option: align A(top,right) with B(top,left)
 *
 * So this is what we end up with
 *
 *      BIG
 *      ________________________
 *      |                       |
 *      |                       |
 *      |                       |
 *      |        _______ _____  |
 *      |       |       |     | |
 *      |       |   A   |  B  | |
 *      |       |       |     | |
 *      |_______|_______|_____|_|
 *
 *
 * Which is a lot better!
 *
 * @param {Element/Region} target The target to which to align this alignable.
 *
 * @param {String[]/String} positions The positions for the alignment.
 *
 * Example:
 *
 *      'br-tl'
 *      ['br-tl','br-tr','cx-tc']
 *
 * This method will try to align using the first position. But if there is a constrain region, that position might not satisfy the constrain.
 * If this is the case, the next positions will be tried. If one of them satifies the constrain, it will be used for aligning and it will be returned from this method.
 *
 * If no position matches the contrain, the one with the largest intersection of the source region with the constrain will be used, and this alignable will be resized to fit the constrain region.
 *
 * @param {Object} config A config object with other configuration for this method
 *
 * @param {Array[]/Object[]/Object} config.offset The offset to use for aligning. If more that one offset is specified, then offset at a given index is used with the position at the same index.
 *
 * An offset can have the following form:
 *
 *      [left_offset, top_offset]
 *      {left: left_offset, top: top_offset}
 *      {x: left_offset, y: top_offset}
 *
 * You can pass one offset or an array of offsets. In case you pass just one offset,
 * it cannot have the array form, so you cannot call
 *
 *      this.alignTo(target, positions, [10, 20])
 *
 * If you do, it will not be considered. Instead, please use
 *
 *      this.alignTo(target, positions, {x: 10, y: 20})
 *
 * Or
 *
 *      this.alignTo(target, positions, [[10, 20]] )
 *
 * @param {Boolean/Element/Region} config.constrain If boolean, target will be constrained to the document region, otherwise,
 * getRegion will be called on this argument to determine the region we need to constrain to.
 *
 * @param {Boolean/Object} config.sync Either boolean or an object with {width, height}. If it is boolean,
 * both width and height will be synced. If directions are specified, will only sync the direction which is specified as true
 *
 * @return {String}
 *
 */
Region.prototype.alignTo = function(target, positions, config) {
  config = config || {};

  var sourceRegion = this;
  var targetRegion = Region.from(target);

  var result = COMPUTE_ALIGN_REGION(
    sourceRegion,
    targetRegion,
    positions,
    config
  );
  var resultRegion = result.region;

  if (!resultRegion.equalsSize(sourceRegion)) {
    this.setSize(resultRegion.getSize());
  }
  if (!resultRegion.equalsPosition(sourceRegion)) {
    this.setPosition(resultRegion.getPosition(), {
      absolute: !!config.absolute,
    });
  }

  return result.position;
};

export default Region;
