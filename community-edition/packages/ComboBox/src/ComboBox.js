/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '../../../common/cleanProps';
import { NotifyResize } from '../../NotifyResize';
import throttle from '../../../common/throttle';
import containsNode from '../../../common/containsNode';

import TextInput from './TextInput';
import Value from './Value';
import ClearButton from './ClearButton';
import ToggleButton from './ToggleButton';
import List from './List';
import { LoadingIcon } from './Icons';

import shouldComponentUpdate from './utils/shouldComponentUpdate';
import getRootClassName from './utils/getRootClassName';
import getListProps from './utils/getListProps';
import getValueProps from './utils/getValueProps';
import getDataProp from './utils/getDataProp';
import getNewMultipleValue from './utils/getNewMultipleValue';
import getNewSingleValue from './utils/getNewSingleValue';
import findItemIndex from './utils/findItemIndex';
import filterByValue from './utils/filterByValue';
import filterByText from './utils/filterByText';
import deselectValue from './utils/deselectValue';
import getNewActiveTagOnRemove from './utils/getNewActiveTagOnRemove';
import getNextItem from './utils/getNextItem';
import groupItems from './utils/groupItems';
import getValueMap from './utils/getValueMap';
import getGroups from './utils/getGroups';

import registerHideOnClickOutsideEventListener from '../../../common/registerHideOnClickOutsideEventListener';

import {
  getPageCount,
  getSkipForPage,
  getCurrentPage,
} from '../../PaginationToolbar';

const REMAINING_ITEMS = 'REMAINING_ITEMS';

const emptyObject = {};

class InovuaComboBox extends Component {
  constructor(props) {
    super(props);

    this.refTools = tools => {
      this.toolsNode = tools;
    };

    this.state = {
      loading:
        props.defaultLoading || !!(props.dataSource && props.dataSource.then),
      value: props.defaultValue,
      /**
       * It holds items about the value.
       * This is usefull when the selected value
       * is no longer presnet inside the datasource.
       */
      valueMap: {},
      text: props.defaultText,
      activeTag: props.defaultActiveTag,
      activeItem:
        props.defaultActiveItem || (!props.multiple && props.defaultValue),
      expanded: props.defaultExpanded,
      toolsSize: { width: 0, height: 0 },
      over: false,
      focus: false,
    };

    this.getData = this.getData.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextInputClick = this.handleTextInputClick.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.handleComboClick = this.handleComboClick.bind(this);
    this.handleComboKeyDown = this.handleComboKeyDown.bind(this);
    this.handleComboFocus = this.handleComboFocus.bind(this);
    this.handleComboBlur = this.handleComboBlur.bind(this);
    this.getComboNode = this.getComboNode.bind(this);
    this.clear = this.clear.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.handleToolsSize = this.handleToolsSize.bind(this);
    this.handleRemoveMultipleTag = this.handleRemoveMultipleTag.bind(this);
    this.handleListScrollBottom = this.handleListScrollBottom.bind(this);

    this.handleDelete = this.handleDelete.bind(this);
    this.getListNode = this.getListNode.bind(this);

    this.updateGetIdProperty();
    this.updateGetDisplayProperty();
    this.updateGetFilterProperty();

    this.addTextInputRef = ref => {
      this.textInput = ref;
    };
    this.addRootRef = ref => {
      this.comboNode = ref;
    };
    this.addListRef = ref => {
      this.listNode = ref;
    };

    /**
     * setActiveItem can be slow when holding arrow up or down pressed
     */
    this.setActiveItem = throttle(this.setActiveItem, 16);
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.focus();
    }

    if (this.state.activeItem && this.state.activeItemIndex == null) {
      this.setState({
        activeItemIndex: this.getItemIndexById(this.state.activeItem),
      });
    }

    if (!this.isRemoteFilter()) {
      this.doFilter();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldComponentUpdate(this, nextProps, nextState);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.loadDataSource(nextProps.dataSource, nextProps);
    }

    if (this.props.idProperty !== nextProps.idProperty) {
      this.updateGetIdProperty();
    }

    if (this.props.displayProperty !== nextProps.displayProperty) {
      this.updateGetDisplayProperty();
    }

    if (this.props.filterProperty !== nextProps.filterProperty) {
      this.updateGetFilterProperty();
    }

    if (
      this.isExpandedControlled() &&
      this.props.expanded !== nextProps.expanded
    ) {
      this.onExpand();
    }

    if (this.props.groupProperty !== nextProps.groupProperty) {
      this.updateGroups({ groupProperty: nextProps.groupProperty });
    }

    if (
      this.isActiveItemControlled() &&
      this.props.changeValueOnNavigation &&
      !this.props.multiple &&
      this.props.activeItem !== nextProps.activeItem
    ) {
      this.setValue(nextProps.activeItem, { action: 'navigate' });
    }

    if (
      this.isExpandedControlled() &&
      !this.props.expanded &&
      nextProps.expanded
    ) {
      this.loadLazyDataSource({ action: 'expand', text: '' });
    }

    /**
     * if text is controlled, and it changed
     * do text change specific operations
     */
    if (this.isTextControled() && this.props.text !== nextProps.text) {
      this.onTextUpdate(nextProps.text);
    }
  }

  UNSAFE_componentWillMount() {
    if (!this.props.lazyDataSource) {
      this.loadDataSource(this.props.dataSource);
    }
  }

  render() {
    const { props, state } = this;

    /**
     * Input must be declared here because
     * it can be rendered inside Value or inside List
     * depeinding on it's position
     */
    const textInput = this.renderTextInput();

    const className = getRootClassName({
      props,
      state,
      computed: {
        value: this.getValue(),
      },
    });
    const expanded = this.getExpanded();

    // items, related to tags
    const items = this.getSelectedItems();
    const groupedItems = (this.groupedItems = this.getGroupedItems(
      this.getSelectedItems()
    ));

    this.areItemsGrouped =
      this.groupedItems &&
      this.groupedItems.remainingItems &&
      this.groupedItems.remainingItems.length;

    const style = this.getRootStyle();

    const filteredData = this.getFilteredData();
    const text = this.getText();
    this.isNewCustomTagValid =
      (!filteredData || filteredData.length === 0) &&
      !!text &&
      props.allowCustomTagCreation;

    return (
      <div
        {...cleanProps(props, InovuaComboBox.propTypes)}
        onClick={this.handleComboClick}
        onMouseDown={this.handleComboMouseDown}
        onKeyDown={this.handleComboKeyDown}
        onFocus={this.handleComboFocus}
        onBlur={this.handleComboBlur}
        className={className}
        style={style}
        ref={this.addRootRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Value
          {...this.getValueProps({ items, groupedItems })}
          textInput={textInput}
          toolsSize={state.toolsSize}
        />
        <div className={`${props.rootClassName}__tools`} ref={this.refTools}>
          {this.renderSpinner()}
          {this.renderClearIcon()}
          {this.renderToggleIcon()}
          {// only render notify resize if tags have ellipsis
          this.props.tagEllipsis && (
            <NotifyResize notifyOnMount onResize={this.handleToolsSize} />
          )}
        </div>
        {expanded && this.renderList()}
      </div>
    );
  }

  getRootStyle() {
    const { props, state } = this;
    let style = {
      ...props.style,
    };

    if (props.borderRadius) {
      style.borderRadius = props.borderRadius;
    }
    if (props.padding) {
      style.padding = props.padding;
    }
    if (props.border) {
      style.border = props.border;
    }
    if (props.background) {
      style.background = props.background;
    }
    if (!this.getValue() && props.emptyStyle) {
      style = {
        ...style,
        ...props.emptyStyle,
      };
    }
    if (props.disabledStyle && props.disabled) {
      style = {
        ...style,
        ...props.disabledStyle,
      };
    }
    if (state.focus && props.focusedStyle) {
      style = {
        ...style,
        ...props.focusedStyle,
      };
    }

    return style;
  }

  renderList() {
    const listProps = this.getListProps();

    let result;
    if (typeof this.props.renderList === 'function') {
      result = this.props.renderList({
        domProps: listProps,
        items: this.getFilteredData(),
      });
    }

    if (result === undefined) {
      result = <List {...listProps} />;
    }

    if (typeof this.props.renderListComponent === 'function') {
      const res = this.props.renderListComponent(result);

      if (typeof res !== undefined) {
        return res;
      }
      result = res;
    }

    return result;
  }

  renderClearIcon() {
    const { props, state } = this;
    const { searchable } = props;
    const text = this.getText();
    const value = this.getValue();

    let showClearIcon = (text || value != null) && props.clearIcon;

    if (props.showClearIconOnMouseOver) {
      if (!state.over) {
        showClearIcon = false;
      }
    }
    if (searchable === false) {
      showClearIcon = false;
    }
    if (!showClearIcon) {
      return null;
    }

    const clearButton = (
      <ClearButton
        onClear={this.clear}
        closeIcon={props.clearIcon}
        className={`${props.rootClassName}__clear-icon`}
      />
    );

    return clearButton;
  }

  renderToggleIcon() {
    const { props } = this;

    if (!props.toggleIcon) {
      return null;
    }

    return (
      <ToggleButton
        onToggle={this.toggleExpand}
        className={`${props.rootClassName}__toggle-icon`}
        toggleIcon={props.toggleIcon}
        expanded={this.getExpanded()}
      />
    );
  }

  // renders
  renderTextInput() {
    if (this.props.disabled) {
      return null;
    }

    const text = this.getText();
    let value = text;

    if (!this.props.multiple) {
      if (text == null) {
        value = this.getValue() == null ? '' : this.getItemLabel();
      } else {
        value = text;
      }
    }

    const data = this.getFilteredData();
    let suggestion = null;
    if (
      this.props.minAutocompleteLength <= (value && value.length) &&
      data &&
      data[0]
    ) {
      suggestion = this.getDisplayProperty(data[0]);
    }

    const inputProps = {
      key: 'text_input',
      value,
      theme: this.props.theme,
      suggestion,
      placeholder: this.props.placeholder,
      rootClassName: `${this.props.rootClassName}__input`,
      className: this.props.inputClassName,
      style: this.props.inputStyle,
      onChange: this.handleTextChange,
      ref: this.addTextInputRef,
      onClick: this.handleTextInputClick,
      throttle: this.props.filterDelay,
      autocomplete: this.props.autocomplete,
      tabIndex: this.props.tabIndex,
      autocompleteDelay: this.props.autocompleteDelay,
      searchable: this.props.searchable,
    };

    let result;
    if (typeof this.props.renderInput === 'function') {
      result = this.props.renderInput({
        text,
        domProps: inputProps,
        onChange: inputProps.onChange,
      });
    }

    if (result === undefined) {
      result = <TextInput {...inputProps} />;
    }

    return result;
  }

  renderSpinner() {
    if (!this.props.loadingSpinner) {
      return null;
    }

    const loading = this.getLoading();

    if (!loading && !this.getExpanded()) {
      return null;
    }

    const spinner =
      this.props.loadingSpinner === true ? (
        <LoadingIcon
          className={`${this.props.rootClassName}__loading-spinner`}
        />
      ) : (
        this.props.loadingSpinner
      );

    return loading
      ? spinner
      : cloneElement(spinner, {
          style: spinner.props.style
            ? { ...spinner.props.style, display: 'none' }
            : { display: 'none' },
        });
  }

  // props getters
  getListProps() {
    const { props, state } = this;
    const data = this.getFilteredData();
    const groupsLength =
      (this.state.groups && Object.keys(this.state.groups).length) || 0;

    const listProps = getListProps({
      props,
      state,
      computed: {
        data,
        loading: this.getLoading(),
        activeItem: this.getActiveItem(),
        value: this.getValue(),
        dataLength: (data && data.length + groupsLength) || 0,
        getIdProperty: this.getIdProperty,
        getDisplayProperty: this.getDisplayProperty,
        onItemClick: this.handleItemClick,
        getComboNode: this.getComboNode,
        ref: this.addListRef,
        onScrollBottom: this.handleListScrollBottom,
        text: this.getText(),
        isNewCustomTagValid: this.isNewCustomTagValid,
      },
    });

    return listProps;
  }

  getValueProps({ items, groupedItems, item }) {
    const { props, state } = this;
    const value = this.getValue();

    return getValueProps({
      props,
      state,
      computed: {
        items,
        item,
        groupedItems,
        value,
        label: this.getItemLabel(),
        activeTag: this.getActiveTag(),
      },
      tagProps: {
        activeStyle: props.tagActiveStyle,
        onClick: this.handleTagClick,
        onCloseTagClick: this.handleRemoveTag,
        onMultipleTagClose: this.handleRemoveMultipleTag,
      },
    });
  }

  // data
  loadDataSource(
    dataSource,
    props = this.props,
    { appendTo, action, value, text, skip, limit, hasNextPage } = emptyObject
  ) {
    if (Array.isArray(dataSource)) {
      if (this.getLoading()) {
        this.setLoading(false);
      }
      this.setData(dataSource, props, { appendTo });
      return;
    }
    if (dataSource && Array.isArray(dataSource.data)) {
      if (this.getLoading()) {
        this.setLoading(false);
      }
      this.setData(dataSource.data, props, {
        remoteCount: dataSource.count != null ? dataSource.count * 1 : null,
        appendTo,
      });
      return;
    }

    if (dataSource && dataSource.then) {
      this.setLoading(true);

      dataSource.then(data => {
        this.props.onDataSourceLoad(data);
        this.loadDataSource(data, props, { appendTo });
      });
      return;
    }

    if (typeof dataSource === 'function') {
      const config = {
        ...props,
        data: this.state.data,
        hasNextPage:
          hasNextPage !== undefined ? hasNextPage : this.hasNextPage(),
        text: this.isRemoteFilter()
          ? text !== undefined
            ? text
            : this.getText()
          : undefined,
        skip: skip || 0,
        action,
        append: !!appendTo,
        value: value !== undefined ? value : this.getValue(),
        limit: limit !== undefined ? limit : this.props.limit,
      };
      const dataResult = dataSource(config);
      this.loadDataSource(dataResult, undefined, {
        appendTo: config.append === false ? null : appendTo,
      });
    }

    if (!dataSource) {
      this.setData(null, props);
    }
  }

  setData(data, props = this.props, { remoteCount, appendTo } = emptyObject) {
    if (!data) {
      this.setState({
        data: null,
        dataMap: null,
        filteredData: null,
        remoteCount: null,
      });
      return null;
    }

    if (Array.isArray(appendTo)) {
      data = appendTo.concat(data);
    }

    const dataMap = data.reduce((acc, item) => {
      acc[this.getIdProperty(item)] = item;
      return acc;
    }, {});

    if (props.groupProperty) {
      this.updateGroups({ data, groupProperty: props.groupProperty });
    }

    // update value map
    this.updateValueMap({
      value: this.getValue(props),
      dataMap,
      oldValueMap: this.getValueMap(),
    });

    this.updateFilteredData({ data });

    this.setState({
      data,
      dataMap,
      remoteCount,
    });
  }

  getPageCount(props = this.props) {
    const count = this.getDataCountForPagination(props);

    return getPageCount({ count, limit: props.limit });
  }

  hasNextPage(props = this.props) {
    return this.getCurrentPage(props) < this.getPageCount(props);
  }

  getCurrentPage(props = this.props) {
    const { limit, skip } = props;

    return getCurrentPage({
      skip: this.previousSkip ? this.previousSkip : 0,
      limit,
    });
  }

  isLastPage(props = this.props) {}

  getDataCountForPagination(props = this.props) {
    const data = this.getData();
    const count = this.isPaginationEnabled(props)
      ? props.remoteCount || this.state.remoteCount
      : data
      ? data.length
      : 0;

    return count || 0;
  }

  getFilteredData() {
    return this.state.filteredData;
  }

  getData() {
    return this.state.data;
  }

  // async data source
  loadLazyDataSource({ action, text }) {
    if (!this.props.lazyDataSource) {
      return null;
    }

    const params = {
      action,
      text,
      value: this.getValue(),
    };

    this.setData(null);
    this.loadDataSource(this.props.dataSource, undefined, params);

    return null;
  }

  isPaginationEnabled(props = this.props) {
    const hasLoadNextPage = typeof props.loadNextPage === 'function';
    const hasFunctionalDataSource = typeof props.dataSource === 'function';

    if (props.enablePagination === false) {
      return false;
    }

    return props.enablePagination
      ? hasLoadNextPage || hasFunctionalDataSource
      : hasLoadNextPage;
  }

  remoteFilterData({
    text = this.getText(),
    value = this.getValue(),
    filterType,
  } = {}) {
    this.previousSkip = null;

    this.loadDataSource(this.props.dataSource, undefined, {
      text,
      skip: 0,
    });
  }

  // pagination
  loadNextPage(props = this.props) {
    const filteredData = this.getFilteredData();
    if (filteredData && filteredData.length < 3) {
      return null;
    }

    if (this.previousSkip == null) {
      this.previousSkip = props.skip;
    }
    const limit = props.limit;
    const hasNextPage = this.hasNextPage();
    const newSkip = this.previousSkip + limit;
    this.previousSkip = newSkip;

    if (!this.isPaginationEnabled()) {
      return;
    }
    const fn = typeof props.dataSource === 'function' ? props.dataSource : null;

    if (fn && hasNextPage) {
      const currentData = this.state.data;

      this.loadDataSource(this.props.dataSource, undefined, {
        appendTo: currentData,
        hasNextPage,
        skip: newSkip,
        limit,
        filter: this.currentFilter,
      });
    }
  }

  isRemoteDataSource() {
    return typeof this.props.dataSource === 'function';
  }

  isRemoteFilter() {
    return typeof this.isRemoteDataSource() && this.props.remoteFilter;
  }

  doFilter({ text, value, force, data, filterType, action } = {}) {
    if (this.currentFilter === text && !force) {
      return;
    }

    this.currentFilter = text;

    if (this.isRemoteFilter()) {
      if (action === 'select') {
        return;
      }
      this.remoteFilterData({ value, text, filterType });
    } else {
      this.updateFilteredData({
        text,
        value,
        data,
        filterType,
      });
    }
  }

  updateFilteredData({
    text = this.getText(),
    value = this.getValue(),
    data = this.state.data,
    filterType,
  } = {}) {
    let filteredData = data;

    if (!Array.isArray(filteredData)) {
      return filteredData;
    }

    if (!this.isRemoteFilter()) {
      filteredData = this.filterDataByText({ text, data: filteredData });
      filteredData = this.filterDataByValue({
        value,
        text,
        data: filteredData,
      });
    }

    // to check if the data is actualy filtered check the length
    const isFilteredByText =
      filterType === 'text' && data.length !== filteredData.length;
    if (isFilteredByText && this.props.activeFirstItemOnFilter) {
      const firstItem = filteredData && filteredData[0];
      if (firstItem) {
        const id = this.getIdProperty(firstItem);
        this.setActiveItem(id);
      } else {
        // clear active item
        this.setActiveItem(null);
      }
    }

    this.setState({
      filteredData,
    });
  }

  filterDataByValue({ value = this.getValue(), data = this.state.data }) {
    if (!Array.isArray(data)) {
      return data;
    }
    let newData = data;
    if (data && value && this.props.removeSelectedItems) {
      newData = filterByValue({
        data: newData,
        getIdProperty: this.getIdProperty,
        value,
      });
    }

    return newData;
  }

  filterDataByText({ text = this.getText(), data = this.state.data }) {
    if (!data || !text) {
      return data;
    }
    let newData = data;
    if (this.isFilterTextActive()) {
      const filterFunction = this.props.filterFunction;
      newData = filterByText({
        data,
        text,
        filterFunction,
        getFilterProperty: this.getFilterProperty || this.getDisplayProperty,
        mode: this.props.filterMode,
        hightlight: this.props.highlightMatchedText,
      });
    }

    return newData;
  }

  getDataMap() {
    return this.state.dataMap;
  }

  getValueMap() {
    return this.state.valueMap;
  }

  // value
  isValueControlled(props = this.props) {
    return props.value !== undefined;
  }

  getValue(props = this.props) {
    return this.isValueControlled(props) ? props.value : this.state.value;
  }

  setValue(newValue, { action } = {}) {
    if (this.props.disabled) {
      return null;
    }
    if (this.props.readOnly) {
      return null;
    }

    if (
      this.props.maxValueLength &&
      newValue &&
      newValue.length > this.props.maxValueLength
    ) {
      return null;
    }

    // should not collapse when value changes by navigation with arrows
    if (this.props.collapseOnSelect && action !== 'navigate') {
      this.collapse();
    }

    if (this.props.autoBlur) {
      this.blur();
    }

    if (!this.isValueControlled()) {
      this.setState({
        value: newValue,
      });
    }

    this.setText(null, { skipFilter: true });

    this.updateValueMap({ value: newValue });
    this.props.onChange(newValue);
  }

  isFilterTextActive() {
    const text = this.getText();
    const data = this.getFilteredData();
    return (
      data &&
      text &&
      this.props.searchable &&
      text.length >= this.props.filterMinLength
    );
  }

  /**
   * If there is no data, let the value it'self describe the item
   * this is usefull in case of tags or when dataSource changes,
   * there is no asociated data width an id.
   */
  updateValueMap({ value, dataMap, oldValueMap }) {
    let newValueMap = getValueMap({
      value,
      dataMap: dataMap || this.getDataMap(),
      oldValueMap: oldValueMap || this.getValueMap(),
    });

    // must normalize and add id and label
    if (newValueMap) {
      newValueMap = Object.keys(newValueMap).reduce((acc, id) => {
        const item = newValueMap[id];
        acc[id] = {
          ...item,
          id: this.getIdProperty(item) || item,
          label: this.getDisplayProperty(item) || item,
        };

        return acc;
      }, {});
    }

    this.setState({
      valueMap: newValueMap,
    });
  }

  selectItem(id) {
    const dataMap = this.getDataMap();
    const item = dataMap && dataMap[id];
    if (!item && !this.props.allowCustomTagCreation) {
      return null;
    }

    if (typeof this.props.isSelectedItemValid === 'function') {
      const isItemValid = this.props.isSelectedItemValid(item);
      if (!isItemValid) {
        return null;
      }
    }

    const value = this.getValue();
    let newValue;

    // multiselect - if value is new, add, if exists remove
    if (this.props.multiple) {
      newValue = getNewMultipleValue({ id, value });
    } else {
      newValue = getNewSingleValue({
        id,
        value,
        toggle: this.props.changeValueOnNavigation
          ? false
          : this.props.allowSelectionToggle,
      });
    }

    this.setValue(newValue, { action: 'select' });
    this.props.onItemClick({ item, id });
  }

  deselectItem(id) {
    const value = this.getValue();
    const newValue = deselectValue({
      id,
      value,
      getIdProperty: this.getIdProperty,
    });

    this.setValue(newValue);
  }

  deselectItems(ids = []) {
    const value = this.getValue();
    const newValue = ids.reduce((acc, id) => {
      acc = deselectValue({
        id,
        value: acc,
        getIdProperty: this.getIdProperty,
      });
      return acc;
    }, value);

    this.setValue(newValue);
  }

  // expanded
  getExpanded() {
    return this.isExpandedControlled()
      ? this.props.expanded
      : this.expanded != null
      ? this.expanded
      : this.state.expanded;
  }

  isExpandedControlled() {
    return this.props.expanded !== undefined;
  }

  setExpanded(expanded) {
    if (this.expandedPromise) {
      this.expandedPromise.then(result => {
        if (this.getExpanded() !== expanded) {
          this.setExpanded(expanded);
        }
      });
      return;
    }

    this.expandedPromise = this.doSetExpanded(expanded).then(() => {
      delete this.expandedPromise;
    });
  }

  doSetExpanded(expanded) {
    if (this.props.disabled) {
      return Promise.resolve(null);
    }

    const currentExpanded = this.getExpanded();
    if (currentExpanded === expanded) {
      return Promise.resolve(expanded);
    }

    if (!expanded && this.isRemoteFilter()) {
      this.previousSkip = null;
    }

    global.requestAnimationFrame(() => {
      if (this.toolsNode) {
        this.handleToolsSize();
      }
    });

    let promise;
    if (!this.isExpandedControlled()) {
      promise = new Promise((resolve, reject) => {
        this.setState({ expanded }, () => {
          resolve(expanded);
        });
      });
    } else {
      promise = Promise.resolve(expanded);
    }

    if (expanded) {
      if (this.isRemoteDataSource() && this.state.data === undefined) {
        // load the data initially
        this.loadDataSource(this.props.dataSource);
      } else {
        if (this.wasExpandedAtLeastOnce) {
          // so on non async remote datasources we dont refetch the data source on the initial expand
          // since it was already fetched on mount
          this.doFilter({ text: '', action: 'expand', force: true });
        }
      }
    }

    if (expanded && !this.wasExpandedAtLeastOnce) {
      this.wasExpandedAtLeastOnce = true;
    }

    if (expanded) {
      this.onExpand();
    } else {
      this.props.onCollapse();
    }

    this.props.onExpandChange(expanded);
    this.props.onExpandedChange(expanded);

    return promise;
  }

  /**
   * I need to overwrite this event, and also
   * this event will be called when controlled expand
   * changes
   */
  onExpand() {
    this.props.onExpand();

    if (this.props.highlightFirst) {
      const activeItem = this.getActiveItem();
      if (!activeItem) {
        const firstItem = this.getItemByIndex(0);
        if (firstItem) {
          const id = this.getIdProperty(firstItem);
          this.setActiveItem(id);
        }
      }
    }
  }

  // active
  isActiveTagControlled() {
    return this.props.activeTag !== undefined;
  }

  setActiveTag(id) {
    if (this.props.disabled) {
      return null;
    }
    if (!this.isActiveTagControlled()) {
      this.setState({
        activeTag: id,
      });
    }

    this.props.onActiveTagChange(id);
  }

  deselectActiveTag() {
    const activeTag = this.getActiveTag();
    if (activeTag) {
      this.setActiveTag(null);
    }
  }

  getActiveTag() {
    return this.isActiveTagControlled()
      ? this.props.activeTag
      : this.state.activeTag;
  }

  getSelectedItems() {
    const valueMap = this.getValueMap();
    let value = this.getValue();
    let items = null;

    if (value) {
      value = Array.isArray(value) ? value : [value];
      items = value.map(id => {
        return (
          valueMap[id] || {
            id: typeof id === 'object' ? this.getIdProperty(id) : id,
            label: typeof id === 'object' ? this.getDisplayProperty(id) : id,
          }
        );
      });
    }

    return items;
  }

  getItemLabel(id) {
    if (this.props.multiple) {
      return null;
    }
    id = id === undefined ? this.getValue() : id;

    const valueMap = this.getValueMap();
    const dataMap = this.getDataMap();
    let label;

    if (valueMap && valueMap[id]) {
      label = valueMap[id].label;
    } else if (dataMap && dataMap[id]) {
      label = this.getDisplayProperty(dataMap[id]);
    }
    if (label === undefined) {
      label =
        this.props.defaultDisplayValue !== undefined && id != null
          ? this.props.defaultDisplayValue
          : id;
    }

    return label;
  }

  getGroupedItems(items) {
    const { maxTagsLength } = this.props;
    if (maxTagsLength == null || !items) {
      return null;
    }

    /**
     * It assumes that it receives items
     * with added id and label property
     */
    return groupItems({ maxTagsLength, items });
  }

  // active list item - list navigation
  isActiveItemControlled() {
    return this.props.activeItem !== undefined;
  }

  setActiveItem(id) {
    if (this.props.disabled) {
      return null;
    }
    const activeItem = this.getActiveItem();
    if (activeItem === id) {
      return null;
    }

    if (!this.isActiveItemControlled()) {
      let activeItemIndex = null;
      if (id) {
        activeItemIndex = this.getItemIndexById(id);
      }

      this.setState({
        activeItemIndex,
        activeItem: id,
      });

      if (this.props.changeValueOnNavigation && !this.props.multiple) {
        this.setValue(id, { action: 'navigate' });
      }
    }

    this.scrollToId(id);
    this.props.onActiveItemChange(id);
  }

  getActiveItem() {
    return this.isActiveItemControlled()
      ? this.props.activeItem
      : this.state.activeItem;
  }

  // text
  isTextControled() {
    return this.props.text != null;
  }

  getText() {
    return this.isTextControled() ? this.props.text : this.state.text;
  }

  setText(text, config = emptyObject, callback = emptyFn) {
    if (typeof config === 'function') {
      callback = config;
      config = emptyObject;
    }

    if (text === this.getText()) {
      callback();
      return;
    }

    if (!this.isTextControled()) {
      this.setStateText(text, config, callback);
    }

    this.props.onTextChange(text);
  }

  setStateText(text, config = emptyObject, callback = emptyFn) {
    if (typeof config === 'function') {
      callback = config;
      config = emptyObject;
    }

    this.setState({ text }, () => {
      this.onTextUpdate(text, config);
      callback();
    });
  }

  onTextUpdate(text, { skipFilter } = emptyObject) {
    this.clearValueOnEmptyIfNecessary(text);

    // filter data
    if (!skipFilter) {
      this.doFilter({ text, filterType: 'text' });
    }
  }

  clearValueOnEmptyIfNecessary(text) {
    if (this.props.clearValueOnEmpty && !this.props.multiple && text === '') {
      this.setValue(null);
    }
  }

  // loading
  getLoading() {
    return this.isLoadingControlled() ? this.props.loading : this.state.loading;
  }

  isLoadingControlled() {
    return this.props.loading != null;
  }

  setLoading(loading) {
    if (loading === this.state.loading) {
      return;
    }
    if (!this.isLoadingControlled()) {
      this.setState({ loading });
    }

    this.props.onLoadingChange(loading);
  }

  // global events
  handleComboClick(event) {
    // catch any click from combo and prevent default to prevent input from losing focus
    event.preventDefault();

    if (this.props.toggleExpandOnClick) {
      this.toggleExpand();
    } else if (this.props.expandOnClick) {
      this.expand();
    }

    if (this.props.focusOnClick && !this.hasFocus()) {
      this.focus();
    }
  }

  handleMouseEnter() {
    this.setState({
      over: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      over: false,
    });
  }

  handleComboFocus() {
    if (this.props.expandOnFocus) {
      this.expand();
    }

    this.setState({
      focus: true,
    });

    this.props.onFocus();
  }

  handleComboBlur(event) {
    if (
      this.isFocused() &&
      event &&
      event.relatedTarget &&
      containsNode(this.comboNode, event.relatedTarget)
    ) {
      global.requestAnimationFrame(() => {
        this.focus();
      });
      return;
    }
    if (this.props.collapseOnBlur) {
      this.collapse();
    }

    if (this.props.clearTextOnBlur) {
      // only clear if we can find the data
      this.setText(null);
    }

    this.setState({
      focus: false,
    });

    this.props.onBlur();
  }

  isFocused() {
    return this.state.focus;
  }

  // list event
  handleItemClick(id) {
    if (!this.isFocused() && this.props.focusOnClick) {
      this.focus();
    }
    this.setActiveItem(id);
    this.selectItem(id);
  }

  // input events
  handleTextChange(text) {
    this.deselectActiveTag();
    this.setText(
      text,
      { skipFilter: this.props.expandOnTextChange && !this.getExpanded() },
      () => {
        /*
         * trigger here expand because
         * the text change that triggers expand should come from
         * a key press and not from when clearing the text
         * or setting the text from the current value
         */
        if (this.props.expandOnTextChange) {
          this.expand();
        }
      }
    );
  }

  handleTextInputClick() {
    this.deselectActiveTag();
  }

  handleRemoveTag(id) {
    this.removeTag(id);
  }

  handleRemoveMultipleTag(ids) {
    this.deselectItems(ids);
  }

  handleListScrollBottom() {
    this.loadNextPage();
  }

  removeTag(id, dir = -1) {
    // if it is active than have to change the active tag to next
    // or previous
    const activeTag = this.getActiveTag();
    if (activeTag === id && activeTag != null) {
      const value = this.getValue();
      const newActiveTag = getNewActiveTagOnRemove({ id, value, dir });
      this.setActiveTag(newActiveTag);
    }

    this.deselectItem(id);
  }

  removeRemainingTags() {
    const ids = this.groupedItems.remainingItems.map(item => item.id);

    /**
     * Must set active tag last visible tag
     */
    const visibleItems = this.groupedItems.visibleItems;
    const activeTag = this.getActiveTag();

    if (activeTag === REMAINING_ITEMS) {
      const lastItem =
        Array.isArray(visibleItems) && visibleItems[visibleItems.length - 1];
      if (lastItem) {
        this.setActiveTag(lastItem.id);
      }
    } else {
      this.deselectActiveTag();
    }

    this.removeTags(ids);
  }

  removeTags(ids) {
    this.deselectItems(ids);
  }

  handleTagClick(id) {
    const activeTag = this.getActiveTag();
    if (activeTag === id) {
      this.setActiveTag(null);
    } else {
      this.setActiveTag(id);
    }

    this.props.onTagClick(this.getItemById(id));

    if (this.props.focusOnClick && !this.hasFocus()) {
      this.focus();
    }
  }

  handleComboMouseDown(event) {
    event.preventDefault();
  }

  handleComboKeyDown(event) {
    /**
     * A new tag can be added if:
     * - no items are found in datasource
     */
    if (this.props.allowCustomTagCreation && event.key === 'Enter') {
      if (this.isNewCustomTagValid) {
        this.selectItem(this.getText());
        this.setText(null);
      }
    }

    if (this.props.enableNavigation) {
      if (this.props.enableListNavigation) {
        switch (event.key) {
          case 'ArrowDown':
            this.navigateToNextItem(1, event);
            break;
          case 'ArrowUp':
            this.navigateToNextItem(-1, event);
            break;
          case 'Enter':
            this.handleEnterKeyPress(event);
            break;
          case 'Space':
            this.selectActiveItem();
            break;
        }
      }

      if (this.props.enableTagNavigation) {
        switch (event.key) {
          case 'ArrowLeft':
            this.navigateToNextTag(-1, event);
            break;
          case 'ArrowRight':
            this.navigateToNextTag(1, event);
            break;
          case 'Backspace':
            this.handleBackspace(event);
            break;
          case 'Delete':
            this.handleDelete(event);
        }
      }
    }

    if (event.key === 'Escape') {
      const expanded = this.getExpanded();
      if (this.props.collapseOnEscape) {
        if (expanded) {
          this.collapse();
        }
      }

      if (!expanded && this.getActiveTag()) {
        this.setActiveTag(null);
      }

      if (!this.props.multiple) {
        this.setText(null);
      }
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event, this);
    }
  }

  navigateToNextItem(direction, event) {
    const data = this.getFilteredData();
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (this.getExpanded()) {
      const activeItem = this.getActiveItem();
      let newActiveItem;
      if (activeItem != null) {
        newActiveItem = getNextItem({
          direction,
          data,
          id: activeItem,
          activeItem,
          getIdProperty: this.getIdProperty,
        });
      } else {
        let firstItemId;
        let lastItemId;
        if (data && data.length) {
          firstItemId = this.getIdProperty(data[0]);
          lastItemId = this.getIdProperty(data[data.length - 1]);
          if (direction && firstItemId != null) {
            newActiveItem = firstItemId;
          }
          if (direction === -1 && lastItemId != null) {
            newActiveItem = lastItemId;
          }
        }
      }

      this.setActiveItem(newActiveItem);
    } else {
      // expand list
      this.expand();
    }
  }

  selectActiveItem() {
    const activeItem = this.getActiveItem();
    if (activeItem) {
      this.selectItem(activeItem);
    }
  }

  handleEnterKeyPress(event) {
    const expanded = this.getExpanded();
    // must be sure that list is opened

    if (expanded) {
      this.selectActiveItem();
    }

    const activeItem = this.getActiveItem();
    if (this.props.collapseOnSelectWithEnter) {
      // make sure there won't be a toggle, only collapse when a value
      // is selected
      if (activeItem && expanded) {
        this.collapse();
      }
    }

    if (
      this.props.navigateToNextAfterSelection &&
      this.props.multiple &&
      activeItem
    ) {
      this.navigateToNextItem(1, event);
    }
  }

  /**
   * Handles tag navigation. Decides whether the
   * navigation should take place taking into account:
   * - if there is a value
   * - position of the cursor inside the value.
   * @return {null}
   */
  navigateToNextTag(direction, event) {
    if (!this.isNavigationAllowed(direction)) {
      return null;
    }
    // if navigation is allowed, input key down should not take place
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    let newActiveTag;

    // none is selected and arrow is left, then select last one
    const items = this.getSelectedItems();
    let itemsIds;
    if (this.areItemsGrouped) {
      /**
       * Separate grouped items and give them `grouped` id
       */
      const visibleItems = this.groupedItems.visibleItems.map(item => item.id);
      itemsIds = [...visibleItems, REMAINING_ITEMS];
    } else {
      itemsIds = items.map(item => item.id);
    }

    const currentActiveTag = this.getActiveTag();
    const currentIndex = itemsIds.indexOf(currentActiveTag);

    const lastIndex = itemsIds.length - 1;
    const lastTag = itemsIds[lastIndex];
    const firstTag = itemsIds[0];

    const isFirstTag = currentIndex === 0;
    const isLastTag = currentIndex === lastIndex;

    if (direction === -1 && isFirstTag) {
      this.setActiveTag(null);
      return null;
    }

    if (direction === 1 && isLastTag) {
      this.setActiveTag(null);
      return null;
    }

    if (currentActiveTag === null || currentIndex === -1) {
      newActiveTag = direction === -1 ? lastTag : firstTag;
    } else {
      // something already active
      if (direction === -1) {
        newActiveTag = isFirstTag ? lastTag : itemsIds[currentIndex - 1];
      } else if (direction === 1) {
        newActiveTag = isLastTag ? firstTag : itemsIds[currentIndex + 1];
      }
    }

    this.setActiveTag(newActiveTag);
    return null;
  }

  isNavigationAllowed(direction) {
    /**
     * Determine if navigation is allowed.
     * - no selection
     * - cursor index must be at 0 position for direction -1
     * - curosr index must be at the end for direction 1
     * - there must be a value
     * - it has to be multiple, so there is what to navigate
     * - and tag navigation should be neabled
     */
    if (!this.props.multiple) {
      return false;
    }

    const inputNode = this.getTextInputNode();
    if (inputNode.hasSelection()) {
      return false;
    }

    const currentActiveTag = this.getActiveTag();

    const canNavigateLeft =
      inputNode.isCursorAtStartPosition() && direction === -1;
    const canNavigateRight =
      inputNode.isCursorAtEndPosition() && direction === 1;

    // navigation is also allowed when there is an active element
    if (!canNavigateRight && !canNavigateLeft && !currentActiveTag) {
      return false;
    }

    const items = this.getSelectedItems();
    if (!Array.isArray(items)) {
      return false;
    }

    // if length = 0 then it should be deselected
    if (items.length === 1 && currentActiveTag) {
      this.setActiveTag(null);
      return false;
    }

    return true;
  }

  /**
   * A tag should be deleted if:
   * - there is no selection -> delete the last tag
   * - a tag is active -> delte the active tag
   */
  handleBackspace(event) {
    if (this.props.multiple) {
      this.handleTagBackspaceRemove(event);
    }
  }

  handleDelete(event) {
    const activeTag = this.getActiveTag();
    if (this.props.multiple && activeTag) {
      this.removeTag(activeTag, 1);
    }
  }

  handleTagBackspaceRemove(event) {
    if (!this.props.removeTagOnBackspace) {
      return null;
    }

    const value = this.getValue();
    if (!value) {
      return null;
    }

    const activeTag = this.getActiveTag();
    if (activeTag != null) {
      event.preventDefault();
      if (activeTag === REMAINING_ITEMS) {
        this.removeRemainingTags();
      } else {
        this.removeTag(activeTag, -1);
      }
      return null;
    }

    // only when cursor is at first position
    const inputNode = this.getTextInputNode();
    const canDeleteTag =
      value && value.length && inputNode.isCursorAtStartPosition();

    if (canDeleteTag) {
      /**
       * If there is grouped items, they must be deleted
       */
      if (this.areItemsGrouped) {
        const ids = this.groupedItems.remainingItems.map(item => item.id);
        this.removeTags(ids);
      } else {
        const items = this.getSelectedItems();
        const lastItem = items[items.length - 1];
        const lastItemId = lastItem.id;

        if (this.props.keepTagTextOnRemove) {
          const label = lastItem.label;
          if (label && typeof label === 'string') {
            this.setText(label);
          }
        }

        this.removeTag(lastItemId);
      }
    }

    return null;
  }

  handleToolsSize(
    size = this.toolsNode
      ? this.toolsNode.getBoundingClientRect()
      : { width: 0, height: 0 }
  ) {
    const node = this.comboNode;
    const computedStyle = global.getComputedStyle(node);

    const width =
      size.width +
      parseInt(computedStyle.paddingLeft, 10) +
      parseInt(computedStyle.paddingRight, 10);

    this.setState({
      toolsSize: {
        height: size.height,
        width,
      },
    });
  }

  // methods
  expand() {
    this.setExpanded(true);
  }

  collapse() {
    this.setExpanded(false);
  }

  scrollToIndex(index) {
    const listNode = this.getListNode();
    return listNode && listNode.scrollToIndex(index);
  }

  getItemIndexById(id) {
    const index = findItemIndex({
      id,
      data: this.getFilteredData(),
      getIdProperty: this.getIdProperty,
    });

    return index;
  }

  scrollToId(id) {
    // scroll to index
    const index = this.getItemIndexById(id);

    if (index != null) {
      this.scrollToIndex(index);
    }
  }

  toggleExpand() {
    const expanded = this.getExpanded();
    if (expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  // item getters
  getItemByIndex(index) {
    const data = this.getFilteredData();
    if (!data || !Array.isArray(data) || !data[index]) {
      return null;
    }

    return data[index];
  }

  getItemById(id) {
    const dataMap = this.getDataMap();
    return (dataMap && dataMap[id]) || id;
  }

  // id prop updaters
  updateGetIdProperty(props) {
    props = props || this.props;
    this.getIdProperty = getDataProp(props.idProperty);
  }

  updateGetDisplayProperty(props) {
    props = props || this.props;
    this.getDisplayProperty = getDataProp(props.displayProperty);
  }

  updateGetFilterProperty(props) {
    props = props || this.props;
    this.getFilterProperty = getDataProp(props.filterProperty);
  }

  updateGroups({
    groupProperty = this.props.groupProperty,
    data = this.getFilteredData(),
  }) {
    if (!data) {
      return null;
    }
    const groups = getGroups(data, groupProperty);
    this.setState({ groups });
  }

  // dom
  focus() {
    const textInput = this.getTextInputNode();
    if (textInput && textInput.focus && !this.hasFocus()) {
      textInput.focus();
    }
  }

  blur() {
    const textInput = this.getTextInputNode();
    if (textInput && textInput.blur) {
      textInput.blur();
    }
  }

  hasFocus() {
    const textInput = this.getTextInputNode();

    if (textInput && textInput.hasFocus) {
      return textInput.hasFocus();
    }

    return false;
  }

  // nodes
  getTextInputNode() {
    return this.textInput;
  }

  getComboNode() {
    return this.comboNode;
  }

  getListNode() {
    return this.listNode;
  }

  getVirtualListNode() {
    return this.listNode && this.listNode.getVirtualListNode();
  }

  getlListNode() {
    return this.listNode && this.listNode.getlListNode();
  }

  // other methods
  addItem(item) {
    const newData = [...this.getData(), item];
    this.setData(newData);
  }

  clear() {
    this.setValue(null);
    this.setText(null);
    global.requestAnimationFrame(() => {
      if (this.toolsNode) {
        this.handleToolsSize();
      }
    });
  }

  getItem(id) {
    return this.getItemById(id);
  }

  getItemCount() {
    const data = this.getData();
    return Array.isArray(data) ? data.length : null;
  }

  insertItem({ index, item }) {
    const data = this.getData();
    const newData = [...data.slice(0, index), item, ...data.slice(index)];

    this.setData(newData);
  }

  removeItems(ids) {
    ids = Array.isArray(ids) ? ids : [ids];
    const data = this.getData();
    const newData = data.filter(item => {
      const id = this.getIdProperty(item);
      return ids.indexOf(id) === -1;
    });

    this.setData(newData);
  }

  toggle() {
    const expanded = this.getExpanded();
    this.setExpanded(!expanded);
  }
}

function emptyFn() {}

InovuaComboBox.defaultProps = {
  rootClassName: 'inovua-react-toolkit-combo-box',
  inlineFlex: false,

  itemEllipsis: true,

  // style
  borderRadius: 0,
  shadow: true,
  showShadowOnMouseOver: false,
  clearTextOnBlur: true,

  // events
  onKeyDown: emptyFn,

  // focus/blur
  autoFocus: false,
  autoBlur: false,
  focusOnClick: true,
  onFocus: emptyFn,
  onBlur: emptyFn,

  // active item
  defaultActiveItem: null,
  highlightFirst: false,

  // input, filter
  onTextChange: emptyFn,
  searchable: true,
  tagCloseIconPosition: 'end',
  removeTagOnBackspace: true,
  tagEllipsis: true,
  filterMinLength: 0,
  filterDelay: 300,
  activeFirstItemOnFilter: true,
  clearIcon: true,
  toggleIcon: true,
  showClearIconOnMouseOver: false,
  clearTextOnSelect: true,
  filterMode: 'contains',
  highlightMatchedText: false,

  // tag
  onActiveTagChange: emptyFn,
  enableTagNavigation: true,
  onTagClick: emptyFn,
  onActiveItemChange: emptyFn,
  keepTagTextOnRemove: true,

  // events
  onItemClick: emptyFn,
  onChange: emptyFn,

  // autocomplete
  minAutocompleteLength: 3,
  autocompleteDelay: 300,
  autocomplete: false,

  // value
  defaultValue: null,
  multiple: false,
  removeSelectedItems: false,
  allowSelectionToggle: true,
  clearValueOnEmpty: true,

  // dataSource
  onDataSourceLoad: emptyFn,
  idProperty: 'id',
  displayProperty: 'label',
  groupProperty: 'group',

  // infinite load
  limit: 50,
  skip: 0,

  // loading
  onLoadingChange: emptyFn,
  listLoadingText: 'Loading...',
  loadingSpinner: true,

  // empty
  listEmptyText: 'No data found',

  defaultText: null,

  // list
  defaultExpanded: false,
  onExpandedChange: emptyFn,
  onExpandChange: emptyFn,
  collapseOnEscape: true,
  expandOnClick: true,
  expandOnFocus: true,
  collapseOnBlur: true,
  onExpand: emptyFn,
  onCollapse: emptyFn,
  expandOnTextChange: true,
  toggleExpandOnClick: true,
  wrapMultiple: true,

  theme: 'default-light',

  // navigation
  enableNavigation: true,
  enableListNavigation: true,
  navigateToNextAfterSelection: true,

  // position
  positions: ['bottom', 'top'],
  offset: 2,
  constrainTo: true,
};

const VALUE_TYPE = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.object,
  PropTypes.bool,
  PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.bool,
    ])
  ),
]);

InovuaComboBox.propTypes = {
  rootClassName: PropTypes.string,
  theme: PropTypes.string,
  inlineFlex: PropTypes.bool,
  shouldComponentUpdate: PropTypes.func,
  lazyDataSource: PropTypes.bool,
  remoteFilter: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  rtl: PropTypes.bool,
  tabIndex: PropTypes.number,
  collapseOnSelect: PropTypes.bool,
  clearTextOnBlur: PropTypes.bool,
  listEmptyText: PropTypes.node,
  listMaxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  listMinHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxTagsLength: PropTypes.number,

  // loading
  defaultLoading: PropTypes.bool,
  loading: PropTypes.bool,
  onLoadingChange: PropTypes.func,
  listLoadingText: PropTypes.node,
  loadingSpinner: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),

  // events
  onKeyDown: PropTypes.func,
  onTagClick: PropTypes.func,

  // global icons
  clearIcon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
    PropTypes.node,
  ]),
  toggleIcon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
    PropTypes.node,
  ]),
  showClearIconOnMouseOver: PropTypes.bool,

  // focus/blur
  autoFocus: PropTypes.bool,
  autoBlur: PropTypes.bool,
  focusOnClick: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,

  // style
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  background: PropTypes.string,
  shadow: PropTypes.bool,
  showShadowOnMouseOver: PropTypes.bool,
  emptyClassName: PropTypes.string,
  emptyStyle: PropTypes.object,
  disabledClassName: PropTypes.string,
  disabledStyle: PropTypes.object,
  focusedClassName: PropTypes.string,
  focusedStyle: PropTypes.object,

  // item style
  itemBackground: PropTypes.string,
  disabledItemStyle: PropTypes.object,
  disabledItemClassName: PropTypes.string,
  renderItem: PropTypes.func,
  itemEllipsis: PropTypes.bool,
  activeItemStyle: PropTypes.object,
  activeItemClassName: PropTypes.string,
  selectedItemStyle: PropTypes.object,

  // infinite load
  limit: PropTypes.number,
  skip: PropTypes.number,
  loadNextPage: PropTypes.func,

  // input/filter
  searchable: PropTypes.bool,
  placeholder: PropTypes.node,
  text: PropTypes.string,
  defaultText: PropTypes.string,
  onTextChange: PropTypes.func,
  filterFunction: PropTypes.func,
  filterProperty: PropTypes.string,
  loadLazyDataSource: PropTypes.func,
  filterMinLength: PropTypes.number,
  filterDelay: PropTypes.number,
  activeFirstItemOnFilter: PropTypes.bool,
  renderInput: PropTypes.func,
  inputClassName: PropTypes.string,
  inputStyle: PropTypes.object,
  clearTextOnSelect: PropTypes.bool,
  filterMode: PropTypes.oneOf(['startsWith', 'contains']),
  highlightMatchedText: PropTypes.bool,

  // autocomplete
  autocomplete: PropTypes.bool,
  minAutocompleteLength: PropTypes.number,
  autocompleteDelay: PropTypes.number,

  // tag navigation
  enableNavigatio: PropTypes.bool,
  keepTagTextOnRemove: PropTypes.bool,
  tagActiveStyle: PropTypes.object,

  enableTagNavigation: PropTypes.bool,
  activeTag: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultActiveTag: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onActiveTagChange: PropTypes.func,
  allowCustomTagCreation: PropTypes.bool,

  // list item navigation
  enableNavigation: PropTypes.bool,
  enableListNavigation: PropTypes.bool,
  highlightFirst: PropTypes.bool,

  activeItem: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultActiveItem: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onActiveItemChange: PropTypes.func,
  navigateToNextAfterSelection: PropTypes.bool,

  // events
  onItemClick: PropTypes.func,
  onChange: PropTypes.func,

  // list props
  listClassName: PropTypes.string,
  selectedStyle: PropTypes.object,
  selectedClassName: PropTypes.string,
  renderGroup: PropTypes.func,
  renderFooter: PropTypes.func,
  renderHeader: PropTypes.func,
  renderList: PropTypes.func,
  renderListComponent: PropTypes.func,

  // value
  value: VALUE_TYPE,
  defaultValue: VALUE_TYPE,
  defaultDisplayValue: VALUE_TYPE,
  removeSelectedItems: PropTypes.bool,
  isSelectedItemValid: PropTypes.func,
  maxValueLength: PropTypes.number,
  changeValueOnNavigation: PropTypes.bool,
  allowSelectionToggle: PropTypes.bool,
  clearSelectedOnTextChange: PropTypes.bool,
  clearValueOnEmpty: PropTypes.bool,

  // tags
  isNewCustomTagValid: PropTypes.func,
  multiple: PropTypes.bool,
  renderTag: PropTypes.func,
  renderTagLabel: PropTypes.func,
  renderRemainingTags: PropTypes.func,
  renderTags: PropTypes.func,
  tagStyle: PropTypes.object,
  tagBorder: PropTypes.string,
  tagPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tagHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tagWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tagMinSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ]),
  tagMaxSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ]),
  tagCloseIcon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
    PropTypes.func,
  ]),
  tagCloseIconPosition: PropTypes.oneOf(['start', 'end']),
  tagEllipsis: PropTypes.bool,
  removeTagOnBackspace: PropTypes.bool,

  // display value
  renderDisplayValue: PropTypes.func,

  // datasource
  dataSource: (props, propName) => {
    const dataSource = props[propName];
    if (
      dataSource != null &&
      typeof dataSource !== 'function' &&
      !Array.isArray(dataSource) &&
      !(dataSource && dataSource.then)
    ) {
      return new Error(
        'dataSource must be an array, null, a promise or a function returning a promise.'
      );
    }

    return null;
  },
  onDataSourceLoad: PropTypes.func,
  idProperty: PropTypes.string,
  displayProperty: PropTypes.string,
  groupProperty: PropTypes.string,
  listStyle: PropTypes.object,
  relativeToViewport: PropTypes.bool,

  // expanded
  expanded: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
  onExpandedChange: PropTypes.func,
  onExpandChange: PropTypes.func,
  collapseOnEscape: PropTypes.bool,
  expandOnClick: PropTypes.bool,
  expandOnFocus: PropTypes.bool,
  collapseOnBlur: PropTypes.bool,
  enablePagination: PropTypes.bool,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
  virtualListFactory: PropTypes.func,
  renderListScroller: PropTypes.func,
  renderVirtualList: PropTypes.func,
  expandOnTextChange: PropTypes.bool,
  toggleExpandOnClick: PropTypes.bool,
  collapseOnSelectWithEnter: PropTypes.bool,
  wrapMultiple: PropTypes.bool,

  // list
  newCustomTagText: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  positions: PropTypes.arrayOf(PropTypes.string),
  constrainTo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
    PropTypes.bool,
  ]),
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
        }),
      ])
    ),
  ]),
};

export default InovuaComboBox;

export { REMAINING_ITEMS };
