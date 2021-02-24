/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import matches from './matchesSelector';

const FOCUSABLE_SELECTOR =
  'input, select, textarea, button, object, a[href], [tabindex]';

export default element => {
  return matches(element, FOCUSABLE_SELECTOR);
};
