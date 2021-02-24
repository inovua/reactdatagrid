#!/usr/bin/env node

/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const argv = require('yargs')
  .options('module', {
    type: 'string',
  })
  .options('edition', {
    type: 'string',
  }).argv;

const prepare = require('../preparepackageJSON');

const theModule = argv.module;
const edition = argv.edition;

if (!theModule) {
  throw new Error('No module specified');
}

prepare(theModule, {
  edition: edition || 'community',
});
