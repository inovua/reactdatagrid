/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { unstable_batchedUpdates } from 'react-dom';
import { TypeBatchUpdateQueue } from '../types';

type TypeFnArray = (() => void)[];

export default () => {
  let commited = false;
  let fns: TypeFnArray | undefined = [];
  const queue: TypeBatchUpdateQueue = (fn: () => void) => {
    (fns as TypeFnArray).push(fn);
  };

  queue.commit = (extraFn?: () => void): Promise<boolean> => {
    if (commited) {
      return Promise.resolve(true);
    }
    commited = true;

    return new Promise(resolve => {
      unstable_batchedUpdates(() => {
        if (extraFn) {
          (fns as TypeFnArray).push(extraFn);
        }
        (fns as TypeFnArray).forEach(fn => fn());

        fns = undefined;
        resolve(true);
      });
    });
  };

  return queue;
};
