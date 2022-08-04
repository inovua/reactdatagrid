/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getGlobal } from '../../../../getGlobal';

const globalObject = getGlobal();

const document: any = globalObject.document;

export default function getSelectionEnd(o: any) {
  if (o.createTextRange && !globalObject.getSelection) {
    let r = document.selection.createRange().duplicate();
    r.moveStart('character', -o.value.length);
    return r.text.length;
  }
  return o.selectionEnd;
}
