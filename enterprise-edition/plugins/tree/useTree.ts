/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import computeTreeData from './computeTreeData';
import { TypeComputedProps, TypeDataGridProps } from '../../types';
import { MutableRefObject } from 'react';
import useTreeColumn from './useTreeColumn';

export default (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
) => {
  Object.assign(
    computedProps,
    useTreeColumn(props, computedProps, computedPropsRef)
  );

  computedProps.computeTreeData = computeTreeData;
};
