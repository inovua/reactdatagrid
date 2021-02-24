/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const resolve = path.resolve;
const fs = require('fs');
const writeFile = fs.writeFile;

module.exports = (modulePath, { edition }) => {
  const rootPackagePath = resolve(__dirname, '../package.json');
  const rootPackageJSON = require(rootPackagePath);

  const moduleFolder = resolve(__dirname, '../lib', modulePath);
  const moduleJSON = require(resolve(moduleFolder, './package.json'));

  const packageName = rootPackageJSON.name;

  const toDelete = [
    'devDependencies',
    'scripts',
    'private',
    'browserslist',
    'lint-staged',
    'stylelint',
  ];
  toDelete.forEach(key => delete moduleJSON[key]);

  moduleJSON.dependencies = moduleJSON.dependencies || {};

  // set correct version
  moduleJSON.version = rootPackageJSON.version;

  if (edition === 'enterprise') {
    moduleJSON.dependencies[packageName + '-community'] =
      rootPackageJSON.version;
    moduleJSON.license = 'SEE LICENSE IN LICENSE.md';
  } else {
    moduleJSON.license = 'MIT';
  }

  moduleJSON.name = packageName + '-' + edition;
  moduleJSON.versionTimestamp = Date.now();

  writeFile(
    resolve(moduleFolder, 'package.json'),
    JSON.stringify(moduleJSON, null, 2),
    'utf8',
    err => {
      if (err) {
        console.error(err);
        throw err;
      } else {
        console.log('Updated package.json with version ', moduleJSON.version);
      }
    }
  );
};
