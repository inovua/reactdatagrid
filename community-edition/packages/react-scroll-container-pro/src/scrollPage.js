/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import smoothScrollTo from './smoothScrollTo';

export default (node, { orientation, direction, pageSize }) => {
  if (!direction) {
    throw new Error('Please provide a scroll direction: 1 or -1!');
  }

  const horiz = orientation == 'horizontal';
  const scrollPosName = horiz ? 'scrollLeft' : 'scrollTop';

  pageSize =
    pageSize || (horiz ? node.clientWidth - 20 : node.clientHeight - 20);

  const currentValue = node[scrollPosName];
  const newValue = currentValue + direction * pageSize;

  smoothScrollTo(node, newValue, {
    orientation,
  });
};
