/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useContext } from 'react';
import isControlledValue from '../utils/isControlledValue';
import toUpperFirst from '../utils/toUpperFirst';

const emptyFn = (): void => {};

const useProperty = <T>(
  props: any,
  propName: string,
  defaultValue?: any | undefined,
  config?: { onChange: (value: T, ...args: any[]) => void }
): [T, (...args: any[]) => any] => {
  const context = useContext(props.context);

  const PropName = toUpperFirst(propName);

  let defaultValueFromProps = props[`default${PropName}`];

  let defaultValueFromRestoredState = context.state![propName];

  if (defaultValueFromRestoredState !== undefined) {
    defaultValueFromProps = defaultValueFromRestoredState;
  }

  defaultValue =
    defaultValueFromProps === undefined ? defaultValue : defaultValueFromProps;

  const [stateValue, setStateProperty] = useState<T>(defaultValue);

  let value: T = props[propName];
  const controlled: boolean = isControlledValue(value);

  const onChange =
    config && config.onChange
      ? config.onChange
      : props[`on${PropName}Change`] || emptyFn;
  let setter = (value: T, ...args: any[]): void => {
    context.state![propName] = value;
    if (!controlled) {
      setStateProperty(value);
    }
    onChange(value, ...args);
  };

  if (!controlled) {
    value = stateValue;
  }

  return [value, setter];
};

export default useProperty;
