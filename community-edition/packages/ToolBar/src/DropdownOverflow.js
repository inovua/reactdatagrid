/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NotifyResize } from '../../NotifyResize';

import cleanProps from '../../../common/cleanProps';
import assign from '../../../common/assign';
import join from '../../../common/join';
import DropdownButton from '../../DropdownButton';
import getGroupedItems from './utils/getGroupedItems';

const firstRenderStyle = {
  visibility: 'hidden',
  overflow: 'hidden',
};

const ghostStyle = {
  visibility: 'hidden',
  overflow: 'hidden',
  position: 'absolute',
};

/**
 * The basic idea is that, the items are rendered two times.
 * Once directly inside the root.
 * Second inside a div, with visibility none and position absolute.
 * The second is used to mesure elements, to see what items fit and what don't.
 * This check is done on first render and on each size change of the component.
 */
class DropDownOverflow extends Component {
  constructor(props) {
    super(props);

    this.setRootRef = ref => {
      this.rootNode = ref;
    };

    this.setGhostRef = ref => {
      this.ghostNode = ref;
    };

    this.state = {};
    this.handleResize = this.handleResize.bind(this);

    this.isFirstRender = true;
  }

  componentDidMount() {
    this.updateOverflowItems();
    this.isFirstRender = false;
  }

  render() {
    const { props } = this;

    const style = {
      ...props.style,
      ...(this.isFirstRender && firstRenderStyle),
    };

    const className = join(
      props.rootClassName,
      props.className,
      props.rtl && `${props.rootClassName}--rtl`
    );

    const dropdownProps = assign({}, props);

    delete dropdownProps.scrollOnClick;
    delete dropdownProps.mouseoverScrollSpeed;
    delete dropdownProps.scrollSpeed;
    delete dropdownProps.scrollStep;
    delete dropdownProps.useTransformOnScroll;

    const domProps = cleanProps(dropdownProps, DropDownOverflow.propTypes);

    return (
      <div
        {...domProps}
        ref={this.setRootRef}
        style={style}
        className={className}
      >
        <NotifyResize
          key="notify"
          rafOnResize
          notifyOnMount={false}
          onResize={this.handleResize}
        />
        {this.renderVisibleItems()}
        {(this.isFirstRender || this.state.overflowIndexes) &&
          this.renderDropdownButton()}
        {this.renderGhost()}
      </div>
    );
  }

  renderVisibleItems() {
    let visibleItems = this.props.children;

    if (this.state.visibleIndexes) {
      const children = this.getChildrenArray();
      visibleItems = this.state.visibleIndexes.map(index => {
        return children[index];
      });
    }

    return visibleItems;
  }

  renderDropdownButton() {
    let items = [];
    if (this.state.overflowIndexes) {
      const children = this.getChildrenArray();
      items = this.state.overflowIndexes.map(index => {
        return {
          id: index,
          label: children[index],
        };
      });
    }

    const domProps = {
      items,
      constrainTo: this.props.constrainTo,
      menuProps: {
        constrainTo: this.props.constrainTo,
        ...(this.props.dropdownButtonProps &&
          this.props.dropdownButtonProps.menuProps),
        theme: null,
        disableScroller: true,
      },
      ...this.props.dropdownButtonProps,
    };

    let result;
    if (typeof this.props.renderDropdownButton === 'function') {
      result = this.props.renderDropdownButton({
        items,
        domProps,
        overflowIndexes: this.state.overflowIndexes,
      });
    }

    if (result === undefined) {
      result = <DropdownButton {...domProps} />;
    }

    return result;
  }

  /**
   * Everything is rendered into a div with the same size as the root
   * to mesure the size of the children, to check if something changed.
   */
  renderGhost() {
    if (!this.state.ghostVisible) {
      return null;
    }

    return (
      <div
        ref={this.setGhostRef}
        style={{
          ...ghostStyle,
          width: this.state.width,
          height: this.state.height,
        }}
      >
        {this.props.children}
        {this.renderDropdownButton()}
      </div>
    );
  }

  getRootSize() {
    const maxSize = this.rootNode[this.getSizeName()];
    return maxSize;
  }

  /**
   * For first render items are rendered directly and mesure
   * The state for the first render is:
   * - overflow hidden
   * - visibility hidden
   *
   * So it doesn't add scroll to what ever element it is in,
   * after the mesurement everything fits and there will be no need
   * for overflow: hidden.
   */
  updateOverflowItems() {
    if (!this.rootNode) {
      return;
    }

    const parentNode = this.state.ghostVisible ? this.ghostNode : this.rootNode;

    const children = parentNode.children;
    const maxSize = this.getRootSize();
    let boxes = [].slice.call(children).map(child => child[this.getSizeName()]);

    /**
     * Must take into account dropdown button width, if rendered
     * - check if a dropdown button is rendered, if so it is considered the last one.
     * - and must be removed to get correct groupping
     */
    const overflowControlSize = boxes[boxes.length - 1];

    /**
     * if it is on first render that means that the parentNode will be the route
     * in this case the fist child will be the notify-resize
     */
    if (this.isFirstRender) {
      boxes = boxes.slice(1);
    }

    boxes = boxes.slice(0, -1);
    const groupedItems = getGroupedItems({
      boxes,
      maxSize,
      overflowControlSize,
    });

    if (groupedItems) {
      this.setState({
        visibleIndexes: groupedItems.visibleIndexes,
        overflowIndexes: groupedItems.overflowIndexes,
      });
    } else {
      this.setState({
        visibleIndexes: null,
        overflowIndexes: null,
      });
    }
  }

  // events
  handleResize({ width, height }) {
    this.setState(
      {
        width,
        height,
        ghostVisible: true,
      },
      () => {
        this.updateOverflowItems();
        this.setState({
          ghostVisible: false,
        });
      }
    );
  }

  /**
   * Used to let easy way to refactor to support vertical
   * toolbars.
   */
  getSizeName() {
    return 'offsetWidth';
  }

  getChildrenArray() {
    return React.Children.toArray(this.props.children);
  }
}

DropDownOverflow.defaultProps = {
  rootClassName: 'react-toolkit-dropdown-overflow',
  rtl: false,
};

DropDownOverflow.propTypes = {
  rootClassName: PropTypes.string,
  dropdownButtonProps: PropTypes.object,
  constrainTo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
  ]),
  renderDropdownButton: PropTypes.func,
  rtl: PropTypes.bool,
};

export default DropDownOverflow;
