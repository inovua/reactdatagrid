/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeSelectedProps } from './types';

import isSelectionEnabled from './isSelectionEnabled';
import isSelectionControlled from './isSelectionControlled';

const isMultiSelect = (props: TypeSelectedProps): boolean => {
  if (!isSelectionEnabled(props)) {
    return false;
  }

  if (props.multiSelect !== undefined) {
    return !!props.multiSelect;
  }

  const controlled = isSelectionControlled(props);

  const isMulti = controlled
    ? !!(typeof props.selected == 'object' && props.selected) ||
      typeof props.selected === 'boolean'
    : !!(typeof props.defaultSelected == 'object' && props.defaultSelected) ||
      typeof props.defaultSelected === 'boolean' ||
      props.checkboxColumn;

  return !!isMulti;
};

export default isMultiSelect;
