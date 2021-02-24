/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MutableRefObject } from 'react';

import {
  TypePivotUniqueValuesDescriptor,
  TypeComputedProps,
  TypeColumnGroup,
} from '../../types';

import mapGroups from './mapGroups';

const getGroupsDepth = (
  groupsMap: { [key: string]: TypeColumnGroup } | null
) => {
  if (!groupsMap) {
    return 0;
  }
  return Math.max(
    ...Object.keys(groupsMap).map(groupName => {
      return groupsMap[groupName].computedDepth || 0;
    })
  );
};

const getPivotGroups = (
  uniqueValuesRoot: TypePivotUniqueValuesDescriptor,
  parentGroup?: string,
  pivotSummaryGroups?: any
): any[] => {
  const groups: any[] = [];

  const { field, values } = uniqueValuesRoot;
  if (field && values) {
    Object.keys(values).forEach(value => {
      const groupId = `${
        parentGroup ? parentGroup + '_' : ''
      }${field}:${value}`;

      const defaultGroup = pivotSummaryGroups[field];

      let group: {
        headerAlign?: string;
        name: string;
        header: string;
        group?: string;
      } = {
        name: groupId,

        header: value,
      };

      if (defaultGroup) {
        if (typeof defaultGroup === 'function') {
          group = {
            ...defaultGroup({ ...group, field, values }),
            ...group,
          };
        } else {
          group = {
            ...defaultGroup,
            ...group,
          };
        }
      }
      if (parentGroup) {
        group.group = parentGroup;
      }
      groups.push(group);

      const nextRoot = values[value];

      groups.push(...getPivotGroups(nextRoot, groupId, pivotSummaryGroups));
    });
  }

  return groups;
};

const useGroups = (
  props: {
    groups?: TypeColumnGroup[];
    showWarnings: boolean;
  },
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
): {
  computedGroupsMap: { [key: string]: TypeColumnGroup } | null;
  computedGroupsDepth: number;
  computedGroups?: TypeColumnGroup[];
} => {
  const { computedPivotUniqueValuesPerColumn } = computedProps;

  let groups = props.groups;
  if (
    computedPivotUniqueValuesPerColumn &&
    computedPivotUniqueValuesPerColumn.values
  ) {
    const pivotSummaryGroups = computedProps.pivot
      ? computedProps.pivot.reduce((acc, pivot) => {
          if (pivot && pivot.summaryGroup!) {
            acc[pivot.name!] = pivot.summaryGroup!;
          }
          return acc;
        }, {} as { [key: string]: any })
      : {};
    groups = getPivotGroups(
      computedPivotUniqueValuesPerColumn,
      undefined,
      pivotSummaryGroups
    );
  }
  const groupsMap = groups ? mapGroups(groups, props) : null;
  const computedGroupsDepth = getGroupsDepth(groupsMap);

  return {
    computedGroups: groups,
    computedGroupsMap: groupsMap,
    computedGroupsDepth,
  };
};

export default useGroups;
