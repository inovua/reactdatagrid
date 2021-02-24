/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const ua = global.navigator ? global.navigator.userAgent || '' : '';
const IS_EDGE = ua.indexOf('Edge/') !== -1;
const IS_MS_BROWSER = IS_EDGE || ua.indexOf('Trident') !== -1;
const IS_IE = IS_MS_BROWSER && !IS_EDGE;
const IS_FF = ua.toLowerCase().indexOf('firefox') > -1;
export { IS_EDGE, IS_IE, IS_MS_BROWSER, IS_FF };
