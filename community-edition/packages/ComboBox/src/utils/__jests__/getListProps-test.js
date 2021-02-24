/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getListProps from '../getListProps';

describe('listProps', () => {
  it('select correct props for lsit', () => {
    const props = {
      listClassName: 'listClassName',
      listEmptyText: 'emptyText',
      listLoadingText: 'loading',
      selectedStyle: 'selectedStyle',
      selectedClassName: 'selectedClassName',
    };

    const computed = {
      data: [],
      idProperty: 'idProperty',
      displayProperty: 'displayProperty',
    };

    const test = getListProps({ props, computed });

    expect(test.className).toEqual(props.listClassName);

    expect(test.emptyText).toEqual(props.listEmptyText);
    expect(test.loadingText).toEqual(props.listLoadingText);

    expect(test.emptyText).toEqual(props.listEmptyText);
    expect(test.loadingText).toEqual(props.listLoadingText);

    expect(test.data).toEqual(computed.data);
    expect(test.getIdProperty).toEqual(computed.getIdProperty);
    expect(test.getDisplayProperty).toEqual(computed.getDisplayProperty);
  });
});
