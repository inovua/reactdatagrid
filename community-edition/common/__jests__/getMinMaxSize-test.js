/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getMinMaxSize from '../getMinMaxSize';

describe('getMinMaxSize', () => {
  it('constructs correct config object with single value', () => {
    expect(
      getMinMaxSize({
        minSize: 20,
      })
    ).toEqual({
      minWidth: 20,
      minHeight: 20,
    });

    expect(
      getMinMaxSize({
        maxSize: 20,
      })
    ).toEqual({
      maxWidth: 20,
      maxHeight: 20,
    });

    expect(
      getMinMaxSize({
        maxSize: 20,
        minSize: 22,
      })
    ).toEqual({
      maxWidth: 20,
      maxHeight: 20,
      minWidth: 22,
      minHeight: 22,
    });
  });

  it('constructs correct config object with one key set', () => {
    expect(
      getMinMaxSize({
        minSize: { width: 20, height: 22 },
      })
    ).toEqual({
      minWidth: 20,
      minHeight: 22,
    });

    expect(
      getMinMaxSize({
        minSize: { width: 20 },
      })
    ).toEqual({
      minWidth: 20,
    });

    expect(
      getMinMaxSize({
        maxSize: { width: 20, height: 22 },
      })
    ).toEqual({
      maxWidth: 20,
      maxHeight: 22,
    });

    expect(
      getMinMaxSize({
        maxSize: { width: 20, height: 22 },
        minSize: { width: 21, height: 24 },
      })
    ).toEqual({
      maxWidth: 20,
      maxHeight: 22,
      minWidth: 21,
      minHeight: 24,
    });
  });
});
