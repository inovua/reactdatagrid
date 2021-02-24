/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expandByIdsWithInfo } from './tree';
export default (data, arg) => {
    const treeExpandData = expandByIdsWithInfo(data, arg);
    return treeExpandData.data;
};
