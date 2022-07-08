/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { number, func, bool } from 'prop-types';
import shallowequal from './shallowequal';
import debounce from '../../../packages/debounce';
import { getGlobal } from '../../../getGlobal';
const globalObject = getGlobal();
const STYLE_DISPLAY_NONE = { display: 'none' };
const emptyFn = () => { };
const immediateFn = (fn) => fn();
const notifyResizeStyle = {
    contain: 'strict',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    overflow: 'hidden',
    display: 'block',
    pointerEvents: 'none',
    opacity: 0,
    direction: 'ltr',
    textAlign: 'start',
};
const expandToolStyle = {
    contain: 'strict',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
};
const contractToolStyle = {
    contain: 'strict',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
};
const contractToolInnerStyle = {
    contain: 'strict',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '200%',
};
const defaultProps = {
    useNativeIfAvailable: true,
    useWillChange: false,
    useRaf: true,
};
const propTypes = {
    ResizeObserver: func,
    onResize: func,
    onObserverResize: func,
    useNativeIfAvailable: bool,
    onMount: func,
    useWillChange: bool,
    useRaf: bool,
    notifyOnMount: bool,
    notifyResizeDelay: number,
    checkResizeDelay: number,
};
class InovuaNotifyResize extends React.Component {
    static defaultProps = defaultProps;
    static propTypes = propTypes;
    refNotifyResize;
    notifyResizeNode;
    refContractTool;
    contractToolNode = null;
    refExpandTool;
    refExpandToolInner;
    refContractToolInner;
    expandToolNode = null;
    __willUnmount;
    observer = {};
    target;
    expandToolInnerNode;
    contractToolInnerNode;
    constructor(props) {
        super(props);
        this.checkResize = this.checkResize.bind(this);
        this.onResize = this.onResize.bind(this);
        if (props.notifyResizeDelay > 0) {
            this.onResize = debounce(this.onResize, props.notifyResizeDelay);
        }
        if (props.checkResizeDelay > 0) {
            this.checkResize = debounce(this.checkResize, props.checkResizeDelay);
        }
        this.refNotifyResize = node => {
            this.notifyResizeNode = node;
        };
        this.refContractTool = node => {
            this.contractToolNode = node;
        };
        this.refExpandTool = node => {
            this.expandToolNode = node;
        };
        this.refExpandToolInner = node => {
            this.expandToolInnerNode = node;
        };
        this.refContractToolInner = node => {
            this.contractToolInnerNode = node;
        };
        this.state = {
            notifyResizeWidth: 0,
            notifyResizeHeight: 0,
            expandToolWidth: 0,
            expandToolHeight: 0,
            contractToolWidth: 0,
            contractToolHeight: 0,
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (typeof nextProps.shouldComponentUpdate === 'function') {
            return nextProps.shouldComponentUpdate(nextProps, this.props, nextState, this.state);
        }
        return (!shallowequal(nextState, this.state) ||
            !shallowequal(nextProps, this.props));
    }
    componentWillUnmount() {
        this.__willUnmount = true;
        if (this.observer) {
            if (this.observer.unobserve) {
                this.observer.unobserve(this.target);
            }
            if (this.observer.disconnect) {
                this.observer.disconnect();
            }
            delete this.observer;
        }
        delete this.target;
    }
    getDOMNode() {
        return this.notifyResizeNode;
    }
    componentDidMount() {
        const ResizeObserver = globalObject.ResizeObserver || this.props.ResizeObserver;
        if (this.props.useNativeIfAvailable && ResizeObserver) {
            const node = this.getDOMNode();
            const target = node.parentNode;
            this.target = target;
            const observer = new ResizeObserver((entries) => {
                if (this.props.onObserverResize) {
                    this.props.onObserverResize(entries);
                }
                const first = entries[0];
                if (first) {
                    this.onResize(first.contentRect);
                }
            });
            observer.observe(target);
            this.observer = observer;
        }
        if (typeof this.props.onMount === 'function') {
            this.props.onMount(this);
        }
        if (this.observer) {
            return;
        }
        this.resetResizeTool(() => {
            if (this.props.notifyOnMount) {
                const { notifyResizeWidth: width, notifyResizeHeight: height, } = this.state;
                this.onResize({ width, height });
            }
        });
    }
    render() {
        const ResizeObserver = globalObject.ResizeObserver || this.props.ResizeObserver;
        if (this.props.useNativeIfAvailable && ResizeObserver) {
            return (React.createElement("div", { ref: this.refNotifyResize, style: STYLE_DISPLAY_NONE, "data-name": "@inovua/react-observer-placeholder" }));
        }
        return (React.createElement("div", { ref: this.refNotifyResize, style: notifyResizeStyle, onScroll: this.checkResize },
            this.renderExpandTool(),
            this.renderContractTool()));
    }
    renderExpandTool() {
        return (React.createElement("div", { ref: this.refExpandTool, style: expandToolStyle },
            React.createElement("div", { ref: this.refExpandToolInner, style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: this.state.expandToolWidth,
                    height: this.state.expandToolHeight,
                } })));
    }
    renderContractTool() {
        return (React.createElement("div", { ref: this.refContractTool, style: contractToolStyle },
            React.createElement("div", { ref: this.refContractToolInner, style: contractToolInnerStyle })));
    }
    resetResizeTool(callback) {
        this.setDimensions(() => {
            this.scrollToBottomExpandTool();
            if (typeof callback == 'function') {
                callback();
            }
        });
    }
    setDimensions(callback) {
        this.getDimensions((size) => {
            const { notifyResizeWidth, notifyResizeHeight } = size;
            if (this.__willUnmount) {
                return;
            }
            // Resize tool will be bigger than its parent by 1 pixel in each direction
            this.setState({
                notifyResizeWidth,
                notifyResizeHeight,
                expandToolWidth: notifyResizeWidth + 1,
                expandToolHeight: notifyResizeHeight + 1,
            }, callback);
        });
    }
    getDimensions(callback) {
        if (!callback || typeof callback != 'function') {
            callback = emptyFn;
        }
        const notifyResize = this.notifyResizeNode;
        if (!notifyResize) {
            return;
        }
        const node = notifyResize.parentElement || notifyResize;
        let size;
        const fn = this.props.useRaf ? requestAnimationFrame : immediateFn;
        fn(() => {
            if (typeof this.props.measureSize == 'function') {
                size = this.props.measureSize(node, notifyResize);
            }
            else {
                size = {
                    width: node.offsetWidth,
                    height: node.offsetHeight,
                };
            }
            callback({
                notifyResizeWidth: size.width,
                notifyResizeHeight: size.height,
            });
        });
    }
    scrollToBottomExpandTool(callback) {
        // so the scroll moves when element resizes
        if (this.notifyResizeNode) {
            requestAnimationFrame(() => {
                // scroll to bottom
                const expandTool = this.expandToolNode;
                const contractTool = this.contractToolNode;
                let expandToolScrollHeight;
                let expandToolScrollWidth;
                let contractToolScrollHeight;
                let contractToolScrollWidth;
                if (expandTool) {
                    expandToolScrollHeight = expandTool.scrollHeight;
                    expandToolScrollWidth = expandTool.scrollWidth;
                }
                if (contractTool) {
                    contractToolScrollHeight = contractTool.scrollHeight;
                    contractToolScrollWidth = contractTool.scrollWidth;
                }
                if (expandTool) {
                    expandTool.scrollTop = expandToolScrollHeight;
                    expandTool.scrollLeft = expandToolScrollWidth;
                }
                if (contractTool) {
                    contractTool.scrollTop = contractToolScrollHeight;
                    contractTool.scrollLeft = contractToolScrollWidth;
                }
                if (typeof callback == 'function') {
                    callback();
                }
            });
        }
    }
    checkResize() {
        this.getDimensions(({ notifyResizeWidth, notifyResizeHeight }) => {
            if (notifyResizeWidth !== this.state.notifyResizeWidth ||
                notifyResizeHeight !== this.state.notifyResizeHeight) {
                this.onResize({
                    width: notifyResizeWidth,
                    height: notifyResizeHeight,
                });
                // reset resizeToolDimensions
                this.resetResizeTool();
            }
        });
    }
    onResize({ width, height }) {
        if (this.__willUnmount) {
            return;
        }
        if (typeof this.props.onResize === 'function') {
            this.props.onResize({ width, height });
        }
    }
}
export default InovuaNotifyResize;
export { InovuaNotifyResize as NotifyResize };
