/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const pify = require('pify');
const fsExtra = require('fs-extra');
const exec = require('child_process').exec;
const globby = require('globby');

const excludeFolders = {
  styles: true,
  examples: true,
};
function buildComponentLib(compName) {
  if (!compName) {
    throw 'No component name specified! You should use --module=CompName.';
  }
  const modulePath = path.resolve(__dirname, '../src/', compName);

  const modulePathStyle = path.resolve(modulePath, 'style');
  const moduleLibPath = path.resolve(__dirname, '..', 'lib', compName);

  const folders = fsExtra.readdirSync(modulePath).filter(file => {
    if (file in excludeFolders) {
      // exclude the style folder
      return false;
    }
    const p = path.resolve(modulePath, file);
    return fsExtra.lstatSync(p).isDirectory();
  });

  const promises = folders.map(folder => {
    const command = `BABEL_ENV=production babel --ignore "src/DataGrid/**/node_modules/**/*.js" --out-dir ${path.resolve(
      moduleLibPath,
      folder
    )} ${path.resolve(modulePath, folder)}`;
    return pify(exec)(command);
  });

  return Promise.all(promises)
    .then(data => {
      // build index & other js files

      const list = globby.sync('**.js', { cwd: modulePath });
      const promises = list.map(file => {
        const command = `BABEL_ENV=production babel --ignore "src/DataGrid/**/node_modules/**/*.js" ${modulePath}/${file} --out-file ${moduleLibPath}/${file}`;
        return pify(exec)(command);
      });

      const outputModulePathStyle = path.resolve(moduleLibPath, 'style');

      if (fsExtra.existsSync(modulePathStyle)) {
        promises.push(
          fsExtra.emptyDir(outputModulePathStyle).then(() => {
            return fsExtra.copy(modulePathStyle, outputModulePathStyle);
          })
        );
      }

      return Promise.all(promises);
    })
    .catch(err => console.log(err));
}

module.exports = buildComponentLib;
