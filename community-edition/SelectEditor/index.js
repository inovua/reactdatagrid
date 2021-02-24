/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import ComboBox from '../packages/ComboBox';
import ScrollContainer from '../packages/react-scroll-container-pro/src';

const stopPropagation = e => e.stopPropagation();
const styleWidth100 = { width: '100%' };

const renderListScroller = props => (
  <ScrollContainer
    {...props}
    viewStyle={styleWidth100}
    onWheel={stopPropagation}
  />
);

export default props => {
  const { editorProps } = props;
  const editorPropsStyle = editorProps ? editorProps.style : null;

  return (
    <div
      className={
        'InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--select'
      }
    >
      <ComboBox
        {...editorProps}
        collapseOnSelect
        renderListScroller={props.nativeScroll ? undefined : renderListScroller}
        defaultValue={props.value}
        onChange={value => {
          props.onChange(value);
        }}
        constrainTo=".InovuaReactDataGrid__virtual-list"
        style={{
          ...editorPropsStyle,
          minWidth: Math.max(0, props.cellProps.computedWidth - 30),
        }}
        onBlur={props.onComplete}
        onKeyDown={(e, combo) => {
          const { key } = e;

          if (key === 'Escape') {
            if (!combo.getExpanded()) {
              props.onCancel(e);
            }
          }
          if (key === 'Enter') {
            props.onComplete(e);
          }
          if (key == 'Tab') {
            e.preventDefault();
            props.onTabNavigation(true, e.shiftKey ? -1 : 1);
          }
        }}
      />
    </div>
  );
};
