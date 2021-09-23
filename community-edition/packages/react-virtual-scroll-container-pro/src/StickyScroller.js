/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @ts-nocheck
import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import InovuaScrollContainer from '../../react-scroll-container-pro/src';
import cleanProps from '../../react-clean-props';
import { sticky } from '../../hasSticky';
import smoothScrollTo from '../../smoothScrollTo';
import isMobile from '../../isMobile';
import getScrollbarWidth from '../../getScrollbarWidth';
import join from '../../join';
import isSafari from '../../isSafari';
import NotifyResize from '../../react-notify-resize/src';
const STICKY_STYLE = {
    position: sticky,
    top: 0,
    left: 0,
};
const WRAPPER_STYLE = {
    display: 'block',
    position: 'absolute',
    flex: '',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
};
const ua = global.navigator ? global.navigator.userAgent : '';
const IS_EDGE = ua.indexOf('Edge/') !== -1;
class StickyVirtualScrollContainer extends React.Component {
    constructor(props) {
        super(props);
        this.initializeScrollLeftForRtl = () => {
            const fixScrollLeft = () => {
                if (this.scroller && this.scrollLeftMax) {
                    this.scroller.getScrollerNode().scrollLeft = 1000000000;
                    return;
                }
                requestAnimationFrame(fixScrollLeft);
            };
            requestAnimationFrame(fixScrollLeft);
        };
        this.onResize = (...args) => {
            if (this.props.onResize) {
                this.props.onResize(...args);
            }
            this.sync();
        };
        this.sync = () => {
            this.scroller.sync();
        };
        this.rafSync = () => {
            if (this.scroller.rafSync) {
                this.scroller.rafSync();
            }
            else {
                this.scroller.sync();
            }
        };
        this.smoothScrollTo = (newValue, config, callback) => {
            smoothScrollTo(this.scroller, newValue, config, callback);
        };
        this.getScrollbars = () => {
            return {
                horizontal: this.hasHorizontalScrollbar(),
                vertical: this.hasVerticalScrollbar(),
            };
        };
        this.hasScrollbar = orientation => {
            return this.scroller.hasScrollbar.call(this, orientation);
        };
        this.hasVerticalScrollbar = () => {
            return this.hasScrollbar('vertical');
        };
        this.hasHorizontalScrollbar = () => {
            return this.hasScrollbar('horizontal');
        };
        this.focus = () => {
            this.scroller.focus();
        };
        this.onFocus = event => {
            if (event.target === this.domNode) {
                this.focus();
            }
            if (this.props.onFocus) {
                this.props.onFocus(event);
            }
        };
        this.getTransformNode = () => {
            return this.viewNode.children[0].children[0];
        };
        this.getScrollSize = () => {
            const node = this.getTransformNode();
            let size;
            if (this.props.getScrollSize) {
                size = this.props.getScrollSize(node);
            }
            else {
                size = {
                    width: node.scrollWidth,
                    height: node.scrollHeight,
                };
            }
            return size;
        };
        this.getScrollPosition = () => {
            return this.scroller.getScrollPosition();
        };
        this.updateScrollStyle = (scrollPos, prevScrollPos) => {
            scrollPos = scrollPos || this.getScrollPosition();
            const { scrollTop, scrollLeft, scrollLeftMax } = scrollPos;
            this.scrollLeftMaxValue = scrollLeftMax;
            if (this.props.onContainerScroll) {
                this.props.onContainerScroll(scrollPos, prevScrollPos);
            }
            const node = this.getTransformNode();
            let shouldApplyDefaultTransform = true;
            if (this.props.applyScrollStyle) {
                shouldApplyDefaultTransform =
                    this.props.applyScrollStyle({ scrollLeft, scrollTop, scrollLeftMax }, node) !== false;
            }
            if (shouldApplyDefaultTransform) {
                node.style.willChange = `transform`;
                node.style.backfaceVisibility = `hidden`;
                if (this.props.useTransformToScroll) {
                    node.style.transform = `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0px)`;
                }
                else {
                    node.style.top = `${-scrollTop}px`;
                    node.style.left = `${-scrollLeft}px`;
                }
            }
        };
        this.getBeforeHeight = () => {
            return this.props.before ? this.state.beforeElementSize.height || 0 : 0;
        };
        this.getAfterHeight = () => {
            return this.props.after ? this.state.afterElementSize.height || 0 : 0;
        };
        this.getBeforeAndAfterHeight = () => {
            return this.getBeforeHeight() + this.getAfterHeight();
        };
        this.onViewResize = (...args) => {
            const [size] = args;
            this.setState({
                size,
            }, () => {
                this.rafSync();
            });
            if (this.props.onViewResize) {
                this.props.onViewResize(...args);
            }
        };
        this.renderScrollerSpacer = () => {
            const spacerProps = {
                key: 'spacer',
                'data-name': 'spacer--sticky-scroller',
                style: {
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    ...this.state.size,
                },
            };
            let result;
            if (this.props.renderScrollerSpacer) {
                result = this.props.renderScrollerSpacer(spacerProps, this.state.size);
            }
            if (result === undefined) {
                result = React.createElement("div", Object.assign({}, spacerProps));
            }
            return result;
        };
        this.renderScroller = scrollerProps => {
            const scrollerOffset = this.props.nativeScroll
                ? 0
                : -this.getEmptyScrollOffset();
            // -this.props.emptyScrollOffset - this.nativeScrollbarWidth;
            const props = {
                ...scrollerProps,
                'data-name': 'scroller',
                className: '',
                style: {
                    display: 'block',
                    position: 'absolute',
                    WebkitOverflowScrolling: 'touch',
                    top: 0,
                    left: 0,
                    // right: this.props.rtl && !this.props.nativeScroll ? 0 : scrollerOffset,
                    right: scrollerOffset,
                    bottom: scrollerOffset,
                    overflow: this.props.nativeScroll ? 'auto' : 'scroll',
                },
                children: [
                    this.props.extraChildren,
                    scrollerProps.children,
                    this.renderScrollerSpacer(),
                ],
            };
            let result;
            if (this.props.renderScroller) {
                result = this.props.renderScroller(props);
            }
            if (result === undefined) {
                result = React.createElement("div", Object.assign({}, props));
            }
            return result;
        };
        this.getBefore = () => {
            const { before } = this.props;
            if (!before) {
                return null;
            }
            return React.cloneElement(before, {
                style: {
                    position: 'absolute',
                    top: 0,
                    ...before.props.style,
                },
                children: (React.createElement(React.Fragment, null,
                    before.props.children,
                    React.createElement(NotifyResize, { notifyOnMount: true, onResize: this.onBeforeElementResize }))),
            });
        };
        this.getAfter = () => {
            const { after } = this.props;
            if (!after) {
                return null;
            }
            return React.cloneElement(after, {
                style: {
                    position: 'absolute',
                    bottom: 0,
                    ...after.props.style,
                },
                children: (React.createElement(React.Fragment, null,
                    after.props.children,
                    React.createElement(NotifyResize, { notifyOnMount: true, onResize: this.onAfterElementResize }))),
            });
        };
        this.onBeforeElementResize = size => {
            this.setState({
                beforeElementSize: size,
            });
        };
        this.onAfterElementResize = size => {
            this.setState({
                afterElementSize: size,
            });
        };
        this.refView = c => {
            this.viewNode = c ? findDOMNode(c) : null;
        };
        this.refScroller = s => {
            this.scroller = s;
            this.scrollerNode = s ? s.getScrollerNode() : null;
        };
        this.state = {
            size: {},
            beforeElementSize: { height: 0 },
            afterElementSize: { height: 0 },
        };
    }
    componentDidMount() {
        this.sync();
        if (this.props.rtl) {
            this.initializeScrollLeftForRtl();
        }
    }
    getDOMNode() {
        return this.scroller.getDOMNode();
    }
    componentDidUpdate(prevProps) {
        if (this.props.rtl) {
            if (prevProps.rtl !== this.props.rtl ||
                prevProps.nativeScroll !== this.props.nativeScroll) {
                this.initializeScrollLeftForRtl();
            }
        }
    }
    get scrollTop() {
        return this.scroller.scrollTop;
    }
    get scrollTopMax() {
        return this.scroller.scrollTopMax;
    }
    set scrollTop(value) {
        this.scroller.scrollTop = value;
    }
    get scrollLeft() {
        return this.scroller.scrollLeft;
    }
    get scrollLeftMax() {
        return this.scrollLeftMaxValue != null
            ? this.scrollLeftMaxValue
            : this.scroller.scrollLeftMax;
    }
    set scrollLeft(value) {
        this.scroller.scrollLeft =
            this.props.rtl && value < 0 ? this.scrollLeftMax + value : value;
    }
    getEmptyScrollOffset() {
        return this.props.emptyScrollOffset == null
            ? getScrollbarWidth()
            : this.props.emptyScrollOffset;
    }
    render() {
        const { props } = this;
        let { style, className } = props;
        const { rtl, contain } = props;
        if (contain) {
            style = { ...style };
            if (contain === true) {
                style.contain = 'style layout paint';
            }
            else {
                style.contain = contain;
            }
        }
        if (this.props.rtl) {
            // rtl will be forced on the sticky element
            style = { ...style, direction: 'ltr' };
        }
        className = join(className, 'inovua-react-virtual-scroll-container', rtl && 'inovua-react-virtual-scroll-container--rtl', 'inovua-react-virtual-scroll-container--sticky-strategy');
        let stickyStyle = STICKY_STYLE;
        if (this.props.rtl) {
            stickyStyle = { ...stickyStyle, direction: 'rtl' };
        }
        const beforeHeight = this.getBeforeHeight();
        const afterHeight = this.getAfterHeight();
        const renderView = viewProps => {
            const viewDOMProps = {
                ref: this.refView,
                style: stickyStyle,
                key: 'view',
                'data-name': 'view',
                children: (React.createElement("div", { style: {
                        position: 'absolute',
                        minWidth: '100%',
                        direction: 'ltr',
                    } },
                    React.createElement("div", { style: {
                            position: 'absolute',
                            overflow: 'hidden',
                            minWidth: '100%',
                            direction: this.props.rtl ? 'rtl' : 'ltr',
                        } },
                        viewProps.children[0],
                        viewProps.children[1]))),
            };
            let result;
            if (this.props.renderView) {
                result = this.props.renderView(viewDOMProps);
            }
            if (result === undefined) {
                result = React.createElement("div", Object.assign({}, viewDOMProps));
            }
            return result;
        };
        const cleanedProps = cleanProps(this.props, this.constructor.propTypes);
        if (this.props.nativeScroll) {
            cleanedProps.scrollbars = false;
        }
        return (React.createElement(InovuaScrollContainer, Object.assign({ tabIndex: -1, display: this.props.display || 'block', className: className, wrapperStyle: {
                ...WRAPPER_STYLE,
                top: beforeHeight,
                bottom: afterHeight,
            } }, cleanedProps, { style: style, before: this.getBefore(), after: this.getAfter(), nativeScroll: this.props.nativeScroll, emptyScrollOffset: 0, getScrollSize: this.getScrollSize, renderScroller: this.renderScroller, renderView: renderView, onViewResize: this.onViewResize, onContainerScroll: this.updateScrollStyle, ref: this.refScroller, browserScroll: this.props.browserScroll })));
    }
}
StickyVirtualScrollContainer.propTypes = {
    contain: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    before: PropTypes.element,
    after: PropTypes.element,
    extraChildren: PropTypes.node,
    renderScrollerSpacer: PropTypes.func,
    applyScrollStyle: PropTypes.func,
    useTransformToScroll: PropTypes.bool,
    preventRtlInherit: PropTypes.bool,
    browserScroll: PropTypes.bool,
};
StickyVirtualScrollContainer.defaultProps = {
    useTransformToScroll: !IS_EDGE,
    shouldAllowScrollbars: (props, scrollbarWidth) => {
        if (props.nativeScroll) {
            return false;
        }
        if (scrollbarWidth) {
            return true;
        }
        if (isMobile || isSafari()) {
            return false;
        }
        return true;
    },
};
export default StickyVirtualScrollContainer;
export { isMobile, getScrollbarWidth };
