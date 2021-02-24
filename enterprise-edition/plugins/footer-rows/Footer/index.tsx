/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactNode, useContext } from 'react';
import { TypeComputedProps, TypeFooterRow } from '../../../types';

import join from '@inovua/reactdatagrid-community/packages/join';
import FooterRowCell from './FooterRowCell';

import GridContext from '@inovua/reactdatagrid-community/context';

const footerClassName = 'InovuaReactDataGrid__footer-rows-container';
const defaultClassName = 'InovuaReactDataGrid__footer-row';

const renderCellsMaybeLocked = (
  cells: ReactNode[],
  row: TypeFooterRow,
  computedProps: TypeComputedProps
): ReactNode[] => {
  const startCount = computedProps.lockedStartColumns.length;
  const unlockedCount = computedProps.unlockedColumns.length;

  const {
    lockedStartColumns,
    lockedEndColumns,
    unlockedColumns,
    totalLockedStartWidth,
    totalLockedEndWidth,
    totalUnlockedWidth,
    computedSummary: summary,
  } = computedProps;

  let lockedStartCells: ReactNode = cells.slice(0, startCount);
  let unlockedCells: ReactNode = cells.slice(
    startCount,
    startCount + unlockedCount
  );
  let lockedEndCells: ReactNode = cells.slice(startCount + unlockedCount);
  const rtl = computedProps.rtl;

  if (row.renderLockedStart) {
    lockedStartCells = row.renderLockedStart(
      {
        columns: lockedStartColumns,
        value: lockedStartCells,
        summary,
      },
      computedProps
    );
  }
  if (row.renderLockedEnd) {
    lockedEndCells = row.renderLockedEnd(
      {
        columns: lockedEndColumns,
        value: lockedEndCells,
        summary,
      },
      computedProps
    );
  }

  if (row.renderUnlocked) {
    unlockedCells = row.renderUnlocked(
      {
        columns: unlockedColumns,
        value: unlockedCells,
        summary,
      },
      computedProps
    );
  }

  return [
    <div
      key="locked-start"
      data-name="start"
      style={{ width: totalLockedStartWidth }}
      className={join(
        `${defaultClassName}-group ${defaultClassName}-group--locked-start ${defaultClassName}-group--${
          rtl ? 'rtl' : 'ltr'
        }`
      )}
    >
      {lockedStartCells}
    </div>,
    <div
      className={`${defaultClassName}-group ${defaultClassName}-group--unlocked ${defaultClassName}-group--${
        rtl ? 'rtl' : 'ltr'
      }`}
      style={{
        width: totalUnlockedWidth,
      }}
    >
      {unlockedCells}
    </div>,
    <div
      key="locked-end"
      data-name="end"
      style={{ width: totalLockedEndWidth }}
      className={join(
        `${defaultClassName}-group ${defaultClassName}-group--locked-end  ${defaultClassName}-group--${
          rtl ? 'rtl' : 'ltr'
        }`
      )}
    >
      {lockedEndCells}
    </div>,
  ];
};

const renderFooterRow = (
  row: TypeFooterRow,
  rowIndex: number,
  rows: TypeFooterRow[],
  computedProps: TypeComputedProps
): ReactNode => {
  const id = rowIndex;

  const firstUnlockedIndex = computedProps.firstUnlockedIndex;
  const firstLockedEndIndex = computedProps.firstLockedEndIndex;

  const lastLockedStartIndex = computedProps.lastLockedStartIndex;
  const lastUnlockedIndex = computedProps.lastUnlockedIndex;
  const rtl = computedProps.rtl;

  const firstRowInSection = rowIndex === 0;
  const lastRowInSection = rowIndex === rows.length - 1;

  const colspanned: { [key: string]: boolean } = {};

  const showBorderBottom =
    computedProps.showHorizontalCellBorders && !lastRowInSection;

  let cells: ReactNode[] = computedProps.visibleColumns.map(
    (col, index, array) => {
      let colspan: any = row.colspan;
      let computedWidth = col.computedWidth;

      if (colspanned[col.id]) {
        return null;
      }

      if (colspan && typeof colspan === 'object' && colspan[col.id]) {
        colspan = colspan[col.id];
      }

      if (typeof colspan === 'function') {
        colspan = colspan(
          {
            column: col,
            columnIndex: col.computedVisibleIndex,
            row,
            rowIndex,
          },
          computedProps
        );
      }

      let lastIndexForCurrentColumn = index;
      if (colspan && typeof colspan === 'number' && colspan > 1) {
        let remainingColumns = colspan - 1;

        let spanColIndex = index;
        while (remainingColumns) {
          let spanCol = computedProps.visibleColumns[spanColIndex + 1];
          if (!spanCol) {
            break;
          }

          if (spanCol.computedLocked !== col.computedLocked) {
            break;
          }
          computedWidth += spanCol.computedWidth;

          colspanned[spanCol.id] = true;
          spanColIndex++;
          lastIndexForCurrentColumn++;
          remainingColumns--;
        }
      }

      const last = lastIndexForCurrentColumn === array.length - 1;
      const firstInSection =
        index === 0 ||
        index === firstUnlockedIndex ||
        index === firstLockedEndIndex;

      const lastInSection =
        lastIndexForCurrentColumn === lastLockedStartIndex ||
        lastIndexForCurrentColumn === lastUnlockedIndex ||
        last;

      const showBorderRight =
        lastIndexForCurrentColumn === lastLockedStartIndex;

      const showBorderLeft = computedProps.showVerticalCellBorders
        ? index !== 0 && index !== firstUnlockedIndex
        : index === firstLockedEndIndex;

      return (
        <FooterRowCell
          key={col.id}
          row={row}
          last={last}
          rtl={rtl}
          first={index === 0}
          firstInSection={firstInSection}
          lastInSection={lastInSection}
          showBorderBottom={showBorderBottom}
          showBorderRight={rtl ? showBorderLeft : showBorderRight}
          showBorderLeft={rtl ? showBorderRight : showBorderLeft}
          rowIndex={rowIndex}
          columnIndex={index}
          column={col}
          computedWidth={computedWidth}
          computedProps={computedProps}
        />
      );
    }
  );

  cells = renderCellsMaybeLocked(cells, row, computedProps);

  let footerRowStyle = {
    minWidth: computedProps.minRowWidth,
  };

  if (computedProps.footerRowStyle) {
    if (typeof computedProps.footerRowStyle === 'function') {
      let result = computedProps.footerRowStyle(
        {
          style: footerRowStyle,
          row,
          rowIndex,
          firstInSection: firstRowInSection,
          lastInSection: lastRowInSection,
        },
        computedProps
      );
      if (result !== undefined) {
        footerRowStyle = { ...footerRowStyle, ...result };
      }
    } else {
      footerRowStyle = { ...footerRowStyle, ...computedProps.footerRowStyle };
    }
  }

  let cls = '';

  if (computedProps.footerRowClassName) {
    if (typeof computedProps.footerRowClassName === 'function') {
      cls =
        computedProps.footerRowClassName(
          {
            style: footerRowStyle,
            row,
            rowIndex,
            firstInSection: firstRowInSection,
            lastInSection: lastRowInSection,
          },
          computedProps
        ) || '';
    } else {
      cls = computedProps.footerRowClassName || '';
    }
  }

  return (
    <div
      key={id}
      style={footerRowStyle}
      className={join(
        cls,
        defaultClassName,
        `${defaultClassName}--position-${row.position}`,
        firstRowInSection && `${defaultClassName}--first-in-section`,
        `${defaultClassName}--${rtl ? 'rtl' : 'ltr'}`,
        showBorderBottom && `${defaultClassName}--show-border-bottom`,
        lastRowInSection && `${defaultClassName}--last-in-section`
      )}
    >
      {cells}
    </div>
  );
};
export default ({
  rows,
  style,
  children,
}: {
  style?: any;
  children?: JSX.Element;
  rows: TypeFooterRow[];
}): ReactNode => {
  const computedProps: TypeComputedProps = useContext<TypeComputedProps>(
    GridContext
  );

  const position = 'end';
  return (
    <div
      style={{
        ...style,
        overflow: 'hidden',
        maxWidth: computedProps.viewportAvailableWidth,
      }}
      className={join(
        `${footerClassName} ${footerClassName}--position-${position}`,
        computedProps.nativeScroll &&
          computedProps.scrollbars.vertical &&
          `${footerClassName}--show-border-right`
      )}
    >
      <div className={`${footerClassName}-scroller`}>
        {rows.map((row, i) => renderFooterRow(row, i, rows, computedProps))}
      </div>
      {children}
    </div>
  );
};
