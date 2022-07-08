/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReactNode } from 'react';

type TypeProps = {
  ResizeObserver?: any;
  onResize?: ({ width, height }: { width?: number; height?: number }) => void;
  onObserverResize?: (entries: any[]) => void; // only called when native resizeobserver is available
  useNativeIfAvailable?: boolean;
  onMount?: (instance?: any) => void;
  useWillChange?: boolean;
  useRaf?: boolean;
  notifyOnMount?: boolean;
  notifyResizeDelay?: number;
  checkResizeDelay?: number;
  measureSize?: (
    node: ReactNode,
    notifyResize: ReactNode
  ) => { width?: number; height?: number };
  rafOnResize?: boolean;
  shouldComponentUpdate?: (
    nextProps: TypeProps,
    props: TypeProps,
    nextState: TypeState,
    state: TypeState
  ) => boolean;
};

type TypeState = {
  notifyResizeWidth?: number;
  notifyResizeHeight?: number;

  expandToolWidth?: number;
  expandToolHeight?: number;

  contractToolWidth?: number;
  contractToolHeight?: number;
};

export { TypeProps, TypeState };
