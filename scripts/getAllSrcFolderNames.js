/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const pify = require('pify');
const fs = require('fs');
const path = require('path');

function getAllSrcFolderNames() {
  return pify(fs.readdir)('./src')
    .then(files => {
      const compPaths = files.map(fileName => {
        const compDirPath = path.resolve('./src', fileName);
        if (!fs.lstatSync(compDirPath).isDirectory()) {
          return false;
        }
        return fileName;
      });

      return Promise.all(compPaths);
    })
    .then(data => data.filter(compName => compName));
}

module.exports = getAllSrcFolderNames;
