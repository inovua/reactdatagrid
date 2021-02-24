/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getScrollbarWidth from '../../../packages/getScrollbarWidth';
import HAS_STICKY from '../../../packages/hasSticky';
import StickyScroller, { isMobile } from './StickyScroller';

import IE_InovuaVirtualScrollContainer from './old';
import IE_NativeScrollContainer from './old/NativeScrollContainer';

export default HAS_STICKY() ? StickyScroller : IE_InovuaVirtualScrollContainer;

const NativeScrollContainer = HAS_STICKY()
  ? StickyScroller
  : IE_NativeScrollContainer;

export {
  HAS_STICKY as hasSticky,
  getScrollbarWidth,
  isMobile,
  NativeScrollContainer,
};
