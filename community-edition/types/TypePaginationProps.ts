/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type TypePaginationProps = {
  skip: number;
  limit: number;
  count: number;
  pagination: boolean;
  livePagination: boolean;
  remotePagination: boolean;
  localPagination: boolean;
  totalCount: number;
  gotoNextPage: () => void;
  reload: () => void;
  onRefresh: () => void;
  gotoPage: (page:number) => void;
  gotoFirstPage: () => void;
  gotoLastPage: () => void;
  gotoPrevPage: () => void;
  hasNextPage: () => boolean;
  hasPrevPage: () => boolean;
  onSkipChange: (skip: number) => void;
  onLimitChange: (limit: number) => void;
};

export default TypeErrorConstructor;
