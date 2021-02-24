/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function getListProps({ props, state = {}, computed }) {
  return {
    ...computed,
    style: props.listStyle,
    relativeToViewport: props.relativeToViewport,
    virtualListFactory: props.virtualListFactory,
    renderListScroller: props.renderListScroller,
    renderVirtualList: props.renderVirtualList,
    className: props.listClassName,
    rootClassName: `${props.rootClassName}__list`,
    emptyText: props.listEmptyText,
    maxHeight: props.listMaxHeight,
    minHeight: props.listMinHeight,
    positions: props.positions,
    constrainTo: props.constrainTo,
    offset: props.offset,
    rtl: props.rtl,
    theme: props.theme,
    highlightFirst: props.highlightFirst,
    loadingText: props.listLoadingText,
    groups: state.groups,
    renderGroup: props.renderGroup,
    renderFooter: props.renderFooter,
    renderHeader: props.renderHeader,
    renderItem: props.renderItem,
    itemEllipsis: props.itemEllipsis,
    activeItemIndex: state.activeItemIndex,
    newCustomTagText: props.newCustomTagText,
    autoPosition: props.autoPosition,
    itemProps: {
      background: props.itemBackground,
      disabledStyle: props.disabledItemStyle,
      disabledClassName: props.disabledItemClassName,
      activeStyle: props.activeItemStyle,
      activeClassName: props.activeItemClassName,
      selectedStyle: props.selectedStyle,
      selectedClassName: props.selectedClassName,
    },
  };
}

export default getListProps;
