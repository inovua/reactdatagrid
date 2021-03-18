/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import NumericInput from '../packages/NumericInput';

type TypeFilterValue = {
  name: string;
  operator: string;
  type: string;
  value: string | null;
  filterEditorProps?: any;
};

type NumberEditorProps = {
  filterValue?: TypeFilterValue;
  filterDelay?: number;
  onChange?: Function;
  readOnly?: boolean;
  disabled?: boolean;
  theme?: string;
  i18n?: (key?: string, defaultLabel?: string) => void;
  filterEditorProps?: any;
  render?: Function;
  autoFocus?: boolean;
  value?: string;
  cellProps?: any;
  onComplete?: Function;
  onCancel?: Function;
  onTabNavigation?: Function;
};

const NumericEditor = (props: NumberEditorProps) => {
  return (
    <div
      className={
        'InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--number'
      }
    >
      <NumericInput
        autoFocus={props.autoFocus}
        defaultValue={props.value}
        onChange={props.onChange}
        theme={props.theme}
        style={{
          minWidth: Math.max(0, props.cellProps.computedWidth - 30),
        }}
        onBlur={props.onComplete}
        onKeyDown={(e: any) => {
          if (e.key === 'Escape') {
            props.onCancel && props.onCancel(e);
          }
          if (e.key === 'Enter') {
            props.onComplete && props.onComplete(e);
          }
          if (e.key == 'Tab') {
            props.onTabNavigation &&
              props.onTabNavigation(true, e.shiftKey ? -1 : 1);
          }
        }}
      />
    </div>
  );
};

export default NumericEditor;
