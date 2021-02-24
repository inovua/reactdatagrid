/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from 'react';
import { TypeDataGridProps, TypeLockedRow } from '../../types';

const EMPTY_ARRAY: TypeLockedRow[] = [];

export default (
  props: TypeDataGridProps
): {
  computedLockedRows: TypeLockedRow[];
  computedLockedStartRows: TypeLockedRow[];
  computedLockedEndRows: TypeLockedRow[];
} => {
  const computedLockedStartRows: TypeLockedRow[] = useMemo(
    () =>
      props.lockedRows
        ? props.lockedRows.filter(r => r.position !== 'end')
        : EMPTY_ARRAY,
    [props.lockedRows]
  );

  const computedLockedEndRows: TypeLockedRow[] = useMemo(
    () =>
      props.lockedRows
        ? props.lockedRows.filter(r => r.position === 'end')
        : EMPTY_ARRAY,
    [props.lockedRows]
  );

  const result = {
    computedLockedRows: props.lockedRows || EMPTY_ARRAY,
    computedLockedStartRows,
    computedLockedEndRows,
  };

  return result;
};
