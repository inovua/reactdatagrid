/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeRowSelection } from '../../types';

import isControlledProperty from '../../utils/isControlledProperty';

const isSelectionControlled = (props: {
  selected?: TypeRowSelection;
}): boolean => {
  return isControlledProperty(props, 'selected');
};

export default isSelectionControlled;
