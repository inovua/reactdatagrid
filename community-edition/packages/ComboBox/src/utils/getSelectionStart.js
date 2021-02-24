/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Returns the position of the curosr or the start of the selection
 * if there is a selections
 * @param  {node} input
 * @return {Number}
 */
function getSelectionStart(input) {
  if (!input) {
    return null;
  }
  /**
   * from http://javascript.nwbox.com/cursor_position/, but added the !window.getSelection check, which
   * is needed for newer versions of IE, which adhere to standards
   */
  if (input.createTextRange && !global.getSelection) {
    const document = global.document;
    const range = document.selection.createRange().duplicate();
    range.moveEnd('character', input.value.length);
    if (range.text == '') {
      return input.value.length;
    }
    return input.value.lastIndexOf(range.text);
  }

  return input.selectionStart;
}

export default getSelectionStart;
