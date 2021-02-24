/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { MutableRefObject } from 'react';
import {
  TypeComputedProps,
  TypeComputedColumn,
  TypeSingleSortInfo,
} from '../../types';

import { IS_IE, IS_MS_BROWSER } from '../../../detect-ua';
import { getCellHeader } from '../../../Layout/ColumnLayout/HeaderLayout/Header';

import Menu from '../../../packages/Menu';

import renderGridMenu from '../../../renderGridMenu';

const COLUMN_MENU_ALIGN_POSITIONS = [
  'tl-bl',
  'tr-br',
  'tl-tr',
  'tr-tl',
  'br-tr',
  'bl-tl',
  'br-tl',
  'bl-tr',
  'lc-tr',
  'rc-tl',
];

const COLUMN_MENU_ALIGN_POSITIONS_RTL = [
  'tr-br',
  'tl-bl',
  'tr-tl',
  'tl-tr',
  'br-tr',
  'bl-tl',
  'br-tl',
  'bl-tr',
  'lc-tr',
  'rc-tl',
];

const notEmpty = (x: any): boolean => !!x;

const getTopComputedProps = (
  computedProps: TypeComputedProps
): TypeComputedProps => {
  while (computedProps.initialProps.parentComputedProps) {
    computedProps = computedProps.initialProps.parentComputedProps;
  }

  return computedProps;
};

export default (
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
) => {
  const cellProps = computedProps.columnContextMenuProps;
  if (!cellProps) {
    return null;
  }

  const groupBy = computedProps.computedGroupBy;

  let visibleCountWithColumnMenu = 0;
  const visibleMap = computedProps.initialProps.columns.reduce((acc, col) => {
    const column = computedProps.getColumnBy((col.name || col.id)!);
    if (column && computedProps.isColumnVisible(column)) {
      const value = (column.id || column.name)!;
      acc[value] = column.id || column.name;
      if (column.showColumnMenuTool !== false) {
        visibleCountWithColumnMenu++;
      }
    }
    return acc;
  }, {} as { [key: string]: any });

  const onSelectionChange = (selection: any) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }

    if (IS_IE) {
      computedProps.preventIEMenuCloseRef.current = true;
      setTimeout(() => {
        computedProps.preventIEMenuCloseRef.current = false;
      }, 100);
    }
    computedProps.initialProps.columns.forEach(col => {
      const computedCol = computedProps.getColumnBy(col) as TypeComputedColumn;

      if (computedCol) {
        const visible = computedCol.id in selection;
        computedProps.setColumnVisible(col, visible);
      }
    });
  };

  const currentColumn = computedProps.getColumnBy(
    cellProps.id
  ) as TypeComputedColumn;
  const colSortInfo = currentColumn.computedSortInfo as TypeSingleSortInfo;
  const lockLimit =
    !cellProps.computedLocked && computedProps.unlockedColumns.length <= 1;

  const isAutoLock =
    cellProps.autoLock &&
    computedProps.lockedStartColumns &&
    !!computedProps.lockedStartColumns.filter(c => !c.autoLock).length;

  let showColumnMenuLockOptions =
    cellProps.showColumnMenuLockOptions !== undefined
      ? cellProps.showColumnMenuLockOptions
      : computedProps.initialProps.showColumnMenuLockOptions;

  if (cellProps.lockable === false) {
    showColumnMenuLockOptions = false;
  }
  const showColumnMenuGroupOptions =
    cellProps.showColumnMenuGroupOptions !== undefined
      ? cellProps.showColumnMenuGroupOptions
      : computedProps.initialProps.showColumnMenuGroupOptions;

  const showColumnMenuFilterOptions =
    cellProps.showColumnMenuFilterOptions !== undefined
      ? cellProps.showColumnMenuFilterOptions
      : computedProps.initialProps.showColumnMenuFilterOptions;

  const showColumnMenuSortOptions =
    cellProps.showColumnMenuSortOptions !== undefined
      ? cellProps.showColumnMenuSortOptions
      : computedProps.initialProps.showColumnMenuSortOptions;

  let columnsItem: any = {
    label: computedProps.i18n('columns'),
    itemId: 'columns',
    menuProps: {
      dismissOnClick: false,
    },
    items: computedProps
      .getColumnsInOrder()
      .filter(c => c.showInContextMenu !== false)
      .map((c: TypeComputedColumn) => {
        const value = c.id || c.name || '';

        return {
          label: getCellHeader(c, c, null, {
            currentColumn,
          }),
          itemId: `column-${c.id}`,
          value,
          disabled:
            c.hideable === false ||
            (visibleCountWithColumnMenu === 1 && visibleMap[value]),
          name: value,
        };
      }),
  };

  if (computedProps.computedPivot) {
    columnsItem = null;
  }
  let items = [
    showColumnMenuSortOptions === false
      ? null
      : {
          label: computedProps.i18n('sortAsc'),
          itemId: 'sortAsc',
          disabled:
            !cellProps.computedSortable ||
            (colSortInfo && colSortInfo.dir === 1),
          onClick: () => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
              return;
            }
            computedProps.setColumnSortInfo(cellProps.id, 1);
            computedProps.hideColumnContextMenu();
          },
        },
    showColumnMenuSortOptions === false
      ? null
      : {
          label: computedProps.i18n('sortDesc'),
          itemId: 'sortDesc',
          disabled:
            !cellProps.computedSortable ||
            (colSortInfo && colSortInfo.dir === -1),
          onClick: () => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
              return;
            }
            computedProps.setColumnSortInfo(cellProps.id, -1);
            computedProps.hideColumnContextMenu();
          },
        },
    (computedProps.initialProps.allowUnsort ||
      computedProps.computedIsMultiSort) &&
    showColumnMenuSortOptions !== false
      ? {
          label: computedProps.i18n('unsort'),
          itemId: 'unsort',
          disabled: !colSortInfo,
          onClick: () => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
              return;
            }
            computedProps.unsortColumn(cellProps.id);
            computedProps.hideColumnContextMenu();
          },
        }
      : null,

    showColumnMenuGroupOptions === false ? null : '-',
    showColumnMenuGroupOptions === false
      ? null
      : {
          label: computedProps.i18n('group'),
          itemId: 'group',
          disabled:
            !groupBy ||
            groupBy.indexOf(cellProps.id) !== -1 ||
            currentColumn.groupBy === false,
          onClick: () => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
              return;
            }
            computedProps.addGroupByColumn(cellProps.id);
            computedProps.hideColumnContextMenu();
          },
        },
    showColumnMenuGroupOptions === false
      ? null
      : {
          label: computedProps.i18n('ungroup'),
          itemId: 'ungroup',
          disabled:
            !groupBy ||
            groupBy.indexOf(cellProps.id) === -1 ||
            currentColumn.groupBy === false,
          onClick: () => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
              return;
            }
            computedProps.removeGroupByColumn(cellProps.id);
            computedProps.hideColumnContextMenu();
          },
        },
    showColumnMenuLockOptions === false ? null : '-',
    showColumnMenuLockOptions === false
      ? null
      : {
          label: computedProps.i18n('lockStart'),
          itemId: 'lockStart',
          disabled: cellProps.computedLocked === 'start' || lockLimit,
          onClick: () => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
              return;
            }
            computedProps.setColumnLocked(cellProps.id, 'start');
            computedProps.hideColumnContextMenu();
          },
        },
    showColumnMenuLockOptions === false
      ? null
      : {
          label: computedProps.i18n('lockEnd'),
          itemId: 'lockEnd',
          disabled:
            cellProps.computedLocked === 'end' || lockLimit || isAutoLock,
          onClick: () => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
              return;
            }
            computedProps.setColumnLocked(cellProps.id, 'end');
            computedProps.hideColumnContextMenu();
          },
        },
    showColumnMenuLockOptions === false
      ? null
      : {
          label: computedProps.i18n('unlock'),
          itemId: 'unlock',
          disabled: !cellProps.computedLocked || isAutoLock,
          onClick: () => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
              return;
            }
            computedProps.setColumnLocked(cellProps.id, false);
            computedProps.hideColumnContextMenu();
          },
        },
    columnsItem ? '-' : null,
    columnsItem,
  ].filter(notEmpty);

  if (items[0] === '-') {
    items = items.slice(1);
  }

  if (
    computedProps.initialProps.enableFiltering !== false &&
    showColumnMenuFilterOptions !== false
  ) {
    const isFilterable = computedProps.computedFilterable;

    const showFilteringMenuItems = computedProps.shouldShowFilteringMenuItems
      ? computedProps.shouldShowFilteringMenuItems()
      : false;
    if (showFilteringMenuItems) {
      items.push('-');
      items.push({
        label: computedProps.i18n('showFilteringRow', 'Show Filtering Row'),
        itemId: 'showFilteringRow',
        disabled: isFilterable,
        onClick: () => {
          const { current: computedProps } = computedPropsRef;
          if (!computedProps) {
            return;
          }
          computedProps.setEnableFiltering(true);
          computedProps.hideColumnContextMenu();
        },
      });
      items.push({
        label: computedProps.i18n('hideFilteringRow', 'Hide Filtering Row'),
        itemId: 'hideFilteringRow',
        disabled: !isFilterable,
        onClick: () => {
          const { current: computedProps } = computedPropsRef;
          if (!computedProps) {
            return;
          }
          computedProps.setEnableFiltering(false);
          computedProps.hideColumnContextMenu();
        },
      });
    }
  }

  items.forEach(item => {
    const onClick = item.onClick;

    if (onClick && IS_MS_BROWSER) {
      item.onClick = () => {
        // in order to avoid the browser
        // triggering weird text selection
        // when you open the menu a second time
        // after clicking an item beforehand
        requestAnimationFrame(onClick);
      };
    }
  });

  let constrainToComputedProps = getTopComputedProps(computedProps);

  const menuProps = {
    updatePositionOnScroll: computedProps.updateMenuPositionOnScroll,
    maxHeight: constrainToComputedProps.initialProps
      .columnContextMenuConstrainTo
      ? null
      : computedProps.getMenuAvailableHeight(),

    nativeScroll: !IS_MS_BROWSER,
    autoFocus: true,
    enableSelection: true,
    defaultSelected: visibleMap,
    onDismiss: () => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return;
      }
      computedProps.hideColumnContextMenu();
    },
    onSelectionChange,
    style: {
      zIndex: 110000,
      position:
        computedProps.initialProps.columnContextMenuPosition || 'absolute',
    },
    items,
    theme: computedProps.theme,
    constrainTo: constrainToComputedProps.columnContextMenuInfoRef.current.getMenuConstrainTo(),
    alignPositions:
      computedProps.initialProps.columnContextMenuAlignPositions ||
      computedProps.rtl
        ? COLUMN_MENU_ALIGN_POSITIONS_RTL
        : COLUMN_MENU_ALIGN_POSITIONS,
    alignTo: computedProps.columnContextMenuInfoRef.current.menuAlignTo,
  };

  let result;

  if (computedProps.initialProps.renderColumnContextMenu) {
    result = computedProps.initialProps.renderColumnContextMenu(menuProps, {
      cellProps,
      grid: computedProps.publicAPI,
      computedProps,
      computedPropsRef,
    });
  }

  if (result === undefined) {
    result = <Menu {...menuProps} />;
  }

  if (computedProps.initialProps.renderGridMenu) {
    return computedProps.initialProps.renderGridMenu(result, computedProps);
  }
  return renderGridMenu(result, computedProps);
};
