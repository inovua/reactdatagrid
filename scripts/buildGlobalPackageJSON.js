/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const chalk = require('chalk');
const resolve = require('path').resolve;
const packageJSON = require('../package.json');

function buildGlobalPackageJSON() {
  return new Promise((res, reject) => {
    const toDelete = ['devDependencies', 'scripts', 'private'];
    toDelete.forEach(key => delete packageJSON[key]);

    packageJSON.repository = {
      type: 'git',
      url: 'https://github.com/inovua/datagrid.git',
    };

    const content = JSON.stringify(packageJSON, null, 2);
    const path = resolve(__dirname, '..', 'lib', 'package.json');
    fs.writeFile(path, content, 'utf8', err => {
      if (err) {
        console.log(chalk.red(err));
        reject(err);
      } else {
        console.log(
          'DONE building package.json with version ',
          chalk.green(packageJSON.version)
        );
        res(true);
      }
    });
  });
}

buildGlobalPackageJSON();

module.exports = buildGlobalPackageJSON;
