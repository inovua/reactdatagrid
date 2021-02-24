/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeComputedProps } from '../types';
import join from '../packages/join';

const prepareClassName = (computedProps: TypeComputedProps) => {
  const {
    visibleColumns,
    computedShowCellBorders,
    computedShowZebraRows,
    theme,
    rtl,
    viewportAvailableWidth,
    totalComputedWidth,
    computedFocused,
    computedShowHoverRows,
    nativeScroll,
    focusedClassName,
    computedFilterable,
    computedShowHeaderBorderRight,
    virtualizeColumns,
    className,
  } = computedProps;

  return join(
    'InovuaReactDataGrid',
    className,
    theme && `InovuaReactDataGrid--theme-${theme}`,
    virtualizeColumns && 'InovuaReactDataGrid--virtualize-columns',
    nativeScroll && 'InovuaReactDataGrid--native-scroll',
    visibleColumns.length && 'InovuaReactDataGrid--columns-ready',
    computedShowZebraRows && 'InovuaReactDataGrid--zebra-rows',
    computedFilterable && 'InovuaReactDataGrid--filterable',
    computedFocused && 'InovuaReactDataGrid--focused',
    computedShowHoverRows && 'InovuaReactDataGrid--show-hover-rows',
    rtl
      ? 'InovuaReactDataGrid--direction-rtl'
      : 'InovuaReactDataGrid--direction-ltr',
    computedFocused && focusedClassName,
    computedShowHeaderBorderRight
      ? 'InovuaReactDataGrid--show-header-border-right'
      : 'InovuaReactDataGrid--no-header-border-right',
    viewportAvailableWidth > totalComputedWidth &&
      'InovuaReactDataGrid--show-border-right',
    computedShowCellBorders &&
      (computedShowCellBorders === true
        ? 'InovuaReactDataGrid--cell-borders-horizontal InovuaReactDataGrid--cell-borders-vertical'
        : `InovuaReactDataGrid--cell-borders-${computedShowCellBorders}`)
  );
};

export default prepareClassName;
