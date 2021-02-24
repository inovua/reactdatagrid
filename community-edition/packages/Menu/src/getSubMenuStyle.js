/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Region from '../../../packages/region-align';

import assign from '../../../common/assign';
import align from './align';

function transformPxStringToInt(pxValue) {
  const value = parseFloat(pxValue.split('px')[0]);
  return typeof value === 'number' && !isNaN(value) ? value : 0;
}

export default function(props, state, domNode) {
  if (state.activeSubMenuIndex == null || !this.componentIsMounted) {
    this.prevMenuIndex = -1;
    return;
  }

  const overItem = this.getItemByIndex(state.activeSubMenuIndex);
  const offset = overItem && overItem.getOffset();

  const left = offset.left + offset.width;
  const top = offset.top;

  const menuIndex = state.activeSubMenuIndex;
  const sameMenu = this.prevMenuIndex == menuIndex;

  if (this.aligning && !sameMenu) {
    this.aligning = false;
  }

  this.prevMenuIndex = menuIndex;

  const style = {
    left,
    top,
    pointerEvents: 'none',
    position: 'absolute',
  };

  /**
   * Must align even if it is same menu,
   * the page can be scrolled and the menu should
   * check again if the submenu fits in the constrain.
   */
  if (!this.aligning) {
    setTimeout(() => {
      if (!this.componentIsMounted) {
        return;
      }

      const thisRegion = Region.from(domNode);
      /**
       * Must take into account padding
       * so the position of the item is calculated
       * correct
       */
      const menuComputedStyle = global.getComputedStyle(domNode);
      const paddingLeft = transformPxStringToInt(menuComputedStyle.paddingLeft);
      const menuItemRegion = Region.from({
        left: thisRegion.left + paddingLeft,
        top: thisRegion.top + offset.top,
        width: offset.width,
        height: offset.height,
      });

      const subMenuMounted = this.subMenu && this.subMenu.componentIsMounted;
      if (!subMenuMounted) {
        return;
      }

      const submenuNode = this.subMenu.node;
      const subMenuRegion = Region.from(submenuNode);

      const initialHeight = subMenuRegion.height;

      const alignPosition = align(
        props,
        subMenuRegion,
        menuItemRegion,
        props.constrainTo,
        domNode
      );

      const newHeight = subMenuRegion.height;
      let maxHeight;
      if (newHeight < initialHeight && props.subMenuConstrainMargin != null) {
        maxHeight = newHeight - props.subMenuConstrainMargin;
      } else if (newHeight < initialHeight) {
        maxHeight = newHeight;
      }

      if (maxHeight && alignPosition == -1) {
        subMenuRegion.top = subMenuRegion.bottom - maxHeight;
      }

      let newLeft = subMenuRegion.left - thisRegion.left;
      let newTop = subMenuRegion.top - thisRegion.top;

      if (Math.abs(newLeft - left) < 5) {
        newLeft = left;
      }

      if (Math.abs(newTop - top) < 5) {
        newTop = top;
      }

      this.subMenuPosition = newLeft < 0 ? 'left' : 'right';

      /**
       * In this case the animation is in mid transition
       * and region has an invalid value
       * @type {[type]}
       */
      if (newHeight === 0) {
        return;
      }

      this.alignOffset = {
        left: newLeft,
        top: newTop,
      };
      this.aligning = true;

      this.setState({
        submenuAlignPosition: alignPosition,
        submenuMaxHeight: props.submenuMaxHeight || maxHeight,
      });
    }, 0);
  }

  if (sameMenu || (this.aligning && this.alignOffset)) {
    assign(style, this.alignOffset);
    style.visibility = 'visible';
    delete style.pointerEvents;
    delete style.overflow;
  }

  this.aligning = false;

  return style;
}
