/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TypeComputedProps,
  TypeDataGridProps,
} from '@inovua/reactdatagrid-community/types';
import isMobile from '@inovua/reactdatagrid-community/packages/isMobile';
import { useRef, SetStateAction, Dispatch } from 'react';
import { RowResizeIndicator } from './defaultRowIndexColumn';
import { id as rowIndexColumnId } from '@inovua/reactdatagrid-community/normalizeColumns/defaultRowIndexColumnId';
import React from 'react';
import maybeAddRowIndexColumn from './maybeAddRowIndexColumn';

const emptyRowResizeHandle = {
  setOffset: () => {},
  setActive: () => {},
  setConstrained: () => {},
  setInitialWidth: () => {},
  setHovered: () => {},
};

export default {
  name: 'row-index-column',
  maybeAddColumns: maybeAddRowIndexColumn,

  hook: (props: TypeDataGridProps, computedProps: TypeComputedProps) => {
    computedProps.rowResizeHandleRef = useRef<{
      setOffset: Dispatch<SetStateAction<number>>;
      setActive: Dispatch<SetStateAction<boolean>>;
      setHovered: Dispatch<SetStateAction<boolean>>;
      setConstrained: Dispatch<SetStateAction<boolean>>;
      setInitialWidth: Dispatch<SetStateAction<number>>;
    }>(emptyRowResizeHandle);
  },
  defaultProps: () => {
    return {
      rowResizeHandleWidth: isMobile ? 15 : 5,
    };
  },

  renderRowResizeIndicator(computedProps: TypeComputedProps) {
    const rowResizeHandle = React.useCallback(
      ({
        setOffset,
        setActive,
        setConstrained,
        setHovered,
        setInitialWidth,
      }: {
        setOffset: Dispatch<SetStateAction<number>>;
        setActive: Dispatch<SetStateAction<boolean>>;
        setConstrained: Dispatch<SetStateAction<boolean>>;
        setHovered: Dispatch<SetStateAction<boolean>>;
        setInitialWidth: Dispatch<SetStateAction<number>>;
      }) => {
        computedProps.rowResizeHandleRef.current = {
          setOffset,
          setActive,
          setConstrained,
          setHovered,
          setInitialWidth,
        };
      },
      []
    );

    return computedProps.rowIndexColumn ? (
      <RowResizeIndicator
        column={computedProps.columnsMap[rowIndexColumnId]}
        handle={rowResizeHandle}
        height={computedProps.rowResizeHandleWidth}
      />
    ) : null;
  },
};
