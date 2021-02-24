/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getConstrainRegion from '../../../../common/getConstrainRegion';

import prepareAlignOffset from '../utils/prepareAlignOffset';

export default (
  props,
  subMenuRegion,
  targetAlignRegion,
  constrainTo,
  domNode
) => {
  const constrainRegion = getConstrainRegion.call(this, constrainTo, domNode);

  if (typeof props.alignSubMenu === 'function') {
    props.alignSubMenu(subMenuRegion, targetAlignRegion, constrainRegion);
  } else {
    const alignPositions = props.alignPositions;

    let offset = props.rtl
      ? props.rtlSubmenuAlignOffset
      : props.submenuAlignOffset;

    offset = prepareAlignOffset(offset, alignPositions.length);

    const pos = subMenuRegion.alignTo(targetAlignRegion, alignPositions, {
      offset,
      constrain: constrainRegion,
    });

    return pos == 'tl-tr' || pos == 'tr-tl'
      ? // align downwards
        1
      : // align upwards
        -1;
  }
};
