/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const pify = require('pify');
const exec = require('child_process').exec;
const path = require('path');

function buildGlobalIndex() {
  const srcIndexPath = path.resolve(__dirname, '../src/index.js');
  const libIndexPath = path.resolve(__dirname, '../lib/index.js');
  const command = `BABEL_ENV=production babel ${srcIndexPath} --out-file ${libIndexPath}`;
  return pify(exec)(command);
}

module.exports = buildGlobalIndex;
