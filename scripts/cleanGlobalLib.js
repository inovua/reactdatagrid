/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const pify = require('pify');
const exec = require('child_process').exec;

function cleanGlobalLib() {
  const libPath = path.resolve(__dirname, '..', 'lib');
  // remove lib and create lib folder
  return pify(exec)(`rm -rf ${libPath}`).then(() =>
    pify(exec)(`mkdir ${libPath}`)
  );
}

module.exports = cleanGlobalLib;
