/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState, useEffect } from 'react';
import join from './packages/join';
export default ({ handle, }) => {
    const [active, setActive] = useState(false);
    const [cursor, setCursor] = useState('inherit');
    useEffect(() => {
        handle({ setActive, setCursor });
    }, []);
    return (React.createElement("div", { style: {
            opacity: active ? 1 : 0,
            cursor: active ? cursor || 'inherit' : 'inherit',
        }, className: join(`InovuaReactDataGrid__cover`, active && `InovuaReactDataGrid__cover--active`) }));
};
