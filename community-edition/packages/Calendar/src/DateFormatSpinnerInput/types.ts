/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReactNode } from 'react';
import { DateType } from '../toMoment';

export type TypeDateFormatSpinnerInputProps = {
  rootClassName?: string;
  className?: string;
  firstStepDelay?: number;
  secondStepDelay?: number;
  stepDelay?: number;
  changeDelay?: number;
  theme?: string;
  disabled?: boolean;
  arrowSize?: number;
  isDateInput?: boolean;
  stopPropagation?: boolean;
  updateOnWheel?: boolean;

  value?: DateType;

  size?: { width: number; height: number };
  minDate?: string;
  maxDate?: string;
  tabIndex?: number;
  dateFormat?: string;

  onKeyDown?: (event: KeyboardEvent) => void;
  onChange?: (event: KeyboardEvent) => void;
  renderArrows?: (props: TypeDateFormatSpinnerInputProps) => ReactNode;

  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
};

export type TypeDateFormatSpinnerInputState = {
  focused?: boolean;
};
