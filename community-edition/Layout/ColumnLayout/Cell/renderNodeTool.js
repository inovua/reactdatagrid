/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const DEFAULT_STYLE = {
  position: 'relative',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

// stop propagation in order not to trigger row active index change
const stopPropagation = e => e.stopPropagation();

export default (
  {
    render,
    nodeLoading,
    nodeCollapsed,
    leafNode,
    rtl,
    node,
    nodeProps,
    toggleNodeExpand,
    style,
    size,
  },
  cellProps
) => {
  size = size || 18;
  if (!leafNode) {
    style = style ? { ...DEFAULT_STYLE, ...style } : DEFAULT_STYLE;
  }

  const domProps = {
    onMouseDown: leafNode ? null : toggleNodeExpand,
    onClick: leafNode ? null : stopPropagation,
    style,
  };

  let result;

  if (render) {
    domProps.style = { ...domProps.style };
    result = render(domProps, {
      ...cellProps,
      leafNode,
      nodeCollapsed,
      node,
      nodeLoading,
      nodeProps,
      toggleNodeExpand,
      size,
    });
    if (result != undefined) {
      return result;
    }
  }

  if (leafNode) {
    return (
      <div
        {...domProps}
        style={{ ...domProps.style, width: size, height: size }}
      />
    );
  }

  if (nodeLoading) {
    return (
      <svg
        {...domProps}
        className={`${domProps.className ||
          ''} InovuaReactDataGrid__cell__node-tool--loading`}
        height={size}
        width={size}
        viewBox="0 0 24 24"
      >
        <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
      </svg>
    );
  }

  if (nodeCollapsed) {
    return (
      <svg {...domProps} height={size} viewBox="0 0 24 24" width={size}>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    );
  }

  return (
    <svg {...domProps} height={size} viewBox="0 0 24 24" width={size}>
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
  );
};
