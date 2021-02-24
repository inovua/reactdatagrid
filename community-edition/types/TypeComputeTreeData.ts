/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type TypeComputeTreeDataParam = {
  expandedNodes: any;
  isNodeLeaf: ({ node, nodeProps }: { node: any; nodeProps: any }) => boolean;
  isNodeAsync: ({ node, nodeProps }: { node: any; nodeProps: any }) => boolean;
  pathSeparator: string;
  loadingNodes: any;
  nodesName: string;
  nodeCache: any;
  dataSourceCache: any;
  generateIdFromPath: boolean;
  collapsingNodes: any;
};
export type TypeComputeTreeData = (
  data: any[],
  arg: TypeComputeTreeDataParam
) => any[];
