/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import isMobile from './isMobile';

export default isMobile
  ? {
      onMouseDown: 'onTouchStart',
      onMouseUp: 'onTouchEnd',
      onMouseMove: 'onTouchMove',
    }
  : {
      onMouseDown: 'onMouseDown',
      onMouseUp: 'onMouseUp',
      onMouseMove: 'onMouseMove',
    };
