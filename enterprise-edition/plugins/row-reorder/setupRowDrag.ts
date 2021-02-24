/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MouseEvent } from 'react';
import DragHelper from '@inovua/reactdatagrid-community/packages/drag-helper';

import {
  TypeDragHelper,
  TypeConfig,
} from '@inovua/reactdatagrid-community/types';

const emptyFn = () => {};

export default (event: MouseEvent, region: any, cfg: TypeDragHelper): void => {
  const onDrag = cfg.onDrag || emptyFn;
  const onDrop = cfg.onDrop || emptyFn;

  DragHelper(event, {
    region,
    onDrag(event: MouseEvent, config: TypeConfig) {
      event.preventDefault();
      onDrag(event, config);
    },
    onDrop(event: MouseEvent, config: TypeConfig) {
      onDrop(event, config);
    },
  });
};
