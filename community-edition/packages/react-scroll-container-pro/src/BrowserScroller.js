import React, { Component } from 'react';
class BrowserScroller extends Component {
    sync() {
        return;
    }
    render() {
        console.log('PROPS', this.props);
        return (React.createElement("div", { className: "InovuaReactDataGrid__browser-scroll" }, this.props.children));
    }
}
export default BrowserScroller;
