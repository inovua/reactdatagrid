/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import region from '../../../packages/region-align';
import join from '../../../common/join';
import Menu from '../../Menu';
import Button from '../../Button';
import ToggleIcon from '../../../common/ToggleIcon';
import cleanProps from '../../../common/cleanProps';
import containsNode from '../../../common/containsNode';

const ALIGN_OFFSET = { top: 5 };

const returnFalse = () => false;

class InovuaDropDownButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: props.defaultExpanded,
      focused: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleWindowScroll = this.handleWindowScroll.bind(this);
    this.onMenuDismiss = this.onMenuDismiss.bind(this);
    this.rootRef = ref => {
      this.rootNode = ref;
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.shouldComponentUpdate) {
      return nextProps.shouldComponentUpdate(nextProps, nextState, this);
    }

    return true;
  }

  onMenuDismiss() {
    this.props.onDismiss();
  }

  handleKeyDown(event) {
    const { key } = event;

    if (this.props.hideMenuOnEscape && this.getExpanded()) {
      this.collapse();
      event.preventDefault();
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  componentDidMount() {
    this.updateComponentReferenceRegion();
    if (this.props.dismissOnScroll) {
      window.addEventListener('scroll', this.handleWindowScroll, {
        capture: true,
      });
      window.addEventListener('scroll', this.handleWindowScroll, {
        capture: false,
      });
    }

    global.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    global.removeEventListener('click', this.handleClickOutside);
    global.removeEventListener('scroll', this.handleWindowScroll, {
      capture: true,
    });
    global.removeEventListener('scroll', this.handleWindowScroll, {
      capture: false,
    });
  }

  render() {
    const { props } = this;

    const className = join(
      props.rootClassName,
      props.className,
      props.theme && `${props.rootClassName}--theme-${props.theme}`,
      this.state.focused && `${props.rootClassName}--focused`,
      props.disabled && `${props.rootClassName}--disabled`,
      this.getExpanded() && `${props.rootClassName}--expanded`,
      props.rtl ? `${props.rootClassName}--rtl` : `${props.rootClassName}--ltr`
    );

    return (
      <div
        {...cleanProps(props, InovuaDropDownButton.propTypes)}
        ref={this.rootRef}
        className={className}
      >
        {this.renderButton()}
        {this.renderMenu()}
      </div>
    );
  }

  renderButton() {
    const { props } = this;
    const className = `${props.rootClassName}__button`;
    const buttonProps = {
      ...this.getCommonProps(),
      key: 'button',
      iconPosition: this.props.iconPosition || this.props.arrowPosition,
      style: { ...props.buttonProps },
      ...props.buttonProps,
      className,
      icon: props.icon,
      disabled: props.disabled,
      onClick: this.handleClick,
      rtl: props.rtl,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onKeyDown: this.handleKeyDown,
      icon: [
        props.icon && props.icon.type
          ? cloneElement(props.icon, { key: 'inovua-ddbuttonicon' })
          : props.icon,
        this.renderArrow(),
      ],
      children: props.children,
      tagName: 'div',
    };

    let result;
    if (typeof props.renderButton === 'function') {
      result = props.renderButton(buttonProps);
    }
    if (result === undefined) {
      result = <Button {...buttonProps} />;
    }

    return result;
  }

  handleClick(event) {
    if (this.props.hideMenuOnClick) {
      this.toggle();
    } else {
      this.expand();
    }

    this.props.onClick(event);
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
  handleBlur(event) {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      focused: false,
    });

    this.props.onBlur(event);
  }

  expand() {
    this.setExpanded(true);
  }

  collapse() {
    this.setExpanded(false);
  }

  toggle() {
    const expanded = this.getExpanded();
    this.setExpanded(!expanded);
  }

  isExpandedControlled() {
    return this.props.expanded != undefined;
  }

  setExpanded(expanded) {
    if (expanded === this.getExpanded()) {
      return null;
    }
    if (!this.isExpandedControlled()) {
      this.setState({ expanded });
      this.updateComponentReferenceRegion();
    }

    if (!expanded) {
      this.props.onDismiss();
    }

    this.props.onExpandedChange(expanded);
  }

  getExpanded() {
    return this.isExpandedControlled()
      ? this.props.expanded
      : this.state.expanded;
  }

  updateComponentReferenceRegion() {
    const node = this.props.getAlignNode
      ? this.props.getAlignNode()
      : this.rootNode;
    if (!node) {
      return null;
    }

    const referenceRegion = region.from(node);
    this.setState({
      referenceRegion,
    });
  }

  renderMenu(props = this.props) {
    const expanded = this.getExpanded();
    if (!expanded && !this.props.renderMenuWhenCollapsed) {
      return;
    }

    if (!props.items || !props.items.length) {
      return null;
    }
    const style = {
      ...props.menuProps.style,
    };

    if (!expanded) {
      style.display = 'none';
    }

    const menuProps = {
      ...this.getCommonProps(),
      key: 'menu',
      items: props.items,
      alignOffset: ALIGN_OFFSET,
      constrainTo: props.constrainTo,
      ...props.menuProps,
      alignTo: this.state.referenceRegion,
      alignPositions: props.alignPositions,
      onChildClick: props.onMenuClick,
      rtl: props.rtl,
      style,
      visible: expanded,
      theme: 'default',
      className: `${props.rootClassName}__menu`,
      onDismiss: this.onMenuDismiss,
    };

    if (
      !expanded &&
      !this.prevExpanded &&
      this.props.optimizeMenuSCUWhenCollapsed
    ) {
      menuProps.shouldComponentUpdate = returnFalse;
    }

    this.prevExpanded = expanded;

    const MenuComp = this.props.menu ? this.props.menu : Menu;

    if (!MenuComp) {
      return null;
    }

    let result;
    if (typeof props.renderMenu === 'function') {
      result = props.renderMenu(menuProps);
    }
    if (result === undefined) {
      result = <MenuComp {...menuProps} />;
    }

    return result;
  }

  renderArrow() {
    const { props } = this;

    let result = null;
    if (props.arrow !== true) {
      if (typeof props.arrow === 'function') {
        result = props.arrow(this.getExpanded());
      } else {
        result = props.arrow;
      }
    }

    if (result === null) {
      result = (
        <ToggleIcon
          key="icon"
          className={`${props.rootClassName}__arrow`}
          expanded={this.getExpanded()}
        />
      );
    }

    return result;
  }

  getCommonProps() {
    const { props } = this;

    return {
      theme: props.theme,
    };
  }

  handleClickOutside(event) {
    const node = this.rootNode;
    const target = event.target;
    if (!node || !target) {
      return null;
    }

    if (node !== target && !node.contains(target)) {
      if (this.props.hideMenuOnClickOutside) {
        this.collapse();
      }
    }
  }

  handleWindowScroll(event) {
    if (this.getExpanded() && !containsNode(this.rootNode, event.target)) {
      this.setExpanded(false);
    }
  }
}

function emptyFn() {}

InovuaDropDownButton.defaultProps = {
  rootClassName: 'inovua-react-toolkit-dropdown-button',
  theme: 'default',
  menuProps: {},
  rtl: false,
  menu: null,
  alignPositions: [
    'tl-bl',
    'tr-br',
    'bl-tl',
    'br-tr',
    'tl-tr',
    'bl-br',
    'tr-tl',
    'tr-br',
  ],
  arrow: true,
  arrowPosition: 'end',
  constrainTo: true,
  disabled: false,
  hideMenuOnClick: true,
  hideMenuOnClickOutside: true,
  hideMenuOnEscape: true,
  onExpandedChange: emptyFn,
  onMenuClick: emptyFn,
  optimizeMenuSCUWhenCollapsed: false,
  onClick: emptyFn,
  onFocus: emptyFn,
  onBlur: emptyFn,
  onDismiss: emptyFn,
  defaultExpanded: false,
  dismissOnScroll: false,
  isInovuaButton: true,
};

InovuaDropDownButton.propTypes = {
  theme: PropTypes.string,
  rtl: PropTypes.bool,
  dismissOnScroll: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right', 'start', 'end']),
  rootClassName: PropTypes.string,
  menuProps: PropTypes.object,
  buttonProps: PropTypes.object,
  disabled: PropTypes.bool,
  menu: PropTypes.func,
  arrow: PropTypes.oneOfType([PropTypes.node, PropTypes.bool, PropTypes.func]),
  alignPositions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onDismiss: PropTypes.func,
  arrowPosition: PropTypes.oneOf(['left', 'right', 'start', 'end']),
  hideMenuOnClick: PropTypes.bool,
  hideMenuOnEscape: PropTypes.bool,
  hideMenuOnClickOutside: PropTypes.bool,
  renderMenuWhenCollapsed: PropTypes.bool,
  optimizeMenuSCUWhenCollapsed: PropTypes.bool,
  onExpandedChange: PropTypes.func,
  onMenuClick: PropTypes.func,
  onClick: PropTypes.func,
  getAlignNode: PropTypes.func,
  constrainTo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
  ]),
  items: PropTypes.array,
  expanded: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
  pressed: PropTypes.bool,
  renderMenu: PropTypes.func,
  renderButton: PropTypes.func,
  isInovuaButton: PropTypes.bool,
};

export default InovuaDropDownButton;
