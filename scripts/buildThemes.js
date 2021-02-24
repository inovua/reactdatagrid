/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * - [ ] create in themes/variants/[theme]/index a file that imports default theme and with the folowing variables
 * - [ ] create script to delete themes
 * - [ ]
 */

const themes = require('./themes');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const pify = require('pify');
const exec = require('child_process').exec;
const buildStyle = require('../theme-builder/buildStyle');

const snakeCase = require('snake-case');

function camelCaseToUnderScore(str) {
  return snakeCase(str).toUpperCase();
}

function themeFileTemplate(config) {
  const componentName = config.componentName;
  const themeName = config.themeName;
  const primaryColor = config.primaryColor;
  const secondaryColor = config.secondaryColor;

  const componentNameUnderscore = camelCaseToUnderScore(componentName);
  return `
$INOVUA_${componentNameUnderscore}_THEME_NAME: ${themeName};
$INOVUA_${componentNameUnderscore}_MAIN_COLOR: ${primaryColor};
$INOVUA_${componentNameUnderscore}_SECONDARY_COLOR: ${secondaryColor};

@import '../../default/index.scss'
`;
}

function cleanThemeVariants(componentName) {
  const themesFolderPath = path.resolve(
    __dirname,
    '../src/',
    componentName,
    'style/theme',
    'variants'
  );

  return pify(exec)(`rm -rf ${themesFolderPath}`)
    .then(rez => {
      console.log(`Clean variants theme folder for ${componentName} complete.`);
    })
    .catch(err => {
      console.log(err);
    });
}

function createThemeFiles(componentName) {
  const themesFolderPath = path.resolve(
    __dirname,
    '../src/',
    componentName,
    'style/theme',
    'variants'
  );

  // create theme folder if it doesn't exist
  mkdirp(themesFolderPath, res => {
    // create theme file for each theme
    const themebuildPromise = Object.keys(themes).map(themeName => {
      const theme = themes[themeName];
      const themePath = path.resolve(themesFolderPath, themeName);

      return new Promise((resolve, reject) => {
        // create theme folder inside /variants
        mkdirp(themePath, () => {
          const filePath = path.resolve(themePath, 'index.scss');
          content = themeFileTemplate({
            componentName,
            themeName,
            primaryColor: theme.primary,
            secondaryColor: theme.secondary,
          });

          // write scss file inside folder
          fs.writeFile(filePath, content, 'utf8', err => {
            if (err) {
              console.error(err);
              process.exitCode = 1;
              reject(err);
            }

            const input = filePath;
            const output = path.resolve(
              __dirname,
              '../lib',
              componentName,
              'theme',
              `${themeName}.css`
            );

            // translate scss to css
            buildStyle(input, output).then(() => {
              console.log('Compiled theme: ', themeName);
              resolve(true);
            });
          });
        });
      });
    });

    const themeCssFileContents = Promise.all(themebuildPromise).then(() => {
      // remove variants folder
      cleanThemeVariants(componentName);

      // read all generated css files to generate all.css
      return (allCSSContents = Promise.all(
        Object.keys(themes).map(themeName => {
          const themeCssPath = path.resolve(
            __dirname,
            '../lib',
            componentName,
            'theme',
            `${themeName}.css`
          );
          return new Promise((resolve, reject) => {
            fs.readFile(themeCssPath, (err, data) => {
              if (err) {
                console.error(err);
                process.exitCode = 1;
                reject(err);
                return;
              }
              const dataString = data.toString();

              resolve(dataString);
            });
          });
        })
      ));
    });

    // concatenate all theme files and write them in all.css
    themeCssFileContents.then(list => {
      const content = list.join('');
      const filePath = path.resolve(
        __dirname,
        '../lib',
        componentName,
        'theme',
        'all.css'
      );
      fs.writeFile(filePath, content, 'utf8', err => {
        if (err) {
          console.error(err);
          process.exitCode = 1;
          return;
        }
        console.log(`${componentName} all.css complete`);
      });
    });
  });
}

module.exports = createThemeFiles;
