/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';

import autoBind from '../../react-class/autoBind';
import cleanProps from '../../../common/cleanProps';

import ToolbarRegion from './ToolbarRegion';
import join from '../../../common/join';

const emptyFn = () => {};

function isRegion(child) {
  return child && child.props && child.props.isToolbarRegion;
}

function toAlign(index, regions) {
  if (index == 0) {
    return 'start';
  }

  if (index == regions.length - 1) {
    return 'end';
  }

  return 'center';
}

class InovuaSimpleToolbar extends React.Component {
  render() {
    const { props } = this;

    const children = this.prepareChildren(props);
    const className = join(
      props.className,
      `inovua-react-simple-toolbar`,
      `inovua-react-simple-toolbar--orientation-${props.orientation}`,
      props.theme ? `inovua-react-simple-toolbar--theme-${props.theme}` : null
    );

    return (
      <div
        {...cleanProps(props, InovuaSimpleToolbar.propTypes)}
        children={children}
        className={className}
      />
    );
  }

  prepareChildren(props) {
    let regionCount = 0;

    const children = [];
    const regions = [];

    React.Children.forEach(props.children, child => {
      if (isRegion(child)) {
        regions.push(child);
        regionCount++;
      }
    });

    let regionIndex = -1;
    React.Children.forEach(props.children, child => {
      if (isRegion(child)) {
        regionIndex++;
        child = this.prepareRegion(child, regionIndex, regions);
      }

      children.push(child);
    });

    if (!regionCount) {
      const Factory = props.regionFactory || ToolbarRegion;
      return this.prepareRegion(<Factory>{children}</Factory>);
    }

    return children;
  }

  prepareRegion(region, index = 0, regions = []) {
    const props = this.props;
    const regionStyle = { ...props.regionStyle };

    if (props.padding) {
      regionStyle.padding = props.padding;
    }

    const style = { ...regionStyle, ...region.props.style };
    const align = region.props.align || toAlign(index, regions) || 'center';
    const theme = region.props.theme || props.theme;

    return cloneElement(region, {
      style,
      theme,
      orientation: props.orientation,
      align,
    });
  }
}

InovuaSimpleToolbar.propTypes = {
  isReactToolbar: PropTypes.bool,
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  theme: PropTypes.string,
  regionFactory: PropTypes.func,
};

InovuaSimpleToolbar.defaultProps = {
  isReactToolbar: true,
  orientation: 'horizontal',
  theme: 'default',
};

InovuaSimpleToolbar.Region = ToolbarRegion;

export default InovuaSimpleToolbar;

export { ToolbarRegion as Region };
