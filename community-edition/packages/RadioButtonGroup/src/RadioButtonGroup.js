/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from '../../react-class/autoBind';
import cleanProps from '../../../common/cleanProps';

import join from '../../../common/join';
import RadioButton from '../../RadioButton';
import CheckBox from '../../CheckBox';
import uglified from '../../uglified';

const KEYS = {
  LEFT_ARROW: 'ArrowLeft',
  UP_ARROW: 'ArrowUp',
  RIGHT_ARROW: 'ArrowRight',
  DOWN_ARROW: 'ArrowDown',
};

const CLASS_NAME = 'inovua-react-toolkit-radio-button-group';

const getClassNames = (props, state) => {
  const { theme, orientation, stretch, rtl, horizontal, disabled } = props;

  return join(
    CLASS_NAME,
    props.className,
    `${CLASS_NAME}--theme-${theme}`,
    `${CLASS_NAME}--orientation-${orientation}`,
    stretch && `${CLASS_NAME}--stretch`,
    horizontal && `${CLASS_NAME}--orientation-horizontal`,
    disabled && `${CLASS_NAME}--disabled`,
    rtl ? `${CLASS_NAME}--rtl` : `${CLASS_NAME}--ltr`,
    state.focused && `${CLASS_NAME}--focused`
  );
};

const isChildChecked = ({ checkedItem }, idx) => {
  return !!checkedItem === idx;
};

const isControlledComponent = props => {
  return !!props.checkedItemValue;
};

const emptyFn = () => false;

const generateIndexToGroupMapping = props => {
  const { children, radioOptions } = props;
  let cleanChildren;
  if (!children) {
    return radioOptions.reduce((acc, option, idx) => {
      acc[option.value] = idx;
      return acc;
    }, {});
  } else if (children && children.type) {
    cleanChildren = [children];
  } else {
    cleanChildren = [...children];
  }

  return cleanChildren.reduce((acc, child, idx) => {
    let parsedChild = child;
    if (typeof child === 'function') {
      parsedChild = child({
        onChange: emptyFn,
        checked: false,
      });
    }

    let radioValue = parsedChild.props['data-radio-value'];

    if (
      typeof radioValue === 'undefined' ||
      radioValue === null ||
      radioValue === false
    ) {
      radioValue = idx;
    }

    acc[radioValue] = idx;

    return acc;
  }, {});
};

const getInitialStateValue = props => {
  const { radioValue, defaultRadioValue } = props;
  if (radioValue) {
    return null;
  }

  if (defaultRadioValue || defaultRadioValue === 0) {
    return defaultRadioValue;
  }

  return '';
};

const getRadioBasedChildren = ({
  radioOptions,
  renderItem,
  currentCheckedValue,
  onChange,
  disabled,
  readOnly,
  rtl,
  theme,
}) => {
  return radioOptions.reduce((acc, option) => {
    acc.push(
      renderItem({
        rtl,
        checked: option.value === currentCheckedValue,
        'data-radio-value': option.value,
        children: option.label,
        tabIndex: null,
        onChange,
        key: option.value,
        disabled,
        readOnly,
        theme,
      })
    );
    return acc;
  }, []);
};

const getCurrentCheckedValue = (props, state) => {
  const { radioValue } = props;
  const { checkedItemValue } = state;
  if (radioValue) {
    return radioValue;
  }
  return checkedItemValue;
};

class InovuaRadioButtonGroup extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.valueToIndexMapping = generateIndexToGroupMapping(props);
    this.state = {
      checkedItemValue: getInitialStateValue(props),
    };
  }

  getCleanChild(child, idx) {
    const { props, state, currentCheckedValue, valueToIndexMapping } = this;

    let currentChild = child;
    const { disabled, readOnly } = props;

    const apiProps = {
      checked: valueToIndexMapping[currentCheckedValue] === idx,
      onChange: this.onRadioChildChange.bind(this),
      disabled,
      readOnly,
    };

    if (typeof child === 'function') {
      currentChild = child(apiProps);
    } else {
      currentChild = React.cloneElement(currentChild, apiProps);
    }

    let { key, 'data-radio-value': dataRadioValue } = currentChild.props;

    if (key === undefined || dataRadioValue === undefined) {
      key = key || idx;
      dataRadioValue = dataRadioValue || idx;

      currentChild = React.cloneElement(currentChild, {
        key,
        'data-radio-value': dataRadioValue,
      });
    }

    return currentChild;
  }

  onRadioChildChange(radioValue) {
    this.setValue(radioValue);
  }

  setValue(radioValue) {
    const { isControlled, onChange, name } = this.p;
    if (!isControlled) {
      this.setState({
        checkedItemValue: radioValue,
      });
    }

    const index = this.valueToIndexMapping[radioValue];

    if (typeof onChange == 'function') {
      onChange({
        checkedItemIndex: index,
        checkedItemValue: radioValue,
        groupName: name,
      });
    }

    this.setState({
      focusedIndex: index,
    });
  }

  getValue() {
    return this.currentCheckedValue;
  }

  getName() {
    return this.p.name;
  }

  getProps(props, state) {
    props = props || this.props;
    state = state || this.state;

    let cleanChildren;

    const currentCheckedValue = (this.currentCheckedValue = getCurrentCheckedValue(
      props,
      state
    ));

    const shouldSubmitIsFunction = typeof props.shouldSubmit === 'function';
    const shouldSubmitValue = shouldSubmitIsFunction
      ? props.shouldSubmit(props)
      : typeof props.shouldSubmit === 'undefined' || props.shouldSubmit;

    if (
      props.showWarnings &&
      shouldSubmitIsFunction &&
      shouldSubmitValue &&
      !props.name
    ) {
      console.warn(
        'shouldSubmit function returned true, but "name" prop is missing'
      );
    }

    const withHiddenInput = !!(props.name && shouldSubmitValue);

    const { radioOptions, renderItem, disabled, readOnly, rtl } = props;

    if (radioOptions) {
      cleanChildren = getRadioBasedChildren({
        radioOptions,
        renderItem,
        rtl,
        currentCheckedValue,
        onChange: this.onRadioChildChange.bind(this),
        disabled,
        readOnly,
        theme: props.theme,
      });
    } else if (props.children && props.children.type) {
      cleanChildren = [this.getCleanChild(props.children, 0)];
    } else {
      cleanChildren = [...props.children].map(this.getCleanChild);
    }

    return {
      ...props,
      withHiddenInput,
      children: cleanChildren,
      className: getClassNames(props, state),
      isControlled: isControlledComponent(props),
      currentCheckedValue,
    };
  }

  renderHiddenInput() {
    const {
      tabIndex,
      disabled,
      checked,
      withHiddenInput,
      name,
      shouldSubmit,
    } = this.p;
    const inputProps = {
      type: 'checkbox',
      ref: ref => (this.node = ref),
      onClick: this.handleClick,
      checked: !!checked,
      tabIndex: disabled === true ? null : tabIndex,
    };

    if (disabled) {
      return null;
    }

    if (!name) {
      return null;
    }

    if (typeof shouldSubmit == 'function' && shouldSubmit() === false) {
      return null;
    }

    if (shouldSubmit === false) {
      return null;
    }

    if (withHiddenInput) {
      inputProps.name = name;
    }
    return <input {...inputProps} type="hidden" />;
  }

  _attachEventHandler(key, handler, propagatedProps) {
    const oldEventHandler = propagatedProps[key];
    if (oldEventHandler) {
      propagatedProps[key] = ev => {
        handler(ev);
        oldEventHandler(ev);
      };
    } else {
      propagatedProps[key] = handler;
    }
  }

  setKeyboardNavigationProps(computedRBGDOMProps) {
    computedRBGDOMProps.tabIndex = this.props.tabIndex || 0;
    this._attachEventHandler('onFocus', this.onFocus, computedRBGDOMProps);
    this._attachEventHandler('onBlur', this.onBlur, computedRBGDOMProps);
    this._attachEventHandler('onKeyDown', this.onKeyDown, computedRBGDOMProps);
  }

  onFocus(event) {
    if (!event || !event.target) {
      return;
    }

    if (this.props.disabled) {
      return;
    }

    let currentTarget = event.target;

    if (!currentTarget) {
      return;
    }
    if (!currentTarget.dataset) {
      return;
    }

    const { radioValue } = currentTarget.dataset;
    let focusedIndex = this.valueToIndexMapping[radioValue];

    const newState = {
      focused: true,
    };

    if (focusedIndex !== undefined) {
      newState.focusedIndex = focusedIndex;
    }

    this.setState(newState);
  }

  onBlur() {
    this.setState({ focused: false });
  }

  onKeyDown(ev) {
    if (!this.state.focused) {
      return;
    }
    if (this.props.disabled) {
      return;
    }
    if (this.props.readOnly) {
      return;
    }
    const { focusedIndex } = this.state;
    const cleanedProps = this.getProps();
    const { children } = cleanedProps;
    switch (ev.key) {
      case KEYS.DOWN_ARROW:
      case KEYS.RIGHT_ARROW:
        ev.preventDefault();
        if (focusedIndex < children.length - 1) {
          const nextValue =
            children[focusedIndex + 1].props['data-radio-value'];
          this.setValue(nextValue);
          this.setState({ focusedIndex: focusedIndex + 1 });
        }
        break;
      case KEYS.UP_ARROW:
      case KEYS.LEFT_ARROW:
        ev.preventDefault();
        if (focusedIndex > 0) {
          const prevValue =
            children[focusedIndex - 1].props['data-radio-value'];
          this.setValue(prevValue);
          this.setState({ focusedIndex: focusedIndex - 1 });
        }
        break;
    }
  }

  render() {
    const {
      children,
      className,
      name,
      currentCheckedValue,
      submitFriendly,
      enableKeyboardNavigation,
    } = (this.p = this.getProps());
    const cleanedProps = cleanProps(
      this.props,
      InovuaRadioButtonGroup.propTypes
    );
    const computedRBGDOMProps = {
      ...cleanedProps,
      className,
    };

    if (enableKeyboardNavigation) {
      this.setKeyboardNavigationProps(computedRBGDOMProps);
    }

    return (
      <div {...computedRBGDOMProps}>
        {children}
        {submitFriendly &&
          this.renderHiddenInput({ name, value: currentCheckedValue })}
      </div>
    );
  }
}

InovuaRadioButtonGroup.defaultProps = {
  defaultRadioValue: undefined,
  submitFriendly: true,
  renderItem: props => <WrappedRadioInput {...props} />,
  orientation: 'vertical',
  theme: 'default',
  disabled: false,
  readOnly: false,
  enableKeyboardNavigation: true,
  showWarnings: !uglified,
  stretch: false,
};

InovuaRadioButtonGroup.propTypes = {
  defaultRadioValue: PropTypes.any,
  rtl: PropTypes.bool,
  shouldComponentUpdate: PropTypes.func,
  children: PropTypes.any,
  submitFriendly: PropTypes.bool,
  radioOptions: PropTypes.arrayOf(PropTypes.object),
  renderItem: PropTypes.func,
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  theme: PropTypes.string,
  onChange: PropTypes.func,
  stretch: PropTypes.bool,
  shouldSubmit: (props, propName, componentName) => {
    if (
      props.shouldSubmit &&
      typeof props.shouldSubmit !== 'function' &&
      !props.name
    ) {
      return new Error(
        `"shouldSubmit" was true, but component ${componentName} requires prop "name" to be submitted.`
      );
    }
  },
  radioValue: PropTypes.any,
  value: props => {
    if (typeof props.value !== 'undefined') {
      return new Error(
        '"value" prop is not supported. Use "radioValue" instead.'
      );
    }
  },
  defaultValue: props => {
    if (typeof props.defaultValue !== 'undefined') {
      return new Error(
        '"defaultValue" prop is not supported. Use "defaultRadioValue" instead.'
      );
    }
  },
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  enableKeyboardNavigation: PropTypes.bool,
  showWarnings: PropTypes.bool,
};

const WrappedRadioInput = props => {
  const onChange = (data, event) => {
    if (props.onChange) {
      props.onChange(props['data-radio-value']);
    }
  };

  return (
    <RadioButton
      iconSize={16}
      inlineBlock={false}
      {...props}
      checkedValue
      uncheckedValue={false}
      onChange={onChange}
    />
  );
};

const WrappedCheckBox = props => {
  const onChange = (data, event) => {
    if (props.onChange) {
      props.onChange(props['data-radio-value']);
    }
  };
  return (
    <CheckBox
      iconSize={16}
      {...props}
      checkedValue
      uncheckedValue={false}
      onChange={onChange}
    />
  );
};

export default InovuaRadioButtonGroup;

export { WrappedRadioInput as RadioButton, WrappedCheckBox as CheckBox };
