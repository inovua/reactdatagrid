/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const pify = require('pify');
const fs = require('fs');
const path = require('path');

const withFiles = files => {
  const compPaths = files.map(fileName => {
    const compDirPath = path.resolve('./src', fileName);
    if (!fs.lstatSync(compDirPath).isDirectory()) {
      return null;
    }

    // all are componets besides common
    return (
      fileName !== 'common' &&
      fileName !== 'CustomComponent' &&
      fileName !== 'material' &&
      fileName !== 'packages' &&
      fileName !== 'app'
    );
    fileName: null;
  });

  return Promise.all(compPaths);
};

function getComponentNames() {
  const srcFiles = pify(fs.readdir)('./src').then(withFiles);
  const srcMaterialFiles = pify(fs.readdir)('./src/material').then(withFiles);

  return srcFiles.then(files1 => {
    return srcMaterialFiles.then(files2 => {
      return files1
        .concat(files2.map(file => `./material/${file}`))
        .filter(compName => compName);
    });
  });
}

module.exports = getComponentNames;
