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

import { render } from '../../../common/testUtils';

describe('Styles and render', () => {
  it('should use a custom renderIcon function', () => {
    const uncheckedIcon = () => <span>valid JSX</span>;
    const checkbox = render(<Check uncheckedIcon={uncheckedIcon}>hello</Check>);
    const node = findDOMNode(checkbox);
    const img = node.querySelector('span');
    expect(img.innerHTML).toEqual('valid JSX');
    checkbox.unmount();
  });

  it('should use a custom renderIcon JSX with valid style', () => {
    const uncheckedIcon = (
      <span style={{ border: 'red', color: 'yellow' }}>valid JSX</span>
    );
    const checkbox = render(<Check uncheckedIcon={uncheckedIcon}>hello</Check>);
    const node = findDOMNode(checkbox);
    const img = node.querySelector('span');
    expect(img.innerHTML).toEqual('valid JSX');
    expect(img.style.color).toEqual('yellow');
    expect(img.style.border).toEqual('red');
    checkbox.unmount();
  });

  it('should use a custom renderIcon JSX with empty style', () => {
    const uncheckedIcon = <span style={{}}>valid JSX</span>;
    const checkbox = render(<Check uncheckedIcon={uncheckedIcon}>hello</Check>);
    const node = findDOMNode(checkbox);
    const img = node.querySelector('span');
    expect(img.innerHTML).toEqual('valid JSX');
    checkbox.unmount();
  });

  it('should use custom icon size', () => {
    const checkbox = render(
      <Check uncheckedIconSrc="dummy-icon" iconSize={[30, 60]}>
        hello
      </Check>
    );
    const node = findDOMNode(checkbox);
    const img = node.querySelector('img');
    expect(img.style.width).toEqual('30px');
    expect(img.style.height).toEqual('60px');
    checkbox.unmount();
  });

  it('should apply readOnlyClassName correctly', () => {
    const checkbox = render(
      <Check readOnly readOnlyClassName={'cls-onlyread'}>
        hello
      </Check>
    );
    const node = findDOMNode(checkbox);
    expect(node.className).toContain('cls-onlyread');
    checkbox.unmount();
  });

  it('should apply disabledClassName correctly', () => {
    const checkbox = render(
      <Check disabled disabledClassName={'dsbld'}>
        hello
      </Check>
    );
    const node = findDOMNode(checkbox);
    expect(node.className).toContain('dsbld');
    checkbox.unmount();
  });

  it('should apply iconClassName correctly', () => {
    const checkbox = render(<Check iconClassName="simple-icon">hello</Check>);
    const found = !!findDOMNode(checkbox).querySelector('.simple-icon');
    expect(found).toEqual(true);
    checkbox.unmount();
  });

  it('should take the iconClassName if available', () => {
    const checkbox = render(
      <Check
        uncheckedIconSrc="unchecked-dummy-url"
        iconClassName="testClassName"
      >
        hello
      </Check>
    );
    const node = findDOMNode(checkbox);
    const img = node.querySelector('img');
    expect(img.className).toEqual('testClassName');
    checkbox.unmount();
  });

  it('should not have tabIndex if disabled', () => {
    const checkbox = render(
      <Check
        uncheckedIconSrc="unchecked-dummy-url"
        disabled={true}
        tabIndex={1}
      >
        hello
      </Check>
    );
    const node = findDOMNode(checkbox);
    expect(node.tabIndex).toEqual(-1);
    checkbox.unmount();
  });

  it('should have tabIndex 0 if is not disabled', () => {
    const checkbox = render(<Check uncheckedIconSrc="dummy-icon" />);
    const node = findDOMNode(checkbox);
    expect(node.tabIndex).toEqual(0);
    checkbox.unmount();
  });

  it('should have tabIndex if is not disabled, and there are no child elements', () => {
    const checkbox = render(
      <Check uncheckedIconSrc="dummy-icon" tabIndex={1} />
    );
    const node = findDOMNode(checkbox);
    expect(node.tabIndex).toEqual(1);
    checkbox.unmount();
  });

  it('should apply a custom disabledStyle if provided', () => {
    const checkbox = mount(
      <Check
        uncheckedIconSrc="dummy-icon"
        disabled={true}
        disabledStyle={{ color: 'magenta', border: '1px solid yellow' }}
      />
    );
    const node = checkbox.find('div').first();
    expect(node.props().style.color).toEqual('magenta');
    expect(node.props().style.border).toEqual('1px solid yellow');
  });

  it('should apply a custom readonlyStyle if provided', () => {
    const checkbox = mount(
      <Check
        uncheckedIconSrc="dummy-icon"
        readOnly={true}
        readOnlyStyle={{ color: 'magenta', border: '1px solid yellow' }}
      />
    );
    const node = checkbox.find('div').first();

    expect(node.props().style.color).toEqual('magenta');
    expect(node.props().style.border).toEqual('1px solid yellow');
  });
});
