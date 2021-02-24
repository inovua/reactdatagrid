/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, Dispatch, SetStateAction, useContext, Context } from 'react';

export default <T>(
  defaultValue: T,
  theContext: Context<{ state: any }>,
  name: string
): [T, Dispatch<SetStateAction<T>>] => {
  const context = useContext(theContext);
  if (context.state![name] !== undefined) {
    defaultValue = context.state![name];
  }
  const [value, setValue] = useState<T>(defaultValue);

  return [
    value,
    (newValue: SetStateAction<T>) => {
      if (typeof newValue === 'function') {
        newValue = (newValue as (prevState: T) => T)(value);
      }
      context.state![name] = newValue;

      setValue(newValue);
    },
  ];
};
