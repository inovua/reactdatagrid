/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import isMobile from '../../../common/isMobile';

import cleanProps from '../../../common/cleanProps';
import debounce from '../../../common/debounce';
import join from '../../../packages/join';

import { Flex, Item } from '../../Flex';
import { NotifyResize } from '../../NotifyResize';
import { InertialManager } from '../../InertialScroller';
import { IS_IE } from '../../../common/ua';
import ScrollContainer from '../../../packages/react-scroll-container-pro';

import Arrow from './Arrow';

const VIEW_STYLE_VERTICAL = { maxHeight: '100%' };
const VIEW_STYLE_HORIZONTAL = { maxWidth: '100%' };

const observe = (targetNode, callback, cfg) => {
  // Options for the observer (which mutations to observe)
  const config = cfg || { attributes: false, childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
  return () => {
    observer.disconnect();
  };
};

const measureScrollSize = node => {
  return {
    width: node.scrollWidth,
    height: node.scrollHeight,
  };
};

const scrollerResizerProps = {
  useNativeIfAvailable: false,
  measureSize: measureScrollSize,
};

const callAll = (...fns) => (...args) => {
  fns.forEach(fn => {
    fn && fn(...args);
  });
};

const pint = global.parseInt;
const raf = global.requestAnimationFrame;
const getCompStyle = global.getComputedStyle;

const NO_SCROLLBARS = () => false;

class InovuaArrowScroller extends Component {
  constructor(props) {
    super(props);

    this.scrollInfo = {
      scrollPos: 0,
      hasStartScroll: false,
      hasEndScroll: false,
      scrollerSize: {
        start: 0,
        end: 0,
      },
    };

    this.state = {
      scrolling: false,
      activeScroll: 0,
    };

    this.handleResize = debounce(this.handleResize.bind(this), 50, {
      leading: false,
      trailing: true,
    });

    this.updateScrollInfo = this.updateScrollInfo.bind(this);
    this.rafUpdateScrollInfo = this.rafUpdateScrollInfo.bind(this);
    this.onContainerScroll = this.onContainerScroll.bind(this);

    this.strip = createRef();

    this.refScrollContainer = scrollContainer => {
      this.scrollerTarget = scrollContainer;
    };

    this.root = createRef();
    if (!this.props.nativeScroll) {
      this.scrollerTarget = this.root;
    }
  }

  componentDidMount() {
    raf(() => {
      const name = this.getOffsetSizeName();

      this.scrollInfo.scrollerSize = {
        start:
          this.props.scroller === (true || 'auto') ? this.start[name] : null,
        end: this.props.scroller === (true || 'auto') ? this.end[name] : null,
      };

      this.syncScroll({ force: true });
      this.componentIsMounted = true;

      this.inertialManager = new InertialManager({
        arrowSelector: `.${this.props.rootClassName}__arrow`,
        node: this.root.current,
        viewNode: this.strip.current,
        setScrollPosition: () => raf(() => this.setScrollPosition()),
        enableMouseDrag: false,
      });
    });
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
    if (this.inertialManager) {
      this.inertialManager.removeEventListeners();
    }
  }

  render() {
    const { props } = this;
    const {
      useTransformOnScroll,
      nativeScroll,
      vertical,
      rootClassName,
      rtl,
      theme,
    } = props;
    const scrollInfo = this.scrollInfo;

    const scrollValue = rtl ? scrollInfo.scrollPos : -scrollInfo.scrollPos;

    const innerWrapperClassName = join(
      `${rootClassName}__inner-wrapper`,
      `${rootClassName}__inner-wrapper--direction-${
        vertical ? 'column' : 'row'
      }`
    );

    const className = join(
      props.className,
      rootClassName,
      !vertical && `${rootClassName}--direction-horizontal`,
      vertical && `${rootClassName}--direction-vertical`,
      rtl && `${rootClassName}--rtl`,
      nativeScroll && `${rootClassName}--native-scroll`,
      theme && `${rootClassName}--theme-${theme}`
    );

    let transformValue;
    let moveStyle = {};

    if (useTransformOnScroll) {
      moveStyle.transform = 'translate3d(0px, 0px, 0px)';
    }
    if (vertical) {
      if (useTransformOnScroll) {
        moveStyle.transform = `translate3d(0px, ${scrollValue}px, 0px)`;
      } else {
        moveStyle.top = scrollValue;
      }
    } else {
      if (useTransformOnScroll) {
        moveStyle.transform = `translate3d(${scrollValue}px, 0px, 0px)`;
      } else {
        moveStyle.left = scrollValue;
      }
    }

    const resizer = (
      <NotifyResize
        key="resizer"
        notifyOnMount
        onResize={this.handleResize}
        notifyResizeDelay={props.notifyResizeDelay}
      />
    );
    const children = [...React.Children.toArray(props.children), resizer];

    const content = (
      <Flex
        key="content"
        wrap={false}
        {...props.childProps}
        className={innerWrapperClassName}
        ref={this.strip}
        children={children}
        style={nativeScroll ? null : moveStyle}
      />
    );

    let finalChildren = [
      resizer,
      content,
      this.renderScroller(-1),
      this.renderScroller(1),
    ];

    if (nativeScroll) {
      const { scrollContainerProps } = this.props;
      let viewStyle = vertical ? VIEW_STYLE_VERTICAL : VIEW_STYLE_HORIZONTAL;
      if (scrollContainerProps && scrollContainerProps.viewStyle) {
        viewStyle = { ...scrollContainerProps.viewStyle, ...viewStyle };
      }

      const style = { maxHeight: '100%' };
      let scrollerStyle;

      if (this.props.rtl) {
        viewStyle.direction = 'rtl';
        viewStyle.maxWidth = '';

        style.alignItems = 'flex-end';
        style.maxWidth = '100%';

        scrollerStyle = { alignItems: 'flex-end' };
      }

      let prevChildren = finalChildren;
      finalChildren = (
        <ScrollContainer
          applyCSSContainOnScroll={false}
          style={style}
          scrollerStyle={scrollerStyle}
          emptyScrollOffset={20}
          getScrollerNodeClientSize={
            this.props.rtl ? this.getScrollerNodeClientSize : null
          }
          className={`${this.props.rootClassName}__scroll-container`}
          shouldAllowScrollbars={NO_SCROLLBARS}
          dragToScroll={false}
          nativeScroll={
            scrollContainerProps
              ? scrollContainerProps.nativeScroll !== undefined
                ? scrollContainerProps.nativeScroll
                : false
              : false
          }
          viewStyle={viewStyle}
          ref={this.refScrollContainer}
          scrollerResizerProps={scrollerResizerProps}
          onDidMount={this.onScrollContainerDidMount}
          onWillUnmount={this.onScrollContainerWillUnmount}
          onResize={
            scrollContainerProps && scrollContainerProps.onResize
              ? callAll(scrollContainerProps.onResize, this.rafUpdateScrollInfo)
              : this.rafUpdateScrollInfo
          }
          children={prevChildren}
          onContainerScroll={this.onContainerScroll}
          theme={props.theme}
        />
      );

      if (this.props.rtl) {
        finalChildren = [finalChildren, resizer];
      }
    }

    return (
      <Flex
        {...cleanProps(props, InovuaArrowScroller.propTypes)}
        ref={this.root}
        className={className}
        alignItems="start"
        children={finalChildren}
      />
    );
  }

  getScrollerNodeClientSize = node => {
    const result = {
      width: node.firstChild.offsetWidth,
      height: node.firstChild.offsetHeight,
    };

    return result;
  };

  renderScroller(direction) {
    const { scroller, vertical, rootClassName, nativeScroll } = this.props;
    if (!scroller) {
      return null;
    }

    const arrowName = vertical
      ? direction == (this.props.rtl ? 1 : -1)
        ? 'up'
        : 'down'
      : direction == (this.props.rtl ? 1 : -1)
      ? 'left'
      : 'right';

    const scrollInfo = this.scrollInfo;
    const disabled =
      direction == -1 ? !scrollInfo.hasStartScroll : !scrollInfo.hasEndScroll;

    const arrowRootClassName = `${rootClassName}__arrow`;

    const className = join(
      arrowRootClassName,
      `${arrowRootClassName}--auto`,
      `${arrowRootClassName}--direction-${arrowName}`,
      this.state.activeScroll == direction && `${arrowRootClassName}--active`,
      scroller === 'auto' && disabled && `${arrowRootClassName}--hidden`,
      scroller === 'auto' && !disabled && `${arrowRootClassName}--visible`,
      scroller === true && disabled && `${arrowRootClassName}--disabled`,
      nativeScroll && `${arrowRootClassName}--native-scroll`
    );

    const onClick =
      !disabled && this.props.scrollOnClick
        ? this.handleClick.bind(this, direction)
        : null;

    const onMouseDown =
      !disabled && (!this.props.scrollOnClick || isMobile)
        ? this.startScroll.bind(this, direction)
        : null;

    const onMouseEnter =
      !disabled && this.props.scrollOnMouseEnter
        ? this.startMouseOverScroll.bind(this, direction)
        : null;

    const onMouseLeave =
      !this.props.scrollOnClick || isMobile || this.props.scrollOnMouseEnter
        ? this.stopMouseOverScroll.bind(this, direction)
        : null;

    const onDoubleClick = !disabled
      ? this.handleScrollMax.bind(this, direction)
      : null;

    const scrollerName = direction == -1 ? 'start' : 'end';

    const domProps = {
      ref: ref => {
        this[scrollerName] = ref;
      },
      key: `scroller-${direction}`,
      disabled,
      className,
      onClick,
      onDoubleClick,
      onMouseDown: !isMobile ? onMouseDown : null,
      onTouchStart: isMobile ? onMouseDown : null,
      onTouchEnd: isMobile ? onMouseLeave : null,
      onMouseEnter: !isMobile ? onMouseEnter : null,
      onMouseLeave: !isMobile ? onMouseLeave : null,
      children: this.renderArrowIcon(arrowName),
    };

    let result;

    if (typeof this.props.renderScroller === 'function') {
      result = this.props.renderScroller({ domProps, direction });
    }

    if (result === undefined) {
      result = <div {...domProps} />;
    }

    return result;
  }

  renderArrowIcon(name) {
    const { props } = this;
    return (
      <Arrow
        name={name}
        size={props.arrowSize}
        height={props.arrowHeight}
        width={props.arrowWidth}
        className={`${this.props.rootClassName}__arrow-icon`}
      />
    );
  }

  getOffsetSizeName() {
    return this.props.vertical ? 'offsetHeight' : 'offsetWidth';
  }

  getBorderAndPaddingSize(node = this.root.current, side) {
    const computedStyle = getCompStyle(node);

    let start;
    let end;
    if (this.props.vertical) {
      start =
        pint(computedStyle.borderTopWidth) + pint(computedStyle.paddingTop);
      end =
        pint(computedStyle.borderBottomWidth) +
        pint(computedStyle.paddingBottom);
      return start + end;
    } else {
      start =
        pint(computedStyle.borderLeftWidth) + pint(computedStyle.paddingLeft);
      end =
        pint(computedStyle.borderRightWidth) + pint(computedStyle.paddingRight);
    }
    return side ? (side == 'start' ? start : end) : start + end;
  }

  getSizeName() {
    return this.props.vertical ? 'height' : 'width';
  }

  /**
   * Cache the available width on this instance.
   * It will be invalidated by handleResize
   *
   * @return {Number}
   */
  getAvailableSize() {
    // if there is no wrapper it will take the root node as wrapper
    if (!this.root.current) {
      return null;
    }
    let size =
      this.availableSize ||
      (this.props.nativeScroll
        ? this.props.vertical
          ? this.scrollerTarget.scrollTopMax
          : this.scrollerTarget.scrollLeftMax
        : this.root.current[this.getOffsetSizeName()] -
          this.getBorderAndPaddingSize());

    if (this.props.rtl && size < 0) {
      size = -size;
    }
    this.availableSize = size;

    return size;
  }

  /**
   * Cache the current list width on this instance.
   *
   * It will be invalidated by handleResize
   *
   * @return {Number}
   */
  getCurrentListSize() {
    if (!this.strip.current) {
      return null;
    }

    return (this.currentListSize =
      this.currentListSize || this.strip.current[this.getOffsetSizeName()]);
  }

  // events
  handleResize() {
    if (!this.componentIsMounted) {
      return;
    }

    delete this.currentListSize;
    delete this.availableSize;
    this.syncScroll({ force: true });
  }

  handleScrollMax(direction, event) {
    event.stopPropagation();
    event.preventDefault();

    const maxPos = direction == -1 ? 0 : this.scrollInfo.maxScrollPos;

    raf(() => {
      this.setScrollPosition(maxPos);
    });
  }

  handleClick(direction) {
    const offset = this.getAvailableSize();
    this.scrollBy(offset, direction);
  }

  // methods
  stopScroll() {
    global.clearInterval(this.scrollInterval);

    this.setState({
      scrolling: false,
      activeScroll: 0,
    });
  }

  rafUpdateScrollInfo() {
    raf(this.updateScrollInfo);
  }

  updateScrollInfo(count) {
    if (this.componentIsMounted === false) {
      return;
    }
    const availableSize = this.getAvailableSize();

    if (!availableSize) {
      if (!count || count < 5) {
        raf(() => {
          this.updateScrollInfo((count || 0) + 1);
        });
        return;
      }
    }

    const listSize = this.getCurrentListSize();
    const scrollInfo = Object.assign(this.scrollInfo, {
      availableSize,
      listSize,
    });

    if (this.props.nativeScroll) {
      if (this.scrollerTarget) {
        scrollInfo.maxScrollPos = this.props.vertical
          ? this.scrollerTarget.scrollTopMax
          : this.scrollerTarget.scrollLeftMax;
      }
    } else {
      if (listSize > availableSize) {
        scrollInfo.maxScrollPos = listSize - availableSize;
      } else {
        scrollInfo.maxScrollPos = 0;
      }
    }

    if (this.props.rtl && scrollInfo.maxScrollPos < 0) {
      scrollInfo.maxScrollPos = -scrollInfo.maxScrollPos;
    }

    scrollInfo.hasStartScroll = scrollInfo.scrollPos != 0;
    scrollInfo.hasEndScroll = scrollInfo.scrollPos < scrollInfo.maxScrollPos;

    const hasScroll = listSize > availableSize;
    if (hasScroll !== this.state.hasScroll) {
      this.props.onHasScrollChange(hasScroll);
    }
    this.setState({
      hasScroll,
    });
  }

  startScroll(direction, event) {
    const eventName = isMobile ? 'touchend' : 'mouseup';
    event.preventDefault();
    const mouseUpListener = () => {
      this.stopScroll();
      global.removeEventListener(eventName, mouseUpListener);
    };

    global.addEventListener(eventName, mouseUpListener);

    this.scrollInterval = global.setInterval(
      this.doScroll.bind(this, direction),
      this.props.scrollSpeed
    );

    this.setState({
      scrolling: true,
      activeScroll: direction,
    });
  }

  onContainerScroll({ scrollTop, scrollLeft }) {
    this.setScrollPosition(this.props.vertical ? scrollTop : scrollLeft, {
      skip: true,
    });
  }

  startMouseOverScroll(direction, event) {
    event.preventDefault();
    global.clearInterval(this.mouseOverScrollInterval);
    this.mouseOverScrollInterval = global.setInterval(
      this.doScroll.bind(this, direction),
      this.props.mouseoverScrollSpeed
    );

    this.setState({
      scrolling: true,
      activeScroll: direction,
    });
  }

  stopMouseOverScroll() {
    this.stopScroll();
    global.clearInterval(this.mouseOverScrollInterval);
  }

  setScrollPosition(scrollPos, { force, skip } = {}) {
    if (!this.componentIsMounted) {
      return;
    }
    const scrollInfo = this.scrollInfo;
    if (scrollPos > scrollInfo.maxScrollPos) {
      scrollPos = scrollInfo.maxScrollPos;
    }

    if (scrollPos < 0) {
      scrollPos = 0;
    }

    if (scrollPos === scrollInfo.scrollPos && force !== true) {
      return null;
    }

    Object.assign(scrollInfo, {
      hasStartScroll: scrollPos !== 0,
      hasEndScroll: scrollPos < scrollInfo.maxScrollPos,
      scrollPos,
    });

    if (!skip && this.props.nativeScroll && this.scrollerTarget) {
      if (this.props.vertical) {
        this.scrollerTarget.scrollTop = scrollPos;
      } else {
        this.scrollerTarget.scrollLeft = scrollPos;
      }
    }

    this.setState({});
  }

  syncScroll({ force } = {}) {
    this.updateScrollInfo();
    this.doScroll(0, null, { force });
  }

  scrollIntoView(domNode) {
    const rootNode = this.root.current;
    if (!domNode || !rootNode) {
      return;
    }

    const rect = domNode.getBoundingClientRect();
    const mainRect = rootNode.getBoundingClientRect();

    const { vertical } = this.props;
    const startSideName = vertical ? 'top' : 'left';
    const endSideName = vertical ? 'bottom' : 'right';

    const startDiff =
      rect[startSideName] -
      (mainRect[startSideName] +
        this.getBorderAndPaddingSize(undefined, 'start'));

    const endDiff =
      rect[endSideName] -
      (mainRect[endSideName] - this.getBorderAndPaddingSize(undefined, 'end'));

    const scrollIntoViewOffset = this.props.scrollIntoViewOffset;

    if (startDiff < 0) {
      this.doScroll(-startDiff + scrollIntoViewOffset, -1);
    } else if (endDiff > 0) {
      this.doScroll(endDiff + scrollIntoViewOffset, 1);
    }
  }

  doScroll(direction, step, { force } = {}) {
    const scrollInfo = this.scrollInfo;
    const newScrollPos =
      scrollInfo.scrollPos + direction * (step || this.props.scrollStep);
    raf(() => {
      this.setScrollPosition(newScrollPos, { force });
    });
  }

  scrollBy(offset, direction, { force } = {}) {
    const scrollInfo = this.scrollInfo;
    const newScrollPos = scrollInfo.scrollPos + direction * offset;
    raf(() => {
      this.setScrollPosition(newScrollPos, { force });
    });
  }

  onScrollContainerDidMount = (scrollContainer, domNode, notifyResizer) => {
    const scrollContainerNode = findDOMNode(scrollContainer);
    this._unobserve = observe(scrollContainerNode, () => {
      // fixes https://inovua.freshdesk.com/a/tickets/238
      if (notifyResizer && notifyResizer.checkResize) {
        notifyResizer.checkResize();
      }
    });
  };

  onScrollContainerWillUnmount = () => {
    if (this._unobserve) {
      this._unobserve();
    }
  };
}

const emptyFn = () => {};

InovuaArrowScroller.defaultProps = {
  rootClassName: 'inovua-react-toolkit-arrow-scroller',
  scroller: 'auto',
  scrollStep: 15,
  mouseoverScrollSpeed: 40,
  scrollSpeed: 10,
  scrollSpringConfig: {
    stiffness: 370,
    damping: 60,
  },
  scrollIntoViewOffset: 1,
  vertical: false,
  scrollOnClick: false,
  nativeScroll: !IS_IE,
  scrollOnMouseEnter: true,
  rtl: false,
  useTransformOnScroll: false,
  onHasScrollChange: emptyFn,
  theme: 'default-light',
};

InovuaArrowScroller.propTypes = {
  arrowSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
  ]),
  theme: PropTypes.string,

  scrollOnClick: PropTypes.bool,
  childProps: PropTypes.object,
  scrollOnMouseEnter: PropTypes.bool,
  vertical: PropTypes.bool,
  notifyResizeDelay: PropTypes.number,
  scrollStep: PropTypes.number,
  scrollSpeed: PropTypes.number,
  mouseoverScrollSpeed: PropTypes.number,
  scrollSpringConfig: PropTypes.shape({
    stiffness: PropTypes.number,
    damping: PropTypes.number,
  }),
  nativeScroll: PropTypes.bool,
  scrollIntoViewOffset: PropTypes.number,
  scroller: PropTypes.oneOf(['auto', false, true]),
  rootClassName: PropTypes.string,
  rtl: PropTypes.bool,
  scrollContainerProps: PropTypes.object,
  useTransformOnScroll: PropTypes.bool,
  onHasScrollChange: PropTypes.func,
  renderScroller: PropTypes.func,
};

export default InovuaArrowScroller;
