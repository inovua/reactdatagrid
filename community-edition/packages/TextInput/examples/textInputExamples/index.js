/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';

import TextInput from '../../src';
import '../../style/index.scss';
import '../../../NumericInput/style/index.scss';

class TextInputExamples extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableSpinnerTools: true,
      enableClearButton: true,
      toolPosition: false,
      size: 20,
      theValue: 'Text',
      value: 68,
      rtl: false,
      minLength: 10,
      maxLength: 20,
      readOnly: false,
      disabled: false,
      hidden: false,
      clearButtonSize: 10,
      clearButtonColor: '#495e85',
      setPlaceholder: true,
    };
  }

  onChange(value) {
    this.setState({
      value,
    });
  }

  render() {
    return (
      <div className="TextInputExamples" style={{ padding: 30 }}>
        <h1>TextInput configurator</h1>
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>
            rtl:
            <input
              type="checkbox"
              checked={this.state.rtl}
              onChange={ev => this.setState({ rtl: ev.target.checked })}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            readOnly:
            <input
              type="checkbox"
              checked={this.state.readOnly}
              onChange={ev => this.setState({ readOnly: ev.target.checked })}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            disabled:
            <input
              type="checkbox"
              checked={this.state.disabled}
              onChange={ev => this.setState({ disabled: ev.target.checked })}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            hidden:
            <input
              type="checkbox"
              checked={this.state.hidden}
              onChange={ev => this.setState({ hidden: ev.target.checked })}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            enableClearButton:
            <input
              type="checkbox"
              checked={this.state.enableClearButton}
              onChange={ev =>
                this.setState({ enableClearButton: ev.target.checked })
              }
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            Placeholder:
            <input
              type="checkbox"
              checked={this.state.setPlaceholder}
              onChange={ev =>
                this.setState({ setPlaceholder: ev.target.checked })
              }
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            size:
            <input
              style={{ width: 80 }}
              type="number"
              value={this.state.size}
              onChange={ev => this.setState({ size: ev.target.value })}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            minLength:
            <input
              style={{ width: 80 }}
              type="number"
              value={this.state.minLength}
              onChange={ev => this.setState({ minLength: ev.target.value })}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            maxLength:
            <input
              style={{ width: 80 }}
              type="number"
              value={this.state.maxLength}
              onChange={ev => this.setState({ maxLength: ev.target.value })}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            clearButtonColor:
            <input
              style={{ width: 80 }}
              type="color"
              value={this.state.clearButtonColor}
              onChange={ev =>
                this.setState({ clearButtonColor: ev.target.value })
              }
            />
          </div>
        </div>
        <div>
          <TextInput
            rtl={this.state.rtl}
            autoFocus
            style={{ width: 120 }}
            required
            minLength={this.state.minLength * 1}
            maxLength={this.state.maxLength * 1}
            readOnly={this.state.readOnly}
            disabled={this.state.disabled}
            hidden={this.state.hidden}
            enableClearButton={this.state.enableClearButton}
            onKeyDown={e => {
              console.log(e.key);
            }}
            clearButtonColor={this.state.clearButtonColor}
            placeholder={this.state.setPlaceholder ? 'Placeholder' : null}
            value={this.state.theValue}
            onChange={v => {
              console.log(v);
              this.setState({ theValue: v });
            }}
            stopChangePropagation={false}
            inputProps={{
              value: this.state.theValue,
              onChange: v => this.setState({ theValue: v }),
            }}
          />
        </div>
      </div>
    );
  }
}

export default TextInputExamples;
