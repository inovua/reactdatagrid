/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const buildComponentStyle = require('./index');
const path = require('path');

const input = path.resolve(__dirname, 'test', 'style');

const output = path.resolve(__dirname, 'test', 'output');

buildComponentStyle(input, output);
