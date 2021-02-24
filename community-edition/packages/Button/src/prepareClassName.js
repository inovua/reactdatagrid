/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import join from '../../../common/join';

/**
 * [prepareClassName description]
 * @param  {Object} states
 * @param  {Object} classNames
 * @return {String}
 */
function prepareClassName(states = {}, classNames = {}) {
  const {
    disabled,
    icon,
    active,
    pressed,
    over,
    children,
    focused,
    iconFirst,
    rtl,
    ellipsis,
    align,
    verticalAlign,
    wrap,
    overflow,
    iconPosition,
  } = states;

  const {
    className,
    rootClassName,
    disabledClassName,
    activeClassName,
    pressedClassName,
    overClassName,
    focusedClassName,
    theme,
  } = classNames;

  const preparedClassname = join(
    className,
    rootClassName,
    theme && `${rootClassName}--theme-${theme}`,
    disabled && disabledClassName,
    disabled && `${rootClassName}--disabled`,
    active && activeClassName,
    active && `${rootClassName}--active`,
    pressed && pressedClassName,
    pressed && `${rootClassName}--pressed`,
    over && overClassName,
    over && `${rootClassName}--over`,
    focused && focusedClassName,
    focused && `${rootClassName}--focused`,
    rtl ? `${rootClassName}--rtl` : `${rootClassName}--ltr`,
    ellipsis && `${rootClassName}--ellipsis`,
    align && `${rootClassName}--align-${align}`,
    !children && `${rootClassName}--no-children`,
    verticalAlign && `${rootClassName}--vertical-align-${verticalAlign}`,
    overflow === true && `${rootClassName}--overflow-visible`,
    overflow === false && `${rootClassName}--overflow-hidden`,
    wrap === true && `${rootClassName}--wrap`,
    wrap === false && `${rootClassName}--nowrap`,
    icon && `${rootClassName}--has-icon`,
    iconPosition && `${rootClassName}--icon-position-${iconPosition}`,
    iconFirst ? `${rootClassName}--icon-first` : `${rootClassName}--icon-last`
  );

  return preparedClassname;
}

export default prepareClassName;
