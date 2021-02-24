/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import NumberField from '../src/NumberInput';
import '../style/index.scss';
import './index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 56,
      enableSpinnerTools: true,
      enableClearButton: true,
      size: 18,
    };
  }

  onChange(value) {
    this.setState({
      value,
    });
  }

  render() {
    return (
      <div className="App" style={{ padding: 10 }}>
        Uncontrolled:{' '}
        <NumberField
          ref={numberInput => (this.numberInput = numberInput)}
          enableSpinnerTools={this.state.enableSpinnerTools}
          enableClearButton={this.state.enableClearButton}
        />{' '}
        Controlled:{' '}
        <NumberField
          ref={numberInput => (this.numberInput = numberInput)}
          spinOnArrowKeys
          enableSpinnerTools={this.state.enableSpinnerTools}
          enableClearButton={this.state.enableClearButton}
          stepOnWheel
          allowFloat
          shiftStep={10}
          toolPosition="start"
          step={1}
          clearButtonSize={this.state.size * 1}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
        />
        <br />
        <br />
        Wrapper props:{' '}
        <NumberField
          ref={numberInput => (this.numberInput = numberInput)}
          spinOnArrowKeys
          enableSpinnerTools={this.state.enableSpinnerTools}
          enableClearButton={this.state.enableClearButton}
          stepOnWheel
          defaultValue={56}
          onChange={value => console.log('value ', value, typeof value)}
          wrapperProps={{
            style: { border: '1px solid red' },
            onClick: () => console.log('click!'),
          }}
        />{' '}
        Normal NumericInput:{' '}
        <NumberField
          ref={numberInput => (this.numberInput = numberInput)}
          spinOnArrowKeys
          enableSpinnerTools={this.state.enableSpinnerTools}
          enableClearButton={this.state.enableClearButton}
          stepOnWheel
          defaultValue={56}
          clearButtonClassName="clear-button-class"
          onChange={value => console.log('value ', value, typeof value)}
        />
        <br />
        <br />
        <button
          onMouseDown={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.startSpin(1, {
              step: 0.1,
            });
          }}
          onMouseUp={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.stopSpin();
          }}
        >
          +0.1
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.startSpin(1, {
              step: 1,
            });
          }}
          onMouseUp={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.stopSpin();
          }}
        >
          +1
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.startSpin(1, {
              step: 10,
            });
          }}
          onMouseUp={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.stopSpin();
          }}
        >
          +10
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.startSpin(1, {
              step: -0.1,
            });
          }}
          onMouseUp={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.stopSpin();
          }}
        >
          -0.1
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.startSpin(1, {
              step: -1,
            });
          }}
          onMouseUp={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.stopSpin();
          }}
        >
          -1
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.startSpin(1, {
              step: -10,
            });
          }}
          onMouseUp={event => {
            event.preventDefault();
            event.stopPropagation();
            this.numberInput.stopSpin();
          }}
        >
          -10
        </button>
        <br />
        <br />
        <input
          type="checkbox"
          checked={this.state.enableSpinnerTools}
          onChange={e =>
            this.setState({
              enableSpinnerTools: e.target.checked,
            })
          }
        />
        enableSpinnerTool
        <br />
        <input
          type="checkbox"
          checked={this.state.enableClearButton}
          onChange={e =>
            this.setState({
              enableClearButton: e.target.checked,
            })
          }
        />
        enableClearButton
        <br />
        ClearButtonSize:{' '}
        <input
          style={{ width: 50 }}
          type="number"
          value={this.state.size}
          onChange={ev => this.setState({ size: ev.target.value })}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
