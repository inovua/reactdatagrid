/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import DEFAULT_GROUP_COLUMN from './defaultGroupColumn';
import { IColumn } from '../types/TypeColumn';

export default function(
  columns: any[],
  props: {
    groupColumn: IColumn | boolean;
  }
): any[] {
  const groupColumn = props.groupColumn;

  if (groupColumn) {
    const groupCol = {
      ...DEFAULT_GROUP_COLUMN,
      ...(groupColumn === true ? null : groupColumn),
      name: null,
      id: DEFAULT_GROUP_COLUMN.id,
    };

    columns = [groupCol].concat(columns);
  }

  return columns;
}
