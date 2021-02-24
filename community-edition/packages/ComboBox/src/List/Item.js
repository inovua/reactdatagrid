/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '../../../../common/cleanProps';
import join from '../utils/join';

class Item extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }
  render() {
    const {
      selected,
      rootClassName,
      selectedStyle,
      active,
      background,
      item,
      index,
      disabledStyle,
      disabledClassName,
      activeStyle,
      activeClassName,
      selectedClassName,
      renderItem,
      rtl,
      itemHeight,
      itemEllipsis,
    } = this.props;

    const disabled = item.disabled;

    const className = join(
      this.props.className,
      rootClassName,
      selected && `${rootClassName}--selected`,
      rtl && `${rootClassName}--rtl`,
      active && `${rootClassName}--active`,
      disabled && `${rootClassName}--disabled`,
      itemEllipsis && `${rootClassName}--ellipsis`,
      disabled && disabledClassName,
      active && activeClassName,
      selected && selectedClassName
    );

    const style = {
      ...this.props.style,
      ...(active && activeStyle),
      ...(disabled && disabledStyle),
      ...(selected && selectedStyle),
    };

    if (itemHeight) {
      style.height = itemHeight;
    }

    if (background) {
      style.background = background;
    }

    let label = this.props.label;
    /**
     * if we have a match, overwrite only if label is a string
     * if it is not a string, this means it was overwritten
     */
    const matchText = item.matchText;
    if (typeof label === 'string' && matchText) {
      label = matchText.map((textPart, index) => {
        if (typeof textPart === 'object') {
          return (
            <span className={`${rootClassName}__highlight`} key={index}>
              {textPart.match}
            </span>
          );
        }

        return textPart;
      });
    }

    const domProps = {
      ...cleanProps(this.props, Item.propTypes),
      style,
      className,
      onClick: this.handleClick,
      onMouseDown: this.handleMouseDown,
      children: label,
    };

    let result;
    if (typeof renderItem === 'function') {
      result = renderItem({ domProps, label, item, index });
    }

    if (result === undefined) {
      result = <div {...domProps} />;
    }

    return result;
  }

  handleMouseDown(event) {
    event.preventDefault();
  }

  handleClick() {
    if (this.props.item.disabled) {
      return null;
    }

    this.props.onClick(this.props.id);
  }
}

function emptyFn() {}

Item.defaultProps = {
  onClick: emptyFn,
  selectedStyle: {},
  item: {},
};

Item.propTypes = {
  rootClassName: PropTypes.string,
  itemHeight: PropTypes.number,
  itemEllipsis: PropTypes.bool,
  renderItem: PropTypes.func,
  selectedClassName: PropTypes.string,
  selectedStyle: PropTypes.object,
  background: PropTypes.string,
  active: PropTypes.bool,
  label: PropTypes.node,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  item: PropTypes.object,
  onClick: PropTypes.func,
  index: PropTypes.number,
  rtl: PropTypes.bool,
  disabledStyle: PropTypes.object,
  disabledClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  activeClassName: PropTypes.string,
};

export default Item;
