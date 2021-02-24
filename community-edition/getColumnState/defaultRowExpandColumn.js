/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { id as ROW_EXPAND_COL_ID } from './defaultRowExpandColumnId';

const ICON_EXPANDED = (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M19 13H5v-2h14v2z" />
  </svg>
);

const ICON_COLLAPSED = (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const ICON_MORE = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    style={{ position: 'relative', top: 3 }}
  >
    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

export default {
  id: ROW_EXPAND_COL_ID,
  rowExpandColumn: true,
  cellSelectable: false,
  headerAlign: 'center',
  textAlign: 'center',
  render: ({ isRowExpandable, rowExpanded, toggleRowExpand }) => {
    if (!isRowExpandable()) {
      return;
    }
    const style = {
      cursor: 'pointer',
    };
    return React.cloneElement(rowExpanded ? ICON_EXPANDED : ICON_COLLAPSED, {
      style,
      onClick: event => {
        event.stopPropagation();
        toggleRowExpand();
      },
    });
  },
  header: ICON_MORE,
  showInContextMenu: false,
  showColumnMenuSortOptions: false,
  showColumnMenuGroupOptions: false,
  showColumnMenuTool: false,
  sortable: false,
  editable: false,
  groupBy: false,
  defaultWidth: 50,
  minWidth: 40,
};

export { ROW_EXPAND_COL_ID as rowExpandColumnId };
