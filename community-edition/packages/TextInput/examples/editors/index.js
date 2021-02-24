/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';

import TextInput from '../../src';
import '../../style/index.scss';

import TextArea from '../../../TextArea';
import '../../../TextArea/style/index.scss';

import NumericInput from '../../../NumericInput';
import '../../../NumericInput/style/index.scss';

import DateInput from '../../../Calendar/DateInput';
import '../../../Calendar/style/index.scss';

import ComboBox from '../../../ComboBox';
import '../../../ComboBox/style/index.scss';
import countries from '../../../ComboBox/examples/default/countries';

class EditorsExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textInputValue: 'Text',
      textAreaValue: 'Content',
      numericInputValue: '2345',

      dateInputValue: '12-12-2017',
      comboValue: 'Albania',
      acceptClearToolFocus: false,
    };
  }
  render() {
    return (
      <div style={{ margin: 30 }}>
        <div style={{ marginBottom: 20 }}>
          <input
            type="checkbox"
            checked={this.state.acceptClearToolFocus}
            onChange={ev =>
              this.setState({ acceptClearToolFocus: ev.target.checked })
            }
          />
          acceptClearToolFocus
        </div>
        <table>
          <tbody>
            <tr>
              <td>TextInput:</td>
              <td>
                <TextInput
                  style={{ width: 230 }}
                  value={this.state.textInputValue}
                  onChange={textInputValue => this.setState({ textInputValue })}
                  acceptClearToolFocus={this.state.acceptClearToolFocus}
                />
              </td>
            </tr>
            <tr>
              <td>TextArea:</td>
              <td>
                <TextArea
                  style={{ height: 200, width: 230 }}
                  value={this.state.textAreaValue}
                  onChange={textAreaValue => this.setState({ textAreaValue })}
                />
              </td>
            </tr>
            <tr>
              <td>NumericInput:</td>
              <td>
                <NumericInput
                  style={{ width: 230 }}
                  value={this.state.numericInputValue}
                  onChange={numericInputValue =>
                    this.setState({ numericInputValue })
                  }
                  acceptClearToolFocus={this.state.acceptClearToolFocus}
                />
              </td>
            </tr>
            <tr>
              <td>DateInput:</td>
              <td>
                <DateInput
                  dateFormat="DD-MM-YYYY hh:mm:ss"
                  style={{ width: 230 }}
                  text={this.state.dateInputValue}
                  onTextChange={dateInputValue =>
                    this.setState({ dateInputValue })
                  }
                  showClock
                />
              </td>
            </tr>
            <tr>
              <td>ComboBox:</td>
              <td>
                <ComboBox
                  inlineFlex
                  dataSource={countries}
                  style={{ width: 230 }}
                  value={this.state.comboValue}
                  onChange={comboValue => this.setState({ comboValue })}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default EditorsExample;
