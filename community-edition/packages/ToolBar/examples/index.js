/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import 'typeface-roboto';

import ToolBar, { Separator } from '../src';
import '../style/index.scss';

import ResizableContainer from './ResizableContainer';
import {
  newButton,
  iconButton,
  deleteButton,
  settingsButton,
  menuButton,
  undoButton,
  redoButton,
  mailButton,
  combo,
  separator,
} from './toolbarChildrens';

class App extends Component {
  render() {
    return (
      <div>
        <div>
          <div style={{ marginBottom: 20 }}>
            overflowStategy:{' '}
            <select
              value={this.state.strategy}
              onChange={ev => this.setState({ strategy: ev.target.value })}
            >
              <option value="scroll">scroll</option>
              <option value="dropdown">dropdown</option>
            </select>
          </div>
          <ResizableContainer width={'70vw'}>
            {!this.state.clear ? (
              <ToolBar
                constrainTo={true}
                overflowStrategy={this.state.strategy}
                ref={ref => (this.toolbar = ref)}
              >
                <button
                  onClick={() => {
                    this.setState({
                      newButton: true,
                    });
                  }}
                >
                  Add new
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      clear: true,
                    });
                  }}
                >
                  clear
                </button>
                {newButton}
                {iconButton}
                {deleteButton}
                {combo}
                {separator}
                {settingsButton}
                {menuButton}
                {separator}
                {undoButton}
                {redoButton}
                {this.state.newButton && (
                  <button style={{ minWidth: 200 }}>This is a new item</button>
                )}
              </ToolBar>
            ) : null}
          </ResizableContainer>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
