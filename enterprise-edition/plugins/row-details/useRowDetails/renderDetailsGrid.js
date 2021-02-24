/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import { cloneElement } from 'react';
import renderGridMenu from '@inovua/reactdatagrid-community/renderGridMenu';
const callAll = (...fns) => (...args) => {
    fns.forEach(fn => {
        fn && fn(...args);
    });
};
export default (rowDetailsInfo, computedProps) => {
    const { detailsGridCacheKey, renderDetailsGrid } = computedProps;
    const info = computedProps.detailsGridInfoRef.current;
    info.masterDetailsInstances = info.masterDetailsInstances || {};
    info.masterDetailsKeys = info.masterDetailsKeys || {};
    info.unmountedDetails = info.unmountedDetails || {};
    info.masterDetailsCache = info.masterDetailsCache || {};
    info.originalDetailsGrids = info.originalDetailsGrids || {};
    let cachedGrid;
    let shouldUseCache;
    let cacheKey = rowDetailsInfo.id;
    if (detailsGridCacheKey) {
        if (detailsGridCacheKey === true) {
            cacheKey = rowDetailsInfo.id;
            shouldUseCache = true;
        }
        if (typeof detailsGridCacheKey === 'function') {
            shouldUseCache = true;
            cacheKey = detailsGridCacheKey(rowDetailsInfo);
        }
    }
    if (shouldUseCache) {
        cachedGrid = info.masterDetailsCache[cacheKey];
    }
    let detailsGridProps = {};
    const remount = info.unmountedDetails[cacheKey];
    if (remount) {
        detailsGridProps.initialState = remount.state;
        detailsGridProps.initialScrollTop = remount.scrollTop;
        detailsGridProps.initialScrollLeft = remount.scrollLeft;
        detailsGridProps.skipLoadOnMount = true;
        detailsGridProps.__selfAssign = remount.self;
    }
    detailsGridProps = {
        ...detailsGridProps,
        __parentRowInfo: rowDetailsInfo,
        menuPortalContainer: computedProps.initialProps.menuPortalContainer ||
            computedProps.getMenuPortalContainer(),
        renderInPortal: computedProps.renderInPortal,
        renderGridMenu: (menu, cProps) => {
            return renderGridMenu(menu, cProps, computedProps.menusRef);
        },
        onScroll: computedProps.onScroll,
        parentComputedProps: computedProps,
        licenseKey: computedProps.licenseKey,
        onUpdateRowHeights: computedProps.onDetailsUpdateRowHeights,
        onDidMount: computedProps.onDetailsDidMount,
        onWillUnmount: computedProps.onDetailsWillUnmount,
    };
    cachedGrid =
        cachedGrid || renderDetailsGrid(rowDetailsInfo, detailsGridProps);
    const oldKey = info.masterDetailsKeys[rowDetailsInfo.id];
    if (oldKey !== cacheKey && info.masterDetailsCache[oldKey] !== undefined) {
        // cleanup old cache
        delete info.masterDetailsCache[oldKey];
    }
    if (shouldUseCache) {
        info.masterDetailsKeys[rowDetailsInfo.id] = cacheKey;
        info.masterDetailsCache[cacheKey] = cachedGrid;
    }
    if (!computedProps.initialProps.growExpandHeightWithDetails) {
        return cachedGrid;
    }
    info.originalDetailsGrids[rowDetailsInfo.id] = cachedGrid;
    const clone = cloneElement(cachedGrid, {
        ...detailsGridProps,
        onUpdateRowHeights: cachedGrid.props.onUpdateRowHeights
            ? callAll(cachedGrid.props.onUpdateRowHeights, computedProps.onDetailsUpdateRowHeights)
            : computedProps.onDetailsUpdateRowHeights,
        onDidMount: cachedGrid.props.onDidMount
            ? callAll(cachedGrid.props.onDidMount, computedProps.onDetailsDidMount)
            : computedProps.onDetailsDidMount,
        onWillUnmount: cachedGrid.props.onWillUnmount
            ? callAll(cachedGrid.props.onWillUnmount, computedProps.onDetailsWillUnmount)
            : computedProps.onDetailsWillUnmount,
    });
    return clone;
};
