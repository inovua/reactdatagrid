/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isValidElement } from 'react';
import uglified from '../../../packages/uglified';

const emptyObject = {};

const isValid = (value: any) => {
  if (value == null) {
    return true;
  }

  if (Array.isArray(value)) {
    return true;
  }

  const type = typeof value;
  if (type == 'string' || type == 'number') {
    return true;
  }

  return isValidElement(value);
};

export default ({
  cellProps,
  rowProps,
}: {
  cellProps: any;
  rowProps: any;
  groupProps?: any;
}) => {
  const { computedLocked } = cellProps;
  const { data, groupProps = emptyObject, hasLockedStart } = rowProps;

  let renderGroupTitle =
    computedLocked === 'start' || (!hasLockedStart && !computedLocked)
      ? groupProps.renderGroupTitle
      : computedLocked === 'end'
      ? groupProps.renderLockedEndGroupTitle
      : groupProps.renderUnlockedGroupTitle;

  let groupColId;
  if (rowProps.data.fieldPath && rowProps.data.fieldPath.length) {
    groupColId = rowProps.data.fieldPath[rowProps.data.fieldPath.length - 1];
  }
  groupColId = groupColId || rowProps.data.name || rowProps.data.id;

  const col = rowProps.columnsMap[groupColId];

  if (col && col.renderGroupTitle) {
    return col.renderGroupTitle(rowProps.data.value, rowProps);
  }
  if (renderGroupTitle) {
    return renderGroupTitle(rowProps.data.value, rowProps);
  }

  if (col && col.groupToString) {
    return col.groupToString(rowProps.data.value, {
      data: rowProps.data,
      fieldName: col.name,
      renderGroupTitle: true,
    });
  }

  if (computedLocked === 'start') {
    // only if the cell is locked start and there is no custom `renderGroupTitle` props
    // should you render the default value
    if (!uglified && !isValid(data.value)) {
      return `Invalid group title for column "${groupColId}". Use "renderGroupTitle" column prop.`;
    }
    return data.value;
  }
  if (!hasLockedStart && !computedLocked) {
    if (!uglified && !isValid(data.value)) {
      return `Invalid group title for column "${groupColId}". Use "renderGroupTitle" column prop.`;
    }
    return data.value;
  }

  return null;
};
