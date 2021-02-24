/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useSortInfo from './useSortInfo';
import sorty from '../../packages/sorty';

export default {
  name: 'sortable-columns',
  hook: useSortInfo,
  defaultProps: () => {
    return {
      sorty,
      sortable: true,
    };
  },
};
