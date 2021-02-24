/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import hasOwn from '../../../packages/hasOwn';
import VALIDATE from './validate';

export default function(REGION) {
  var MAX = Math.max;
  var MIN = Math.min;

  var statics = {
    init: function() {
      var exportAsNonStatic = {
        getIntersection: true,
        getIntersectionArea: true,
        getIntersectionHeight: true,
        getIntersectionWidth: true,
        getUnion: true,
      };
      var thisProto = REGION.prototype;
      var newName;

      var exportHasOwn = hasOwn(exportAsNonStatic);
      var methodName;

      for (methodName in exportAsNonStatic)
        if (exportHasOwn(methodName)) {
          newName = exportAsNonStatic[methodName];
          if (typeof newName != 'string') {
            newName = methodName;
          }

          (function(proto, methodName, protoMethodName) {
            proto[methodName] = function(region) {
              if (!REGION[protoMethodName]) {
                console.warn(
                  'cannot find method ',
                  protoMethodName,
                  ' on ',
                  REGION
                );
              }

              return REGION[protoMethodName](this, region);
            };
          })(thisProto, newName, methodName);
        }
    },

    validate: VALIDATE,

    /**
     * Returns the region corresponding to the documentElement
     * @return {Region} The region corresponding to the documentElement. This region is the maximum region visible on the screen.
     */
    getDocRegion: function() {
      return REGION.fromDOM(document.documentElement);
    },

    from: function(reg) {
      if (reg.__IS_REGION) {
        return reg;
      }

      if (typeof document != 'undefined') {
        if (reg && reg.getBoundingClientRect) {
          return REGION.fromDOM(reg);
        }

        if (
          reg.type &&
          typeof reg.pageX !== 'undefined' &&
          typeof reg.pageY !== 'undefined'
        ) {
          return REGION.fromEvent(reg);
        }
      }

      return REGION(reg);
    },

    fromEvent: function(event) {
      return REGION.fromPoint({
        x: event.pageX,
        y: event.pageY,
      });
    },

    fromDOM: function(dom) {
      var rect = dom.getBoundingClientRect();

      return new REGION({
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
      });
    },

    /**
     * @static
     * Returns a region that is the intersection of the given two regions
     * @param  {Region} first  The first region
     * @param  {Region} second The second region
     * @return {Region/Boolean}        The intersection region or false if no intersection found
     */
    getIntersection: function(first, second) {
      var area = this.getIntersectionArea(first, second);

      if (area) {
        return new REGION(area);
      }

      return false;
    },

    getIntersectionWidth: function(first, second) {
      var minRight = MIN(first.right, second.right);
      var maxLeft = MAX(first.left, second.left);

      if (maxLeft < minRight) {
        return minRight - maxLeft;
      }

      return 0;
    },

    getIntersectionHeight: function(first, second) {
      var maxTop = MAX(first.top, second.top);
      var minBottom = MIN(first.bottom, second.bottom);

      if (maxTop < minBottom) {
        return minBottom - maxTop;
      }

      return 0;
    },

    getIntersectionArea: function(first, second) {
      var maxTop = MAX(first.top, second.top);
      var minRight = MIN(first.right, second.right);
      var minBottom = MIN(first.bottom, second.bottom);
      var maxLeft = MAX(first.left, second.left);

      if (maxTop < minBottom && maxLeft < minRight) {
        return {
          top: maxTop,
          right: minRight,
          bottom: minBottom,
          left: maxLeft,

          width: minRight - maxLeft,
          height: minBottom - maxTop,
        };
      }

      return false;
    },

    /**
     * @static
     * Returns a region that is the union of the given two regions
     * @param  {Region} first  The first region
     * @param  {Region} second The second region
     * @return {Region}        The union region. The smallest region that contains both given regions.
     */
    getUnion: function(first, second) {
      var top = MIN(first.top, second.top);
      var right = MAX(first.right, second.right);
      var bottom = MAX(first.bottom, second.bottom);
      var left = MIN(first.left, second.left);

      return new REGION(top, right, bottom, left);
    },

    /**
     * @static
     * Returns a region. If the reg argument is a region, returns it, otherwise return a new region built from the reg object.
     *
     * @param  {Region} reg A region or an object with either top, left, bottom, right or
     * with top, left, width, height
     * @return {Region} A region
     */
    getRegion: function(reg) {
      return REGION.from(reg);
    },

    /**
     * Creates a region that corresponds to a point.
     *
     * @param  {Object} xy The point
     * @param  {Number} xy.x
     * @param  {Number} xy.y
     *
     * @return {Region}    The new region, with top==xy.y, bottom = xy.y and left==xy.x, right==xy.x
     */
    fromPoint: function(xy) {
      return new REGION({
        top: xy.y,
        bottom: xy.y,
        left: xy.x,
        right: xy.x,
      });
    },
  };

  Object.keys(statics).forEach(function(key) {
    REGION[key] = statics[key];
  });

  REGION.init();
}
