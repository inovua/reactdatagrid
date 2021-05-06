/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import StringFilter from '../../../../StringFilter/StringFilter';

const filterWrapperClassName =
  'InovuaReactDataGrid__column-header__filter-wrapper';

class GenericFilter extends React.Component {
  constructor(props) {
    super(props);

    this.onFilterMenuOpen = this.onFilterMenuOpen.bind(this);
    this.onSettingsKeyDown = this.onSettingsKeyDown.bind(this);
    this.onSettingsClickListener = null;
    this.onSettingsKeyDownListener = null;

    this.refSettings = s => {
      /**
       * https://inovua.freshdesk.com/a/tickets/221
       * We need to attach mousedown/keydown here
       * because otherwise, if we go through the normal react flow,
       * by the time we click, the filter menu gets blurred, and is hidden
       * so the menu is shown again on click.
       * However, the correct behaviour is that the click
       * should toggle the visibility of the filter menu
       */
      if (s) {
        if (!this.onSettingsClickListener) {
          this.onSettingsClickListener = s.addEventListener(
            'mousedown',
            this.onFilterMenuOpen
          );
        }
        if (!this.onSettingsKeyDownListener) {
          this.onSettingsKeyDownListener = s.addEventListener(
            'keydown',
            this.onSettingsKeyDown
          );
        }
      } else {
        if (this.settings && this.onSettingsClickListener) {
          this.settings.removeEventListener(this.onSettingsClickListener);
        }
        if (this.settings && this.onSettingsKeyDownListener) {
          this.settings.removeEventListener(this.onSettingsKeyDownListener);
        }
      }
      this.settings = s;
    };

    this.ref = specificFilter => {
      this.specificFilter = specificFilter;
    };
  }

  onFilterMenuOpen() {
    this.props.cellInstance.showFilterContextMenu(this.settings);
    this.setState({
      focused: true,
    });
  }

  onSettingsKeyDown(e) {
    if (e.key === 'Enter') {
      this.onFilterMenuOpen();
    }
  }

  componentDidMount() {
    if (this.props.cellInstance) {
      this.props.cellInstance.filter = this;
    }
  }

  setValue(value) {
    if (this.specificFilter.setValue) {
      this.specificFilter.setValue(value);
    }
  }

  componentWillUnmount() {
    if (this.props.cellInstance) {
      this.props.cellInstance.filter = null;
    }
    if (this.settings && this.onSettingsClickListener) {
      this.settings.removeEventListener(this.onSettingsClickListener);
    }
    if (this.settings && this.onSettingsKeyDownListener) {
      this.settings.removeEventListener(this.onSettingsKeyDownListener);
    }
    this.onSettingsClickListener = null;
    this.onSettingsKeyDownListener = null;
    this.settings = null;
  }

  render() {
    const { props, cellInstance } = this.props;
    let filterValue = props.computedFilterValue;

    const active = filterValue ? filterValue.active !== false : false;

    const filterType = filterValue
      ? filterValue.type || props.filterType || props.type
      : props.filterType || props.type || 'string';

    if (filterValue && !filterValue.type) {
      filterValue = { ...filterValue, type: filterType };
    }

    let className = filterWrapperClassName;

    if (filterValue) {
      if (!active) {
        className += ` ${className}--disabled`;
      }
    }

    let settings;

    if (filterValue) {
      const settingsIconClassName =
        'InovuaReactDataGrid__column-header__filter-settings-icon';

      const settingsIcon =
        props.filterEditorProps && props.filterEditorProps.renderSettings ? (
          props.filterEditorProps.renderSettings({
            className: settingsIconClassName,
            filterValue,
          })
        ) : (
          <svg
            tabIndex={0}
            className={settingsIconClassName}
            width="14"
            height="14"
            viewBox="0 0 14 14"
          >
            <path
              fillRule="evenodd"
              d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
            />
          </svg>
        );

      settings = (
        <div
          className="InovuaReactDataGrid__column-header__filter-settings"
          ref={this.refSettings}
        >
          {settingsIcon}
        </div>
      );
    }

    if (!filterValue) {
      className += ` ${filterWrapperClassName}--empty`;
      return <div className={className} />;
    }

    const { filterTypes } = props;
    const filterTypeDescription = filterTypes[filterType] || { operators: [] };
    const operator = filterTypeDescription.operators.filter(
      op => op.name === filterValue.operator
    )[0];

    const operatorDisabled = operator && operator.disableFilterEditor;

    const filterProps = {
      i18n: props.i18n,
      rtl: props.rtl,
      nativeScroll: props.nativeScroll,
      filterDelay: props.filterDelay !== undefined ? props.filterDelay : 250,
      ...props.filterEditorProps,
      filterEditorProps: props.filterEditorProps,
      ref: this.ref,
      cellProps: props,
      renderInPortal: props.renderInPortal,
      cell: cellInstance,
      filterValue,
      emptyValue: filterTypeDescription.emptyValue,
      onChange: cellInstance.onFilterValueChange,
      active,
      disabled: !active || operatorDisabled,
      filterType,
      theme: props.theme,

      render: node => {
        return (
          <div className={className}>
            {node}
            {settings}
          </div>
        );
      },
    };

    const FilterEditor = props.filterEditor;
    if (FilterEditor && typeof FilterEditor != 'string') {
      return <FilterEditor {...filterProps} />;
    }

    if (props.renderFilterEditor) {
      return props.renderFilterEditor(filterProps, props, cellInstance);
    }

    return <StringFilter {...filterProps} />;
  }
}

export default (props, cellInstance) => {
  return (
    <GenericFilter
      key={`filter-${cellInstance.getProps().id}`}
      props={props}
      rtl={props.rtl}
      cellInstance={cellInstance}
    />
  );
};
