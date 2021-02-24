/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const pify = require('pify');
const exec = require('child_process').exec;

function copyThemesList() {
  const themesPath = path.resolve(__dirname, 'themes.js');
  const libPath = path.resolve(__dirname, '../', 'lib');
  const command = `cp ${themesPath} ${libPath}`;
  return pify(exec)(command);
}

module.exports = copyThemesList;
