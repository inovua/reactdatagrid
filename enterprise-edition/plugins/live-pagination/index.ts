/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MutableRefObject, useEffect, useRef, useCallback } from 'react';
import { TypeComputedProps, TypeDataGridProps } from '../../types';
import { isLivePagination } from '@inovua/reactdatagrid-community/hooks/useDataSource';

const hook = (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps>
) => {
  const rafId: any = useRef(null);

  const hasVerticalScrollbar = useCallback((): boolean => {
    const computedProps = computedPropsRef.current;
    if (!computedProps) {
      return false;
    }

    const scrollContainer = computedProps.getVirtualList().scrollContainer;

    const result = scrollContainer
      ? scrollContainer.hasVerticalScrollbar()
      : false;

    return result;
  }, []);

  const loadNextPageWhileNoScrollbar = () => {
    const { current: computedProps } = computedPropsRef;

    if (!computedProps) {
      return;
    }

    const props = computedProps.initialProps;

    if (Array.isArray(props.dataSource)) {
      return;
    }

    if (
      isLivePagination(props) &&
      computedProps.hasNextPage() &&
      !hasVerticalScrollbar()
    ) {
      const loadNextDelay = computedProps.livePaginationLoadNextDelay;
      if (loadNextDelay === false) {
        if (computedProps.dataPromiseRef.current) {
          computedProps.dataPromiseRef.current.then(() => {
            if (!hasVerticalScrollbar()) {
              computedProps.gotoNextPage({ append: true });
            }
          });
        }
        return;
      }

      const delay =
        loadNextDelay === true ? computedProps.checkResizeDelay : loadNextDelay;

      if (typeof delay == 'number') {
        setTimeout(() => {
          if (Array.isArray(computedPropsRef.current.dataSource)) {
            return;
          }
          if (computedProps.dataPromiseRef.current) {
            computedProps.dataPromiseRef.current.then(() => {
              if (!hasVerticalScrollbar()) {
                computedProps.gotoNextPage({ append: true });
              }
            });
          }
        }, delay);
      }
    }
  };

  useEffect(() => {
    if (!computedPropsRef.current.computedLivePagination) {
      return;
    }

    if (!computedPropsRef.current.computedLoading) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }

      rafId.current = requestAnimationFrame(() => {
        const lastId = (rafId.current = requestAnimationFrame(() => {
          if (
            !computedPropsRef.current.computedLoading &&
            rafId.current === lastId
          ) {
            loadNextPageWhileNoScrollbar();
          }
        }));
      });
    }
  });

  return {};
};

export default {
  name: 'live-pagination',
  hook,
  defaultProps: () => {
    return {};
  },
};
