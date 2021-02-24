/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '../../../common/cleanProps';
import getSelectionStart from './utils/getSelectionStart';
import getSelectionEnd from './utils/getSelectionEnd';
import setInputSelection from './utils/setInputSelection';
import throttle from '../../../common/throttle';
import join from '../../../common/join';
import getCursorPosition from './utils/getCursorPosition';

class TextInput extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.updateValue = this.updateValue.bind(this);

    if (props.throttle) {
      this.updateThrottledUpdateValue(props.throttle);
    }

    this.state = {
      value: props.value,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.throttle && this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
    if (this.props.throttle !== nextProps.throttle) {
      this.updateThrottledUpdateValue(nextProps.throttle);
    }
  }

  componentDidUpdate(prevProps) {
    /**
     * Before the suggestion is added we must weight for the
     * value to come back from the parent. Because it may be controlled.
     * Also the value must not be send as value, to not influence the fiter.
     *
     * Also the new value must be longer, so it will not add the suggestion
     * when the text is removed/erased.
     */

    const previousValue = prevProps.value || '';
    const currentValue = this.props.value || '';

    if (previousValue != currentValue) {
      clearTimeout(this.suggestionTimeOut);
    }

    if (
      this.props.suggestion &&
      // suggestion must not be the same as value
      this.props.suggestion !== currentValue &&
      this.props.autocomplete &&
      currentValue !== previousValue &&
      currentValue.length > previousValue.length
    ) {
      this.suggestionTimeOut = setTimeout(() => {
        this.selectForwardIfNecessary();
      }, this.props.autocompleteDelay);
    }
  }

  componentWillUnmount() {
    if (this.suggestionTimeOut) {
      clearTimeout(this.suggestionTimeOut);
      this.suggestionTimeOut = null;
    }
  }

  updateThrottledUpdateValue(throttleDelay) {
    this.throttledUpdateValue = throttle(this.updateValue, throttleDelay, {
      trailing: true,
      leading: false,
    });
  }

  render() {
    const {
      rootClassName,
      onClick,
      maxWidth,
      visible,
      searchable,
    } = this.props;

    const className = join(
      `${rootClassName}__wrapper`,
      this.props.className,
      !visible && `${rootClassName}__wrapper--invisible`,
      !searchable && `${rootClassName}__wrapper--non-searchable`
    );

    const value = this.getValue() || '';
    const valueLength = value != null && value.length;
    const size = valueLength ? valueLength + 1 : 1;

    const inputStyle = {};
    if (size === 1 && valueLength === 0) {
      inputStyle.width = 1;
    }

    if (maxWidth) {
      inputStyle.maxWidth = maxWidth;
    }

    return (
      <span
        {...cleanProps(this.props, TextInput.propTypes)}
        onClick={onClick}
        className={className}
      >
        <input
          style={inputStyle}
          className={rootClassName}
          ref={ref => (this.inputNode = ref)}
          type="text"
          value={value || ''}
          onChange={this.handleChange}
          onClick={this.onClick}
          tabIndex={this.props.tabIndex}
          onMouseDown={this.handleMouseDown}
          size={size}
        />
        {!value && this.renderPlaceholder()}
      </span>
    );
  }

  renderPlaceholder() {
    if (!this.props.placeholder) {
      return null;
    }

    const placeholderProps = {
      className: `${this.props.rootClassName}__placeholder`,
    };

    return (
      <span {...placeholderProps} ref={ref => (this.placeholderNode = ref)}>
        {this.props.placeholder}
      </span>
    );
  }

  getValue() {
    let value = this.props.throttle ? this.state.value : this.props.value;

    return value;
  }

  focus() {
    if (this.inputNode && this.inputNode.focus) {
      this.inputNode.focus();
    }
  }

  blur() {
    if (this.inputNode && this.inputNode.blur) {
      this.inputNode.blur();
    }
  }

  hasFocus() {
    const activeElement =
      global && global.document && global.document.activeElement;
    return this.inputNode === activeElement;
  }

  handleChange(event) {
    const value = event.target.value;
    if (this.props.throttle) {
      this.setState({ value });
      this.throttledUpdateValue(value);
    } else {
      this.updateValue(value);
    }
  }

  handleMouseDown(event) {
    /**
     * preventDefault is set on mouseDown
     * evets on combo so that input doesn't lose focus.
     * This makes so the cursor cannot be moved with click.
     *
     * To let this event behave normal, we stop propagation so it is not
     * called on it preventDefault.
     */
    event.stopPropagation();
  }

  onClick(event) {
    event.stopPropagation();
  }

  updateValue(value) {
    this.props.onChange(value);
  }

  selectForwardIfNecessary(value = this.props.value) {
    if (!value || typeof value !== 'string') {
      return null;
    }

    const suggestion = this.props.suggestion;
    if (typeof suggestion !== 'string') {
      return null;
    }

    if (suggestion.toLowerCase().indexOf(value.toLowerCase()) === -1) {
      return null;
    }

    const firstPartLength = value.length;
    const inputNode = this.inputNode;

    this.inputNode.value = suggestion;
    this.inputNode.size = this.inputNode.value.length;
    this.inputNode.style.width = 'auto';

    setInputSelection(inputNode, firstPartLength, suggestion.length);
    return true;
  }

  getSelectionStart() {
    return getSelectionStart(this.inputNode);
  }

  getSelectionEnd() {
    return getSelectionEnd(this.inputNode);
  }

  hasSelection() {
    return this.getSelectionStart() !== this.getSelectionEnd();
  }

  isCursorAtStartPosition() {
    return this.getSelectionStart() === 0;
  }

  isCursorAtEndPosition() {
    const cursorLastPissiblePosition =
      this.props.value && this.props.value.length;

    return getCursorPosition(this.inputNode) === cursorLastPissiblePosition;
  }
}

function emptyFn() {}
TextInput.defaultProps = {
  onChange: emptyFn,
  value: '',
  autocomplete: true,
};

TextInput.propTypes = {
  rootClassName: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number),
  ]),
  placeholder: PropTypes.node,
  onChange: PropTypes.func,
  maxWidth: PropTypes.number,
  throttle: PropTypes.number,
  tabIndex: PropTypes.number,
  autocomplete: PropTypes.bool,
  autocompleteDelay: PropTypes.number,
  visible: PropTypes.bool,
  suggestion: PropTypes.any,
  searchable: PropTypes.bool,
};

export default TextInput;
