/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckBox from '../../CheckBox';
import join from '../../../common/join';

const defaultCheckedIcon = ({ style, size = 16 }) => {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 16 16">
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="none"
        fillRule="evenodd"
        strokeWidth="2"
      />
      <circle cx="8" cy="8" r="3" fillRule="evenodd" stroke="none" />
    </svg>
  );
};

const defaultUncheckedIcon = ({ style, size = 16 }) => {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 16 16">
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="none"
        fillRule="evenodd"
        strokeWidth="2"
      />
    </svg>
  );
};

class InovuaRadioButton extends Component {
  renderNativeBrowserInput = config => {
    if (props.renderNativeBrowserInput) {
      return renderNativeBrowserInput(config);
    }
    config.inputProps.type = 'radio';
  };

  render = () => {
    const props = this.props;

    let checkedIcon = defaultCheckedIcon || props.checkedIcon;
    let uncheckedIcon = defaultUncheckedIcon || props.uncheckedIcon;

    const className = join(
      `${props.rootClassName}`,
      props.theme && `${props.rootClassName}--theme-${props.theme}`
    );

    const checkboxProps = {
      ...props,
      className,
      checkedIcon,
      uncheckedIcon,
      renderNativeBrowserInput: this.renderNativeBrowserInput,
    };

    return <CheckBox {...checkboxProps} />;
  };
}

InovuaRadioButton.defaultProps = {
  theme: 'default',
  rootClassName: 'inovua-react-toolkit-radio-button',
};

InovuaRadioButton.propTypes = {
  theme: PropTypes.string,
  rootClassName: PropTypes.string,
};

export default InovuaRadioButton;
