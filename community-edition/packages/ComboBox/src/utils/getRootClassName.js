/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import join from './join';

function getRootClassName({ props = {}, state = {}, computed = {} }) {
  const {
    rootClassName,
    className,
    rtl,
    shadow,
    showShadowOnMouseOver,
    disabled,
    readOnly,
    emptyClassName,
    disabledClassName,
    focusedClassName,
    inlineFlex,
    multiple,
    theme,
  } = props;

  const { over, focus } = state;

  const { value } = computed;

  const showShadow = showShadowOnMouseOver ? over && shadow : shadow;

  return join(
    rootClassName,
    className,
    rtl ? `${rootClassName}--rtl` : `${rootClassName}--ltr`,
    showShadow && `${rootClassName}--shadow`,
    multiple && `${rootClassName}--multiple`,
    disabled && `${rootClassName}--disabled`,
    readOnly && `${rootClassName}--readOnly`,
    theme && `${rootClassName}--theme-${theme}`,
    inlineFlex && `${rootClassName}--inlineFlex`,
    focus && `${rootClassName}--focus`,
    !value && emptyClassName,
    disabled && disabledClassName,
    focus && focusedClassName
  );
}

export default getRootClassName;
