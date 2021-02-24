/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function getCursorPosition(field) {
  let cursorPosition = 0;

  if (document.selection) {
    field.focus();
    let oSel = document.selection.createRange();
    oSel.moveStart('character', -field.value.length);
    cursorPosition = oSel.text.length;
  } else if (field.selectionStart || field.selectionStart == '0') {
    cursorPosition = field.selectionStart;
  }

  return cursorPosition;
}

export default getCursorPosition;
