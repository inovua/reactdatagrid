/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import ComboBox from '../packages/ComboBox';
import ScrollContainer from '../packages/react-scroll-container-pro/src';

type SelectEditorProps = {
  editorProps?: any;
  nativeScroll?: boolean;
  value?: string;
  cellProps?: any;
  onChange?: (value: string) => void;
  onComplete?: Function;
  onTabNavigation?: Function;
  onCancel?: Function;
};

const stopPropagation = (e: Event) => e.stopPropagation();
const styleWidth100 = { width: '100%' };

const renderListScroller = (props: any) => (
  <ScrollContainer
    {...props}
    viewStyle={styleWidth100}
    onWheel={stopPropagation}
  />
);

const SelectEditor = (props: SelectEditorProps) => {
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
        onChange={(value: string) => {
          props.onChange && props.onChange(value);
        }}
        constrainTo=".InovuaReactDataGrid__virtual-list"
        style={{
          ...editorPropsStyle,
          minWidth: Math.max(0, props.cellProps.computedWidth - 30),
        }}
        onBlur={props.onComplete}
        onKeyDown={(e: any, combo: any) => {
          const { key } = e;

          if (key === 'Escape') {
            if (!combo.getExpanded()) {
              props.onCancel && props.onCancel(e);
            }
          }
          if (key === 'Enter') {
            props.onComplete && props.onComplete(e);
          }
          if (key == 'Tab') {
            e.preventDefault();
            props.onTabNavigation &&
              props.onTabNavigation(true, e.shiftKey ? -1 : 1);
          }
        }}
      />
    </div>
  );
};

export default SelectEditor;
