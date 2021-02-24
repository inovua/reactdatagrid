/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function getMinMaxSize(props) {
  let sizeType;
  let single;

  const style = props.style || {};
  const result = {};

  if (props.minSize) {
    sizeType = typeof props.minSize;
    single = sizeType == 'number' || sizeType == 'string';

    if (single) {
      result.minWidth = props.minSize;
      result.minHeight = props.minSize;
    } else {
      if (props.minSize.width) {
        result.minWidth = props.minSize.width;
      }
      if (props.minSize.height) {
        result.minHeight = props.minSize.height;
      }
    }
  }

  if (props.maxSize) {
    sizeType = typeof props.maxSize;
    single = sizeType == 'number' || sizeType == 'string';

    if (single) {
      result.maxWidth = props.maxSize;
      result.maxHeight = props.maxSize;
    } else {
      if (props.maxSize.width) {
        result.maxWidth = props.maxSize.width;
      }
      if (props.maxSize.height) {
        result.maxHeight = props.maxSize.height;
      }
    }
  }

  if (result.minWidth == undefined && style.minWidth != undefined) {
    result.minWidth = style.minWidth;
  }

  if (result.maxWidth == undefined && style.maxWidth != undefined) {
    result.maxWidth = style.maxWidth;
  }

  if (result.minHeight == undefined && style.minHeight != undefined) {
    result.minHeight = style.minHeight;
  }

  if (result.maxHeight == undefined && style.maxHeight != undefined) {
    result.maxHeight = style.maxHeight;
  }

  return result;
}

export default getMinMaxSize;
