/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { unstable_batchedUpdates } from 'react-dom';
export default () => {
    let commited = false;
    let fns = [];
    const queue = (fn) => {
        fns.push(fn);
    };
    queue.commit = (extraFn) => {
        if (commited) {
            return Promise.resolve(true);
        }
        commited = true;
        return new Promise(resolve => {
            unstable_batchedUpdates(() => {
                if (extraFn) {
                    fns.push(extraFn);
                }
                fns.forEach(fn => fn());
                fns = undefined;
                resolve(true);
            });
        });
    };
    return queue;
};
