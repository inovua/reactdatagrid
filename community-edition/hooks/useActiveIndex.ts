/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useProperty from './useProperty';
import { TypeDataGridProps, TypeComputedProps } from '../types';
import { MutableRefObject, useEffect, useRef } from 'react';
import clamp from '../utils/clamp';
import usePrevious from './usePrevious';

const useActiveIndex = (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
): {
  computedActiveIndex: number;
  getActiveItem: () => any;
  getFirstVisibleIndex: () => number;
  setActiveIndex: (activeIndex: number) => void;
  incrementActiveIndex: (activeIndex: number) => void;
} => {
  let [computedActiveIndex, doSetActiveIndex] = useProperty<number>(
    props,
    'activeIndex',
    -1
  );

  if (!props.enableKeyboardNavigation) {
    computedActiveIndex = -1;
  }

  const setActiveIndex = (activeIndex: number): void => {
    const computedProps = computedPropsRef.current;
    if (
      !computedProps ||
      !computedProps.computedHasRowNavigation ||
      global.isNaN(activeIndex)
    ) {
      return;
    }
    const { data } = computedProps;

    activeIndex = clamp(activeIndex, 0, data.length - 1);

    if (activeIndex === computedActiveIndex) {
      return;
    }
    doSetActiveIndex(activeIndex);
  };

  const incrementActiveIndex = (inc: number) => {
    setActiveIndex(computedActiveIndex + inc);
  };

  const getActiveItem = (): any => {
    const computedProps = computedPropsRef.current;

    return computedProps
      ? computedProps.data[computedProps.computedActiveIndex]
      : null;
  };

  const getFirstVisibleIndex = (): number => {
    const computedProps = computedPropsRef.current;
    if (!computedProps) {
      return -1;
    }
    const scrollTop = computedProps.getScrollTop();
    return Math.ceil(scrollTop / props.rowHeight);
  };

  const oldActiveIndex = usePrevious<number>(computedActiveIndex, -1);

  useEffect(() => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }

    if (oldActiveIndex !== computedActiveIndex) {
      const top = computedActiveIndex < oldActiveIndex;

      computedProps.scrollToIndexIfNeeded(computedActiveIndex, { top });
    }
  }, [computedActiveIndex, oldActiveIndex]);

  computedProps.activeRowRef = useRef<{
    instance: any;
    node: HTMLElement;
  } | null>(null);

  return {
    computedActiveIndex,
    setActiveIndex,
    incrementActiveIndex,
    getActiveItem,
    getFirstVisibleIndex,
  };
};

export default useActiveIndex;
