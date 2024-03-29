/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReactNode } from 'react';

export type TypePaginationProps = {
  skip: number;
  limit: number;
  count: number;
  pagination: boolean;
  livePagination?: boolean;
  remotePagination: boolean;
  localPagination: boolean;
  totalCount: number;
  pageSizes?: number[];
  gotoNextPage: () => void;
  reload: () => void;
  onRefresh: () => void;
  gotoFirstPage: () => void;
  gotoLastPage: () => void;
  gotoPrevPage: () => void;
  hasNextPage: () => boolean;
  hasPrevPage: () => boolean;
  onSkipChange: (skip: number) => void;
  onLimitChange: (limit: number) => void;
  gotoPage: (page: number, config?: { force: boolean }) => void;
  onClick?: any;
  theme?: string;
  className?: string;
  perPageText?: ReactNode;
  pageText?: ReactNode;
  ofText?: ReactNode;
  showingText?: ReactNode;
  rtl?: boolean;
  bordered?: boolean;
};

export default TypeErrorConstructor;
