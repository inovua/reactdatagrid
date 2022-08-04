/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CSSProperties } from 'react';

type TypeTransitionMap = {
  WebkitTransition: string;
  MozTransition: string;
  OTransition: string;
  msTransition: string;
  transition: string;
};

let map: TypeTransitionMap = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd',
  msTransition: 'MSTransitionEnd',
  transition: 'transitionend',
};

let EL: HTMLElement;
let RESULT: string;

export default () => {
  if (!EL) {
    EL = document.createElement('p');
  }

  if (RESULT) {
    return RESULT;
  }

  for (let transition in map) {
    if (
      (EL.style as CSSProperties)[transition as keyof TypeTransitionMap] != null
    ) {
      RESULT = map[transition as keyof TypeTransitionMap];
      break;
    }
  }

  return RESULT;
};
