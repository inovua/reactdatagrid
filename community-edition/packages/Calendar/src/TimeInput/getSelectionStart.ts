/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getGlobal } from '../../../../getGlobal';

const globalObject = getGlobal();
const document: any = globalObject.document;

// from http://javascript.nwbox.com/cursor_position/, but added the !window.getSelection check, which
// is needed for newer versions of IE, which adhere to standards
export default function getSelectionStart(o: any) {
  if (o.createTextRange && !globalObject.getSelection) {
    let r = document.selection.createRange().duplicate();
    r.moveEnd('character', o.value.length);
    if (r.text == '') return o.value.length;
    return o.value.lastIndexOf(r.text);
  }
  return o.selectionStart;
}
