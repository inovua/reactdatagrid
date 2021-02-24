/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import PropTypes from 'prop-types';

import TextInput from '../../../../packages/TextInput';

import autoBind from '../../../../packages/react-class/autoBind';
import cleanProps from '../../../../packages/react-clean-props';

class InovuaTextEditor extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }
  render() {
    const { props } = this;
    const { value } = props;

    const domProps = cleanProps(props, InovuaTextEditor.propTypes);
    const className =
      'InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--text ' +
      (domProps.className || '');

    return (
      <TextInput
        autoFocus={props.autoFocus}
        value={value}
        theme={props.theme}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        enableClearButton
        {...domProps}
        className={className}
      />
    );
  }

  onChange(value, e) {
    const { onChange } = this.props;

    if (onChange) {
      onChange(value, e);
    }
  }

  onBlur(e) {
    if (this.props.onComplete) {
      this.props.onComplete(e);
    }
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      if (this.props.onComplete) {
        this.props.onComplete(e);
      }
    }

    if (e.key === 'Escape') {
      if (this.props.onCancel) {
        this.props.onCancel(e);
      }
    }

    if (e.key == 'Tab') {
      e.preventDefault();
      this.props.onTabNavigation(true, e.shiftKey ? -1 : 1, e);
    }
  }
}

InovuaTextEditor.propTypes = {
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
  onKeyDown: PropTypes.func,
  onTabNavigation: PropTypes.func,
  gotoNext: PropTypes.func,
  gotoPrev: PropTypes.func,
  value: PropTypes.any,
  cell: PropTypes.any,
  cellProps: PropTypes.any,
  nativeScroll: PropTypes.any,
  editorProps: PropTypes.any,
};

export default InovuaTextEditor;
