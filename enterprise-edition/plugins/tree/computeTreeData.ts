/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expandByIdsWithInfo } from './tree';
import { TypeComputeTreeDataParam } from '../../types';

export default (data: any[], arg: TypeComputeTreeDataParam): any[] => {
  const treeExpandData = expandByIdsWithInfo(data, arg);
  return treeExpandData.data;
};
