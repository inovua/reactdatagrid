import React, { Component } from 'react';

class BrowserScroller extends Component<any> {
  sync() {
    return;
  }

  render() {
    console.log('PROPS', this.props);

    return (
      <div className="InovuaReactDataGrid__browser-scroll">
        {this.props.children}
      </div>
    );
  }
}

export default BrowserScroller;
