/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import Combo from '../ComboBox';
import TextInput from '../TextInput';

const ROOT_CLASS = Combo.defaultProps.rootClassName;

describe('Combo style', () => {
  it('adds emptyStyle when combo has value null', () => {
    const wrapper = mount(
      <Combo value={null} emptyStyle={{ color: 'empty' }} />
    );
    expect(
      wrapper
        .find(`.${ROOT_CLASS}`)
        .at(0)
        .props().style.color
    ).toEqual('empty');
  });
  it('adds emptyClassName when value is empty', () => {
    const wrapper = mount(<Combo value={null} emptyClassName="hello" />);
    expect(wrapper.find('.hello')).toHaveLength(1);
  });
  it('adds disabledStyle when it is disabled', () => {
    const wrapper = mount(
      <Combo disabled disabledStyle={{ color: 'disabled' }} />
    );
    expect(
      wrapper
        .find(`.${ROOT_CLASS}`)
        .at(0)
        .props().style.color
    ).toEqual('disabled');
  });
  it('adds disabledClassName when disabled', () => {
    const wrapper = mount(<Combo disabled disabledClassName="disabled" />);
    expect(wrapper.find('.disabled')).toHaveLength(1);
  });
  it('adds focusedStyle when focused', () => {
    const wrapper = mount(<Combo focusedStyle={{ color: 'focused' }} />);
    wrapper.setState({ focus: true });
    expect(
      wrapper
        .find(`.${ROOT_CLASS}`)
        .at(0)
        .props().style.color
    ).toEqual('focused');
  });
  it('adds focusedClassName when it is focused', () => {
    const wrapper = mount(<Combo focusedClassName="focused" />);
    wrapper.setState({ focus: true });
    expect(wrapper.find('.focused')).toHaveLength(1);
  });

  describe('inputClassName', () => {
    it('gets applied on the input component', () => {
      const wrapper = mount(
        <Combo searchable text="hello world" inputClassName="customClassName" />
      );
      expect(wrapper.find('span.customClassName')).toHaveLength(1);
    });
  });

  describe('inputStyle', () => {
    it('getts applied on text input component', () => {
      const wrapper = mount(
        <Combo searchable text="hello world" inputStyle={{ color: 'red' }} />
      );
      expect(
        wrapper
          .find(TextInput)
          .at(0)
          .props().style.color
      ).toEqual('red');
    });
  });
});
