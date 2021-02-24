/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useState, useRef, useCallback, } from 'react';
import { IS_IE } from '../../../detect-ua';
import Region from '../../../packages/region';
export { default as renderColumnContextMenu } from './renderColumnContextMenu';
export { default as renderRowContextMenu } from './renderRowContextMenu';
export default (props, computedProps, computedPropsRef) => {
    const [columnContextMenuProps, setColumnContextMenuProps] = useState(null);
    const [rowContextMenuProps, setRowContextMenuProps] = useState(null);
    const getConstrainRegion = (computedProps) => {
        if (!computedProps.parentComputedProps) {
            return document.documentElement;
        }
        let node = computedProps.getDOMNode();
        node = node
            ? node.querySelector('.InovuaReactDataGrid__virtual-list') || node
            : node;
        return node;
    };
    const getColumnMenuConstrainTo = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        return (computedProps.initialProps.columnContextMenuConstrainTo ||
            getConstrainRegion(computedProps));
    }, []);
    const getRowMenuConstrainTo = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        return (computedProps.initialProps.rowContextMenuConstrainTo ||
            getConstrainRegion(computedProps));
    }, []);
    const preventIEMenuCloseRef = useRef(false);
    const columnContextMenuInfoRef = useRef({
        menuAlignTo: null,
        getMenuConstrainTo: getColumnMenuConstrainTo,
        menuOnHide: () => { },
    });
    const rowContextMenuInfoRef = useRef({
        menuAlignTo: null,
        getMenuConstrainTo: getRowMenuConstrainTo,
        menuOnHide: () => { },
    });
    const hideColumnContextMenu = useCallback(() => {
        if (IS_IE && preventIEMenuCloseRef.current) {
            return;
        }
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (computedProps.columnContextMenuProps) {
            const columnContextMenuOnHide = columnContextMenuInfoRef.current.menuOnHide;
            if (typeof columnContextMenuOnHide == 'function') {
                columnContextMenuOnHide();
            }
            computedProps.setColumnContextMenuProps(null);
        }
    }, []);
    const hideRowContextMenu = useCallback(() => {
        if (IS_IE && preventIEMenuCloseRef.current) {
            return;
        }
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (computedProps.rowContextMenuProps) {
            const rowContextMenuOnHide = rowContextMenuInfoRef.current.menuOnHide;
            if (typeof rowContextMenuOnHide == 'function') {
                rowContextMenuOnHide();
            }
            computedProps.setRowContextMenuProps(null);
        }
    }, []);
    const showColumnContextMenu = useCallback((alignTo, cellProps, cellInstance, onHide) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (computedProps.columnContextMenuProps) {
            computedProps.hideColumnContextMenu();
            return;
        }
        columnContextMenuInfoRef.current = {
            menuAlignTo: alignTo,
            getMenuConstrainTo: getColumnMenuConstrainTo,
            menuOnHide: onHide,
        };
        if (computedProps.hideColumnFilterContextMenu) {
            computedProps.hideColumnFilterContextMenu();
        }
        computedProps.setColumnContextMenuProps(cellProps);
    }, []);
    const getMenuAvailableHeight = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return 0;
        }
        let filtersHeight = 0;
        if (computedProps.computedIsFilterable) {
            const filterNode = computedProps
                .getDOMNode()
                .querySelector('.InovuaReactDataGrid__column-header__filter-wrapper');
            if (filterNode) {
                filtersHeight = filterNode.offsetHeight;
            }
        }
        const size = computedProps.initialProps.parentComputedProps
            ? computedProps.initialProps.parentComputedProps.size
            : computedProps.size;
        const result = size ? size.height - 5 + filtersHeight : 0;
        return result;
    }, []);
    const onRowContextMenu = useCallback((rowProps, event) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const initialProps = computedProps.initialProps;
        if (initialProps.onRowContextMenu) {
            initialProps.onRowContextMenu(rowProps, event);
        }
        if (!initialProps.renderRowContextMenu) {
            return;
        }
        event.preventDefault();
        const cellProps = event.nativeEvent
            ? event.nativeEvent.__cellProps
            : undefined;
        const alignTo = Region.from(event);
        alignTo.shift({
            top: -global.scrollY,
            left: -global.scrollX,
        });
        showRowContextMenu(alignTo, rowProps, cellProps, () => { });
    }, []);
    const showRowContextMenu = useCallback((alignTo, rowProps, cellProps, onHide) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (computedProps.rowContextMenuProps) {
            computedProps.hideRowContextMenu();
            return;
        }
        rowContextMenuInfoRef.current = {
            menuAlignTo: alignTo,
            getMenuConstrainTo: getRowMenuConstrainTo,
            cellProps,
            menuOnHide: onHide,
        };
        if (computedProps.hideRowFilterContextMenu) {
            computedProps.hideRowFilterContextMenu();
        }
        computedProps.setRowContextMenuProps(rowProps);
    }, []);
    return {
        onRowContextMenu,
        getMenuAvailableHeight,
        showRowContextMenu,
        showColumnContextMenu,
        hideColumnContextMenu,
        hideRowContextMenu,
        columnContextMenuProps,
        rowContextMenuProps,
        columnContextMenuInfoRef,
        rowContextMenuInfoRef,
        setColumnContextMenuProps,
        setRowContextMenuProps,
        preventIEMenuCloseRef,
    };
};
