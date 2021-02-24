/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const emptyObject = Object.freeze ? Object.freeze({}) : {};
export const createGroupItem = (group, pivot) => {
    pivot = [];
    return {
        __group: true,
        leaf: group.leaf,
        data: group.data,
        array: group.array,
        value: group.value,
        name: group.name,
        groupSummary: group.groupSummary,
        groupColumnSummaries: group.groupColumnSummaries,
        groupCount: group.groupCount,
        itemCount: group.itemCount,
        parentGroupCount: group.parentGroupCount,
        indexInGroup: group.indexInGroup,
        childrenCount: group.childrenCount,
        totalCount: group.totalCount,
        depth: pivot && pivot.length ? group.depth - pivot.length : group.depth,
        namePath: pivot && pivot.length
            ? group.namePath.slice(pivot.length)
            : group.namePath,
        valuePath: pivot && pivot.length
            ? group.valuePath.slice(pivot.length)
            : group.valuePath,
    };
};
const returnFalse = () => false;
const normalizeGroupSummary = (showGroupSummaryRow, groupData) => {
    if (!showGroupSummaryRow) {
        return false;
    }
    if (typeof showGroupSummaryRow === 'function') {
        showGroupSummaryRow = showGroupSummaryRow(groupData);
    }
    if (showGroupSummaryRow === true) {
        showGroupSummaryRow = 'end';
    }
    if (!showGroupSummaryRow) {
        showGroupSummaryRow = false;
    }
    return showGroupSummaryRow;
};
const flattenGroupData = (groupData, config, indexesInGroup = [], groupArray = [], groupCounts = [], pivotUniqueValuesMap = {}, pivotSummaryValue, currentPivotPath) => {
    const keys = groupData.keys;
    if (config.pivot && config.pivot.length) {
        pivotSummaryValue = pivotSummaryValue || {};
        currentPivotPath = currentPivotPath || [];
    }
    if (config.pivot && !Object.keys(pivotUniqueValuesMap).length) {
        config.pivot.forEach(key => {
            pivotUniqueValuesMap[key] = {};
        });
    }
    const { groupItemFactory = createGroupItem, isCollapsed = returnFalse, } = config;
    const result = [];
    let groupItem;
    keys.forEach((key) => {
        const newRoot = groupData.data[key];
        if (currentPivotPath) {
            currentPivotPath.push(key);
            pivotSummaryValue[key] = pivotSummaryValue[key] || {
                data: {},
                key,
                value: newRoot.groupColumnSummaries,
            };
        }
        const shouldInclude = !config.pivot ? true : true;
        if (shouldInclude && isCollapsed(newRoot)) {
            groupItem = groupItemFactory(newRoot, config.pivot);
            result.push(groupItem);
            groupArray.push(groupItem);
            indexesInGroup.push(-1);
            groupCounts.push(-1);
            return;
        }
        if (shouldInclude && Array.isArray(newRoot.data)) {
            groupItem = groupItemFactory(newRoot, config.pivot);
            if (pivotSummaryValue[key]) {
                pivotSummaryValue[key].value = groupItem.groupColumnSummaries;
            }
            result.push(groupItem);
            groupArray.push(groupItem);
            indexesInGroup.push(-1);
            groupCounts.push(-1);
            var arr = newRoot.data;
            let showGroupSummaryRow = normalizeGroupSummary(config ? config.showGroupSummaryRow || false : false, newRoot);
            var initialLen = arr.length;
            // this is for group summaries, when the summary is shown as first or last row in the group
            if (showGroupSummaryRow && newRoot.groupColumnSummaries) {
                // since we modify the arr array
                // the corresponding values for indexesInGroup and groupCounts are pushed into those arrays
                // in the next loop
                const summaryItem = {
                    ...newRoot.groupColumnSummaries,
                    __parentGroup: groupItem,
                    __summary: showGroupSummaryRow,
                };
                if (showGroupSummaryRow === 'end') {
                    arr.push(summaryItem);
                }
                else {
                    arr.splice(0, 0, summaryItem);
                }
            }
            var len = arr.length;
            if (!config.pivot) {
                for (var i = 0; i < len; i++) {
                    result.push(arr[i]);
                    indexesInGroup.push(i);
                    groupCounts.push(initialLen);
                }
            }
            else {
                const pivot = config.pivot;
                const pivotLen = pivot.length;
                for (var i = 0; i < len; i++) {
                    for (var j = 0; j < pivotLen; j++) {
                        var pivotColName = pivot[j];
                        var currentItem = arr[i];
                        var value = currentItem[pivotColName];
                        pivotUniqueValuesMap[pivotColName][value] = true;
                    }
                }
            }
            return;
        }
        groupItem = groupItemFactory(newRoot, config.pivot);
        if (shouldInclude) {
            result.push(groupItem);
            groupArray.push(groupItem);
            indexesInGroup.push(-1);
            // groupCounts needs to be different from -1 only when injecting a normal data item in the result array
            groupCounts.push(-1);
        }
        let showGroupSummaryRow = normalizeGroupSummary(config.showGroupSummaryRow || false, newRoot);
        let summaryItem;
        if (shouldInclude && showGroupSummaryRow && newRoot.groupColumnSummaries) {
            summaryItem = {
                ...newRoot.groupColumnSummaries,
                __parentGroup: groupItem,
                __summary: showGroupSummaryRow,
            };
            if (showGroupSummaryRow === 'start') {
                result.push(summaryItem);
                indexesInGroup.push(-1);
                groupCounts.push(-1);
            }
        }
        var flattenResult = flattenGroupData(newRoot, config, indexesInGroup, groupArray, groupCounts, pivotUniqueValuesMap, pivotSummaryValue ? (pivotSummaryValue[key] || {}).data : {}, currentPivotPath);
        result.push.apply(result, flattenResult.data);
        if (shouldInclude && showGroupSummaryRow === 'end' && summaryItem) {
            result.push(summaryItem);
            indexesInGroup.push(-1);
            groupCounts.push(1);
        }
        if (currentPivotPath) {
            currentPivotPath.pop();
        }
    });
    return {
        pivotSummaryValue,
        groupArray,
        data: result,
        groupCounts,
        indexes: indexesInGroup,
        pivotUniqueValuesMap,
    };
};
export default flattenGroupData;
