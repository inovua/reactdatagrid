/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeProps } from './types';

export default (props: TypeProps) =>
  props.flex === false ? 0 : props.flex === true ? 1 : props.flex;
