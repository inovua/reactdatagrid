/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
  ReactNode,
  useRef,
} from 'react';

import DragHelper from '@inovua/reactdatagrid-community/packages/drag-helper';
import Region from '@inovua/reactdatagrid-community/packages/region';
import join from '@inovua/reactdatagrid-community/packages/join';
import selectParent from '@inovua/reactdatagrid-community/common/selectParent';
import isMobile from '@inovua/reactdatagrid-community/packages/isMobile';

import GridContext from '@inovua/reactdatagrid-community/context';
import { id as ROW_INDEX_COLUMN_ID } from '@inovua/reactdatagrid-community/normalizeColumns/defaultRowIndexColumnId';
import { TypeComputedProps } from '@inovua/reactdatagrid-community/types';
import batchUpdate from '@inovua/reactdatagrid-community/utils/batchUpdate';
import { TypeComputedColumn } from '@inovua/reactdatagrid-community/types/TypeColumn';

type TypeRowResizeHandleProps = {
  data: any;
  rowIndex: number;
  remoteRowIndex: number;
  rowIndexInGroup: number;
  renderIndex?: (index: number) => ReactNode;
  column: TypeComputedColumn;
};

const stopPropagation = e => e.stopPropagation();

const useRowResize = (
  rowIndex: number | null,
  config?: {
    data: any;
    rowIndexInGroup: number | null;
    remoterRowIndex: number;
    setActive: (active: boolean) => void;
    setConstrained: (constrained: boolean) => void;
  }
) => {
  const computedProps: TypeComputedProps = useContext<TypeComputedProps>(
    GridContext
  );

  if (rowIndex == null) {
    rowIndex = computedProps.rowResizeIndexRef.current;
  }

  const setActive = (active: boolean) => {
    const queue = batchUpdate();
    queue.commit(() => {
      if (config && config.setActive) {
        config.setActive(active);
      }

      computedProps.rowResizeHandleRef.current.setHovered(false);
      computedProps.rowResizeHandleRef.current.setActive(active);
      computedProps.coverHandleRef.current.setActive(active);
      computedProps.coverHandleRef.current.setCursor(active ? 'ns-resize' : '');
    });
  };

  const setConstrained = (constrained: boolean) => {
    const queue = batchUpdate();
    queue.commit(() => {
      if (config && config.setConstrained) {
        config.setConstrained(constrained);
      }
      computedProps.rowResizeHandleRef.current.setConstrained(constrained);
    });
  };

  const onResizeDragInit = ({
    constrained,
    offset,
  }: {
    constrained: boolean;
    offset: number;
  }) => {
    const queue = batchUpdate();
    queue.commit(() => {
      setActive(true);
      setConstrained(constrained);

      computedProps.rowResizeIndexRef.current = rowIndex!;
      computedProps.rowResizeHandleRef.current.setOffset(offset);
    });
  };

  const onResizeDrag = ({
    constrained,
    offset,
  }: {
    constrained: boolean;
    offset: number;
  }) => {
    const queue = batchUpdate();
    queue.commit(() => {
      setConstrained(constrained);
      computedProps.rowResizeHandleRef.current.setOffset(offset);
    });
  };

  const onResizeDrop = ({ rowHeight, rowId }) => {
    const queue = batchUpdate();
    queue.commit(() => {
      setActive(false);
      setConstrained(false);
      computedProps.setRowHeightById(rowHeight, rowId);
      computedProps.rowResizeIndexRef.current = null;
    });
  };

  const onDoubleClick = () => {
    const rowId = computedProps.getItemId(config.data);
    const defaultRowHeight: number = computedProps.rowHeight;
    const currentRowHeight: number = computedProps.getRowHeightById(rowId);

    if (currentRowHeight !== defaultRowHeight) {
      const queue = batchUpdate();
      queue.commit(() => {
        setActive(false);
        setConstrained(false);
        computedProps.setRowHeightById(null, rowId);
      });
    }
  };

  const onMouseDown = event => {
    event.preventDefault();
    let rowNode = selectParent('.InovuaReactDataGrid__row', event.target);

    if (!rowNode) {
      rowNode = computedProps
        .getVirtualList()
        .rows.filter(r => r.props.index === rowIndex)[0];
      if (rowNode) {
        rowNode = rowNode.node;
      }
    }

    const constrainTo = Region.from(computedProps.getDOMNode());

    const rowRegion = Region.from(rowNode);

    const rowId = computedProps.getItemId(config.data);
    const initialPosition = rowRegion.bottom - constrainTo.top - 1; // TODO remove this magic constant
    const initialSize = computedProps.getRowHeightById(rowId);

    const minRowHeight = computedProps.minRowHeight || 10;
    const maxRowHeight = computedProps.maxRowHeight;

    constrainTo.set({ top: rowRegion.top + minRowHeight });
    if (maxRowHeight) {
      constrainTo.set({ bottom: rowRegion.top + maxRowHeight });
    }

    const isContrained = dragRegion => {
      const constrained =
        dragRegion.top <= constrainTo.top ||
        dragRegion.bottom >= constrainTo.bottom;
      return constrained;
    };

    rowRegion.set({ top: rowRegion.bottom });

    let dropped = false;

    DragHelper(event, {
      constrainTo,
      region: rowRegion,
      onDragInit: (e, config) => {
        const constrained = isContrained(config.dragRegion);

        setTimeout(() => {
          if (dropped) {
            return;
          }
          onResizeDragInit({
            offset: initialPosition,
            constrained,
          });
        }, 150); // TODO improve this - allow 150ms for dblclick to be able to go through
      },
      onDrag(e, config) {
        e.preventDefault();
        e.stopPropagation();

        const diff = config.diff.top;

        const offset = initialPosition + diff;
        const constrained = isContrained(config.dragRegion);

        e.preventDefault();

        onResizeDrag({
          constrained,
          offset,
        });
      },
      onDrop(e, config) {
        dropped = true;

        const diff = config.diff.top;

        onResizeDrop({
          rowHeight: initialSize + diff,
          rowId,
        });
      },
    });
  };

  return {
    onMouseDown,
    onDoubleClick,
  };
};

export const RowResizeIndicator = ({
  handle,
  height,
  column,
}: {
  column: TypeComputedColumn;
  height: number;
  handle: (handleArg: {
    setOffset: Dispatch<SetStateAction<number>>;
    setActive: Dispatch<SetStateAction<boolean>>;
    setHovered: Dispatch<SetStateAction<boolean>>;
    setConstrained: Dispatch<SetStateAction<boolean>>;
    setInitialWidth: Dispatch<SetStateAction<number>>;
  }) => void;
}) => {
  const [offset, setOffset] = useState<number>(0);
  const [hovered, setHovered] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [constrained, setConstrained] = useState<boolean>(false);
  const [initialWidth, setInitialWidth] = useState<number>(0);

  useEffect(() => {
    handle({
      setOffset,
      setActive,
      setConstrained,
      setHovered,
      setInitialWidth,
    });
  }, []);

  const { onMouseDown, onDoubleClick } = useRowResize(null);

  const style: { [key: string]: string | number } = {
    transform: `translate3d(0px, ${offset -
      Math.floor(height / 2) -
      1}px, 0px)`,
    height,
    left: column.computedOffset,
  };

  if (hovered && !(active || constrained)) {
    style.width = initialWidth || 20;
  }

  return (
    <div
      style={style}
      className={join(
        `InovuaReactDataGrid__row-resize-indicator`,
        active && `InovuaReactDataGrid__row-resize-indicator--active`,
        hovered && `InovuaReactDataGrid__row-resize-indicator--hovered`,
        isMobile && `InovuaReactDataGrid__row-resize-indicator--mobile`,
        constrained && `InovuaReactDataGrid__row-resize-indicator--constrained`
      )}
      // this is for mobile, since on mobile this remains visible
      onTouchStart={onMouseDown}
      onClick={stopPropagation}
      onDoubleClick={onDoubleClick}
    />
  );
};

export const RowResizeHandle = React.memo(
  ({
    rowIndex,
    data,
    remoteRowIndex,
    renderIndex,
    rowIndexInGroup,
    column,
  }: TypeRowResizeHandleProps) => {
    const computedProps: TypeComputedProps | null = useContext<TypeComputedProps | null>(
      GridContext
    );

    const [active, doSetActive] = useState<boolean>(false);
    const [constrained, doSetConstrained] = useState<boolean>(false);
    const domRef = useRef<HTMLDivElement>(null);

    const { onMouseDown, onDoubleClick } = useRowResize(rowIndex, {
      rowIndexInGroup,
      data,
      remoteRowIndex,
      setActive: doSetActive,
      setConstrained: doSetConstrained,
    });

    const onMouseEnter = () => {
      if (!computedProps) {
        return;
      }
      const queue = batchUpdate();

      const constrainTo = Region.from(computedProps.getDOMNode());
      const handleRegion = Region.from(domRef.current);

      const initialPosition = handleRegion.bottom - constrainTo.top;

      queue.commit(() => {
        computedProps.rowResizeHandleRef.current.setHovered(true);
        computedProps.rowResizeHandleRef.current.setOffset(initialPosition);
        computedProps.rowResizeHandleRef.current.setInitialWidth(
          column.computedWidth
        );
      });
    };

    const onMouseLeave = () => {
      if (!computedProps) {
        return;
      }
      computedProps.rowResizeHandleRef.current.setHovered(false);
    };

    const indexToRender =
      rowIndexInGroup != null ? rowIndexInGroup : remoteRowIndex;
    return (
      <>
        {renderIndex ? renderIndex(indexToRender) : indexToRender + 1}
        <div
          ref={domRef}
          className={join(
            `InovuaReactDataGrid__row-resize-handle`,
            isMobile && `InovuaReactDataGrid__row-resize-handle--mobile`
          )}
          style={{
            width: column.computedWidth,
            height: computedProps ? computedProps.rowResizeHandleWidth : 10,
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onClick={stopPropagation}
          onDoubleClick={onDoubleClick}
        />
      </>
    );
  }
);
export default {
  id: ROW_INDEX_COLUMN_ID,
  rowIndexColumn: true,
  rowResize: true,
  cellSelectable: false,
  autoLock: true,
  headerAlign: 'center',
  textAlign: 'center',
  className: 'InovuaReactDataGrid__row-index-column',
  render: (
    {
      remoteRowIndex,
      data,
      rowIndex,
      rowIndexInGroup,
    }: {
      data: any;
      rowIndexInGroup: number;
      rowIndex: number;
      remoteRowIndex: number;
    },
    {
      column,
    }: {
      column: TypeComputedColumn & {
        renderIndex?: (index: number) => ReactNode;
      };
    }
  ) => {
    return (
      <RowResizeHandle
        data={data}
        rowIndex={rowIndex}
        rowIndexInGroup={rowIndexInGroup}
        remoteRowIndex={remoteRowIndex}
        renderIndex={column.renderIndex}
        column={column}
      />
    );
  },
  header: '',
  showInContextMenu: false,
  showColumnMenuSortOptions: false,
  showColumnMenuGroupOptions: false,
  showColumnMenuTool: false,
  sortable: false,
  editable: false,
  draggable: false,
  groupBy: false,
  defaultWidth: 40,
  minWidth: 40,
};

export { ROW_INDEX_COLUMN_ID as rowExpandColumnId };
