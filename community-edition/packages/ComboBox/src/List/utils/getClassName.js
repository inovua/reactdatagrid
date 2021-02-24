/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import join from '../../utils/join';

function getClassName({ props, state = {} }) {
  const {
    listPosition,
    data = [],
    className,
    theme,
    rootClassName,
    loading,
    relativeToViewport,
  } = props;

  const { succesfullPosition } = state;

  let constructedClassName = join(
    rootClassName,
    className,
    listPosition && `${rootClassName}--${listPosition}`,
    loading && `${rootClassName}--loading`,
    theme && `${rootClassName}--theme-${theme}`,
    relativeToViewport && `${rootClassName}--relative-to-viewport`,
    data && !data.length && `${rootClassName}--empty`
  );

  if (succesfullPosition) {
    const positionName = succesfullPosition === 'bc-tc' ? 'top' : 'bottom';
    constructedClassName = join(
      constructedClassName,
      `${rootClassName}--position-${positionName}`
    );
  }

  return constructedClassName;
}

export default getClassName;
