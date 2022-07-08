/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type Position = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type Dimensions = {
  width?: number;
  height?: number;
};

export type Rectangle = Position & Dimensions;

export type RegionType = ((this: any, ...args: any) => Region) & {
  init?: () => void;
  validate?: (region: Region) => boolean;
  getDocRegion?: () => Region;
  from?: (reg: any) => Region;
  fromDOM?: (dom: Element) => Region;
  fromEvent?: (event: MouseEvent) => Region;
  fromPoint?: ({ x, y }: { x: number; y: number }) => Region;
  getIntersection?: (first: Region, second: Region) => boolean;
  getIntersectionWidth?: (first: Region, second: Region) => number;
  getIntersectionHeight?: (first: Region, second: Region) => number;
  getIntersectionArea?: (first: Region, second: Region) => Rectangle | boolean;
  getUnion?: (first: Region, second: Region) => Region;
  getRegion?: (reg: any) => Region;
};

export interface PointPositions {
  cy: 'YCenter';
  cx: 'XCenter';
  t: 'Top';
  tc: 'TopCenter';
  tl: 'TopLeft';
  tr: 'TopRight';
  b: 'Bottom';
  bc: 'BottomCenter';
  bl: 'BottomLeft';
  br: 'BottomRight';
  l: 'Left';
  lc: 'LeftCenter';
  r: 'Right';
  rc: 'RightCenter';
  c: 'Center';
}

export type PointPositionsValue =
  | 'cy'
  | 'cx'
  | 't'
  | 'tc'
  | 'tl'
  | 'tr'
  | 'b'
  | 'bc'
  | 'bl'
  | 'br'
  | 'l'
  | 'lc'
  | 'r'
  | 'rc'
  | 'c';

export type Region = {
  prototype: any;
  0?: number;
  1?: number;
  top?: any;
  right?: number;
  bottom?: number;
  left?: number;
  width?: number;
  height?: number;
  emitChangeEvents?: boolean;
  getRegion: (clone: boolean) => Region;
  setRegion: (reg: Region) => Region;
  validate: () => boolean;
  _before: () => Region | undefined;
  _after: (before?: Region) => void;
  notifyPositionChange: () => void;
  emitPositionChange: () => void;
  notifySizeChange: () => void;
  emitSizeChange: () => void;
  add: (directions: Position) => Region;
  substract: (directoins: Position) => Region;
  getSize: () => Dimensions;
  setPosition: (position: Position) => Region;
  setSize: (size: Dimensions) => Region;
  setWidth: (width: number) => Region;
  setHeight: (height: number) => Region;
  set: (directions?: Rectangle) => Region;
  get: (dir?: 1 | 0) => Region | undefined;
  shift: (directions: Position) => Region;
  unshift: (directions: Position) => Region;
  equals: (region: Region) => boolean;
  equalsSize: (size: Region) => boolean;
  equalsPosition: (region: Region) => boolean;
  addLeft: (left: number) => Region;
  addTop: (top: number) => Region;
  addBottom: (bottom: number) => Region;
  addRight: (right: number) => Region;
  minTop: () => Region;
  maxBottom: () => Region;
  minLeft: () => Region;
  maxRight: () => Region;
  expand: (directions: Position, region?: Region) => Region;
  clone: () => Region;
  getIntersection: (region: Region) => Region;
  containsPoint: (x: any, y: number) => boolean;
  containsRegion: (region: Region) => boolean;
  diffHeight: (region: Region) => Position;
  diffWidth: (region: Region) => Position;
  diff: (
    region: Region,
    directions: {
      top?: boolean;
      bottom?: boolean;
      left?: boolean;
      right?: boolean;
    }
  ) => Position;
  getPosition: () => Position;
  getPoint: (
    position: PointPositionsValue,
    asLeftTop: boolean
  ) => { x: number; y: number } | { left: number; top: number };
  getPointYCenter: () => { x: null; y: number };
  getPointXCenter: () => { x: number; y: null };
  getPointTop: () => { x: null; y: number };
  getPointTopCenter: () => { x: number; y: number };
  getPointTopLeft: () => { x?: number; y: number };
  getPointTopRight: () => { x?: number; y: number };
  getPointBottom: () => { x: null; y?: number };
  getPointBottomCenter: () => { x?: number; y?: number };
  getPointBottomLeft: () => { x?: number; y?: number };
  getPointBottomRight: () => { x?: number; y?: number };
  getPointLeft: () => { x?: number; y: null };
  getPointLeftCenter: () => { x?: number; y: number };
  getPointRight: () => { x?: number; y: null };
  getPointRightCenter: () => { x?: number; y: number };
  getPointCenter: () => { x: number; y: number };
  getHeight: () => number;
  getWidth: () => number;
  getTop: () => number;
  getLeft: () => number;
  getBottom: () => number;
  getRight: () => number;
  getArea: () => number;
  __IS_REGION: boolean;
  emit?: (eventName: string, instance: Region) => void;
};
