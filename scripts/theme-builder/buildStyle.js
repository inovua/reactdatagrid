/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const sass = require('sass');
const fs = require('fs');
const path = require('path');

/**
 * All imports use the forward slash as a directory
 * delimeter. This function converts to the filesystem's
 * delimeter if it uses an alternate.
 **/
function makeFsPath(importPath) {
  var fsPath = importPath;
  if (path.sep !== '/') {
    fsPath = fsPath.replace(/\//, path.sep);
  }
  return fsPath;
}

const nodeModulePaths = path.resolve(
  process.env.NODE_MODULES_PATH || path.resolve(process.cwd(), 'node_modules')
);

function buildStyle(inputFile, outputFile) {
  const cache = {};
  return new Promise((resolve, reject) => {
    sass.render(
      {
        outputFile: outputFile,
        file: inputFile,
        importer: (url, prev, done) => {
          const fromNodeModules = !!url.startsWith('~');

          let file = path.resolve(path.dirname(prev), makeFsPath(url));

          if (fromNodeModules) {
            const parts = url.split(path.sep);

            file = parts.reduce((acc, part, index) => {
              if (index === 0) {
                part = part.slice(1);
              }
              return path.resolve(acc, part);
            }, nodeModulePaths);
          }

          const isCached = !!cache[file];

          // console.log('url', url);
          // console.log('file', file);
          // console.log('----');
          if (isCached) {
            done({
              contents: '',
            });
            return;
          }
          cache[file] = true;
          if (fromNodeModules) {
            done({
              file: file,
              // this is needed in order to inline the contents of css files, and not output @import(filename.css) in the resulting css
              contents: fs.readFileSync(file, 'utf8'),
            });
          } else {
            done({ file: url });
          }
        },
      },
      (err, result) => {
        if (err) {
          console.error(err.formatted);
          process.exitCode = 1;
        } else {
          fs.writeFile(outputFile, result.css, err => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log(`Style complete ${inputFile}.`);
              resolve(true);
            }
          });
        }
      }
    );
  });
}

module.exports = buildStyle;
