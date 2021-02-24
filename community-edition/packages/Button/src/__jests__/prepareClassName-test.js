/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import prepareClassName from '../prepareClassName';

describe('prepareClassName', () => {
  it('adds disabled className', () => {
    expect(prepareClassName({ disabled: true })).toContain('disabled');
    expect(
      prepareClassName({ disabled: true }, { disabledClassName: 'test' })
    ).toContain('test');
  });
  it('adds wrap className', () => {
    expect(prepareClassName({ wrap: true })).toContain('--wrap');
    expect(prepareClassName({ wrap: false })).toContain('--nowrap');
    expect(prepareClassName({ wrap: undefined })).not.toContain('wrap');
  });
  it('adds verticalAlign className', () => {
    expect(prepareClassName({ verticalAlign: 'middle' })).toContain(
      '--vertical-align-middle'
    );
    expect(prepareClassName({ verticalAlign: 'top' })).toContain(
      '--vertical-align-top'
    );
  });
  it('adds active className', () => {
    expect(prepareClassName({ active: true })).toContain('active');
    expect(
      prepareClassName({ active: true }, { activeClassName: 'test' })
    ).toContain('test');
  });
  it('adds pressed className', () => {
    expect(prepareClassName({ pressed: true })).toContain('pressed');
    expect(
      prepareClassName({ pressed: true }, { pressedClassName: 'test' })
    ).toContain('test');
  });
  it('adds over className', () => {
    expect(prepareClassName({ over: true })).toContain('over');
    expect(
      prepareClassName({ over: true }, { overClassName: 'test' })
    ).toContain('test');
  });
  it('adds focused className', () => {
    expect(prepareClassName({ focused: true })).toContain('focused');
    expect(
      prepareClassName({ focused: true }, { focusedClassName: 'test' })
    ).toContain('test');
  });
});
