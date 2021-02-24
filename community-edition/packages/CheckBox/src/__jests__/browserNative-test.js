/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';

import Check from '../CheckBox';

import { render } from '../../../common/testUtils';

describe('BrowserNative', () => {
  it('should render indeterminate when there is custom value', () => {
    const checkbox = render(
      <Check
        supportIndeterminate
        browserNative
        checked={5}
        indeterminateValue={5}
      >
        1
      </Check>
    );
    const node = findDOMNode(checkbox).querySelector('input');
    expect(node.indeterminate).toEqual(true);

    checkbox.rerender(
      <Check
        supportIndeterminate
        browserNative
        checked={'yes'}
        checkedValue="yes"
        indeterminateValue={5}
      />
    );
    expect(node.indeterminate).toEqual(false);
    expect(node.checked).toEqual(true);

    checkbox.unmount();
  });
});
