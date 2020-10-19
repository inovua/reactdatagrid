/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { cloneElement, createRef } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '../../../../packages/react-clean-props';
import debounce from '../../../../packages/debounce';
import NotifyResize from '../../../../packages/react-notify-resize/src';
import smoothScrollTo from '../../../../packages/smoothScrollTo';
import minified from '../../../../packages/uglified';
import join from '../../../../packages/join';
import isSafari from '../../../../packages/isSafari';
import getScrollbarWidth from '../../../../packages/getScrollbarWidth';
const raf = global.requestAnimationFrame;
let HAS_NEGATIVE_SCROLL;
const ua = global.navigator ? global.navigator.userAgent : '';
const IS_EDGE = ua.indexOf('Edge/') !== -1;
const IS_MS_BROWSER = IS_EDGE || ua.indexOf('Trident') !== -1;
const IS_IE = IS_MS_BROWSER && !IS_EDGE;
const IS_FF = ua.toLowerCase().indexOf('firefox') > -1;
const SCROLLER_Z_INDEX = 1000;
const SCROLLER_STYLE = {
    overflow: 'auto',
    position: 'static',
    flex: '1 1 auto',
    WebkitOverflowScrolling: 'auto',
};
if (IS_EDGE) {
    SCROLLER_STYLE.position = 'relative';
}
else {
    SCROLLER_STYLE.zIndex = SCROLLER_Z_INDEX;
}
// @ts-ignore
export default (displayName, CONFIG) => {
    // @ts-ignore
    class VirtualScrollContainer extends React.Component {
        constructor(props) {
            super(props);
            this.onResize = (...args) => {
                if (this.props.onResize) {
                    this.props.onResize(...args);
                }
                this.sync();
            };
            this.sync = () => {
                if (!this.domNode) {
                    return;
                }
                CONFIG.sync.call(this);
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
                return CONFIG.hasScrollbar.call(this, orientation);
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
            this.onChildResize = scrollSize => {
                this.setState({ scrollSize }, this.sync);
            };
            this.getScrollPosition = () => {
                return CONFIG.getScrollPosition.call(this);
            };
            this.updateScrollStyle = scrollPos => {
                scrollPos = scrollPos || this.getScrollPosition();
                const { scrollTop } = scrollPos;
                let { scrollLeft } = scrollPos;
                if (this.props.rtl && scrollLeft < 0) {
                    // FF has nagative scroll values for RTL
                    HAS_NEGATIVE_SCROLL = true;
                }
                const node = this.childNode.current
                    ? this.childNode.current.firstChild
                    : null;
                if (this.props.rtl) {
                    if (!HAS_NEGATIVE_SCROLL) {
                        // for browsers with non-negative scroll values, we need adjustment
                        if (IS_MS_BROWSER) {
                            scrollLeft = -scrollLeft;
                        }
                        else {
                            // chrome/Safari
                            scrollLeft = -(this.scrollLeftMax - scrollLeft);
                        }
                        // there are big differences in how browsers report scrollLeft for RTL
                        // For example, when scroll max is 300 and you scroll 1px,
                        // chrome/safari report scrollLeft 299
                        // while Edge reports 1
                        // while Firefox reports -1
                    }
                }
                if (this.props.applyScrollStyle) {
                    this.props.applyScrollStyle({ scrollLeft, scrollTop }, node);
                }
                else {
                    node.style.top = `${-scrollTop}px`;
                    node.style.left = `${-scrollLeft}px`;
                }
            };
            this.onNotifyResizeMount = () => {
                this.notifierMounted = true;
            };
            this.getBefore = () => {
                const { before } = this.props;
                if (!before) {
                    return null;
                }
                return React.cloneElement(before, {
                    key: 'before',
                    style: {
                        position: 'absolute',
                        top: 0,
                        zIndex: 2 * SCROLLER_Z_INDEX + 1,
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
                const bottom = this.props.nativeScroll
                    ? this.oldScrollbars && this.oldScrollbars.horizontal
                        ? getScrollbarWidth()
                        : 0
                    : 0;
                return React.cloneElement(after, {
                    key: 'after',
                    style: {
                        position: 'absolute',
                        zIndex: 2 * SCROLLER_Z_INDEX + 1,
                        ...after.props.style,
                        bottom,
                    },
                    children: (React.createElement(React.Fragment, null,
                        after.props.children,
                        React.createElement(NotifyResize, { notifyOnMount: true, onResize: this.onAfterElementResize }))),
                });
            };
            this.getBeforeHeight = () => {
                return this.props.before ? this.state.beforeElementSize.height || 0 : 0;
            };
            this.getAfterHeight = () => {
                return this.props.after ? this.state.afterElementSize.height || 0 : 0;
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
            this.scrollIntoView = ({ target }) => {
                if (target === this.childNode.current) {
                    if (target.scrollTop !== 0) {
                        this.scrollTop += target.scrollTop;
                        target.scrollTop = 0;
                    }
                    if (target.scrollLeft !== 0) {
                        this.scrollLeft += target.scrollLeft;
                        target.scrollLeft = 0;
                    }
                }
            };
            this.onScrollIntent = () => {
                if (!this.wheelCapturedOnScroller || IS_EDGE) {
                    return;
                }
                this.clear();
                this.lazyRestorePointerEvents();
            };
            this.lazyRestorePointerEvents = () => {
                if (this.childNode.current && this.wheelCapturedOnScroller) {
                    this.clear();
                    this.rafHandle = raf(() => {
                        this.wheelCapturedOnScroller = false;
                        delete this.rafHandle;
                        this.childNode.current.style.pointerEvents = 'auto';
                    });
                }
            };
            this.onWheelEvent = event => {
                if (isSafari() && global.WheelEvent) {
                    this.scrollerNode.dispatchEvent(new WheelEvent('wheel', event.nativeEvent));
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
                this.childNode.current.style.pointerEvents = 'none';
                this.wheelCapturedOnScroller = true;
                event.stopPropagation();
                const isProbablyChrome = !IS_MS_BROWSER && !IS_FF && !isSafari();
                const now = Date.now ? Date.now() : +new Date();
                if (isProbablyChrome) {
                    if (now - this.wheelEventTimestamp < 150) {
                        // if the event is not stopped, stop it now
                        event.preventDefault();
                    }
                }
                else {
                    event.preventDefault();
                }
                this.wheelEventTimestamp = now;
                this.onScrollIntent();
            };
            this.clear = () => {
                if (this.rafHandle) {
                    cancelAnimationFrame(this.rafHandle);
                    this.rafHandle = null;
                }
            };
            this.wheelEventTimestamp = 0;
            this.lazyRestorePointerEvents = debounce(this.lazyRestorePointerEvents, props.pointerEventsRestoreDelay, { leading: false, trailing: true });
            this.childNode = createRef();
            this.refThis = c => {
                this.domNode = c;
            };
            if (CONFIG.init) {
                CONFIG.init.call(this, props);
            }
            this.state = {
                beforeElementSize: { height: 0 },
                afterElementSize: { height: 0 },
            };
        }
        ensureNonStaticStyle(style, domNode) {
            if (!this.props.forceNonStaticPosition) {
                return style;
            }
            style = style || {};
            let { position } = style;
            let nonStatic = position === 'relative' || position === 'absolute';
            if (nonStatic) {
                return style;
            }
            if (domNode) {
                position = global.getComputedStyle(domNode).position;
                nonStatic = position === 'relative' || position === 'absolute';
                if (!nonStatic) {
                    return Object.assign({}, style, { position: 'relative' });
                }
            }
            return Object.assign({}, style, { position: 'relative' });
        }
        componentDidMount() {
            if (this.props.showWarnings) {
                if (!this.props.scrollSize) {
                    if (!this.notifierMounted) {
                        console.warn(`The component inside the ${displayName} has not rendered its children. Please either render its children, or specify a 'scrollSize' prop to determine the size of the scrolling content.`);
                    }
                }
                if (!this.props.forceNonStaticPosition &&
                    getComputedStyle(this.domNode).position === 'static') {
                    console.warn(`${displayName} has position: "static". It should have a non-static position!`);
                }
            }
            const contentNode = this.childNode.current
                ? this.childNode.current.firstChild
                : null;
            if (contentNode) {
                contentNode.style.willChange = 'transform';
            }
            if (this.props.rtl && !this.scrollLeft) {
                this.updateScrollStyle();
            }
            this.sync();
        }
        componentDidUpdate(prevProps) {
            const { scrollSize: prevScrollSize } = prevProps;
            const { scrollSize } = this.props;
            if (prevScrollSize && !scrollSize) {
                this.sync();
            }
            else if (prevScrollSize && scrollSize) {
                if (prevScrollSize.width !== scrollSize.width ||
                    prevScrollSize.height !== scrollSize.height) {
                    this.sync();
                }
            }
        }
        get clientSize() {
            return CONFIG.getClientSize.call(this);
        }
        get scrollTopMax() {
            return CONFIG.getScrollTopMax.call(this);
        }
        get scrollLeftMax() {
            return CONFIG.getScrollLeftMax.call(this);
        }
        get scrollTop() {
            return this.scroller.scrollTop;
        }
        set scrollTop(value) {
            this.scroller.scrollTop = value;
        }
        get scrollLeft() {
            return this.scroller.scrollLeft;
        }
        set scrollLeft(value) {
            this.scroller.scrollLeft = value;
        }
        render() {
            const { props } = this;
            let { style, className } = props;
            const { rtl, inertialScroll, useWheelCapture, contain, renderView, } = props;
            style = Object.assign({}, this.ensureNonStaticStyle(style, this.domNode), {
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'stretch',
                alignContent: 'stretch',
                flexFlow: 'column',
                flexWrap: 'nowrap',
                transform: 'translate3d(0px, 0px, 0px)',
            });
            if (contain) {
                if (contain === true) {
                    style.contain = 'style layout paint';
                }
                else {
                    style.contain = contain;
                }
            }
            className = join(className, 'inovua-react-virtual-scroll-container', rtl && 'inovua-react-virtual-scroll-container--rtl');
            if (CONFIG.prepareClassName) {
                className = CONFIG.prepareClassName.call(this, className);
            }
            let content = React.Children.only(props.children);
            const newContentProps = {};
            if (!this.props.scrollSize) {
                // size is given by the child,
                // so we need to enforce relative style
                // in order for NotifyResize to work properly !!!
                newContentProps.children = [
                    React.createElement(NotifyResize, { key: "notify-resize", onResize: this.onChildResize, notifyOnMount: true, ResizeObserver: this.props.ResizeObserver, useRaf: this.props.rafOnResize, checkResizeDelay: this.props.checkResizeDelay, onMount: this.onNotifyResizeMount }),
                    content.props.children,
                ];
            }
            newContentProps.style = Object.assign({}, content.props.style, {
                position: 'absolute',
                top: 0,
                [rtl ? 'right' : 'left']: 0,
            });
            const beforeHeight = this.getBeforeHeight();
            const useAbsolutePosition = IS_IE || IS_FF;
            const childStyle = {
                // visible performs better than 'hidden' on mobile, as 'hidden' has some flickering
                // but using 'visible' will make elements below the scroll container not clickable (on touch)
                // since they are somewhat covered by the view - on ios devices
                overflow: 'hidden',
                position: useAbsolutePosition ? 'absolute' : 'fixed',
                top: beforeHeight,
                left: 0,
                right: 0,
                bottom: 0,
            };
            if (!useAbsolutePosition) {
                // we need this since otherwise, a "layout" operation
                // is performed by the browser on the whole document root
                // which can be very expensive in large apps
                childStyle.backfaceVisibility = 'hidden';
                // also add this for older safaris
                if (isSafari()) {
                    childStyle.WebkitBackfaceVisibility = 'hidden';
                }
            }
            if (!IS_EDGE) {
                childStyle.zIndex = 2 * SCROLLER_Z_INDEX;
            }
            const domProps = {
                ref: this.childNode,
                style: childStyle,
                onScroll: this.scrollIntoView,
                [useWheelCapture ? 'onWheelCapture' : 'onWheel']: IS_EDGE
                    ? null
                    : this.onWheelEvent,
            };
            content = (React.createElement(React.Fragment, null,
                this.getBefore(),
                React.createElement("div", Object.assign({ key: "content" }, domProps), cloneElement(content, newContentProps)),
                this.getAfter()));
            let scrollSize = this.props.scrollSize || this.state.scrollSize;
            const afterHeight = this.getAfterHeight();
            const extraHeight = beforeHeight + afterHeight;
            if (extraHeight && scrollSize) {
                scrollSize = Object.assign({}, scrollSize, {
                    height: scrollSize.height + extraHeight,
                });
            }
            let spacer = (React.createElement("div", { "data-name": "spacer", key: "spacer", style: Object.assign({ pointerEvents: 'none' }, scrollSize) }));
            if (this.props.renderSpacer) {
                spacer = this.props.renderSpacer(spacer, { scrollSize });
            }
            const scrollerStyle = inertialScroll
                ? Object.assign({}, SCROLLER_STYLE, {
                    WebkitOverflowScrolling: 'touch',
                })
                : SCROLLER_STYLE;
            return (React.createElement("div", Object.assign({ tabIndex: -1 }, cleanProps(this.props, this.constructor.propTypes), { onFocus: this.onFocus, style: style, className: className, ref: this.refThis }),
                React.createElement(NotifyResize, { onResize: this.onResize, notifyOnMount: true, ResizeObserver: this.props.ResizeObserver, useRaf: this.props.rafOnResize, checkResizeDelay: this.props.checkResizeDelay, measureSize: this.props.measureSize }),
                CONFIG.renderScroller.call(this, {
                    props,
                    content,
                    spacer,
                    scrollerStyle,
                    renderView,
                })));
        }
    }
    // @ts-ignore
    VirtualScrollContainer.propTypes = {
        applyScrollStyle: PropTypes.func,
        avoidRepaintOnScroll: PropTypes.bool,
        forceNonStaticPosition: PropTypes.bool,
        hideNativeScrollbarIfPossible: PropTypes.bool,
        inertialScroll: PropTypes.bool,
        measureSize: PropTypes.func,
        onResize: PropTypes.func,
        contain: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        onScrollbarsChange: PropTypes.func,
        pointerEventsRestoreDelay: PropTypes.number,
        checkResizeDelay: PropTypes.number,
        rafOnResize: PropTypes.bool,
        rtl: PropTypes.bool,
        scrollSize: PropTypes.shape({
            height: PropTypes.number,
            width: PropTypes.number,
        }),
        scrollerStyle: PropTypes.shape({}),
        viewStyle: PropTypes.shape({}),
        showWarnings: PropTypes.bool,
        useWheelCapture: PropTypes.bool,
    };
    // @ts-ignore
    VirtualScrollContainer.defaultProps = {
        avoidRepaintOnScroll: true,
        // inertial scrolling on mobile safari is problematic
        // since it only works sometimes
        inertialScroll: true,
        rtl: false,
        rafOnResize: true,
        useWheelCapture: true,
        forceNonStaticPosition: false,
        pointerEventsRestoreDelay: 250,
        showWarnings: !minified,
    };
    // @ts-ignore
    return VirtualScrollContainer;
};
