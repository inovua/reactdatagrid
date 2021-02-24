/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { id as GROUP_COL_ID } from '@inovua/reactdatagrid-community/normalizeColumns/defaultGroupColumnId';
import renderGroupTool from '@inovua/reactdatagrid-community/Layout/ColumnLayout/Cell/renderGroupTool';

export default {
  id: GROUP_COL_ID,
  groupColumn: true,
  cellSelectable: false,
  showColumnMenuSortOptions: false,
  showColumnMenuGroupOptions: false,
  showColumnMenuTool: false,
  showInContextMenu: false,
  header: 'Group',
  render: ({ value, data, toggleGroup }, { cellProps }) => {
    if (!data.__group) {
      return null;
    }

    const { groupProps, rtl } = cellProps;

    const shouldRenderGroupTool = cellProps.computedPivot
      ? groupProps.depth < cellProps.computedGroupBy.length - 1
      : true;
    return (
      <React.Fragment>
        <div
          style={{
            display: 'inline-block',
            width: groupProps.groupNestingSize * groupProps.depth,
          }}
        />
        {shouldRenderGroupTool
          ? renderGroupTool({
              render: groupProps.renderGroupTool,
              collapsed: groupProps.collapsed,
              rtl,
              size: 20,
              toggleGroup,
            })
          : null}
        {cellProps.renderGroupValue
          ? cellProps.renderGroupValue({
              value,
              data,
              groupSummary: data.groupSummary,
            })
          : value}
      </React.Fragment>
    );
  },
  sortable: false,
  editable: false,
  groupBy: false,
};

export { GROUP_COL_ID as groupColumnId };
