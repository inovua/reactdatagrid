/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { RowHeightManager } from '..';
import Row from './Row';

type TypeRows = {
  count?: number;
  renderRow?: Function;
  rowHeight?: number;
  showEmptyRows?: boolean;
  ref?: any;
  pure?: boolean;
  sticky?: boolean;
  notifyRowSpan?: (rowIndex: number, rowSpan: number) => void;
  rowHeightManager?: RowHeightManager;
  onRowHeightChange?: Function;
  onKeyDown?: (index: number, event: any) => void;
  onFocus?: (index: number, event: any) => void;
  onUnmount?: (row: any) => void;
  rowContain?: boolean | string;
  naturalRowHeight?: boolean;
  useTransformPosition?: boolean;
  from?: number;
  to?: number;
  virtualized?: boolean;
};

const renderRows = ({
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
  to = count || 0,
  virtualized,
}: TypeRows | any): any[] => {
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

export default renderRows;
