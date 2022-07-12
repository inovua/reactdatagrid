import { CSSProperties, ReactNode, RefObject } from 'react';

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
  onResize?: (size: { width: number; height: number }) => void;
};

type TypeArrowScrollerProps = {
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
  onHasScrollChange?: (hasScroll: boolean) => void;
  renderScroller?: ({
    domProps,
    direction,
  }: {
    domProps: {
      ref: (ref: ReactNode) => void;
      key: string;
      disabled: boolean;
      className: string;
      onClick?: (direction?: -1 | 1) => void;
      onDoubleClick?: (direction: -1 | 1) => void;
      onMouseDown?: (direction: -1 | 1) => void;
      onTouchStart?: (direction: -1 | 1) => void;
      onTouchEnd?: (direction: -1 | 1) => void;
      onMouseEnter?: (direction: -1 | 1) => void;
      onMouseLeave?: (direction: -1 | 1) => void;
      children?: any;
    };
    direction: -1 | 1;
  }) => void;
  arrowHeight?: number;
  arrowWidth?: number;
  style?: CSSProperties;
  ref?: RefObject<HTMLDivElement>;
};

type TypeArrowScrollerState = {
  scrolling?: boolean;
  activeScroll?: number;
  hasScroll?: boolean;
};

export { TypeArrowScrollerProps, TypeArrowScrollerState, TypeSize };
