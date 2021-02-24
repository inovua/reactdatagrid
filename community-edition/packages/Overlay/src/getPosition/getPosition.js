/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Region from '../../../packages/region-align';
import assign from '../../../common/assign';
import getPositionOffsets from './getPositionOffsets';
import positionsMap from '../positionsMap';
import getArrowPosition from './getArrowPosition';
import getConstrainRegion from '../../../common/getConstrainRegion';

// position
function getPosition({
  constrainTo = true,
  targetNode,
  overlayNode,
  offset,
  positions,
  relativeToViewport,
  arrowSize,
}) {
  if (!constrainTo || !overlayNode || !targetNode) {
    return null;
  }

  const constrain = getConstrainRegion(constrainTo, targetNode);

  const overlayRegion = Region.from(overlayNode);
  const alignRegion = Region.from(targetNode);

  const newRegion = overlayRegion.clone();
  const positionsNormalized = positions.map(
    position => positionsMap[position].position
  );

  const positionsOffsets = getPositionOffsets(positions, offset);
  const positionsOffsetsClone = positionsOffsets.map(offset => {
    return assign({}, offset);
  });

  const succesfullPosition = newRegion.alignTo(
    alignRegion,
    positionsNormalized,
    {
      constrain,
      offset: positionsOffsetsClone,
    }
  );

  const arrowConfig = getArrowPosition({
    arrowSize,
    overlayRegion: newRegion,
    targetRegion: alignRegion,
    position: succesfullPosition,
  });

  const position = {
    top: newRegion.top,
    left: newRegion.left,
  };

  /**
   * If it uses absolute positon position must be corrected.
   * Substract top and left from offsetParent (first parent that has position).
   */
  if (!relativeToViewport && overlayNode.offsetParent) {
    const offsetParentRegion = Region.from(overlayNode.offsetParent);
    position.left -= offsetParentRegion.left;
    position.top -= offsetParentRegion.top;
  }

  return { arrowConfig, position, alignRegion };
}

export default getPosition;
