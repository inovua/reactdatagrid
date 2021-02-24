/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeRowSelection, TypeCellSelection } from '../../types';
import { IColumn } from '../../types/TypeColumn';

import { TypeOnSelectionChangeArg } from '../../types/TypeDataGridProps';

export type TypeSelectedProps = {
  onSelectionChange?: (config: TypeOnSelectionChangeArg) => void;
  selected?: TypeRowSelection;
  defaultSelected?: TypeRowSelection;
  enableSelection?: boolean;
  cellSelection?: TypeCellSelection;
  checkboxColumn?: boolean | IColumn;
  multiSelect?: boolean;
  unselected?: TypeBoolMap;
  defaultUnselected?: TypeBoolMap;
};

export type TypeBoolMap = { [key: string]: boolean };
