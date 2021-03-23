/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactElement, RefObject } from 'react';

import CheckBox from '../packages/CheckBox';
import debounce from '../packages/debounce';
import { CellProps } from '../Layout/ColumnLayout/Cell/CellProps';

type TypeFilterValue = {
  name: string;
  opertor: string;
  type: string;
  value: boolean | null;
};

type BoolFilterProps = {
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
};

type BoolFilterState = {
  value?: boolean | null;
};

class BoolFilter extends React.Component<BoolFilterProps, BoolFilterState> {
  constructor(props: BoolFilterProps) {
    super(props);

    const { filterValue } = props;

    this.state = {
      value: filterValue ? filterValue.value : null,
    };

    this.onChange = this.onChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    if (props.filterDelay && props.filterDelay >= 1) {
      this.onValueChange = debounce(this.onValueChange, props.filterDelay, {
        leading: false,
        trailing: true,
      });
    }
  }

  onChange = (checked: boolean | null) => {
    this.onValueChange(checked);

    this.setValue(checked);
  };

  UNSAFE_componentWillReceiveProps = (nextProps: BoolFilterProps) => {
    if (
      nextProps.filterValue &&
      nextProps.filterValue.value !== this.state.value
    ) {
      const value = nextProps.filterValue.value;
      this.setValue(value);
    }
  };

  setValue = (checked: boolean | null) => {
    this.setState({
      value: checked,
    });
  };

  onValueChange = (checked: boolean | null) => {
    this.props.onChange &&
      this.props.onChange({
        ...this.props.filterValue,
        value: checked,
      });
  };

  render = () => {
    const { readOnly, filterEditorProps } = this.props;

    const finalEditorProps =
      typeof filterEditorProps === 'function'
        ? filterEditorProps(this.props)
        : filterEditorProps;

    return (
      this.props.render &&
      this.props.render(
        <CheckBox
          {...finalEditorProps}
          readOnly={readOnly}
          theme={this.props.theme}
          disabled={this.props.disabled}
          onChange={this.onChange}
          supportIndeterminate
          indeterminateValue={null}
          className="InovuaReactDataGrid__column-header__filter InovuaReactDataGrid__column-header__filter--bool"
          checked={this.state.value}
        />
      )
    );
  };
}

export default BoolFilter;
