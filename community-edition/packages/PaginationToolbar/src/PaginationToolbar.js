/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import autoBind from '../../../packages/react-class/autoBind';

import NumericInput from '../../NumericInput';
import ComboBox from '../../ComboBox';
import ToolBar from '../../ToolBar';
import Separator from '../../ToolBar/Separator';
import cleanProps from '../../../packages/react-clean-props';

import shouldComponentUpdate from '../../../packages/shouldComponentUpdate';
import join from '../../../packages/join';

import PaginationIcon from './PaginationIcon';
import {
  FIRST_PAGE,
  LAST_PAGE,
  PREV_PAGE,
  NEXT_PAGE,
  REFRESH,
} from './getIcons';

const stopPropagation = e => e.stopPropagation();

const emptyObject = {};

const PAGE_SIZES = [
  { value: 5 },
  { value: 10 },
  { value: 20 },
  { value: 25 },
  { value: 40 },
  { value: 50 },
  { value: 100 },
];

const ICONS = { FIRST_PAGE, LAST_PAGE, PREV_PAGE, NEXT_PAGE, REFRESH };

const CLASS_NAME = 'inovua-react-pagination-toolbar';

const SPACER = <div className={`${CLASS_NAME}__spacer`} />;

export const getPageCount = ({ count, limit }) => Math.ceil(count / limit);
export const getSkipForPage = ({ page, limit }) =>
  Math.max(0, limit * (page - 1));
export const getCurrentPage = ({ skip, limit }) => Math.floor(skip / limit) + 1;

// it's 1 based
export const hasNextPage = ({ skip, limit, count }) =>
  getCurrentPage({ skip, limit }) < getPageCount({ count, limit });

export const hasPrevPage = ({ skip, limit }) =>
  getCurrentPage({ skip, limit }) > 1;

export default class InovuaPaginationToolbar extends React.Component {
  constructor(props) {
    super(props);

    autoBind(this);

    this.state = { skip: props.defaultSkip, limit: props.defaultLimit };

    this.ACTIONS = {
      REFRESH: this.refresh,
      FIRST_PAGE: this.gotoFirstPage,
      LAST_PAGE: this.gotoLastPage,
      PREV_PAGE: this.gotoPrevPage,
      NEXT_PAGE: this.gotoNextPage,
    };

    this.refNumberInput = cmp => {
      this.numberInput = cmp;
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldComponentUpdate(this, nextProps, nextState);
  }

  getSkip(props = this.props) {
    return props.skip === undefined ? this.state.skip : props.skip;
  }

  getLimit(props = this.props) {
    return props.limit === undefined ? this.state.limit : props.limit;
  }

  render() {
    const {
      totalCount,
      theme,
      rtl,
      remotePagination,
      showingCount,
      rootClassName,
      changeButtonStyles,
    } = this.props;

    const skip = this.getSkip();
    const limit = this.getLimit();

    const skipLimitCount = { skip, limit, count: totalCount };

    const currentPage = getCurrentPage(skipLimitCount);
    const pageCount = getPageCount(skipLimitCount);

    const firstPage = this.renderIcon('FIRST_PAGE', currentPage <= 1);
    const lastPage = this.renderIcon('LAST_PAGE', currentPage >= pageCount);
    const prevPage = this.renderIcon('PREV_PAGE', !hasPrevPage(skipLimitCount));
    const nextPage = this.renderIcon('NEXT_PAGE', !hasNextPage(skipLimitCount));

    const refresh = remotePagination ? this.renderIcon('REFRESH', false) : null;

    const start = totalCount ? skip + 1 : 0;
    const end = Math.min(
      skip + limit,
      remotePagination ? totalCount : showingCount
    );

    const className = join(
      this.props.className,
      CLASS_NAME,
      theme && `${CLASS_NAME}--theme-${theme}`,
      `${CLASS_NAME}--${rtl ? 'rtl' : 'ltr'}`,
      this.props.bordered && `${CLASS_NAME}--bordered`
    );

    const combo = this.renderPageSizeCombo();
    const currentPageInput = this.renderCurrentPageInput({
      pageCount,
      currentPage,
    });

    const domProps = {
      ...cleanProps(this.props, InovuaPaginationToolbar.propTypes),
      className,
      theme,
    };

    let result;

    if (this.props.renderToolbar) {
      result = this.props.renderToolbar(domProps, {
        gotoFirstPageIcon: firstPage,
        gotoLastPageIcon: lastPage,
        gotoPrevPageIcon: prevPage,
        gotoNextPageIcon: nextPage,
        refreshIcon: refresh,
        pageSizeCombo: combo,
        start,
        end,
        totalCount,
        currentPageInput,
      });

      if (result !== undefined) {
        return result;
      }
    }

    return (
      <ToolBar
        {...domProps}
        useTransformOnScroll={false}
        onKeyDown={stopPropagation}
        rtl={rtl}
      >
        <div className={`${CLASS_NAME}__region`}>
          {firstPage}
          {prevPage}
          <span className={`${CLASS_NAME}__page-text`}>
            {this.props.pageText}
          </span>{' '}
          {currentPageInput} {this.props.ofText}{' '}
          <span
            className={`${CLASS_NAME}__page-count-text`}
            style={{
              minWidth: Math.max(`${pageCount}`.length * 10, 25),
            }}
          >
            {' ' +
              (pageCount.toLocaleString
                ? pageCount.toLocaleString()
                : pageCount)}
          </span>
          {nextPage}
          {lastPage}
          <Separator />
          <span className={`${CLASS_NAME}__per-page-text`}>
            {this.props.pageSizes === false ? null : this.props.perPageText}
          </span>{' '}
          {combo}
          {this.props.pageSizes !== false && refresh ? <Separator /> : null}
          {refresh}
        </div>
        {SPACER}
        <div className={`${CLASS_NAME}__region`}>
          {this.props.showingText}{' '}
          {start.toLocaleString ? start.toLocaleString() : start} -{' '}
          {end.toLocaleString ? end.toLocaleString() : end} {this.props.ofText}{' '}
          {totalCount.toLocaleString ? totalCount.toLocaleString() : totalCount}
        </div>
      </ToolBar>
    );
  }

  renderCurrentPageInput({ pageCount, currentPage }) {
    const inputProps = {
      updateOnArrowKeys: false,
      className: `${CLASS_NAME}__current-page`,
      onBlur: this.onBlur,
      ref: this.refNumberInput,
      defaultValue: currentPage,
      currentPage,
      onChange: this.onNumberInputChange,
      enableClearButton: false,
      allowFloat: false,
      allowNegative: false,
      rtl: this.props.rtl,
      minValue: 1,
      maxValue: pageCount,
      style: { minWidth: 70 },
      size: `${pageCount}`.length,
      theme: this.props.theme,
    };

    let result;

    if (this.props.renderCurrentPageInput) {
      result = this.props.renderCurrentPageInput(inputProps);
    }
    if (result === undefined) {
      delete inputProps.currentPage;
      result = <NumericInput {...inputProps} />;
    }

    return result;
  }

  renderPageSizeCombo() {
    if (this.props.pageSizes === false) {
      return null;
    }

    const limit = this.getLimit();

    const comboProps = {
      shadow: false,
      style: { minWidth: 70, width: 70 },
      className: `${CLASS_NAME}__page-size-combo`,
      borderRadius: 0,
      idProperty: 'value',
      displayProperty: 'value',
      value: limit,
      renderListComponent: this.props.renderPageList,
      constrainTo: this.props.constrainTo,
      onChange: this.setPageSize,
      dataSource: this.props.pageSizes
        ? this.props.pageSizes.map(s => ({ value: s }))
        : PAGE_SIZES,
      collapseOnSelect: true,
      changeValueOnNavigation: false,
      multiple: false,
      searchable: false,
      clearIcon: false,
      shadow: true,
      rtl: this.props.rtl,
      showShadowOnMouseOver: true,
      allowSelectionToggle: false,
      highlightFirst: false,
      theme: this.props.theme,
    };

    let result;

    if (this.props.renderPageSizeCombo) {
      result = this.props.renderPageSizeCombo(comboProps);
    }

    if (result === undefined) {
      result = <ComboBox {...comboProps} relativeToViewport />;
    }

    return result;
  }

  renderIcon(name, disabled) {
    const icons = this.props.icons || ICONS;

    let icon = icons[name];

    if (this.props.rtl) {
      if (name === 'LAST_PAGE') {
        icon = icons['FIRST_PAGE'];
      } else if (name === 'FIRST_PAGE') {
        icon = icons['LAST_PAGE'];
      }

      if (name === 'NEXT_PAGE') {
        icon = icons['PREV_PAGE'];
      } else if (name === 'PREV_PAGE') {
        icon = icons['NEXT_PAGE'];
      }
    }

    const iconProps = {
      name,
      size: this.props.iconSize,
      icon,
      disabled,
      action: this.ACTIONS[name],
      theme: this.props.theme,
    };

    let result;

    if (this.props.renderIcon) {
      result = this.props.renderIcon(iconProps);
    }

    if (result === undefined) {
      result = <PaginationIcon {...iconProps} />;
    }

    return result;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const skip = this.getSkip();
    const limit = this.getLimit();
    const pageCount = getPageCount({ count: this.props.totalCount, limit });

    const currentPage = Math.min(pageCount, getCurrentPage({ skip, limit }));

    const nextSkip = this.getSkip(nextProps);
    const nextLimit = this.getLimit(nextProps);
    const nextPageCount = getPageCount({
      count: nextProps.totalCount,
      limit: nextLimit,
    });

    const nextCurrentPage = Math.min(
      nextPageCount,
      getCurrentPage({ skip: nextSkip, limit: nextLimit })
    );

    this.forceUpdate(() => {
      // this is after setState in order to protect against a scenario where
      // the nextCurrentPage would be less than the current maxPage and
      // the number input would not update if doesn't yet have new props
      // so we wait for it for new props & update the input using setValue
      if (currentPage != nextCurrentPage) {
        this.setCurrentPageInputValue(nextCurrentPage, nextProps);
      }
    });
  }

  setCurrentPageInputValue(value, props = this.props) {
    this.lastNotifiedSkip = getSkipForPage({
      page: value,
      limit: this.getLimit(props),
    });

    if (this.numberInput && typeof this.numberInput.setValue === 'function') {
      this.numberInput.setValue(`${value}`);
    }
  }

  onBlur() {
    const currentPage = getCurrentPage({
      skip: this.getSkip(),
      limit: this.getLimit(),
    });
    this.setCurrentPageInputValue(currentPage);
  }

  onNumberInputChange(numericValue) {
    this.gotoPage(numericValue || 1);
  }

  setPageSize(limit) {
    const currentSkip = this.getSkip();
    const currentPage = getCurrentPage({
      skip: currentSkip,
      limit: this.getLimit(),
    });

    const maxPage = getPageCount({ count: this.props.totalCount, limit });

    const newPage = Math.min(currentPage, maxPage);
    const newSkip = getSkipForPage({ page: newPage, limit });

    if (this.props.onPageSizeChange) {
      this.props.onPageSizeChange(limit);
    }

    if (this.props.onLimitChange) {
      this.props.onLimitChange(limit);
    }

    if (this.props.limit === undefined) {
      this.setState({ limit });
    }

    if (newSkip != currentSkip && this.props.adjustSkipOnLimitChange) {
      this.gotoPage(newPage, { limit });
    }
  }

  gotoPage(page, { limit = this.getLimit() } = emptyObject) {
    const skip = getSkipForPage({ page, limit });

    // in order to avoid page being adjusted twise by both icons click & number input onChange
    if (this.lastNotifiedSkip === skip) {
      return;
    }

    setTimeout(() => {
      delete this.lastNotifiedSkip;
    }, 50);

    this.lastNotifiedSkip = skip;

    if (this.props.onPageChange) {
      this.props.onPageChange(page);
    }

    if (this.props.onSkipChange) {
      this.props.onSkipChange(skip);
    }

    if (this.props.skip === undefined) {
      this.setCurrentPageInputValue(`${page}`);
      this.setState({ skip });
    }
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  gotoFirstPage() {
    this.gotoPage(1);
  }

  gotoLastPage() {
    const lastPage = getPageCount({
      count: this.props.totalCount,
      limit: this.getLimit(),
    });
    this.gotoPage(lastPage);
  }

  gotoNextPage() {
    const nextPage =
      getCurrentPage({
        skip: this.getSkip(),
        limit: this.getLimit(),
      }) + 1;

    this.gotoPage(nextPage);
  }

  gotoPrevPage() {
    const prevPage =
      getCurrentPage({
        skip: this.getSkip(),
        limit: this.getLimit(),
      }) - 1;

    this.gotoPage(prevPage);
  }
}

InovuaPaginationToolbar.defaultProps = {
  adjustSkipOnLimitChange: true,
  theme: 'default',
  bordered: true,
  iconSize: 24,
  rtl: false,
  remotePagination: false,
  pageText: 'Page ',
  ofText: ' of ',
  perPageText: 'Results per page',
  showingText: 'Showing ',
  rootClassName: 'inovua-react-pagination-toolbar',
};

InovuaPaginationToolbar.propTypes = {
  adjustSkipOnLimitChange: PropTypes.bool,
  pagination: PropTypes.any,
  bordered: PropTypes.bool,
  iconSize: PropTypes.number,
  pageText: PropTypes.node,
  ofText: PropTypes.node,
  perPageText: PropTypes.node,
  showingText: PropTypes.node,
  limit: PropTypes.number,
  defaultLimit: PropTypes.number,
  skip: PropTypes.number,
  defaultSkip: PropTypes.number,
  totalCount: PropTypes.number,
  gotoNextPage: PropTypes.func,
  gotoPrevPage: PropTypes.func,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  pageCount: PropTypes.number,
  onRefresh: PropTypes.func,
  hasNextPage: PropTypes.func,
  hasPrevPage: PropTypes.func,
  gotoLastPage: PropTypes.func,
  gotoFirstPage: PropTypes.func,
  remotePagination: PropTypes.bool,
  localPagination: PropTypes.any,
  renderPageList: PropTypes.any,
  reload: PropTypes.any,
  constrainTo: PropTypes.any,
  onPageChange: PropTypes.func,
  onSkipChange: PropTypes.func,
  onLimitChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  pageSizes: PropTypes.arrayOf(PropTypes.number),
  renderCurrentPageInput: PropTypes.func,
  rootClassName: PropTypes.string,
  renderIcon: PropTypes.func,
  renderPageSizeCombo: PropTypes.func,
  renderToolbar: PropTypes.func,
  rtl: PropTypes.bool,
  theme: PropTypes.string,
};
