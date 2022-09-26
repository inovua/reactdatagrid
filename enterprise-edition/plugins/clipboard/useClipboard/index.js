/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useRef } from 'react';
import renderClipboardContextMenu from './renderClipboardContextMenu';
const ROW_SEPARATOR = '\n';
const getClipboardSeparator = (computedProps) => {
    let clipboardSeparator = computedProps.clipboardSeparator || '\t';
    if (clipboardSeparator === ROW_SEPARATOR) {
        clipboardSeparator = '\t';
    }
    return clipboardSeparator;
};
const getCopySelectedCells = (rows, separator = '\t') => {
    const data = [];
    Object.keys(rows).map(r => {
        const row = rows[r];
        const newRow = [];
        Object.keys(row).map(key => {
            const cell = row[key];
            newRow.push(cell);
        });
        const stringRow = newRow.join(separator);
        data.push(stringRow);
    });
    return data.join(ROW_SEPARATOR);
};
const getPasteSelectedCellsDataFromCsv = (data, computedProps) => {
    const clipboardSeparator = getClipboardSeparator(computedProps);
    const [activeRow, activeColumn] = computedProps.computedActiveCell;
    const rows = data.split(ROW_SEPARATOR);
    const newData = [];
    const dataArray = rows.map((r, i) => {
        const row = {};
        const cells = r.split(clipboardSeparator);
        cells.map((c, j) => {
            const column = computedProps.getColumnBy(activeColumn + j);
            if (column) {
                const id = column.id;
                const computedColumn = { [id]: c };
                row[i] = Object.assign({}, row[i], computedColumn);
            }
        });
        newData.push(row[i]);
        const newIndex = activeRow + i;
        const newId = computedProps.getItemIdAt(newIndex);
        return Object.assign({}, { id: newId, ...row[i] });
    });
    return dataArray;
};
const getPasteSelectedCellsData = (data, computedProps) => {
    const parsedData = JSON.parse(data);
    const [activeRow, activeColumn] = computedProps.computedActiveCell;
    const dataArray = Object.keys(parsedData).map((key, index) => {
        const columns = {};
        const row = parsedData[key];
        Object.keys(row).map((columnKey, i) => {
            const column = computedProps.getColumnBy(activeColumn + i);
            if (column) {
                const id = column.id;
                const computedColumn = { [id]: row[columnKey] };
                columns[index] = Object.assign({}, columns[index], computedColumn);
            }
        });
        const newIndex = activeRow + index;
        const newId = computedProps.getItemIdAt(newIndex);
        return Object.assign({}, { id: newId, ...columns[index] });
    });
    return dataArray;
};
const useClipboard = (_props, computedProps, computedPropsRef) => {
    const clipboard = useRef(false);
    const preventBlurOnContextMenuOpen = useRef(false);
    if (!computedProps.enableClipboard) {
        return null;
    }
    const copySelectedRowsToClipboard = () => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps)
            return null;
        if (!computedProps.checkboxColumn)
            return null;
        const selectedRows = computedProps.computedSelected;
        if (selectedRows) {
            const rows = Object.keys(selectedRows).map(row => selectedRows[row]);
            console.log('selectedRows', rows);
        }
    };
    const pasteSelectedRowsFromClipboard = () => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps)
            return null;
    };
    const copyActiveRowToClipboard = () => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return null;
        }
        if (computedProps.computedCellSelection) {
            return null;
        }
        const activeRow = computedProps.getActiveItem();
        if (computedProps.onCopyActiveRowChange) {
            computedProps.onCopyActiveRowChange(activeRow);
        }
        const idProperty = computedProps.idProperty;
        const compoundIdProperty = idProperty.includes(computedProps.idPropertySeparator);
        if (activeRow && navigator.clipboard) {
            const clonedActiveRow = Object.assign({}, activeRow);
            if (compoundIdProperty) {
                const activeRowId = computedProps.getItemId(clonedActiveRow);
                const parts = idProperty.split(computedProps.idPropertySeparator);
                parts.reduce((itemObj, id) => {
                    if (activeRowId === itemObj[id]) {
                        if (itemObj) {
                            delete itemObj[id];
                        }
                    }
                    return itemObj[id];
                }, clonedActiveRow);
            }
            else {
                delete clonedActiveRow[idProperty];
            }
            const parsedActiveRow = JSON.stringify(clonedActiveRow);
            navigator.clipboard
                .writeText(parsedActiveRow)
                .then(() => {
                if (Object.keys(clonedActiveRow).length > 0) {
                    clipboard.current = true;
                }
            })
                .catch(e => console.warn(e));
        }
    };
    const pasteActiveRowFromClipboard = () => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return null;
        }
        if (computedProps.computedCellSelection) {
            return null;
        }
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(data => {
                const parsedData = JSON.parse(data);
                const activeIndex = computedProps.computedActiveIndex;
                if (computedProps.onPasteActiveRowChange) {
                    computedProps.onPasteActiveRowChange(parsedData);
                }
                if (activeIndex != null) {
                    computedProps.setItemAt(activeIndex, parsedData, {
                        replace: false,
                        deepCloning: true,
                    });
                }
            });
        }
    };
    const copySelectedCellsToClipboard = () => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return null;
        }
        if (!computedProps.computedCellSelection) {
            return null;
        }
        const selectedCells = computedProps.computedCellSelection;
        const data = computedProps.getData();
        const rows = {};
        Object.keys(selectedCells).map((key) => {
            const parsedKey = key.split(',');
            const parsedId = parsedKey[0];
            const rowId = parseInt(parsedId, 10);
            const id = isNaN(rowId) ? parsedId : rowId;
            const index = computedProps.getRowIndexById(id);
            const column = parsedKey[1];
            if (index !== undefined && column !== undefined) {
                const cellValue = data[index][column];
                rows[index] = Object.assign({}, rows[index], { [column]: cellValue });
            }
        });
        if (computedProps.onCopySelectedCellsChange) {
            computedProps.onCopySelectedCellsChange(rows);
        }
        if (!!rows && navigator.clipboard) {
            let parsedSelectedCells = '';
            if (computedProps.copySpreadsheetCompatibleString) {
                const clipboardSeparator = getClipboardSeparator(computedProps);
                parsedSelectedCells = getCopySelectedCells(rows, clipboardSeparator);
            }
            else {
                parsedSelectedCells = JSON.stringify(rows);
            }
            navigator.clipboard
                .writeText(parsedSelectedCells)
                .then(() => {
                if (Object.keys(rows).length > 0) {
                    clipboard.current = true;
                }
            })
                .catch(e => console.warn(e));
        }
    };
    const pasteSelectedCellsFromClipboard = () => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return null;
        }
        if (!computedProps.computedCellSelection) {
            return null;
        }
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(data => {
                let dataArray = [];
                if (computedProps.copySpreadsheetCompatibleString) {
                    dataArray =
                        getPasteSelectedCellsDataFromCsv(data, computedProps) || [];
                }
                else {
                    dataArray = getPasteSelectedCellsData(data, computedProps) || [];
                }
                if (computedProps.onPasteSelectedCellsChange) {
                    computedProps.onPasteSelectedCellsChange(dataArray);
                }
                computedProps.setItemsAt(dataArray, { replace: false });
            });
        }
    };
    const clipboardContextMenu = () => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return null;
        }
        if (computedProps.renderRowContextMenu) {
            return;
        }
        computedProps.initialProps.renderRowContextMenu = renderClipboardContextMenu;
    };
    clipboardContextMenu();
    return {
        copyActiveRowToClipboard,
        copySelectedRowsToClipboard,
        pasteActiveRowFromClipboard,
        pasteSelectedRowsFromClipboard,
        copySelectedCellsToClipboard,
        pasteSelectedCellsFromClipboard,
        clipboard,
        preventBlurOnContextMenuOpen,
    };
};
export { useClipboard };
