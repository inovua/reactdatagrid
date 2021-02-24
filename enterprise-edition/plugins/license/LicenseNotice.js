/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from 'react';
export default () => {
    const [closed, setClosed] = useState(false);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setClosed(true);
        }, 4000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
    if (closed) {
        return null;
    }
    return (React.createElement("div", { style: {
            background: '#e16565',
            color: 'black',
            padding: '1.5rem',
            fontSize: '1.25rem',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 100000,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        } },
        React.createElement("div", { style: { flex: 1, textAlign: 'center' } }, "UNLICENSED COPY - FOR EVALUATION USE ONLY"),
        React.createElement("svg", { width: 10, height: 10, viewBox: "0 0 10 10", style: { cursor: 'pointer' }, onClick: () => setClosed(true) },
            React.createElement("path", { fill: "none", stroke: "currentColor", fillRule: "evenodd", strokeLinecap: "round", strokeWidth: "1.33", d: "M1 1l8 8m0-8L1 9" }))));
};
