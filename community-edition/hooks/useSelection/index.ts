/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Dispatch,
  SetStateAction,
  MutableRefObject,
  useState,
  useCallback,
  useEffect,
} from 'react';

import {
  TypeDataGridProps,
  TypeComputedProps,
  TypeRowSelection,
  TypeCellSelection,
  TypeRowUnselected,
  TypeBatchUpdateQueue,
  TypeCellProps,
  TypeGetColumnByParam,
} from '../../types';

import useProperty from '../useProperty';

import { TypeSelectedProps } from './types';
import isSelectionEnabled from './isSelectionEnabled';
import isMultiSelect from './isMultiSelect';
import isSelectionControlled from './isSelectionControlled';
import { notifySelection, handleSelection } from '../useRow/handleSelection';
import batchUpdate from '../../utils/batchUpdate';
import usePrevious from '../usePrevious';

const EMPTY_OBJECT = {};

const getUnselectedFromProps = (
  computedProps: { computedUnselected?: TypeRowUnselected } | null
): TypeRowUnselected => {
  if (!computedProps) {
    return null;
  }
  if (computedProps.computedUnselected === undefined) {
    return null;
  }

  return computedProps.computedUnselected;
};

const getUnselectedCountFromProps = (
  computedProps: {
    computedRowSelectionEnabled: boolean;
    computedRowMultiSelectionEnabled: boolean;
    computedUnselected?: TypeRowUnselected;
  } | null,
  unselected?: TypeRowUnselected
): number => {
  if (!computedProps) {
    return 0;
  }
  if (!computedProps.computedRowSelectionEnabled) {
    return 0;
  }

  if (!computedProps.computedRowMultiSelectionEnabled) {
    return 0;
  }

  unselected =
    unselected === undefined
      ? getUnselectedFromProps(computedProps)
      : unselected;

  return unselected ? Object.keys(unselected).length : 0;
};

const getSelectedCountFromProps = (
  computedProps: {
    paginationCount: number;
    computedRowMultiSelectionEnabled: boolean;
    computedRowSelectionEnabled: boolean;
    computedRemoteData: boolean;
    computedPagination: boolean;
    computedSelected?: TypeRowSelection;
    computedUnselected?: TypeRowUnselected;
  } | null,
  selected?: TypeRowSelection,
  unselected?: TypeRowUnselected
): number => {
  if (!computedProps) {
    return 0;
  }
  if (!computedProps.computedRowSelectionEnabled) {
    return 0;
  }

  const multiSelect = computedProps.computedRowMultiSelectionEnabled;
  selected = selected === undefined ? computedProps.computedSelected : selected;

  if (multiSelect && selected === true) {
    const unselectedCount = getUnselectedCountFromProps(
      computedProps,
      unselected
    );

    return computedProps.paginationCount - unselectedCount;
  }

  return multiSelect
    ? selected
      ? Object.keys(selected).length
      : 0
    : !selected || Object.keys(selected).length === 0
    ? 0
    : 1;
};

const useUnselected = (
  props: TypeSelectedProps,
  {
    rowSelectionEnabled,
    rowMultiSelectionEnabled,
  }: {
    rowSelectionEnabled: boolean;
    rowMultiSelectionEnabled: boolean;
  },
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
): {
  unselected: TypeRowUnselected;
  setUnselected: Dispatch<SetStateAction<TypeRowUnselected>>;
} => {
  let [unselected, setUnselected] = useProperty<TypeRowUnselected>(
    props,
    'unselected'
  );

  let [unselectedCount, setUnselectedCount] = useState<number>(
    unselected ? Object.keys(unselected).length : 0
  );

  if (!rowSelectionEnabled) {
    return {
      unselected: null,
      setUnselected,
    };
  }

  if (!rowMultiSelectionEnabled) {
    return {
      unselected: null,
      setUnselected,
    };
  }

  return {
    unselected,
    setUnselected,
  };
};

const useSelected = (
  props: TypeSelectedProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
): {
  selected: TypeRowSelection;
  rowSelectionEnabled: boolean;
  setSelected: Dispatch<SetStateAction<TypeRowSelection>>;
  rowMultiSelectionEnabled: boolean;
} => {
  let [selected, setSelected] = useProperty<TypeRowSelection>(
    props,
    'selected',
    undefined,
    {
      onChange: (
        selected: TypeRowSelection,
        {
          silent,
          unselected,
          data,
        }: {
          silent?: boolean;
          unselected?: TypeRowUnselected;
          data?: object;
        } = {}
      ) => {
        const { current: computedProps } = computedPropsRef;
        if (props.onSelectionChange && !silent) {
          props.onSelectionChange({
            selected,
            data,
            unselected:
              unselected !== undefined
                ? unselected
                : computedProps != null
                ? computedProps.computedUnselected
                : null,
          });
        }
      },
    }
  );

  const rowSelectionEnabled = isSelectionEnabled(props);
  const rowMultiSelectionEnabled = isMultiSelect(props);

  if (!rowSelectionEnabled) {
    return {
      selected: null,
      setSelected,
      rowSelectionEnabled,
      rowMultiSelectionEnabled,
    };
  }

  if (isSelectionControlled(props)) {
    return {
      selected,
      setSelected,
      rowSelectionEnabled,
      rowMultiSelectionEnabled,
    };
  }

  if (
    rowMultiSelectionEnabled &&
    (typeof selected != 'object' || !selected) &&
    selected !== true
  ) {
    selected = EMPTY_OBJECT;
  }

  return {
    selected,
    setSelected,
    rowSelectionEnabled,
    rowMultiSelectionEnabled,
  };
};

export default (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
): {
  selectAll: () => void;
  deselectAll: () => void;
  toggleActiveCellSelection: () => void;
  setSelectedById: (
    id: string,
    selected: boolean,
    queue?: TypeBatchUpdateQueue
  ) => void;
  setRowSelected: (
    index: number,
    selected: boolean,
    event?: KeyboardEvent | MouseEvent
  ) => void;
  setSelectedAt: (
    index: number,
    selected: boolean,
    queue?: TypeBatchUpdateQueue
  ) => void;
  computedCellSelection: TypeCellSelection;
  setCellSelection: (cellSelection: TypeCellSelection) => void;
  incrementActiveCell: (direction: [number, number]) => void;
  computedCellSelectionEnabled: boolean;
  computedCellMultiSelectionEnabled: boolean;
  computedCellNavigationEnabled: boolean;
  computedActiveCell: [number, number] | null | undefined;
  cellDragStartRowIndex: number | null;
  onCellSelectionDraggerMouseDown:
    | ((
        event: any,
        { columnIndex, rowIndex }: { columnIndex: number; rowIndex: number }
      ) => void)
    | null;
  onCellEnter:
    | ((
        event: any,
        { columnIndex, rowIndex }: { columnIndex: number; rowIndex: number }
      ) => void)
    | null;
  setCellDragStartRowIndex: Dispatch<SetStateAction<number | null>>;

  computedHasRowNavigation: boolean;
  computedRowSelectionEnabled: boolean;
  computedRowMultiSelectionEnabled: boolean;
  computedSelected: TypeRowSelection;
  setSelected: Dispatch<SetStateAction<TypeRowSelection>>;
  computedUnselected: TypeRowUnselected;
  setUnselected: Dispatch<SetStateAction<TypeRowUnselected>>;
  isSelectionEmpty: () => boolean;
  getSelectedMap: () => { [key: string]: boolean } | true;
  isRowSelected: (data: object | number) => boolean;
  getUnselectedMap: () => { [key: string]: boolean };
  getUnselectedCount: (unselected?: TypeRowUnselected) => number;
  getSelectedCount: (
    selected?: TypeRowSelection,
    unselected?: TypeRowUnselected
  ) => number;
  computedUnselectedCount: number;
  computedSelectedCount: number;
  getCellSelectionBetween: (
    start?: [number, number],
    end?: [number, number]
  ) => { [key: string]: boolean };
  getCellSelectionIdKey: (
    rowIndex: number,
    columnIndex: number
  ) => string | number;
  getCellSelectionKey?: (
    cellProps: number | TypeCellProps | string,
    col: TypeGetColumnByParam
  ) => string | number;
  setActiveCell: (activeCell: [number, number] | null) => void;
} => {
  const {
    selected: computedSelected,
    setSelected,
    rowMultiSelectionEnabled,
    rowSelectionEnabled,
  } = useSelected(props, computedProps, computedPropsRef);

  const previousRowMultiSelectionEnabled = usePrevious(
    rowMultiSelectionEnabled,
    rowMultiSelectionEnabled
  );

  useEffect(() => {
    if (
      previousRowMultiSelectionEnabled === true &&
      rowMultiSelectionEnabled === false
    ) {
      setSelected({});
    }
  }, [previousRowMultiSelectionEnabled, rowMultiSelectionEnabled]);

  const computedRowSelectionEnabled = rowSelectionEnabled;
  const computedRowMultiSelectionEnabled = rowMultiSelectionEnabled;

  const { unselected: computedUnselected, setUnselected } = useUnselected(
    props,
    {
      rowSelectionEnabled,
      rowMultiSelectionEnabled,
    },
    computedPropsRef
  );

  const computedSelectedCount = getSelectedCountFromProps(
    {
      computedPagination: computedProps.computedPagination,
      computedRemoteData: computedProps.computedRemoteData,
      paginationCount: computedProps.paginationCount,
      computedRowMultiSelectionEnabled,
      computedRowSelectionEnabled,
    },
    computedSelected,
    computedUnselected
  );
  const computedUnselectedCount = getUnselectedCountFromProps(
    {
      computedRowMultiSelectionEnabled,
      computedRowSelectionEnabled,
    },
    computedUnselected
  );

  const isSelectionEmpty = useCallback((): boolean => {
    const selected = computedSelected;
    let selectionEmpty = false;

    if (selected == null) {
      selectionEmpty = true;
    }

    if (typeof selected === 'object' && selected !== null) {
      selectionEmpty = Object.keys(selected).length === 0;
    }

    return selectionEmpty;
  }, [computedSelected]);

  const getSelectedMap = useCallback((): { [key: string]: boolean } | true => {
    if (computedRowMultiSelectionEnabled) {
      return computedSelected as { [key: string]: boolean };
    }

    return { [computedSelected as string]: true };
  }, [computedRowMultiSelectionEnabled, computedSelected]);

  const getUnselected = useCallback(
    (): TypeRowUnselected => getUnselectedFromProps(computedPropsRef.current),
    []
  );

  const getUnselectedMap = useCallback((): { [key: string]: boolean } => {
    const { current: computedProps } = computedPropsRef;

    if (!computedProps) {
      return {};
    }
    const unselected = getUnselected();

    if (computedProps.computedRowMultiSelectionEnabled) {
      return unselected || {};
    }

    return {};
  }, [getUnselected]);

  const getUnselectedCount = (unselected?: TypeRowUnselected): number =>
    getUnselectedCountFromProps(computedPropsRef.current, unselected);

  const getSelectedCount = (
    selected?: TypeRowSelection,
    unselected?: TypeRowUnselected
  ): number =>
    getSelectedCountFromProps(computedPropsRef.current, selected, unselected);

  const isRowSelected = useCallback(
    (data: object | number): boolean => {
      const { current: computedProps } = computedPropsRef;

      if (!computedProps) {
        return false;
      }
      if (typeof data == 'number') {
        data = computedProps.getItemAt(data);
      }
      const selectedMap = getSelectedMap();
      const id = computedProps.getItemId(data as object);

      if (selectedMap === true) {
        const unselectedMap = getUnselectedMap();
        return !unselectedMap[id];
      }

      return !!selectedMap[id];
    },
    [getSelectedMap, getUnselectedMap]
  );

  // we need this here (temp used variable)
  // to compute hasRowNavigation below
  // but the actual computedCellSelection is computed in useCellSelection
  const cellSelectionTmp = props.cellSelection || props.defaultCellSelection;
  const activeCellDefined =
    props.activeCell !== undefined || props.defaultActiveCell !== undefined;

  let computedHasRowNavigation =
    (computedRowSelectionEnabled || !cellSelectionTmp) &&
    computedProps.computedActiveIndex > -1
      ? true
      : props.enableKeyboardNavigation !== false &&
        !cellSelectionTmp &&
        !activeCellDefined;

  if (props.enableKeyboardNavigation === false) {
    computedHasRowNavigation = false;
  }

  const {
    computedCellSelection,
    setCellSelection,
    cellSelectionEnabled: computedCellSelectionEnabled,
    cellMultiSelectionEnabled: computedCellMultiSelectionEnabled,
    cellNavigationEnabled: computedCellNavigationEnabled,
    computedActiveCell,
    incrementActiveCell,
    getCellSelectionIdKey,
    getCellSelectionBetween,
    toggleActiveCellSelection,
    onCellEnter,
    setActiveCell,
    getCellSelectionKey,
    cellDragStartRowIndex,
    setCellDragStartRowIndex,
    onCellSelectionDraggerMouseDown,
  } = computedProps.useCellSelection(
    props,
    {
      rowSelectionEnabled,
      listenOnCellEnter: computedProps.listenOnCellEnter,
      hasRowNavigation: computedHasRowNavigation,
    },
    computedPropsRef
  );

  const selectAll = useCallback(() => {
    const { current: computedProps } = computedPropsRef;

    if (!computedProps) {
      return;
    }

    if (!computedProps.computedRowSelectionEnabled) {
      return;
    }

    let data = computedProps.data;
    let dataMap: { [key: string]: any } | null = computedProps.dataMap;

    if (computedProps.computedGroupBy) {
      // need to filter out groups
      dataMap = {};
      data = data.filter(d => {
        const id = computedProps.getItemId(d);

        if (!d.__group) {
          dataMap![id] = id;
          return true;
        }
      });
    }

    if (computedProps.computedTreeEnabled && computedProps.stickyTreeNodes) {
      const vl = computedProps.getVirtualList();

      vl.updateStickyRows(undefined, undefined, { force: true });
    }

    notifySelection(
      computedProps,
      computedProps.computedRemoteData || computedProps.computedPagination
        ? data.length === 0
          ? false
          : true
        : dataMap,
      data,
      null
    );
  }, []);

  const deselectAll = useCallback(() => {
    const { current: computedProps } = computedPropsRef;

    if (!computedProps) {
      return;
    }

    if (computedProps.computedTreeEnabled && computedProps.stickyTreeNodes) {
      const vl = computedProps.getVirtualList();

      vl.updateStickyRows(undefined, undefined, { force: true });
    }

    notifySelection(computedProps, {}, [], null);
  }, []);

  const setRowSelected = useCallback(
    (index: number, selected: boolean, event?: KeyboardEvent | MouseEvent) => {
      const { current: computedProps } = computedPropsRef;

      if (!computedProps) {
        return;
      }

      const queue = batchUpdate();
      if (
        computedProps.checkboxSelectEnableShiftKey &&
        computedProps.computedRowMultiSelectionEnabled
      ) {
        if (event && event.target) {
          const { shiftKey, metaKey, ctrlKey } = event;

          if (shiftKey) {
            const rowProps = {
              data: computedProps.getItemAt(index),
              rowIndex: index,
            };
            handleSelection(
              rowProps,
              computedProps,
              ({ shiftKey, metaKey, ctrlKey } as unknown) as MouseEvent,
              queue
            );

            return;
          }
          computedProps.shiftKeyIndexRef.current = index;
          computedProps.selectionIndexRef.current = index;
        }
      }
      computedProps.setSelectedAt(index, selected, queue);

      queue.commit();
    },
    [computedProps.initialProps.checkboxSelectEnableShiftKey]
  );

  const setSelectedAt = useCallback(
    (index: number, selected: boolean, queue?: TypeBatchUpdateQueue) => {
      const { current: computedProps } = computedPropsRef;

      if (!computedProps) {
        return;
      }

      const data = computedProps.data[index];
      if (!data) {
        return;
      }

      const id = computedProps.getItemId(data);

      computedProps.setSelectedById(id, selected, queue);
    },
    []
  );

  const treeGridChildrenSelection = (
    dataArray: any,
    id: string,
    selected: boolean,
    clone: any,
    treeGridChildrenDeselectionEnabled?: boolean,
    parentNode?: any
  ) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }

    const idProperty = computedProps.idProperty;
    const nodesName = computedProps.nodesProperty;
    const pathSeparator = computedProps.nodePathSeparator;
    const expandedNodes: any =
      computedProps.computedExpandedNodes || EMPTY_OBJECT;
    const generateIdFromPath = computedProps.generateIdFromPath;

    for (let i = 0; i < dataArray.length; i++) {
      const item = dataArray[i];

      if (item) {
        const itemId = item[idProperty];
        const itemNodes = item[nodesName];
        const parentNodeId = parentNode
          ? `${parentNode[idProperty]}`
          : undefined;
        const path = parentNode
          ? `${parentNodeId}${pathSeparator}${itemId}`
          : `${itemId}`;

        if (generateIdFromPath) {
          item[idProperty] = path;
        }

        const idLength = id.split(pathSeparator)?.length;
        const idFromPath = path
          .split(pathSeparator)
          .slice(0, idLength)
          .join(pathSeparator);

        if (idFromPath === id) {
          const treeData = computedProps.dataMap
            ? computedProps.dataMap[path]
            : null;
          if (!treeData) {
            continue;
          }
          if (selected) {
            clone[path] = treeData;
          } else {
            if (treeGridChildrenDeselectionEnabled) {
              delete clone[path];
            } else {
              delete clone[id];
            }
          }
        }

        if (expandedNodes && expandedNodes[itemId]) {
          if (Array.isArray(itemNodes)) {
            treeGridChildrenSelection(
              itemNodes,
              id,
              selected,
              clone,
              treeGridChildrenDeselectionEnabled,
              item
            );
          }
        }
      }
    }

    return clone;
  };

  const setSelectedById = useCallback(
    (id: string, selected: boolean, queue?: TypeBatchUpdateQueue) => {
      const { current: computedProps } = computedPropsRef;

      if (!computedProps) {
        return;
      }
      const data = computedProps.dataMap ? computedProps.dataMap[id] : null;
      if (!data) {
        return;
      }

      const isSelected = computedProps.isRowSelected(data);
      const multiSelect = computedProps.computedRowMultiSelectionEnabled;

      if (isSelected === selected) {
        return;
      }

      if (multiSelect) {
        const selectedMap = computedProps.computedSelected;
        let unselectedMap =
          selectedMap === true ? computedProps.computedUnselected || {} : null;

        let clone: { [key: string]: any } = selectedMap as {
          [key: string]: any;
        };

        if (selectedMap === true) {
          if (unselectedMap) {
            unselectedMap = Object.assign({}, unselectedMap);
          }

          if (!selected && unselectedMap) {
            unselectedMap[id] = true;
            const totalCount = computedProps.paginationCount;

            if (Object.keys(unselectedMap).length === totalCount) {
              computedProps.deselectAll();
              return;
            }
          } else {
            if (unselectedMap) {
              delete unselectedMap[id];
            }
            if (
              getUnselectedCountFromProps(computedProps, unselectedMap) === 0
            ) {
              unselectedMap = null;
            }
          }
        } else {
          clone = Object.assign({}, selectedMap);
          if (
            computedProps.computedTreeEnabled &&
            computedProps.treeGridChildrenSelectionEnabled
          ) {
            const originalData: any = JSON.stringify(
              computedProps.originalData || []
            );
            const cloneOriginalData = [...JSON.parse(originalData)];
            const treeGridChildrenDeselectionEnabled =
              computedProps.treeGridChildrenDeselectionEnabled;
            treeGridChildrenSelection(
              cloneOriginalData,
              id,
              selected,
              clone,
              treeGridChildrenDeselectionEnabled
            );
          } else {
            if (selected) {
              clone[id] = data;
            } else {
              delete clone[id];
            }
          }
        }
        notifySelection(computedProps, clone, data, unselectedMap, queue);
      } else {
        notifySelection(computedProps, selected ? id : null, data, null, queue);
      }
    },
    []
  );

  return {
    selectAll,
    deselectAll,
    setRowSelected,
    setSelectedAt,
    setSelectedById,
    setCellSelection,
    computedCellSelection,
    computedCellSelectionEnabled,
    computedCellMultiSelectionEnabled,
    computedCellNavigationEnabled,
    computedActiveCell,
    getCellSelectionBetween,
    incrementActiveCell,
    cellDragStartRowIndex,
    setCellDragStartRowIndex,
    onCellEnter,
    onCellSelectionDraggerMouseDown,
    toggleActiveCellSelection,

    computedHasRowNavigation,
    computedRowSelectionEnabled,
    computedRowMultiSelectionEnabled,
    computedSelected,
    setSelected,
    computedUnselected,
    setUnselected,
    isSelectionEmpty,
    getSelectedMap,
    getUnselectedMap,
    isRowSelected,
    getUnselectedCount,
    getSelectedCount,
    computedUnselectedCount,
    computedSelectedCount,
    getCellSelectionIdKey,
    setActiveCell,
    getCellSelectionKey,
  };
};
