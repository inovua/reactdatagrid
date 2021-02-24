/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const topPositions = ['top', 'bc-tc', 'bl-tl', 'br-tr'];

const bottomPositions = ['bottom', 'tc-bc', 'tl-bl', 'tr-br'];

const rightPositions = ['right', 'lc-rc', 'tl-tr', 'bl-br'];

const leftPositions = ['left', 'rc-lc', 'tr-tl', 'br-bl'];

const noArrowPositions = ['br-tl', 'tl-br', 'tr-bl'];

function isTopPosition(position) {
  return topPositions.indexOf(position) !== -1;
}

function isBottomPosition(position) {
  return bottomPositions.indexOf(position) !== -1;
}

function isLeftPosition(position) {
  return leftPositions.indexOf(position) !== -1;
}

function isRightPosition(position) {
  return rightPositions.indexOf(position) !== -1;
}

function getArrowPositionDirection(position) {
  const positionTest = {
    top: isTopPosition(position),
    bottom: isBottomPosition(position),
    right: isRightPosition(position),
    left: isLeftPosition(position),
  };

  return Object.keys(positionTest).filter(
    position => !!positionTest[position]
  )[0];
}

export default getArrowPositionDirection;
