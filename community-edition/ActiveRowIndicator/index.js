/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useLayoutEffect, useState, useEffect, } from 'react';
import join from '../packages/join';
import usePrevious from '../hooks/usePrevious';
import getScrollbarWidth from '../packages/getScrollbarWidth';
const CLASS_NAME = 'InovuaReactDataGrid__row';
const SCROLLBAR_WIDTH = getScrollbarWidth();
const RTL_OFFSET = SCROLLBAR_WIDTH || 17;
const ActiveRowIndicator = (props) => {
    const [offset, setOffset] = useState('');
    const [_scrollLeft, setScrollLeft] = useState(0);
    const { activeIndex, rtl, rtlOffset } = props;
    const oldActiveIndex = usePrevious(activeIndex, -1);
    const { instance: row = {} } = props.activeRowRef.current || {};
    const { hasBorderBottom, hasBorderTop } = row;
    const rowProps = row.props || {};
    const { groupColumn, data, depth, groupNestingSize } = rowProps;
    const deps = [
        activeIndex,
        rtlOffset,
        oldActiveIndex,
        props.dataSourceCount,
        props.computedExpandedRows,
        props.computedExpandedNodes,
        props.computedRowHeights,
        row,
    ];
    const updateLayout = (config) => {
        const node = (props.activeRowRef.current || { node: null }).node;
        const instance = (props.activeRowRef.current || { instance: null })
            .instance;
        if (!node || !node.parentNode || props.dataSourceCount < activeIndex) {
            return setOffset('');
        }
        if (instance && instance.props.rowIndex !== props.activeIndex) {
            // try again later,
            // since the row has not been updated yet
            requestAnimationFrame(() => updateLayout({ raf: false }));
            return;
        }
        const doSetOffset = (left, top) => setOffset(`translate3d(${left || 0}px, ${top}, 0px`);
        if (config && config.raf === false) {
            doSetOffset(rtl ? -RTL_OFFSET : 0, node.style.top);
        }
        else {
            requestAnimationFrame(() => {
                if (node && node.parentNode) {
                    doSetOffset(rtl ? -RTL_OFFSET : 0, node.style.top);
                }
            });
        }
    };
    useLayoutEffect(updateLayout, deps);
    useEffect(() => {
        if (props.handle) {
            props.handle({
                setScrollLeft,
            });
        }
        return () => {
            if (props.handle) {
                props.handle(null);
            }
        };
    }, [props.handle]);
    const groupDepth = groupColumn
        ? 0
        : data && data.__group
            ? data.depth - 1
            : data && data.__summary
                ? rowProps.summaryProps.depth
                : depth || 0;
    const scrollbarOffset = props.rtl ? RTL_OFFSET : 0;
    const left = (groupNestingSize || 0) * groupDepth;
    const style = {
        [rtl ? 'right' : 'left']: left - scrollbarOffset,
        width: props.width - left,
    };
    let transform;
    if (!offset) {
        style.opacity = 0;
    }
    else {
        style.willChange = 'transform';
        transform = offset;
        style.height = props.activeRowHeight;
    }
    if (transform) {
        style.transform = transform;
    }
    return (React.createElement("div", { key: "active-row-borders", className: join(`${CLASS_NAME}-active-borders`, offset != '' ? `${CLASS_NAME}-active-borders--active` : '', hasBorderTop && `${CLASS_NAME}-active-borders--has-border-top`, hasBorderBottom && `${CLASS_NAME}-active-borders--has-border-bottom`), style: style },
        React.createElement("div", { className: `${CLASS_NAME}-active-borders-inner` })));
};
export default ActiveRowIndicator;
