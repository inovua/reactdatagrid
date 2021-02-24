/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from '../../../../common/assign';
import toTimeValue from './toTimeValue';
import leftPad from '../utils/leftPad';
import {
  clampHour,
  clampMinute,
  clampSecond,
  clampNamed,
} from '../utils/clamp';

const removeAt = ({ value, index, len = 1 }) => {
  return value.substring(0, index) + value.substring(index + len);
};

const replaceAt = ({ value, index, len = 1, str }) => {
  return value.substring(0, index) + str + value.substring(index + len);
};

const replaceBetween = ({ value, start, end, str }) => {
  return (value.substring(0, start) || '') + str + (value.substring(end) || '');
};

const toggleMeridiem = meridiem => {
  return {
    am: 'pm',
    AM: 'PM',
    pm: 'am',
    PM: 'pm',
  }[meridiem];
};

const getValueOnDelete = ({ oldValue, range, key, separator, meridiem }) => {
  const { start, end } = range;

  const selectedValue = oldValue.substring(start, end);

  let value;

  if (selectedValue) {
    const replacement = selectedValue
      .split('')
      .map(c => {
        if (c == separator || c == ' ') {
          return c;
        }

        if (meridiem && c * 1 != c) {
          return c == 'p' ? 'a' : c == 'P' ? 'A' : c;
        }

        return 0;
      })
      .join('');

    value = replaceBetween({ value: oldValue, start, end, str: replacement });

    return {
      value,
      update: value != oldValue,
      caretPos: key == 'Backspace' ? start : end,
    };
  }

  const back = key == 'Backspace';
  const index = start + (back ? -1 : 0);
  const caretPos = start + (back ? -1 : 1);

  if (index < 0) {
    return {
      value: oldValue,
      update: false,
    };
  }

  const char = oldValue[index];

  value = oldValue;

  let replacement = char == separator || char == ' ' ? char : 0;

  if (char && char * 1 != char && replacement === 0 && meridiem) {
    if (char == 'p') {
      replacement = 'a';
    } else if (char == 'P') {
      replacement = 'A';
    } else if (char == 'M' || char == 'm' || char == 'a' || char == 'A') {
      replacement = char;
    }
  }

  value = replaceAt({ value: oldValue, index, str: replacement });

  return {
    update: value != oldValue,
    value,
    caretPos,
  };
};

const ARROWS = {
  ArrowUp: 1,
  ArrowDown: -1,
  PageUp: 10,
  PageDown: -10,
};

const TIME_PARTS = {
  24: [
    { start: 0, end: 2, name: 'hours', max: 23 },
    { start: 3, end: 5, name: 'minutes', max: 59 },
    { start: 6, end: 8, name: 'seconds', max: 59 },
  ],
  12: [
    { start: 0, end: 2, name: 'hours', max: 12, min: 1 },
    { start: 3, end: 5, name: 'minutes', max: 59 },
    { start: 6, end: 8, name: 'seconds', max: 59 },
  ],
};

const getActiveTimePartIndex = ({
  value,
  timeValue,
  separator,
  range,
  hours24,
  meridiem,
}) => {
  const { start } = range;
  const timeParts = TIME_PARTS[hours24 ? 24 : 12];

  let partIndex = 0;
  let currentPart;

  while ((currentPart = timeParts[partIndex])) {
    if (currentPart.name == 'seconds' && timeValue && !timeValue.seconds) {
      return 4; // the index of the meridiem
    }
    if (start >= currentPart.start && start <= currentPart.end) {
      return partIndex;
    }

    partIndex++;
  }

  return 4;
};

const getTimePartAt = (index, { hours24 }) => {
  return assign({}, TIME_PARTS[hours24 ? 24 : 12][index]);
};

const getActiveTimePart = ({
  value,
  timeValue,
  separator,
  range,
  hours24,
  meridiem,
}) => {
  const index = getActiveTimePartIndex({
    value,
    timeValue,
    separator,
    range,
    hours24,
  });

  if (index == 4 && meridiem) {
    const timePart = {
      start: 6,
      end: 8,
      name: 'meridiem',
    };

    if (timeValue.seconds) {
      timePart.start += 3;
      timePart.end += 3;
    }

    return timePart;
  }

  return getTimePartAt(index, { hours24 });
};

const getValueOnDirection = ({
  oldValue,
  range,
  separator,
  dir,
  incrementNext,
  circular,
  propagate,
  hours24,
  meridiem,
}) => {
  const { start, end } = range;

  let value;

  const timeValue = toTimeValue({ value: oldValue, separator, meridiem });
  const activeTimePart = getActiveTimePart({
    value: oldValue,
    timeValue,
    separator,
    range,
    hours24,
    meridiem,
  });

  if (activeTimePart.name != 'meridiem') {
    timeValue[activeTimePart.name] = dir + timeValue[activeTimePart.name] * 1;
  }

  let { hours, minutes, seconds } = timeValue;

  let toggleMeridiemValue = false;

  hours *= 1;
  minutes *= 1;

  if (seconds) {
    seconds *= 1;
  }

  if (activeTimePart.name != 'meridiem') {
    if (seconds && (seconds > 59 || seconds < 0)) {
      if (propagate) {
        minutes += seconds > 59 ? 1 : -1;
      }

      if (circular) {
        seconds %= 60;

        if (seconds < 0) {
          seconds = 60 + seconds;
        }
      }
    }

    if (minutes && (minutes > 59 || minutes < 0)) {
      if (propagate) {
        hours += minutes > 59 ? 1 : -1;
      }

      if (circular) {
        minutes %= 60;

        if (minutes < 0) {
          minutes = 60 + minutes;
        }
      }
    }

    if (meridiem && circular && (hours > 12 || hours < 1)) {
      toggleMeridiemValue = true;
    }
  }

  hours = leftPad(
    clampHour(hours * 1, {
      circular,
      max: activeTimePart.max,
      min: activeTimePart.min,
    })
  );
  minutes = leftPad(clampMinute(minutes * 1, { circular }));

  if (seconds != undefined) {
    seconds = leftPad(clampSecond(seconds * 1, { circular }));
  }

  value = hours + separator + minutes;

  if (seconds) {
    value += separator + seconds;
  }

  if (activeTimePart.name == 'meridiem') {
    toggleMeridiemValue = true;
  }

  if (meridiem) {
    value += ` ${
      toggleMeridiemValue
        ? toggleMeridiem(timeValue.meridiem)
        : timeValue.meridiem
    }`;
  }

  return {
    value,
    caretPos: activeTimePart || range.start,
    update: oldValue != value,
  };
};

const getValueOnNumber = ({
  oldValue,
  num,
  range,
  separator,
  circular,
  hours24,
  meridiem,
}) => {
  const activeTimePartIndex = getActiveTimePartIndex({
    value: oldValue,
    separator,
    range,
    hours24,
  });
  let activeTimePart = getTimePartAt(activeTimePartIndex, { hours24 });

  if (
    activeTimePart &&
    range.start == range.end &&
    activeTimePart.end == range.end
  ) {
    activeTimePart = getTimePartAt(activeTimePartIndex + 1, { hours24 });
  }

  if (!activeTimePart) {
    return {
      value,
      update: false,
    };
  }

  const name = activeTimePart.name;
  const timeParts = toTimeValue({ value: oldValue, separator, meridiem });

  const timePartValue = `${timeParts[name]}`;

  let caretPos;

  if (range.start <= activeTimePart.start) {
    const maxFirstChar = `${activeTimePart.max}`.charAt(0) * 1;

    caretPos =
      range.start +
      (num > maxFirstChar ? 3 : range.start < activeTimePart.start ? 2 : 1);
    timeParts[name] =
      num > maxFirstChar ? `0${num}` : num + timeParts[name].charAt(1);
  } else {
    caretPos = range.start + 2;
    timeParts[name] = clampNamed(
      name,
      replaceAt({ value: timePartValue, index: 1, str: num }) * 1,
      { circular }
    );
  }

  let { hours, minutes, seconds } = timeParts;

  let value = hours + separator + minutes;

  if (seconds) {
    value += separator + seconds;
  }

  if (meridiem) {
    value += ` ${timeParts.meridiem}`;
  }

  return {
    value,
    caretPos,
    update: true,
  };
};

export default function({
  oldValue,
  range,
  event,
  separator = ':',
  incrementNext,
  circular,
  propagate,
  hours24,
  meridiem,
}) {
  const newChar = String.fromCharCode(event.which);
  const { start, end } = range;
  const { key } = event;

  if (key == 'Delete' || key == 'Backspace') {
    return getValueOnDelete({
      key,
      oldValue,
      range,
      separator,
      meridiem,
    });
  }

  const dir = ARROWS[key];

  if (dir) {
    return getValueOnDirection({
      hours24,
      meridiem,
      dir,
      oldValue,
      range,
      circular,
      propagate,
      separator,
      incrementNext,
    });
  }

  if (key == 'Unidentified' && newChar * 1 == newChar) {
    return getValueOnNumber({
      num: newChar * 1,
      circular,
      separator,
      oldValue,
      range,
      meridiem,
    });
  }

  return { value: oldValue };
}
