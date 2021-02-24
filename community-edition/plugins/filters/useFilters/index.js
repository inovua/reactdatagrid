/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useCallback, useMemo, useState, useRef, } from 'react';
import useProperty from '../../../hooks/useProperty';
import getFilterValueForColumns from '../../../hooks/useDataSource/getFilterValueForColumns';
import batchUpdate from '../../../utils/batchUpdate';
import mapColumns from '../../../mapColumns';
import { IS_MS_BROWSER } from '../../../common/ua';
import Menu from '../../../packages/Menu';
import renderGridMenu from '../../../renderGridMenu';
import React from 'react';
const emptyArray = [];
const COLUMN_MENU_ALIGN_POSITIONS = [
    'tl-bl',
    'tr-br',
    'tl-tr',
    'tr-tl',
    'br-tr',
    'bl-tl',
    'br-tl',
    'bl-tr',
    'lc-tr',
    'rc-tl',
];
const COLUMN_MENU_ALIGN_POSITIONS_RTL = [
    'tr-br',
    'tl-bl',
    'tr-tl',
    'tl-tr',
    'br-tr',
    'bl-tl',
    'br-tl',
    'bl-tr',
    'lc-tr',
    'rc-tl',
];
export const renderColumnFilterContextMenu = (computedProps, computedPropsRef) => {
    if (!computedProps) {
        return null;
    }
    const cellProps = computedProps.columnFilterContextMenuProps;
    if (!cellProps) {
        return null;
    }
    const filterValue = computedProps.computedFilterValueMap
        ? computedProps.computedFilterValueMap[cellProps.id]
        : null;
    if (!filterValue) {
        return null;
    }
    const columnOperators = computedProps.initialProps.filterTypes[filterValue.type].operators ||
        emptyArray;
    const selected = {
        operator: filterValue.operator,
    };
    const showEnableButton = filterValue.active === false;
    const filterType = computedProps.initialProps.filterTypes[filterValue.type];
    const isFiltered = computedProps.computedFiltered;
    const items = (() => {
        const activationItems = [
            '-',
            {
                label: computedProps.i18n('enable', 'Enable'),
                itemId: 'enableFilter',
                disabled: !showEnableButton,
                onClick: () => {
                    const newFilterValue = { ...filterValue, active: true };
                    const { current: computedProps } = computedPropsRef;
                    if (!computedProps) {
                        return;
                    }
                    computedProps.computedOnColumnFilterValueChange({
                        columnId: cellProps.id,
                        columnIndex: cellProps.computedVisibleIndex,
                        cellProps,
                        filterValue: newFilterValue,
                    });
                    computedProps.hideColumnFilterContextMenu();
                },
            },
            {
                label: computedProps.i18n('disable', 'Disable'),
                disabled: showEnableButton,
                itemId: 'disableFilter',
                onClick: () => {
                    const { current: computedProps } = computedPropsRef;
                    if (!computedProps) {
                        return;
                    }
                    const newFilterValue = { ...filterValue, active: false };
                    computedProps.computedOnColumnFilterValueChange({
                        columnId: cellProps.id,
                        cellProps,
                        columnIndex: cellProps.computedVisibleIndex,
                        filterValue: newFilterValue,
                    });
                    computedProps.hideColumnFilterContextMenu();
                },
            },
            '-',
            {
                label: computedProps.i18n('clear', 'Clear'),
                itemId: 'clearFilter',
                disabled: filterValue.value === filterType.emptyValue,
                onClick: () => {
                    const { current: computedProps } = computedPropsRef;
                    if (!computedProps) {
                        return;
                    }
                    computedProps.clearColumnFilter(cellProps.id);
                    computedProps.hideColumnFilterContextMenu();
                },
            },
            {
                label: computedProps.i18n('clearAll', 'Clear All'),
                itemId: 'clearAllFilters',
                disabled: !isFiltered,
                onClick: () => {
                    const { current: computedProps } = computedPropsRef;
                    if (!computedProps) {
                        return;
                    }
                    computedProps.clearAllFilters();
                    computedProps.hideColumnFilterContextMenu();
                },
            },
        ];
        const items = columnOperators.map(operator => {
            return {
                label: computedProps.i18n(operator.label, operator.label) ||
                    computedProps.i18n(operator.name, operator.name),
                name: 'operator',
                itemId: `operator-${operator.name}`,
                value: operator.name,
            };
        });
        items.push(...activationItems);
        return items;
    })();
    const onSelectionChange = selected => {
        const operator = selected.operator;
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const { filterTypes } = computedProps.initialProps;
        const filterTypeDescription = filterTypes[filterType.type] || {
            operators: [],
        };
        const operatorDescriptor = filterTypeDescription.operators.filter(op => op.name === operator)[0];
        const newFilterValue = { ...filterValue, operator };
        if (operatorDescriptor &&
            operatorDescriptor.valueOnOperatorSelect !== undefined) {
            newFilterValue.value = operatorDescriptor.valueOnOperatorSelect;
        }
        computedProps.computedOnColumnFilterValueChange({
            columnId: cellProps.id,
            cellProps,
            columnIndex: cellProps.computedVisibleIndex,
            filterValue: newFilterValue,
        });
        computedProps.hideColumnFilterContextMenu();
    };
    const rtl = computedProps.rtl;
    const menuProps = {
        autoFocus: true,
        items,
        theme: computedProps.theme,
        updatePositionOnScroll: computedProps.updateMenuPositionOnScroll,
        nativeScroll: !IS_MS_BROWSER,
        enableSelection: true,
        maxHeight: computedProps.columnFilterContextMenuConstrainTo
            ? null
            : computedProps.getMenuAvailableHeight(),
        style: {
            zIndex: 10000,
            position: computedProps.columnFilterContextMenuPosition || 'absolute',
        },
        selected,
        onSelectionChange,
        onDismiss: computedProps.hideColumnFilterContextMenu,
        constrainTo: computedProps.columnFilterContextMenuConstrainTo,
        alignPositions: computedProps.columnFilterContextMenuAlignPositions || rtl
            ? COLUMN_MENU_ALIGN_POSITIONS_RTL
            : COLUMN_MENU_ALIGN_POSITIONS,
        alignTo: computedProps.columnFilterContextMenuAlignToRef.current,
    };
    let result;
    if (computedProps.initialProps.renderColumnFilterContextMenu) {
        result = computedProps.initialProps.renderColumnFilterContextMenu(menuProps, {
            cellProps,
            grid: computedPropsRef,
            props: computedProps,
        });
    }
    if (result === undefined) {
        result = React.createElement(Menu, Object.assign({}, menuProps));
    }
    if (computedProps.initialProps.renderGridMenu) {
        return computedProps.initialProps.renderGridMenu(result, computedProps);
    }
    return renderGridMenu(result, computedProps);
};
const useFilterValue = (props, { columnsMap, enableFiltering, }, computedPropsRef) => {
    let [filterValue, doSetFilterValue] = useProperty(props, 'filterValue');
    filterValue = useMemo(() => {
        return getFilterValueForColumns(filterValue || [], columnsMap);
    }, [filterValue || [], columnsMap]);
    if (!filterValue.length) {
        filterValue = null;
    }
    const setFilterValue = useCallback((filterValue) => {
        const computedProps = computedPropsRef.current;
        if (!computedProps) {
            return;
        }
        filterValue = getFilterValueForColumns(filterValue, computedProps.columnsMap);
        const queue = batchUpdate();
        queue.commit(() => {
            computedProps.setLoadDataTrigger((loadDataTrigger) => [
                ...loadDataTrigger,
                'filterValue',
            ]);
            doSetFilterValue(filterValue);
        });
    }, [doSetFilterValue]);
    return [filterValue, setFilterValue];
};
const isFilterable = ({ enableFiltering, filterValue, }) => {
    if (enableFiltering !== undefined) {
        return enableFiltering;
    }
    if (!Array.isArray(filterValue) || !filterValue.length) {
        return false;
    }
    return true;
};
const useFilters = (props, computedProps, computedPropsRef) => {
    const [enableFiltering, setEnableFiltering] = useProperty(props, 'enableFiltering');
    const isColumnFiltered = useCallback((col) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return false;
        }
        const column = computedProps.getColumnBy(col);
        const filterValue = computedProps.getColumnFilterValue(col.id);
        if (!filterValue) {
            return false;
        }
        const filterType = computedProps.initialProps.filterTypes[filterValue.type];
        return filterValue.value !== filterType.emptyValue;
    }, []);
    const columnsMap = useMemo(() => {
        return mapColumns(props.columns, { showWarnings: false });
    }, [props.columns]);
    const [computedFilterValue, setFilterValue] = useFilterValue(props, {
        enableFiltering,
        columnsMap,
    }, computedPropsRef);
    const getMenuAvailableHeight = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return undefined;
        }
        let filtersHeight = 0;
        if (computedProps.computedFilterable) {
            const filterNode = computedProps
                .getDOMNode()
                .querySelector('.InovuaReactDataGrid__column-header__filter-wrapper');
            if (filterNode) {
                filtersHeight = filterNode.offsetHeight;
            }
        }
        return computedProps.size
            ? computedProps.size.height - 5 + filtersHeight
            : undefined;
    }, []);
    const clearAllFilters = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (!computedProps.computedFilterValueMap) {
            return;
        }
        const allFiltersValue = [];
        const headerCells = computedProps.getColumnLayout().getHeaderCells();
        computedProps.allColumns.forEach(column => {
            const filterValue = computedProps.computedFilterValueMap[column.id];
            if (!filterValue) {
                return;
            }
            const filterType = computedProps.initialProps.filterTypes[filterValue.type];
            const headerCell = headerCells[column.computedVisibleIndex];
            const newFilterValue = {
                ...filterValue,
                value: filterType.emptyValue,
            };
            if (headerCell && headerCell.filter) {
                headerCell.filter.setValue(newFilterValue.value);
            }
            allFiltersValue.push(newFilterValue);
        });
        setFilterValue(allFiltersValue);
    }, [setFilterValue]);
    const columnFilterContextMenuAlignToRef = useRef(null);
    const columnFilterContextMenuConstrainToRef = useRef(null);
    const [columnFilterContextMenuProps, setColumnFilterContextMenuProps,] = useState(null);
    const showColumnFilterContextMenu = useCallback((alignTo, cellProps) => {
        const { current: computedProps } = computedPropsRef;
        if (columnFilterContextMenuProps || !computedProps) {
            return;
        }
        columnFilterContextMenuAlignToRef.current = alignTo;
        columnFilterContextMenuConstrainToRef.current =
            computedProps.columnFilterContextMenuConstrainTo ||
                computedProps.getDOMNode();
        if (computedProps.hideColumnContextMenu) {
            computedProps.hideColumnContextMenu();
        }
        setColumnFilterContextMenuProps(cellProps);
    }, [setColumnFilterContextMenuProps]);
    const hideColumnFilterContextMenu = useCallback(() => {
        if (columnFilterContextMenuProps) {
            setColumnFilterContextMenuProps(null);
        }
    }, [columnFilterContextMenuProps]);
    const shouldShowFilteringMenuItems = useCallback(() => {
        if (props.showFilteringMenuItems) {
            return true;
        }
        if (computedFilterValue) {
            return true;
        }
        if (enableFiltering) {
            return true;
        }
        return false;
    }, [computedFilterValue, enableFiltering, props.showFilteringMenuItems]);
    const computedFilterValueMap = useMemo(() => {
        return computedFilterValue
            ? computedFilterValue.reduce((acc, columnFilterValue) => {
                acc[columnFilterValue.name] = columnFilterValue;
                return acc;
            }, {})
            : null;
    }, [computedFilterValue]);
    const computedOnColumnFilterValueChange = useCallback((columnFilterValue) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const { isBinaryOperator } = computedProps;
        if (computedProps.onColumnFilterValueChange) {
            computedProps.onColumnFilterValueChange(columnFilterValue);
        }
        const computedFilterValue = computedProps.computedFilterValue;
        const newFilterValue = (computedFilterValue || [])
            .map(oldFilterValue => {
            if (oldFilterValue.name === columnFilterValue.columnId) {
                const emptyValue = getColumnFilterEmptyValue(columnFilterValue.columnId);
                if (columnFilterValue.filterValue.type === 'date' ||
                    columnFilterValue.filterValue.type === 'number') {
                    if (isBinaryOperator(oldFilterValue.operator) &&
                        !isBinaryOperator(columnFilterValue.filterValue.operator)) {
                        return {
                            ...columnFilterValue.filterValue,
                            value: emptyValue,
                        };
                    }
                    if (!isBinaryOperator(oldFilterValue.operator) &&
                        isBinaryOperator(columnFilterValue.filterValue.operator)) {
                        return {
                            ...columnFilterValue.filterValue,
                            value: columnFilterValue.filterValue &&
                                columnFilterValue.filterValue.value != null &&
                                columnFilterValue.filterValue.value.start != null
                                ? columnFilterValue.filterValue.value
                                : {
                                    start: emptyValue,
                                    end: emptyValue,
                                },
                        };
                    }
                }
                return columnFilterValue.filterValue;
            }
            return oldFilterValue;
        })
            .filter(f => !!f);
        setFilterValue(newFilterValue);
    }, [setFilterValue]);
    const getColumnFilterValue = useCallback((column) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return null;
        }
        const col = computedProps.getColumnBy(column);
        if (!col) {
            return null;
        }
        if (!computedProps.computedFilterValueMap) {
            return null;
        }
        return computedProps.computedFilterValueMap[col.id];
    }, []);
    const setColumnFilterValue = useCallback((column, value, operator) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return null;
        }
        const filterValue = getColumnFilterValue(column);
        if (!filterValue) {
            return;
        }
        const newFilterValue = {
            ...filterValue,
            value,
        };
        if (operator) {
            newFilterValue.operator = operator;
        }
        const col = computedProps.getColumnBy(column);
        const headerCells = computedProps.getColumnLayout().getHeaderCells();
        const headerCell = headerCells[col.computedVisibleIndex];
        if (!headerCell || !headerCell.filter) {
            return;
        }
        computedProps.computedOnColumnFilterValueChange({
            columnId: col.id,
            columnIndex: col.computedVisibleIndex,
            filterValue: newFilterValue,
        });
        headerCell.filter.setValue(value);
    }, []);
    const getColumnFilterEmptyValue = useCallback((idNameOrIndex) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const col = computedProps.getColumnBy(idNameOrIndex);
        if (!col) {
            return;
        }
        if (!computedProps.computedFilterValueMap) {
            return;
        }
        const filterValue = computedProps.computedFilterValueMap[col.id];
        if (!filterValue) {
            return;
        }
        const filterType = computedProps.initialProps.filterTypes[filterValue.type];
        return filterType.emptyValue;
    }, []);
    const clearColumnFilter = useCallback((idNameOrIndex) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const col = computedProps.getColumnBy(idNameOrIndex);
        if (!col) {
            return;
        }
        computedProps.setColumnFilterValue(idNameOrIndex, getColumnFilterEmptyValue(idNameOrIndex));
    }, []);
    const isFiltered = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return false;
        }
        return (computedProps.computedFilterValue || []).reduce((result, filterValue) => {
            if (result) {
                return true;
            }
            const col = computedProps.getColumnBy(filterValue.name);
            if (col && isColumnFiltered(col)) {
                return true;
            }
            return false;
        }, false);
    }, []);
    const computedFiltered = isFiltered();
    return {
        clearColumnFilter,
        computedOnColumnFilterValueChange,
        computedFilterValueMap,
        computedFilterValue,
        computedFiltered,
        computedFilterable: isFilterable({
            enableFiltering,
            filterValue: computedFilterValue,
        }),
        setEnableFiltering,
        setFilterValue,
        getMenuAvailableHeight,
        showColumnFilterContextMenu,
        hideColumnFilterContextMenu,
        shouldShowFilteringMenuItems,
        renderColumnFilterContextMenu,
        columnFilterContextMenuProps,
        columnFilterContextMenuAlignToRef,
        clearAllFilters,
        getColumnFilterValue,
        setColumnFilterValue,
        isColumnFiltered,
    };
};
export default useFilters;
