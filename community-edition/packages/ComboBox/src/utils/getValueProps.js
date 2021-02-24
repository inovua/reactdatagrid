/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Selects valid props for Value
 */
function getValueProps({ state, props, computed, tagProps }) {
  const {
    multiple,

    renderTag,
    renderTags,
    tagBorder,
    tagStyle,
    tagPadding,
    tagHeight,
    tagWidth,
    tagMinSize,
    tagMaxSize,
    wrapMultiple,
    tagCloseIcon,
    tagCloseIconPosition,
    maxTagsLength,
    rtl,
    renderRemainingTags,
    renderDisplayValue,
    searchable,
    renderTagLabel,
  } = props;

  const { focus } = state;

  const rootClassName = `${props.rootClassName}__value`;

  tagProps = {
    ...tagProps,
    closeIcon: tagCloseIcon,
    border: tagBorder,
    style: tagStyle,
    padding: tagPadding,
    height: tagHeight,
    width: tagWidth,
    minSize: tagMinSize,
    maxSize: tagMaxSize,
    closeIconPosition: tagCloseIconPosition,
    ellipsis: props.tagEllipsis,
  };

  const valueProps = {
    renderTagLabel,
    multiple,
    searchable,
    rootClassName,
    renderTag,
    renderRemainingTags,
    renderTags,
    tagProps,
    wrapMultiple,
    maxTagsLength,
    focus,
    maxTagsLength,
    rtl,
    renderDisplayValue,
    ...computed,
  };

  return valueProps;
}

export default getValueProps;
