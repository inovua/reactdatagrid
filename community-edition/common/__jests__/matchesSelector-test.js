/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import matchesSelector from '../matchesSelector';

describe('matchesSelector', () => {
  it('returns true when it node matches a selector', () => {
    const fixture = `<div id="fixture1">
        <div id="target1" class="tooltip">
          target 1
        </div>
        <div id="target2" class="tooltip"> target 2 </div>
        <div id="target3"> target 3 </div>
        <div id="tooltip">
          Hello world from tooltip
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', fixture);

    const target = document.getElementById('target2');
    expect(matchesSelector(target, '.tooltip')).toBe(true);
    expect(matchesSelector(target, '.tooltip2')).toBe(false);

    document.body.removeChild(document.getElementById('fixture1'));
  });
});
