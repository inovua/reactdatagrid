/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import join from '../../../common/join';
import props2flex from './props2flex';
import prefix from './prefix';

const PREFIX = prefix;

export default props => {
  const column = !!props.column;
  const row = !column && !!props.row;
  const reverse = props.reverse ? '-reverse' : '';

  const flex = props2flex(props);

  const flexGrow = props.flexGrow;
  const flexShrink = props.flexShrink;
  const flexBasis = props.flexBasis;
  const display = props.inline ? 'inline-flex' : props.display;

  let className = join(
    props.className,
    props.alignItems ? `${PREFIX}--align-items-${props.alignItems}` : null,
    props.alignContent
      ? `${PREFIX}--align-content-${props.alignContent}`
      : null,
    props.justifyContent
      ? `${PREFIX}--justify-content-${props.justifyContent}`
      : null,
    props.wrap ? `${PREFIX}--wrap` : null,
    props.alignSelf ? `${PREFIX}--align-self-${props.alignSelf}` : null,
    row ? `${PREFIX}--row${reverse}` : null,
    column ? `${PREFIX}--column${reverse}` : null,
    // more like flex item related
    flex != null ? `${PREFIX}--flex-${flex}` : null,
    flexGrow != null ? `${PREFIX}--flex-grow-${flexGrow}` : null,
    flexShrink != null ? `${PREFIX}--flex-shrink-${flexShrink}` : null,
    flexBasis != null ? `${PREFIX}--flex-basis-${flexBasis}` : null,
    display != null ? `${PREFIX}--display-${display}` : null
  );

  return className;
};
