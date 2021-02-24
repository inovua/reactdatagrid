/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const rimraf = require('rimraf');
const path = require('path');
const exec = require('child_process').exec;
const fs = require('fs');
const pify = require('pify');
const buildGlobalPackageJSON = require('./buildGlobalPackageJSON');
const buildComponentLib = require('./buildComponentLib');
const buildGlobalIndex = require('./buildGlobalIndex');
const getComponentNames = require('./getComponentNames');
const buildComponentStyle = require('./buildComponentStyle');
const cleanGlobalLib = require('./cleanGlobalLib');
const buildCommon = require('./buildCommon');
const buildPackages = require('./buildPackages');
const copyThemesList = require('./copyThemesList');

function buildComponent(compName) {
  return buildComponentLib(compName).then(() => buildComponentStyle(compName));
}

const MODULE_NAME = process.env.npm_config_module;
if ('ALL' === MODULE_NAME) {
  cleanGlobalLib()
    .then(() => getComponentNames())
    .then(componentNames => componentNames.map(buildComponent))
    .then(buildGlobalIndex)
    .then(buildCommon)
    .then(buildPackages)
    .then(buildGlobalPackageJSON)
    // .then(copyThemesList)
    .catch(err => console.log(err));
} else {
  buildComponent(MODULE_NAME);
}
