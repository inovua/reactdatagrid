/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const document = global.document;

// from http://javascript.nwbox.com/cursor_position/, but added the !window.getSelection check, which
// is needed for newer versions of IE, which adhere to standards
export default function getSelectionStart(o) {
  if (o.createTextRange && !global.getSelection) {
    let r = document.selection.createRange().duplicate();
    r.moveEnd('character', o.value.length);
    if (r.text == '') return o.value.length;
    return o.value.lastIndexOf(r.text);
  }
  return o.selectionStart;
}
