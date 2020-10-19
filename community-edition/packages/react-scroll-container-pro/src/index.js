/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component, createElement, createRef, } from 'react';
import PropTypes from 'prop-types';
import debounce from '../../../packages/debounce';
import autoBind from '../../../packages/react-class/autoBind';
import cleanProps from '../../../packages/react-clean-props';
import NotifyResize from '../../../packages/react-notify-resize/src';
import isMobile from '../../../packages/isMobile';
import smoothScrollTo from '../../../packages/smoothScrollTo';
import scrollPage from '../../../packages/scrollPage';
import getScrollbarWidth from '../../../packages/getScrollbarWidth';
import shouldComponentUpdate from '../../../packages/shouldComponentUpdate';
import Scrollbar from './Scrollbar';
const callFn = fn => fn();
const raf = global.requestAnimationFrame;
const ua = global.navigator ? global.navigator.userAgent || '' : '';
const IS_EDGE = ua.indexOf('Edge/') !== -1;
const IS_MS_BROWSER = IS_EDGE || ua.indexOf('Trident') !== -1;
const IS_IE = IS_MS_BROWSER && !IS_EDGE;
let HAS_NEGATIVE_SCROLL = false;
const WRAPPER_STYLE = {
    overflow: 'hidden',
    // flex-basis auto is needed for Safari.
    // Also, we need flex-shrink 1
    flex: '1 1 auto',
    position: 'relative',
    display: 'flex',
};
const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';
const SIZES = {
    vertical: 'height',
    horizontal: 'width',
};
const OTHER_ORIENTATION = {
    vertical: 'horizontal',
    horizontal: 'vertical',
};
export default class InovuaScrollContainer extends Component {
    constructor(props) {
        super(props);
        this.applyCSSContainOnScrollUpdate = bool => {
            const scrollerNode = this.scrollerNode;
            if (scrollerNode) {
                scrollerNode.style.contain = bool ? 'strict' : '';
            }
        };
        autoBind(this, {
            scrollTop: 1,
            scrollLeft: 1,
            scrollTopMax: 1,
            scrollLeftMax: 1,
        });
        this.state = {
            scrollbars: {
                horizontal: false,
                vertical: false,
            },
        };
        this.scrollerResizerRef = s => {
            this._scrollerResizer = s;
        };
        if (props.scrollDebounceDelay > 0) {
            this.onScrollDebounce = debounce(this.onScrollDebounce, props.scrollDebounceDelay, { leading: false });
        }
        this.onStop = debounce(this.onStop, props.scrollStopDelay, {
            leading: false,
        });
        // we assume hideNativeScrollbarIfPossible
        // cannot change for the lifecycle of the component
        this.nativeScrollbarWidth = getScrollbarWidth(this.props.hideNativeScrollbarIfPossible);
        this.scroll = {
            scrollTop: 0,
            scrollLeft: 0,
        };
        this.trackSize = {};
        this.clientSize = {};
        this.scrollSize = {};
        this.scrollbars = {};
        this.scrollerClientSize = {};
        this.scrollerScrollSize = {};
        this.scrollbarRef = {
            vertical: c => {
                this.scrollbars.vertical = c;
            },
            horizontal: c => {
                const wasDefined = !!this.scrollbars.horizontal;
                this.scrollbars.horizontal = c;
                if (!wasDefined && c && this.props.rtl) {
                    c.setScrollPos(this.scrollLeftMax);
                }
            },
        };
        this.domNode = createRef();
        this.refWrapper = c => {
            if (c) {
                this.setupWrapperPassiveScrollListener(c);
            }
            else {
                this.removeWrapperPassiveScrollListener(this.wrapperNode);
            }
            this.wrapperNode = c;
        };
        this.refView = v => {
            this.viewNode = v;
        };
        this.refScroller = c => {
            if (props.usePassiveScroll) {
                if (c) {
                    this.setupPassiveScrollListener(c);
                }
                else {
                    this.removePassiveScrollListener(this.scrollerNode);
                }
            }
            this.scrollerNode = c;
        };
    }
    // ADJUST WRAPPER ON SCROLL INTO VIEW!!!
    onWrapperScroll(event) {
        const eventTarget = event.target;
        if (eventTarget != this.wrapperNode) {
            return;
        }
        const { scrollLeft, scrollTop } = eventTarget;
        if (scrollLeft) {
            eventTarget.scrollLeft = 0;
            raf(() => {
                this.scrollLeft += scrollLeft;
            });
        }
        if (scrollTop) {
            eventTarget.scrollTop = 0;
            raf(() => {
                this.scrollTop += scrollTop;
            });
        }
    }
    setupWrapperPassiveScrollListener(node) {
        node.addEventListener('scroll', this.onWrapperScroll, {
            passive: true,
        });
    }
    removeWrapperPassiveScrollListener(node = this.wrapperNode) {
        if (node) {
            node.removeEventListener('scroll', this.onWrapperScroll, {
                passive: true,
            });
        }
    }
    setupPassiveScrollListener(node) {
        node.addEventListener('scroll', this.onScroll, {
            passive: true,
        });
    }
    removePassiveScrollListener(node = this.scrollerNode) {
        if (node) {
            node.removeEventListener('scroll', this.onScroll, {
                passive: true,
            });
        }
    }
    componentWillUnmount() {
        this.unmounted = true;
        if (this.props.usePassiveScroll) {
            this.removePassiveScrollListener();
        }
        if (typeof this.props.onWillUnmount === 'function') {
            this.props.onWillUnmount(this);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shouldComponentUpdate(this, nextProps, nextState);
    }
    ensureNonStaticStyle(style, domNode) {
        if (!this.props.forceNonStaticPosition) {
            return style;
        }
        style = style || {};
        let { position } = style;
        let nonStatic = position == 'relative' || position == 'absolute';
        if (nonStatic) {
            return style;
        }
        if (domNode) {
            position = global.getComputedStyle(domNode).position;
            nonStatic = position == 'relative' || position == 'absolute';
            if (!nonStatic) {
                return { ...style, position: 'relative' };
            }
        }
        return { ...style, position: 'relative' };
    }
    render() {
        const { props } = this;
        const { renderScroller, renderView, factory: Factory, inlineBlock, usePassiveScroll, theme, contain, nativeScroll, } = props;
        let { style, children } = props;
        let className = props.className || '';
        style = {
            overflow: 'hidden',
            display: props.display
                ? props.display
                : inlineBlock
                    ? 'inline-flex'
                    : 'flex',
            flexFlow: 'column',
            ...this.ensureNonStaticStyle(style, this.domNode.current),
        };
        if (contain) {
            if (contain === true) {
                style.contain = 'style layout paint';
            }
            else {
                style.contain = contain;
            }
        }
        const factoryProps = cleanProps(props, InovuaScrollContainer.propTypes);
        className += inlineBlock
            ? ' inovua-react-scroll-container--inline-block'
            : ' inovua-react-scroll-container--block';
        className += ' inovua-react-scroll-container';
        if (theme) {
            className += ` inovua-react-scroll-container--theme-${theme}`;
        }
        const nativeScrollbarWidth = this.nativeScrollbarWidth;
        const emptyScrollOffset = this.getEmptyScrollOffset();
        let scrollerStyle = {};
        if (this.props.inertialScroll) {
            scrollerStyle.WebkitOverflowScrolling = 'touch';
        }
        if (this.props.scrollerStyle) {
            scrollerStyle = { ...scrollerStyle, ...this.props.scrollerStyle };
        }
        scrollerStyle.overflow = nativeScroll ? 'auto' : 'scroll';
        scrollerStyle.direction = this.props.rtl ? 'rtl' : 'ltr';
        if (!nativeScroll) {
            scrollerStyle[this.props.rtl ? 'marginLeft' : 'marginRight'] =
                -emptyScrollOffset - nativeScrollbarWidth;
            scrollerStyle.marginBottom = -emptyScrollOffset - nativeScrollbarWidth;
        }
        const viewClassName = `${this.props.viewClassName ||
            ''} inovua-react-scroll-container__view ${!nativeScrollbarWidth
            ? 'inovua-react-scroll-container__view--zero-width-scrollbar'
            : ''}`;
        let viewChildren = children;
        let viewStyle = {};
        if (this.props.viewStyle) {
            viewStyle = { ...viewStyle, ...this.props.viewStyle };
        }
        if (!emptyScrollOffset || nativeScroll) {
            viewChildren = children;
        }
        else {
            viewStyle[this.props.rtl ? 'paddingLeft' : 'paddingRight'] = emptyScrollOffset;
            const viewChildrenStyle = {
                paddingBottom: emptyScrollOffset,
            };
            if (IS_IE) {
                viewChildrenStyle.display = 'inline-block';
            }
            viewChildren = (React.createElement("div", { key: "viewChildren", style: viewChildrenStyle }, children));
        }
        const resizer = !!this.props.resizer;
        const viewProps = {
            ref: this.refView,
            className: viewClassName,
            style: viewStyle,
            children: [
                viewChildren,
                resizer && (React.createElement(NotifyResize, { ResizeObserver: this.props.ResizeObserver, checkResizeDelay: this.props.checkResizeDelay, key: "viewResizer", useRaf: this.props.rafOnResize, onResize: this.onViewResize, notifyOnMount: true })),
            ],
        };
        const view = renderView ? (renderView(viewProps)) : (React.createElement("div", Object.assign({ key: "view" }, viewProps)));
        const scrollerProps = {
            className: `inovua-react-scroll-container__scroller inovua-react-scroll-container__scroller--direction-${this.props.rtl ? 'rtl' : 'ltr'}`,
            style: scrollerStyle,
            ref: this.refScroller,
            children: [
                view,
                resizer ? (React.createElement(NotifyResize, Object.assign({ ref: this.scrollerResizerRef }, props.scrollerResizerProps, { ResizeObserver: this.props.ResizeObserver, checkResizeDelay: this.props.checkResizeDelay, useRaf: this.props.rafOnResize, key: "scrollerResizer", onResize: this.onResize, notifyOnMount: true }))) : null,
            ].filter(Boolean),
        };
        if (!usePassiveScroll) {
            scrollerProps.onScroll = this.onScroll;
        }
        if (this.props.avoidRepaintOnScroll) {
            scrollerProps.className +=
                ' inovua-react-scroll-container__scroller--avoid-repaint';
        }
        if (this.props.hideNativeScrollbarIfPossible) {
            scrollerProps.className +=
                ' inovua-react-scroll-container__scroller--hide-native-scrollbar-if-possible';
        }
        if (this.props.dragToScroll) {
            scrollerProps.tabIndex = -1;
        }
        const scroller = renderScroller ? (renderScroller(scrollerProps)) : (React.createElement("div", Object.assign({}, scrollerProps)));
        children = [
            React.createElement("div", { key: "wrapper", className: "inovua-react-scroll-container__wrapper", ref: this.refWrapper, style: this.props.wrapperStyle
                    ? { ...WRAPPER_STYLE, ...this.props.wrapperStyle }
                    : WRAPPER_STYLE, children: scroller }),
            ...this.renderScrollbars(),
            this.props.before
                ? React.cloneElement(this.props.before, { key: 'before' })
                : null,
            this.props.after
                ? React.cloneElement(this.props.after, {
                    key: 'after',
                    style: {
                        ...this.props.after.props.style,
                        bottom: this.state.scrollbars.horizontal && this.props.nativeScroll
                            ? this.nativeScrollbarWidth
                            : 0,
                    },
                })
                : null,
        ];
        if (this.props.showScrollbarsOnOver) {
            factoryProps.onMouseEnter = this.onMouseEnter;
            factoryProps.onMouseLeave = this.onMouseLeave;
        }
        return Factory ? (React.createElement(Factory, Object.assign({}, factoryProps, { ref: this.domNode, style: style, className: className, children: children }))) : (createElement(props.tagName, {
            ...factoryProps,
            ref: this.domNode,
            style,
            className,
            children,
        }));
    }
    onMouseEnter(event) {
        this.mouseEntered = true;
        this.setScrollbarsVisible({
            horizontal: true,
            vertical: true,
        });
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter(event);
        }
    }
    onMouseLeave() {
        this.mouseEntered = false;
        this.setScrollbarsVisible({
            horizontal: false,
            vertical: false,
        });
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(event);
        }
    }
    onViewResize(size) {
        this.rafSync(() => {
            if (this.props.onViewResize) {
                this.props.onViewResize(size, this);
            }
        });
    }
    onResize(size) {
        if (this.props.rafOnResize) {
            this.rafSync(() => {
                if (this.props.onResize) {
                    this.props.onResize(size, this);
                }
            });
        }
        else {
            this.sync();
            if (this.props.onResize) {
                this.props.onResize(size, this);
            }
        }
    }
    componentDidMount() {
        if (typeof this.props.onDidMount === 'function') {
            this.props.onDidMount(this, this.getDOMNode(), this._scrollerResizer);
        }
    }
    getDOMNode() {
        return this.domNode.current;
    }
    set scrollTop(value) {
        this.getScrollerNode().scrollTop = value;
    }
    set scrollLeft(value) {
        this.getScrollerNode().scrollLeft = value;
    }
    get scrollTop() {
        return this.scroll.scrollTop;
    }
    get scrollLeft() {
        return this.scroll.scrollLeft;
    }
    getScrollPosition() {
        return this.scroll;
    }
    get scrollTopMax() {
        if (!this.scrollerScrollSize.height || !this.scrollerClientSize.height) {
            this.getScrollbars();
        }
        return this.scrollerScrollSize.height - this.scrollerClientSize.height;
    }
    get scrollLeftMax() {
        if (!this.scrollerScrollSize.width || !this.scrollerClientSize.width) {
            this.getScrollbars();
        }
        return this.scrollerScrollSize.width - this.scrollerClientSize.width;
    }
    renderScrollbars() {
        const { scrollbars } = this.state;
        return [
            scrollbars.vertical && this.renderScrollbar('vertical', scrollbars),
            scrollbars.horizontal && this.renderScrollbar('horizontal', scrollbars),
        ];
    }
    getEmptyScrollOffset() {
        return this.props.emptyScrollOffset == null
            ? isMobile
                ? 17
                : IS_IE
                    ? 0
                    : getScrollbarWidth()
            : this.props.emptyScrollOffset;
    }
    renderScrollbar(orientation, scrollbars) {
        if (this.checkAllowedScrollbars()[orientation] === false) {
            return null;
        }
        const sizeName = SIZES[orientation];
        const nativeScrollbarWidth = this.nativeScrollbarWidth;
        const oppositeVisible = scrollbars[OTHER_ORIENTATION[orientation]];
        const { scrollThumbWidth, scrollThumbStartEndRespectMargin, scrollThumbMargin, } = this.props;
        let trackSize = this.trackSize[sizeName];
        trackSize -= scrollThumbMargin * (scrollThumbStartEndRespectMargin ? 2 : 1);
        if (oppositeVisible) {
            trackSize -= scrollThumbWidth;
        }
        const emptyScrollOffset = this.getEmptyScrollOffset();
        const scrollbarProps = {
            key: orientation,
            ref: this.scrollbarRef[orientation],
            emptyScrollOffset,
            nativeScrollbarWidth,
            orientation,
            visible: !this.props.autoHide,
            autoHide: this.props.autoHide,
            rtl: this.props.rtl,
            oppositeVisible,
            scrollThumbStyle: this.props.scrollThumbStyle,
            trackSize,
            scrollSize: this.scrollerScrollSize[sizeName],
            clientSize: this.clientSize[sizeName] + emptyScrollOffset,
            dragToScroll: this.props.dragToScroll,
            scrollThumbMinSize: this.props.scrollThumbMinSize,
            scrollThumbRadius: this.props.scrollThumbRadius,
            scrollThumbStartEndRespectMargin,
            scrollThumbOverWidth: this.props.scrollThumbOverWidth,
            scrollThumbWidth,
            scrollThumbMargin,
            scrollTrackOverTransitionDuration: this.props
                .scrollTrackOverTransitionDuration,
            showTrackOnDrag: this.props.showTrackOnDrag,
            alwaysShowTrack: this.props.alwaysShowTrack,
            hideTransitionDuration: this.props.hideTransitionDuration,
            showTransitionDuration: this.props.showTransitionDuration,
            onScrollThumbScrollTop: this.onScrollThumbScrollTop,
            onScrollThumbScrollLeft: this.onScrollThumbScrollLeft,
            onStartDrag: this.props.dragToScroll && this.onScrollbarStartDrag,
            onStopDrag: this.props.dragToScroll && this.onScrollbarStopDrag,
            onWheelScroll: this.onScrollbarWheelScroll,
            onPageScroll: this.onScrollbarPageScroll,
        };
        return React.createElement(Scrollbar, Object.assign({}, scrollbarProps));
    }
    onScrollbarStartDrag(orientation) {
        if (this.props.onScrollbarStartDrag) {
            this.props.onScrollbarStartDrag(orientation);
        }
        if (orientation == VERTICAL && this.props.onVerticalScrollbarStartDrag) {
            this.props.onVerticalScrollbarStartDrag();
        }
        else if (this.props.onHorizontalScrollbarStartDrag) {
            this.props.onHorizontalScrollbarStartDrag();
        }
    }
    onScrollbarStopDrag(orientation) {
        this.focus();
        if (this.props.onScrollbarStopDrag) {
            this.props.onScrollbarStopDrag(orientation);
        }
        if (orientation == VERTICAL && this.props.onVerticalScrollbarStopDrag) {
            this.props.onVerticalScrollbarStopDrag();
        }
        else if (this.props.onHorizontalScrollbarStopDrag) {
            this.props.onHorizontalScrollbarStopDrag();
        }
    }
    focus() {
        this.getScrollerNode().focus();
    }
    onScrollbarWheelScroll(orientation, delta) {
        const node = this.getScrollerNode();
        const horiz = orientation == 'horizontal';
        const scrollPosName = horiz ? 'scrollLeft' : 'scrollTop';
        const currentValue = node[scrollPosName];
        const newValue = currentValue + delta;
        this.smoothScrollTo(newValue, {
            orientation,
            duration: 10,
        });
    }
    onScrollbarPageScroll(orientation, direction) {
        this.focus();
        this.scrollPage(orientation, direction);
    }
    scrollPage(orientation, direction) {
        if (!direction) {
            throw new Error('Please provide a scroll direction: 1 or -1!');
        }
        const node = this.getScrollerNode();
        const horiz = orientation == 'horizontal';
        scrollPage(node, {
            orientation,
            direction,
            pageSize: this.clientSize[horiz ? 'width' : 'height'] - 20,
        });
    }
    scrollHorizontalPage(direction) {
        this.scrollPage('horizontal', direction);
    }
    scrollVerticalPage(direction) {
        this.scrollPage('vertical', direction);
    }
    smoothScrollTo(newValue, cfg, callback) {
        return smoothScrollTo(this.getScrollerNode(), newValue, cfg, callback);
    }
    onScrollThumbScrollTop(pos) {
        this.getScrollerNode().scrollTop = pos;
    }
    onScrollThumbScrollLeft(pos) {
        this.getScrollerNode().scrollLeft = pos;
    }
    getScrollerNode() {
        this.scrollerNode =
            this.scrollerNode || this.getDOMNode().firstChild.firstChild;
        return this.scrollerNode;
    }
    getScrollerChild() {
        this.scrollerChild =
            this.scrollerChild || this.getScrollerNode().firstChild;
        return this.scrollerChild;
    }
    getTrackSize() {
        const node = this.getDOMNode();
        if (this.props.getTrackSize) {
            return this.props.getTrackSize(node);
        }
        return {
            width: node.clientWidth,
            height: node.clientHeight,
        };
    }
    getScrollSize() {
        if (this.props.getScrollSize) {
            return this.props.getScrollSize(this.getScrollerNode());
        }
        const node = this.getScrollerChild();
        return {
            width: node.scrollWidth,
            height: node.scrollHeight,
        };
    }
    getClientSize() {
        const n = this.getDOMNode();
        if (this.props.getClientSize) {
            return this.props.getClientSize(n);
        }
        const node = n.firstChild;
        return {
            width: node.clientWidth,
            height: node.clientHeight,
        };
    }
    getScrollbars() {
        this.trackSize = this.getTrackSize();
        const scrollSize = (this.scrollSize = this.getScrollSize());
        this.clientSize = this.getClientSize();
        const scrollerNode = this.getScrollerNode();
        this.scrollerClientSize = this.props.getScrollerNodeClientSize
            ? this.props.getScrollerNodeClientSize(scrollerNode)
            : {
                height: scrollerNode.clientHeight,
                width: scrollerNode.clientWidth,
            };
        const scrollerNodeClientSize = this.scrollerClientSize;
        this.scrollerScrollSize = {
            height: scrollerNode.scrollHeight,
            width: scrollerNode.scrollWidth,
        };
        if (this.props.rtl) {
            // chrome does not report scrollWidth correctly when direction is rtl
            // this.scrollerScrollSize = {
            //   width: scrollSize.width,
            //   height: scrollSize.height,
            // };
        }
        const scrollbars = {
            vertical: scrollSize.height > scrollerNodeClientSize.height,
            horizontal: scrollSize.width > scrollerNodeClientSize.width,
        };
        return scrollbars;
    }
    rafSync(callback) {
        raf(() => {
            this.sync();
            if (callback) {
                callback();
            }
        });
    }
    sync() {
        if (this.unmounted) {
            return;
        }
        const { scrollbars: oldScrollbars } = this.state;
        const scrollbars = this.getScrollbars();
        this.setState({
            scrollbars,
        }, () => {
            if (this.props.onScrollbarsChange &&
                (scrollbars.vertical != oldScrollbars.vertical ||
                    scrollbars.horizontal != oldScrollbars.horizontal)) {
                this.props.onScrollbarsChange(scrollbars);
            }
        });
        if (this.props.rtl) {
            const scrollNode = this.getScrollerNode();
            if (!scrollNode) {
                return;
            }
            this.onScrollDebounce(scrollNode);
        }
    }
    hasScrollbar(orientation) {
        return this.state.scrollbars[orientation];
    }
    hasVerticalScrollbar() {
        return this.hasScrollbar(VERTICAL);
    }
    hasHorizontalScrollbar() {
        return this.hasScrollbar(HORIZONTAL);
    }
    onScroll(event) {
        const eventTarget = event.target;
        if (this.props.onScroll) {
            this.props.onScroll(event);
        }
        if (eventTarget != this.scrollerNode) {
            return;
        }
        this.onScrollDebounce(eventTarget);
    }
    onScrollDebounce(eventTarget) {
        const { props } = this;
        const { rafOnScroll, cancelPrevScrollRaf, avoidScrollTopBrowserLayout, scrollMaxDelta, } = props;
        const rafFn = rafOnScroll ? raf : callFn;
        if (this.scrollRafId && rafOnScroll && cancelPrevScrollRaf) {
            global.cancelAnimationFrame(this.scrollRafId);
        }
        this.scrollRafId = rafFn(() => {
            if (this.unmounted) {
                return;
            }
            delete this.scrollRafId;
            const { onScrollStart, onScrollStop, autoHide, applyCSSContainOnScroll, } = props;
            const startStop = !!(onScrollStart ||
                onScrollStop ||
                autoHide ||
                avoidScrollTopBrowserLayout ||
                applyCSSContainOnScroll);
            let scrollTop;
            let scrollLeft;
            if (!avoidScrollTopBrowserLayout) {
                scrollTop = eventTarget.scrollTop;
                scrollLeft = eventTarget.scrollLeft;
            }
            else {
                const targetRect = this.targetRect || eventTarget.getBoundingClientRect();
                this.targetRect = targetRect;
                const viewRect = eventTarget.firstChild.getBoundingClientRect();
                scrollTop = targetRect.top - viewRect.top;
                scrollLeft = targetRect.left - viewRect.left;
            }
            const scrollLeftMax = this.scrollerScrollSize.width - this.scrollerClientSize.width;
            const scrollPos = { scrollTop, scrollLeft, scrollLeftMax };
            const prevScrollPos = this.scroll;
            const { scrollTop: prevScrollTop, scrollLeft: prevScrollLeft, scrollLeftMax: prevScrollLeftMax, } = prevScrollPos;
            if (startStop) {
                if (!this.scrollStarted) {
                    if (applyCSSContainOnScroll) {
                        this.applyCSSContainOnScrollUpdate(true);
                    }
                    if (onScrollStart) {
                        onScrollStart(scrollPos, prevScrollPos, eventTarget);
                    }
                }
            }
            let scrollVertical = false;
            let scrollHorizontal = false;
            if (props.onContainerScroll) {
                props.onContainerScroll(scrollPos, prevScrollPos, eventTarget, {
                    scrollerScrollSize: this.scrollerScrollSize,
                    scrollerClientSize: this.scrollerClientSize,
                    scrollLeftMax,
                });
            }
            const scrollTopChange = scrollTop != prevScrollTop;
            if (scrollTopChange) {
                scrollVertical = true;
                if (this.scrollbars.vertical) {
                    this.scrollbars.vertical.setScrollPos(scrollTop);
                }
                if (props.onContainerScrollVertical) {
                    props.onContainerScrollVertical(scrollTop, prevScrollTop, eventTarget);
                }
                if (props.onContainerScrollVerticalMin && scrollTop == 0) {
                    props.onContainerScrollVerticalMin(0, eventTarget);
                }
                if (props.onContainerScrollVerticalMax &&
                    (scrollMaxDelta
                        ? scrollTop >= this.scrollTopMax - scrollMaxDelta
                        : scrollTop == this.scrollTopMax)) {
                    props.onContainerScrollVerticalMax(scrollTop);
                }
            }
            let scrollLeftChange = scrollLeft != prevScrollLeft;
            if (this.props.rtl && !scrollLeftChange) {
                scrollLeftChange = scrollLeftMax != prevScrollLeftMax;
            }
            if (scrollLeftChange) {
                scrollHorizontal = true;
                if (this.scrollbars.horizontal) {
                    this.scrollbars.horizontal.setScrollPos(scrollLeft);
                }
                if (props.onContainerScrollHorizontal) {
                    props.onContainerScrollHorizontal(scrollLeft, prevScrollLeft, eventTarget, scrollLeftMax);
                }
                if (props.onContainerScrollHorizontalMin && scrollLeft == 0) {
                    props.onContainerScrollHorizontalMin(0, eventTarget);
                }
                if (props.onContainerScrollHorizontalMax &&
                    (scrollMaxDelta
                        ? Math.abs(scrollLeft /* abs is here for rtl, when scrollLeft is negative */) >=
                            scrollLeftMax - scrollMaxDelta
                        : Math.abs(scrollLeft /* abs is here for rtl, when scrollLeft is negative */) == scrollLeftMax)) {
                    props.onContainerScrollHorizontalMax(scrollLeft, eventTarget);
                }
            }
            // the scroll event could be called with the same values,
            // in which case we could enter an infinite loop in the onStop method,
            // so we're protecting against this
            if (startStop && (scrollTopChange || scrollLeftChange)) {
                if (!this.scrollStarted ||
                    this.scrollStarted.vertical != scrollVertical ||
                    this.scrollStarted.horizontal != scrollHorizontal) {
                    this.lazyShowScrollbars();
                    this.scrollStarted = {
                        horizontal: scrollHorizontal,
                        vertical: scrollVertical,
                    };
                }
                this.onStop(scrollPos, prevScrollPos, eventTarget);
            }
            this.scroll = scrollPos;
        });
    }
    getContainerTargetNode() {
        const view = this.viewNode;
        return !this.props.emptyScrollOffset ? view : view.firstChild;
    }
    lazyShowScrollbars() {
        if (this.props.autoHide) {
            setTimeout(this.showScrollbars, this.props.showDelay);
        }
    }
    onStop(scrollPos, prevScrollPos, eventTarget) {
        this.scrollStarted = false;
        if (this.props.applyCSSContainOnScroll) {
            this.applyCSSContainOnScrollUpdate(false);
        }
        delete this.targetRect;
        if (this.props.onScrollStop) {
            this.props.onScrollStop(scrollPos, prevScrollPos, eventTarget);
        }
        setTimeout(this.hideScrollbars, this.props.hideDelay);
    }
    showScrollbars() {
        if (this.props.autoHide && this.scrollStarted) {
            const { horizontal, vertical } = this.scrollbars;
            const { horizontal: scrollHorizontal, vertical: scrollVertical, } = this.scrollStarted;
            let visibleScrollbars = {};
            if (scrollHorizontal) {
                visibleScrollbars.horizontal = true;
            }
            if (scrollVertical) {
                visibleScrollbars.vertical = true;
            }
            this.setScrollbarsVisible(visibleScrollbars);
        }
    }
    checkAllowedScrollbars() {
        const result = {
            vertical: true,
            horizontal: true,
        };
        const { scrollbars } = this.props;
        if (scrollbars === false) {
            result.vertical = false;
            result.horizontal = false;
        }
        if (typeof scrollbars == 'object') {
            if (scrollbars.horizontal === false) {
                result.horizontal = false;
            }
            if (scrollbars.false === false) {
                result.false = false;
            }
        }
        const { shouldAllowScrollbars } = this.props;
        if (typeof shouldAllowScrollbars == 'function') {
            const shouldAllow = shouldAllowScrollbars(this.props, getScrollbarWidth());
            if (shouldAllow === false ||
                (shouldAllow && shouldAllow.horizontal === false)) {
                result.horizontal = false;
            }
            if (shouldAllow === false ||
                (shouldAllow && shouldAllow.vertical === false)) {
                result.vertical = false;
            }
        }
        return result;
    }
    setScrollbarsVisible(scrollbars) {
        let { horizontal: horizontalVisible, vertical: verticalVisible, } = scrollbars;
        const { horizontal, vertical } = this.scrollbars;
        if (horizontalVisible !== undefined && horizontal) {
            horizontal.setVisible(horizontalVisible);
        }
        if (verticalVisible !== undefined && vertical) {
            vertical.setVisible(verticalVisible);
        }
    }
    hideScrollbars() {
        if (this.props.showScrollbarsOnOver && this.mouseEntered) {
            return;
        }
        if (this.props.autoHide && !this.scrollStarted) {
            this.setScrollbarsVisible({ horizontal: false, vertical: false });
        }
    }
}
InovuaScrollContainer.defaultProps = {
    shouldAllowScrollbars: (props, scrollbarWidth) => {
        if (props.nativeScroll) {
            return false;
        }
        if (!scrollbarWidth) {
            return false;
        }
    },
    avoidRepaintOnScroll: true,
    avoidScrollTopBrowserLayout: false,
    applyCSSContainOnScroll: true,
    alwaysShowTrack: false,
    autoHide: true,
    cancelPrevScrollRaf: true,
    contain: false,
    dragToScroll: true,
    forceNonStaticPosition: false,
    hideDelay: 400,
    hideTransitionDuration: '300ms',
    inertialScroll: true,
    inlineBlock: false,
    rafOnScroll: false,
    rafOnResize: false,
    scrollDebounceDelay: 0,
    resizer: true,
    rtl: false,
    scrollStopDelay: 180,
    scrollThumbMargin: 2,
    scrollThumbStartEndRespectMargin: true,
    scrollThumbWidth: 7,
    scrollThumbOverWidth: 10,
    scrollThumbRadius: 3,
    showDelay: 100,
    showScrollbarsOnOver: true,
    showTransitionDuration: '100ms',
    showTrackOnDrag: false,
    scrollTrackOverTransitionDuration: '100ms',
    usePassiveScroll: true,
    tagName: 'div',
    theme: 'default',
};
const propTypes = {
    alwaysShowTrack: PropTypes.bool,
    avoidScrollTopBrowserLayout: PropTypes.bool,
    applyCSSContainOnScroll: PropTypes.bool,
    avoidRepaintOnScroll: PropTypes.bool,
    autoHide: PropTypes.bool,
    cancelPrevScrollRaf: PropTypes.bool,
    dragToScroll: PropTypes.bool,
    display: PropTypes.string,
    checkResizeDelay: PropTypes.number,
    emptyScrollOffset: PropTypes.number,
    factory: PropTypes.func,
    nativeScroll: PropTypes.bool,
    forceNonStaticPosition: PropTypes.bool,
    hideDelay: PropTypes.number,
    getClientSize: PropTypes.func,
    getScrollSize: PropTypes.func,
    getTrackSize: PropTypes.func,
    getScrollerNodeClientSize: PropTypes.func,
    hideTransitionDuration: PropTypes.string,
    hideNativeScrollbarIfPossible: PropTypes.bool,
    inertialScroll: PropTypes.bool,
    rtl: PropTypes.bool,
    inlineBlock: PropTypes.bool,
    rafOnResize: PropTypes.bool,
    contain: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    onContainerScroll: PropTypes.func,
    onContainerScrollHorizontal: PropTypes.func,
    onContainerScrollHorizontalMax: PropTypes.func,
    onContainerScrollHorizontalMin: PropTypes.func,
    onContainerScrollVertical: PropTypes.func,
    onContainerScrollVerticalMax: PropTypes.func,
    onContainerScrollVerticalMin: PropTypes.func,
    onResize: PropTypes.func,
    onScroll: PropTypes.func,
    onScrollbarsChange: PropTypes.func,
    onScrollStart: PropTypes.func,
    onScrollStop: PropTypes.func,
    onViewResize: PropTypes.func,
    rafOnScroll: PropTypes.bool,
    scrollDebounceDelay: PropTypes.number,
    renderScroller: PropTypes.func,
    renderView: PropTypes.func,
    resizer: PropTypes.bool,
    scrollbars: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
            vertical: PropTypes.bool,
            horizontal: PropTypes.bool,
        }),
    ]),
    usePassiveScroll: PropTypes.bool,
    showScrollbarsOnOver: PropTypes.bool,
    onScrollbarStartDrag: PropTypes.func,
    onScrollbarStopDrag: PropTypes.func,
    onHorizontalScrollbarStartDrag: PropTypes.func,
    onHorizontalScrollbarStopDrag: PropTypes.func,
    onVerticalScrollbarStartDrag: PropTypes.func,
    onVerticalScrollbarStopDrag: PropTypes.func,
    scrollerStyle: PropTypes.shape({}),
    scrollStopDelay: PropTypes.number,
    scrollThumbMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    scrollMaxDelta: PropTypes.number,
    scrollThumbMinSize: PropTypes.number,
    scrollThumbOverWidth: PropTypes.number,
    scrollThumbRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    scrollThumbStartEndRespectMargin: PropTypes.bool,
    scrollThumbWidth: PropTypes.number,
    scrollThumbStyle: PropTypes.shape(),
    scrollTrackOverTransitionDuration: PropTypes.string,
    showDelay: PropTypes.number,
    showTrackOnDrag: PropTypes.bool,
    shouldComponentUpdate: PropTypes.func,
    shouldAllowScrollbars: PropTypes.func,
    showTransitionDuration: PropTypes.string,
    tagName: PropTypes.string,
    theme: PropTypes.string,
    scrollerResizerProps: PropTypes.object,
    onDidMount: PropTypes.func,
    onWillUnmount: PropTypes.func,
    viewClassName: PropTypes.string,
    viewStyle: PropTypes.shape({}),
    wrapperStyle: PropTypes.shape({}),
    ResizeObserver: PropTypes.func,
};
InovuaScrollContainer.propTypes = propTypes;
export { propTypes, cleanProps, smoothScrollTo, scrollPage, getScrollbarWidth, isMobile, };
