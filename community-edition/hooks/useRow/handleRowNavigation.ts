/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeComputedProps } from '../../types';

const handleRowNavigation = (
  event: KeyboardEvent,
  computedProps: TypeComputedProps
): boolean => {
  const { key } = event;

  const activeItem = computedProps.computedActiveItem;
  const isGroup = computedProps.isGroup(activeItem);

  const options: { [index: string]: (event: KeyboardEvent) => void } = {
    ArrowUp: () => computedProps.incrementActiveIndex(-1),
    ArrowDown: () => computedProps.incrementActiveIndex(1),
    Home: () => computedProps.setActiveIndex(0),
    Enter: (event: KeyboardEvent) => {
      if (!activeItem) {
        return;
      }

      if (isGroup) {
        computedProps.toggleGroup(activeItem);
        return;
      }
      computedProps.toggleActiveRowSelection(event);
    },
    End: () => computedProps.setActiveIndex(computedProps.data.length - 1),
    PageUp: () =>
      computedProps.incrementActiveIndex(-computedProps.keyPageStep),
    PageDown: () =>
      computedProps.incrementActiveIndex(computedProps.keyPageStep),
  };

  const fn = options[key];

  if (fn) {
    fn(event);
    return true;
  }

  return false;
};

export default handleRowNavigation;
