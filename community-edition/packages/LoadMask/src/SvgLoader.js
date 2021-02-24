/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import join from '../../../common/join';

const DEFAULT_CLASS_NAME = 'inovua-react-toolkit-load-mask__loader';

export default class InovuaSvgLoader extends React.Component {
  render() {
    const props = this.props;

    const style = {
      ...props.style,
      width: props.size,
      height: props.size,
    };

    if (props.animationDuration) {
      style.animationDuration = props.animationDuration;
    }

    const className = join(
      props.className,
      DEFAULT_CLASS_NAME,
      `${DEFAULT_CLASS_NAME}--svg`,
      props.theme && `${DEFAULT_CLASS_NAME}--theme-${props.theme}`
    );
    return (
      <div style={style} className={className}>
        <svg
          className={`${DEFAULT_CLASS_NAME}-spinner`}
          width={props.size}
          height={props.size}
          viewBox="0 0 32 32"
        >
          <path
            fillRule="evenodd"
            d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm0-4c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z"
          />
        </svg>
      </div>
    );
  }
}

InovuaSvgLoader.propTypes = {
  size: PropTypes.number,
  theme: PropTypes.string,
  animationDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
InovuaSvgLoader.defaultProps = { size: 40 };
