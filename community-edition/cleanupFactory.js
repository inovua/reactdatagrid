/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default Cmp => {
  const propsToDelete = Object.keys(Cmp.propTypes);

  return props => {
    propsToDelete.forEach(propName => {
      delete props[propName];
    });
    return props;
  };
};
