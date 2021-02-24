/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const checkedIcon = ({ style, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50">
    <title>check button checked disabled</title>
    <desc>Created with Sketch.</desc>
    <defs />
    <g stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
      <g id="Artboard" transform="translate(-374.000000, -156.000000)">
        <g
          id="check-button-checked-disabled"
          transform="translate(374.000000, 156.000000)"
        >
          <rect
            id="Fill-87"
            fill="#9E9E9E"
            x="0"
            y="0"
            width="50"
            height="50"
            rx="2"
          />
          <polygon
            id="Path-Copy"
            fill="#FAFAFA"
            points="6 26.0555556 9.91666667 22.1388889 19.8888889 32.0833333 40.9722222 11 44.8888889 14.9444444 19.8888889 39.9444444"
          />
        </g>
      </g>
    </g>
  </svg>
);

const uncheckedIcon = ({ style, size = 24 }) => (
  <svg style={style} width={size} height={size} viewBox="0 0 50 50">
    <g stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
      <g
        id="Artboard"
        transform="translate(-374.000000, -70.000000)"
        fill="#9E9E9E"
      >
        <g
          id="check-button-icon-not-checked-disabled"
          transform="translate(374.000000, 70.000000)"
        >
          <path
            d="M0,1.99091407 C0,0.891362589 0.889064278,0 1.99091407,0 L48.0090859,0 C49.1086374,0 50,0.889064278 50,1.99091407 L50,48.0090859 C50,49.1086374 49.1109357,50 48.0090859,50 L1.99091407,50 C0.891362589,50 0,49.1109357 0,48.0090859 L0,1.99091407 Z M5,6.99729162 L5,43.0027084 C5,44.1084602 5.89421792,45 6.99729162,45 L43.0027084,45 C44.1084602,45 45,44.1057821 45,43.0027084 L45,6.99729162 C45,5.89153983 44.1057821,5 43.0027084,5 L6.99729162,5 C5.89153983,5 5,5.89421792 5,6.99729162 Z"
            id="Fill-87"
          />
        </g>
      </g>
    </g>
  </svg>
);

export { checkedIcon, uncheckedIcon };
