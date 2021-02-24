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

import Menu from '../../../packages/Menu';

import renderGridMenu from '../../../renderGridMenu';

const ROW_MENU_ALIGN_POSITIONS = [
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

const ROW_MENU_ALIGN_POSITIONS_RTL = [
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
  const rowProps = computedProps.rowContextMenuProps;
  if (!rowProps) {
    return null;
  }

  const rowContextMenuInfo = computedProps.rowContextMenuInfoRef;

  if (!rowProps || !rowContextMenuInfo.current) {
    return null;
  }

  const cellProps = rowContextMenuInfo.current.cellProps;

  let constrainToComputedProps = getTopComputedProps(computedProps);
  const items: any[] = [];

  const menuProps = {
    updatePositionOnScroll: computedProps.updateMenuPositionOnScroll,
    maxHeight: constrainToComputedProps.initialProps
      .columnContextMenuConstrainTo
      ? null
      : computedProps.getMenuAvailableHeight(),

    autoFocus: true,
    theme: computedProps.theme,
    onDismiss: computedProps.hideRowContextMenu,
    nativeScroll: !IS_MS_BROWSER,
    style: {
      zIndex: 110000,
      position: computedProps.initialProps.rowContextMenuPosition || 'absolute',
    },
    items,
    constrainTo: constrainToComputedProps.columnContextMenuInfoRef.current.getMenuConstrainTo(),
    alignPositions:
      computedProps.initialProps.rowContextMenuAlignPositions ||
      computedProps.rtl
        ? ROW_MENU_ALIGN_POSITIONS_RTL
        : ROW_MENU_ALIGN_POSITIONS,
    alignTo: computedProps.rowContextMenuInfoRef.current.menuAlignTo,
  };

  let result;

  if (computedProps.initialProps.renderRowContextMenu) {
    result = computedProps.initialProps.renderRowContextMenu(menuProps, {
      rowProps,
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
