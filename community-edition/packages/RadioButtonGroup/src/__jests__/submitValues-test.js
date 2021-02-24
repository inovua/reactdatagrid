/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import { mount, shallow } from 'enzyme';

import RBG from '../RadioButtonGroup';

import { render } from './../testUtils';

const options = [
  {
    value: 'v1',
    label: 'bananas',
  },
  {
    value: 'v2',
    label: 'apples',
  },
  {
    value: 'v3',
    label: 'strawberries',
  },
  {
    value: 'v4',
    label: 'chocolate',
  },
];

describe('Hidden submit rbg', () => {
  it('should be rendered when prop name is provided', () => {
    const rbg = mount(<RBG radioOptions={options} name="rbgName" />);
    const input = rbg.find('input[name="rbgName"]');
    expect(input.prop('type')).toEqual('hidden');
  });

  it('should not be rendered when prop name is not provided', () => {
    const rbg = mount(<RBG radioOptions={options} />); //note there is no name here
    const input = rbg.find('input');
    expect(input.exists()).toEqual(false);
  });

  it('should not be rendered when is disabled', () => {
    const rbg = mount(<RBG radioOptions={options} name="anyValue" disabled />);
    const input = rbg.find('input');
    expect(input.exists()).toEqual(false);
  });

  it('should not render if shouldSubmit prevents this', () => {
    const rbg = mount(
      <RBG radioOptions={options} name="validName" shouldSubmit={false} />
    );
    const input = rbg.find('input');
    expect(input.exists()).toEqual(false);
  });

  it('should render if shouldSubmit allows this', () => {
    const rbg = mount(
      <RBG radioOptions={options} name="validName" shouldSubmit={true} />
    );
    const input = rbg.find('input');
    expect(input.exists()).toEqual(true);
  });

  it('should not render if shouldSubmit() prevents this', () => {
    const rbg = mount(
      <RBG radioOptions={options} name="validName" shouldSubmit={() => false} />
    );
    const input = rbg.find('input');
    expect(input.exists()).toEqual(false);
  });

  it('should render if shouldSubmit() allows this', () => {
    const rbg = mount(
      <RBG radioOptions={options} name="validName" shouldSubmit={() => true} />
    );
    const input = rbg.find('input');
    expect(input.exists()).toEqual(true);
  });

  it('should log a warning if showWarnings and shouldSubmit() returns true, but no name provided', () => {
    let thrownMessage;
    const spiedConsoleWarn = function(message) {
      thrownMessage = message;
    };
    if (typeof console !== 'undefined') {
      const originalConsoleWarning = console.warn;
      console.warn = spiedConsoleWarn;
      const rbg = mount(
        <RBG radioOptions={options} shouldSubmit={() => true} />
      );
      console.warn = originalConsoleWarning;
      expect(thrownMessage).toContain(
        'shouldSubmit function returned true, but "name" prop is missing'
      );
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
      const rbg = mount(
        <RBG
          radioOptions={options}
          showWarnings={false}
          shouldSubmit={() => true}
        />
      );
      console.warn = originalConsoleWarning;
      expect(errorMessageWasNotLogged).toEqual(true);
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
      const rbg = mount(<RBG radioOptions={options} shouldSubmit={true} />);
      console.error = originalConsoleError;
      expect(thrownMessage).toContain('requires prop "name" to be submitted');
    }
  });

  it('should throw error if value is provided, as we used radioValue to set the state instead', () => {
    let loggedError;
    const spiedConsoleError = function(message) {
      loggedError = message;
    };
    if (typeof console !== 'undefined') {
      const originalConsoleError = console.error;
      console.error = spiedConsoleError;
      const rbg = mount(<RBG radioOptions={options} value="checked" />);
      console.error = originalConsoleError;
      expect(loggedError).toContain(
        '"value" prop is not supported. Use "radioValue" instead.'
      );
    }
  });

  it('should throw error if defaultValue is provided, as we used radioValue to set the state instead', () => {
    let loggedError;
    const spiedConsoleError = function(message) {
      loggedError = message;
    };
    if (typeof console !== 'undefined') {
      const originalConsoleError = console.error;
      console.error = spiedConsoleError;
      const rbg = mount(<RBG radioOptions={options} defaultValue="checked" />);
      console.error = originalConsoleError;
      expect(loggedError).toContain(
        '"defaultValue" prop is not supported. Use "defaultRadioValue" instead.'
      );
    }
  });

  it('should submit empty string instead of null uncheckedValue', () => {
    const wrapper = mount(<RBG radioOptions={options} name="someValue" />);
    const input = wrapper.find('input');
    expect(input.prop('value')).toEqual(undefined);
  });

  xit('should log a warning if checkedSubmitValue is null', () => {
    if (typeof console !== 'undefined') {
      let thrownMessage;
      const originalConsoleError = console.error;
      const spiedConsoleError = function(message) {
        thrownMessage = message;
        originalConsoleError(message);
      };
      console.error = spiedConsoleError;
      const rbg = render(
        <RBG radioOptions={options} checkedSubmitValue={null} />
      );
      console.error = originalConsoleError;
      expect(thrownMessage).to.contain('checkedSubmitValue is null');
      rbg.unmount();
    }
  });

  xit('should log a warning if uncheckedSubmitValue is null', () => {
    if (typeof console !== 'undefined') {
      let thrownMessage;
      const originalConsoleError = console.error;
      const spiedConsoleError = function(message) {
        thrownMessage = message;
        originalConsoleError(message);
      };
      console.error = spiedConsoleError;
      const rbg = render(
        <RBG radioOptions={options} uncheckedSubmitValue={null} />
      );
      console.error = originalConsoleError;
      expect(thrownMessage).to.contain('uncheckedSubmitValue is null');
      rbg.unmount();
    }
  });

  xit('should log a warning if indeterminateSubmitValue is null', () => {
    if (typeof console !== 'undefined') {
      let thrownMessage;
      const originalConsoleError = console.error;
      const spiedConsoleError = function(message) {
        thrownMessage = message;
        originalConsoleError(message);
      };
      console.error = spiedConsoleError;
      const rbg = render(
        <RBG radioOptions={options} indeterminateSubmitValue={null} />
      );
      console.error = originalConsoleError;
      expect(thrownMessage).to.contain('indeterminateSubmitValue is null');
      rbg.unmount();
    }
  });
});
