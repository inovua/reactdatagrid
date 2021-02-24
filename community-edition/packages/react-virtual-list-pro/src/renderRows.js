/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Row from './Row';

export default ({
  count,
  renderRow,
  rowHeight,
  showEmptyRows,
  ref,
  pure,
  sticky,
  notifyRowSpan,
  rowHeightManager,
  onRowHeightChange,
  onKeyDown,
  onFocus,
  onUnmount,
  rowContain,
  naturalRowHeight,
  useTransformPosition,

  from = 0,
  to = count,
  virtualized,
}) => {
  const rows = [];
  for (let i = from; i < to; i++) {
    rows.push(
      <Row
        contain={rowContain}
        pure={pure}
        ref={ref}
        sticky={sticky}
        rowHeight={rowHeight}
        useTransformPosition={useTransformPosition}
        onRowHeightChange={onRowHeightChange}
        notifyRowSpan={notifyRowSpan}
        key={i}
        index={i}
        count={count}
        renderRow={renderRow}
        rowHeightManager={rowHeightManager}
        showEmptyRows={showEmptyRows}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onUnmount={onUnmount}
        virtualized={virtualized}
        naturalRowHeight={naturalRowHeight}
      />
    );
  }

  return rows;
};
