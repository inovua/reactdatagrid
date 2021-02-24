/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeDataGridProps, TypeComputedProps } from '../src/types';
import { MutableRefObject } from 'react';
import { TypeComputeTreeDataParam } from '../types';
import { warn, warnOnce } from '../warn';

const emptyPlugin = {
  name: '',

  hook: (
    props: TypeDataGridProps,
    computedProps: TypeComputedProps,
    computedPropsRef: MutableRefObject<TypeComputedProps | null>
  ) => {},
};

export default [
  {
    ...emptyPlugin,
    name: 'sortable-columns',
    defaultProps: () => {
      return { sortable: false };
    },
  },
  {
    ...emptyPlugin,
    name: 'license',
    defaultProps: () => {
      return {};
    },
    renderLicenseNotice: () => null,
  },
  {
    ...emptyPlugin,
    name: 'menus',
    defaultProps: () => {
      return {
        showColumnMenuTool: false,
      };
    },
  },
  {
    ...emptyPlugin,
    name: 'group-and-pivot',
    hook: () => {
      return {
        computeDataStep: ({ config }: { config: any }) => {
          warnOnce(
            'You are trying to use the grouping or pivot functionality, but are currently using the community edition. Please use the enterprise edition for this functionality to be available.'
          );
          return config;
        },
      };
    },
    defaultProps: () => {
      return {};
    },
  },

  {
    ...emptyPlugin,
    name: 'tree',
    hook: () => {
      return {
        computeTreeData: (
          data: any[],
          arg: TypeComputeTreeDataParam
        ): any[] => {
          warnOnce(
            'You are trying to use the tree functionality, but are currently using the community edition. Please use the enterprise edition for this functionality to be available.'
          );
          return data;
        },
      };
    },
    defaultProps: () => {
      return {};
    },
  },
  {
    ...emptyPlugin,
    name: 'filters',

    defaultProps: () => {
      return {
        columnFilterContextMenuConstrainTo: true,
        columnFilterContextMenuPosition: 'fixed',
      };
    },
  },

  {
    ...emptyPlugin,
    name: 'cell-selection',
    hook: () => {
      return {};
    },
    defaultProps: () => {
      return {};
    },
  },
  {
    ...emptyPlugin,
    name: 'live-pagination',
    hook: () => {
      return {};
    },
    defaultProps: () => {
      return {};
    },
  },
  {
    ...emptyPlugin,
    name: 'row-index-column',

    renderRowResizeIndicator: () => {
      return null;
    },
    defaultProps: () => {
      return {};
    },
  },
];
