/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Region from '../region';

/**
 *
 * This method is trying to align the sourceRegion to the targetRegion, given the alignment positions
 * and the offsets. It only modifies the sourceRegion
 *
 * This is all well and easy, but if there is a constrainTo region, the algorithm has to take it into account.
 * In this case, it works as follows.
 *
 *  * start with the first alignment position. Aligns the region, adds the offset and then check for the constraint.
 *  * if the constraint condition is ok, return the position.
 *  * otherwise, remember the intersection area, if the regions are intersecting.
 *  * then go to the next specified align position, and so on, computing the maximum intersection area.
 *
 * If no alignment fits the constrainRegion, the sourceRegion will be resized to match it,
 * using the position with the maximum intersection area.
 *
 * Since we have computed the index of the position with the max intersection area, take that position,
 * and align the sourceRegion accordingly. Then resize the sourceRegion to the intersection, and reposition
 * it again, since resizing it might have destroyed the alignment.
 *
 * Return the position.
 *
 * @param {Region} sourceRegion
 * @param {Region} targetRegion
 * @param {String[]} positions
 * @param {Object} config
 * @param {Array} config.offset
 * @param {Region} config.constrain
 * @param {Boolean/Object} config.sync
 *
 * @return {String/Undefined} the chosen position for the alignment, or undefined if no position found
 */
function ALIGN_TO_NORMALIZED(sourceRegion, targetRegion, positions, config) {
  targetRegion = Region.from(targetRegion);

  config = config || {};

  var constrainTo = config.constrain,
    syncOption = config.sync,
    offsets = config.offset || [],
    syncWidth = false,
    syncHeight = false,
    sourceClone = sourceRegion.clone();

  /*
   * Prepare the method arguments: positions, offsets, constrain and sync options
   */
  if (!Array.isArray(positions)) {
    positions = positions ? [positions] : [];
  }

  if (!Array.isArray(offsets)) {
    offsets = offsets ? [offsets] : [];
  }

  if (constrainTo) {
    constrainTo =
      constrainTo === true ? Region.getDocRegion() : constrainTo.getRegion();
  }

  if (syncOption) {
    if (syncOption.size) {
      syncWidth = true;
      syncHeight = true;
    } else {
      syncWidth = syncOption === true ? true : syncOption.width || false;

      syncHeight = syncOption === true ? true : syncOption.height || false;
    }
  }

  if (syncWidth) {
    sourceClone.setWidth(targetRegion.getWidth());
  }
  if (syncHeight) {
    sourceClone.setHeight(targetRegion.getHeight());
  }

  var offset,
    i = 0,
    len = positions.length,
    pos,
    intersection,
    itArea,
    maxArea = -1,
    maxAreaIndex = -1;

  for (; i < len; i++) {
    pos = positions[i];
    offset = offsets[i];

    sourceClone.alignToRegion(targetRegion, pos);

    if (offset) {
      if (!Array.isArray(offset)) {
        offset = offsets[i] = [offset.x || offset.left, offset.y || offset.top];
      }

      sourceClone.shift({
        left: offset[0],
        top: offset[1],
      });
    }

    //the source region is already aligned in the correct position

    if (constrainTo) {
      //if we have a constrain region, test for the constrain
      intersection = sourceClone.getIntersection(constrainTo);

      if (intersection && intersection.equals(sourceClone)) {
        //constrain respected, so return (the aligned position)

        sourceRegion.set(sourceClone);
        return pos;
      } else {
        //the constrain was not respected, so continue trying
        if (intersection && (itArea = intersection.getArea()) > maxArea) {
          maxArea = itArea;
          maxAreaIndex = i;
        }
      }
    } else {
      sourceRegion.set(sourceClone);
      return pos;
    }
  }

  //no alignment respected the constraints
  if (~maxAreaIndex) {
    pos = positions[maxAreaIndex];
    offset = offsets[maxAreaIndex];

    sourceClone.alignToRegion(targetRegion, pos);

    if (offset) {
      sourceClone.shift({
        left: offset[0],
        top: offset[1],
      });
    }

    //we are sure an intersection exists, because of the way the maxAreaIndex was computed
    intersection = sourceClone.getIntersection(constrainTo);

    sourceClone.setRegion(intersection);
    sourceClone.alignToRegion(targetRegion, pos);

    if (offset) {
      sourceClone.shift({
        left: offset[0],
        top: offset[1],
      });
    }

    sourceRegion.set(sourceClone);

    return pos;
  }
}

export default ALIGN_TO_NORMALIZED;
