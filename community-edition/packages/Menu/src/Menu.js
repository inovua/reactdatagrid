/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Component from '../../../packages/react-class';
import Region from '../../../packages/region-align';
import uglified from '../../../packages/uglified';

import shallowequal from '../../../common/shallowequal';
import ArrowScroller from '../../ArrowScroller';
import MenuItem from './MenuItem';
import MenuSeparator from './MenuSeparator';

import containsNode from '../../../common/containsNode';
import cleanProps from '../../../common/cleanProps';
import join from '../../../common/join';
import assign from '../../../common/assign';
import getConstrainRegion from '../../../common/getConstrainRegion';
import isMobile from '../../../common/isMobile';

import prepareStyle from './utils/prepareStyle';
import getFirstNonDisabledItem from './utils/getFirstNonDisabledItem';
import getNextNavigableItem from './utils/getNextNavigableItem';
import getSeparatorIndexes from './utils/getSeparatorIndexes';
import prepareAlignOffset from './utils/prepareAlignOffset';
import getSingleSelectNames from './utils/getSingleSelectNames';
import {
  increaseLastColumnColSpan,
  increaseFirstColumnColSpan,
} from './utils/increaseColSpan';
import getRegionRelativeToParent from './getRegionRelativeToParent';
import shouldComponentUpdate from '../../../common/shouldComponentUpdate';
import getSubMenuStyle from './getSubMenuStyle';
import getItemStyleProps from './utils/getItemStyleProps';
import {
  alignPositionLTR,
  alignPositionRTL,
  alignOffsetLTR,
  alignOffsetRTL,
} from './submenuAlignPositions';

import { IS_IE, IS_FF } from '../../../common/ua';

function emptyFn() {}

const raf = global.requestAnimationFrame;

const getAlignToRegion = (alignTo, node) => {
  if (typeof alignTo === 'function') {
    alignTo = alignTo(node);
  }
  if (typeof alignTo == 'string') {
    alignTo = global.document
      ? global.document.querySelector(alignTo)
      : alignTo;
  }

  return Region.from(alignTo);
};

class InovuaMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOver: false,
      hidden: true,
      enableAnimation: false,
      transitionEnded: false,
      hasScroll: false,

      activeSubMenuIndex: null,
      nextActiveSubMenuIndex: null,

      /**
       * It is considered that if it has scroll
       * the top arrow will be initaly hidden
       * and the bottom arrow visible
       */
      showUpArrow: false,
      showDownArrow: true,

      // navigation
      focusedItem: props.enableKeyboardNavigation
        ? props.defaultFocusedItem
        : null,

      // selection
      selected: props.defaultSelected,
    };

    this.setupShowHideDelay();
    this.setRootRef = ref => {
      this.node = ref;
    };
    this.setItemRef = index => ref => {
      if (!this.childrenRefs) {
        this.childrenRefs = [];
      }
      this.childrenRefs[index] = ref;
    };
    this.setSubMenuRef = ref => {
      this.subMenu = ref;
    };
    this.setSubMenuWrapRef = ref => {
      this.subMenuWrap = ref;
    };
    this.setScrollerRef = ref => {
      this.scroller = ref;
    };
    this.setTableRef = ref => {
      this.table = ref;
    };
  }

  shouldComponentUpdate(nextProps) {
    return shouldComponentUpdate(this, nextProps, nextProps);
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
    this.chidrenRefs = null;

    this.props.componentWillUnmount(this, {
      // used by parent to focust itself after
      // it's submenu has unmmounted
      hasFocus: this.hasFocus(),
      depth: this.props.depth,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    /**
     * if it has autoFocus
     * make sure it is visible before calling focus
     */
    if (this.props.autoFocus && prevState.hidden && !this.state.hidden) {
      this.focus();
    }
  }

  componentDidMount() {
    this.componentIsMounted = true;
    if (this.props.visible === false) {
      return;
    }

    if (this.props.componentDidMount) {
      this.props.componentDidMount(this);
    }
    this.checkAlignment();
    this.setupEnterAnimation();

    if (this.props.autoFocus) {
      requestAnimationFrame(() => {
        this.focus();
      });
    }

    if (this.props.updatePositionOnScroll) {
      window.addEventListener('scroll', this.handleDocumentScroll, {
        passive: true,
      });
    }
  }

  updatePosition = () => {
    this.checkAlignment(undefined, true);
  };

  handleDocumentScroll = () => {
    if (this.props.updatePositionOnScroll) {
      this.updatePosition();
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (this.props.visible && !nextProps.visible) {
      this.setState({
        positionStyle: null,
      });
    }

    if (
      (!this.props.visible && nextProps.visible) ||
      !shallowequal(this.props.alignTo, nextProps.alignTo) ||
      nextProps.constrainTo != this.props.constrainTo
    ) {
      this.checkAlignment(nextProps);
    }
  }

  render() {
    const { state, props } = this;
    const style = prepareStyle(props, state);
    const className = this.prepareClassName(props, state);
    const table = this.renderTable();
    const scrollerArrow =
      props.showScrollArrows === undefined ? 'auto' : !!props.showScrollArrows;

    return (
      <div
        tabIndex={0}
        {...cleanProps(props, InovuaMenu.propTypes)}
        ref={this.setRootRef}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleOnBlur}
        className={className}
        style={style}
      >
        {this.state.activeSubMenuIndex !== null &&
          this.renderSubMenu(props, state)}
        {props.disableScroller ? (
          table
        ) : (
          <ArrowScroller scroller={scrollerArrow} {...this.getScrollerProps()}>
            {table}
          </ArrowScroller>
        )}
      </div>
    );
  }

  // RENDERING LOGIC
  renderTable() {
    const { props, state } = this;
    const className = join(
      `${props.rootClassName}__table`,
      props.tableClassName
    );

    return (
      <table
        cellSpacing={0}
        cellPadding={0}
        className={className}
        ref={this.setTableRef}
      >
        <tbody>{this.renderItems()}</tbody>
      </table>
    );
  }

  renderItems() {
    const { props, state } = this;

    if (!props.items) {
      return null;
    }

    const commonProps = this.getCommonItemProps();
    const siblingItemHasSubMenu = this.doesAnyItemHasSubMenu();
    const siblingItemHasSelectInput = this.dosAnyItemHaveSelectInput();
    const hasDescription = props.items.filter(item => !!item.secondaryLabel)
      .length;
    const hasIcon = props.items.filter(item => !!item.icon).length;

    return props.items.map((item, index, items) => {
      if (item === '-') {
        return (
          <MenuSeparator
            style={props.menuSeparatorStyle}
            key={index}
            rootClassName={props.rootClassName}
          />
        );
      }

      let columns = props.columns;
      if (hasDescription) {
        columns = [
          ...columns,
          {
            name: 'secondaryLabel',
            isDescription: true,
            style: {
              ...props.secondaryLabelStyle,
              ...item.secondaryLabelStyle,
            },
          },
        ];
      }
      if (hasIcon) {
        columns = [
          {
            name: 'icon',
            isIcon: true,
          },
          ...columns,
        ];
      }

      if (props.labelStyle || item.labelStyle) {
        columns = columns.map(column => {
          if (!column) {
            return column;
          }
          if (typeof column === 'string' && column === 'label') {
            return {
              name: 'label',
              style: { ...props.labelStyle, ...item.labelStyle },
            };
          }
          if (column && column.name && column.name === 'label') {
            return {
              ...column,
              style: {
                ...columns.style,
                ...props.labelStyle,
              },
            };
          }

          return column;
        });
      }

      const hasSubMenu =
        (item.items && !!item.items.length) ||
        (item.children && !!item.children.length);
      const focused = state.focusedItem === index;
      const expanded = commonProps.expandedIndex === index;
      const className = props.itemClassName;
      const selectionProps = this.getSelectionProps(item);

      /**
       * If any items have a select input
       * it's sibling that doesn't have one
       * should have the adiacent column where whould
       * the input be colSpan 2
       */
      if (
        props.enableSelection &&
        siblingItemHasSelectInput &&
        !selectionProps
      ) {
        if (props.selectionInputPosition === 'start') {
          columns = increaseFirstColumnColSpan(columns);
        } else {
          columns = increaseLastColumnColSpan(columns);
        }
      }

      // correct colspan on the last item
      // if any siblings have submenu (expander)
      if (!hasSubMenu && siblingItemHasSubMenu) {
        columns = increaseLastColumnColSpan(columns);
      }

      const itemProps = {
        index,
        item,
        hasSubMenu,
        items,
        focused,
        expanded,
        className,
        columns,
        key: index,
        disabled: item.disabled,
        theme: props.theme,
        ref: this.setItemRef(index),
        ...commonProps,
        ...selectionProps,
        ...item.props,
      };

      const Component = props.itemFactory || MenuItem;
      return <Component {...itemProps} />;
    });
  }

  getSelectionProps(item) {
    const { props } = this;
    if (!props.items || (props.items && !props.items.length)) {
      return null;
    }
    const selected = this.getSelected();
    const singleSelectNames = getSingleSelectNames({
      items: props.items,
      nameProperty: props.nameProperty,
    });
    let selectionProps;
    if (props.enableSelection) {
      const value = item[props.valueProperty];
      const name = item[props.nameProperty];

      // for an item to be selected its value can be any value (e.g 0)
      const multiple = singleSelectNames && !singleSelectNames[name];
      const checked = multiple
        ? value !== undefined
          ? selected[name] === value
          : selected[name] === name
        : selected[name] === value;

      // must have a name for the item to be selectable
      if (name) {
        selectionProps = {
          name,
          value,
          checked,
          multiple,
          allowUnselect: props.allowUnselect,
          enableSelection: true,
          browserNativeSelectInputs: props.browserNativeSelectInputs,
          renderCheckInput:
            item.renderCheckInput !== undefined
              ? item.renderCheckInput
              : props.renderCheckInput,
          renderRadioInput:
            item.renderRadioInput !== undefined
              ? item.renderRadioInput
              : props.renderRadioInput,
          selectionInputPosition:
            item.selectionInputPosition !== undefined
              ? item.selectionInputPosition
              : props.selectionInputPosition,
        };
      }
    }

    return selectionProps;
  }

  getCommonItemProps() {
    const { props } = this;
    const menuHasSubmenu = !!props.items.filter(
      item => item.items && item.items.length
    ).length;
    const itemStyleProps = getItemStyleProps(props);

    return {
      menuHasSubmenu,
      expanderStyle: props.expanderStyle,
      expanderSize: props.expanderSize,
      globalCellStyle: props.cellStyle,
      itemDisabledStyle: props.itemDisabledStyle,
      itemDisabledClassName: props.itemDisabledClassName,
      itemOverStyle: props.itemOverStyle,
      itemActiveStyle: props.itemActiveStyle,
      menuHasSubmenu: props.menuHasSubmenu,
      rootClassName: props.rootClassName,
      showWarnings: props.showWarnings,
      titleStyle: props.titleStyle,

      // events
      onClick: this.onMenuItemClick,
      onMouseOver: this.onMenuItemMouseEnter,
      onMouseOut: this.onMenuItemMouseLeave,
      submenuWillUnmount: this.onSubmenuWillUnmount,
      onExpanderClick: this.onMenuItemExpanderClick,
      onSelectChange: this.handleSelectionChange,
      selectOnClick: props.selectOnClick,
      expander: props.expander,
      rtl: props.rtl,
      height: props.itemHeight,

      checkIconSize: props.checkIconSize,
      radioIconSize: props.radioIconSize,

      // actions
      closeSubmenuRecursively: this.closeSubmenuRecursively,
      closeSubMenu: this.closeSubMenu,

      // expanded
      expandedIndex: this.getExpandedIndex(),

      // item style props
      ...itemStyleProps,
    };
  }

  renderSubMenu(props, state) {
    const domNode = this.node;
    const menuProps = this.getSubMenuProps();

    const wrapperStyle = getSubMenuStyle.bind(this)(
      { ...props, alignPositions: this.getDefaultAlignPositions() },
      state,
      domNode
    );

    const wrapperClassName = `${this.props.rootClassName}__submenu-wrapper`;

    return (
      <div
        className={wrapperClassName}
        ref={this.setSubMenuWrapRef}
        style={wrapperStyle}
        onMouseEnter={this.handleSubMenuMouseEnter}
        onMouseLeave={this.handleSubMenuMouseLeave}
      >
        <InovuaMenu key={state.activeSubMenuIndex} {...menuProps} />
      </div>
    );
  }

  hasItemSubMenu(index) {
    const items = this.getItemsByIndex(index);
    return items && items.length;
  }

  getItemsByIndex(index) {
    const item = this.props.items && this.props.items[index];
    if (!item) {
      return null;
    }
    const items = item && item.items;

    return items;
  }

  getSubMenuProps() {
    const { props, state } = this;
    const index = this.state.activeSubMenuIndex;
    const items = this.getItemsByIndex(index);
    const item = this.props.items[index];

    const overridingProps = {
      ...this.props.submenuProps,
      ...item.menuProps,
    };
    if (
      overridingProps.selected === undefined &&
      overridingProps.defaultSelected === undefined
    ) {
      overridingProps.selected = this.getSelected();
    }
    const menuProps = {
      ...this.props, // this must be first, so items are overwritten
      onDismiss: emptyFn,
      ...overridingProps,
      items,
      depth: props.depth + 1,
      ref: this.setSubMenuRef,
      subMenu: true,
      parentMenu: this,
      closeSubMenu: this.closeSubMenu,
      closeSubmenuRecursively: this.closeSubmenuRecursively,
      componentWillUnmount: this.submenuWillUnmount,
      parentIndex: index,
      maxHeight:
        state.submenuMaxHeight ||
        props.submenuMaxHeight ||
        state.maxHeight ||
        props.maxHeight,
      onActivate: this.onSubMenuActivate,
      onInactivate: this.onSubMenuInactivate,
      scrollerProps: props.scrollerProps,
      constrainTo: props.constrainTo,
      expander: props.expander,
      onSelectionChange: this.handleSubmenuSelectionChange,
      alignPosition: state.submenuAlignPosition,
    };

    delete menuProps.autoFocus;
    delete menuProps.className;
    delete menuProps.onClick;
    delete menuProps.defaultFocusedItem;
    delete menuProps.onChildClick;
    delete menuProps.visible;

    return menuProps;
  }

  getAlignPositions(props) {
    if (props.alignPositions == null) {
      return this.getDefaultAlignPositions();
    }

    return props.alignPositions;
  }

  getDefaultAlignPositions() {
    const { props } = this;
    return props.rtl ? alignPositionRTL : alignPositionLTR;
  }

  getScrollerProps() {
    const { props, state } = this;
    const className = join(
      props.scrollerProps.className,
      `${props.rootClassName}__scroll-container`
    );

    const style = assign({}, props.scrollerProps.style);
    /**
     * Same height style (height|maxHeight) is used also on scroller
     */
    const maxHeight =
      state.maxHeight != undefined && props.submenu
        ? state.maxHeight
        : props.maxHeight;

    if (maxHeight != null) {
      assign(style, { maxHeight });
    }

    const scrollProps = {
      ...props.scrollerProps,
      renderScroller: props.renderScroller,
      nativeScroll: props.nativeScroll,
      scrollContainerProps: props.scrollContainerProps,
      className,
      notifyResizeDelay: props.notifyResizeDelay,
      ref: this.setScrollerRef,
      style,
      vertical: true,
      theme: props.theme,
      scrollOnMouseEnter: props.scrollOnMouseEnter,
      onHasScrollChange: hasScroll => this.setState({ hasScroll }),
    };

    return scrollProps;
  }

  prepareClassName(props, state) {
    const hidden = props.visible != undefined ? !props.visible : state.hidden;

    let className = join(
      props.rootClassName,
      props.theme && `${props.rootClassName}--theme-${props.theme}`,
      props.className,
      !props.visible ||
        (props.items &&
          !props.items.length &&
          `${props.rootClassName}--no-display`),
      props.absolute && `${props.rootClassName}--absolute`,
      !props.rtl
        ? `${props.rootClassName}--ltr`
        : `${props.rootClassName}--rtl`,
      hidden && `${props.rootClassName}--hidden`,
      isMobile && `${props.rootClassName}--mobile`,
      props.subMenu && `${props.rootClassName}__submenu`,
      `${props.rootClassName}--depth-${props.depth}`,
      state.hasScroll && `${props.rootClassName}--has-overflow`,
      props.shadow && `${props.rootClassName}--shadow`,
      state.hasScroll && `${props.rootClassName}--has-scroll`
    );

    if (props.alignPosition !== undefined) {
      const position = props.alignPosition === 1 ? 'up' : 'down';
      className = join(
        className,
        `${props.rootClassName}--position-${position}`
      );
    }

    // animation
    if (state.enableAnimation) {
      className = join(
        className,
        `${props.rootClassName}--animation-enabled`,
        state.transitionEnded && `${props.rootClassName}--transition-end`,
        state.transitionStart && `${props.rootClassName}--transition-start`
      );
    }

    return className;
  }

  // BEHAVIOUR LOGIC
  handleMouseEnter(event) {
    if (typeof this.props.onMouseEnter === 'function') {
      this.props.onMouseEnter(event);
    }
    this.setState({
      mouseInside: true,
    });
    this.onActivate();
  }

  handleMouseLeave(event) {
    if (typeof this.props.onMouseLeave === 'function') {
      this.props.onMouseLeave(event);
    }
    this.setNextSubmenu();

    this.setState({
      mouseInside: false,
    });

    if (!this.state.activeSubMenuIndex && !this.state.nextActiveSubMenuIndex) {
      this.onInactivate({
        hasFocus: this.hasFocus(),
        /**
         * Used as indentifier for it's item parent
         */
        parentIndex: this.props.parentIndex,
      });
    }
  }

  handleKeyDown(event) {
    if (typeof this.props.onKeyDown === 'function') {
      this.props.onKeyDown(event);
    }
    if (!this.props.enableKeyboardNavigation) {
      return;
    }

    /**
     * stop parent menu from getting this event
     * if it does, it will change focusedItem in the
     * same time
     */
    const stop = event => {
      event.stopPropagation();
    };

    stop(event);

    switch (event.key) {
      case 'ArrowUp':
        this.handleArrowUp(event);
        break;
      case 'ArrowDown':
        this.handleArrowDown(event);
        break;
      case 'ArrowLeft':
        this.handleArrowLeft(event);
        break;
      case 'ArrowRight':
        this.handleArrowRight(event);
        break;
      case 'Enter':
        this.handleEnterOnFocusedItem(event);
        break;
      case ' ':
        this.handleSpaceOnFocusedItem(event);
        break;
    }
  }

  handleArrowUp(event) {
    const lastItemIndex =
      this.props.items && this.props.items.length
        ? this.props.items.length
        : null;
    const { props } = this;
    const focusedItemIndex =
      this.state.focusedItem != null ? this.state.focusedItem : lastItemIndex;
    const newFocusedItemIndex = getNextNavigableItem(
      props.items,
      focusedItemIndex,
      -1
    );

    if (newFocusedItemIndex == null) {
      return;
    }

    this.setFocusedIndex(newFocusedItemIndex);
  }

  handleArrowDown(event) {
    const { props } = this;
    const focusedItemIndex =
      this.state.focusedItem != null ? this.state.focusedItem : -1;
    const newFocusedItemIndex = getNextNavigableItem(
      props.items,
      focusedItemIndex,
      1
    );

    if (newFocusedItemIndex == null) {
      return;
    }

    this.setFocusedIndex(newFocusedItemIndex);
  }

  handleArrowLeft(event) {
    if (this.props.rtl) {
      this.openSubMenuAction(this.state.focusedItem);
    } else {
      this.closeSubMenuAction();
    }
  }

  handleArrowRight(event) {
    if (this.props.rtl) {
      this.closeSubMenuAction();
    } else {
      this.openSubMenuAction(this.state.focusedItem);
    }
  }

  handleEnterOnFocusedItem(event) {
    /**
     * Simulate onclick
     * event, props, index
     */
    const focusedItem = this.getFocusedItem();
    if (
      this.props.simulateClickOnEnterKeyPress &&
      focusedItem != null &&
      typeof focusedItem.handleClick === 'function'
    ) {
      focusedItem.handleClick({ stopPropagation: () => {} });
    }
  }

  handleSpaceOnFocusedItem() {
    const activeItemProps = this.getFocusedItemProps();
    if (!activeItemProps) {
      return;
    }
    this.handleSelectionChange({
      name: activeItemProps.name,
      value: activeItemProps.value,
      checked: !activeItemProps.checked,
      multiple: activeItemProps.multiple,
    });
  }

  handleOnBlur(event) {
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event);
    }
    event.stopPropagation();

    /**
     * is prevented when it is closed by mouse
     * action
     */
    if (this.preventOnBlurRecursiveClose) {
      return;
    }

    this.dismissTriggeredByBlur = true;

    setTimeout(
      () => {
        if (!this.hasGeneralFocus()) {
          this.dismiss(event);
        }
      },
      IS_IE ? this.props.hideSubMenuDelay : 20
    ); // a bigger delay is needed for IE11 // TODO improve the way this is handled
  }

  dismiss(event) {
    this.closeSubmenuRecursively();
    this.props.onDismiss(event);
  }

  scrollItemIntoView(index) {
    const itemNode = this.getItemDOMNodeByIndex(index);
    if (!this.scroller || !itemNode) {
      return;
    }

    this.scroller.scrollIntoView(itemNode);
  }

  closeSubmenuRecursively() {
    this.closeSubMenu();
    this.props.closeSubmenuRecursively();
  }

  closeSubMenuAction() {
    if (this.hasSubMenuOpened()) {
      this.closeSubMenu();
    } else if (this.isSubMenu()) {
      this.preventOnBlurRecursiveClose = true;
      this.props.closeSubMenu({ autoFocus: true });
    }
  }

  openSubMenuAction(focusedItemIndex) {
    const focusedItem = this.getItemByIndex(focusedItemIndex);
    if (!focusedItem) {
      return;
    }

    if (focusedItem && !focusedItem.hasSubmenu()) {
      return;
    }

    // the same menu is already opened by mouse,
    // have to make first item focused
    if (focusedItemIndex === this.state.activeSubMenuIndex) {
      this.subMenu && this.subMenu.focusFirstItem();
      return;
    }

    const menuOffset = focusedItem && focusedItem.getOffset();
    this.setSubMenu({ menuOffset, index: focusedItemIndex });
  }

  onActivate() {
    if (!this.state.activated) {
      this.setState({
        activated: true,
      });

      if (this.props.onActivate) {
        this.props.onActivate();
      }
    }
  }

  onInactivate(options) {
    if (this.state.activated) {
      this.setState({
        activated: false,
      });
      if (this.props.onInactivate) {
        this.props.onInactivate(options);
      }
    }
  }

  /**
   * we also need mouseOverSubMenu: Boolean
   * since when from a submenu we move back to a parent menu, we may move
   * to a different menu item than the one that triggered the submenu
   * so we should display another submenu
   */
  handleSubMenuMouseEnter() {
    this.setState({
      mouseOverSubMenu: true,
    });
  }

  handleSubMenuMouseLeave() {
    this.setState({
      mouseOverSubMenu: false,
    });
  }

  isSubMenuActive() {
    return this.state.subMenuActive;
  }

  onSubMenuActivate() {
    this.setState({
      subMenuActive: true,
    });
    if (this.closeSubmenuTimeout) {
      clearTimeout(this.closeSubmenuTimeout);
    }
  }

  onSubMenuInactivate(submenuConfig) {
    const ts = +new Date();
    const nextItem = this.state.nextItem;
    const nextTimestamp = this.state.nextTimestamp || 0;

    this.setState(
      {
        subMenuActive: false,
        timestamp: ts,
      },
      () => {
        setTimeout(() => {
          if (
            ts != this.state.timestamp ||
            (nextItem && ts - nextTimestamp < 100)
          ) {
            // a menu show has occured in the mean-time,
            // so skip hiding the menu
            this.setSubMenu(
              {
                menuOffset: this.state.nextOffset,
                index: this.state.nextActiveSubMenuIndex,
              },
              () => {
                this.focus();
              }
            );

            return;
          } else {
            this.focus();
          }

          const mouseHasEnteredSubmenuParentItem =
            submenuConfig && submenuConfig.parentIndex === this.itemOverIndex;

          if (!this.isSubMenuActive() && !mouseHasEnteredSubmenuParentItem) {
            this.closeSubMenu({
              autoFocus: submenuConfig && submenuConfig.hasFocus,
            });
          }
        }, 10); // end of setTimeout
      }
    );
  }

  /**
   * Called when mouseout happens on the item
   * for which there is a submenu displayed
   */
  onMenuItemMouseEnter({ menuOffset, index, hasSubMenu }) {
    if (!this.componentIsMounted) {
      return;
    }

    this.itemOverIndex = index;
    if (!hasSubMenu) {
      if (this.state.activeSubMenuIndex != null) {
        this.setNextSubmenu({ menuOffset: null, index: null });
      }
      return;
    }

    if (this.state.activeSubMenuIndex == null) {
      // there is no menu visible, so it's safe to show the menu
      this.setSubMenu({ menuOffset, index });
    } else {
      // there is a menu visible, from the previous item that had mouse over
      // so we should queue this item's menu as the next menu to be shown
      this.setNextSubmenu({ menuOffset, index });
    }
  }

  onMenuItemMouseLeave({ leaveOffset, index, event }) {
    if (this.itemOverIndex === index) {
      this.itemOverIndex = null;
    }

    if (!leaveOffset) {
      return;
    }

    // check if mouse is over a submenu
    const elementAtMousePosition = global.document.elementFromPoint(
      leaveOffset.x,
      leaveOffset.y
    );

    /**
     * If the submenu has a offset and it mounts
     * inbetween menu and mouse, menu will receive a
     * mouse leave but submenu will not get a mouseenter
     */
    if (
      elementAtMousePosition === this.subMenuWrap ||
      containsNode(this.subMenuWrap, elementAtMousePosition)
    ) {
      return;
    }

    if (this.state.activeSubMenuIndex !== null) {
      this.delayCloseSubmenu(leaveOffset);
    }

    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
  }

  delayCloseSubmenu() {
    if (!this.componentIsMounted) {
      return;
    }

    if (this.closeSubmenuTimeoutId) {
      return;
    }

    this.closeSubmenuTimeout = setTimeout(() => {
      this.closeSubmenuTimeout = null;
      this.setSubMenu({
        menuOffset: this.state.nextOffset,
        index: this.state.nextActiveSubMenuIndex,
      });
    }, 100);
  }

  removeMouseMoveListener() {
    if (this.onWindowMouseMove) {
      global.removeEventListener('mousemove', this.onWindowMouseMove);
      this.onWindowMouseMove = null;
    }
  }

  setSubMenu({ menuOffset, index = null } = {}, callback) {
    this.removeMouseMoveListener();
    if (!this.componentIsMounted) {
      return;
    }

    if (this.state.activeSubMenuIndex === index) {
      if (callback) {
        callback();
      }
      return;
    }

    if (this.hasItemSubMenu(index) && !this.state.mouseInside) {
      this.onInactivate();
    }

    this.setState(
      {
        menuOffset,
        activeSubMenuIndex: index,
        nextOffset: null,
        nextTimestamp: null,
        timestamp: +new Date(),
      },
      callback
    );
  }

  setNextSubmenu({ menuOffset = null, index = null } = {}) {
    const ts = +new Date();

    this.setState({
      timestamp: ts,
      nextOffset: menuOffset,
      nextActiveSubMenuIndex: index,
      nextTimestamp: +new Date(),
    });
  }

  closeSubMenu(options) {
    return;
    this.setSubMenu();
    if (options && options.autoFocus) {
      this.focus();
    }
  }

  onMenuItemExpanderClick(event) {
    event.nativeEvent.expanderClick = true;
  }

  onMenuItemClick(event = {}, itemProps, index) {
    const { props } = this;
    // refactor to itemProps
    const stopped =
      event && event.isPropagationStopped
        ? event.isPropagationStopped()
        : false;

    if (props.stopClickPropagation && event.stopPropagation) {
      event.stopPropagation();
    }

    if (
      isMobile &&
      itemProps &&
      event &&
      event.nativeEvent &&
      event.nativeEvent.expanderClick
    ) {
      const offset = {
        x: event.pageX,
        y: event.pageY,
      };
      const menuOffset = getRegionRelativeToParent(
        event.currentTarget,
        props.rootClassName
      );
      this.onMenuItemMouseEnter({
        hasSubMenu: itemProps.hasSubMenu,
        menuOffset,
        index: itemProps.index,
      });
      return;
    }

    if (!stopped) {
      props.onClick(event, itemProps, index);
      if (isMobile && props.onTouchStart) {
        props.onTouchStart(event, itemProps, index);
      }
      // can be overwritten by item props
      const dismissOnClick =
        itemProps &&
        itemProps.item &&
        itemProps.item.dismissOnClick !== undefined
          ? itemProps.item.dismissOnClick
          : props.dismissOnClick;

      if (props.autoDismiss) {
        if (!itemProps.hasSubMenu) {
          this.dismiss();
        } else if (dismissOnClick) {
          props.closeSubmenuRecursively();
        }
      } else if (dismissOnClick) {
        props.closeSubmenuRecursively();
      }

      if (props.selectOnClick && itemProps.name !== undefined) {
        this.handleSelectionChange({
          name: itemProps.name,
          value: itemProps.value,
          checked: !itemProps.checked,
          multiple: itemProps.multiple,
        });
      }

      this.onChildClick(event, itemProps);
    }

    // make item focused
    if (!this.isSeparator(index)) {
      this.setFocusedIndex(index);
    }
  }

  onChildClick(event, props) {
    if (this.props.onChildClick) {
      this.props.onChildClick(event, props);
    }

    if (this.props.parentMenu) {
      this.props.parentMenu.onChildClick(event, props);
    }
  }

  setupShowHideDelay() {
    const setSubMenu = this.setSubMenu;
    this.setSubMenu = ({ menuOffset, index } = {}, callback) => {
      if (this.showTimeout) {
        clearTimeout(this.showTimeout);
      }

      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }

      // show
      if (index != null) {
        if (this.props.showSubMenuDelay) {
          this.showTimeout = setTimeout(
            () => setSubMenu({ menuOffset, index }, callback),
            this.props.showSubMenuDelay
          );
        } else {
          setSubMenu({ menuOffset, index }, callback);
        }
      } else {
        // hide
        if (this.props.hideSubMenuDelay) {
          this.hideTimeout = setTimeout(
            () => setSubMenu({ menuOffset, index }, callback),
            this.props.hideSubMenuDelay
          );
        } else {
          setSubMenu({ menuOffset, index }, callback);
        }
      }
    };
  }

  setupEnterAnimation() {
    // set hidden to false after check alignmetn,
    // to make sure it had time to position
    // submenu correctly

    setTimeout(() => {
      const enableAnimation =
        (this.props.enableAnimation && this.props.subMenu) ||
        (this.props.enableRootAnimation && !this.props.subMenu);

      if (this.componentIsMounted) {
        this.setState({
          hidden: false,
          enableAnimation,
        });
      }
      if (enableAnimation) {
        setTimeout(() => {
          if (this.componentIsMounted) {
            this.setState({
              transitionStart: true,
            });
          }
          // trigger animation end
          setTimeout(() => {
            if (this.componentIsMounted) {
              this.setState({
                transitionEnded: true,
              });
            }
          }, 16); // transition end
        }, 16); // transition start
      }
    }, 0);
  }

  /**
   * Checks if it fits inside the constrain
   * passed props can be `nextProps`
   */
  checkAlignment(props, skipReset) {
    props = props || this.props;
    if (props.visible === false) {
      return;
    }
    if ((props.constrainTo || props.alignTo) && !props.subMenu) {
      const doAlign = () => {
        const props = this.props;
        const alignPositions = this.getAlignPositions(props);
        const domNode = this.node;

        if (!domNode) {
          return;
        }
        domNode.style.visibility = '';
        const alignOffset = prepareAlignOffset(props.alignOffset);
        const domRegion = Region.from(domNode);
        const actualRegion = domRegion.clone();

        const constrainRegion = props.constrainTo
          ? getConstrainRegion(props.constrainTo, domNode)
          : null;

        let positionStyle;

        if (props.alignTo) {
          const alignRegion = getAlignToRegion(props.alignTo, domNode);

          actualRegion.alignTo(alignRegion, alignPositions, {
            offset: alignOffset,
            constrain: constrainRegion,
          });

          let offsetParent = domNode.offsetParent;

          if (
            IS_FF &&
            offsetParent === document.body &&
            getComputedStyle(domNode).position === 'fixed'
          ) {
            // FF returns document.body as the offset parent of fixed elements, though it should return null
            // see https://bugzilla.mozilla.org/show_bug.cgi?id=434678 for details
            offsetParent = null;
          }
          const offsetParentRect = offsetParent
            ? null
            : domNode.getBoundingClientRect();

          const offsetParentRegion = Region.from(
            offsetParent || {
              top: offsetParentRect.top,
              left: offsetParentRect.left,
            }
          );

          const newTop = actualRegion.top - offsetParentRegion.top;
          const newLeft = actualRegion.left - offsetParentRegion.left;

          const transform = `translate3d(${Math.floor(newLeft)}px, ${Math.floor(
            newTop
          )}px, 0px)`;

          positionStyle = {
            // using transform does not cause a browser layout on the document root
            // while left/top does
            transform,
            top: 0,
            left: 0,
          };
        }

        if (constrainRegion) {
          positionStyle = positionStyle || {};
          if (actualRegion.bottom >= constrainRegion.bottom) {
            positionStyle.maxHeight = constrainRegion.bottom - actualRegion.top;
          }
        }

        if (positionStyle) {
          this.setState({ positionStyle });
        }
      };
      if (!skipReset) {
        this.node.style.transform = 'translate3d(0px, 0px, 0px)';
        this.node.style.visibility = 'hidden';
        this.node.style.top = '0px';
        this.node.style.left = '0px';
      }
      raf(doAlign);
    }
  }

  setFocusedIndex(newFocusedItem) {
    if (this.props.enableKeyboardNavigation) {
      const focusedItem = this.state.focusedItem;
      if (focusedItem === newFocusedItem) {
        newFocusedItem = null;
      }
      this.scrollItemIntoView(newFocusedItem);
      this.setState({
        focusedItem: newFocusedItem,
      });
    }
  }

  getItemDOMNodeByIndex(index) {
    const item = this.getItemByIndex(index);
    const itemNode = item && item.getDOMNode();

    return itemNode;
  }

  getItemByIndex(index) {
    return this.childrenRefs[index];
  }

  getItemPropsByIndex(index) {
    const item = this.getItemByIndex(index);
    return item && item.props;
  }

  getFocusedItemProps() {
    const focusedItemIndex = this.state.focusedItem;
    const focusedItemProps = this.getItemPropsByIndex(focusedItemIndex);

    return focusedItemProps;
  }

  getFocusedItem() {
    return (
      this.state.focusedItem != null &&
      this.getItemByIndex(this.state.focusedItem)
    );
  }

  focus() {
    if (!this.node) {
      return;
    }
    if (this.node.focus) {
      this.node.focus();
    }
  }

  /**
   * whether a submenu is rendered
   */
  hasSubMenuOpened() {
    return this.state.activeSubMenuIndex != null;
  }

  isSubMenu() {
    return !!this.props.subMenu;
  }

  doesAnyItemHasSubMenu() {
    const { props } = this;
    return (
      props.items &&
      !!props.items.filter(item => item.items && item.items.length).length
    );
  }

  dosAnyItemHaveSelectInput() {
    const { props } = this;
    return (
      props.items &&
      !!props.items.filter(item => {
        return item[this.props.nameProperty];
      }).length
    );
  }

  /**
   * Whether this or it's submenus
   * has focus
   */
  hasGeneralFocus() {
    // if it has focus doen't need to go further
    const hasFocus = this.hasFocus();

    if (hasFocus) {
      return hasFocus;
    }

    // check child
    if (this.hasSubMenuOpened()) {
      return this.hasSubMenuFocus();
    }

    return this.hasChildFocus();
  }

  hasSubMenuFocus() {
    if (this.subMenu) {
      return this.subMenu.hasFocus();
    }

    return null;
  }

  hasFocus() {
    return global.document
      ? this.node === global.document.activeElement
      : false;
  }

  hasChildFocus() {
    if (!global.document) {
      return false;
    }
    return containsNode(this.node, global.document.activeElement);
  }

  /**
   * If submenu had focus it's parent should
   * get the focus back
   */
  onSubmenuWillUnmount(instance, config) {
    if (config && config.hasFocus) {
      setTimeout(() => {
        this.focus();
      }, 0);
    }
  }

  /**
   * used when a submenu is opened by mouse over
   * and then you press arrowRight to open
   * the alredy opened submenu, in which case
   * it should gain focus and set focusedItem to first item
   */
  focusFirstItem() {
    const fistNonDisabledItem = getFirstNonDisabledItem(this.props.items);
    this.focusItem(fistNonDisabledItem);
  }

  focusItem(index) {
    this.focus();
    this.setFocusedIndex(index);
  }

  // node renderers
  getSubmenuNode() {
    return this.subMenu && this.subMenu.getNode();
  }

  getNode() {
    return this.node;
  }

  // selection
  getSelected() {
    return this.isSelectedControlled()
      ? this.props.selected
      : this.state.selected;
  }

  isSelectedControlled() {
    return this.props.selected !== undefined;
  }

  handleSelectionChange({ name, value, checked, multiple }) {
    const newSelected = {
      ...this.getSelected(),
    };

    // single select
    if (!multiple) {
      newSelected[name] = value;
    } else if (checked) {
      newSelected[name] = value === undefined ? name : value;
    }

    if (!checked) {
      if (multiple || this.props.allowUnselect) {
        delete newSelected[name];
      }
    }

    this.setSelected(newSelected);
  }

  setSelected(newSelected) {
    if (!this.isSelectedControlled()) {
      this.setState({
        selected: newSelected,
      });
    }

    this.props.onSelectionChange(newSelected);
  }

  handleSubmenuSelectionChange(selected) {
    this.setSelected(selected);
  }

  // expanded

  /**
   * Refactor, to hold only the index
   */
  getExpandedIndex() {
    return this.state.activeSubMenuIndex;
  }

  isSeparator(index) {
    const { props } = this;
    const separatorIndexes = getSeparatorIndexes(props.items);
    return separatorIndexes.indexOf(index) !== -1;
  }
}

InovuaMenu.defaultProps = {
  /**
   * Used to calculate the depth of the menu
   * each menu renders it's submenu with this.props.depth + 1
   */
  rootClassName: 'inovua-react-toolkit-menu',
  depth: 0,
  rtl: false,
  isMenu: true,
  enableScroll: true,
  submenuStyle: null,
  scrollerProps: {},
  theme: 'default',
  dismissOnClick: true,
  disableScroller: false,
  shadow: true,
  submenuAlignOffset: alignOffsetLTR,
  rtlSubmenuAlignOffset: alignOffsetRTL,
  showSubMenuDelay: 150,
  hideSubMenuDelay: 150,
  expanderSize: 10,
  scrollOnMouseEnter: true,

  // events
  onClick: () => {},
  onSelectionChange: () => {},

  // items config
  columns: ['label'],
  items: null,

  // scroll
  maxHeight: 'none',
  // submenuMaxHeight: 'none',
  scrollArrowIncrementType: 'step',

  // animation
  enableAnimation: true,
  fadeDuration: 100,
  fadeTransitionFunction: 'ease',
  enableRootAnimation: false,

  itemStyle: {},
  itemOverStyle: {},
  itemDisabledStyle: {},
  itemExpandedStyle: {},
  cellStyle: {},

  stopClickPropagation: true,

  scrollProps: {},

  // smart algoritm
  inTriangleWaitDelay: 300,
  alignOffset: { x: 0, y: 0 },

  // navigation
  simulateClickOnEnterKeyPress: true,
  enableKeyboardNavigation: true,
  defaultFocusedItem: null,
  autoFocus: false,
  closeSubMenu: () => {},
  closeSubmenuRecursively: () => {},

  onDismiss: () => {},
  componentWillUnmount: () => {},
  componentDidMount: () => {},

  useMouseInTriangleCheck: false,

  // selection
  allowUnselect: false,
  enableSelection: false,
  nameProperty: 'name',
  valueProperty: 'value',
  selectionInputPosition: 'start',
  defaultSelected: {},
  selectOnClick: true,
  checkIconSize: 16,
  radioIconSize: 16,
  notifyResizeDelay: 16,
  browserNativeSelectInputs: false,
  showWarnings: !uglified,
};

InovuaMenu.propTypes = {
  rootClassName: PropTypes.string,
  items: PropTypes.array,
  columns: PropTypes.array,
  dismissOnClick: PropTypes.bool,
  autoDismiss: PropTypes.bool,
  disableScroller: PropTypes.bool,
  showSubMenuDelay: PropTypes.number,
  hideSubMenuDelay: PropTypes.number,
  notifyResizeDelay: PropTypes.number,
  scrollOnMouseEnter: PropTypes.bool,

  // style
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  rowActiveStyle: PropTypes.object,
  rowOverStyle: PropTypes.object,
  rowStyle: PropTypes.object,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  submenuMaxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

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

  // events
  onClick: PropTypes.func,

  // scroll
  showScrollArrows: PropTypes.bool,
  scrollProps: PropTypes.object,
  scrollArrowIncrementType: PropTypes.oneOf(['step', 'page']),
  renderScroller: PropTypes.func,

  // animation
  enableAnimation: PropTypes.bool,
  fadeDuration: PropTypes.number,
  fadeTransitionFunction: PropTypes.string,
  enableRootAnimation: PropTypes.bool,

  /**
   * these props are overwritten
   * by props or attributes added on items or MenuItem
   */
  itemStyle: PropTypes.object,
  itemClassName: PropTypes.string,

  itemActiveStyle: PropTypes.object,
  itemActiveClassName: PropTypes.string,

  itemOverStyle: PropTypes.object,
  itemOverClassName: PropTypes.string,

  itemDisabledStyle: PropTypes.object,
  itemDisabledClassName: PropTypes.string,

  itemExpandedStyle: PropTypes.object,
  itemExpandedClassName: PropTypes.string,

  itemFocusedStyle: PropTypes.object,
  itemFocusedClassName: PropTypes.string,

  itemOverFocusedStyle: PropTypes.object,
  visible: PropTypes.bool,
  itemHeight: PropTypes.number,
  cellStyle: PropTypes.object,
  secondaryLabelStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  titleStyle: PropTypes.object,

  // smart algorithm
  alignTo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.string,
  ]),
  inTriangleWaitDelay: PropTypes.number,
  alignPositions: PropTypes.arrayOf(PropTypes.string),
  alignOffset: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  submenuAlignOffset: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    PropTypes.number,
  ]),
  rtlSubmenuAlignOffset: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    PropTypes.number,
  ]),
  alignPosition: PropTypes.oneOf([1, -1]),

  // text direction
  rtl: PropTypes.bool,

  // navigation
  enableKeyboardNavigation: PropTypes.bool,
  defaultFocusedItem: PropTypes.number,
  autoFocus: PropTypes.bool,
  closeSubMenu: PropTypes.func,
  closeSubmenuRecursively: PropTypes.func,
  simulateClickOnEnterKeyPress: PropTypes.bool,

  onChildClick: PropTypes.func,
  onDismiss: PropTypes.func,
  expanderStyle: PropTypes.object,
  depth: PropTypes.number,
  isMenu: PropTypes.bool,
  constrainTo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
  ]),
  enableScroll: PropTypes.bool,
  submenuStyle: PropTypes.object,
  scrollerProps: PropTypes.object,
  theme: PropTypes.string,
  stopClickPropagation: PropTypes.bool,
  componentWillUnmount: PropTypes.func,
  componentDidMount: PropTypes.func,
  itemStyleProps: PropTypes.object,
  childrenLength: PropTypes.number,
  separatorIndexes: PropTypes.string,
  tableClassName: PropTypes.string,
  shadow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),

  submenuProps: PropTypes.object,
  menuHasSubmenu: PropTypes.bool,
  depthSet: PropTypes.bool,
  subMenu: PropTypes.bool,
  parentIndex: PropTypes.number,
  parentMenu: PropTypes.object,
  onActivate: PropTypes.func,
  onInactivate: PropTypes.func,
  expander: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool,
    PropTypes.func,
  ]),
  expanderSize: PropTypes.number,
  overStyle: PropTypes.object,
  activeStyle: PropTypes.object,
  disabledStyle: PropTypes.object,
  expandedStyle: PropTypes.object,

  menuSeparatorStyle: PropTypes.object,

  // enable algoritm which checkes when the mouse leaves
  // an element it't direction it is towards the submenu
  useMouseInTriangleCheck: PropTypes.bool,

  // selection
  selected: PropTypes.object,
  defaultSelected: PropTypes.object,
  allowUnselect: PropTypes.bool,
  enableSelection: PropTypes.bool,
  nativeScroll: PropTypes.bool,
  scrollContainerProps: PropTypes.object,
  nameProperty: PropTypes.string,
  valueProperty: PropTypes.string,
  renderCheckInput: PropTypes.func,
  renderRadioInput: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selectionInputPosition: PropTypes.oneOf(['start', 'end']),
  selectOnClick: PropTypes.bool,
  checkIconSize: PropTypes.number,
  radioIconSize: PropTypes.number,
  showWarnings: PropTypes.bool,
  updatePositionOnScroll: PropTypes.bool,
  browserNativeSelectInputs: PropTypes.bool,
};

export default InovuaMenu;
