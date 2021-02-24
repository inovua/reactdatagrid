/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getArrowPositionDirection from './getArrowPositionDirection';
import clamp from '../clamp';

function getLeftPosition(overlayRegion, targetRegion) {
  return targetRegion.left - overlayRegion.left + targetRegion.width / 2;
}

function getTopPosition(overlayRegion, targetRegion) {
  return targetRegion.top - overlayRegion.top + targetRegion.height / 2;
}

function getArrowPosition({
  overlayRegion,
  targetRegion,
  position,
  arrowSize,
}) {
  let arrowPosition = null;
  const positionDirection = getArrowPositionDirection(position);

  const left = clamp(
    getLeftPosition(overlayRegion, targetRegion),
    arrowSize / 2,
    overlayRegion.width - arrowSize / 2
  );
  const top = clamp(
    getTopPosition(overlayRegion, targetRegion),
    arrowSize / 2,
    overlayRegion.height - arrowSize / 2
  );

  arrowPosition = {
    top: {
      position: {
        left,
        top: 'calc(100% - 1px)',
      },
      location: 'top',
    },
    bottom: {
      position: {
        left,
        bottom: 'calc(100% - 1px)',
      },
      location: 'bottom',
    },
    right: {
      position: {
        top,
        right: 'calc(100% - 1px)',
      },
      location: 'right',
    },
    left: {
      position: {
        top,
        left: 'calc(100% - 1px)',
      },
      location: 'left',
    },
  }[positionDirection];

  return arrowPosition;
}

export default getArrowPosition;
