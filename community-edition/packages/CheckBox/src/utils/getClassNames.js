/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import join from '../../../../common/join';

const getClassNames = (props, state = {}, { checked } = {}) => {
  const {
    rtl,

    inlineBlock,
    readOnly,
    readOnlyClassName,
    theme,
    disabled,
    disabledClassName,
    focusedClassName,
    className,
    childrenPosition,
  } = props;
  const { focused } = state;

  return join(
    props.rootClassName,
    className,
    childrenPosition &&
      `${props.rootClassName}--children-position-${childrenPosition}`,
    rtl ? `${props.rootClassName}--rtl` : `${props.rootClassName}--ltr`,
    readOnly && join(`${props.rootClassName}--read-only`, readOnlyClassName),
    focused && join(`${props.rootClassName}--focused`, focusedClassName),
    disabled && join(`${props.rootClassName}--disabled`, disabledClassName),
    inlineBlock && `${props.rootClassName}--inline-block`,
    checked === true
      ? `${props.rootClassName}--checked`
      : checked === false
      ? `${props.rootClassName}--unchecked`
      : `${props.rootClassName}--indeterminate`,
    theme && `${props.rootClassName}--theme-${theme}`
  );
};

export default getClassNames;
