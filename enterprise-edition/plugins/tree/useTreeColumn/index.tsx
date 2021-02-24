/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MutableRefObject, useState, useRef, useCallback } from 'react';
import {
  TypeDataGridProps,
  TypeComputedProps,
  TypeExpandedNodes,
  TypeNodeCache,
} from '../../../types';

import useProperty from '@inovua/reactdatagrid-community/hooks/useProperty';
import batchUpdate from '@inovua/reactdatagrid-community/utils/batchUpdate';

const EXPANDABLE_NODE_INFO = {};

const isNodeExpandableAt_FromProps = (
  computedPropsRef: MutableRefObject<TypeComputedProps | null>,
  rowIndex: number
): boolean => {
  const { current: computedProps } = computedPropsRef;
  if (!computedProps) {
    return false;
  }
  const data = computedProps.getItemAt(rowIndex);

  if (!data) {
    return false;
  }
  if (data.__group) {
    return false;
  }

  if (data.__nodeProps && data.__nodeProps.leafNode) {
    return false;
  }

  const id = computedProps.getItemId(data);

  const { initialProps } = computedProps;
  if (initialProps.unexpandableNodes && initialProps.unexpandableNodes[id]) {
    return false;
  }

  if (!initialProps.isNodeExpandable) {
    return true;
  }

  EXPANDABLE_NODE_INFO.id = id;
  EXPANDABLE_NODE_INFO.data = data;
  EXPANDABLE_NODE_INFO.rowIndex = rowIndex;
  EXPANDABLE_NODE_INFO.node = data;
  EXPANDABLE_NODE_INFO.nodeProps = data.__nodeProps;
  return initialProps.isNodeExpandable(EXPANDABLE_NODE_INFO);
};

const loadNodeAsync_FromProps = (
  computedPropsRef: MutableRefObject<TypeComputedProps | null>,
  dataOrIndex: number | object,
  callback?: () => void
) => {
  const { current: computedProps } = computedPropsRef;
  if (!computedProps) {
    return;
  }
  const data =
    typeof dataOrIndex === 'number'
      ? computedProps.getItemAt(dataOrIndex)
      : dataOrIndex;

  const nodeId = computedProps.getItemId(data);

  const nodeCache = computedProps.getNodeCache!();
  const once = !!computedProps.initialProps.loadNodeOnce;
  const loadFn = computedProps.computedLoadNode;

  if (!loadFn && callback) {
    callback();
    return;
  }

  if (
    once &&
    nodeCache &&
    nodeCache[nodeId] != null &&
    nodeCache[nodeId][computedProps.initialProps.nodesProperty] !== undefined
  ) {
    if (callback) {
      callback();
    }
    return;
  }
  const loadingNodes: { [key: string]: boolean } = {
    ...computedProps.computedLoadingNodes,
  };

  const result: object[] | Promise<object[]> = loadFn!({
    node: data,
    nodeProps: data.__nodeProps,
  });

  if (Array.isArray(result)) {
    computedProps.appendCacheForNode!(nodeId, {
      [computedProps.initialProps.nodesProperty]: result,
    });
    if (callback) {
      callback();
    }
  } else {
    loadingNodes[nodeId] = true;
    computedProps.setLoadingNodes!(loadingNodes);

    if (callback) {
      callback();
    }
  }

  if (typeof result.then === 'function') {
    result.then((nodes: object[]) => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return;
      }
      const loadingNodes: { [key: string]: boolean } = {
        ...computedProps.computedLoadingNodes,
      };
      delete loadingNodes[nodeId];

      computedProps.setLoadingNodes!(loadingNodes);
      computedProps.appendCacheForNode!(nodeId, {
        [computedProps.initialProps.nodesProperty]: nodes,
      });
    });
  }
};

const useTreeColumn = (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
) => {
  const computedTreeEnabled = props.treeEnabled || !!props.treeColumn;

  const [expandedNodes, doSetExpandedNodes] = useProperty<
    TypeExpandedNodes | undefined
  >(props, 'expandedNodes', undefined, {
    onChange: (expandedNodes, ...args: any[]) => {
      const fn = computedProps.initialProps.onExpandedNodesChange;

      if (fn) {
        fn({ expandedNodes }, ...args);
      }
    },
  });

  const isNodeExpandableAt = (index: number): boolean => {
    return isNodeExpandableAt_FromProps(computedPropsRef, index);
  };

  const setExpandedNodes = (
    expandedNodes?: TypeExpandedNodes,
    collapsedNodes?: TypeExpandedNodes,
    cfg?: { id: string | number; data: any; expanded: boolean }
  ) => {
    cfg = cfg || ({} as { id: string | number; data: any; expanded: boolean });

    const {
      id,
      data,
      expanded,
    }: { id: string | number; data: any; expanded: boolean } = cfg;

    let index;
    let nodeProps;

    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    const { initialProps } = computedProps;

    if (data) {
      nodeProps = data.__nodeProps;
      index = computedProps.dataIndexMap![id] as number;
      if (!expanded) {
        if (
          initialProps.onNodeCollapse &&
          initialProps.onNodeCollapse({
            nodeProps,
            node: data,
            data,
            id,
            index,
          }) === false
        ) {
          return;
        }
      } else {
        if (!isNodeExpandableAt(index)) {
          return;
        }
        if (
          initialProps.onNodeExpand &&
          initialProps.onNodeExpand({
            nodeProps,
            node: data,
            data,
            id,
            index,
          }) === false
        ) {
          return;
        }
      }
      if (
        initialProps.onNodeExpandChange &&
        initialProps.onNodeExpandChange({
          expandedNodes,
          id,
          index,
          data,
          nodeProps,
          node: data,
          nodeExpanded: expanded,
        }) === false
      ) {
        return;
      }
    }
    if (initialProps.onExpandedNodesChange) {
      initialProps.onExpandedNodesChange({
        expandedNodes,
        nodeExpanded: expanded,
        nodeProps,
        data,
        id,
        index,
      });
    }

    if (expandedNodes) {
      doSetExpandedNodes(expandedNodes);
    }
  };

  const [nodeCache, doSetNodeCache] = useProperty<TypeNodeCache>(
    props,
    'nodeCache'
  );

  const [loadingNodes, setLoadingNodes] = useState<{ [key: string]: boolean }>(
    {}
  );

  const collapsingNodesRef = useRef<{ [key: string]: boolean }>({});

  const isNodeExpanded = (data: object | number): boolean => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return false;
    }
    if (data == null) {
      return false;
    }
    let index;
    if (typeof data == 'number') {
      index = data;
      data = computedProps.getItemAt(index);
    }
    const expandedNodes = computedProps.computedExpandedNodes;
    const id = computedProps.getItemId(data as object);

    if (!expandedNodes) {
      return false;
    }

    return !!expandedNodes[id];
  };

  const getExpandedNodes = () => {
    return computedPropsRef.current!.computedExpandedNodes;
  };

  const loadNodeAsync = (data: number | object, callback?: () => void) => {
    return loadNodeAsync_FromProps(computedPropsRef, data, callback);
  };

  const clearNodeChildrenCache = (
    nodeId: string | number,
    recursive = true,
    treeCache: TypeNodeCache | undefined,
    clearedMap?: { [key: string]: boolean }
  ): { [key: string]: boolean } => {
    const { current: computedProps } = computedPropsRef;
    clearedMap = clearedMap || {};
    if (!computedProps) {
      return clearedMap;
    }
    const isRoot = !treeCache;
    treeCache = treeCache || { ...getNodeCache() };

    const data = computedProps.dataMap![nodeId];
    if (!data) {
      return clearedMap;
    }
    const nodeCache: { [key: string]: any } = treeCache[nodeId];

    const childNodes =
      nodeCache != null
        ? nodeCache[computedProps.nodesProperty]
        : data[computedProps.nodesProperty];

    if (
      childNodes &&
      recursive &&
      computedProps.initialProps.collapseChildrenOnAsyncNodeCollapse
    ) {
      const {
        generateIdFromPath,
        nodePathSeparator,
      } = computedProps.initialProps;
      childNodes.forEach(childNode => {
        if (!childNode) {
          return;
        }
        let childId = computedProps.getItemId(childNode);

        if (childNode.__nodeProps) {
          childId = childNode.__nodeProps.key;
        } else if (generateIdFromPath) {
          childId = `${nodeId}${nodePathSeparator}${childId}`;
        }
        clearedMap![childId] = true;

        computedProps.clearNodeChildrenCache(
          childId,
          recursive,
          treeCache,
          clearedMap
        );
      });
    }

    treeCache[nodeId] = {
      ...nodeCache,
      [computedProps.initialProps.nodesProperty]: data.__nodeProps
        ? data.__nodeProps.initialNodes
        : data[computedProps.initialProps.nodesProperty],
    };

    if (isRoot) {
      setNodeCache(treeCache, {
        nodeId,
        node: data,
      });

      return clearedMap;
    }

    return clearedMap;
  };

  const setNodeExpandedById = (
    id: string | number,
    expanded: boolean,
    config: { force?: boolean } = {}
  ) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    if (!computedProps.dataMap) {
      return;
    }
    const { collapsingNodesRef } = computedProps;
    const data = computedProps.dataMap[id];

    if (!data) {
      return;
    }

    if (data.__nodeProps && data.__nodeProps.leafNode) {
      return;
    }
    if (
      data.__nodeProps &&
      data.__nodeProps.expanded === expanded &&
      config.force !== true
    ) {
      return;
    }
    const treeCache = computedProps.computedNodeCache;

    let clearedCacheIds: { [key: string]: boolean };
    const __collapsingNodes = collapsingNodesRef.current;

    const queue = batchUpdate();

    const doExpandOrCollapse = (): void => {
      const expandedNodes: TypeExpandedNodes = { ...getExpandedNodes() };

      if (!expanded) {
        const recursive: boolean = !!computedProps.loadNode;
        delete expandedNodes[id];
        if (__collapsingNodes && __collapsingNodes[id]) {
          delete __collapsingNodes[id];
        }

        if (
          recursive &&
          clearedCacheIds &&
          computedProps.collapseChildrenOnAsyncNodeCollapse
        ) {
          for (let id in clearedCacheIds) {
            delete expandedNodes[id];
          }
        }

        if (computedProps.collapseChildrenRecursive) {
          for (let childId in expandedNodes) {
            if (childId.indexOf(id) === 0) {
              delete expandedNodes[childId];
            }
          }
        }
      } else {
        expandedNodes[id] = true;
      }
      setExpandedNodes(expandedNodes, undefined, { data, expanded, id });
    };

    if (!expanded) {
      collapsingNodesRef.current = __collapsingNodes || {};
      collapsingNodesRef.current[id] = true;
    }

    if (!expanded) {
      queue(() => {
        const nodeCache = treeCache ? treeCache[id] : undefined;
        if (
          nodeCache !== undefined &&
          !computedProps.initialProps.loadNodeOnce
        ) {
          const recursive = !!computedProps.initialProps.loadNode;

          clearedCacheIds = clearNodeChildrenCache(id, recursive, treeCache);
          doExpandOrCollapse();
        } else {
          doExpandOrCollapse();
        }
      });

      queue.commit();

      return;
    }

    queue(() => {
      if (expanded && data.__nodeProps && data.__nodeProps.asyncNode) {
        loadNodeAsync(data, doExpandOrCollapse);
      } else {
        doExpandOrCollapse();
      }
    });

    queue.commit();
  };

  const setNodeExpandedAt = (index: number, expanded: boolean): void => {
    const data = computedProps.getItemAt(index);
    if (!data) {
      return;
    }
    const id = computedProps.getItemId(data);

    return setNodeExpandedById(id, expanded);
  };

  const toggleNodeExpand = useCallback((dataOrIndex: object | number) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }

    const data =
      typeof dataOrIndex === 'number'
        ? computedProps.getItemAt(dataOrIndex)
        : dataOrIndex;

    if (!data) {
      return;
    }
    const id = computedProps.getItemId(data);
    const expanded = isNodeExpanded(data);

    return setNodeExpandedById(id, !expanded);
  }, []);

  const getNodeCache = useCallback(() => {
    const { current: computedProps } = computedPropsRef;

    if (!computedProps) {
      return {};
    }

    return computedProps.computedNodeCache || {};
  }, []);

  const appendCacheForNode = (nodeId: string | number, node: object) => {
    const { current: computedProps } = computedPropsRef;

    if (!computedProps) {
      return;
    }

    const nodeCache = { ...getNodeCache() };

    if (node === undefined) {
      delete nodeCache[nodeId];
    } else {
      nodeCache[nodeId] = { ...nodeCache[nodeId], ...node };
    }

    computedProps.setNodeCache!(nodeCache, {
      nodeId,
      node,
    });
  };

  const setNodeCache = (
    nodeCache: TypeNodeCache,
    info?: { nodeId: string | number; node: object }
  ) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    if (computedProps.initialProps.onNodeCache) {
      computedProps.initialProps.onNodeCache(nodeCache, info);
    }
    doSetNodeCache(nodeCache);
  };

  const computedExpandedNodes = expandedNodes;
  const computedNodeCache = nodeCache;
  const computedLoadingNodes = loadingNodes;

  const once = !!computedProps.initialProps.loadNodeOnce;
  const computedLoadNode = once
    ? computedProps.initialProps.loadNodeOnce
    : computedProps.initialProps.loadNode;

  return {
    clearNodeChildrenCache,
    toggleNodeExpand,
    loadNodeAsync,
    collapsingNodesRef,
    setLoadingNodes,
    computedTreeEnabled,
    computedLoadNode,
    computedExpandedNodes,
    computedLoadingNodes,
    computedNodeCache,
    getNodeCache,
    setNodeCache,
    appendCacheForNode,
    isNodeExpandableAt,
    isNodeExpanded,
    setNodeExpandedAt,
    setNodeExpandedById,
  };
};

export default useTreeColumn;
