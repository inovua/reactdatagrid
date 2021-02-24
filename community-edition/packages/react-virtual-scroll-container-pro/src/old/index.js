/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import InovuaScrollContainer, {
  propTypes as scrollContainerPropTypes,
} from '../../../../packages/react-scroll-container-pro/src';

import ScrollerFactory from './ScrollerFactory';

const raf = global.requestAnimationFrame;
const caf = global.cancelAnimationFrame;

const VIEW_STYLE = {
  position: 'static',
};
const FLEX_1_STYLE = {
  flex: 1,
};

const filterScrollerProps = props => {
  return Object.keys(props).reduce((acc, propName) => {
    if (scrollContainerPropTypes[propName] !== undefined) {
      acc[propName] = props[propName];
    }
    return acc;
  }, {});
};

const InovuaVirtualScrollContainer = ScrollerFactory(
  'InovuaVirtualScrollContainer',
  {
    init() {
      this.childScrollLeft = 0;
      this.childScrollTop = 0;

      this.refScroller = s => {
        this.scroller = s;
        this.scrollerNode = s ? s.getScrollerNode() : null;
      };

      this.onContainerScroll = (scrollPos, ...args) => {
        const { scrollLeft, scrollTop } = scrollPos;
        this.childScrollLeft = scrollLeft;
        this.childScrollTop = scrollTop;

        if (this.containerScrollRafId) {
          caf(this.containerScrollRafId);
        }

        this.containerScrollRafId = raf(() => {
          delete this.containerScrollRafId;
          this.updateScrollStyle(scrollPos);
        });

        if (this.props.onContainerScroll) {
          this.props.onContainerScroll(scrollPos, ...args);
        }

        if (this.onScrollIntent) {
          this.onScrollIntent();
        }
      };
    },

    sync() {
      if (!this.scroller) {
        return;
      }
      if (this.scroller.rafSync) {
        this.scroller.rafSync();
      } else if (this.scroller.sync) {
        this.scroller.sync();
      }
    },

    getClientSize() {
      const { scroller } = this;
      return scroller.getClientSize();
    },

    hasScrollbar(orientation) {
      return this.scroller.hasScrollbar(orientation);
    },

    getScrollLeftMax() {
      const { scroller } = this;
      return scroller.scrollLeftMax;
    },

    getScrollTopMax() {
      const { scroller } = this;
      return scroller.scrollTopMax;
    },

    getScrollPosition() {
      return {
        scrollTop: this.childScrollTop,
        scrollLeft: this.childScrollLeft,
      };
    },

    renderScroller({
      props,
      content,
      spacer,
      scrollerStyle,
      renderView,
      viewStyle,
    }) {
      let className = 'inovua-react-virtual-scroll-container__scroll-container';
      if (props.avoidRepaintOnScroll) {
        className += ` ${className}--avoid-repaint`;
      }
      return (
        <InovuaScrollContainer
          {...filterScrollerProps(props)}
          onContainerScroll={this.onContainerScroll}
          ref={this.refScroller}
          // flex: 1 in both inline style and via className
          // (for scenarios when) people do not include the css file
          style={FLEX_1_STYLE}
          className={className}
          scrollerStyle={scrollerStyle}
          renderView={renderView}
          viewStyle={
            viewStyle ? Object.assign({}, VIEW_STYLE, viewStyle) : VIEW_STYLE
          }
          resizer={false}
        >
          {content}
          {spacer}
        </InovuaScrollContainer>
      );
    },
  }
);

InovuaVirtualScrollContainer.propTypes = Object.assign(
  {
    renderSpacer: PropTypes.func,
    renderScrollerSpacer: PropTypes.func,
  },
  scrollContainerPropTypes,
  InovuaVirtualScrollContainer.propTypes
);

export default InovuaVirtualScrollContainer;
