/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import equal from '../../packages/shallowequal';
export default (inst, nextProps, nextState) => {
    const props = inst.props;
    const state = inst.state;
    if (nextProps.shouldComponentUpdate) {
        return nextProps.shouldComponentUpdate({
            nextProps,
            props,
            nextState,
            state,
        });
    }
    return !equal(nextProps, props) || !equal(nextState, state);
};
