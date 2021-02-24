/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import sorty from '@inovua/reactdatagrid-community/packages/sorty';
const EMPTY_OBJECT = {};
const sortAsc = (a, b) => a - b;
const identity = (a) => a;
const augmentNode = (n, parentNode, index, config = EMPTY_OBJECT) => {
    const idProperty = config.idProperty || 'id';
    const pathSeparator = config.pathSeparator || '/';
    const nodesName = config.nodesName || 'nodes';
    const expandedNodes = config.expandedNodes || EMPTY_OBJECT;
    const dataSourceCache = config.dataSourceCache || EMPTY_OBJECT;
    const nodeCache = config.nodeCache || EMPTY_OBJECT;
    const loadingNodes = config.loadingNodes || EMPTY_OBJECT;
    const parentNodeId = parentNode ? parentNode[idProperty] : undefined;
    const path = parentNode
        ? `${parentNodeId}${pathSeparator}${n[idProperty]}`
        : `${n[idProperty]}`;
    const cacheKey = config.generateIdFromPath ? path : n[idProperty];
    const initialNodes = n[nodesName];
    if (dataSourceCache[cacheKey]) {
        n = { ...n, ...dataSourceCache[cacheKey] };
    }
    if (nodeCache[cacheKey]) {
        n = { ...n, ...nodeCache[cacheKey] };
    }
    const itemNodes = n[nodesName];
    const nodeProps = (config.nodeProps || identity)({
        leafNode: itemNodes === undefined,
        asyncNode: itemNodes === null,
        expanded: !!expandedNodes[cacheKey],
        loading: !!loadingNodes[cacheKey],
        initialNodes,
        parentNodeId,
        path,
        key: cacheKey,
        childIndex: index,
        itemNodesCount: Array.isArray(itemNodes) ? itemNodes.length : 0,
        depth: parentNode
            ? parentNode.__nodeProps
                ? parentNode.__nodeProps.depth + 1
                : 1
            : 0,
    }, n);
    if (config.isNodeLeaf) {
        nodeProps.leafNode = config.isNodeLeaf({ node: n, nodeProps });
    }
    if (config.isNodeAsync) {
        nodeProps.asyncNode = config.isNodeAsync({ node: n, nodeProps });
    }
    const result = {
        ...n,
        __nodeProps: nodeProps,
    };
    if (config.generateIdFromPath) {
        result[idProperty] = path;
    }
    return result;
};
const expandAtIndexWithInfo = (dataArray, index, config = EMPTY_OBJECT) => {
    const nodesName = config.nodesName || 'nodes';
    const idProperty = config.idProperty || 'id';
    const generateIdFromPath = config.generateIdFromPath;
    const pathSeparator = config.pathSeparator || '/';
    let node = dataArray[index];
    if (!node) {
        return { data: dataArray, insertCount: 0 };
    }
    const nextNode = dataArray[index + 1];
    const parentNodeId = node[idProperty];
    let nodes = node[nodesName];
    if (!Array.isArray(nodes) ||
        !nodes.length ||
        (nextNode &&
            nextNode.__nodeProps &&
            nextNode.__nodeProps.parentNodeId === parentNodeId) /* already expanded */) {
        return { data: dataArray, insertCount: 0 };
    }
    const insertIds = {};
    nodes = nodes.map((n, index) => {
        return augmentNode(n, node, index, config);
    });
    return {
        data: dataArray
            .slice(0, index)
            .concat(node)
            .concat(nodes)
            .concat(dataArray.slice(index + 1)),
        insertNodes: nodes,
        insertIds,
        insertCount: nodes.length,
    };
};
export const expandAtIndexes = (dataArray, indexes, config = EMPTY_OBJECT) => {
    indexes = indexes.sort(sortAsc);
    let alreadyInserted = 0;
    if (!Array.isArray(indexes) || !indexes.length) {
        return dataArray;
    }
    return indexes.reduce((dataSource, index) => {
        const { data, insertCount } = expandAtIndexWithInfo(dataSource, index + alreadyInserted, config);
        alreadyInserted += insertCount;
        return data;
    }, dataArray);
};
export const collapseAtIndexes = (dataArray, indexes, config = EMPTY_OBJECT) => {
    indexes = indexes.sort(sortAsc);
    let alreadyRemoved = 0;
    if (!Array.isArray(indexes) || !indexes.length) {
        return dataArray;
    }
    return indexes.reduce((dataSource, index) => {
        const { data, removeCount } = collapseAtIndexWithInfo(dataSource, index - alreadyRemoved, config);
        alreadyRemoved += removeCount;
        return data;
    }, dataArray);
};
export const expandAtIndex = (dataArray, index, config = EMPTY_OBJECT) => {
    const { data } = expandAtIndexWithInfo(dataArray, index, config);
    return data;
};
export const expandByIds = (dataArray, idMap, config = EMPTY_OBJECT) => {
    const { data } = expandByIdsWithInfo(dataArray, idMap, config);
    return data;
};
export const expandByIdsWithInfo = (dataArray, config = EMPTY_OBJECT, parentNode, result = [], idToIndexMap = {}, dataMap = {}, startIndex = 0, nodesToExpand = []) => {
    const idProperty = config.idProperty || 'id';
    const nodesName = config.nodesName || 'nodes';
    const nodeCache = config.nodeCache || EMPTY_OBJECT;
    const expandedNodes = config.expandedNodes || EMPTY_OBJECT;
    let nextItem;
    let itemAlreadyExpanded;
    let itemId;
    let itemNodes;
    dataArray.forEach((item, i) => {
        item = augmentNode(item, parentNode, i /* + startIndex*/, config);
        itemId = item[idProperty];
        itemNodes = item[nodesName];
        idToIndexMap[itemId] = i + startIndex;
        dataMap[itemId] = item;
        result.push(item);
        if (expandedNodes[itemId]) {
            if (Array.isArray(itemNodes)) {
                nextItem = dataArray[i + 1];
                itemAlreadyExpanded =
                    nextItem &&
                        nextItem.__nodeProps &&
                        nextItem.__nodeProps.parentNodeId === itemId;
                if (!itemAlreadyExpanded) {
                    let startFrom = result.length;
                    expandByIdsWithInfo(itemNodes, config, item, result, idToIndexMap, dataMap, startFrom, nodesToExpand);
                    startIndex += result.length - startFrom;
                }
            }
            else if (item.__nodeProps.expanded &&
                !item.__nodeProps.loading &&
                item.__nodeProps.asyncNode &&
                !item.__nodeProps.itemNodesCount &&
                (!config.collapsingNodes || !config.collapsingNodes[itemId])) {
                nodesToExpand.push(item);
            }
        }
    });
    return {
        data: result,
        dataMap,
        idToIndexMap,
        nodesToExpand,
    };
};
export const collapseByIds = (dataArray, idMap, config = EMPTY_OBJECT) => {
    const idToIndexMap = config.idToIndexMap;
    if (!idToIndexMap) {
        throw new Error(`The last argument to "collapseByIds" should contain a "idToIndexMap" property. No such property found!`);
    }
    const indexes = [];
    let index;
    for (let id in idMap) {
        index = idToIndexMap[id];
        if (index !== undefined) {
            indexes.push(index);
        }
    }
    return collapseAtIndexes(dataArray, indexes, config);
};
export const collapseAtIndexWithInfo = (dataArray, index, config = EMPTY_OBJECT) => {
    const node = dataArray[index];
    const idProperty = config.idProperty || 'id';
    if (!node) {
        return { data: dataArray, removeCount: 0 };
    }
    const parentNodeId = node[idProperty];
    const nodesName = config.nodesName || 'nodes';
    const nodes = node[nodesName];
    const nextNode = dataArray[index + 1];
    if (!Array.isArray(nodes) ||
        !nodes.length ||
        (nextNode &&
            (!nextNode.__nodeProps ||
                nextNode.__nodeProps.parentNodeId !==
                    parentNodeId)) /* already collapsed */) {
        return { data: dataArray, removeCount: 0 };
    }
    return {
        data: dataArray
            .slice(0, index)
            .concat(node)
            .concat(dataArray.slice(index + nodes.length + 1)),
        removeCount: nodes.length,
    };
};
export const collapseAtIndex = (dataArray, index, config = EMPTY_OBJECT) => {
    const { data } = collapseAtIndexWithInfo(dataArray, index, config);
    return data;
};
export const sortTreeData = (sortInfo, dataArray, { depth = 0, deep } = EMPTY_OBJECT) => {
    let { data, maxDepth } = sortTreeDataWithInfo(sortInfo, dataArray, depth);
    if (deep) {
        let currentDepth = depth;
        while (currentDepth < maxDepth) {
            currentDepth++;
            data = sortTreeDataWithInfo(sortInfo, data, currentDepth).data;
        }
    }
    return data;
};
export const sortTreeDataWithInfo = (sortInfo, dataArray, depth = 0) => {
    let item;
    let index = 0;
    let arrayAtDepth = [];
    let currentDepth;
    let currentPath;
    let prevItemDepth = -1;
    let prevPath;
    let prevMatchingDepthPath;
    let depthStart = -1;
    let depthEnd = -1;
    let arrayToSort;
    let currentNodeChildren = [];
    let map = {};
    let sortIndexStart;
    let maxDepth = 0;
    while ((item = dataArray[index])) {
        currentDepth = item.__nodeProps.depth;
        currentPath = item.__nodeProps.path;
        maxDepth = Math.max(maxDepth, currentDepth);
        if (currentDepth === depth) {
            if (currentDepth > prevItemDepth) {
                arrayToSort = [];
                sortIndexStart = index;
            }
            arrayToSort.push(item);
        }
        if (prevItemDepth >= depth && currentDepth <= depth) {
            if (currentNodeChildren.length) {
                map[prevMatchingDepthPath] = currentNodeChildren;
                currentNodeChildren = [];
            }
        }
        if (currentDepth > depth) {
            currentNodeChildren.push(item);
        }
        if (currentDepth < depth && arrayToSort && arrayToSort.length) {
            sorty(sortInfo, arrayToSort);
            for (let i = 0, sortItemChildren, sortItemPath, sortItem;; i < arrayToSort.length) {
                sortItem = arrayToSort[i];
                if (!sortItem) {
                    break;
                }
                sortItemPath = sortItem.__nodeProps.path;
                sortItemChildren = map[sortItemPath];
                if (Array.isArray(sortItemChildren)) {
                    arrayToSort.splice(i + 1, 0, ...sortItemChildren);
                    i += sortItemChildren.length;
                }
                i++;
            }
            dataArray.splice(sortIndexStart, arrayToSort.length, ...arrayToSort);
            arrayToSort = [];
        }
        index++;
        if (currentDepth === depth) {
            prevMatchingDepthPath = currentPath;
        }
        prevItemDepth = currentDepth;
        prevPath = currentPath;
    }
    if (currentNodeChildren.length) {
        map[prevMatchingDepthPath] = currentNodeChildren;
    }
    if (arrayToSort && arrayToSort.length) {
        sorty(sortInfo, arrayToSort);
        let idx = 0;
        let sortItemChildren;
        let sortItemPath;
        let sortItem;
        for (;; idx < arrayToSort.length) {
            sortItem = arrayToSort[idx];
            if (!sortItem) {
                break;
            }
            sortItemPath = sortItem.__nodeProps.path;
            sortItemChildren = map[sortItemPath];
            if (Array.isArray(sortItemChildren)) {
                arrayToSort.splice(idx + 1, 0, ...sortItemChildren);
                idx += sortItemChildren.length;
            }
            idx++;
        }
        dataArray.splice(sortIndexStart, arrayToSort.length, ...arrayToSort);
    }
    return { data: dataArray, maxDepth };
};
