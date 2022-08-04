/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const clamp = (
  value: number,
  {
    min,
    max,
    circular = true,
  }: {
    min?: number;
    max?: number;
    circular?: boolean;
  }
): number | undefined => {
  return value < min!
    ? circular
      ? max
      : min
    : value > max!
    ? circular
      ? min
      : max
    : value;
};

export const clampHour = (
  value: number,
  {
    max,
    min,
    circular,
  }: {
    min?: number;
    max?: number;
    circular?: boolean;
  }
): number | undefined => {
  return clamp(value, { min: min || 0, max: max || 23, circular });
};

export const clampMinute = (
  value: number,
  { circular }: { circular?: boolean }
): number | undefined => {
  return clamp(value, { min: 0, max: 59, circular });
};

export const clampSecond = (
  value: number,
  { circular }: { circular?: boolean }
): number | undefined => {
  return clamp(value, { min: 0, max: 59, circular });
};

type TypeMap = {
  second: (
    value: number,
    { min, max, circular }: { min?: number; max?: number; circular?: boolean }
  ) => number | undefined;
  seconds: (
    value: number,
    { min, max, circular }: { min?: number; max?: number; circular?: boolean }
  ) => number | undefined;
  minute: (
    value: number,
    { min, max, circular }: { min?: number; max?: number; circular?: boolean }
  ) => number | undefined;
  minutes: (
    value: number,
    { min, max, circular }: { min?: number; max?: number; circular?: boolean }
  ) => number | undefined;
  hour: (
    value: number,
    { min, max, circular }: { min?: number; max?: number; circular?: boolean }
  ) => number | undefined;
  hours: (
    value: number,
    { min, max, circular }: { min?: number; max?: number; circular?: boolean }
  ) => number | undefined;
};

const MAP: TypeMap = {
  second: clampSecond,
  seconds: clampSecond,
  minute: clampMinute,
  minutes: clampMinute,
  hour: clampHour,
  hours: clampHour,
};

export const clampNamed = (
  name: string,
  value: number,
  { circular, max, min }: { circular?: boolean; max?: number; min?: number }
) => {
  return MAP[name as keyof TypeMap](value, { circular, max, min });
};

export default clamp;
