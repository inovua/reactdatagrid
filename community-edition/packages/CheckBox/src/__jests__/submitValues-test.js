/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';

import Check from '../CheckBox';

import { render } from '../testUtils';

const INDETERMINATE = 'indeterminate_test_value';
const UNCHECKED = 'unchecked_test_value';
const CHECKED = 'checked_test_value';

describe('Hidden submit input', () => {
  it('should be rendered when prop name is provided', () => {
    const checkbox = render(<Check name="checkboxName" />);
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input[name="checkboxName"]');
    expect(input.type).toEqual('hidden');
    checkbox.unmount();
  });

  it('should not be rendered when prop name is not provided', () => {
    const checkbox = render(<Check />); //note there is no name here
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input).toEqual(null);
    checkbox.unmount();
  });

  it('should not be rendered when is disabled', () => {
    const checkbox = render(<Check name="anyValue" disabled={true} />);
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input).toEqual(null);
    checkbox.unmount();
  });

  it('should not render if shouldSubmit prevents this', () => {
    const checkbox = render(<Check name="validName" shouldSubmit={false} />);
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input).toEqual(null);
    checkbox.unmount();
  });

  it('should render if shouldSubmit allows this', () => {
    const checkbox = render(<Check name="validName" shouldSubmit={true} />);
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input).not.toEqual(null);
    checkbox.unmount();
  });

  it('should not render if shouldSubmit() prevents this', () => {
    const checkbox = render(
      <Check name="validName" shouldSubmit={() => false} />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input).toEqual(null);
    checkbox.unmount();
  });

  it('should render if shouldSubmit() allows this', () => {
    const checkbox = render(
      <Check name="validName" shouldSubmit={() => true} />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input).not.toEqual(null);
    checkbox.unmount();
  });

  it('should log a warning if showWarnings and shouldSubmit() returns true, but no name provided', () => {
    let thrownMessage;
    const spiedConsoleWarn = function(message) {
      thrownMessage = message;
    };
    if (typeof console !== 'undefined') {
      const originalConsoleWarning = console.warn;
      console.warn = spiedConsoleWarn;
      const checkbox = render(<Check shouldSubmit={() => true} />);
      console.warn = originalConsoleWarning;
      expect(thrownMessage).toContain(
        'shouldSubmit function returned true, but "name" prop is missing'
      );
      checkbox.unmount();
    }
  });

  it('should not log a warning if showWarnings is disabled and shouldSubmit() returns true, but no name provided', () => {
    let errorMessageWasNotLogged = true;
    const spiedConsoleWarn = function(message) {
      errorMessageWasNotLogged = false;
    };
    if (typeof console !== 'undefined') {
      const originalConsoleWarning = console.warn;
      console.warn = spiedConsoleWarn;
      const checkbox = render(
        <Check showWarnings={false} shouldSubmit={() => true} />
      );
      console.warn = originalConsoleWarning;
      expect(errorMessageWasNotLogged).toEqual(true);
      checkbox.unmount();
    }
  });

  it('should throw error if shouldSubmit, but no name provided', () => {
    let thrownMessage;
    const spiedConsoleError = function(message) {
      thrownMessage = message;
    };
    if (typeof console !== 'undefined') {
      const originalConsoleError = console.error;
      console.error = spiedConsoleError;
      const checkbox = render(<Check shouldSubmit={true} />);
      console.error = originalConsoleError;
      expect(thrownMessage).toContain('requires prop "name" to be submitted');
      checkbox.unmount();
    }
  });

  it('should throw error if value is provided, as we used checked to set the state instead', () => {
    let loggedError;
    const spiedConsoleError = function(message) {
      loggedError = message;
    };
    if (typeof console !== 'undefined') {
      const originalConsoleError = console.error;
      console.error = spiedConsoleError;
      const checkbox = render(<Check value="checked" />);
      console.error = originalConsoleError;
      expect(loggedError).toContain(
        '"value" prop is not supported. Use "checked" instead.'
      );
      checkbox.unmount();
    }
  });

  it('should throw error if defaultValue is provided, as we used checked to set the state instead', () => {
    let loggedError;
    const spiedConsoleError = function(message) {
      loggedError = message;
    };
    if (typeof console !== 'undefined') {
      const originalConsoleError = console.error;
      console.error = spiedConsoleError;
      const checkbox = render(<Check defaultValue="checked" />);
      console.error = originalConsoleError;
      expect(loggedError).toContain(
        '"defaultValue" prop is not supported. Use "checked" instead.'
      );
      checkbox.unmount();
    }
  });

  it('should submit indeterminateSubmitValue if specified', () => {
    //null is the default indeterminateValue
    const checkbox = render(
      <Check
        name="someValue"
        checked={null}
        supportIndeterminate
        indeterminateSubmitValue={INDETERMINATE}
      />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input.value).toEqual(INDETERMINATE);
    checkbox.unmount();
  });

  it('should submit indeterminateValue when indeterminateSubmitValue is not specified', () => {
    const checkbox = render(
      <Check
        name="someValue"
        supportIndeterminate
        checked={INDETERMINATE}
        indeterminateValue={INDETERMINATE}
      />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input.value).toEqual(INDETERMINATE);
    checkbox.unmount();
  });

  it('should submit empty string instead of null indeterminateValue', () => {
    const checkbox = render(
      <Check
        name="someValue"
        supportIndeterminate
        checked={null}
        indeterminateValue={null}
      />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input.value).toEqual('');
    checkbox.unmount();
  });

  it('should submit uncheckedSubmitValue if specified', () => {
    const checkbox = render(
      <Check name="someValue" uncheckedSubmitValue={UNCHECKED} />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input.value).toEqual(UNCHECKED);
    checkbox.unmount();
  });

  it('should submit uncheckedValue when uncheckedSubmitValue is not specified', () => {
    const checkbox = render(
      <Check name="someValue" uncheckedValue={UNCHECKED} />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input.value).toEqual(UNCHECKED);
    checkbox.unmount();
  });

  it('should submit empty string instead of null uncheckedValue', () => {
    const checkbox = render(<Check name="someValue" uncheckedValue={null} />);
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input.value).toEqual('');
    checkbox.unmount();
  });

  it('should submit checkedSubmitValue if specified', () => {
    //null is the default indeterminateValue
    const checkbox = render(
      <Check name="someValue" checked={true} checkedSubmitValue={CHECKED} />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input.value).toEqual(CHECKED);
    checkbox.unmount();
  });

  it('should submit checkedValue when checkedSubmitValue is not specified', () => {
    const checkbox = render(
      <Check name="someValue" checked={CHECKED} checkedValue={CHECKED} />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input.value).toEqual(CHECKED);
    checkbox.unmount();
  });

  it('should log a warning if checkedSubmitValue is null', () => {
    if (typeof console !== 'undefined') {
      let thrownMessage;
      const originalConsoleError = console.error;
      const spiedConsoleError = function(message) {
        thrownMessage = message;
        originalConsoleError(message);
      };
      console.error = spiedConsoleError;
      const checkbox = render(<Check checkedSubmitValue={null} />);
      console.error = originalConsoleError;
      expect(thrownMessage).toContain('checkedSubmitValue is null');
      checkbox.unmount();
    }
  });

  it('should log a warning if uncheckedSubmitValue is null', () => {
    if (typeof console !== 'undefined') {
      let thrownMessage;
      const originalConsoleError = console.error;
      const spiedConsoleError = function(message) {
        thrownMessage = message;
        originalConsoleError(message);
      };
      console.error = spiedConsoleError;
      const checkbox = render(<Check uncheckedSubmitValue={null} />);
      console.error = originalConsoleError;
      expect(thrownMessage).toContain('uncheckedSubmitValue is null');
      checkbox.unmount();
    }
  });

  it('should log a warning if indeterminateSubmitValue is null', () => {
    if (typeof console !== 'undefined') {
      let thrownMessage;
      const originalConsoleError = console.error;
      const spiedConsoleError = function(message) {
        thrownMessage = message;
        originalConsoleError(message);
      };
      console.error = spiedConsoleError;
      const checkbox = render(<Check indeterminateSubmitValue={null} />);
      console.error = originalConsoleError;
      expect(thrownMessage).toContain('indeterminateSubmitValue is null');
      checkbox.unmount();
    }
  });

  it('should submit empty string instead of null checkedValue', () => {
    const checkbox = render(
      <Check name="someValue" checked={null} checkedValue={null} />
    );
    const node = findDOMNode(checkbox);
    const input = node.querySelector('input');
    expect(input.value).toEqual('');
    checkbox.unmount();
  });
});
