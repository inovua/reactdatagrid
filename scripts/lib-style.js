/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const themeBuilder = require('./theme-builder');

const path = require('path');
const inputPath = path.resolve(__dirname, '../community-edition/style');
const outputPath = path.resolve(__dirname, '../lib/community-edition');

themeBuilder(inputPath, outputPath);
