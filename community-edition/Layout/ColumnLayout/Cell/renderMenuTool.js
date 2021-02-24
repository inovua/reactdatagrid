/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import join from '../../../packages/join';

const BASE_CLASS_NAME = 'InovuaReactDataGrid__column-header__menu-tool';

export class MenuTool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keepVisible: false,
    };

    this.domRef = React.createRef();

    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  onClick(event) {
    event.stopPropagation();
  }

  onMouseDown(event) {
    this.props.showContextMenu(
      this,
      this.props.showOnHover ? this.onHide : null
    );

    if (this._unmounted) {
      return;
    }

    if (this.props.showOnHover && !this.state.keepVisible) {
      this.setState({
        keepVisible: true,
      });
    }
  }

  onHide() {
    if (this._unmounted) {
      return;
    }
    this.setState({
      keepVisible: false,
    });
  }

  render() {
    let className = BASE_CLASS_NAME;

    const { showOnHover, rtl } = this.props;

    if (showOnHover) {
      className += ` ${BASE_CLASS_NAME}--show-on-hover`;
    }
    if (!showOnHover || this.state.keepVisible) {
      className += ` ${BASE_CLASS_NAME}--visible`;
    }

    className += ` ${BASE_CLASS_NAME}--direction-${rtl ? 'rtl' : 'ltr'}`;

    return (
      <div
        className={className}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
        ref={this.domRef}
      >
        <svg
          className={join('', 'InovuaReactDataGrid__sort-icon--desc')}
          width="14"
          height="12"
          viewBox="0 0 14 12"
        >
          <g fillRule="evenodd">
            <rect width="14" height="2" rx="1" />
            <rect width="14" height="2" y="5" rx="1" />
            <rect width="14" height="2" y="10" rx="1" />
          </g>
        </svg>
      </div>
    );
  }
}

export default (props, cellInstance) => {
  if (props.groupSpacerColumn) {
    return null;
  }

  if (!props.showColumnMenuTool) {
    return null;
  }

  return (
    <MenuTool
      key="menuTool"
      name={props.name}
      rtl={props.rtl}
      showOnHover={props.showColumnMenuToolOnHover}
      showContextMenu={cellInstance.showContextMenu}
    />
  );
};
