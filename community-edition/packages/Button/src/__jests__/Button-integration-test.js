/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import Button from '../Button';
import { render, simulateMouseEvent } from '../../../common/testUtils';

describe('Button verticalAlign', () => {
  it('should add the correct className', () => {
    const button = render(
      <Button iconPosition="right" icon={<b>bold</b>}>
        text
      </Button>
    );

    expect(findDOMNode(button).className).toContain('--vertical-align-middle');

    button.unmount();
  });
});

xdescribe('Button icon', () => {
  it('should support jsx', () => {
    const button = render(
      <Button iconPosition="right" icon={<b>bold</b>}>
        text
      </Button>
    );

    expect(findDOMNode(button).innerText).to.equal('text\nbold');
    button.unmount();
  });

  it('should support function with component state', () => {
    const button = render(
      <Button
        iconPosition="right"
        icon={({ active }) => {
          return active ? 'YES' : 'NO';
        }}
      />
    );

    const dom = findDOMNode(button);

    expect(dom.innerText).to.equal('NO');

    simulateMouseEvent('mousedown', dom);
    expect(dom.innerText).to.equal('YES');

    simulateMouseEvent('mouseup', dom);
    expect(dom.innerText).to.equal('NO');

    button.unmount();
  });
});

xdescribe('Button wrap', () => {
  it('when ellipsis: true and wrap: true, ellipsis should win and make text not wrap', () => {
    const button = render(<Button ellipsis={true} wrap={true} />);

    const node = findDOMNode(button);

    expect(getComputedStyle(node)['white-space']).to.equal('nowrap');

    button.unmount();
  });
});

xdescribe('Button overflow', () => {
  it('should work when true or false', () => {
    const button = render(<Button overflow />);
    const node = findDOMNode(button);

    // since ellipsis defaults to true, and wins
    expect(getComputedStyle(node)['overflow']).to.equal('hidden');

    button.rerender(<Button ellipsis={false} />);
    // visible is the default overflow style applied to the button
    expect(getComputedStyle(node)['overflow']).to.equal('visible');

    button.rerender(<Button overflow ellipsis={false} />);
    expect(getComputedStyle(node)['overflow']).to.equal('visible');

    button.rerender(<Button ellipsis={false} overflow={false} />);
    expect(getComputedStyle(node)['overflow']).to.equal('hidden');

    button.unmount();
  });
});
