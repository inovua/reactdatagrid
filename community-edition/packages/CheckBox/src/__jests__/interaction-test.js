/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';

import { mount } from 'enzyme';
import Check from '../CheckBox';

const CHECKED = 'checked';
const INDETERMINATE = 'indeterminate';
const UNCHECKED = 'UNCHECKED';

describe('Interaction tests', () => {
  it('should not call onClick when disabled', () => {
    let onClickCalled = false;
    const check = mount(
      <Check
        disabled
        onClick={() => {
          onClickCalled = true;
        }}
      />
    );

    check.simulate('click');
    expect(onClickCalled).toEqual(false);

    check.unmount();
  });

  xit('should have pointer-events none', () => {
    const checkbox = mount(<Check disabled />);

    const node = findDOMNode(checkbox);
    expect(getComputedStyle(node)['pointer-events']).toEqual('none');
    checkbox.unmount();
  });

  it('should call onClick when not disabled', () => {
    let onClickCalled = false;
    const check = mount(
      <Check
        onClick={() => {
          onClickCalled = true;
        }}
      />
    );
    check.simulate('click');
    expect(onClickCalled).toEqual(true);
    check.unmount();
  });

  it('setChecked(indeterminateValue) should not do anything if the checkbox does not support indeterminate state', () => {
    const check = mount(
      <Check
        uncheckedIconSrc="unchecked-src-x"
        checkedIconSrc="checked-dummy-src-y"
        indeterminateValue={4}
        defaultChecked={true}
      />
    );
    let img = check.find('img');
    expect(img.props().src).toContain('checked-dummy-src-y');
    check.instance().setChecked(4);
    img = check.find('img');
    expect(img.props().src).toContain('checked-dummy-src-y');
    check.unmount();
  });

  it('should handle onClick', () => {
    let onClickCalledTimes = 0;
    const clickHandler = () => onClickCalledTimes++;
    const checkbox = mount(<Check onClick={clickHandler} />);

    checkbox.simulate('click');
    expect(onClickCalledTimes).toEqual(1);
    checkbox.unmount();
  });

  xit('should check if space is pressed', () => {
    let onKeyDownCalledTimes = 0;
    const keyDownHandler = () => onKeyDownCalledTimes++;
    const checkbox = mount(
      <Check
        onKeyDown={keyDownHandler}
        uncheckedIconSrc="unchecked-dummy-src-x"
        checkedIconSrc="checked-dummy-src-y"
        supportIndeterminate={false}
      />
    );
    let img = checkbox.find('img');
    expect(img.props().src).toContain('unchecked-dummy-src-x');
    checkbox.simulate('keydown', ' ');
    expect(onKeyDownCalledTimes).toEqual(1);
    expect(img.props().src).toContain('checked-dummy-src-y');
    checkbox.unmount();
  });

  it('should not check if a key different than Enter is pressed', () => {
    let onKeyDownCalledTimes = 0;
    const keyDownHandler = () => onKeyDownCalledTimes++;
    const checkbox = mount(
      <Check
        onKeyDown={keyDownHandler}
        uncheckedIconSrc="unchecked-dummy-src"
        checkedIconSrc="checked-dummy-src"
        supportIndeterminate={false}
      />
    );
    let img = checkbox.find('img');
    expect(img.props().src).toContain('unchecked-dummy-src');
    checkbox.simulate('keydown', ' ');
    expect(onKeyDownCalledTimes).toEqual(1);
    img = checkbox.find('img');
    expect(img.props().src).toContain('unchecked-dummy-src');
    checkbox.unmount();
  });

  it('should check on click when component is not controlled', () => {
    const checkbox = mount(
      <Check
        checkedIconSrc="checked-dummy-url"
        uncheckedIconSrc="unchecked-dummy-url"
        supportIndeterminate={false}
      />
    );
    let img = checkbox.find('img');
    try {
      expect(img.props().src).toContain('unchecked-dummy-url');
      checkbox.simulate('click');
      img = checkbox.find('img');
      expect(img.props().src).toContain('checked-dummy-url');
    } finally {
      checkbox.unmount();
    }
  });

  it('should check on click on icon when iconCheckOnly is set to `true`', () => {
    let onChangeCallTimes = 0;
    const checkbox = mount(
      <Check
        iconCheckOnly={true}
        checkedIconSrc="checked-dummy-url"
        uncheckedIconSrc="unchecked-dummy-url"
        supportIndeterminate={false}
        onChange={() => onChangeCallTimes++}
      />
    );

    let img = checkbox.find('img');
    expect(img.props().src).toContain('unchecked-dummy-url');
    img.simulate('click');
    img = checkbox.find('img');
    expect(img.props().src).toContain('checked-dummy-url');
    expect(onChangeCallTimes).toEqual(1);
    checkbox.unmount();
  });

  it('should not check on click outside icon when iconCheckOnly is set to `true`', () => {
    let onChangeCallTimes = 0;
    const checkbox = mount(
      <Check
        iconCheckOnly={true}
        checkedIconSrc="checked-dummy-url"
        uncheckedIconSrc="unchecked-dummy-url"
        onChange={() => onChangeCallTimes++}
        supportIndeterminate={false}
      />
    );

    let img = checkbox.find('img');
    expect(img.props().src).toContain('unchecked-dummy-url');
    checkbox.simulate('click');
    img = checkbox.find('img');
    expect(img.props().src).toContain('unchecked-dummy-url');
    expect(onChangeCallTimes).toEqual(0);
    checkbox.unmount();
  });

  it('should check on click when component is not controlled with defaultChecked', () => {
    const checkbox = mount(
      <Check
        checkedIconSrc="checked-dummy-url"
        uncheckedIconSrc="unchecked-dummy-url"
        defaultChecked={true}
      />
    );
    let img = checkbox.find('img');
    expect(img.props().src).toContain('checked-dummy-url');
    checkbox.simulate('click');
    img = checkbox.find('img');
    expect(img.props().src).toContain('unchecked-dummy-url');
    checkbox.unmount();
  });

  it('should not go to indeterminate state if supportIndeterminate is false', () => {
    const checkbox = mount(
      <Check
        checkedValue={CHECKED}
        uncheckedValue={UNCHECKED}
        supportIndeterminate={false} //checked is undefined!
        checkedIconSrc={CHECKED + '_dummy_src'}
        uncheckedIconSrc={UNCHECKED + '_dummy_src'}
        indeterminateIconSrc={INDETERMINATE + '_dummy_src'}
      />
    );

    const img = checkbox.find('img');
    expect(img.props().src).toEqual(UNCHECKED + '_dummy_src');
    checkbox.simulate('click');

    expect(checkbox.find('img').props().src).toEqual(CHECKED + '_dummy_src');
    checkbox.unmount();
  });

  it('should not change the state to checked when component is controlled (checked = null -> indeterminate)', () => {
    // null is also the value of indeterminate
    const checkbox = mount(
      <Check
        checked={null}
        supportIndeterminate
        indeterminateIconSrc="indeterminate-dummy-url"
      />
    );

    const img = checkbox.find('img');
    checkbox.simulate('click');

    expect(checkbox.find('img').props().src).toContain(
      'indeterminate-dummy-url'
    );
    checkbox.unmount();
  });

  it('should not change the state to checked when component is controlled (checked = null -> unchecked*)', () => {
    //null is also the value of indeterminate, but this time, supportIndeterminate is false
    const checkbox = mount(
      <Check
        checked={null}
        uncheckedIconSrc="unchecked-dummy-url"
        supportIndeterminate={false}
      />
    );
    const img = checkbox.find('img');
    checkbox.simulate('click');

    expect(checkbox.find('img').props().src).toContain('unchecked-dummy-url');
    checkbox.unmount();
  });

  it('should not change the state to checked when component is controlled (checked = "a string -> unchecked")', () => {
    const checkbox = mount(
      <Check
        checked={'a string'}
        uncheckedIconSrc="unchecked-dummy-url"
        indeterminateIconSrc="indeterminate-dummy-url"
      />
    );

    let img = checkbox.find('img');
    checkbox.simulate('click');
    img = checkbox.find('img');
    expect(img.props().src).toContain('unchecked-dummy-url');
    checkbox.unmount();
  });

  it('should call the onChange when component is controlled', () => {
    let onChangedCalledTimes = 0;
    const checkbox = mount(
      <Check
        checked={'anything'}
        onChange={() => onChangedCalledTimes++}
        uncheckedIconSrc="unchecked-dummy-url"
        indeterminateIconSrc="indeterminate-dummy-url"
      />
    );

    let img = checkbox.find('img');
    checkbox.simulate('click');
    img = checkbox.find('img');
    expect(img.props().src).toContain('unchecked-dummy-url');
    checkbox.unmount();
  });

  it('should apply focused style if available', () => {
    const checkbox = mount(
      <Check
        checkedIconSrc="checked-dummy-url"
        uncheckedIconSrc="unchecked-dummy-url"
        defaultChecked={true}
        focusedStyle={{ border: '4px solid red' }}
      />
    );
    checkbox.simulate('click');
    checkbox.simulate('focus');
    const node = checkbox.find('div').first();
    expect(node.props().style.border).toEqual('4px solid red');
    checkbox.unmount();
  });

  it('should call the onFocus event if available', () => {
    let onFocusCallTimes = 0;
    const onFocusHandler = () => onFocusCallTimes++;
    const checkbox = mount(
      <Check
        checkedIconSrc="checked-dummy-url"
        uncheckedIconSrc="unchecked-dummy-url"
        defaultChecked={true}
        onFocus={onFocusHandler}
      />
    );

    checkbox.simulate('focus');
    expect(onFocusCallTimes).toEqual(1);
    checkbox.unmount();
  });

  it('should call the onBlur event if available', () => {
    let onBlurCallTimes = 0;
    const onBlurHandler = () => onBlurCallTimes++;
    const checkbox = mount(
      <Check
        checkedIconSrc="checked-dummy-url"
        uncheckedIconSrc="unchecked-dummy-url"
        defaultChecked={true}
        onBlur={onBlurHandler}
      />
    );

    checkbox.simulate('blur');
    expect(onBlurCallTimes).toEqual(1);
    checkbox.unmount();
  });

  it('should not change if disabled', () => {
    let onChangeCallTimes = 0;
    let onChangeHandler = () => onChangeCallTimes++;
    const checkbox = mount(
      <Check onChange={onChangeHandler} disabled={true} />
    );

    checkbox.simulate('click');
    expect(onChangeCallTimes).toEqual(0);
    checkbox.unmount();
  });

  it('should not change if readonly', () => {
    let onChangeCallTimes = 0;
    let onChangeHandler = () => onChangeCallTimes++;
    const checkbox = mount(
      <Check onChange={onChangeHandler} readOnly={true} />
    );

    checkbox.simulate('click');
    expect(onChangeCallTimes).toEqual(0);
    checkbox.unmount();
  });
});
