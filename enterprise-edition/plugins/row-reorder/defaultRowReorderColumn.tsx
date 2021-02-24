/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { id as REORDER_COLUMN_ID } from '@inovua/reactdatagrid-community/normalizeColumns/defaultRowReorderColumnId';

const ICON_REORDER = (
  <svg
    width="8"
    height="12"
    viewBox="0 0 8 12"
    style={{ position: 'relative', top: 2, cursor: 'pointer' }}
  >
    <g fillRule="evenodd">
      <path
        fill="none"
        d="M0 0L14 0 14 14 0 14z"
        transform="translate(-3 -1)"
      />
      <path
        d="M6.2 11.5c0 .825-.72 1.5-1.6 1.5-.88 0-1.6-.675-1.6-1.5S3.72 10 4.6 10c.88 0 1.6.675 1.6 1.5zm-1.6-6C3.72 5.5 3 6.175 3 7s.72 1.5 1.6 1.5c.88 0 1.6-.675 1.6-1.5s-.72-1.5-1.6-1.5zm0-4.5C3.72 1 3 1.675 3 2.5S3.72 4 4.6 4c.88 0 1.6-.675 1.6-1.5S5.48 1 4.6 1zm4.8 3c.88 0 1.6-.675 1.6-1.5S10.28 1 9.4 1c-.88 0-1.6.675-1.6 1.5S8.52 4 9.4 4zm0 1.5c-.88 0-1.6.675-1.6 1.5s.72 1.5 1.6 1.5c.88 0 1.6-.675 1.6-1.5s-.72-1.5-1.6-1.5zm0 4.5c-.88 0-1.6.675-1.6 1.5S8.52 13 9.4 13c.88 0 1.6-.675 1.6-1.5S10.28 10 9.4 10z"
        transform="translate(-3 -1)"
      />
    </g>
  </svg>
);

export default {
  id: REORDER_COLUMN_ID,
  headerAlign: 'center',
  textAlign: 'center',
  render: () => {
    const className = 'InovuaReactDataGrid__row-reorder-icon';

    return React.cloneElement(ICON_REORDER, {
      className,
    });
  },
  cellSelectable: false,
  autoLock: true,
  header: '',
  showColumnMenuSortOptions: false,
  showColumnMenuGroupOptions: false,
  showColumnMenuTool: false,
  showInContextMenu: false,
  sortable: false,
  editable: false,
  resizable: false,
  draggable: false,
  groupBy: false,
  defaultWidth: 40,
  minWidth: 40,
};
