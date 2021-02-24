/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import GroupToolbar from './GroupToolbar';

export default ({
  groupBy,
  columnsMap,
  onItemMouseDown,
  onGroupByChange,
  ref,
  theme,
  onSortClick,
  headerGroupPlaceholderText,
  renderSortTool,
  renderGroupItem,
  disableGroupByToolbar,
  rtl,
}) => {
  if (!groupBy || disableGroupByToolbar) {
    return null;
  }
  return (
    <GroupToolbar
      ref={ref}
      rtl={rtl}
      theme={theme}
      onGroupByChange={onGroupByChange}
      onItemMouseDown={onItemMouseDown}
      renderGroupItem={renderGroupItem}
      renderSortTool={renderSortTool}
      placeholder={headerGroupPlaceholderText}
      columns={columnsMap}
      groupBy={groupBy}
      onSortClick={onSortClick}
    />
  );
};
