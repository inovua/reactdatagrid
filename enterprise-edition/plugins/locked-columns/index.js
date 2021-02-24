/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { updateLockedWrapperPositions, getLockedEndWrapperTranslate, sumColumnWidth, } from './updateLockedWrapperPositions';
export default {
    name: 'locked-columns',
    hook: () => { },
    defaultProps: () => {
        return {
            updateLockedWrapperPositions,
        };
    },
    renderLockedStartCells: ({ lockedStartCount, isHeader, lockedStartColumns, virtualizeColumns, rtl, getScrollLeftMax, lockedStartContent, initialCells, sticky, scrollLeft, groupProps, expandGroupTitle, lockedEndColumns, nativeScroll, scrollbarWidth, virtualListBorderLeft, virtualListBorderRight, style, addTransitionDuration, lockedEndContent, hasRowDetails, initialRowHeight, rowHeight, lockedEndStartIndex, availableWidth, }) => {
        if (lockedStartCount) {
            const startOffset = isHeader ? virtualListBorderLeft : 0;
            const startWrapperWidth = lockedStartColumns.reduce(sumColumnWidth, 0);
            const startWrapperStyle = {
                width: startWrapperWidth,
                minWidth: startWrapperWidth,
                background: 'inherit',
            };
            if (style) {
                if (style.background) {
                    startWrapperStyle.background = style.background;
                }
                if (style.backgroundColor) {
                    startWrapperStyle.backgroundColor = style.backgroundColor;
                }
            }
            if (startOffset) {
                startWrapperStyle.paddingLeft = startOffset;
                startWrapperStyle.position = 'relative';
                startWrapperStyle.left = -startOffset;
            }
            if (virtualizeColumns) {
                startWrapperStyle.height = rowHeight;
                startWrapperStyle.position = 'absolute';
                startWrapperStyle.left = 0;
            }
            else {
                let transformStart = `translate3d(${rtl && getScrollLeftMax
                    ? -(getScrollLeftMax() - scrollLeft)
                    : scrollLeft}px, 0px, 0px)`;
                if (sticky) {
                    transformStart = 'translate3d(0px, 0px, 0px)';
                }
                startWrapperStyle.transform = transformStart;
            }
            const lockedStartInTransition = addTransitionDuration(lockedStartColumns, startWrapperStyle);
            return (React.createElement("div", { key: "lockedStartWrapper", className: `InovuaReactDataGrid__locked-start-wrapper ${lockedStartInTransition
                    ? 'InovuaReactDataGrid__locked-start-wrapper--transition'
                    : ''} ${sticky ? 'InovuaReactDataGrid__locked-start-wrapper--sticky' : ''} InovuaReactDataGrid__locked-start-wrapper--direction-${rtl ? 'rtl' : 'ltr'}`, style: startWrapperStyle }, lockedStartContent || initialCells.slice(0, lockedStartCount)));
        }
    },
    renderLockedEndCells: ({ rtl, scrollLeft, groupProps, expandGroupTitle, lockedEndColumns, nativeScroll, scrollbarWidth, isHeader, virtualListBorderLeft, virtualListBorderRight, sticky, style, addTransitionDuration, lockedEndContent, initialCells, hasRowDetails, initialRowHeight, lockedEndStartIndex, availableWidth, virtualizeColumns, }) => {
        const lockEndPosition = rtl
            ? scrollLeft
            : getLockedEndWrapperTranslate({
                lockedEndColumns,
                availableWidth,
                virtualizeColumns,
                virtualListBorderRight,
            }) + scrollLeft;
        const endWrapperWidth = groupProps && expandGroupTitle
            ? 0
            : lockedEndColumns.reduce(sumColumnWidth, 0) +
                (nativeScroll ? scrollbarWidth || 0 : 0) +
                (isHeader ? virtualListBorderLeft + virtualListBorderRight : 0);
        const endWrapperStyle = {
            width: endWrapperWidth,
            minWidth: endWrapperWidth,
            transform: `translate3d(${sticky ? 0 : lockEndPosition}px, 0px, 0px)`,
            position: 'absolute',
            left: 0,
            background: 'inherit',
            height: '100%',
        };
        if (style) {
            if (style.background) {
                endWrapperStyle.background = style.background;
            }
            if (style.backgroundColor) {
                endWrapperStyle.backgroundColor = style.backgroundColor;
            }
        }
        const lockedEndInTransition = addTransitionDuration(lockedEndColumns, endWrapperStyle);
        const lockEndActiveBorderDiv = (React.createElement("div", { key: "--active-borders", className: `InovuaReactDataGrid__row-active-borders` }));
        return (React.createElement("div", { key: "lockedEndWrapper", className: `InovuaReactDataGrid__locked-end-wrapper InovuaReactDataGrid__locked-end-wrapper--direction-${rtl ? 'rtl' : 'ltr'} ${sticky ? 'InovuaReactDataGrid__locked-end-wrapper--sticky' : ''} ${lockedEndInTransition
                ? 'InovuaReactDataGrid__locked-end-wrapper--transition'
                : ''}`, style: endWrapperStyle },
            lockedEndContent || initialCells.slice(lockedEndStartIndex),
            isHeader ? (hasRowDetails ? (React.createElement("div", { key: "--active-borders-header", className: `InovuaReactDataGrid__row-active-borders-wrapper`, style: {
                    height: initialRowHeight,
                    position: 'absolute',
                    width: '100%',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none',
                } }, lockEndActiveBorderDiv)) : (lockEndActiveBorderDiv)) : null));
    },
};
