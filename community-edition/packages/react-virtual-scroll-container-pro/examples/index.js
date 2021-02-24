/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { render } from 'react-dom';
import VirtualScrollContainer, { NativeScrollContainer } from '../src';
import '../style/index.scss';
global.React = React;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.inc = () => {
            this.setState({ width: this.state.width + 100 });
        };
        this.incHeight = () => {
            this.setState({ height: this.state.height + 1000 });
        };
        this.onResize = size => {
            console.log('resize', size, '!!!');
        };
        this.onScrollbarsChange = scrolls => {
            console.log(scrolls);
        };
        this.onScrollLeftMax = () => {
            console.log('scrollleft max');
        };
        this.toggleNativeScroll = () => {
            this.setState({
                nativeScroll: !this.state.nativeScroll,
            });
        };
        this.toggleRtl = () => {
            this.setState({
                rtl: !this.state.rtl,
            });
        };
        this.state = {
            width: 1000,
            height: 2300,
            nativeScroll: false,
            rtl: true,
        };
    }
    render() {
        const ScrollerFactory = this.state.nativeScroll
            ? NativeScrollContainer
            : VirtualScrollContainer;
        return (React.createElement("div", { style: { position: 'absolute', top: 40 } },
            React.createElement("input", null),
            React.createElement("button", { onClick: this.inc }, "inc width"),
            React.createElement("button", { onClick: this.incHeight }, "inc height"),
            React.createElement("button", { onClick: this.toggleNativeScroll },
                "toggle native - native ",
                `${this.state.nativeScroll}`),
            React.createElement("button", { onClick: this.toggleRtl },
                "toggle rtl - rtl ",
                `${this.state.rtl}`),
            React.createElement(ScrollerFactory, { autoHide: false, rtl: this.state.rtl, nativeScroll: this.state.nativeScroll, ref: x => {
                    global.scroller = x;
                }, style: {
                    position: 'relative',
                    height: 400,
                    width: '60vw',
                    border: '1px solid red',
                    margin: 20,
                }, scrollThumbStyle: {}, tabIndex: 1, renderScroller: props => React.createElement("div", Object.assign({}, props, { tabIndex: 1 })), onResize: this.onResize, contain: true },
                React.createElement("div", { "data-name": "yyy", style: {
                        background: 'linear-gradient(to right, rgba(30, 87, 153, 0.43) 0%, rgba(255, 137, 137, 0.35) 100%)',
                    } },
                    React.createElement("div", { style: {
                            width: this.state.width,
                            height: this.state.height,
                            border: '1px solid magenta',
                        } },
                        React.createElement("div", { style: { minHeight: 200 } }),
                        React.createElement("input", null),
                        React.createElement("button", null, "test"),
                        React.createElement("button", null, "test2")))),
            React.createElement("input", null),
            React.createElement("button", { onClick: this.inc }, "inc width"),
            React.createElement("button", { onClick: this.incHeight }, "inc height"),
            React.createElement("button", { onClick: this.toggleNativeScroll }, "toggle native")));
    }
}
render(React.createElement(App, null), document.getElementById('content'));
