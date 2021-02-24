/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var curry = require('./curry');
var matches;

module.exports = curry(function(selector, node) {
  matches = matches || require('../matches');

  while ((node = node.parentElement)) {
    if (matches.call(node, selector)) {
      return node;
    }
  }
});
