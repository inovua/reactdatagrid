/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import { mount, shallow } from 'enzyme';

import { render } from '../../../common/testUtils';
import { Flex, Item } from '../index';

const getStyle = instance => getComputedStyle(findDOMNode(render(instance)));

describe('Flex', () => {
  xit('props.row should apply flex-flow: row', () => {
    const style = getStyle(<Flex row flex={2} />);

    expect(style.flexGrow).toEqual('2');
    expect(style.flexFlow).toEqual('row wrap');
  });
  xit('props.column should apply flex-flow: column', () => {
    const style = getStyle(<Flex wrap={false} column />);

    expect(style.flexGrow).toEqual('0');
    expect(style.flexFlow).toEqual('column nowrap');
  });

  xit('props.alignItems should be applied correctly', () => {
    const style = getStyle(<Flex alignItems="end" />);

    expect(style.alignItems).toEqual('flex-end');
  });

  it('should accept className', () => {
    const instance = findDOMNode(render(<Flex className="xxx" />));

    expect(instance.className).toContain('xxx');
  });

  xit('should accept style', () => {
    const style = getStyle(<Flex style={{ marginLeft: 1 }} />);

    expect(style.marginLeft).toEqual('1px');
  });
});

describe('Item', () => {
  xit('should default to flex 1', () => {
    const style = getStyle(<Item />);

    expect(style.flexGrow).toEqual('1');
  });

  it('should accept className', () => {
    const instance = findDOMNode(render(<Item className="xxx" />));

    expect(instance.className).toContain('xxx');
  });

  xit('should accept style', () => {
    const style = getStyle(<Item style={{ marginLeft: 1 }} />);

    expect(style.marginLeft).toEqual('1px');
  });
});
