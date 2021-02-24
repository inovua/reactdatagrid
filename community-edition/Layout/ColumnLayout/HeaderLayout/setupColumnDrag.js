/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DragHelper from '../../../packages/drag-helper';

const emptyFn = () => {};

export default ({ constrainTo, region }, cfg = {}, event) => {
  const onDrag = cfg.onDrag || emptyFn;
  const onDrop = cfg.onDrop || emptyFn;

  DragHelper(event, {
    constrainTo,
    region,
    onDrag(event, config) {
      event.preventDefault();
      onDrag({ left: config.diff.left || 0, top: config.diff.top || 0 }, event);
    },
    onDrop(event, config) {
      onDrop(config.diff);
    },
  });
};
