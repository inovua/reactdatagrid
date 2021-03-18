/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { CSSProperties } from 'react';

import debounce from '../packages/debounce';

import Combo from '../packages/ComboBox';
import ScrollContainer from '../packages/react-scroll-container-pro/src';

type TypeFilterValue = {
  name: string;
  operator: string;
  type: string;
  value: string | null;
  filterEditorProps?: any;
  dataSource?: any;
};

type SelectFilterProps = {
  filterValue?: TypeFilterValue;
  filterDelay?: number;
  onChange?: Function;
  readOnly?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  nativeScroll?: boolean;
  filterEditorProps?: any;
  rtl?: boolean;
  theme?: string;
  render?: Function;
};

type SelectFilterState = {
  value?: string | null;
};

type ComboProps = {
  value?: string | null;
  readOnly?: boolean;
  disabled?: boolean;
  theme?: string;
  rtl?: boolean;
  style?: CSSProperties;
};

const renderScroller = (props: any) => {
  delete props.tabIndex;
  return (
    <div
      {...props}
      className={`${props.className} InovuaReactDataGrid__column-header__filter--select__scroller`}
    />
  );
};
const renderListScroller = (props: any) => {
  return (
    <ScrollContainer
      {...props}
      applyCSSContainOnScroll={false}
      renderScroller={renderScroller}
      viewStyle={{ width: '100%' }}
    />
  );
};

const stopPropagation = (e: Event) => e.stopPropagation();

const defaultProps = {
  nativeScroll: false,
};

class SelectFilter extends React.Component<
  SelectFilterProps,
  SelectFilterState
> {
  static defaultProps = defaultProps;

  constructor(props: SelectFilterProps) {
    super(props);

    const { filterValue } = props;

    this.state = {
      value: filterValue ? filterValue.value || null : null,
    };
    this.onChange = this.onChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    if (props.filterDelay && props.filterDelay >= 1) {
      this.onValueChange = debounce(this.onValueChange, props.filterDelay);
    }
  }

  onChange(value: string | null) {
    this.onValueChange(value);

    this.setValue(value);
  }

  setValue(value: string | null) {
    this.setState({
      value,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: SelectFilterProps) {
    if (
      nextProps.filterValue &&
      nextProps.filterValue.value !== this.state.value
    ) {
      const value = nextProps.filterValue.value;
      this.setValue(value);
    }
  }

  onValueChange(value: string | null) {
    this.props.onChange &&
      this.props.onChange({
        ...this.props.filterValue,
        value,
      });
  }

  render() {
    let {
      filterValue,
      readOnly,
      disabled,
      style,
      nativeScroll,
      filterEditorProps,
      rtl,
      theme,
    } = this.props;

    const comboProps: ComboProps = {
      readOnly,
      disabled,
      theme,
      rtl,
      style: {
        minWidth: 0,
        ...style,
      },
    };

    if (filterValue) {
      comboProps.value = this.state.value;
    }

    const finalEditorProps =
      typeof filterEditorProps === 'function'
        ? filterEditorProps(this.props)
        : filterEditorProps;

    const finalProps = {
      collapseOnSelect: true,
      renderListScroller: nativeScroll ? undefined : renderListScroller,
      dataSource:
        filterValue && filterValue.dataSource ? filterValue.dataSource : [],
      ...finalEditorProps,
      onChange: this.onChange,

      className:
        'InovuaReactDataGrid__column-header__filter InovuaReactDataGrid__column-header__filter--select',
      ...comboProps,
    };

    const onKeyDown = finalProps.onKeyDown;

    finalProps.onKeyDown = (e: Event) => {
      if (onKeyDown) {
        onKeyDown(e);
      }

      stopPropagation(e);
    };

    return this.props.render && this.props.render(<Combo {...finalProps} />);
  }
}

export default SelectFilter;
