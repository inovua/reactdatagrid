/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const exec = childProcess.exec;
const execSync = childProcess.execSync;
const buildStyle = require('./buildStyle');
const mkdirp = require('mkdirp');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function buildComponentStyle(inputPath, outputPath) {
  // build index and base

  inputPath = path.resolve(process.cwd(), inputPath);
  outputPath = path.resolve(process.cwd(), outputPath);

  if (!fs.existsSync(inputPath)) {
    console.error('Input path does not exist');
    return;
  }

  mkdirp(outputPath);

  ['base.scss', 'index.scss'].forEach(file => {
    const compSCSS = path.resolve(path.join(inputPath, file));
    const outFile = path.resolve(
      path.join(outputPath, `${file.split('.')[0]}.css`)
    );
    buildStyle(compSCSS, outFile);
  });

  mkdirp(`${outputPath}/theme`, err => {
    if (err) {
      console.warn(err);
    }
    // build themes
    const themeFolder = `${inputPath}/theme`;
    const themes = getDirectories(path.resolve(themeFolder));

    themes.forEach(themeName => {
      const themeFolder = `${outputPath}/theme`;
      const input = path.resolve(
        path.join(inputPath, 'theme', themeName, 'index.scss')
      );
      const output = path.resolve(path.join(themeFolder, `${themeName}.css`));
      buildStyle(input, output);
    });
  });
}

module.exports = buildComponentStyle;
