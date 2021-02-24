/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
const get = (item, field) => item[field];
const defaultStringify = (obj) => {
    const type = typeof obj;
    return type == 'string' || type === 'number' || type === 'boolean'
        ? `${obj}`
        : JSON.stringify(obj);
};
const getShowSummaryRow = (showGroupSummaryRow, groupData, pivot) => {
    if (!showGroupSummaryRow || !groupData || pivot) {
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
const completeBucketSummaries = (bucket, { groupSummaryReducer, groupColumnSummaryReducers, pivotColumnSummaryReducers, }) => {
    if (groupSummaryReducer && groupSummaryReducer.complete) {
        bucket.groupSummary = groupSummaryReducer.complete(bucket.groupSummary, bucket.array);
    }
    if (groupColumnSummaryReducers) {
        bucket.groupColumnSummary = Object.keys(groupColumnSummaryReducers).reduce((acc, key) => {
            const value = acc[key];
            const reducer = groupColumnSummaryReducers[key];
            if (reducer.complete) {
                acc[key] = reducer.complete(value, bucket.array);
            }
            return acc;
        }, bucket.groupColumnSummary);
        if (bucket.pivotSummary !== null) {
            completePivotBucketSummaries(bucket, {
                groupColumnSummaryReducers,
                pivotColumnSummaryReducers,
            });
        }
    }
    return bucket;
};
const completeGroupColumnSummaryReducers = (target, array, groupColumnSummaryReducers) => {
    if (!target || !groupColumnSummaryReducers) {
        return null;
    }
    return Object.keys(groupColumnSummaryReducers).reduce((acc, colId) => {
        const reducer = groupColumnSummaryReducers[colId];
        if (reducer.complete) {
            acc[colId] = reducer.complete(acc[colId], array);
        }
        return acc;
    }, target);
};
const completePivotBucketSummaries = (pivotSummaryBucket, { groupColumnSummaryReducers, pivotColumnSummaryReducers, }) => {
    if (!pivotSummaryBucket.pivotSummary) {
        return;
    }
    Object.keys(pivotSummaryBucket.pivotSummary).forEach((groupName) => {
        const pivotBucket = pivotSummaryBucket.pivotSummary[groupName];
        pivotBucket.values = completeGroupColumnSummaryReducers(pivotBucket.values, pivotBucket.array, groupColumnSummaryReducers);
        completePivotBucketSummaries(pivotBucket, {
            groupColumnSummaryReducers,
            pivotColumnSummaryReducers,
        });
        if (pivotBucket.pivotColumnSummary &&
            pivotColumnSummaryReducers &&
            pivotColumnSummaryReducers[pivotBucket.field]) {
            const pivotColumnSummaryReducer = pivotColumnSummaryReducers[pivotBucket.field];
            if (pivotColumnSummaryReducer.complete) {
                pivotBucket.pivotColumnSummary[pivotBucket.field] = pivotColumnSummaryReducer.complete(pivotBucket.pivotColumnSummary[pivotBucket.field], pivotBucket.array);
            }
        }
    });
};
const createGroupItem = (key, bucket) => {
    return {
        __group: true,
        leaf: !bucket.data,
        value: key,
        depth: bucket.depth,
        groupSummary: bucket.groupSummary,
        groupColumnSummary: bucket.groupColumnSummary,
        pivotSummary: bucket.pivotSummary,
        keyPath: bucket.keyPath,
        fieldPath: bucket.fieldPath,
    };
};
export const flatten = (bucket, { pivot, groupSummaryReducer, groupColumnSummaryReducers, pivotColumnSummaryReducers, isCollapsed, showGroupSummaryRow, }) => {
    let data = [];
    let indexesInGroups = [];
    let groupCounts = [];
    // we need to complete the summary calculation
    // before going down and flattening more,
    // since createGroupItem sends the summary info to the created data item
    completeBucketSummaries(bucket, {
        groupSummaryReducer,
        groupColumnSummaryReducers,
        pivotColumnSummaryReducers,
    });
    let shouldInclude = true;
    let showSummaryRow;
    let summaryGroupItem;
    if (!bucket.data) {
        const groupItem = createGroupItem(bucket.key, bucket);
        data = [groupItem];
        indexesInGroups = [-1];
        groupCounts = [-1];
        shouldInclude = !pivot;
        if (isCollapsed && isCollapsed(groupItem)) {
            shouldInclude = false;
        }
        if (shouldInclude) {
            showSummaryRow = getShowSummaryRow(showGroupSummaryRow, groupItem, pivot);
            summaryGroupItem = showSummaryRow
                ? {
                    ...groupItem.groupColumnSummary,
                    __parentGroup: groupItem,
                    __summary: showSummaryRow,
                }
                : null;
            let indexesInGroupsOffset = 0;
            if (showSummaryRow === 'start') {
                data.push(summaryGroupItem);
                groupCounts.push(-1);
                indexesInGroups.push(-1);
            }
            data = data.concat(bucket.array);
            indexesInGroups = indexesInGroups.concat(bucket.array.map((_, index) => index + indexesInGroupsOffset));
            groupCounts = groupCounts.concat(bucket.array.map(_ => bucket.array.length));
            if (showSummaryRow === 'end') {
                data.push(summaryGroupItem);
                indexesInGroups.push(-1);
                groupCounts.push(-1);
            }
        }
    }
    else {
        const groupItem = bucket.key != null ? createGroupItem(bucket.key, bucket) : null;
        data = groupItem ? [groupItem] : [];
        indexesInGroups = groupItem ? [-1] : [];
        groupCounts = groupItem ? [-1] : [];
        if (groupItem && isCollapsed && isCollapsed(groupItem)) {
            shouldInclude = false;
        }
        if (shouldInclude) {
            showSummaryRow = getShowSummaryRow(showGroupSummaryRow, groupItem, pivot);
            summaryGroupItem = showSummaryRow
                ? {
                    ...groupItem.groupColumnSummary,
                    __parentGroup: groupItem,
                    __summary: showSummaryRow,
                }
                : null;
            if (showSummaryRow === 'start') {
                data.push(summaryGroupItem);
                indexesInGroups.push(-1);
                groupCounts.push(-1);
            }
            data = bucket.order.reduce((data, key) => {
                const childBucket = bucket.data[key];
                const result = flatten(childBucket, {
                    pivot,
                    isCollapsed,
                    showGroupSummaryRow,
                    groupColumnSummaryReducers,
                    groupSummaryReducer,
                    pivotColumnSummaryReducers,
                });
                indexesInGroups = indexesInGroups.concat(result.indexesInGroups);
                groupCounts = groupCounts.concat(result.groupCounts);
                return data.concat(result.data);
            }, data);
            if (showSummaryRow === 'end') {
                data.push(summaryGroupItem);
                indexesInGroups.push(-1);
                groupCounts.push(-1);
            }
        }
    }
    return {
        indexesInGroups,
        groupCounts,
        bucket,
        data,
    };
};
const buildDataBucket = ({ field, key, parent, groupSummaryReducer, groupColumnSummaryReducers, pivotColumnSummaryReducers, }) => {
    return {
        key,
        field,
        fieldPath: parent && field ? [...parent.fieldPath, field] : [],
        keyPath: parent && key ? [...parent.keyPath, key] : [],
        order: [],
        array: [],
        data: null,
        depth: parent ? parent.depth + 1 : 0,
        groupSummary: groupSummaryReducer ? groupSummaryReducer.initialValue : null,
        groupColumnSummary: getDefaultGroupSummaryValue(groupColumnSummaryReducers),
        pivotColumnSummary: getDefaultGroupSummaryValue(pivotColumnSummaryReducers),
        pivotSummary: null,
    };
};
const groupAndPivot = (data, { groupBy, pivot, columnsMap, stringify = defaultStringify, groupSummaryReducer, groupColumnSummaryReducers, pivotColumnSummaryReducers, }) => {
    const masterBucket = buildDataBucket({
        field: null,
        parent: null,
        key: null,
        groupSummaryReducer,
        groupColumnSummaryReducers,
        pivotColumnSummaryReducers,
    });
    if (pivot && pivot.length) {
        masterBucket.pivotUniqueValuesPerColumn = {
            field: null,
            values: null,
        };
    }
    const onItem = (item) => {
        let rootBucket = masterBucket;
        updateBucketSummaries(rootBucket, item, {
            groupSummaryReducer,
            groupColumnSummaryReducers,
            columnsMap,
        });
        groupBy.forEach((field) => {
            const fieldValue = get(item, field);
            const toString = columnsMap[field]
                ? columnsMap[field].groupToString || stringify
                : stringify;
            const stringKey = toString(fieldValue, { data: item, field });
            if (!rootBucket.data) {
                rootBucket.data = {};
            }
            let currentBucket = rootBucket.data[stringKey];
            if (!currentBucket) {
                currentBucket = rootBucket.data[stringKey] = buildDataBucket({
                    field,
                    key: stringKey,
                    parent: rootBucket,
                    groupSummaryReducer,
                    groupColumnSummaryReducers,
                });
                rootBucket.order.push(stringKey);
            }
            currentBucket.array.push(item);
            updateBucketSummaries(currentBucket, item, {
                groupSummaryReducer,
                groupColumnSummaryReducers,
                columnsMap,
            });
            if (pivot && pivot.length) {
                let pivotBucketOwner = currentBucket;
                let uniqueValuesRoot = masterBucket.pivotUniqueValuesPerColumn;
                pivot.forEach((field) => {
                    field = typeof field === 'string' ? field : field.name;
                    const fieldValue = get(item, field);
                    const col = columnsMap[field];
                    const toString = col
                        ? col.pivotToString || col.groupToString || stringify
                        : stringify;
                    const stringKey = toString(fieldValue, { data: item, field });
                    if (!pivotBucketOwner.pivotSummary) {
                        pivotBucketOwner.pivotSummary = {};
                    }
                    if (!pivotBucketOwner.pivotColumnSummary) {
                        pivotBucketOwner.pivotColumnSummary = {};
                    }
                    let currentPivotSummaryBucket = pivotBucketOwner.pivotSummary;
                    pivotBucketOwner = updateBucketPivotSummary(currentPivotSummaryBucket, item, {
                        field,
                        groupName: stringKey,
                        groupColumnSummaryReducers,
                        pivotColumnSummaryReducers: pivotColumnSummaryReducers
                            ? {
                                [field]: pivotColumnSummaryReducers[field],
                            }
                            : undefined,
                        columnsMap,
                    });
                    if (!uniqueValuesRoot.field) {
                        uniqueValuesRoot.field = field;
                        uniqueValuesRoot.values = {};
                    }
                    if (!uniqueValuesRoot.values[stringKey]) {
                        uniqueValuesRoot.values[stringKey] = { field: null, values: null };
                    }
                    uniqueValuesRoot = uniqueValuesRoot.values[stringKey];
                });
            }
            rootBucket = currentBucket;
        });
    };
    data.forEach(onItem);
    return masterBucket;
};
export const updateBucketSummaries = (currentBucket, item, { groupSummaryReducer, groupColumnSummaryReducers, columnsMap, }) => {
    if (groupSummaryReducer) {
        currentBucket.groupSummary = groupSummaryReducer.reducer(currentBucket.groupSummary, item, item);
    }
    if (groupColumnSummaryReducers) {
        currentBucket.groupColumnSummary = Object.keys(groupColumnSummaryReducers).reduce((columnSummaries, colId) => {
            const col = columnsMap[colId];
            const value = col.name ? item[col.name] : item[colId];
            columnSummaries[colId] = groupColumnSummaryReducers[colId].reducer(columnSummaries[colId], value, item);
            return columnSummaries;
        }, currentBucket.groupColumnSummary);
    }
};
const updateBucketPivotSummary = (currentBucket, item, { groupColumnSummaryReducers, pivotColumnSummaryReducers, groupName, field, columnsMap, }) => {
    groupColumnSummaryReducers = groupColumnSummaryReducers || {};
    pivotColumnSummaryReducers = pivotColumnSummaryReducers || {};
    if (!currentBucket[groupName]) {
        currentBucket[groupName] = {
            array: [],
            field,
            values: getDefaultGroupSummaryValue(groupColumnSummaryReducers),
            pivotColumnSummary: getDefaultGroupSummaryValue(pivotColumnSummaryReducers),
            pivotSummary: null,
        };
    }
    currentBucket[groupName].array.push(item);
    currentBucket[groupName].values = Object.keys(groupColumnSummaryReducers).reduce((columnSummaries, colId) => {
        const col = columnsMap[colId];
        const value = col.name ? item[col.name] : item[colId];
        columnSummaries[colId] = groupColumnSummaryReducers[colId].reducer(columnSummaries[colId], value, item);
        return columnSummaries;
    }, currentBucket[groupName].values);
    currentBucket[groupName].pivotColumnSummary = Object.keys(pivotColumnSummaryReducers).reduce((pivotColumnSummaries, colId) => {
        // const value = item[colId];
        if (pivotColumnSummaryReducers[colId]) {
            pivotColumnSummaries[colId] = pivotColumnSummaryReducers[colId].reducer(pivotColumnSummaries[colId], groupName, item);
        }
        return pivotColumnSummaries;
    }, currentBucket[groupName].pivotColumnSummary);
    return currentBucket[groupName];
};
export const getDefaultGroupSummaryValue = (groupColumnSummaryReducers) => {
    return groupColumnSummaryReducers
        ? Object.keys(groupColumnSummaryReducers).reduce((acc, key) => {
            if (groupColumnSummaryReducers[key]) {
                acc[key] = groupColumnSummaryReducers[key].initialValue;
            }
            return acc;
        }, {})
        : null;
};
export default groupAndPivot;
