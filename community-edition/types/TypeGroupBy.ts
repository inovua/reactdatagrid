/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MouseEventHandler, CSSProperties, ReactNode } from 'react';

type TypeDOMProps = {
  onMouseDown: MouseEventHandler<SVGSVGElement>;
  onClick: MouseEventHandler<SVGSVGElement>;
  style: CSSProperties;
};

export type TypeGroupTool = ({
  domProps,
  size,
  rtl,
}: {
  domProps: TypeDOMProps;
  size: number;
  rtl: boolean | undefined;
}) => ReactNode;

export type TypeGroupBy = string[] | null | undefined;

export default TypeGroupBy;
