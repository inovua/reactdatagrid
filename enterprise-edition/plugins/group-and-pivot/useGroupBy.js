/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import useProperty from '@inovua/reactdatagrid-community/hooks/useProperty';
import { useState } from 'react';
import computeData from '@inovua/reactdatagrid-community/hooks/useDataSource/computeData';
import batchUpdate from '@inovua/reactdatagrid-community/utils/batchUpdate';
import isControlledValue from '@inovua/reactdatagrid-community/utils/isControlledValue';
const keepValidGroupBy = (groupBy, columnsMap) => {
    if (groupBy && groupBy.length) {
        return groupBy
            .map((colId) => {
            if (!columnsMap) {
                return undefined;
            }
            const col = columnsMap[colId];
            if (!col) {
                return undefined;
            }
            return col.id || col.name;
        })
            .filter(x => !!x);
    }
    return groupBy;
};
const useGroupBy = (props, computedProps, computedPropsRef) => {
    const [computedGroupBy, initialSetGroupBy] = useProperty(props, 'groupBy');
    const [computedGroupRelatedInfo, setComputedGroupRelatedInfo] = useState({
        computedIndexesInGroups: {},
        computedGroupArray: [],
        computedGroupKeys: {},
    });
    const [computedCollapsedGroups, setCollapsedGroups] = useProperty(props, 'collapsedGroups', undefined, {
        onChange: (collapsedGroups, ...args) => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
                return;
            }
            if (computedProps.onGroupCollapseChange) {
                computedProps.onGroupCollapseChange(collapsedGroups, ...args);
            }
        },
    });
    const setGroupBy = (groupBy) => {
        if (groupBy && typeof groupBy === 'string') {
            groupBy = [groupBy];
        }
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        groupBy = keepValidGroupBy(groupBy, computedProps.columnsMap);
        if (isControlledValue(props.groupBy)) {
            initialSetGroupBy(groupBy);
            return;
        }
        const queue = batchUpdate();
        const data = computeData({
            groupBy,
        }, computedProps, queue);
        queue.commit(() => {
            if (data !== undefined) {
                computedProps.silentSetData(data);
            }
            initialSetGroupBy(groupBy);
        });
    };
    const isGroupCollapsed = (group) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return false;
        }
        const collapsedGroups = computedProps.computedCollapsedGroups;
        if (collapsedGroups === true) {
            return true;
        }
        const sep = computedProps.groupPathSeparator;
        return collapsedGroups[`${(group.keyPath || group.valuePath).join(sep)}`];
    };
    const expandGroup = (group) => {
        const path = typeof group == 'string' ? group : group.keyPath;
        if (isGroupCollapsed({ keyPath: path })) {
            onGroupToggle(path);
        }
    };
    const collapseGroup = (group) => {
        const path = typeof group == 'string' ? group : group.keyPath;
        if (!isGroupCollapsed({ keyPath: path })) {
            onGroupToggle(path);
        }
    };
    const onGroupToggle = (path) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const { groupPathSeparator: sep, computedCollapsedGroups, data, } = computedProps;
        let collapsedGroups;
        if (computedCollapsedGroups === true) {
            // we have to expand all
            collapsedGroups = data.reduce((acc, item) => {
                if (item.__group) {
                    acc[`${item.keyPath.join(sep)}`] = true;
                }
                return acc;
            }, {});
        }
        else {
            collapsedGroups = Object.assign({}, computedCollapsedGroups);
        }
        let collapsedInfo;
        let expandedInfo;
        const stringPath = path.join(sep);
        if (collapsedGroups[stringPath]) {
            delete collapsedGroups[stringPath];
            expandedInfo = path;
        }
        else {
            collapsedInfo = stringPath;
            collapsedGroups[stringPath] = true;
        }
        computedProps.setCollapsedGroups(collapsedGroups, {
            collapsedGroups: collapsedInfo,
            expandedGroups: expandedInfo,
        });
    };
    const toggleGroup = (group) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (group && group.keyPath) {
            if (computedProps.computedPivot &&
                computedProps.computedGroupBy &&
                group.depth === computedProps.computedGroupBy.length) {
                // group cannot be toggled
                return;
            }
            onGroupToggle(group.keyPath);
        }
    };
    const addGroupByColumn = (column) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const computedColumn = computedProps.getColumnBy(column);
        if (!computedColumn) {
            return;
        }
        let groupBy = computedProps.computedGroupBy;
        if (!Array.isArray(groupBy)) {
            groupBy = [];
        }
        if (computedColumn.name && groupBy.indexOf(computedColumn.name) == -1) {
            setGroupBy([...groupBy, computedColumn.name]);
        }
    };
    const removeGroupByColumn = (column) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const computedColumn = computedProps.getColumnBy(column);
        let groupBy = computedProps.computedGroupBy;
        if (!Array.isArray(groupBy)) {
            return;
        }
        if (groupBy.indexOf(computedColumn.id) != -1) {
            setGroupBy(groupBy.filter(g => g != computedColumn.id));
        }
    };
    const collapseAllGroups = () => {
        setCollapsedGroups(true, {
            collapsedGroups: true,
            collapseAllGroups: true,
        });
    };
    const expandAllGroups = () => {
        setCollapsedGroups({}, {
            collapsedGroups: true,
            expandAllGroups: true,
        });
    };
    return {
        computedGroupBy,
        onGroupToggle,
        toggleGroup,
        setGroupBy,
        removeGroupByColumn,
        addGroupByColumn,
        isGroupCollapsed,
        expandGroup,
        collapseGroup,
        setCollapsedGroups,
        computedCollapsedGroups,
        onGroupByChange: setGroupBy,
        setComputedGroupRelatedInfo,
        collapseAllGroups,
        expandAllGroups,
        ...computedGroupRelatedInfo,
    };
};
export default useGroupBy;
