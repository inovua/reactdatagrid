/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import NotifyResize from '../../../packages/react-notify-resize/src';
import smoothScrollTo from '../../smoothScrollTo';
const defaultProps = {
    theme: 'default-light',
    scrollDebounceDelay: 0,
    scrollDebounce: false,
    rafOnScroll: false,
    cancelPrevScrollRaf: true,
    avoidScrollTopBrowserLayout: false,
    applyCSSContainOnScroll: true,
    usePassiveScroll: true,
};
class Scroller extends Component {
    constructor(props) {
        super(props);
        this.unmounted = false;
        this.scrollStarted = false;
        this.setupPassiveScrollListener = (node) => {
            node.addEventListener('scroll', this.onScroll, {
                passive: true,
            });
        };
        this.removePassiveScrollListener = (node = this.domNode) => {
            if (node) {
                node.removeEventListener('scroll', this.onScroll, {
                    passive: true,
                });
            }
        };
        this.componentDidMount = () => {
            if (typeof this.props.onDidMount === 'function') {
                this.props.onDidMount(this, this.getDOMNode(), this.browserResizer);
            }
        };
        this.componentWillUnmount = () => {
            this.unmounted = true;
            if (this.props.usePassiveScroll) {
                this.removePassiveScrollListener();
            }
            if (typeof this.props.onWillUnmount === 'function') {
                this.props.onWillUnmount(this);
            }
        };
        this.onScroll = (event) => {
            const eventTarget = event.target;
            if (this.props.onScroll) {
                this.props.onScroll(event);
            }
            const scrollTop = eventTarget.scrollTop;
            this.updateScroll({ scrollTop });
        };
        this.updateScroll = ({ scrollTop }) => {
            if (this.props.onBrowserScroll) {
                this.props.onBrowserScroll({
                    scrollTop,
                    reorder: false,
                });
            }
        };
        this.onStop = (scrollPos, prevScrollPos, eventTarget) => {
            this.scrollStarted = false;
            if (this.props.applyCSSContainOnScroll) {
                this.applyCSSContainOnScrollUpdate(false);
            }
            delete this.targetRect;
            if (this.props.onScrollStop) {
                this.props.onScrollStop(scrollPos, prevScrollPos, eventTarget);
            }
        };
        this.applyCSSContainOnScrollUpdate = (bool) => {
            const domNode = this.domNode;
            if (domNode) {
                domNode.style.contain = bool ? 'strict' : '';
            }
        };
        this.sync = () => {
            if (this.unmounted) {
                return;
            }
        };
        this.getDOMNode = () => {
            return this.domNode;
        };
        this.renderScroller = () => {
            if (this.props.renderScroller) {
                this.props.renderScroller();
            }
        };
        this.renderRowContainer = () => {
            if (this.props.renderRowContainer) {
                return this.props.renderRowContainer;
            }
        };
        this.onResize = (size) => {
            this.sync();
            if (this.props.onResize) {
                this.props.onResize(size);
            }
        };
        this.renderSizer = () => {
            return (React.createElement(NotifyResize, { key: "browserScrollerResizer", ref: this.browserResizerRef, onResize: this.onResize, notifyOnMount: true }));
        };
        this.prepareStyle = () => {
            if (!this.domNode) {
                return;
            }
            const parentNode = this.domNode.parentNode;
            const header = parentNode.firstChild;
            const headerHeight = header.offsetHeight;
            this.domNode.style.overflow = 'auto';
            this.domNode.style.height = `calc(100% - ${headerHeight}px)`;
        };
        this.scrollerStyle = (props) => {
            const height = props.rowHeight * props.count;
            return {
                height,
            };
        };
        this.renderChildren = (props) => {
            const scrollerStyle = this.scrollerStyle(props);
            let container;
            if (props.rowContainer) {
                const containerProps = {
                    children: props.children,
                };
                container = props.rowContainer(containerProps);
            }
            if (container === undefined) {
                container = React.createElement("div", { key: "browserContainer" }, props.children);
            }
            const containerWrapper = (React.createElement("div", { key: "browserScrollContainer", style: scrollerStyle, className: "InovuaReactDataGrid__browser-scroll-container" }, container));
            const sizer = this.renderSizer();
            const children = React.Fragment ? (React.createElement(React.Fragment, null,
                containerWrapper,
                sizer)) : ([containerWrapper, sizer]);
            return children;
        };
        this.render = () => {
            const { props } = this;
            this.prepareStyle();
            const children = this.renderChildren(props);
            return (React.createElement("div", { ref: this.domNodeRef, className: "InovuaReactDataGrid__browser-scroll" }, children));
        };
        this.domNodeRef = (c) => {
            if (props.usePassiveScroll) {
                if (c) {
                    this.setupPassiveScrollListener(c);
                }
                else {
                    this.removePassiveScrollListener(this.domNode);
                }
            }
            this.domNode = c;
        };
        this.browserResizerRef = (b) => {
            this.browserResizer = b;
        };
    }
    get scrollTop() {
        return this.domNode.scrollTop;
    }
    get scrollLeft() {
        return this.domNode.scrollLeft;
    }
    get scrollTopMax() {
        return this.domNode.firstChild.clientHeight;
    }
    get scrollLeftMax() {
        return this.props.minRowWidth;
    }
    set scrollTop(value) {
        this.domNode.scrollTop = value;
    }
    set scrollLeft(value) {
        this.domNode.scrollLeft = value;
    }
    smoothScrollTo(newValue, cfg, callback) {
        return smoothScrollTo(this.getDOMNode(), newValue, cfg, callback);
    }
}
Scroller.defaultProps = defaultProps;
export default Scroller;
