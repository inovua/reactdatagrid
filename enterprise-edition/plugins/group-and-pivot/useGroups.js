/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import mapGroups from './mapGroups';
const getGroupsDepth = (groupsMap) => {
    if (!groupsMap) {
        return 0;
    }
    return Math.max(...Object.keys(groupsMap).map(groupName => {
        return groupsMap[groupName].computedDepth || 0;
    }));
};
const getPivotGroups = (uniqueValuesRoot, parentGroup, pivotSummaryGroups) => {
    const groups = [];
    const { field, values } = uniqueValuesRoot;
    if (field && values) {
        Object.keys(values).forEach(value => {
            const groupId = `${parentGroup ? parentGroup + '_' : ''}${field}:${value}`;
            const defaultGroup = pivotSummaryGroups[field];
            let group = {
                name: groupId,
                header: value,
            };
            if (defaultGroup) {
                if (typeof defaultGroup === 'function') {
                    group = {
                        ...defaultGroup({ ...group, field, values }),
                        ...group,
                    };
                }
                else {
                    group = {
                        ...defaultGroup,
                        ...group,
                    };
                }
            }
            if (parentGroup) {
                group.group = parentGroup;
            }
            groups.push(group);
            const nextRoot = values[value];
            groups.push(...getPivotGroups(nextRoot, groupId, pivotSummaryGroups));
        });
    }
    return groups;
};
const useGroups = (props, computedProps, computedPropsRef) => {
    const { computedPivotUniqueValuesPerColumn } = computedProps;
    let groups = props.groups;
    if (computedPivotUniqueValuesPerColumn &&
        computedPivotUniqueValuesPerColumn.values) {
        const pivotSummaryGroups = computedProps.pivot
            ? computedProps.pivot.reduce((acc, pivot) => {
                if (pivot && pivot.summaryGroup) {
                    acc[pivot.name] = pivot.summaryGroup;
                }
                return acc;
            }, {})
            : {};
        groups = getPivotGroups(computedPivotUniqueValuesPerColumn, undefined, pivotSummaryGroups);
    }
    const groupsMap = groups ? mapGroups(groups, props) : null;
    const computedGroupsDepth = getGroupsDepth(groupsMap);
    return {
        computedGroups: groups,
        computedGroupsMap: groupsMap,
        computedGroupsDepth,
    };
};
export default useGroups;
