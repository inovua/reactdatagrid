/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Region from '../../packages/region-align';
import assign from '../assign';
import getPositionOffsets from './getPositionOffsets';
import positionsMap from './positionsMap';
import getArrowPosition from './getArrowPosition';
import getConstrainRegion from './getConstrainRegion';
import isPositionBottom from './isPositionBottom';

const posiblePositions = Object.keys(positionsMap);

// position
function getPosition({
  constrainTo = true,
  targetNode,
  overlayNode,
  offset = 0,
  positions = posiblePositions,
  relativeToViewport = true,
  arrowSize = 10,
  adjustOnPositionBottom = true,
  showArrow = true,
}) {
  if (!constrainTo || !overlayNode || !targetNode) {
    return null;
  }

  const constrain = getConstrainRegion(constrainTo, targetNode);

  const overlayRegion = Region.from(overlayNode);
  const alignRegion = Region.from(targetNode);

  const newRegion = overlayRegion.clone();
  const positionsNormalized = positions.map(position => {
    let normalizedPosition;

    if (positionsMap[position]) {
      normalizedPosition = positionsMap[position].position;
    } else {
      normalizedPosition = position.position || position;
    }

    return normalizedPosition;
  });

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

  const constrainedWidth = newRegion.getWidth() != overlayRegion.getWidth();
  const constrainedHeight = newRegion.getHeight() != overlayRegion.getHeight();

  let arrowConfig = null;
  if (showArrow) {
    arrowConfig = getArrowPosition({
      arrowSize,
      overlayRegion: newRegion,
      targetRegion: alignRegion,
      position: succesfullPosition,
    });
  }

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

  /**
   * If position is bottom, the overlay
   * should be positioned relative to bottom.
   */
  if (isPositionBottom(succesfullPosition) && adjustOnPositionBottom) {
    position.bottom = -(
      overlayRegion.height +
      (alignRegion.height - position.top)
    );
    delete position.top;
  }

  return {
    alignRegion,
    constrainedHeight,
    constrainedWidth,
    constrained: constrainedHeight || constrainedWidth,
    positionRegion: newRegion,
    arrowConfig,
    position,
    succesfullPosition,
  };
}

export default getPosition;
