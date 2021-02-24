/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { propTypes as scrollContainerPropTypes } from '../../../../packages/react-scroll-container-pro/src';
import debounce from '../../../../packages/debounce';
import getScrollbarWidth from '../../../../packages/getScrollbarWidth';
import isSafari from '../../../../packages/isSafari';

import ScrollerFactory from './ScrollerFactory';

const raf = global.requestAnimationFrame;

const emptyObject = {};

const SCROLLBAR_WIDTH = getScrollbarWidth();

const onScrollbarsChange = function(scrollbars) {
  if (SCROLLBAR_WIDTH) {
    const style = this.childNode.style;
    const rtl = this.props.rtl;

    const right = scrollbars.vertical ? SCROLLBAR_WIDTH : 0;
    const bottom = scrollbars.horizontal ? SCROLLBAR_WIDTH : 0;

    // normally, browsers have the vertical scrollbar on the left for RTL
    // but there is an exception of course, which is SAFARI,
    // which has the vertical scrollbar on the right
    style
      ? (style[rtl && !isSafari() ? 'left' : 'right'] = `${right}px`)
      : null;
    style ? (style.bottom = `${bottom}px`) : null;
  }

  if (this.props.onScrollbarsChange) {
    this.props.onScrollbarsChange(scrollbars);
  }
};

const onStop = function(scrollPos, prevScrollPos) {
  this.scrollStarted = false;

  if (this.props.onScrollStop) {
    this.props.onScrollStop(scrollPos, prevScrollPos);
  }
};

const onScroll = function({ target }) {
  const { onScrollStart, onScrollStop } = this.props;
  const startStop = !!(onScrollStart || onScrollStop);

  const { scrollTop, scrollLeft } = target;

  const scrollPos = { scrollTop, scrollLeft };
  const prevScrollPos = this.currentScrollPosition || emptyObject;
  const {
    scrollTop: prevScrollTop,
    scrollLeft: prevScrollLeft,
  } = prevScrollPos;

  if (startStop) {
    if (!this.scrollStarted) {
      if (onScrollStart) {
        onScrollStart(scrollPos, prevScrollPos);
      }
    }
  }

  let scrollVertical = false;
  let scrollHorizontal = false;

  if (this.props.onContainerScroll) {
    this.props.onContainerScroll(scrollPos, prevScrollPos);
  }

  const scrollTopChange = scrollTop !== prevScrollTop;

  if (scrollTopChange) {
    scrollVertical = true;
    if (this.props.onContainerScrollVertical) {
      this.props.onContainerScrollVertical(scrollTop, prevScrollTop);
    }
    if (this.props.onContainerScrollVerticalMin && scrollTop === 0) {
      this.props.onContainerScrollVerticalMin(0);
    }
    if (
      this.props.onContainerScrollVerticalMax &&
      scrollTop === this.scrollTopMax
    ) {
      this.props.onContainerScrollVerticalMax(scrollTop);
    }
  }

  const scrollLeftChange = scrollLeft !== prevScrollLeft;

  if (scrollLeftChange) {
    scrollHorizontal = true;
    if (this.props.onContainerScrollHorizontal) {
      this.props.onContainerScrollHorizontal(scrollLeft, prevScrollLeft);
    }
    if (this.props.onContainerScrollHorizontalMin && scrollLeft === 0) {
      this.props.onContainerScrollHorizontalMin(0);
    }
    if (
      this.props.onContainerScrollHorizontalMax &&
      scrollLeft === this.scrollLeftMax
    ) {
      this.props.onContainerScrollHorizontalMax(scrollLeft);
    }
  }

  // the scroll event could be called with the same values,
  // in which case we could enter an infinite loop in the onStop method,
  // so we're protecting against this
  if (startStop && (scrollTopChange || scrollLeftChange)) {
    if (
      !this.scrollStarted ||
      this.scrollStarted.vertical !== scrollVertical ||
      this.scrollStarted.horizontal !== scrollHorizontal
    ) {
      this.scrollStarted = {
        horizontal: scrollHorizontal,
        vertical: scrollVertical,
      };
    }

    this.onStop(scrollPos, prevScrollPos);
  }

  this.currentScrollPosition = scrollPos;
};

const InovuaNativeScrollContainer = ScrollerFactory(
  'InovuaNativeScrollContainer',
  {
    init(props) {
      this.refScroller = s => {
        this.scroller = s;
      };

      this.onStop = debounce(onStop.bind(this), props.scrollStopDelay, {
        leading: false,
      });

      this.onScrollerScroll = event => {
        if (event.target === this.scroller) {
          raf(() => {
            this.updateScrollStyle();
          });

          onScroll.call(this, event);
          this.onScrollIntent();
        }

        // make sure the default onScroll is called, if passed
        if (this.props.onScroll) {
          this.props.onScroll(event);
        }
      };
    },
    prepareClassName(className) {
      return `${className} inovua-react-virtual-scroll-container--native`;
    },
    sync() {
      if (!this.oldScrollbars) {
        this.oldScrollbars = this.getScrollbars();
        return;
      }

      const scrollbars = this.getScrollbars();

      if (
        scrollbars.vertical !== this.oldScrollbars.vertical ||
        scrollbars.horizontal !== this.oldScrollbars.horizontal
      ) {
        onScrollbarsChange.call(this, scrollbars);
      }

      this.oldScrollbars = scrollbars;
    },
    getClientSize() {
      const { scroller } = this;
      return { height: scroller.clientHeight, width: scroller.clientWidth };
    },
    hasScrollbar(orientation) {
      const { scroller } = this;

      return orientation === 'horizontal'
        ? scroller.scrollWidth > scroller.clientWidth
        : scroller.scrollHeight > scroller.clientHeight;
    },
    getScrollLeftMax() {
      const { scroller } = this;
      return scroller.scrollWidth - scroller.clientWidth;
    },
    getScrollTopMax() {
      const { scroller } = this;
      return scroller.scrollHeight - scroller.clientHeight;
    },
    getScrollPosition() {
      return { scrollTop: this.scrollTop, scrollLeft: this.scrollLeft };
    },
    renderScroller({ content, spacer, scrollerStyle, props }) {
      const { renderScroller } = props;

      let className = 'inovua-react-virtual-scroll-container__scroll-container';
      if (props.avoidRepaintOnScroll) {
        className += ` ${className}--avoid-repaint`;
      }

      const domProps = {
        key: 'scroller',
        tabIndex: -1,
        onScroll: this.onScrollerScroll,
        ref: this.refScroller,
        style: scrollerStyle,
        className: className,
        children: [content, spacer],
      };

      const result =
        typeof renderScroller === 'function' ? (
          renderScroller(domProps)
        ) : (
          <div {...domProps} />
        );

      return result;
    },
  }
);

InovuaNativeScrollContainer.propTypes = {
  renderScrollerSpacer: PropTypes.func,
  ...scrollContainerPropTypes,
  ...InovuaNativeScrollContainer.propTypes,
};

InovuaNativeScrollContainer.defaultProps.scrollStopDelay = 150;

export default InovuaNativeScrollContainer;
