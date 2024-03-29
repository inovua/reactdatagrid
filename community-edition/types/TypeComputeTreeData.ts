/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeNodeProps } from '.';

export type TypeComputeTreeDataParam = {
  expandedNodes: any;
  isNodeLeaf:
    | ((args: { node: any; nodeProps: TypeNodeProps }) => boolean)
    | undefined;
  isNodeAsync:
    | ((args: { node: any; nodeProps: TypeNodeProps }) => boolean)
    | undefined;
  pathSeparator: string;
  loadingNodes: any;
  nodesName: string;
  nodeCache: any;
  dataSourceCache: any;
  generateIdFromPath: boolean;
  collapsingNodes: any;
  idProperty: string;
};
export type TypeComputeTreeData = (
  data: any[],
  arg: TypeComputeTreeDataParam
) => any[];
