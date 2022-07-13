/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Moment, DateType } from '../toMoment';

export type TypeRange = { start: number; end?: number };

export type TypeConfig = { currentValue: number; key: string; dir: -1 | 1 };

export type TypeCaretPosition = { start?: number; end?: number };

export type TypeSuggestions = {
  Y: string[];
  M: string[];
  D: string[];
  H: string[];
  h: string[];
  k: string[];
  m: string[];
  s: string[];
};

export type TypeFormat = {
  min?: number;
  max?: number;
  start?: number;
  end?: number;
  time?: boolean;
  upper?: boolean;
  default?: string;
  length?: number;
  handleDelete?: (
    format: TypeFormat,
    {
      range,
      currentValue,
      dir,
    }: {
      range: TypeRange;
      currentValue: string | number | undefined;
      dir: -1 | 1;
    }
  ) => void;
  handleBackspace?: (
    format: TypeFormat,
    config: {
      range: TypeRange;
      currentValue: string | number | undefined;
      dir: -1 | 1;
    }
  ) => void;
  handleArrow?: (
    format: TypeFormat,
    { currentValue, key, dir }: TypeConfig
  ) => { value: string; caretPos?: boolean };
  handlePageUp?: (
    format: TypeFormat,
    config: TypeConfig
  ) => { value: string; caretPos?: boolean };
  handlePageDown?: (
    format: TypeFormat,
    config: TypeConfig
  ) => { value: string; caretPos?: boolean };
  handleUnidentified?: (
    format: TypeFormat,
    {
      event,
      currentValue,
      range,
    }: {
      event: MouseEvent;
      currentValue: string;
      range: TypeRange;
    }
  ) => {
    preventDefault?: boolean;
    value: string | number | undefined;
    caretPos?: TypeCaretPosition;
  };
};

export type TypeFormats = {
  YYYY: TypeFormat;
  MM: TypeFormat;
  DD: TypeFormat;
  HH: TypeFormat;
  H: TypeFormat;
  kk: TypeFormat;
  k: TypeFormat;
  hh: TypeFormat;
  h: TypeFormat;
  a: TypeFormat;
  A: TypeFormat;
  mm: TypeFormat;
  ss: TypeFormat;
};

export type TypeKeyDownEvent = {
  key: string | number;
  type: string;
  stopPropagation: () => void;
  preventDefault: () => void;
  which?: number;
};

export type TypeDateFormatInputProps = {
  dateFormat: string;
  defaultValue?: DateType;
  isDateInput?: boolean;
  rootClassName?: string;
  theme?: string;
  stopPropagation?: boolean;
  updateOnWheel?: boolean;
  value?: DateType; // ((props: TypeDateFormatInputProps, propName: string) => void) | Date;
  changeDelay?: number;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  className?: string;
  cleanup?: (props: TypeDateFormatInputProps) => void;

  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onWheel?: (event: MouseEvent) => void;
  onKeyDown?: (event: TypeKeyDownEvent, currentPosition: string) => boolean;
  afterKeyDown?: (config: {
    currentPosition: any;
    preventDefault?: boolean;
    event: TypeKeyDownEvent;
    value?: string;
    stop: boolean;
  }) => void;
  onChange?: (value: DateType, { dateMoment }: { dateMoment: Moment }) => void;
};

export type TypeDateFormatInputState = {
  positions?: string[];
  matches?: string[];
  propsValue?: boolean;
  value?: DateType;
  minDate?: Moment | null;
  maxDate?: Moment | null;
  focused?: boolean;
};
