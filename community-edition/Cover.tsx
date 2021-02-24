/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import join from './packages/join';

export default ({
  handle,
}: {
  handle: ({
    setActive,
    setCursor,
  }: {
    setActive: Dispatch<SetStateAction<boolean>>;
    setCursor: Dispatch<SetStateAction<string>>;
  }) => void;
}) => {
  const [active, setActive] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string>('inherit');

  useEffect(() => {
    handle({ setActive, setCursor });
  }, []);

  return (
    <div
      style={{
        opacity: active ? 1 : 0,
        cursor: active ? cursor || 'inherit' : 'inherit',
      }}
      className={join(
        `InovuaReactDataGrid__cover`,
        active && `InovuaReactDataGrid__cover--active`
      )}
    />
  );
};
