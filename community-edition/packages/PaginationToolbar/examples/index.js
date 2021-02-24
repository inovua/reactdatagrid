/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { render } from 'react-dom';
import Component from '../../packages/react-class';

import PaginationToolbar from '../src';
import TextInput from '../../TextInput';
import NumericInput from '../../NumericInput';
import ComboBox from '../../ComboBox';
import Button from '../../Button';

import '../../ArrowScroller/style/index.scss';
import ToolBar from '../../ToolBar';

import '../style/index.scss';
import '../../TextInput/style/index.scss';
import '../../NumericInput/style/index.scss';
import '../../ComboBox/style/index.scss';
import '../../Button/style/index.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      limit: 10,
      totalCount: 11100,
    };
  }
  onSkipChange(skip) {
    console.log(skip, 'skip');
    this.setState({
      skip,
    });
  }

  onLimitChange(limit) {
    console.log(limit, 'limit');
    this.setState({
      limit,
    });
  }

  render() {
    return (
      <div>
        <PaginationToolbar totalCount={100} defaultLimit={10} defaultSkip={0} />
        <div
          id="constrain"
          style={{
            marginBottom: 20,
            paddingTop: '50vh',
            border: '1px dashed green',
            textAlign: 'center',
          }}
        >
          <Button>Cancel</Button>
          <Button theme="light">Cancel</Button>
          <PaginationToolbar
            limit={this.state.limit}
            skip={this.state.skip}
            remotePagination
            onSkipChange={this.onSkipChange}
            onLimitChange={this.onLimitChange}
            totalCount={this.state.totalCount}
            constrainTo={'#constrain'}
          />
        </div>
        <button onClick={this.setSkip}>set skip: 50</button>
        <button onClick={this.setLimit}>set limit: 25</button>
        <button onClick={this.setTotalCount}>set totalCount: 50</button>
      </div>
    );
  }

  setTotalCount() {
    this.setState({
      totalCount: 50,
    });
  }

  setSkip() {
    this.setState({
      skip: 50,
    });
  }

  setLimit() {
    this.setState({
      limit: 25,
    });
  }

  renderToolbar(
    domProps,
    {
      gotoFirstPageIcon,
      start,
      end,
      totalCount,
      gotoLastPageIcon,
      currentPageInput,
      pageSizeCombo,
    }
  ) {
    return (
      <div {...domProps}>
        Showing {start} - {end} of {totalCount}. {gotoFirstPageIcon}{' '}
        {gotoLastPageIcon} {currentPageInput} {pageSizeCombo}
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
