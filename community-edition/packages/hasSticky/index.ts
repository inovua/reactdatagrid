/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const div =
  global.document && global.document.createElement
    ? global.document.createElement('div')
    : null;

let HAS_STICKY: boolean = false;

let sticky: string;

if (div) {
  div.style.position = 'sticky';
  if (div.style.position === 'sticky') {
    sticky = 'sticky';
    HAS_STICKY = true;
  }
  if (!HAS_STICKY) {
    div.style.position = '-webkit-sticky';

    if (div.style.position === '-webkit-sticky') {
      HAS_STICKY = true;
      sticky = '-webkit-sticky';
    }
  }
}

export default (): boolean => HAS_STICKY;
export { sticky };
