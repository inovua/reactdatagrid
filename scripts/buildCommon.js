/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const exec = require('child_process').exec;
const pify = require('pify');

function buildCommon() {
  const commonPath = path.resolve(__dirname, '..', 'src', 'common');
  const libCommonPath = path.resolve(__dirname, '..', 'lib', 'common');
  const command = `BABEL_ENV=production babel --out-dir ${libCommonPath} ${commonPath}`;
  return pify(exec)(command);
}

module.exports = buildCommon;
