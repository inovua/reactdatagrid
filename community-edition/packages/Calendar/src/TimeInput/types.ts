/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeCaretPosition } from '../DateFormatInput/types';
import { DateType } from '../toMoment';

export { TypeCaretPosition };

export type TypeRange = { start: number; end?: number };

export type TypeTimeInputProps = {
  theme?: string;
  circular?: boolean;
  propagate?: boolean;
  incrementNext?: boolean;
  format?: string;
  value?: string;
  defaultValue?: string;
  valueRange?: number;
  timeFormat?: string;
  separator?: string;
  meridiem?: string | boolean;
  children?: any;
  date?: DateType;
  onKeyDown?: (event: KeyboardEvent) => void;
  onChange?: (value?: string) => void;
};

export type TypeTimeInputState = {
  valueRange?: number;
  separator?: string;
  hours24?: boolean;
  meridiem?: string | boolean;
  value?: string;
  now?: number;
  minutes?: string;
};
