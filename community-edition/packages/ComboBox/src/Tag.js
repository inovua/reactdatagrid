/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '../../../common/cleanProps';
import join from './utils/join';
import getMinMaxSize from './utils/getMinMaxSize';
import { CloseIcon } from './Icons';

class Tag extends Component {
  constructor(props) {
    super(props);

    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleOnMultipleClose = this.handleOnMultipleClose.bind(this);
  }
  render() {
    const { props } = this;
    const {
      item,
      index,
      items,
      rootClassName,
      closeIconPosition,
      onClick,
      active,
      multiple,
      renderTag,
      isMultiple,
    } = props;

    const className = this.getClassName({ active });
    const labelClassName = `${rootClassName}__label`;
    const style = this.getStyle();
    const closeIcon = this.renderCloseIcon();
    const label = this.renderLabel();

    const domProps = {
      ...cleanProps(props, Tag.propTypes),
      key: `tag_${index}`,
      style,
      className,
      onMouseDown: event => {
        event.preventDefault(); // prevent input from losing focus
      },
      onClick: event => {
        event.stopPropagation();
        onClick(item.id);
      },
      children: [
        closeIconPosition === 'start' && closeIcon,
        <span key="tag_label" className={labelClassName}>
          {label}
        </span>,
        closeIconPosition === 'end' && closeIcon,
      ],
    };

    let result;
    if (typeof renderTag === 'function') {
      result = renderTag({
        domProps,
        item,
        index,
        items,
        isMultiple,
        props,
      });
    }

    if (result === undefined) {
      return <div {...domProps} />;
    }

    return result || null;
  }

  getClassName({ active }) {
    const { rootClassName, ellipsis, isMultiple } = this.props;

    const className = join(
      rootClassName,
      active && `${rootClassName}--active`,
      ellipsis && `${rootClassName}--ellipsis`,
      isMultiple && `${rootClassName}--multiple`
    );

    return className;
  }

  getStyle() {
    const { props } = this;
    const {
      border,
      padding,
      height,
      width,
      maxWidth,
      activeStyle,
      active,
    } = props;
    const minMaxSize = getMinMaxSize(props);
    let style = {
      ...props.style,
      ...minMaxSize,
    };
    if (border) {
      style.border = border;
    }
    if (padding) {
      style.padding = padding;
    }
    if (width) {
      style.width = width;
    }
    if (height) {
      style.height = height;
    }
    if (maxWidth) {
      style.maxWidth = maxWidth;
    }
    if (active && activeStyle) {
      style = {
        ...style,
        ...activeStyle,
      };
    }

    return style;
  }

  renderLabel() {
    const {
      index,
      maxTagsLength,
      renderTagLabel,
      items,
      item,
      isMultiple,
    } = this.props;
    let label = item.label;

    if (isMultiple) {
      if (item.length === 1) {
        label = item[0].label;
      } else {
        label =
          items.length === item.length
            ? `${item.length} item${item.length ? 's' : ''} selected`
            : `and other ${item.length} selected`;
      }
    }

    if (renderTagLabel) {
      return renderTagLabel({
        label,
        item,
        items,
        count: items.length,
        index,
        isMultiple,
        maxTagsLength,
        combined: isMultiple,
      });
    }

    return label;
  }

  renderCloseIcon() {
    const { closeIcon, rootClassName, isMultiple, item } = this.props;
    const closeClassName = `${rootClassName}__clear-icon`;

    if (!closeIcon) {
      return null;
    }

    const closeIconProps = {
      key: 'close_icon',
      onClick: isMultiple ? this.handleOnMultipleClose : this.handleOnClose,
      className: closeClassName,
    };

    let closeIconEl = closeIcon;
    if (typeof closeIcon === 'function') {
      const closeIconParams = {
        item,
        onDeselect: closeIconProps.onClick,
        domProps: closeIconProps,
      };

      closeIconEl = closeIcon(closeIconParams);
    } else {
      if (closeIcon && typeof closeIcon == 'object') {
        closeIconEl = cloneElement(closeIcon, {
          className: join(
            closeIcon.props && closeIcon.props.className,
            closeIconProps.className
          ),
          onClick:
            closeIcon.props && closeIcon.props.onClick
              ? event => {
                  closeIcon.props.onClick(event);
                  closeIconProps.onClick(event);
                }
              : closeIconProps.onClick,
        });
      }
    }

    if (closeIconEl === true || closeIconEl === undefined) {
      closeIconEl = <CloseIcon {...closeIconProps} />;
    }

    return closeIconEl;
  }

  handleOnMultipleClose() {
    const ids = this.props.item.map(item => item.id);
    this.props.onMultipleTagClose(ids);
  }

  handleOnClose(event) {
    const { onCloseTagClick, item } = this.props;
    // don't lose focus
    event.preventDefault();
    event.stopPropagation();

    const id = item.id;
    onCloseTagClick(id);
  }
}

Tag.displayName = 'Tag';

function emptyFn() {}

Tag.defaultProps = {
  onCloseTagClick: emptyFn,
  onMultipleTagClose: emptyFn,
  onClick: emptyFn,
  closeIconPosition: 'end',
  item: {},
  ellipsis: true,
  closeIcon: true,
};

Tag.propTypes = {
  active: PropTypes.bool,
  renderTag: PropTypes.func,
  renderTagLabel: PropTypes.func,
  index: PropTypes.number,
  onCloseTagClick: PropTypes.func,
  onMultipleTagClose: PropTypes.func,
  closeIcon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
    PropTypes.func,
  ]),
  closeIconPosition: PropTypes.oneOf(['start', 'end']),
  isRemaining: PropTypes.bool,
  onClick: PropTypes.func,

  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  items: PropTypes.array,
  isMultiple: PropTypes.bool,
  rootClassName: PropTypes.string,
  tags: PropTypes.array,

  // style
  border: PropTypes.string,
  visibleItems: PropTypes.array,
  activeStyle: PropTypes.object,
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ]),
  maxSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ]),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxTagsLength: PropTypes.number,
  ellipsis: PropTypes.bool,
};

export default Tag;
