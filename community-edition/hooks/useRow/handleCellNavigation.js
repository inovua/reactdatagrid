/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import throttle from 'lodash.throttle';
const waitFn = throttle;
const WAIT_TIME = 36;
const WAIT_PARAMS = { maxWait: 100, leading: true };
const handleCellNavigation = (event, computedProps) => {
    const { key } = event;
    const cellNavigationRef = computedProps.cellNavigationRef;
    if (!cellNavigationRef.current) {
        cellNavigationRef.current = {
            onArrowUp: () => {
                const computedProps = cellNavigationRef.current
                    .computedProps;
                if (computedProps.incrementActiveCell) {
                    computedProps.incrementActiveCell([-1, 0]);
                }
            },
            onArrowDown: () => {
                const computedProps = cellNavigationRef.current
                    .computedProps;
                if (computedProps.incrementActiveCell) {
                    computedProps.incrementActiveCell([1, 0]);
                }
            },
            onArrowRight: () => {
                const computedProps = cellNavigationRef.current
                    .computedProps;
                if (computedProps.incrementActiveCell) {
                    computedProps.incrementActiveCell([0, 1]);
                }
            },
            onArrowLeft: () => {
                const computedProps = cellNavigationRef.current
                    .computedProps;
                if (computedProps.incrementActiveCell) {
                    computedProps.incrementActiveCell([0, -1]);
                }
            },
            onHome: () => {
                const computedProps = cellNavigationRef.current
                    .computedProps;
                if (computedProps.setActiveCell && activeCell) {
                    computedProps.setActiveCell([0, activeCell[1]]);
                }
            },
            onEnd: () => {
                const computedProps = cellNavigationRef.current
                    .computedProps;
                if (computedProps.setActiveCell && activeCell) {
                    computedProps.setActiveCell([
                        computedProps.data.length - 1,
                        activeCell[1],
                    ]);
                }
            },
            onPageUp: () => {
                const computedProps = cellNavigationRef.current
                    .computedProps;
                if (computedProps.incrementActiveCell) {
                    computedProps.incrementActiveCell([-computedProps.keyPageStep, 0]);
                }
            },
            onPageDown: () => {
                const computedProps = cellNavigationRef.current
                    .computedProps;
                if (computedProps.incrementActiveCell) {
                    computedProps.incrementActiveCell([computedProps.keyPageStep, 0]);
                }
            },
            onEnter: () => {
                const computedProps = cellNavigationRef.current
                    .computedProps;
                if (computedProps.toggleActiveCellSelection) {
                    computedProps.toggleActiveCellSelection(event);
                }
            },
        };
        Object.keys(cellNavigationRef.current).forEach(key => {
            const fn = cellNavigationRef.current[key];
            cellNavigationRef.current[key] = waitFn(fn, WAIT_TIME, WAIT_PARAMS);
        });
    }
    cellNavigationRef.current.computedProps = computedProps;
    const activeCell = computedProps.computedActiveCell;
    const options = {
        ArrowUp: cellNavigationRef.current.onArrowUp,
        ArrowDown: cellNavigationRef.current.onArrowDown,
        ArrowRight: cellNavigationRef.current.onArrowRight,
        ArrowLeft: cellNavigationRef.current.onArrowLeft,
        Home: cellNavigationRef.current.onHome,
        End: cellNavigationRef.current.onEnd,
        PageUp: cellNavigationRef.current.onPageUp,
        PageDown: cellNavigationRef.current.onPageDown,
        Enter: cellNavigationRef.current.onEnter,
    };
    const fn = options[key];
    if (fn) {
        fn({
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
        });
        return true;
    }
    return false;
};
export default handleCellNavigation;
