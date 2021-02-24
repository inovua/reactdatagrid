/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import join from '@inovua/reactdatagrid-community/packages/join';
import {
  TypeFooterRow,
  TypeComputedProps,
  TypeComputedColumn,
} from '../../../types';
import React, { ReactNode } from 'react';

const defaultClassName = 'InovuaReactDataGrid__footer-row-cell';

const FooterRowCell = ({
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
}: {
  row: TypeFooterRow;
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
}) => {
  let value: any;

  let render = column.footerRowCellRender;

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

  let footerCellStyle = computedProps.footerCellStyle;

  if (row.cellStyle) {
    footerCellStyle = row.cellStyle;
  }
  if (footerCellStyle) {
    if (typeof footerCellStyle === 'function') {
      let result = footerCellStyle(
        {
          style: footerCellStyle,
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
        footerCellStyle = { ...result };
      }
    }
  }

  let footerCellClassName = computedProps.footerCellClassName || '';

  if (row.cellClassName) {
    footerCellClassName = row.cellClassName;
  }
  if (footerCellClassName) {
    if (typeof footerCellClassName === 'function') {
      footerCellClassName =
        footerCellClassName(
          {
            style: footerCellStyle,
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
        footerCellClassName,
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
      style={{
        ...footerCellStyle,
        width: computedWidth,
      }}
      key={column.id}
    >
      {value}
    </div>
  );
};

export default FooterRowCell;
