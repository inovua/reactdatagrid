/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useProperty from './useProperty';
import { TypeDataGridProps, TypeComputedProps } from '../types';

export default (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps
): {
  computedShowHeader: boolean;
  setShowHeader: (showHeader: boolean) => void;
} => {
  const [computedShowHeader, setShowHeader] = useProperty<boolean>(
    props,
    'showHeader'
  );

  const result = {
    computedShowHeader,
    setShowHeader,
  };
  if (computedShowHeader) {
    result.onHeaderSortClick = colProps => {
      if (computedProps.toggleColumnSort) {
        computedProps.toggleColumnSort(colProps.id);
      }
    };
  }

  return result;
};
