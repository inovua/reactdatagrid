/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '../../../../common/cleanProps';
import Overlay from '../../../Overlay';
import shouldComponentUpdate from '../utils/shouldComponentUpdate';
import FakeVirtualList from './FakeVirtualList';
import Item from './Item';
import getClassName from './utils/getClassName';
import isSelected from '../utils/isSelected';
import getPositionRelativeToElement from '../../../../common/getPositionRelativeToElement';

class List extends Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.getOverlayTarget = this.getOverlayTarget.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.virtualListShouldComponentUpdate = this.virtualListShouldComponentUpdate.bind(
      this
    );

    this.setRootNode = ref => {
      this.listNode = ref;
    };

    this.addVirtualListRef = ref => {
      this.virtualListNode = ref;
    };

    this.state = { succesfullPosition: 'bottom' };
    this.listAligned = false;
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
  }

  componentDidMount() {
    if (!this.props.relativeToViewport) {
      setTimeout(() => {
        this.updateListPosition();
      }, 0);
    }

    this.componentIsMounted = true;

    if (this.props.activeItemIndex != null) {
      setTimeout(() => {
        if (this.componentIsMounted) {
          this.scrollToIndex(this.props.activeItemIndex);
        }
      }, 16);
    }
  }

  render() {
    const { state, props } = this;
    const { renderFooter, renderHeader, isNewCustomTagValid } = props;

    this.currentGroup = null;
    const className = getClassName({ state, props });
    let style = props.style;

    if (this.state.position) {
      style = {
        ...style,
        ...this.state.position,
      };
    }

    if (this.state.succesfullPosition && this.props.offset) {
      const positionName =
        this.state.succesfullPosition === 'bc-tc' ? 'top' : 'bottom';

      if (this.props.offset) {
        style = {
          ...style,
          [positionName == 'top' ? 'marginBottom' : 'marginTop']: this.props
            .offset,
        };
      }
    }

    if (!this.props.relativeToViewport && !this.listAligned) {
      style = {
        ...style,
        visibility: 'hidden',
        position: 'fixed',
      };
    }

    const result = (
      <div
        {...cleanProps(props, List.propTypes)}
        className={className}
        style={style}
        ref={this.setRootNode}
        onClick={this.handleOnClick}
      >
        {this.renderLoadingText()}
        {isNewCustomTagValid && this.renderNewCustomTagText()}
        {typeof renderHeader === 'function' && this.renderHeader()}
        {this.renderEmptyText()}
        {this.renderVirtualList()}
        {typeof renderFooter === 'function' && this.renderFooter()}
      </div>
    );

    if (this.props.relativeToViewport) {
      const overlayProps = {
        ...props.overlayProps,
        target: this.getOverlayTarget,
        relativeToViewport: this.props.relativeToViewport,
        constrainTo: this.props.constrainTo,
        positions: this.props.positions,
      };

      return <Overlay {...overlayProps}>{result}</Overlay>;
    }

    return result;
  }

  getOverlayTarget() {
    return this.props.getComboNode();
  }

  renderFooter() {
    return this.props.renderFooter({
      props: this.props,
      data: this.props.data,
      value: this.props.value,
    });
  }

  renderHeader() {
    return this.props.renderHeader({
      props: this.props,
      data: this.props.data,
      value: this.props.value,
    });
  }

  renderEmptyText() {
    const { data } = this.props;
    if ((data && data.length) || this.props.loading) {
      return null;
    }
    if (this.props.isNewCustomTagValid) {
      return null;
    }

    return (
      <div className={`${this.props.rootClassName}__empty-text`}>
        {this.props.emptyText}
      </div>
    );
  }

  renderNewCustomTagText() {
    const text = this.props.text;

    if (this.props.newCustomTagText) {
      return typeof this.props.newCustomTagText === 'function'
        ? this.props.newCustomTagText({ text })
        : this.props.newCustomTagText;
    }

    return (
      <div className={`${this.props.rootClassName}__new-custom-tag-text`}>
        Create option "{text}"
      </div>
    );
  }

  renderLoadingText() {
    if (!this.props.loading) {
      return null;
    }
    if (!this.props.loadingText) {
      return null;
    }

    return (
      <div className={`${this.props.rootClassName}__loading-text`}>
        {this.props.loadingText}
      </div>
    );
  }

  renderVirtualList() {
    const className = `${this.props.rootClassName}__virtual-list`;
    const count = this.props.dataLength;
    const VirtualList = this.props.virtualListFactory;
    const renderVirtualList = this.props.renderVirtualList;

    if (!count) {
      return null;
    }

    const style = {};

    if (this.props.maxHeight) {
      style.maxHeight = this.props.maxHeight;
    }
    if (this.state.constrainedHeight) {
      const constrainedOffset = 5;
      const constrainedHeight = this.props.maxHeight
        ? Math.min(
            this.props.maxHeight,
            this.state.constrainedHeight - constrainedOffset
          )
        : this.state.constrainedHeight - constrainedOffset;

      style.maxHeight = constrainedHeight;
    }
    if (
      typeof style.maxHeight === 'number' &&
      typeof this.props.minHeight == 'number'
    ) {
      style.maxHeight = Math.max(style.maxHeight || 0, style.minHeight || 0);
    }

    const virtualListProps = {
      ref: this.addVirtualListRef,
      className,
      autoHide: false,
      count,
      theme: this.props.theme,
      renderRow: this.renderRow,
      minRowHeight: 10,
      tabIndex: null,
      shouldComponentUpdate: this.virtualListShouldComponentUpdate,
      scrollProps: {
        onContainerScrollVerticalMax: this.props.onScrollBottom,
      },
      style,
    };

    let result;

    if (renderVirtualList) {
      result = renderVirtualList(virtualListProps);
    }
    if (result === undefined) {
      if (VirtualList === FakeVirtualList) {
        virtualListProps.renderListScroller = this.props.renderListScroller;
      }

      result = <VirtualList {...virtualListProps} />;
    }

    if (result && result.props) {
      this.rowHeight = result.props.rowHeight;
    }

    return result;
  }

  virtualListShouldComponentUpdate() {
    return true;
  }

  renderRow({ index }) {
    const groups = this.props.groups;
    if (groups && groups[index]) {
      return this.renderGroup(groups[index], index);
    }

    const {
      data,
      getIdProperty,
      getDisplayProperty,
      rootClassName,
      itemEllipsis,
      value,
      activeItem,
      renderItem,
      rtl,
    } = this.props;

    const renderIndex = this.currentGroup
      ? index - this.currentGroup.indexAjustment
      : index;

    const item = data[renderIndex];
    const id = getIdProperty(item);
    const label = getDisplayProperty(item);
    const selected = isSelected({ value, id });
    const active = id === activeItem;

    const itemProps = {
      ...this.props.itemProps,
      index: renderIndex,
      itemHeight: this.rowHeight,
      itemEllipsis,
      item,
      id,
      label,
      selected,
      active,
      renderItem,
      rtl,
      rootClassName: `${rootClassName}__item`,
      onClick: this.handleItemClick,
      key: id || label,
    };

    return <Item {...itemProps} />;
  }

  renderGroup(group, index) {
    this.currentGroup = group;
    const { title } = group;

    const groupProps = {
      children: title,
      key: title,
      className: `${this.props.rootClassName}__group`,
    };

    let result;
    if (typeof this.props.renderGroup === 'function') {
      result = this.props.renderGroup({
        domProps: groupProps,
        index,
        group,
      });
    }

    if (result === undefined) {
      result = <div {...groupProps} />;
    }

    return result;
  }

  handleOnClick(event) {
    event.stopPropagation();
  }

  handleItemClick(index) {
    this.props.onItemClick(index);
  }

  /**
   * Called on first render to decide where to render the list.
   * And then on each datasource change, but after it has updated.
   */
  updateListPosition() {
    // getPosition
    const comboNode = this.props.getComboNode();
    if (!comboNode) {
      return null;
    }

    const listNode = this.listNode;

    if (!listNode) {
      return null;
    }

    const positionConfig = getPositionRelativeToElement({
      targetNode: comboNode,
      overlayNode: listNode,
      offset: this.props.offset,
      constrainTo: this.props.constrainTo,
      relativeToViewport: this.props.relativeToViewport,
      positions: this.props.positions,
    });

    this.listAligned = true;
    if (positionConfig) {
      const {
        constrainedHeight,
        positionRegion,
        succesfullPosition,
        position,
      } = positionConfig;

      this.setState({
        positionRegion,
        succesfullPosition,
        constrainedHeight: constrainedHeight
          ? positionRegion.getHeight()
          : null,
      });
    }
  }

  getVirtualListNode() {
    return this.virtualListNode;
  }

  getlListNode() {
    return this.listNode;
  }

  scrollToIndex(index) {
    const virtualListNode = this.getVirtualListNode();
    return virtualListNode && virtualListNode.scrollToIndex(index);
  }
}

function emptyFn() {}

List.defaultProps = {
  // item props
  selectedStyle: {},
  style: {},

  // events
  onItemClick: emptyFn,
  getComboNode: emptyFn,

  // position
  positions: ['bottom', 'top'],
  offset: 0,
  constrainTo: true,
  virtualListFactory: FakeVirtualList,
  overlayProps: {
    theme: null,
    syncWidth: true,
    rafOnMount: false,
    adjustOnPositionBottom: false,
    updatePositionOnScroll: true,
    offset: 2,
    visible: true,
  },
};

List.propTypes = {
  data: PropTypes.array,
  autoPosition: PropTypes.bool,
  emptyText: PropTypes.node,
  dataLength: PropTypes.number,
  rootClassName: PropTypes.string,
  highlightFirst: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  groups: PropTypes.object,
  itemEllipsis: PropTypes.bool,
  onScrollBottom: PropTypes.func,
  renderListScroller: PropTypes.func,
  renderGroup: PropTypes.func,
  renderFooter: PropTypes.func,
  renderHeader: PropTypes.func,
  renderItem: PropTypes.func,
  activeItemIndex: PropTypes.number,
  virtualListFactory: PropTypes.func,
  renderVirtualList: PropTypes.func,
  text: PropTypes.string,
  newCustomTagText: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  isNewCustomTagValid: PropTypes.bool,

  // position
  positions: PropTypes.arrayOf(PropTypes.string),
  constrainTo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
    PropTypes.bool,
  ]),
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
        }),
      ])
    ),
  ]),

  // loading
  loadingText: PropTypes.node,
  loading: PropTypes.bool,

  relativeToViewport: PropTypes.bool,
  overlayProps: PropTypes.object,

  // item props
  itemProps: PropTypes.object,
  activeItem: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),

  selectedStyle: PropTypes.object,
  getIdProperty: PropTypes.func,
  getDisplayProperty: PropTypes.func,

  rtl: PropTypes.bool,

  // events
  onItemClick: PropTypes.func,
  getComboNode: PropTypes.func,
};

export default List;
