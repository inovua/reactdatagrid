/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '../../../common/cleanProps';

import { NotifyResize } from '../../NotifyResize';
import join from '../../../common/join';

import InovuaArrowScroller from '../../ArrowScroller';
import DropdownOverflow from './DropdownOverflow';

class InovuaToolbar extends Component {
  constructor(props) {
    super(props);
    this.setRootRef = ref => {
      this.node = ref;
    };
  }

  render() {
    const { props } = this;
    const { className } = props;
    const rootProps = {
      useTransformOnScroll: props.useTransformOnScroll,
      ref: this.setRootRef,
      ...cleanProps(props, InovuaToolbar.propTypes),
      className,
      rtl: props.rtl,
      rootClassName: props.rootClassName,
      theme: props.theme,
    };

    return props.overflowStrategy === 'scroll' ? (
      <InovuaArrowScroller {...rootProps} {...this.getScrollerProps()} />
    ) : (
      <DropdownOverflow {...rootProps} {...this.getDropdownOverflowProps()} />
    );
  }

  scrollIntoView(node) {
    return this.node && this.node.scrollIntoView(node);
  }

  getInstance() {
    return this.node;
  }

  getClassName() {
    const { props } = this;
    return join(
      this.props.className,
      props.rootClassName,
      props.theme && `${props.rootClassName}--theme-${props.theme}`,
      props.changeButtonStyles && `${props.rootClassName}--change-button-styles`
    );
  }

  getScrollerProps() {
    const { props } = this;
    const result = {
      vertical: props.vertical,
      scrollOnMouseEnter: props.scrollOnMouseEnter,
      arrowSize: props.arrowSize,
      className: join(
        this.getClassName(),
        `${props.rootClassName}--arrowScroller`
      ),
    };

    if (this.props.rtl) {
      result.nativeScroll = false;
    }

    return result;
  }

  getDropdownOverflowProps() {
    const { props } = this;
    return {
      className: join(this.getClassName(), `${props.rootClassName}--dropdown`),
      constrainTo: props.constrainTo,
      dropdownButtonProps: props.dropdownButtonProps,
      renderDropdownButton: props.renderDropdownButton,
    };
  }
}

InovuaToolbar.defaultProps = {
  rootClassName: 'inovua-react-toolkit-toolbar',
  vertical: false,
  useTransformOnScroll: false,
  changeButtonStyles: true,
  rtl: false,
  theme: 'default',
  overflowStrategy: 'scroll',
};

InovuaToolbar.propTypes = {
  rtl: PropTypes.bool,
  rootClassName: PropTypes.string,
  changeButtonStyles: PropTypes.bool,
  scrollOnMouseEnter: PropTypes.bool,
  theme: PropTypes.string,
  constrainTo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
  ]),
  arrowSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
  ]),
  overflowStrategy: PropTypes.oneOf(['scroll', 'dropdown']),
  vertical: PropTypes.bool,
  dropdownButtonProps: PropTypes.object,
  renderDropdownButton: PropTypes.func,
  useTransformOnScroll: PropTypes.bool,
};

const Separator = props => {
  return (
    <div
      {...props}
      className={join(
        props.className,
        'inovua-react-toolkit-toolbar__separator'
      )}
    />
  );
};

InovuaToolbar.Separator = Separator;

export { Separator };

export default InovuaToolbar;
