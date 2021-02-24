/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import isMobile from '@inovua/reactdatagrid-community/packages/isMobile';
import { useRef } from 'react';
import { RowResizeIndicator } from './defaultRowIndexColumn';
import { id as rowIndexColumnId } from '@inovua/reactdatagrid-community/normalizeColumns/defaultRowIndexColumnId';
import React from 'react';
import maybeAddRowIndexColumn from './maybeAddRowIndexColumn';
const emptyRowResizeHandle = {
    setOffset: () => { },
    setActive: () => { },
    setConstrained: () => { },
    setInitialWidth: () => { },
    setHovered: () => { },
};
export default {
    name: 'row-index-column',
    maybeAddColumns: maybeAddRowIndexColumn,
    hook: (props, computedProps) => {
        computedProps.rowResizeHandleRef = useRef(emptyRowResizeHandle);
    },
    defaultProps: () => {
        return {
            rowResizeHandleWidth: isMobile ? 15 : 5,
        };
    },
    renderRowResizeIndicator(computedProps) {
        const rowResizeHandle = React.useCallback(({ setOffset, setActive, setConstrained, setHovered, setInitialWidth, }) => {
            computedProps.rowResizeHandleRef.current = {
                setOffset,
                setActive,
                setConstrained,
                setHovered,
                setInitialWidth,
            };
        }, []);
        return computedProps.rowIndexColumn ? (React.createElement(RowResizeIndicator, { column: computedProps.columnsMap[rowIndexColumnId], handle: rowResizeHandle, height: computedProps.rowResizeHandleWidth })) : null;
    },
};
