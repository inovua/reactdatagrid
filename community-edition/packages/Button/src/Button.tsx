/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';
import assign from '../../../common/assign';
import cleanProps from '../../../common/cleanProps';

import prepareClassName from './prepareClassName';
import uglified from '../../../packages/uglified';
import { getGlobal } from '../../../getGlobal';
import { TypeButtonProps, TypeButtonState, TypeButtonStates } from './types';

const globalObject = getGlobal();

function emptyFn() {}

const defaultProps = {
  isInovuaButton: true,
  // misc
  theme: 'default-light',
  rootClassName: 'inovua-react-toolkit-button',
  align: 'center',
  verticalAlign: 'middle',
  ellipsis: true,
  href: null,
  iconPosition: 'start',

  // events
  onFocus: emptyFn,
  onBlur: emptyFn,
  onToggle: emptyFn,
  onClick: emptyFn,
  onMouseEnter: emptyFn,
  onMouseUp: emptyFn,
  onMouseDown: emptyFn,
  onDeactivate: emptyFn,
  onMouseLeave: emptyFn,
  onActivate: emptyFn,

  showWarnings: !uglified,
};

const propTypes = {
  isInovuaButton: PropTypes.bool,
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  primary: PropTypes.bool,
  disabled: PropTypes.bool,
  pressed: PropTypes.bool,
  defaultPressed: PropTypes.bool,

  href: PropTypes.string,
  align: PropTypes.oneOf(['start', 'end', 'center', 'left', 'right']),
  verticalAlign: PropTypes.oneOf(['top', 'middle', 'center', 'bottom']),
  rtl: PropTypes.bool,
  wrap: PropTypes.bool,
  overflow: PropTypes.bool,

  // icon
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  iconPosition: PropTypes.oneOf([
    'top',
    'bottom',
    'left',
    'right',
    'start',
    'end',
  ]),

  // style
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  disabledStyle: PropTypes.object,
  focusedStyle: PropTypes.object,
  pressedStyle: PropTypes.object,
  overStyle: PropTypes.object,
  activeStyle: PropTypes.object,

  // classnames
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  overClassName: PropTypes.string,
  focusedClassName: PropTypes.string,
  disabledClassName: PropTypes.string,
  pressedClassName: PropTypes.string,

  // misc
  theme: PropTypes.string,
  rootClassName: PropTypes.string,
  ellipsis: PropTypes.bool,

  // events
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onToggle: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseDown: PropTypes.func,
  onDeactivate: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onActivate: PropTypes.func,

  showWarnings: PropTypes.bool,
};

class InovuaButton extends Component<TypeButtonProps, TypeButtonState> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private getRootRef: ReactNode;
  private rootNode: ReactNode;
  private tagName: string | (() => void) = 'div';

  constructor(props: TypeButtonProps) {
    super(props);

    this.state = {
      mouseOver: false,
      active: false,
      pressed: this.props.defaultPressed,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.getRootRef = (ref: ReactNode) => {
      this.rootNode = ref;
    };
  }

  componentDidUpdate = (
    prevProps: TypeButtonProps,
    prevState: TypeButtonState
  ) => {
    if (!prevProps.disabled && this.props.disabled && prevState.focused) {
      this.handleBlur();
      this.setState({ mouseOver: false });
    }

    if (prevProps.disabled && !this.props.disabled && this.state.focused) {
      this.handleBlur();
    }
  };

  handleKeyDown(event: KeyboardEvent): void {
    const { key } = event;
    if (this.tagName != 'button' && key == 'Enter') {
      this.props.onClick!(event);
      event.preventDefault();
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  render() {
    const props = this.props;
    const buttonStates: TypeButtonStates = this.getButtonStates();
    const style = this.prepareStyle(this.props, buttonStates);
    const className = prepareClassName(buttonStates, props);

    const domProps = {
      ...cleanProps(this.props, InovuaButton.propTypes),
      style,
      className,
      onClick: this.handleClick,
      onKeyDown: this.handleKeyDown,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      href: props.href,
    };

    const topBottomVerticalAlign =
      this.props.verticalAlign == 'top' || this.props.verticalAlign == 'bottom';

    const avoidButtonTag = !!this.props.icon || topBottomVerticalAlign;

    let TagName = this.props.tagName;

    if (!TagName && !avoidButtonTag) {
      TagName = 'button';
    }

    if (TagName == 'button' && avoidButtonTag) {
      if (this.props.showWarnings && console && console.warn) {
        console.warn(
          'Button html tags are not fully compatible with flexbox, so we\'re rendering a "div" instead. See http://stackoverflow.com/questions/35464067/flexbox-not-working-on-button-element-in-some-browsers for details.'
        );
      }
    }

    if (props.href) {
      TagName = 'a';
    }

    TagName = TagName || 'div';

    this.tagName = TagName;

    if (
      TagName === 'div' &&
      domProps.tabIndex === undefined &&
      !this.props.disabled
    ) {
      domProps.tabIndex = 0;
    }

    return (
      <TagName
        {...domProps}
        ref={this.getRootRef}
        children={this.prepareChildren(props, buttonStates)}
      />
    );
  }

  handleFocus(event?: FocusEvent): void {
    if (this.props.disabled) {
      return;
    }

    this.setState({ focused: true });
    this.props.onFocus!(event);
  }

  handleBlur(event?: FocusEvent): void {
    // if (this.props.disabled) {
    //   return;
    // }

    this.setState({ focused: false });
    this.props.onBlur!(event);
  }

  handleClick(event: MouseEvent): void {
    const props = this.props;
    if (props.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.isToggleButon()) {
      this.toggle();
    }

    this.props.onClick!(event);
  }

  isToggleButon() {
    return this.isPressed() !== undefined;
  }

  toggle(): void {
    const isPressed: boolean | undefined = this.isPressed();
    const newPressed: boolean = !isPressed;
    if (!this.isPressedControlled()) {
      this.setState({
        pressed: newPressed,
      });
    }
    this.props.onToggle!(newPressed);
  }

  isToggleButton(): boolean {
    return this.props.defaultPressed !== null || this.props.pressed !== null;
  }

  handleMouseEnter(event: MouseEvent): void {
    const { props } = this;
    if (props.disabled) {
      return;
    }

    this.setState({ mouseOver: true });
    this.props.onMouseEnter!(event);
  }

  handleMouseLeave(event: MouseEvent): void {
    const { props } = this;
    if (props.disabled) {
      return;
    }

    this.setState({ mouseOver: false });
    this.props.onMouseLeave!(event);
  }

  handleMouseUp(event: MouseEvent): void {
    const { props } = this;
    if (props.disabled) {
      return;
    }

    this.setState({ active: false });
    globalObject.removeEventListener('mouseup', this.handleMouseUp);

    props.onMouseUp!(event);
    props.onDeactivate!(event);
  }

  handleMouseDown(event: MouseEvent): void {
    const { props } = this;
    if (props.disabled) {
      return;
    }

    this.setState({ active: true });

    globalObject.addEventListener('mouseup', this.handleMouseUp);
    props.onMouseDown!(event);
    props.onActivate!(event);
  }

  isIconFirst(props: TypeButtonProps = this.props) {
    const { iconPosition, rtl } = props;
    const iconFirst =
      (iconPosition == 'left' && !rtl) ||
      iconPosition == 'top' ||
      (rtl && iconPosition == 'start') ||
      (rtl && iconPosition == 'right') ||
      (!rtl && iconPosition == 'start');

    return iconFirst;
  }

  prepareChildren(props: TypeButtonProps, buttonStates: TypeButtonStates) {
    let children = props.children;

    children = (
      <div
        key="text"
        className={`${this.props.rootClassName}__text`}
        children={children}
      />
    );

    let icon = this.props.icon;

    if (icon) {
      const iconFirst = this.isIconFirst(this.props);

      if (typeof icon == 'function') {
        icon = icon(buttonStates);
      }
      /**
       * icons with ellipsis
       * for inline-flex text-overflow doesn't work, in this case
       * the text is wrapped inside a div
       */

      const wrapIcon = (icon: ReactNode) => (
        <div
          key="iconWrapper"
          className={
            `${this.props.rootClassName}__icon-wrap` +
            (this.props.disabled
              ? ` ${this.props.rootClassName}__icon-wrap--disabled`
              : '')
          }
          children={icon}
        />
      );

      if (iconFirst) {
        children = [wrapIcon(icon), children];
      } else {
        children = [children, wrapIcon(icon)];
      }
    }

    if (this.props.renderChildren) {
      children = this.props.renderChildren(children);
    }

    return children;
  }

  getButtonStates(props?: TypeButtonProps) {
    props = props || this.props;

    return {
      disabled: props.disabled,
      children: props.children,
      active: this.isActive(),
      pressed: this.isPressed(),
      over: this.isOver(),
      focused: this.isFocused(),
      iconFirst: this.isIconFirst(),
      rtl: this.props.rtl,
      icon: this.props.icon,
      ellipsis: props.ellipsis,
      align: props.align,
      verticalAlign: props.verticalAlign,
      wrap: props.wrap,
      overflow: props.overflow,
      iconPosition: this.props.icon ? this.props.iconPosition : undefined,
    };
  }

  prepareStyle(
    props: TypeButtonProps = this.props,
    buttonStates: TypeButtonStates
  ) {
    const style =
      typeof props.style !== 'function'
        ? assign({}, props.style)
        : props.style(props, buttonStates);

    if (props.disabled) {
      assign(style, props.disabledStyle);
    } else {
      if (this.isPressed()) {
        assign(style, props.pressedStyle);
      }

      if (this.isFocused()) {
        assign(style, props.focusedStyle);
      }

      if (this.isOver()) {
        assign(style, props.overStyle);
      }

      if (this.isActive()) {
        assign(style, this.props.activeStyle);
      }
    }

    return style;
  }

  isActive() {
    return this.props.activeState == null
      ? !!this.state.active
      : this.props.activeState;
  }

  isOver() {
    return this.props.overState == null
      ? !!this.state.mouseOver
      : this.props.overState;
  }

  isFocused() {
    return this.props.focusedState == null
      ? !!this.state.focused
      : this.props.focusedState;
  }

  isPressedControlled() {
    return this.props.pressed != null;
  }

  isPressed(): boolean | undefined {
    return this.isPressedControlled() ? this.props.pressed : this.state.pressed;
  }

  getRootNode() {
    return this.rootNode;
  }
}

export default InovuaButton;
