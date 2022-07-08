import { CSSProperties, RefObject } from 'react';

type TypeSize = {
  width?: number;
  height?: number;
};

type TypeScrollSpringConfig = {
  stiffness: number;
  damping: number;
};

type TypeScrollContainerProps = {
  viewStyle?: CSSProperties;
  nativeScroll?: any;
  onResize?: Function;
};

type TypeProps = {
  arrowSize?: number | TypeSize;
  theme?: string;
  className?: string;
  scrollOnClick?: boolean;
  childProps?: object;
  scrollOnMouseEnter?: boolean;
  vertical?: boolean;
  notifyResizeDelay?: number;
  scrollStep?: number;
  scrollSpeed?: number;
  mouseoverScrollSpeed?: number;
  scrollSpringConfig?: TypeScrollSpringConfig;
  nativeScroll?: boolean;
  scrollIntoViewOffset?: number;
  scroller?: 'auto' | boolean;
  rootClassName?: string;
  rtl?: boolean;
  scrollContainerProps?: TypeScrollContainerProps;
  useTransformOnScroll?: boolean;
  onHasScrollChange?: Function;
  renderScroller?: Function;
  arrowHeight?: number;
  arrowWidth?: number;
  style?: CSSProperties;
  ref?: RefObject<HTMLDivElement>;
};

type TypeState = {
  scrolling?: boolean;
  activeScroll?: number;
  hasScroll?: boolean;
};

export { TypeProps, TypeState, TypeSize };
