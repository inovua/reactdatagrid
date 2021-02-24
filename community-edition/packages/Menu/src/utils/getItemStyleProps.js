/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default props => {
  const {
    itemStyle,
    itemOverStyle,
    itemOverClassName,
    itemActiveStyle,
    itemActiveClassName,
    itemDisabledStyle,
    itemDisabledClassName,
    itemExpandedStyle,
    itemExpandedClassName,
    cellStyle,
    itemFocusedStyle,
    itemFocusedClassName,
    itemOverFocusedStyle,
  } = props;

  return {
    style: itemStyle,
    overStyle: itemOverStyle,
    overClassName: itemOverClassName,
    activeStyle: itemActiveStyle,
    activeClassName: itemActiveClassName,
    disabledStyle: itemDisabledStyle,
    disabledClassName: itemDisabledClassName,
    expandedStyle: itemExpandedStyle,
    expandedClassName: itemExpandedClassName,
    focusedStyle: itemFocusedStyle,
    focusedClassName: itemFocusedClassName,
    overFocusedStyle: itemOverFocusedStyle,
    cellStyle,
  };
};
