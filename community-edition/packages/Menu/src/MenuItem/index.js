/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Component from '../../../../packages/react-class';
import MenuItemCell from './MenuItemCell';
import Expander from '../Expander';
import renderCell from './renderCell';
import CheckBox from '../../../CheckBox';
import RadioButton from '../../../RadioButton';

import assign from '../../../../common/assign';
import join from '../../../../common/join';
import cleanProps from '../../../../common/cleanProps';
import getRegionRelativeToParent from '../getRegionRelativeToParent';

const emptyFn = () => {};

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const props = (this.preparedProps = this.prepareProps(
      this.props,
      this.state
    ));
    const className = props.className;
    return (
      <tr
        {...cleanProps(props, MenuItem.propTypes)}
        style={props.style}
        className={className}
        ref={node => (this.node = node)}
      >
        {this.renderCells()}
      </tr>
    );
  }

  UNSAFE_componentWillReceiveProps() {}

  componentDidMount() {
    this.componentIsMounted = true;
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
  }

  prepareProps(props, state) {
    const preparedProps = {
      ...props,
      mouseOver: !!state.mouseOver,
      active: !!state.active,
      disabled: !!props.disabled,
      className: this.getClassName(),
      style: this.getStyle(),
      onClick: this.handleClick,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      onMouseDown: this.handleMouseDown,
      onTouchStart: this.handleTouchStart,
    };

    if (props.item.isTitle) {
      delete preparedProps.mouseOver;
      delete preparedProps.active;
      delete preparedProps.onClick;
      delete preparedProps.onMouseEnter;
      delete preparedProps.onMouseLeave;
      delete preparedProps.onMouseDown;
      delete preparedProps.onTouchStart;
    }

    return preparedProps;
  }

  handleClick(event) {
    const { props } = this;
    if (props.disabled && event.stopPropagation) {
      event.stopPropagation();
      return;
    }

    if (this.props.onClick) {
      this.props.onClick(event, props, props.index);
    }
    if (this.props.item.onClick) {
      this.props.item.onClick(event, props, props.index);
    }
  }

  handleMouseDown() {
    const mouseUpListener = () => {
      if (this.componentIsMounted) {
        this.setState({
          active: false,
        });
      }
      global.removeEventListener('mouseup', mouseUpListener);
    };

    global.addEventListener('mouseup', mouseUpListener);
    if (this.componentIsMounted) {
      this.setState({
        active: true,
      });
    }
  }
  handleTouchStart(event) {
    const { props } = this;
    const mouseUpListener = () => {
      if (this.componentIsMounted) {
        this.setState({
          active: false,
        });
      }
      global.removeEventListener('touchend', mouseUpListener);
    };

    global.addEventListener('touchend', mouseUpListener);
    if (this.componentIsMounted) {
      this.setState({
        active: true,
      });
    }
    if (!this.props.item.items) {
      return;
    }
    if (this.state.mouseOver) {
      this.handleMouseLeave(event);
    } else {
      this.handleMouseEnter(event);
    }
  }

  showMenu(menu, props) {
    props.showMenu(menu, this.getOffset());
  }

  handleMouseEnter(event) {
    const { props } = this;

    if (props.disabled) {
      return;
    }

    this.mouseInside = true;

    this.setState({
      mouseOver: true,
    });

    if (props.onMouseOver) {
      let menuOffset;

      if (props.hasSubMenu) {
        menuOffset = this.getOffset();
      }

      props.onMouseOver({
        event,
        menuOffset,
        itemProps: props,
        index: props.index,
        hasSubMenu: props.hasSubMenu,
      });
    }
  }

  handleMouseLeave(event) {
    const { props } = this;
    if (props.disabled) {
      return;
    }

    const offset = {
      x: event.clientX,
      y: event.clientY,
    };

    if (this.componentIsMounted) {
      this.setState({
        active: false,
        mouseOver: false,
      });
    }

    if (props.onMouseOut) {
      props.onMouseOut({
        itemPorps: props,
        leaveOffset: offset,
        index: props.index,
        hasSubMenu: props.hasSubMenu,
      });
    }
  }

  renderCells() {
    const { props } = this;
    const cells = props.columns.map((...args) => renderCell(props, ...args));

    if (props.enableSelection && props.name) {
      const input = this.renderSelectInput();
      if (this.props.selectionInputPosition === 'end') {
        cells.push(input);
      } else {
        cells.unshift(input);
      }
    }

    if (props.hasSubMenu) {
      const expander = this.renderExpander();
      cells.push(expander);
    }

    return cells;
  }

  getCommonCellProps() {
    const { props } = this;
    return {
      rootClassName: props.rootClassName,
      rtl: props.rtl,
    };
  }

  renderSelectInput() {
    const { props } = this;
    const multiple = props.multiple;
    const className = join(
      `${props.rootClassName}__cell__input`,
      props.browserNativeSelectInputs &&
        `${props.rootClassName}__cell__input--browser-native`,
      multiple && `${props.rootClassName}__cell__input--multiple`
    );

    const onChange = checked => {
      if (checked === undefined) {
        checked = !props.checked;
      }
      if (typeof checked !== 'boolean' && this.props.showWarnings) {
        console.warn('"onChange" should be called with a boolean param!');
      }
      props.onSelectChange({
        name: props.name,
        value: props.value,
        multiple,
        checked,
      });
    };

    const inputProps = {
      className,
      // no need to call onChange when selection is updated via intercepting onClick
      onChange: props.selectOnClick ? emptyFn : onChange,
      iconSize: multiple ? props.checkIconSize : props.radioIconSize,
      name: props.name,
      disabled: props.disabled,
      checked: props.checked,
      focusable: false,
      supportIndeterminate: false,
      browserNative: props.browserNativeSelectInputs,
      theme: props.theme,
    };

    const cellProps = {
      key: 'select',
      ...this.getCommonCellProps(),
    };

    cellProps.className = join(
      cellProps.className,
      `${props.rootClassName}__cell--has-input`,
      props.multiple && `${props.rootClassName}__cell--checkbox`,
      !props.multiple && `${props.rootClassName}__cell--radio`
    );

    let Input = multiple ? CheckBox : RadioButton;

    const renderFunction = multiple
      ? this.props.renderCheckInput
      : this.props.renderRadioInput;

    let result;
    if (typeof renderFunction === 'function') {
      result = renderFunction({
        domProps: inputProps,
        onChange,
        disabled: props.disabled,
        checked: props.checked,
      });
    }

    if (result === undefined) {
      result = <Input {...inputProps} />;
    }

    return <MenuItemCell {...cellProps}>{result}</MenuItemCell>;
  }

  renderExpander() {
    const { props } = this;
    let expander = props.expander;

    if (props.item && props.item.expander !== undefined) {
      expander = props.item.expander;
    }

    const style = {
      ...props.expanderStyle,
      ...(props.item && props.item.expanderStyle),
    };

    const expanderProps = {
      style,
      size: props.expanderSize,
      onClick: props.onExpanderClick,
      ...this.getCommonCellProps(),
    };

    if (typeof expander === 'function') {
      expander = expander(expanderProps, props.item);
    }

    if (expander === undefined || expander === true) {
      expander = <Expander {...expanderProps} />;
    }

    return (
      <MenuItemCell
        key="expander"
        className={`${props.rootClassName}__cell--has-expander`}
        expander={expander}
        {...expanderProps}
      />
    );
  }

  getStyle() {
    const { props, state } = this;
    const style = assign({}, props.style, props.item.style);

    if (props.item.isTitle && props.titleStyle) {
      assign(style, props.titleStyle, props.item.titleStyle);
    }

    if (state.mouseOver) {
      assign(style, props.itemOverStyle, props.overStyle, props.item.overStyle);
    }

    if (state.active) {
      assign(
        style,
        props.itemActiveStyle,
        props.activeStyle,
        props.item.activeStyle
      );
    }

    if (props.expanded) {
      assign(style, props.expandedStyle, props.item.expandedStyle);
    }

    if (props.focused) {
      assign(style, props.focusedStyle, props.item.focusedStyle);
    }

    if (props.focused && state.mouseOver) {
      assign(style, props.overFocusedStyle, props.item.overFocusedStyle);
    }

    if (props.height) {
      assign(style, { height: props.height });
    }

    // when disabled other style do not apply
    if (props.disabled) {
      assign(
        style,
        props.itemDisabledStyle,
        props.disabledStyle,
        props.item.disabledStyle
      );
    }

    return style;
  }

  getClassName() {
    const { props, state } = this;
    const baseClassName = `${props.rootClassName}__row`;

    let className = join(
      props.className,
      props.item.className,
      baseClassName,
      state.mouseOver && `${baseClassName}--over`,
      state.mouseOver && props.item.overClassName,
      state.mouseOver && props.overClassName,
      state.active && `${baseClassName}--active`,
      state.active && props.item.activeClassName,
      state.active && props.activeClassName,
      props.expanded && `${baseClassName}--expanded`,
      props.expanded && props.item.expandedClassName,
      props.expanded && props.expandedClassName,
      props.focused && `${baseClassName}--focused`,
      props.focused && props.item.focusedClassName,
      props.focused && props.focusedClassName,
      props.item.isTitle && `${baseClassName}--title`,
      props.checked && `${baseClassName}--checked`
    );

    // when disabled only disabled className is applied
    if (props.disabled) {
      className = join(
        props.className,
        baseClassName,
        props.disabled && `${baseClassName}--disabled`,
        props.disabled && props.itemDisabledClassName,
        props.disabled && props.item.disabledClassName
      );
    }

    return className;
  }

  getOffset() {
    return getRegionRelativeToParent(this.node, this.props.rootClassName);
  }

  getPreparedProps() {
    return this.preparedProps;
  }

  hasSubmenu() {
    return !!this.props.hasSubMenu;
  }

  getDOMNode() {
    return this.node;
  }

  getValue() {
    const { props } = this;
    return props.item[props.valueProperty];
  }

  getName() {
    const { props } = this;
    return props.item[props.valueProperty];
  }
}

MenuItem.defaultProps = {
  isMenuItem: true,
  item: {},
  columns: ['label'],
  enableSelection: false,
  allowUnselect: false,
};

MenuItem.propTypes = {
  rootClassName: PropTypes.string,
  style: PropTypes.object,
  titleStyle: PropTypes.object,
  height: PropTypes.number,
  dismissOnClick: PropTypes.bool,
  siblingItemHasSubMenu: PropTypes.bool,

  overStyle: PropTypes.object,
  overClassName: PropTypes.string,

  activeStyle: PropTypes.object,
  activeClassName: PropTypes.string,

  disabledStyle: PropTypes.object,
  disabledClassName: PropTypes.string,

  expandedStyle: PropTypes.object,
  expandedClassName: PropTypes.string,

  focusedStyle: PropTypes.object,
  focusedClassName: PropTypes.string,

  cellStyle: PropTypes.object,
  expanderStyle: PropTypes.object,

  overFocusedStyle: PropTypes.object,
  columns: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
  item: PropTypes.object,
  expanded: PropTypes.bool,
  globalCellStyle: PropTypes.object,
  itemDisabledStyle: PropTypes.object,
  itemDisabledClassName: PropTypes.string,
  itemOverStyle: PropTypes.object,
  itemActiveStyle: PropTypes.object,
  menuHasSubmenu: PropTypes.bool,
  hasSubMenu: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  ),
  isMenuItem: PropTypes.bool,
  focused: PropTypes.bool,
  index: PropTypes.number,
  rtl: PropTypes.bool,
  expander: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool,
    PropTypes.func,
  ]),
  expanderSize: PropTypes.number,
  expandedIndex: PropTypes.number,
  onExpanderClick: PropTypes.func,
  closeSubMenu: PropTypes.func,
  closeSubmenuRecursively: PropTypes.func,
  submenuWillUnmount: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  mouseOver: PropTypes.bool,
  active: PropTypes.bool,
  menu: PropTypes.node,

  // selection
  onSelectChange: PropTypes.func,
  enableSelection: PropTypes.bool,
  allowUnselect: PropTypes.bool,
  selectOnClick: PropTypes.bool,
  name: PropTypes.any,
  value: PropTypes.any,
  renderCheckInput: PropTypes.func,
  renderRadioInput: PropTypes.func,
  selectionInputPosition: PropTypes.oneOf(['start', 'end']),
  checkIconSize: PropTypes.number,
  radioIconSize: PropTypes.number,
  browserNativeSelectInputs: PropTypes.bool,
  showWarnings: PropTypes.bool,
};

export default MenuItem;
