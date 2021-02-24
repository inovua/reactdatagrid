/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TypeComputedProps,
  TypeStickyRows,
  TypeDataGridProps,
} from '../../../community-edition/types';
import { MutableRefObject, useState, useMemo } from 'react';

const useStickyRows = (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
): {
  computedStickyRows?: TypeStickyRows;
  setStickyGroupsIndexes?: (stickyGroupsIndexes: TypeStickyRows) => void;
} => {
  const [stickyIndexes, setStickyGroupsIndexes] = useState<{
    [key: number]: number;
  } | null>(null);

  let stickyRows =
    props.stickyGroupRows || props.stickyTreeNodes ? stickyIndexes : null;

  const computedStickyRows = useMemo(() => {
    return stickyRows == null ? stickyRows : { ...stickyRows };
  }, [
    stickyRows,

    // any of the below should determine
    // sticky rows to be repainted,
    // as their "active" state or another state could change
    // so we force the sticky rows container to rerender
    // by doing this
    computedProps.rtl,
    computedProps.data,
    computedProps.size,
    computedProps.viewportAvailableWidth,
    computedProps.visibleColumns,
    computedProps.computedActiveIndex,
  ]);

  return {
    computedStickyRows,
    setStickyGroupsIndexes,
  };
};

export default useStickyRows;
