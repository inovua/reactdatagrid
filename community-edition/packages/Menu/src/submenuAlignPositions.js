/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const alignPositionLTR = [
  // align to right
  'tl-tr',
  'bl-br',

  // align to left
  'tr-tl',
  'br-bl',
];

const alignPositionRTL = [
  // align to left
  'tr-tl',
  'br-bl',

  // align to right
  'tl-tr',
  'bl-br',
];

const alignOffsetLTR = [
  { x: -7, y: 5 }, // ok
  { x: -7, y: -5 }, // ok
  { x: 7, y: 5 }, // ok
  { x: 7, y: -5 }, // ok
];
const alignOffsetRTL = [
  { x: 7, y: 5 }, // ok
  { x: 7, y: -5 }, // ok
  { x: -7, y: 5 }, // ok
  { x: -7, y: -5 }, // ok
];

export { alignPositionLTR, alignPositionRTL, alignOffsetLTR, alignOffsetRTL };
