/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type TypeRange = { start: number; end?: number };

export type TypeConfig = { currentValue: number; key: string; dir: -1 | 1 };

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
  ) => { value: string; caretPos?: any };
  handlePageUp?: (
    format: TypeFormat,
    config: TypeConfig
  ) => { value: string; caretPos?: any };
  handlePageDown?: (
    format: TypeFormat,
    config: TypeConfig
  ) => { value: string; caretPos?: any };
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
    caretPos?: any;
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

export type TypeDateFormatInputProps = {
  dateFormat: string;
  defaultValue?: string;
  isDateInput?: boolean;
  rootClassName?: string;
  theme?: string;
  stopPropagation?: boolean;
  updateOnWheel?: boolean;
  value?: (props: TypeDateFormatInputProps, propName: string) => void;
  changeDelay?: number;
  minDate?: string;
  maxDate?: string;
  locale?: string;
};

export type TypeDateFormatInputState = {
  // positions,
  // matches,
  // propsValue: props.value !== undefined,
  // value: defaultValue,
  // minDate,
  // maxDate,
};
