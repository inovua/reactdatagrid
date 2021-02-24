/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import join from '@inovua/reactdatagrid-community/packages/join';
import {
  TypeLockedRow,
  TypeComputedProps,
  TypeComputedColumn,
} from '../../../types';
import React from 'react';

const defaultClassName = 'InovuaReactDataGrid__locked-row-cell';

const LockedCellRow = ({
  row,
  rowIndex,
  computedProps,
  first,
  last,
  lastInSection,
  firstInSection,
  rtl,
  column,
  columnIndex,
  showBorderRight,
  showBorderBottom,
  showBorderLeft,
  computedWidth,
  rowPosition,
}: {
  row: TypeLockedRow;
  computedWidth: number;
  rowIndex: number;
  columnIndex: number;
  last: boolean;
  first: boolean;
  rtl: boolean;
  lastInSection: boolean;
  firstInSection: boolean;
  showBorderRight: boolean;
  showBorderBottom: boolean;
  showBorderLeft: boolean;
  computedProps: TypeComputedProps;
  column: TypeComputedColumn;
  rowPosition: 'start' | 'end';
}) => {
  let value: any;

  let render = column.lockedRowCellRender;

  if (row.render) {
    if (typeof row.render === 'function') {
      render = row.render;
    } else if (typeof row.render[column.id!] === 'function') {
      render = row.render[column.id!];
    } else {
      render = row.render;
    }
  }

  if (typeof render === 'function') {
    value = render(
      {
        summary: computedProps.computedSummary,
        row,
        rowIndex,
        rowPosition,
        render: row.render,
        column,
        columnIndex,
      },
      computedProps
    );
  } else if (render != null) {
    value = render;

    if (render[column.id] !== undefined) {
      value = render[column.id];
    } else {
      if (typeof render === 'object' && !(render as any).props) {
        value = null;
      }
    }
  }

  let lockedRowCellStyle = computedProps.lockedRowCellStyle;

  if (row.cellStyle) {
    lockedRowCellStyle = row.cellStyle;
  }
  if (lockedRowCellStyle) {
    if (typeof lockedRowCellStyle === 'function') {
      let result = lockedRowCellStyle(
        {
          style: lockedRowCellStyle,
          summary: computedProps.computedSummary,
          row,
          rowIndex,
          column,
          columnIndex,
          value,
          first,
          last,
          showBorderLeft,
          showBorderRight,
          showBorderBottom,
          firstInSection,
          lastInSection,
        },
        computedProps
      );
      if (result !== undefined) {
        lockedRowCellStyle = { ...result };
      }
    }
  }

  lockedRowCellStyle = {
    ...lockedRowCellStyle,
    width: computedWidth,
  };

  if (computedProps.useRowHeightForLockedRows && computedProps.rowHeight) {
    lockedRowCellStyle.height = computedProps.rowHeight;
  }

  let lockedRowCellClassName = computedProps.lockedRowCellClassName || '';

  if (row.cellClassName) {
    lockedRowCellClassName = row.cellClassName;
  }
  if (lockedRowCellClassName) {
    if (typeof lockedRowCellClassName === 'function') {
      lockedRowCellClassName =
        lockedRowCellClassName(
          {
            style: lockedRowCellStyle,
            summary: computedProps.computedSummary,
            row,
            column,
            columnIndex,
            value,
            rowIndex,
            firstInSection,
            lastInSection,
          },
          computedProps
        ) || '';
    }
  }

  return (
    <div
      className={join(
        defaultClassName,
        lockedRowCellClassName,
        `${defaultClassName}--row-position-${row.position}`,
        column.computedLocked
          ? `${defaultClassName}--locked-${column.computedLocked}`
          : `${defaultClassName}--unlocked`,
        first && `${defaultClassName}--first`,
        `${defaultClassName}--direction-${rtl ? 'rtl' : 'ltr'}`,
        last && `${defaultClassName}--last`,
        lastInSection && `${defaultClassName}--last-in-section`,
        firstInSection && `${defaultClassName}--first-in-section`,
        showBorderRight && `${defaultClassName}--show-border-right`,
        showBorderBottom && `${defaultClassName}--show-border-bottom`,
        showBorderLeft && `${defaultClassName}--show-border-left`
      )}
      style={lockedRowCellStyle}
      key={column.id}
    >
      {value}
    </div>
  );
};

export default LockedCellRow;
