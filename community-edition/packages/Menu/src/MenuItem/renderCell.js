/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import assign from '../../../../common/assign';
import join from '../../../../common/join';
import MenuItemCell from './MenuItemCell';

/**
 *  About style - style can come from several places, they overwrite each
 *  other in the folowing order:
 *  - cellStyle that comes from Menu props (globalCellStyle)
 *  - cellStyle from column
 *  - cellStyle that comes from
 **/
export default (props, column, index, columns) => {
  const { hasSubmenu, rootClassName } = props;
  let { globalCellStyle } = props;
  const item = props.items && props.items[index];

  if (typeof globalCellStyle == 'function') {
    globalCellStyle = globalCellStyle({
      index,
      columns,
      items: props.items,
      item,
      hasSubmenu,
    });
  }

  const style = assign({}, globalCellStyle);
  const isLast = index === columns.length - 1;
  const cellProps = assign({}, props.cellProps);

  /**
   * no need to check if it is expander as expander is rendered
   * in prepareChildren
   */
  if (isLast && props.siblingItemHasSubMenu && !props.item.items) {
    // cellProps.colSpan = 2
  }

  let children;

  if (column && typeof column.render == 'function') {
    children = column.render(props.item, {
      column,
      columns,
      index,
      items: props.items,
      item,
      hasSubmenu,
    });
  } else {
    const columnName = typeof column == 'string' ? column : column.name;
    children = props.item[columnName];
  }

  if (typeof column === 'object') {
    if (column.colSpan) {
      cellProps.colSpan = column.colSpan;
    }
  }

  if (column.style) {
    let columnStyle;

    if (typeof column.style === 'function') {
      columnStyle = column.style({
        index,
        columns,
        items: props.items,
        item,
        hasSubmenu,
      });
    } else {
      columnStyle = column.style;
    }

    assign(style, columnStyle);
  }

  let className = column.className;

  if (item) {
    if (item.cellStyle) {
      assign(style, item.cellStyle);
    }
    if (item.className) {
      className = join(className, item.cellClassName);
    }
  }

  if (props.style) {
    assign(style, props.style);
  }

  return (
    <MenuItemCell
      style={style}
      className={className}
      key={index}
      rootClassName={rootClassName}
      cellProps={cellProps}
      isDescription={column.isDescription}
      isIcon={column.isIcon}
      align={column.align}
    >
      {children}
    </MenuItemCell>
  );
};
