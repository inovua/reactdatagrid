/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const document = global ? global.document : null;
let scrollbarWidth: number;
let hideNativeScrollbarWidth: number;

export default (hideNativeScrollbarIfPossible?: boolean): number => {
  if (hideNativeScrollbarIfPossible) {
    if (hideNativeScrollbarWidth !== undefined) {
      return hideNativeScrollbarWidth;
    }
  } else {
    if (scrollbarWidth !== undefined) {
      return scrollbarWidth;
    }
  }

  let result: number;

  if (document) {
    const div = document.createElement('div');
    const divStyle = div.style;

    if (hideNativeScrollbarIfPossible) {
      div.className = 'inovua--hide-native-scroll-if-possible';
    }

    divStyle.width = '100px';
    divStyle.height = '100px';
    divStyle.position = 'absolute';
    divStyle.visibility = 'hidden';
    divStyle.boxSizing = 'content-box';
    divStyle.top = '-99999px';
    divStyle.overflow = 'scroll';
    divStyle.MsOverflowStyle = 'scrollbar';

    document.body.appendChild(div);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    div.appendChild(inner);

    // Calculating difference between container's full width and the child width

    result = div.offsetWidth - inner.offsetWidth;
    document.body.removeChild(div);
  } else {
    result = 0;
  }

  if (hideNativeScrollbarIfPossible) {
    hideNativeScrollbarWidth = result;
  }

  return result;
};
