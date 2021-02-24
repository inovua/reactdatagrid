/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DataGrid from '..';

const {
  isSelectionControlled,
  isSelectionEnabled: initialIsSelectionEnabled,
  isMultiSelect: initialIsMultiSelect,
  isSelectionEmpty: initialIsSelectionEmpty,
  getSelected: initialGetSelected,
} = DataGrid.prototype;

const SELF = { state: {}, isSelectionControlled };

const isSelectionEnabled = props => {
  return initialIsSelectionEnabled.call(SELF, props);
};

SELF.isSelectionEnabled = isSelectionEnabled;

const getSelected = props => {
  return initialGetSelected.call(SELF, props);
};

SELF.getSelected = getSelected;

const isMultiSelect = props => {
  return initialIsMultiSelect.call(SELF, props);
};

SELF.isMultiSelect = isMultiSelect;

const isSelectionEmpty = props => {
  return initialIsSelectionEmpty.call(SELF, props);
};

SELF.isSelectionEmpty = isSelectionEmpty;

describe('selection', () => {
  describe('isSelectionControlled', () => {
    it('to be correct', () => {
      expect(isSelectionControlled({ selected: null })).to.equal(true);

      expect(isSelectionControlled({ selected: 1 })).to.equal(true);

      expect(isSelectionControlled({ selected: undefined })).to.equal(false);

      expect(isSelectionControlled({ defaultSelected: {} })).to.equal(false);
    });
  });

  describe('isSelectionEnabled', () => {
    it('to be correct', () => {
      expect(isSelectionEnabled({ enableSelection: true })).to.equal(true);

      expect(isSelectionEnabled({ selected: null })).to.equal(true);

      expect(isSelectionEnabled({ defaultSelected: null })).to.equal(true);

      expect(isSelectionEnabled({ defaultSelected: undefined })).to.equal(
        false
      );

      expect(
        isSelectionEnabled({ selected: undefined, defaultSelected: undefined })
      ).to.equal(false);
    });
  });

  describe('isSelectionControlled', () => {
    it('to be correct', () => {
      expect(isSelectionControlled({ selected: true })).to.equal(true);

      expect(isSelectionControlled({ selected: false })).to.equal(true);

      expect(isSelectionControlled({ enableSelection: true })).to.equal(false);

      expect(
        isSelectionControlled({ defaultSelected: {}, selected: {} })
      ).to.equal(true);

      expect(
        isSelectionControlled({ selected: null, defaultSelected: {} })
      ).to.equal(true);

      expect(isSelectionControlled({ defaultSelected: null })).to.equal(false);
    });
  });

  describe('isMultiSelect', () => {
    it('to be correct', () => {
      expect(isMultiSelect({ defaultSelected: {} })).to.equal(true);

      expect(isMultiSelect({ defaultSelected: 1, selected: {} })).to.equal(
        true
      );

      expect(isMultiSelect({ selected: null })).to.equal(false);

      expect(isMultiSelect({ defaultSelected: null })).to.equal(false);

      expect(isMultiSelect({ defaultSelected: {} })).to.equal(true);
    });
  });
});
