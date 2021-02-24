/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * This function MUTATES cellProps.
 *
 * Since it is called when we have `groupBy` on the grid, for all group rows, it needs to be very
 * performant and return as soon as possible.
 */
export default (cellProps, rowProps, summaryProps) => {
    const { position } = summaryProps;
    return cellProps;
};
