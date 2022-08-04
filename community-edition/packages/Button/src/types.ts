/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CSSProperties, ReactNode } from 'react';

export type TypeButtonStates = {
  disabled?: boolean;
  children?: any;
  active?: boolean;
  pressed?: boolean;
  over?: boolean;
  focused?: boolean;
  iconFirst?: boolean;
  rtl?: boolean;
  icon?: ReactNode | (() => ReactNode);
  ellipsis?: boolean;
  align?: 'start' | 'end' | 'center' | 'left' | 'right';
  verticalAlign?: 'top' | 'middle' | 'center' | 'bottom';
  wrap?: boolean;
  overflow?: boolean;
  iconPosition?: 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end';
};

export type TypeButtonProps = {
  children?: any;
  disabled?: boolean;

  isInovuaButton?: boolean;
  tagName?: string | (() => void);
  primary?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  tabIndex?: number;

  href?: string;
  align?: 'start' | 'end' | 'center' | 'left' | 'right';
  verticalAlign?: 'top' | 'middle' | 'center' | 'bottom';
  rtl?: boolean;
  wrap?: boolean;
  overflow?: boolean;
  activeState?: boolean;
  overState?: boolean;
  focusedState?: boolean;

  renderChildren?: (icon: ReactNode) => ReactNode;

  // icon
  icon?: ReactNode | ((buttonStates?: TypeButtonStates) => ReactNode);
  iconPosition?: 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end';

  // style
  style?: CSSProperties | ((props: TypeButtonProps, buttonStates: any) => void);

  disabledStyle?: CSSProperties;
  focusedStyle?: CSSProperties;
  pressedStyle?: CSSProperties;
  overStyle?: CSSProperties;
  activeStyle?: CSSProperties;

  // classnames
  className?: string;
  activeClassName?: string;
  overClassName?: string;
  focusedClassName?: string;
  disabledClassName?: string;
  pressedClassName?: string;

  // misc
  theme?: string;
  rootClassName?: string;
  ellipsis?: boolean;

  // events
  onClick?: (event?: MouseEvent | KeyboardEvent) => void;
  onFocus?: (event?: FocusEvent) => void;
  onBlur?: (event?: FocusEvent) => void;
  onToggle?: (pressed?: boolean) => void;
  onMouseEnter?: (event?: MouseEvent) => void;
  onMouseUp?: (event?: MouseEvent) => void;
  onMouseDown?: (event?: MouseEvent) => void;
  onDeactivate?: (event?: MouseEvent) => void;
  onMouseLeave?: (event?: MouseEvent) => void;
  onActivate?: (event?: MouseEvent) => void;
  onKeyDown?: (event?: KeyboardEvent) => void;

  showWarnings?: boolean;
};

export type TypeButtonState = {
  mouseOver: boolean;
  active: boolean;
  pressed?: boolean;
  focused?: boolean;
};
