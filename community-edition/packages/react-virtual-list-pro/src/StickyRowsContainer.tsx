/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useRef, useLayoutEffect, useState } from 'react';
import { sticky as stickyString } from '../../../packages/hasSticky';

import { TypeStickyRowInfo } from './TypeStickyRowInfo';
import RowHeightManager from './RowHeightManager';

export const StickyRowsContainerClassName =
  'InovuaReactDataGrid__virtual-list-sticky-rows-container';

type TypeProps = {
  handle: (...args: any[]) => void;
  rowHeightManager: RowHeightManager;
  rtl: boolean;
  stickyOffset: number;
};

const StickyRowsContainer = (props: TypeProps) => {
  const latestProps = useRef<TypeProps>(props);
  const [content, setContent] = useState<JSX.Element | null>(null);

  const currentHeightRef = useRef<number>(0);
  const domNodeRef = useRef<HTMLDivElement>(null);

  const nonEmptyRowElementsRefRef = useRef<any>(null);
  const rowElementsRef = useRef<any>(null);
  const renderedRowsRef = useRef<TypeStickyRowInfo[]>([]);
  const scrollTopRef = useRef<number>(0);

  latestProps.current = props;

  const setEnteringRow = ({
    scrollTop,
    enteringRow,
  }: {
    scrollTop: number;
    enteringRow: TypeStickyRowInfo;
  }) => {
    // if no entering row or scrolling back to top direction
    // we can cancel all transforms
    if (enteringRow == null) {
      scrollTopRef.current = scrollTop;
      const domNode: any = domNodeRef.current;
      [...domNode.children].forEach(rowNode => {
        rowNode.style.transform = `translate3d(0px, 0px, 0px)`;
      });

      return;
    }
    scrollTopRef.current = scrollTop;

    let rowsToTranslateIndexes: number[] = [];
    const rowsToTranslate = renderedRowsRef.current.filter((r, i) => {
      const result = r.scale >= enteringRow.scale;

      if (result) {
        rowsToTranslateIndexes.push(i);
      }
      return result;
    });

    rowsToTranslate.forEach((_rowToTranslate, i) => {
      const rowToTranslateIndex = rowsToTranslateIndexes[i];
      const domNode = domNodeRef.current;
      const rowNode: any = domNode!.children[rowToTranslateIndex];

      if (rowNode) {
        const y =
          props.rowHeightManager.getRowOffset(enteringRow.index) -
          scrollTop -
          currentHeightRef.current;

        rowNode.style.transform = `translate3d(0px, ${y}px, 0px)`;
      }
    });
  };

  const setStickyRows = (
    content: JSX.Element[],
    rows: TypeStickyRowInfo[],
    config: {
      enteringRow: TypeStickyRowInfo;
      scrollTop: number;
    }
  ) => {
    const domNode = domNodeRef.current;
    let renderedContent: any = content;

    if (content == null) {
      renderedContent = nonEmptyRowElementsRefRef.current;
      if (domNode && rowElementsRef.current) {
        domNode.style.opacity = '0';
        domNode.style.pointerEvents = 'none';
      }
    } else {
      if (domNode && !rowElementsRef.current) {
        domNode.style.opacity = '1';
        domNode.style.pointerEvents = 'all';
      }
    }

    setContent(renderedContent);

    if (content) {
      nonEmptyRowElementsRefRef.current = content;
    }

    renderedRowsRef.current = rows;
    rowElementsRef.current = content;

    setEnteringRow(config);
  };

  const getCurrentVisibleStickyRowsCount = (): number => {
    return rowElementsRef.current ? rowElementsRef.current.length : 0;
  };

  useLayoutEffect(() => {
    const domNode: any = domNodeRef.current;

    let totalHeight = 0;
    if (domNode && domNode.children) {
      // make top rows zIndex bigger, so
      //rows with a bigger scale will slide under those with a lesser scale
      // on scrolling
      [...domNode.children].forEach((c: HTMLDivElement, i: number) => {
        c.style.zIndex = `${1000 - i}`;
        totalHeight += c.offsetHeight;
      });

      currentHeightRef.current = totalHeight;
    }
  }, [content]);

  useLayoutEffect(() => {
    if (props.handle) {
      props.handle({
        setStickyRows,
        getCurrentVisibleStickyRowsCount,
        setEnteringRow,
      });
    }

    return () => {
      const props = latestProps.current;
      if (props && typeof props.handle === 'function') {
        props.handle(null);
      }
    };
  }, []);

  return (
    <div
      className={StickyRowsContainerClassName}
      ref={domNodeRef}
      style={
        {
          position: stickyString,
          top: 0,
          left: 0,
          right: 0,
          height: 0,
          zIndex: 1,
          contain: 'layout',
          [props.rtl ? 'transform' : '']: props.rtl
            ? `translate3d(${props.stickyOffset}px, 0px, 0px)`
            : '',
        } as any
      }
    >
      {content}
    </div>
  );
};

export default React.memo(StickyRowsContainer);
