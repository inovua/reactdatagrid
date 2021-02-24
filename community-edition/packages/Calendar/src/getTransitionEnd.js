/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let map = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd',
  msTransition: 'MSTransitionEnd',
  transition: 'transitionend',
};

let EL;
let RESULT;

export default () => {
  if (!EL) {
    EL = document.createElement('p');
  }

  if (RESULT) {
    return RESULT;
  }

  for (let transition in map) {
    if (EL.style[transition] != null) {
      RESULT = map[transition];
      break;
    }
  }

  return RESULT;
};
