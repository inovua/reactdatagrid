/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import groupItems from './utils/groupItems';
import join from './utils/join';
import { REMAINING_ITEMS } from './ComboBox';

import Tag from './Tag';

class Value extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: null,
    };
  }

  render() {
    const { props } = this;
    const {
      value,
      multiple,
      rootClassName,
      toolsSize,
      focus,
      rtl,
      searchable,
      wrapMultiple,
      label,
    } = props;

    const showTags = value != null && multiple;
    const style = { ...props.style };
    if (toolsSize) {
      style.maxWidth = `calc(100% - ${toolsSize.width}px)`;
    }

    const className = join(
      rootClassName,
      wrapMultiple ? `${rootClassName}--wrap` : `${rootClassName}--no-wrap`,
      `${rootClassName}--${rtl ? 'rtl' : 'ltr'}`
    );

    let isDisplayValueVisible = !showTags && !focus;
    if (!showTags && !searchable) {
      isDisplayValueVisible = true;
    }

    if (value == null) {
      isDisplayValueVisible = false;
    }

    const displayValue = isDisplayValueVisible
      ? this.renderDisplayValue()
      : null;

    return (
      <div className={className} style={style}>
        {showTags && this.renderTags()}
        {displayValue}
        {this.renderTextInput({ isDisplayValueVisible: displayValue })}
      </div>
    );
  }

  renderTextInput({ isDisplayValueVisible }) {
    const textInput = this.props.textInput;
    if (!textInput) {
      return null;
    }

    if (textInput.type !== 'input') {
      return React.cloneElement(textInput, {
        ...textInput.props,
        visible: !isDisplayValueVisible && this.props.searchable,
      });
    }
    return textInput;
  }

  renderDisplayValue() {
    const { rootClassName, label, renderDisplayValue } = this.props;

    const domProps = {
      className: `${rootClassName}__display-value`,
      children: label,
    };

    let result = null;
    if (typeof renderDisplayValue === 'function') {
      result = renderDisplayValue({ domProps, label });
    }

    if (result == null) {
      result = <div {...domProps} />;
    }

    return result;
  }

  renderTags() {
    const { renderTags, value, items, groupedItems } = this.props;

    if (!items) {
      return null;
    }

    let remainingItems;
    let visibleItems;
    if (groupedItems) {
      remainingItems = groupedItems.remainingItems;
      visibleItems = groupedItems.visibleItems;
    } else {
      visibleItems = items;
    }

    const remainingTags =
      remainingItems &&
      this.renderTag(remainingItems, this.props.maxTagsLength, {
        visibleItems,
      });
    const visibleTags =
      visibleItems &&
      visibleItems.map((item, index) => this.renderTag(item, index));

    let tags = [...visibleTags, remainingTags];
    if (typeof renderTags === 'function') {
      tags = renderTags({
        tags,
        items,
        value,
        visibleItems,
        remainingItems,
      });
    }

    return tags;
  }

  renderTag(item, index, config = {}) {
    const items = this.props.items;
    if (!item) {
      return null;
    }
    const {
      rootClassName,
      renderTag,
      activeTag,
      maxTagsLength,
      renderTagLabel,
      renderRemainingTags,
    } = this.props;

    const tagRootClassName = `${rootClassName}__tag`;
    const isMultiple = Array.isArray(item);
    const active = isMultiple
      ? activeTag === REMAINING_ITEMS
      : activeTag === item.id;

    const tagProps = {
      item,
      items,
      active,
      isMultiple,
      renderTagLabel,
      maxTagsLength,
      index,
      renderTag,
      ...config,
      ...this.props.tagProps,
      rootClassName: tagRootClassName,
      key: index,
    };

    let tag;
    if (isMultiple && typeof renderRemainingTags === 'function') {
      tag = renderRemainingTags({
        remainingItems: item,
        visibleItems: config.visibleItems,
        domProps: tagProps,
      });
    }

    if (tag === undefined) {
      tag = <Tag {...tagProps} />;
    }

    return tag;
  }
}

Value.defaultProps = {
  tagProps: {},
  groupedItems: null,
  items: [],
};

const VALUE_TYPE = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.object,
  PropTypes.bool,
  PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.bool,
    ])
  ),
]);

Value.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  focus: PropTypes.bool,
  // tags
  items: PropTypes.array,
  item: PropTypes.object,
  groupedItems: PropTypes.shape({
    visibleItems: PropTypes.array,
    remainingItems: PropTypes.array,
  }),
  renderTag: PropTypes.func,
  renderRemainingTags: PropTypes.func,
  renderTags: PropTypes.func,
  renderTagLabel: PropTypes.func,
  tagProps: PropTypes.object, //  a way to group them together
  maxTagsLength: PropTypes.number,
  rootClassName: PropTypes.string,
  multiple: PropTypes.bool,
  textInput: PropTypes.node,
  value: VALUE_TYPE,
};

export default Value;
