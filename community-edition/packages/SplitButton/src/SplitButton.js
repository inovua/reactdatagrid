/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '../../../common/cleanProps';
import DropdownButton from '../../DropdownButton';
import Button from '../../Button';
import join from '../../../common/join';

class InovuaSplitButton extends Component {
  constructor(props) {
    super(props);

    this.buttonRef = createRef();

    this.state = {
      focused: false,
      expanded: props.defaultExpanded,
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.onExpandedChange = this.onExpandedChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  onExpandedChange(expanded) {
    this.props.onExpandedChange(expanded);

    if (this.props.expanded === undefined) {
      this.setState({
        expanded,
      });
    }
  }

  getExpanded() {
    return this.props.expanded === undefined
      ? this.state.expanded
      : this.props.expanded;
  }

  handleBlur(event) {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      focused: false,
    });

    this.props.onBlur(event);
  }
  handleFocus(event) {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      focused: true,
    });

    this.props.onFocus(event);
  }
  render() {
    const { props } = this;

    const className = join(
      props.rootClassName,
      props.className,
      props.rtl ? `${props.rootClassName}--rtl` : `${props.rootClassName}--ltr`,
      this.state.focused && `${props.rootClassName}--focused`,
      this.getExpanded() && `${props.rootClassName}--expanded`,
      props.disabled && `${props.rootClassName}--disabled`,
      props.theme && `${props.rootClassName}--theme-${props.theme}`
    );

    return (
      <div
        {...cleanProps(props, InovuaSplitButton.propTypes)}
        ref={this.buttonRef}
        className={className}
      >
        <Button {...this.getCommonProps()} {...this.getButtonProps()} />
        <DropdownButton
          {...this.getCommonProps()}
          {...this.getDropdownButtonProps()}
        />
      </div>
    );
  }

  getCommonProps() {
    const { props } = this;

    return {
      disabled: props.disabled,
      rtl: props.rtl,
      theme: props.theme,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
    };
  }

  getButtonProps() {
    const { props } = this;

    return {
      tagName: props.tagName,
      icon: props.icon,
      iconPosition: props.iconPosition || props.arrowPosition,
      ...props.buttonProps,
      onClick: (...args) => {
        props.onClick(...args);
        if (typeof props.buttonProps === 'function') {
          props.buttonProps.onClick(...args);
        }
      },

      children: props.children,
      className: join(
        `${props.rootClassName}__button`,
        props.buttonProps.className
      ),
    };
  }

  getDropdownButtonProps() {
    const { props } = this;
    return {
      ...props.dropdownButtonWrapperProps,
      getAlignNode: () => {
        const node = this.buttonRef.current;

        return node;
      },
      onClick: props.onDropdownButtonClick,
      onExpandedChange: this.onExpandedChange,
      items: props.items,
      expanded: props.expanded,
      defaultExpanded: props.defaultExpanded,
      onMenuClick: props.onMenuClick,
      menu: props.menu,
      buttonProps: props.dropdownButtonProps,
      menuProps: props.menuProps,
      renderMenu: props.renderMenu,
      className: join(
        `${props.rootClassName}__dropdown-button`,
        props.menuProps.className
      ),
    };
  }
}

function emptyFn() {}

InovuaSplitButton.defaultProps = {
  rootClassName: 'inovua-react-toolkit-split-button',
  theme: 'default',
  onClick: emptyFn,
  onDropdownButtonClick: emptyFn,
  onMenuClick: emptyFn,
  onFocus: emptyFn,
  onBlur: emptyFn,
  onExpandedChange: emptyFn,
  items: [],
  buttonProps: {},
  menuProps: {},
  defaultExpanded: false,
  arrowPosition: 'end',
  rtl: false,
  isInovuaButton: true,
};

InovuaSplitButton.propTypes = {
  rtl: PropTypes.bool,
  isInovuaButton: PropTypes.bool,
  theme: PropTypes.string,
  tagName: PropTypes.string,
  renderMenu: PropTypes.func,
  theme: PropTypes.string,
  rootClassName: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right', 'start', 'end']),
  arrowPosition: PropTypes.oneOf(['left', 'right', 'start', 'end']),
  buttonProps: PropTypes.object,
  dropdownButtonWrapperProps: PropTypes.object,
  dropdownButtonProps: PropTypes.object,
  disabled: PropTypes.bool,
  onExpandedChange: PropTypes.func,
  onDropdownButtonClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  onClick: PropTypes.func,
  menuProps: PropTypes.object,
  items: PropTypes.array,
  menu: PropTypes.func,
  expanded: PropTypes.bool,
  pressed: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
};

export default InovuaSplitButton;
