/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import PaginationToolbar from '../packages/PaginationToolbar';
import shouldComponentUpdate from '../packages/shouldComponentUpdate';
import ColumnLayout from './ColumnLayout';
import FakeFlex from '../FakeFlex';
import join from '../packages/join';
import { Consumer } from '../context';
const stopPropagation = e => e.stopPropagation();
class InovuaDataGridLayout extends Component {
    constructor(props) {
        super(props);
        this.getDOMNode = () => {
            return this.domNode;
        };
        this.renderPageList = list => {
            if (!createPortal) {
                return list;
            }
            return this.props.renderInPortal(list);
        };
        this.onRowMouseEnter = (event, rowProps) => {
            this.props.onRowMouseEnter(event, rowProps);
        };
        this.onRowMouseLeave = (event, rowProps) => {
            this.props.onRowMouseLeave(event, rowProps);
        };
        this.getVirtualList = () => {
            return this.columnLayout.getVirtualList();
        };
        this.getRenderRange = () => {
            return this.columnLayout.getRenderRange();
        };
        this.isRowFullyVisible = index => {
            return this.columnLayout.isRowFullyVisible(index);
        };
        this.getScrollLeft = () => {
            return this.columnLayout ? this.columnLayout.scrollLeft || 0 : 0;
        };
        this.setScrollLeft = scrollLeft => {
            if (this.columnLayout) {
                this.columnLayout.setScrollLeft(scrollLeft);
                if (this.dragHeader) {
                    this.dragHeader.setScrollLeft(scrollLeft);
                }
            }
        };
        this.getScrollTop = () => {
            return this.columnLayout ? this.columnLayout.scrollTop || 0 : 0;
        };
        this.ref = domNode => {
            this.domNode = domNode;
        };
        this.refColumnLayout = layout => {
            this.columnLayout = layout;
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shouldComponentUpdate(this, nextProps, nextState);
    }
    render() {
        const Footer = this.props.Footer;
        return (React.createElement(Consumer, null, computedProps => {
            const ColumnLayoutCmp = computedProps.ColumnLayout || ColumnLayout; // can be injected from enterprise edition
            return (React.createElement("div", { className: 'InovuaReactDataGrid__body', ref: this.ref },
                React.createElement(FakeFlex, { flexIndex: 0, getNode: this.getDOMNode, useNativeFlex: computedProps.useNativeFlex },
                    React.createElement(ColumnLayoutCmp, { key: "collayout", ref: this.refColumnLayout, rtl: computedProps.rtl, coverHandleRef: computedProps.coverHandleRef }),
                    this.renderPaginationToolbar(computedProps),
                    computedProps.computedFooterRows && Footer ? (React.createElement(Footer, { key: "footer", rows: computedProps.computedFooterRows })) : null)));
        }));
    }
    renderPaginationToolbar(computedProps) {
        const { pagination, paginationProps, i18n, theme, pageSizes, } = computedProps;
        if (!pagination) {
            return null;
        }
        if (!paginationProps || paginationProps.livePagination) {
            return null;
        }
        let result;
        if (computedProps.renderPaginationToolbar) {
            result = computedProps.renderPaginationToolbar(paginationProps);
        }
        const paginationToolbarProps = {
            perPageText: i18n('perPageText'),
            pageText: i18n('pageText'),
            ofText: i18n('ofText'),
            showingText: i18n('showingText'),
            rtl: computedProps.rtl,
            ...paginationProps,
            pageSizes,
            onClick: stopPropagation,
            theme,
            className: join(paginationProps.className, this.props.useNativeFlex ? 'InovuaReactDataGrid-modifier--relative' : ''),
        };
        paginationToolbarProps.bordered = false;
        delete paginationToolbarProps.livePagination;
        if (result === undefined) {
            result = (React.createElement(PaginationToolbar, Object.assign({ key: "paginationtoolbar" }, paginationToolbarProps, { constrainTo: this.props.constrainTo, renderPageList: this.renderPageList })));
        }
        return result;
    }
}
InovuaDataGridLayout.defaultProps = {
    defaultScrollTop: 0,
    onRowMouseEnter: () => { },
    onRowMouseLeave: () => { },
    rowPlaceholderDelay: 300,
};
InovuaDataGridLayout.propTypes = {
    i18n: PropTypes.func,
    shouldComponentUpdate: PropTypes.func,
    constrainTo: PropTypes.any,
    Footer: PropTypes.any,
    loading: PropTypes.bool,
    onScroll: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
};
export default InovuaDataGridLayout;
