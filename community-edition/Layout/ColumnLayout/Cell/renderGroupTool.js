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
const stopPropagation = (e) => e.stopPropagation();
export default ({ render, rtl, collapsed, toggleGroup, style, size, renderGroupCollapseTool, renderGroupExpandTool, }, cellProps) => {
    size = size || 18;
    style = style ? { ...DEFAULT_STYLE, ...style } : DEFAULT_STYLE;
    const domProps = {
        onMouseDown: toggleGroup,
        onClick: stopPropagation,
        style,
    };
    let result;
    if (render) {
        domProps.style = { ...domProps.style };
        result = render(domProps, {
            ...cellProps,
            collapsed,
            toggleGroup,
            size,
        });
        if (result != undefined) {
            return result;
        }
    }
    const renderCollapseTool = () => {
        let result;
        if (renderGroupCollapseTool) {
            result = renderGroupCollapseTool({ domProps, size, rtl });
        }
        if (result === undefined) {
            result = (React.createElement("svg", { ...domProps, height: size, viewBox: "0 0 24 24", width: size }, rtl ? (React.createElement("path", { d: "M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" })) : (React.createElement("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }))));
        }
        return result;
    };
    const renderExpandTool = () => {
        let result;
        if (renderGroupExpandTool) {
            result = renderGroupExpandTool({ domProps, size, rtl });
        }
        if (result === undefined) {
            result = (React.createElement("svg", { ...domProps, height: size, viewBox: "0 0 24 24", width: size },
                React.createElement("path", { d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" })));
        }
        return result;
    };
    if (collapsed) {
        return renderCollapseTool();
    }
    return renderExpandTool();
};
