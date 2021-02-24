#!/usr/bin/env node

/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var builder = require('../index');

const INPUT_PATH = process.env.INPUT_PATH || './style';
const OUTPUT_PATH = process.env.OUTPUT_PATH || './';

builder(INPUT_PATH, OUTPUT_PATH);
