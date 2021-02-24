/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function getSeparatorIndexes(children) {
  return children.reduce((acc, child, index) => {
    if (child === '-' || (child.props && child.props.isSeparator)) {
      acc.push(index);
    }
    return acc;
  }, []);
}

export default getSeparatorIndexes;
