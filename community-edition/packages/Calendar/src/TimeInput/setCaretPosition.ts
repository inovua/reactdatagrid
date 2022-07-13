/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeCaretPosition } from '../DateFormatInput/types';

export default function setCaretPosition(
  elem: any,
  caretPos?: TypeCaretPosition
) {
  let start: any = caretPos;
  let end: any = caretPos;

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
      elem.focus();
      elem.setSelectionRange(start, end);
    }
  }
}
