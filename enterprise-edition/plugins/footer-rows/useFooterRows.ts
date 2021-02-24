/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeDataGridProps, TypeFooterRow } from '../../types';

const EMPTY_ARRAY: TypeFooterRow[] = [];

export default (
  props: TypeDataGridProps
): {
  computedFooterRows: null | TypeFooterRow[];
} => {
  const rows = (props.footerRows || EMPTY_ARRAY).map(r => {
    return {
      ...r,
      position: 'end',
    } as TypeFooterRow;
  });

  const result = {
    computedFooterRows: rows.length ? rows : null,
  };

  return result;
};
