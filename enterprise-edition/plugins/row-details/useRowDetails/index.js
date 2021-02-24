/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useLayoutEffect, useRef, useCallback } from 'react';
import useProperty from '@inovua/reactdatagrid-community/hooks/useProperty';
import sealedObjectFactory from '@inovua/reactdatagrid-community/utils/sealedObjectFactory';
import batchUpdate from '@inovua/reactdatagrid-community/utils/batchUpdate';
import isControlledProperty from '@inovua/reactdatagrid-community/utils/isControlledProperty';
import renderDetailsGrid_FromProps from './renderDetailsGrid';
import { isRowExpandEnabled_FromProps } from '@inovua/reactdatagrid-community/utils/isRowExpandEnabled_FromProps';
const EXPANDABLE_ROW_INFO = sealedObjectFactory({
    rowIndex: undefined,
    data: undefined,
    id: undefined,
});
const getRowHeights_FromProps = (computedProps) => {
    return computedProps.computedRowHeights || {};
};
const setRowHeightById_FromProps = (rowHeight, id, computedProps) => {
    const rowHeights = {
        ...getRowHeights_FromProps(computedProps),
    };
    let changed = false;
    if (rowHeight != null) {
        if (rowHeights[id] !== rowHeight) {
            rowHeights[id] = rowHeight;
            changed = true;
        }
    }
    else {
        if (rowHeights[id]) {
            delete rowHeights[id];
            changed = true;
        }
    }
    if (changed) {
        computedProps.setRowHeights(rowHeights);
    }
};
const updateExpandedHeights_FromProps = (computedProps, rowHeights) => {
    const { rowExpandHeight } = computedProps;
    const expandedRows = getExpandedMap_FromProps(computedProps);
    const defaultRowHeight = computedProps.rowHeight;
    const heights = {};
    const { dataIndexMap } = computedProps;
    if (dataIndexMap) {
        for (let itemId in expandedRows) {
            const index = dataIndexMap[itemId];
            if (index !== undefined) {
                heights[index] = rowExpandHeight;
            }
        }
    }
    rowHeights = rowHeights || getRowHeights_FromProps(computedProps);
    if (rowHeights && dataIndexMap) {
        for (let itemId in rowHeights) {
            const index = dataIndexMap[itemId];
            if (index !== undefined) {
                heights[index] = rowHeights[itemId];
            }
        }
    }
    if (computedProps.initialProps.onUpdateRowHeights) {
        computedProps.initialProps.onUpdateRowHeights(heights, computedProps);
    }
    computedProps.rowHeightManager.setValues({
        defaultRowHeight,
        map: heights,
    });
};
const setExpandedMap_FromProps = (expandedMap, collapsedMap, { id, data, expanded, } = {
    id: null,
    data: null,
    expanded: false,
}, computedProps) => {
    let index;
    if (expandedMap === true && !computedProps.multiRowExpand) {
        throw new Error('cannot expand all when multiRowExpand is false');
    }
    if (data) {
        index = computedProps.dataIndexMap[id];
        if (!expanded) {
            let rowHeights = computedProps.computedRowHeights;
            if (rowHeights && rowHeights[id]) {
                rowHeights = { ...rowHeights };
                delete rowHeights[id];
                computedProps.setRowHeights(rowHeights);
            }
            if (computedProps.initialProps.onRowCollapse &&
                computedProps.initialProps.onRowCollapse({ data, id, index }) === false) {
                return;
            }
        }
        else {
            if (!computedProps.isRowExpandableAt(index)) {
                return;
            }
            if (computedProps.initialProps.onRowExpand &&
                computedProps.initialProps.onRowExpand({ data, id, index }) === false) {
                return;
            }
            if (!computedProps.multiRowExpand) {
                expandedMap = { [id]: true };
            }
        }
        if (computedProps.initialProps.onRowExpandChange &&
            computedProps.initialProps.onRowExpandChange({
                expandedRows: expandedMap,
                collapsedRows: collapsedMap,
                id,
                index,
                data,
                rowExpanded: expanded,
            }) === false) {
            return;
        }
    }
    if (computedProps.initialProps.onExpandedRowsChange) {
        computedProps.initialProps.onExpandedRowsChange({
            expandedRows: expandedMap,
            collapsedRows: collapsedMap,
            rowExpanded: expanded,
            data,
            id,
            index,
        });
    }
    if ((!isControlledProperty(computedProps.initialProps, 'expandedRows') &&
        !isControlledProperty(computedProps.initialProps, 'collapsedRows')) ||
        (computedProps.initialProps.expandedRows === true &&
            !isControlledProperty(computedProps.initialProps, 'collapsedRows'))) {
        const queue = batchUpdate();
        queue(() => {
            computedProps.setExpandedRows(expandedMap);
            computedProps.setCollapsedRows(collapsedMap);
        });
        queue.commit();
    }
};
const isRowExpandableAt_FromProps = (rowIndex, computedProps) => {
    const data = computedProps.getItemAt(rowIndex);
    if (!data) {
        return false;
    }
    if (data.__group) {
        return false;
    }
    const id = computedProps.getItemId(data);
    if (computedProps.unexpandableRows && computedProps.unexpandableRows[id]) {
        return false;
    }
    if (!computedProps.isRowExpandable) {
        return true;
    }
    EXPANDABLE_ROW_INFO.id = id;
    EXPANDABLE_ROW_INFO.data = data;
    EXPANDABLE_ROW_INFO.rowIndex = rowIndex;
    return computedProps.isRowExpandable(EXPANDABLE_ROW_INFO);
};
const getExpandedMap_FromProps = (computedProps) => {
    if (!isRowExpandEnabled_FromProps(computedProps)) {
        return undefined;
    }
    let expandedRows = computedProps.computedExpandedRows;
    if (expandedRows !== undefined && expandedRows !== true) {
        expandedRows = { ...expandedRows };
        Object.keys(getUnexpandableRowsMap_FromProps(computedProps)).forEach((k) => {
            delete expandedRows[k];
        });
    }
    if (expandedRows === true) {
        expandedRows = computedProps.data.reduce((acc, item, index) => {
            if (computedProps.isRowExpanded(index)) {
                acc[computedProps.getItemId(item)] = true;
            }
            return acc;
        }, {});
    }
    if (typeof expandedRows !== 'object' && expandedRows !== true) {
        expandedRows = {};
    }
    return expandedRows;
};
const getUnexpandableRows_FromProps = (computedProps) => {
    const groupBy = computedProps.computedGroupBy;
    const initialProps = computedProps.initialProps;
    if (!groupBy && !initialProps.isRowExpandable) {
        return [];
    }
    if (groupBy && !initialProps.isRowExpandable) {
        return computedProps.computedGroupArray || [];
    }
    return computedProps.data.filter((_, index) => !isRowExpandableAt_FromProps(index, computedProps));
};
const getUnexpandableRowsMap_FromProps = (computedProps) => {
    if (computedProps.unexpandableRows) {
        return computedProps.unexpandableRows;
    }
    return getUnexpandableRows_FromProps(computedProps).reduce((acc, data) => {
        const id = computedProps.getItemId(data);
        acc[id] = true;
        return acc;
    }, {});
};
const getCollapsedMap_FromProps = (computedProps) => {
    if (!computedProps.computedRowExpandEnabled) {
        return undefined;
    }
    if (!computedProps.multiRowExpand) {
        return undefined;
    }
    let result = computedProps.computedCollapsedRows || {};
    if (computedProps.computedGroupBy && computedProps.computedGroupKeys) {
        result = { ...result, ...computedProps.computedGroupKeys };
    }
    if (computedProps.unexpandableRows) {
        result = { ...result, ...computedProps.unexpandableRows };
    }
    if (computedProps.initialProps.isRowExpandable) {
        result = { ...result };
        computedProps.data.forEach((item, index) => {
            if (!computedProps.isRowExpandableAt(index)) {
                result[computedProps.getItemId(item)] = true;
            }
        });
    }
    return result;
};
const isRowExpandedById_FromProps = (id, computedProps) => {
    const expandedRows = computedProps.computedExpandedRows;
    if (!expandedRows) {
        return false;
    }
    let isExpanded;
    if (expandedRows === true) {
        const collapsedRows = getCollapsedMap_FromProps(computedProps) || {};
        isExpanded = !collapsedRows[id];
    }
    else {
        isExpanded = !!expandedRows[id];
    }
    if (isExpanded) {
        isExpanded = computedProps.isRowExpanded(computedProps.getRowIndexById(id));
    }
    return isExpanded;
};
const isRowExpanded_FromProps = (data, computedProps) => {
    if (data == null) {
        return false;
    }
    let index = undefined;
    if (typeof data == 'number') {
        index = data;
        data = computedProps.getItemAt(data);
    }
    const expandedRows = computedProps.computedExpandedRows;
    const id = computedProps.getItemId(data);
    if (!expandedRows) {
        return false;
    }
    let isExpanded;
    if (expandedRows === true) {
        const collapsedMap = getCollapsedMap_FromProps(computedProps) || {};
        isExpanded = !collapsedMap[id];
    }
    else {
        isExpanded = expandedRows ? !!expandedRows[id] : false;
    }
    if (isExpanded) {
        if (index === undefined) {
            index = computedProps.getRowIndexById(id);
        }
        isExpanded = computedProps.isRowExpandableAt(index);
    }
    return isExpanded;
};
const setRowExpandedById_FromProps = (id, expanded, computedProps) => {
    const data = computedProps.dataMap[id];
    if (!data) {
        return;
    }
    const expandedRowsValue = computedProps.computedExpandedRows;
    if (expandedRowsValue === true) {
        const collapsedMap = { ...(computedProps.getCollapsedMap() || {}) };
        if (!expanded) {
            collapsedMap[id] = true;
        }
        else {
            delete collapsedMap[id];
        }
        setExpandedMap_FromProps(true, collapsedMap, { data, expanded, id }, computedProps);
        return;
    }
    const expandedMap = {
        ...computedProps.getExpandedMap(),
    };
    if (!expanded) {
        delete expandedMap[id];
    }
    else {
        expandedMap[id] = true;
    }
    setExpandedMap_FromProps(expandedMap, undefined, { data, expanded, id }, computedProps);
};
const useRowDetails = (props, computedProps, computedPropsRef) => {
    const [expandedRows, setExpandedRows] = useProperty(props, 'expandedRows');
    const [collapsedRows, setCollapsedRows] = useProperty(props, 'collapsedRows');
    const [rowHeights, doSetRowHeights] = useProperty(props, 'rowHeights');
    const setRowHeights = useCallback((rowHeights) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        doSetRowHeights(rowHeights);
    }, []);
    const isRowExpandEnabled = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return false;
        }
        return isRowExpandEnabled_FromProps(computedProps);
    }, []);
    const isRowExpandableAt = useCallback((rowIndex) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return false;
        }
        return isRowExpandableAt_FromProps(rowIndex, computedProps);
    }, []);
    const isRowExpandableById = useCallback((rowId) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return false;
        }
        const index = computedProps.getRowIndexById(rowId);
        return isRowExpandableAt(index);
    }, []);
    const isRowExpanded = useCallback((data) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return false;
        }
        return isRowExpanded_FromProps(data, computedProps);
    }, []);
    const getCollapsedMap = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return undefined;
        }
        return getCollapsedMap_FromProps(computedProps);
    }, []);
    const getExpandedMap = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return undefined;
        }
        return getExpandedMap_FromProps(computedProps);
    }, []);
    const setRowExpandedById = useCallback((id, expanded) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        setRowExpandedById_FromProps(id, expanded, computedProps);
    }, []);
    const toggleRowExpandById = useCallback((id) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        setRowExpandedById_FromProps(id, !isRowExpandedById(id), computedProps);
    }, []);
    const setRowExpandedAt = useCallback((index, expanded) => {
        const data = computedProps.getItemAt(index);
        if (!data) {
            return;
        }
        const id = computedProps.getItemId(data);
        return setRowExpandedById(id, expanded);
    }, []);
    const setRowHeightById = useCallback((rowHeight, id) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        setRowHeightById_FromProps(rowHeight, id, computedProps);
    }, []);
    const toggleRowExpand = useCallback((dataOrIndex) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const data = typeof dataOrIndex === 'number'
            ? computedProps.data[dataOrIndex]
            : dataOrIndex;
        if (!data) {
            return;
        }
        const id = computedProps.getItemId(data);
        const expanded = isRowExpanded(data);
        return setRowExpandedById(id, !expanded);
    }, []);
    const isRowExpandedById = useCallback((id) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return false;
        }
        return isRowExpandedById_FromProps(id, computedProps);
    }, []);
    const computedCollapsedRows = collapsedRows;
    const computedExpandedRows = expandedRows;
    const computedRowExpandEnabled = isRowExpandEnabled_FromProps(props);
    useLayoutEffect(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (computedProps.wasMountedRef.current === false) {
            return;
        }
        updateExpandedHeights_FromProps(computedProps);
    }, [
        props.rowHeight,
        props.rowExpandHeight,
        computedProps.dataIndexMap,
        rowHeights,
        computedExpandedRows,
        computedCollapsedRows,
        computedRowExpandEnabled,
    ]);
    const detailsGridInfoRef = useRef({});
    let renderDetailsGrid = useCallback((rowDetailsInfo) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        return renderDetailsGrid_FromProps(rowDetailsInfo, computedProps);
    }, []);
    const onDetailsDidMount = useCallback((childGridComputedPropsRef) => {
        const { current: childGridComputedProps } = childGridComputedPropsRef;
        if (!childGridComputedProps) {
            return;
        }
        childGridComputedProps.detailsGridInfoRef.current.__detailsPersisted = false;
        const rowDetailsInfo = childGridComputedProps.initialProps.__parentRowInfo;
        const info = detailsGridInfoRef.current;
        if (info.masterDetailsKeys &&
            info.unmountedDetails &&
            info.masterDetailsInstances) {
            const cacheKey = info.masterDetailsKeys[rowDetailsInfo.id];
            info.masterDetailsInstances[cacheKey] = childGridComputedProps;
            delete info.unmountedDetails[cacheKey];
        }
    }, []);
    const getSelfRestoreProperties = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return null;
        }
        const { current: info } = computedProps.detailsGridInfoRef;
        return {
            rowHeightManager: computedProps.rowHeightManager,
            masterDetailsCache: info.masterDetailsCache,
            masterDetailsKeys: info.masterDetailsKeys,
            originalDetailsGrids: info.originalDetailsGrids,
            unmountedDetails: info.unmountedDetails,
        };
    }, []);
    const persistUnmountedDetails = () => {
        const { current: info } = detailsGridInfoRef;
        if (info.masterDetailsInstances) {
            Object.keys(info.masterDetailsInstances).forEach(cacheKey => {
                const childGridComputedProps = info.masterDetailsInstances[cacheKey];
                if (childGridComputedProps) {
                    onDetailsWillUnmount({ current: childGridComputedProps });
                }
            });
        }
    };
    const onDetailsWillUnmount = useCallback((childGridComputedPropsRef) => {
        const { current: childGridComputedProps } = childGridComputedPropsRef;
        if (childGridComputedProps.detailsGridInfoRef.current.__detailsPersisted) {
            return;
        }
        const rowDetailsInfo = childGridComputedProps.initialProps.__parentRowInfo;
        childGridComputedProps.persistUnmountedDetails();
        const info = detailsGridInfoRef.current;
        if (info.masterDetailsKeys && info.unmountedDetails) {
            const cacheKey = info.masterDetailsKeys[rowDetailsInfo.id];
            info.unmountedDetails[cacheKey] = {
                state: childGridComputedProps.getState(),
                scrollTop: childGridComputedProps.getScrollTop(),
                scrollLeft: childGridComputedProps.getScrollLeft(),
                self: childGridComputedProps.getSelfRestoreProperties(),
            };
        }
        childGridComputedProps.detailsGridInfoRef.current.__detailsPersisted = true;
    }, []);
    const onDetailsUpdateRowHeights = useCallback((rowHeights, childComputedProps) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const getExtraRowHeights = (childComputedProps) => {
            const { rowHeight } = childComputedProps.initialProps;
            const substractRowHeight = rowHeight;
            const result = Object.keys(rowHeights || {}).reduce((acc, rowId) => {
                return acc + rowHeights[rowId] - substractRowHeight;
            }, 0);
            return result;
        };
        const { __parentRowInfo: parentRowInfo, } = childComputedProps.initialProps;
        const extraHeight = getExtraRowHeights(childComputedProps);
        if (extraHeight) {
            setRowHeightById(computedProps.initialProps.rowExpandHeight + extraHeight, parentRowInfo.id);
        }
        else {
            setRowHeightById(null, parentRowInfo.id);
        }
    }, []);
    const getRowHeightById = useCallback((id) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return 0;
        }
        const rowHeights = getRowHeights_FromProps(computedProps);
        return rowHeights[id] || computedProps.rowHeight;
    }, []);
    const collapseAllRows = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        setExpandedMap_FromProps({}, undefined, undefined, computedProps);
    }, []);
    const expandAllRows = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        setExpandedMap_FromProps(true, getUnexpandableRowsMap_FromProps(computedProps), undefined, computedProps);
    }, []);
    const computedRenderRowDetails = props.renderRowDetails ||
        (props.renderDetailsGrid ? renderDetailsGrid : null);
    return {
        detailsGridInfoRef,
        setExpandedRows,
        setCollapsedRows,
        getCollapsedMap,
        getExpandedMap,
        setRowHeights,
        isRowExpanded,
        isRowExpandableById,
        setRowExpandedById,
        setRowHeightById,
        setRowExpandedAt,
        getRowHeightById,
        collapseAllRows,
        expandAllRows,
        isRowExpandedById,
        isRowExpandEnabled,
        isRowExpandableAt,
        toggleRowExpand,
        toggleRowExpandById,
        computedRowHeights: rowHeights,
        computedExpandedRows,
        computedCollapsedRows,
        computedRowExpandEnabled,
        computedRenderRowDetails,
        onDetailsUpdateRowHeights,
        onDetailsDidMount,
        onDetailsWillUnmount,
        getSelfRestoreProperties,
        persistUnmountedDetails,
    };
};
export default useRowDetails;
