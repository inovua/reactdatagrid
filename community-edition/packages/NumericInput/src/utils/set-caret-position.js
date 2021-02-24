/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default function setCaretPosition(elem, caretPos) {
  let start = caretPos;
  let end = caretPos;

  if (caretPos && (caretPos.start != undefined || caretPos.end != undefined)) {
    start = caretPos.start || 0;
    end = caretPos.end || start;
  }

  if (elem != null) {
    if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.moveStart('character', start);
      range.moveEnd('character', end);
      range.select();
    } else {
      elem.setSelectionRange(start, end);
    }
  }
}
