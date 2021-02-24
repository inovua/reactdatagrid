/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';

import { Item } from '../../../Flex';

import cleanProps from '../../../common/cleanProps';
import join from '../../../common/join';

const CLASS_NAME = 'inovua-react-simple-toolbar__region';

const JUSTIFY_MAP = {
  start: 'flex-start',
  left: 'flex-start',
  end: 'flex-end',
  right: 'flex-end',
};

const TEXT_ALIGN = { start: 'start', left: 'start', right: 'end', end: 'end' };

const FLEX_FLOW = { horizontal: 'row', vertical: 'column' };

export default class InovuaToolbarRegion extends React.Component {
  render() {
    const { props } = this;

    const justifyContent = JUSTIFY_MAP[props.align] || 'center';
    const textAlign = TEXT_ALIGN[props.align] || 'center';
    const flexFlow = FLEX_FLOW[props.orientation] || 'row';

    const className = join(
      CLASS_NAME,
      props.align && `${CLASS_NAME}--align-${props.align}`,
      props.theme && `${CLASS_NAME}--theme-${props.theme}`,
      textAlign && `${CLASS_NAME}--text-align-${textAlign}`,
      props.orientation && `${CLASS_NAME}--orientation-${props.orientation}`
    );

    return (
      <Item
        {...cleanProps(props, InovuaToolbarRegion.propTypes)}
        className={className}
        justifyContent={justifyContent}
        flexFlow={flexFlow}
      />
    );
  }
}

InovuaToolbarRegion.propTypes = {
  align: PropTypes.oneOf(['start', 'end', 'center', 'middle', 'left', 'right']),
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  theme: PropTypes.string,
  isToolbarRegion: PropTypes.bool,
};

InovuaToolbarRegion.defaultProps = { isToolbarRegion: true };
