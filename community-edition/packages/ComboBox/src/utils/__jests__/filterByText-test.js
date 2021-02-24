/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import filterByText from '../filterByText';

describe('filterByText', () => {
  it('returns a list that matches text', () => {
    const data = [
      { label: 'test' },
      { label: 'foo' },
      { label: 'bar' },
      { label: 'fooBar' },
    ];
    const getFilterProperty = item => item.label;
    const test = filterByText({ data, getFilterProperty, text: 'foo' });

    expect(test).toEqual([{ label: 'foo' }, { label: 'fooBar' }]);
  });
  it('returns a list that matches text', () => {
    const data = [
      { label: 'test' },
      { label: 'foo' },
      { label: 'bar' },
      { label: 'xfooBar' },
    ];
    const getFilterProperty = item => item.label;
    const test = filterByText({
      data,
      getFilterProperty,
      text: 'foo',
      mode: 'startsWidth',
    });

    expect(test).toEqual([{ label: 'foo' }]);
  });
  it('returns a list with items for which filterFunction returned true', () => {
    const data = [
      { label: 'test' },
      { label: 'foo' },
      { label: 'bar' },
      { label: 'fooBar' },
    ];
    const getFilterProperty = item => item.label;
    const filterFunction = ({ item }) => item.label === 'foo';
    const test = filterByText({
      data,
      getFilterProperty,
      text: 'foo',
      filterFunction,
    });

    expect(test).toEqual([{ label: 'foo' }]);
  });
});
