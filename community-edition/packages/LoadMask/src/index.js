/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import cleanProps from '../../../common/cleanProps';
import join from '../../../common/join';

import SvgLoader from './SvgLoader';
import SpinLoader from './SpinLoader';

const DEFAULT_CLASS_NAME = 'inovua-react-toolkit-load-mask';

const InovuaLoadMask = forwardRef((props, ref) => {
  const visibleClassName = props.visible
    ? `${props.rootClassName}--visible`
    : '';
  const className = join(
    props.className,
    props.rootClassName,
    visibleClassName,
    props.theme && `${props.rootClassName}--theme-${props.theme}`
  );
  const layerClassName = join(
    props.backgroundLayerClassName,
    `${props.rootClassName}__background-layer`
  );
  const style = { ...props.style };
  const layerStyle = { ...props.backgroundLayerStyle };

  if (props.zIndex != null) {
    style.zIndex = props.zIndex;
  }

  if (props.background !== true) {
    layerStyle.background =
      props.background === false ? 'transparent' : props.background;
  }
  if (props.backgroundOpacity != null) {
    layerStyle.opacity = props.backgroundOpacity;
  }

  const { pointerEvents } = props;
  if (pointerEvents !== true) {
    style.pointerEvents = pointerEvents === false ? 'none' : pointerEvents;
  }

  const Loader = props.svgLoader ? SvgLoader : SpinLoader;

  return (
    <div
      ref={ref}
      {...cleanProps(props, InovuaLoadMask.propTypes)}
      className={className}
      style={style}
    >
      <div style={layerStyle} className={layerClassName} />
      <div className={`${props.rootClassName}__loader-container`}>
        <Loader
          size={props.size}
          theme={props.theme}
          animationDuration={props.animationDuration}
        />
        {props.children}
      </div>
    </div>
  );
});

InovuaLoadMask.defaultProps = {
  visible: true,
  svgLoader: true,
  theme: 'default',
  zIndex: 100,
  pointerEvents: true,
  backgroundOpacity: 0.6,
  background: true,
  backgroundLayerStyle: {},
  rootClassName: DEFAULT_CLASS_NAME,
};

InovuaLoadMask.propTypes = {
  animationDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  svgLoader: PropTypes.bool,
  zIndex: PropTypes.number,
  visible: PropTypes.bool,
  pointerEvents: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  backgroundOpacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  background: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  theme: PropTypes.string,
  backgroundLayerClassName: PropTypes.string,
  backgroundLayerStyle: PropTypes.object,
  rootClassName: PropTypes.string,
};

export default InovuaLoadMask;
