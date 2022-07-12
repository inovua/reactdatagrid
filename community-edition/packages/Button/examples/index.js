/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import Button from '../src/Button';
import RadioButtonGroup from '../../RadioButtonGroup';
import DropDownButton from '../../DropdownButton';
import SplitButton from '../../SplitButton';
import CheckBox from '../../CheckBox';
import '../../CheckBox/style/index.scss';
import '../../RadioButtonGroup/style/index.scss';
import '../../DropdownButton/style/index.scss';
import '../../SplitButton/style/index.scss';
import '../style/index.scss';
import 'typeface-roboto';
const icon = (React.createElement("svg", { style: { width: 24, height: 24 } },
    React.createElement("path", { fill: "#000000", d: "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" })));
const widthOptions = ['auto', 100, 200, 300].map(value => {
    return { value, label: typeof value == 'number' ? value + 'px' : value };
});
const themeOptions = ['light', 'default'].map(value => {
    return { value, label: value };
});
const alignOptions = ['center', 'start', 'end'].map(value => {
    return { value, label: value };
});
const verticalAlignOptions = ['middle', 'top', 'bottom'].map(value => {
    return { value, label: value };
});
const iconPositionOptions = ['start', 'end', 'top', 'bottom'].map(value => {
    return { value, label: value };
});
const PREVIEW_ICON = (React.createElement("svg", { fill: "#000000", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M11.5 9C10.12 9 9 10.12 9 11.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5S12.88 9 11.5 9zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-3.21 14.21l-2.91-2.91c-.69.44-1.51.7-2.39.7C9.01 16 7 13.99 7 11.5S9.01 7 11.5 7 16 9.01 16 11.5c0 .88-.26 1.69-.7 2.39l2.91 2.9-1.42 1.42z" })));
const items = [
    {
        label: 'New',
        icon: PREVIEW_ICON,
        cellStyle: { color: 'red' },
    },
    {
        label: 'Options',
        disabled: true,
    },
    {
        label: 'Format',
    },
    { label: 'Save' },
    '-',
    { label: 'Export as' },
    { label: 'Document' },
];
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widthValue: '300',
            heightValue: '300',
            iconPosition: 'top',
            align: 'start',
            theme: 'default',
            verticalAlign: 'middle',
            showIcon: true,
            disabled: false,
        };
    }
    render() {
        const style = {};
        const { widthValue, heightValue } = this.state;
        if (widthValue != 'auto') {
            style.width = widthValue;
        }
        if (heightValue != 'auto') {
            style.height = heightValue;
        }
        return (React.createElement("div", { style: { fontFamily: 'Roboto', fontSize: 14, margin: 50 } },
            React.createElement("div", { style: { margin: 20 } },
                React.createElement("div", { style: { marginBottom: 30 } },
                    "Button theme:",
                    React.createElement(RadioButtonGroup, { style: { marginLeft: 20 }, orientation: "horizontal", radioOptions: themeOptions, radioValue: this.state.theme, onChange: ({ checkedItemValue: theme, }) => this.setState({ theme }) }),
                    ' ',
                    "|",
                    ' ',
                    React.createElement("input", { type: "checkbox", checked: this.state.disabled, onChange: ev => this.setState({ disabled: ev.target.checked }) }),
                    "disabled"),
                React.createElement(Button, { icon: icon, tagName: "div", theme: this.state.theme, pressed: true, onClick: () => {
                        console.log('click', Date.now());
                    } }, "simple text button"),
                React.createElement(Button, { disabled: this.state.disabled, icon: icon, tagName: "div", theme: this.state.theme, pressed: false }, "simple text button"),
                React.createElement(Button, { disabled: this.state.disabled, icon: icon, tagName: "div", theme: 'light', pressed: true }, "simple text button"),
                React.createElement(Button, { icon: icon, tagName: "div", theme: 'light' }, "simple text button")),
            React.createElement("div", { style: { margin: 30 } },
                React.createElement("h3", null, "DropDownButton"),
                React.createElement(DropDownButton, { renderMenuWhenCollapsed: true, items: items }, "Hello")),
            React.createElement("div", { style: { margin: 30 } },
                React.createElement("h3", null, "SplitButton"),
                React.createElement(SplitButton, { dropdownButtonProps: { children: 'hello world' }, items: items }, "Hello")),
            React.createElement("div", { style: { fontFamily: 'Roboto', fontSize: 14 } },
                React.createElement(Button, { tagName: "div" }, "simple text button"),
                React.createElement(Button, { align: this.state.align, verticalAlign: this.state.verticalAlign, icon: this.state.showIcon ? (React.createElement("img", { src: "https://facebook.github.io/react/img/logo.svg", height: "30", width: "30" })) : null, iconPosition: this.state.iconPosition, style: style }, "Export as React Component"),
                React.createElement("div", { style: { marginTop: 20 } },
                    "Button width:",
                    React.createElement(RadioButtonGroup, { style: { marginLeft: 20 }, orientation: "horizontal", radioOptions: widthOptions, radioValue: this.state.widthValue, onChange: ({ checkedItemValue: widthValue, }) => this.setState({ widthValue }) })),
                React.createElement("div", { style: { marginTop: 20 } },
                    "Button height:",
                    React.createElement(RadioButtonGroup, { style: { marginLeft: 20 }, orientation: "horizontal", radioOptions: widthOptions, radioValue: this.state.heightValue, onChange: ({ checkedItemValue: heightValue, }) => this.setState({ heightValue }) })),
                React.createElement("div", { style: { marginTop: 20 } },
                    "Align:",
                    React.createElement(RadioButtonGroup, { style: { marginLeft: 20 }, orientation: "horizontal", radioOptions: alignOptions, radioValue: this.state.align, onChange: ({ checkedItemValue: align, }) => this.setState({ align }) })),
                React.createElement("div", { style: { marginTop: 20 } },
                    "Vertical align:",
                    React.createElement(RadioButtonGroup, { style: { marginLeft: 20 }, orientation: "horizontal", radioOptions: verticalAlignOptions, radioValue: this.state.verticalAlign, onChange: ({ checkedItemValue: verticalAlign, }) => this.setState({ verticalAlign }) })),
                React.createElement("div", { style: { marginTop: 20 } },
                    React.createElement(CheckBox, { checked: this.state.showIcon, onChange: (showIcon) => {
                            this.setState({
                                showIcon,
                            });
                        } }, "Show icon")),
                React.createElement("div", { style: { marginTop: 20 } },
                    "Icon position:",
                    React.createElement(RadioButtonGroup, { style: { marginLeft: 20 }, orientation: "horizontal", radioOptions: iconPositionOptions, radioValue: this.state.iconPosition, onChange: ({ checkedItemValue: iconPosition, }) => this.setState({ iconPosition }) })))));
    }
}
class App1 extends Component {
    render() {
        return (React.createElement("div", { className: "App", style: { padding: 10 } },
            React.createElement(App, null),
            React.createElement(Button, { overflow: true, activeStyle: { background: 'blue' }, onClick: () => console.log('blue active button') }, "hello"),
            React.createElement(Button, { type: "big", onClick: () => console.log('big button') }, "Save as"),
            React.createElement(Button, { href: "#test" }, "world"),
            React.createElement(Button, null, "primary no theme"),
            React.createElement(Button, { disabled: true }, "primary disabled"),
            React.createElement(Button, { defaultPressed: true }, "toggle button"),
            React.createElement(Button, { disabled: true }, "disabled"),
            React.createElement(Button, { ellipsis: true, style: { width: 100 } }, "ellipsis ellipsis ellipsis ellipsis ellipsis ellipsis"),
            React.createElement(Button, { style: { width: 100 }, align: 'start' }, "left"),
            React.createElement(Button, { style: { width: 100 }, align: 'end' }, "right"),
            React.createElement(Button, { style: { width: 100 }, rtl: true, align: 'start' }, "rtl"),
            React.createElement("h1", null, "Vertical align"),
            React.createElement(Button, { style: { height: 200, width: 650 }, icon: () => 'x', iconPosition: "top" }, "A long line here"),
            React.createElement("h1", null, "icons"),
            React.createElement(Button, { icon: icon, style: { width: 100 } }, "icon default very long text"),
            React.createElement(Button, { icon: icon, iconPosition: "start" }, "icon start default"),
            React.createElement(Button, { icon: icon, iconPosition: "end" }, "icon end default"),
            React.createElement(Button, { style: { minWidth: 400 }, icon: icon, iconPosition: "left" }, "icon left default"),
            React.createElement(Button, { icon: icon, iconPosition: "right" }, "icon right default"),
            React.createElement(Button, { icon: icon, tagName: "div", iconPosition: "top" }, "icon top default"),
            React.createElement(Button, { icon: icon, iconPosition: "bottom" }, "icon bottom default"),
            React.createElement("h1", null, "icons with ellipsis"),
            React.createElement(Button, { icon: icon, style: { width: 70 }, iconPosition: "bottom" }, "icon bottom default")));
    }
}
render(React.createElement(App1, null), document.getElementById('content'));
