/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeComputedColumn } from '@inovua/reactdatagrid-community/types';

export const sumColumnWidth = (acc, c) => {
  return acc + (!c.hidden ? c.computedWidth : 0);
};

export const getLockedEndWrapperTranslate = ({
  virtualizeColumns,
  lockedEndColumns,
  availableWidth,
}: {
  virtualizeColumns: boolean;
  lockedEndColumns: TypeComputedColumn[];
  availableWidth: number;
}): number => {
  const computedWidthSum = lockedEndColumns.reduce(sumColumnWidth, 0);

  const offset = 0;
  let result = offset + availableWidth - computedWidthSum;
  const lastLocked = lockedEndColumns[lockedEndColumns.length - 1];
  const rightOffset = lastLocked.computedOffset + lastLocked.computedWidth;

  if (rightOffset <= availableWidth) {
    result = lockedEndColumns[0].computedOffset;
  }

  return result;
};

let IDS = 1;
export const updateLockedWrapperPositions = function(
  {
    computedRowExpandEnabled,
    computedStickyRows,
    computedFooterRows,
    computedLockedRows,
    rowDetailsWidth,
    lockedStartColumns,
    lockedEndColumns,
    virtualListBorderLeft,
    lockedRows,
    getScrollLeftMax,
    rtl,
  },
  scrollLeft,
  _
) {
  let node;
  try {
    node = this.getDOMNode();
  } catch (ex) {
    return;
  }

  let transformStartPos = scrollLeft;

  const scrollLeftMax = getScrollLeftMax();

  if (rtl) {
    transformStartPos = -(scrollLeftMax - scrollLeft);
  }
  const lockedStartTransform = `translate3d(${transformStartPos}px, 0px, 0px)`;

  if (computedRowExpandEnabled) {
    const rowContainer = node.querySelector(
      '.inovua-react-virtual-list__row-container'
    );

    if (rowContainer) {
      // we only need to match the rowdetails of the current grid,
      // not other nested row details of details grid
      // so we use :scope and direct children selector

      let dataId = rowContainer.getAttribute('data-id');
      if (!dataId) {
        dataId = Date.now() + IDS++;
        rowContainer.setAttribute('data-id', dataId);
      }
      const rowDetails = rowContainer.parentElement.querySelectorAll(
        `[data-id="${dataId}"] > .InovuaReactDataGrid__row > .InovuaReactDataGrid__row-details`
      );

      [].forEach.call(rowDetails, wrapper => {
        // we need [].forEach in order to support IE 11
        wrapper.style.transform =
          rowDetailsWidth !== 'min-viewport-width'
            ? lockedStartTransform
            : 'translate3d(0px, 0px, 0px)';
      });
    }
  }

  if (lockedRows && lockedRows.length) {
    const lockedRowsContainer = node.parentNode.querySelectorAll(
      '.InovuaReactDataGrid__locked-row'
    );
    const lockedRowsTransform = `translate3d(${-scrollLeft}px, 0px, 0px)`;
    [].forEach.call(lockedRowsContainer, el => {
      // we need [].forEach in order to support IE 11
      el.style.transform = lockedRowsTransform;
    });
  }

  if (lockedStartColumns && lockedStartColumns.length) {
    const nodesStart = node.querySelectorAll(
      '.InovuaReactDataGrid__locked-start-wrapper:not(.InovuaReactDataGrid__locked-start-wrapper--sticky)'
    );
    [].forEach.call(nodesStart, wrapper => {
      // we need [].forEach in order to support IE 11
      wrapper.style.transform = lockedStartTransform;
    });

    if (computedLockedRows && computedLockedRows.length) {
      // now select wrapper for locked start cells
      const lockedCellsStartRowsContainer = node.parentNode.querySelectorAll(
        '.InovuaReactDataGrid__locked-row-group--start'
      );
      [].forEach.call(lockedCellsStartRowsContainer, el => {
        el.style.transform = lockedStartTransform;
      });
    }

    if (computedFooterRows && computedFooterRows.length) {
      // now select wrapper for locked start cells
      const footerCellsStartRowsContainer = node.parentNode.parentNode.parentNode.querySelectorAll(
        '.InovuaReactDataGrid__footer-row-group--locked-start'
      );

      [].forEach.call(footerCellsStartRowsContainer, el => {
        el.style.transform = lockedStartTransform;
      });
    }

    if (computedLockedRows && computedLockedRows.length) {
      // now select wrapper for locked start cells
      const lockedRowsCellsStartRowsContainer = node.parentNode.querySelectorAll(
        '.InovuaReactDataGrid__locked-row-group--locked-start'
      );

      [].forEach.call(lockedRowsCellsStartRowsContainer, el => {
        el.style.transform = lockedStartTransform;
      });
    }
  }

  if (lockedEndColumns && lockedEndColumns.length) {
    let lockedEndPos;
    if (rtl) {
      lockedEndPos = scrollLeft;
    } else {
      lockedEndPos = getLockedEndWrapperTranslate(this.props) + scrollLeft;
    }
    const lockedEndTransform = `translate3d(${lockedEndPos}px, 0px, 0px)`;

    const nodesEnd = node.querySelectorAll(
      '.InovuaReactDataGrid__locked-end-wrapper:not(.InovuaReactDataGrid__locked-end-wrapper--sticky)'
    );
    [].forEach.call(nodesEnd, wrapper => {
      // we need [].forEach in order to support IE 11
      wrapper.style.transform = lockedEndTransform;
    });

    if (lockedRows && lockedRows.length) {
      // now select wrapper for locked start cells
      const lockedCellsEndRowsContainer = node.parentNode.querySelectorAll(
        '.InovuaReactDataGrid__locked-row-group--end'
      );
      [].forEach.call(lockedCellsEndRowsContainer, el => {
        el.style.transform = lockedEndTransform;
      });
    }

    if (computedFooterRows && computedFooterRows.length) {
      // now select wrapper for locked start cells
      const footerCellsStartRowsContainer = node.parentNode.parentNode.parentNode.querySelectorAll(
        '.InovuaReactDataGrid__footer-row-group--locked-end'
      );

      [].forEach.call(footerCellsStartRowsContainer, el => {
        el.style.transform = lockedEndTransform;
      });
    }

    if (computedLockedRows && computedLockedRows.length) {
      // now select wrapper for locked start cells
      const lockedRowCellsStartRowsContainer = node.parentNode.parentNode.querySelectorAll(
        '.InovuaReactDataGrid__locked-row-group--locked-end'
      );

      [].forEach.call(lockedRowCellsStartRowsContainer, el => {
        el.style.transform = lockedEndTransform;
      });
    }
  }

  if (computedStickyRows) {
    const stickyRowsContainer = node.querySelector(
      '.InovuaReactDataGrid__virtual-list-sticky-rows-container'
    );

    if (stickyRowsContainer) {
      stickyRowsContainer.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
    }
  }

  if (computedFooterRows && computedFooterRows.length) {
    const footerScroller = node.parentNode.parentNode.parentNode.querySelector(
      '.InovuaReactDataGrid__footer-rows-container-scroller'
    );

    if (footerScroller) {
      footerScroller.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
    }
  }
};
