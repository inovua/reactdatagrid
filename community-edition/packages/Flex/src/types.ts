/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CSSProperties } from 'react';

type TypeProps = {
  shouldComponentUpdate?: ({
    nextProps,
    props,
    nextState,
    state,
  }: {
    nextProps: TypeProps;
    props: TypeProps;
    nextState: TypeState;
    state: TypeState;
  }) => boolean;
  flex?: string | number | boolean;

  display?: 'flex' | 'inline-flex';
  inline?: boolean;
  reverse?: boolean;
  row?: boolean;
  column?: boolean;
  wrap?: boolean;
  alignItems?: string;
  alignContent?: string;
  justifyContent?: string;
  disabled?: boolean;
  className?: string;
  factory?: any;
  children?: any;
  style?: any;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  innerRef?: any;
  alignSelf?: string;
  flexFlow?: string;
};

type TypeState = {};
type TypeItemState = {};

type TypeItemProps = {
  shouldComponentUpdate?: (
    instance: any,
    nextProps: TypeProps,
    nextState: TypeState
  ) => boolean;
  flex?: string | number | boolean;
  display?: 'flex' | 'inline-flex';
  inline?: boolean;
  flexGrow?: any;
  flexShrink?: any;
  flexBasis?: any;
  onClick?: any;
  onMouseDown?: any;
  className?: string;
  factory?: any;
  children?: any;
  style?: CSSProperties;
  alignSelf?: string;
  flexFlow?: string;
};

export { TypeProps, TypeItemProps, TypeState, TypeItemState };
