/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import cleanProps from '@inovua/reactdatagrid-community/packages/react-clean-props';
import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';
const BoolEditor = props => {
    const domProps = cleanProps(props, BoolEditor.propTypes);
    return (React.createElement("div", Object.assign({ className: `InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--bool ${domProps.className ||
            ''}` }, domProps),
        React.createElement(CheckBox, { theme: props.theme, autoFocus: props.autoFocus, defaultChecked: props.value, onChange: props.onChange, onBlur: props.onComplete, onKeyDown: e => {
                if (e.key == 'Tab') {
                    e.preventDefault();
                    props.onTabNavigation(true, e.shiftKey ? -1 : 1);
                }
            } })));
};
BoolEditor.propTypes = {
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    onComplete: PropTypes.func,
    onKeyDown: PropTypes.func,
    onTabNavigation: PropTypes.func,
    value: PropTypes.any,
};
export default BoolEditor;
