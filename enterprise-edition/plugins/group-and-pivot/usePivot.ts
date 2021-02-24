/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import computeDataStep from './computeDataStep';
import { TypeComputedProps, TypeDataGridProps } from '../../types';
import { MutableRefObject } from 'react';
import useStickyRows from './useStickyRows';
import useGroupBy from './useGroupBy';
import useGroups from './useGroups';

export default (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
) => {
  Object.assign(
    computedProps,
    useStickyRows(props, computedProps, computedPropsRef)
  );
  Object.assign(
    computedProps,
    useGroupBy(props, computedProps, computedPropsRef)
  );

  Object.assign(
    computedProps,
    useGroups(props, computedProps, computedPropsRef)
  );
  return { computeDataStep };
};
