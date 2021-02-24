/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import renderCheckbox from './renderCheckbox';
import { id as CHECK_COL_ID } from './defaultCheckColumnId';

export default {
  id: CHECK_COL_ID,
  checkboxColumn: true,
  autoLock: true,
  cellSelectable: false,
  headerAlign: 'center',
  textAlign: 'center',
  render: ({ cellProps }: any) => renderCheckbox(cellProps),
  header: renderCheckbox,
  showColumnMenuSortOptions: false,
  showColumnMenuGroupOptions: false,
  showColumnMenuTool: false,
  showInContextMenu: false,
  sortable: false,
  editable: false,
  draggable: false,
  groupBy: false,
  checkboxTabIndex: null,
  defaultWidth: 40,
  minWidth: 40,
};

export { CHECK_COL_ID as checkboxColumnId };
