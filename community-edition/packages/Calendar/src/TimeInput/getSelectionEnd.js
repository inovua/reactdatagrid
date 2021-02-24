/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const document = global.document;

export default function getSelectionEnd(o) {
  if (o.createTextRange && !global.getSelection) {
    let r = document.selection.createRange().duplicate();
    r.moveStart('character', -o.value.length);
    return r.text.length;
  }
  return o.selectionEnd;
}
