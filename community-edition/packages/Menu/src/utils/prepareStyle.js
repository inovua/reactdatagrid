/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from '../../../../common/assign';
import getMinMaxSize from '../../../../common/getMinMaxSize';

function prepareStyle(props, state) {
  let style = {};

  if (props.subMenu) {
    assign(style, props.submenuStyle);
  } else {
    assign(style, props.style);
  }

  if (props.at) {
    var isArray = Array.isArray(props.at);
    var coords = {
      left: isArray
        ? props.at[0]
        : props.at.left === undefined
        ? props.at.x || props.at.pageX
        : props.at.left,

      top: isArray
        ? props.at[1]
        : props.at.top === undefined
        ? props.at.y || props.at.pageY
        : props.at.top,
    };

    assign(style, coords);
  }

  if (state.positionStyle && props.visible !== false) {
    style = { ...style, ...state.positionStyle };
  }

  const minMaxSize = getMinMaxSize(props);
  assign(style, minMaxSize);

  if (props.padding) {
    assign(style, { padding: props.padding });
  }

  if (props.border) {
    assign(style, { border: props.border });
  }

  if (typeof props.shadow === 'string') {
    assign(style, { boxShadow: props.shadow });
  }
  if (props.borderRadius) {
    assign(style, { borderRadius: props.borderRadius });
  }
  if (props.width) {
    assign(style, { width: props.width });
  }

  if (
    props.enableAnimation &&
    (state.transitionEnded || state.transitionStart)
  ) {
    assign(style, {
      transitionDuration: `${props.fadeDuration}ms`,
      transitionTimingFunction: props.transitionTimingFunction,
    });
  }

  return style;
}

export default prepareStyle;
