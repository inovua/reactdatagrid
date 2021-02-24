/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const exec = require('child_process').exec;
const pify = require('pify');

const fsExtra = require('fs-extra');
const buildComponentStyle = require('./buildComponentStyle');

const excludes = ['examples'];
function buildPackages() {
  const packagesPath = path.resolve(__dirname, '..', 'src', 'packages');

  const libPackagesPath = path.resolve(__dirname, '..', 'lib', 'packages');
  const command = `BABEL_ENV=production babel --out-dir ${libPackagesPath} ${packagesPath}`;

  return pify(exec)(command).then(() => {
    const folders = fsExtra
      .readdirSync(packagesPath)
      .map(file => {
        const p = path.resolve(packagesPath, file);
        const isDir = fsExtra.lstatSync(p).isDirectory();

        const cmpName = file;

        if (!isDir) {
          return false;
        }

        excludes.forEach(exclude => {
          const pathToDelete = path.resolve(libPackagesPath, cmpName, exclude);
          console.log({
            pathToDelete,
          });
          if (fsExtra.pathExistsSync(pathToDelete)) {
            fsExtra.removeSync(pathToDelete);
          }
        });

        return 'packages' + (path.sep + cmpName);
      })
      .filter(x => x);

    folders.map(folder => {
      buildComponentStyle(folder);
    });
  });
}

module.exports = buildPackages;
