/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';

import { mount } from 'enzyme';

import { render } from './utils';

import VirtualList from '../index';

describe('VirtualList', () => {
  it('should render a ScrollContainer', () => {
    const list = render(<VirtualList count={0} renderRow={() => {}} />);
    const listNode = findDOMNode(list);

    expect(listNode.className).to.contain(
      'inovua-react-virtual-scroll-container'
    );

    expect(listNode.innerText).to.equal('');
  });

  it('should not call renderRow when count=0', done => {
    let renderCount = 0;

    const renderRow = () => {
      renderCount++;
    };
    const list = render(<VirtualList count={0} renderRow={renderRow} />);
    const listNode = findDOMNode(list);

    setTimeout(() => {
      expect(renderCount).to.equal(0);

      done();
    }, 30);
  });

  it('should render a some rows', done => {
    const renderRow = ({ index }) => {
      return <div>Row {index}.</div>;
    };

    const list = render(<VirtualList count={3} renderRow={renderRow} />);
    const listNode = findDOMNode(list);

    setTimeout(() => {
      expect(listNode.innerText).to.contain('Row 0.Row 1.Row 2.');

      done();
    }, 120);
  });

  xit('should call onViewResize', done => {
    const renderRow = ({ index }) => {
      return (
        <div key={index} className="virtual-list-row">
          Row {index}.
        </div>
      );
    };

    const onViewResize = sinon.spy();
    const cmp = render(
      <VirtualList
        count={3}
        renderRow={renderRow}
        scrollProps={{ onViewResize: onViewResize }}
      />
    );

    const node = findDOMNode(cmp);
    const firstRow = node.querySelector('.virtual-list-row');

    setTimeout(() => {
      expect(onViewResize.callCount).to.equal(1);

      expect(firstRow.innerText).to.equal('Row 0.');

      done();
    }, 20);
  });

  xit('should not re-render when props dont change', () => {
    const renderRow = ({ index }) => {
      return <div key={index}>Row {index}.</div>;
    };

    const spiedRender = sinon.spy(VirtualList.prototype, 'render');
    const returnFalse = () => false;
    const returnTrue = () => true;

    const wrapper = mount(<VirtualList count={3} renderRow={renderRow} />);

    expect(wrapper.text()).to.equal('Row 0.Row 1.Row 2.');

    wrapper.setProps({
      count: 3,
    });

    const initialCallCount = spiedRender.callCount;

    wrapper.setProps({
      count: 3,
    });

    expect(spiedRender.callCount).to.equal(initialCallCount);

    wrapper.setProps({
      renderRow: ({ index }) => {
        return <div key={index}>Row {index}.</div>;
      },
    });

    expect(spiedRender.callCount).to.equal(initialCallCount + 1);

    spiedRender.restore();
  });
});
