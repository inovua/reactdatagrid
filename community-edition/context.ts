/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { TypeComputedProps } from './types';

const DataGridContext = React.createContext<TypeComputedProps | null>(null);

export const Provider = DataGridContext.Provider;
export const Consumer = DataGridContext.Consumer;

export default DataGridContext;
