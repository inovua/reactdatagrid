/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactElement, RefObject } from 'react';
import PropTypes from 'prop-types';

import cleanProps from '@inovua/reactdatagrid-community/packages/react-clean-props';
import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';
import { CellProps } from '../Layout/ColumnLayout/Cell/CellProps';

type TypeFilterValue = {
  name: string;
  opertor: string;
  type: string;
  value: boolean | null;
};

type BoolEditorProps = {
  active?: boolean;
  cell?: CellProps;
  cellProps?: CellProps;
  disabled?: boolean;
  emptyValue?: boolean | null;
  filterDelay?: number;
  filterEditorProps?: any;
  filterType?: string;
  filterValue?: TypeFilterValue;
  i18n?: (key: string, defaultLabel: string) => void;
  nativeScroll?: boolean;
  onChange?: Function;
  render?: any;
  renderInPortal?: (el: ReactElement) => void;
  rtl?: boolean;
  theme?: string;
  ref?: RefObject<any>;
  readOnly?: boolean;
  autoFocus?: boolean;
  value?: boolean | null;
  onComplete?: Function;
  onTabNavigation?: Function;
};

const BoolEditor = (props: BoolEditorProps) => {
  console.log('props', props);
  const domProps = cleanProps(props, BoolEditor.propTypes);
  return (
    <div
      className={`InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--bool ${domProps.className ||
        ''}`}
      {...domProps}
    >
      <CheckBox
        theme={props.theme}
        autoFocus={props.autoFocus}
        defaultChecked={props.value}
        onChange={props.onChange}
        onBlur={props.onComplete}
        onKeyDown={(e: any) => {
          if (e.key == 'Tab') {
            e.preventDefault();
            props.onTabNavigation &&
              props.onTabNavigation(true, e.shiftKey ? -1 : 1);
          }
        }}
      />
    </div>
  );
};

BoolEditor.propTypes = {
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
  onKeyDown: PropTypes.func,
  onTabNavigation: PropTypes.func,
  value: PropTypes.any,
};

export default BoolEditor;
