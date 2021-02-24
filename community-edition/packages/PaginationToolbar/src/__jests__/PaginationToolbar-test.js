/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import { mount } from 'enzyme';

import PaginationToolbar from '../PaginationToolbar';

const getPageInput = toolbar =>
  toolbar
    .find('.inovua-react-pagination-toolbar__current-page')
    .first()
    .find('input');

const getIcon = (iconName, toolbar) =>
  toolbar.find(`div.inovua-react-pagination-toolbar__icon--named--${iconName}`);

const getIcons = toolbar => ({
  REFRESH: getIcon('REFRESH', toolbar),
  NEXT_PAGE: getIcon('NEXT_PAGE', toolbar),
  PREV_PAGE: getIcon('PREV_PAGE', toolbar),
  LAST_PAGE: getIcon('LAST_PAGE', toolbar),
  FIRST_PAGE: getIcon('FIRST_PAGE', toolbar),
});

describe('PaginationToolbar', () => {
  it('should work correctly with simple uncontrolled behavior', () => {
    let lastSkip = -1;
    let skipCalls = 0;

    const onSkipChange = skip => {
      lastSkip = skip;
      skipCalls++;
    };
    const toolbar = mount(
      <PaginationToolbar
        totalCount={100}
        defaultLimit={10}
        defaultSkip={0}
        onSkipChange={onSkipChange}
      />
    );

    let pageInput = getPageInput(toolbar);

    expect(pageInput.props().value).toEqual('1');

    const { NEXT_PAGE } = getIcons(toolbar);

    NEXT_PAGE.simulate('click');
    pageInput = getPageInput(toolbar);
    expect(pageInput.props().value).toEqual('2');
    expect(lastSkip).toEqual(10);
    expect(skipCalls).toEqual(1);

    NEXT_PAGE.simulate('click');
    pageInput = getPageInput(toolbar);
    expect(pageInput.props().value).toEqual('3');
    expect(lastSkip).toEqual(20);
    expect(skipCalls).toEqual(2);

    toolbar.unmount();
  });

  it('should work correctly when on the last page', done => {
    let lastSkip = -1;
    let skipCalls = 0;

    const onSkipChange = skip => {
      lastSkip = skip;
      skipCalls++;
    };
    const toolbar = mount(
      <PaginationToolbar
        totalCount={100}
        defaultLimit={10}
        defaultSkip={80}
        onSkipChange={onSkipChange}
      />
    );

    let pageInput = getPageInput(toolbar);

    expect(pageInput.props().value).toEqual('9');

    const { NEXT_PAGE, PREV_PAGE } = getIcons(toolbar);

    NEXT_PAGE.simulate('click');

    pageInput = getPageInput(toolbar);
    expect(pageInput.props().value).toEqual('10');
    expect(lastSkip).toEqual(90);
    expect(skipCalls).toEqual(1);

    // on another click do nothing, as there is no next page
    NEXT_PAGE.simulate('click');
    expect(pageInput.props().value).toEqual('10');
    expect(lastSkip).toEqual(90);
    expect(skipCalls).toEqual(1);

    // now to go page 5
    toolbar.instance().gotoPage(5);
    pageInput = getPageInput(toolbar);

    expect(lastSkip).toEqual(40);
    expect(skipCalls).toEqual(2);

    // now set limit to 25 and make sure we're on page 4
    toolbar.instance().setPageSize(25);
    expect(lastSkip).toEqual(75);
    expect(skipCalls).toEqual(3);

    PREV_PAGE.simulate('click');
    expect(lastSkip).toEqual(50);
    expect(skipCalls).toEqual(4);

    toolbar.unmount();

    done();
  });

  xit('should update current page from 0 to a value when totalCount goes from 0 to a value', done => {
    class Wrapper extends React.Component {
      constructor(props) {
        super(props);
        this.state = { totalCount: 0 };
      }

      render() {
        return (
          <PaginationToolbar
            ref={t => {
              this.toolbar = t;
            }}
            totalCount={this.state.totalCount}
            defaultLimit={10}
            defaultSkip={0}
          />
        );
      }

      setTotalCount(c) {
        this.setState({ totalCount: c });
      }
    }

    const app = mount(<Wrapper />);
    const toolbar = app.find(PaginationToolbar);

    let pageInput = getPageInput(toolbar);

    expect(pageInput.props().value).toEqual('0');

    app.instance().setTotalCount(100);

    setTimeout(() => {
      pageInput = getPageInput(toolbar);

      expect(pageInput.props().value).toEqual('1');

      app.unmount();

      done();
    }, 20);
  });
});
