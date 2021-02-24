/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var document = global.document;

module.exports = function getSelectionEnd(o) {
  if (o.createTextRange && !global.getSelection) {
    var r = document.selection.createRange().duplicate();
    r.moveStart('character', -o.value.length);
    return r.text.length;
  }
  return o.selectionEnd;
};
